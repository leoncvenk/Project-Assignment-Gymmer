from pathlib import Path
import cv2 as cv
import numpy as np
import argparse
from uuid import uuid4
from PIL import Image, ImageOps
import json


DEFAULT_OUTPUT_DIR = Path("test-images/results_avatar")


def ensure_output_dir(output_dir: str | Path = DEFAULT_OUTPUT_DIR) -> Path:
    """
    Creates and returns the output directory for generated cartoon avatars.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    return output_path

def create_output_path(
    image_path: str | Path,
    output_dir: str | Path = DEFAULT_OUTPUT_DIR,
    suffix: str = "_cartoon",
) -> Path:
    """
    Creates a unique output path for the generated cartoon avatar.

    Example:
    burger.jpg -> burger_cartoon_ab12cd.png
    """
    input_path = Path(image_path)
    output_path = ensure_output_dir(output_dir)

    safe_stem = input_path.stem.replace(" ", "_")
    unique_id = uuid4().hex[:8]

    return output_path / f"{safe_stem}{suffix}_{unique_id}.png"

def load_image_rgb(image_path: str | Path) -> np.ndarray:
    """
    Safely loads an image, fixes EXIF orientation and converts it to RGB format.
    """
    input_path = Path(image_path)

    if not input_path.exists():
        raise FileNotFoundError(f"Input image was not found: {input_path}")

    try:
        image = Image.open(input_path)
        image = ImageOps.exif_transpose(image)
        image = image.convert("RGB")
        return np.array(image)
    except Exception as error:
        raise ValueError(f"Failed to load image: {error}") from error

def resize_image(image_rgb: np.ndarray, max_size: int = 512) -> np.ndarray:
    """
    Resizes the image so that the longest side is at most max_size pixels.
    Keeps the original aspect ratio.
    """
    height, width = image_rgb.shape[:2]

    longest_side = max(height, width)

    if longest_side <= max_size:
        return image_rgb

    scale = max_size / longest_side
    new_width = int(width * scale)
    new_height = int(height * scale)

    resized = cv.resize(
        image_rgb,
        (new_width, new_height),
        interpolation=cv.INTER_AREA,
    )

    return resized

def center_crop_square(image_rgb: np.ndarray) -> np.ndarray:
    """
    Crops the image to a centered square based on the shorter side.
    """
    height, width = image_rgb.shape[:2]

    crop_size = min(width, height)

    start_x = (width - crop_size) // 2
    start_y = (height - crop_size) // 2

    cropped = image_rgb[
        start_y:start_y + crop_size,
        start_x:start_x + crop_size,
    ]

    return cropped

def detect_largest_face_box(image_rgb: np.ndarray) -> tuple[int, int, int, int] | None:
    """
    Detects the largest frontal face in the image using OpenCV Haar Cascade.

    Returns:
    - (x, y, width, height) if a face is detected
    - None if no face is detected
    """
    gray_image = cv.cvtColor(image_rgb, cv.COLOR_RGB2GRAY)

    cascade_path = cv.data.haarcascades + "haarcascade_frontalface_default.xml"
    face_cascade = cv.CascadeClassifier(cascade_path)

    if face_cascade.empty():
        return None

    faces = face_cascade.detectMultiScale(
        gray_image,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60),
    )

    if len(faces) == 0:
        return None

    largest_face = max(faces, key=lambda face: face[2] * face[3])
    x, y, width, height = largest_face

    return int(x), int(y), int(width), int(height)


def crop_face_region(
    image_rgb: np.ndarray,
    padding_ratio: float = 0.75,
) -> tuple[np.ndarray, dict]:
    """
    Crops the image around the detected face.

    If no face is detected, it falls back to centered square crop.
    The crop is intentionally larger than the face so hair, ears and shoulders
    can still remain visible.
    """
    height, width = image_rgb.shape[:2]
    face_box = detect_largest_face_box(image_rgb)

    if face_box is None:
        fallback_crop = center_crop_square(image_rgb)
        crop_height, crop_width = fallback_crop.shape[:2]

        return fallback_crop, {
            "face_detected": False,
            "face_crop_used": False,
            "face_box": None,
            "face_crop_width": int(crop_width),
            "face_crop_height": int(crop_height),
        }

    x, y, face_width, face_height = face_box

    face_center_x = x + face_width // 2
    face_center_y = y + face_height // 2

    crop_size = int(max(face_width, face_height) * (1 + padding_ratio * 2))

    # Move crop center slightly down so neck/shoulders are included
    face_center_y = int(face_center_y + face_height * 0.25)

    start_x = max(face_center_x - crop_size // 2, 0)
    start_y = max(face_center_y - crop_size // 2, 0)
    end_x = min(start_x + crop_size, width)
    end_y = min(start_y + crop_size, height)

    # Correct crop if it hits image border
    start_x = max(end_x - crop_size, 0)
    start_y = max(end_y - crop_size, 0)

    cropped = image_rgb[start_y:end_y, start_x:end_x]
    cropped = center_crop_square(cropped)

    crop_height, crop_width = cropped.shape[:2]

    return cropped, {
        "face_detected": True,
        "face_crop_used": True,
        "face_box": {
            "x": int(x),
            "y": int(y),
            "width": int(face_width),
            "height": int(face_height),
        },
        "face_crop_width": int(crop_width),
        "face_crop_height": int(crop_height),
    }

def simplify_background(
    image_rgb: np.ndarray,
    background_color: tuple[int, int, int] = (235, 235, 235),
) -> tuple[np.ndarray, dict]:
    """
    Simplifies the background using GrabCut foreground extraction.

    The likely foreground (face/head/shoulders) is preserved,
    while the background is replaced with a flat solid color.
    """
    height, width = image_rgb.shape[:2]

    # GrabCut expects BGR
    image_bgr = cv.cvtColor(image_rgb, cv.COLOR_RGB2BGR)

    mask = np.zeros((height, width), np.uint8)

    # Rectangle a little inside the borders
    rect_margin_x = max(int(width * 0.08), 8)
    rect_margin_y = max(int(height * 0.08), 8)

    rect = (
        rect_margin_x,
        rect_margin_y,
        width - 2 * rect_margin_x,
        height - 2 * rect_margin_y,
    )

    bg_model = np.zeros((1, 65), np.float64)
    fg_model = np.zeros((1, 65), np.float64)

    try:
        cv.grabCut(
            image_bgr,
            mask,
            rect,
            bg_model,
            fg_model,
            5,
            cv.GC_INIT_WITH_RECT,
        )
    except cv.error:
        return image_rgb.copy(), {
            "background_simplified": False,
            "background_method": "grabcut_failed",
            "background_color": background_color,
        }

    # probable/definite foreground -> 1, background -> 0
    foreground_mask = np.where(
        (mask == cv.GC_FGD) | (mask == cv.GC_PR_FGD),
        255,
        0
    ).astype("uint8")

    # Clean mask a little
    kernel = np.ones((5, 5), np.uint8)
    foreground_mask = cv.morphologyEx(foreground_mask, cv.MORPH_OPEN, kernel)
    foreground_mask = cv.morphologyEx(foreground_mask, cv.MORPH_CLOSE, kernel)
    foreground_mask = cv.GaussianBlur(foreground_mask, (5, 5), 0)

    background = np.full_like(image_rgb, background_color, dtype=np.uint8)

    alpha = foreground_mask.astype(np.float32) / 255.0
    alpha = np.stack([alpha, alpha, alpha], axis=-1)

    blended = (
        image_rgb.astype(np.float32) * alpha
        + background.astype(np.float32) * (1.0 - alpha)
    ).astype(np.uint8)

    return blended, {
        "background_simplified": True,
        "background_method": "grabcut_rect",
        "background_color": {
            "r": int(background_color[0]),
            "g": int(background_color[1]),
            "b": int(background_color[2]),
        },
    }

def preprocess_avatar_image(image_rgb: np.ndarray, max_size: int = 512) -> tuple[np.ndarray, dict]:
    """
    Prepares the image for cartoon avatar generation.

    Steps:
    - resize image while preserving aspect ratio
    - crop the resized image to a centered square
    - return the processed image and metadata
    """
    original_height, original_width = image_rgb.shape[:2]

    resized_image = resize_image(image_rgb, max_size=max_size)
    resized_height, resized_width = resized_image.shape[:2]

    cropped_image, face_metadata = crop_face_region(resized_image)
    cropped_height, cropped_width = cropped_image.shape[:2]

    background_metadata = {
        "background_simplified": False,
        "background_method": "disabled",
    }

    metadata = {
        "original_width": int(original_width),
        "original_height": int(original_height),
        "resized_width": int(resized_width),
        "resized_height": int(resized_height),
        "cropped_width": int(cropped_width),
        "cropped_height": int(cropped_height),
        **face_metadata,
        **background_metadata,
    }

    return cropped_image, metadata

def apply_bilateral_smoothing(
    image_rgb: np.ndarray,
    diameter: int = 9,
    sigma_color: int = 100,
    sigma_space: int = 100,
    repeats: int = 3,
    median_kernel_size: int = 5,
) -> np.ndarray:
    """
    Stronger smoothing for a flatter avatar-like appearance.
    Repeats bilateral filtering multiple times and finishes with median blur.
    """
    smoothed = image_rgb.copy()

    for _ in range(repeats):
        smoothed = cv.bilateralFilter(
            smoothed,
            diameter,
            sigma_color,
            sigma_space,
        )

    smoothed = cv.medianBlur(smoothed, median_kernel_size)

    return smoothed

def enhance_image_for_cartoon(
    image_rgb: np.ndarray,
    saturation_scale: float = 1.20,
    value_contrast: float = 1.12,
) -> np.ndarray:
    """
    Slightly boosts saturation and brightness contrast before quantization,
    so important regions become more visually separated.
    """
    hsv = cv.cvtColor(image_rgb, cv.COLOR_RGB2HSV).astype(np.float32)

    hsv[:, :, 1] = np.clip(hsv[:, :, 1] * saturation_scale, 0, 255)
    hsv[:, :, 2] = np.clip((hsv[:, :, 2] - 128) * value_contrast + 128, 0, 255)

    enhanced_rgb = cv.cvtColor(hsv.astype(np.uint8), cv.COLOR_HSV2RGB)
    return enhanced_rgb

def quantize_colors(
    image_rgb: np.ndarray,
    color_count: int = 5,
    lightness_boost: float = 1.20,
    chroma_boost: float = 1.45,
    round_step: int = 10,
) -> np.ndarray:
    """
    Quantizes the image in LAB color space and exaggerates the cluster centers
    so the final colors are more separated and more 'vector-like'.
    """
    image_lab = cv.cvtColor(image_rgb, cv.COLOR_RGB2LAB)
    pixel_values = image_lab.reshape((-1, 3)).astype(np.float32)

    criteria = (
        cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER,
        40,
        0.2,
    )

    _compactness, labels, centers = cv.kmeans(
        pixel_values,
        color_count,
        None,
        criteria,
        5,
        cv.KMEANS_PP_CENTERS,
    )

    centers = centers.astype(np.float32)

    mean_center = np.mean(centers, axis=0)

    # Increase separation between light/dark regions
    centers[:, 0] = np.clip(
        (centers[:, 0] - mean_center[0]) * lightness_boost + mean_center[0],
        0,
        255,
    )

    # Increase separation between color tones
    centers[:, 1] = np.clip(
        (centers[:, 1] - mean_center[1]) * chroma_boost + mean_center[1],
        0,
        255,
    )
    centers[:, 2] = np.clip(
        (centers[:, 2] - mean_center[2]) * chroma_boost + mean_center[2],
        0,
        255,
    )

    # Snap colors to more distinct steps
    centers = np.round(centers / round_step) * round_step
    centers = np.clip(centers, 0, 255).astype(np.uint8)

    quantized_lab = centers[labels.flatten()].reshape(image_lab.shape)
    quantized_rgb = cv.cvtColor(quantized_lab, cv.COLOR_LAB2RGB)

    return quantized_rgb

def remove_small_components(binary_image: np.ndarray, min_area: int = 120) -> np.ndarray:
    """
    Removes very small connected components from a binary image.
    Useful for removing tiny facial texture details and noise.
    """
    num_labels, labels, stats, _ = cv.connectedComponentsWithStats(binary_image, connectivity=8)

    cleaned = np.zeros_like(binary_image)

    for label_index in range(1, num_labels):  # skip background
        area = stats[label_index, cv.CC_STAT_AREA]
        if area >= min_area:
            cleaned[labels == label_index] = 255

    return cleaned

def create_edge_mask(
    image_rgb: np.ndarray,
    blur_kernel_size: int = 7,
    block_size: int = 15,
    c_value: int = 8,
    min_area: int = 220,
) -> np.ndarray:
    """
    Creates a simplified edge mask with fewer small details.
    White areas represent flat color regions.
    Black areas represent simplified outlines.
    """
    if block_size % 2 == 0:
        block_size += 1

    gray_image = cv.cvtColor(image_rgb, cv.COLOR_RGB2GRAY)
    blurred_gray = cv.medianBlur(gray_image, blur_kernel_size)

    edge_mask = cv.adaptiveThreshold(
        blurred_gray,
        255,
        cv.ADAPTIVE_THRESH_MEAN_C,
        cv.THRESH_BINARY,
        block_size,
        c_value,
    )

    # Invert so black details become white components that we can clean
    inverted_edges = 255 - edge_mask

    # Remove tiny detail noise
    cleaned_edges = remove_small_components(inverted_edges, min_area=min_area)

    # Smooth and connect larger contours
    kernel = np.ones((3, 3), np.uint8)
    cleaned_edges = cv.morphologyEx(cleaned_edges, cv.MORPH_CLOSE, kernel, iterations=1)

    # Optional: slightly thicken the remaining main contours
    cleaned_edges = cv.dilate(cleaned_edges, kernel, iterations=1)

    # Invert back: black contours, white flat regions
    final_edge_mask = 255 - cleaned_edges

    return final_edge_mask

def create_major_feature_mask(
    image_rgb: np.ndarray,
    min_area: int = 250,
    threshold_value: int = 85,
) -> np.ndarray:
    """
    Detects only stronger dark facial features such as eyes, eyebrows,
    mouth, beard and hair. This avoids too many weak skin details.
    """
    gray_image = cv.cvtColor(image_rgb, cv.COLOR_RGB2GRAY)
    blurred_gray = cv.medianBlur(gray_image, 7)

    # Fixed threshold: only clearly dark areas become features
    _, feature_mask = cv.threshold(
        blurred_gray,
        threshold_value,
        255,
        cv.THRESH_BINARY_INV,
    )

    feature_mask = remove_small_components(feature_mask, min_area=min_area)

    kernel = np.ones((3, 3), np.uint8)
    feature_mask = cv.morphologyEx(feature_mask, cv.MORPH_CLOSE, kernel, iterations=1)
    feature_mask = cv.dilate(feature_mask, kernel, iterations=1)

    return feature_mask

def apply_feature_mask(
    cartoon_image: np.ndarray,
    feature_mask: np.ndarray,
    feature_color: tuple[int, int, int] = (20, 20, 20),
) -> np.ndarray:
    """
    Applies a strong dark color to major facial features.
    This makes eyes, eyebrows, mouth and hair more visible in vector style.
    """
    enhanced_image = cartoon_image.copy()
    enhanced_image[feature_mask == 255] = feature_color

    return enhanced_image

def combine_colors_with_edges(
    quantized_image: np.ndarray,
    edge_mask: np.ndarray,
) -> np.ndarray:
    """
    Combines the quantized color image with the edge mask.

    White mask pixels keep the original quantized color.
    Black mask pixels create dark cartoon outlines.
    """
    edge_mask_rgb = cv.cvtColor(edge_mask, cv.COLOR_GRAY2RGB)

    cartoon_image = cv.bitwise_and(
        quantized_image,
        edge_mask_rgb,
    )

    return cartoon_image

def save_rgb_image(image_rgb: np.ndarray, output_path: str | Path) -> Path:
    """
    Saves an RGB image to disk.
    OpenCV expects BGR for imwrite, so we convert first.
    """
    output_file = Path(output_path)

    image_bgr = cv.cvtColor(image_rgb, cv.COLOR_RGB2BGR)
    success = cv.imwrite(str(output_file), image_bgr)

    if not success:
        raise ValueError(f"Failed to save image to: {output_file}")

    return output_file

def validate_avatar_parameters(color_count: int, max_size: int) -> None:
    """
    Validates cartoon avatar generation parameters.
    """
    if color_count < 2:
        raise ValueError("color_count must be at least 2.")

    if color_count > 32:
        raise ValueError("color_count must not be greater than 32.")

    if max_size < 128:
        raise ValueError("max_size must be at least 128 pixels.")

    if max_size > 2048:
        raise ValueError("max_size must not be greater than 2048 pixels.")

def generate_cartoon_avatar(
    image_path: str | Path,
    output_dir: str | Path = DEFAULT_OUTPUT_DIR,
    color_count: int = 8,
    max_size: int = 512,
) -> dict:
    """
    Generates a cartoon-style avatar from an input image.

    This function will be implemented step by step.
    """
    input_path = Path(image_path)
    validate_avatar_parameters(color_count, max_size)

    if not input_path.exists():
        raise FileNotFoundError(f"Input image was not found: {input_path}")

    output_path = ensure_output_dir(output_dir)
    avatar_output_path = create_output_path(input_path, output_path)

    image_rgb = load_image_rgb(input_path)
    preprocessed_image, preprocessing_metadata = preprocess_avatar_image(
        image_rgb,
        max_size=max_size,
    )

    smoothed_image = apply_bilateral_smoothing(preprocessed_image)

    enhanced_image = enhance_image_for_cartoon(smoothed_image)

    quantized_image = quantize_colors(
        enhanced_image,
        color_count=color_count,
        lightness_boost=1.25,
        chroma_boost=1.50,
        round_step=12,
    )

    edge_mask = create_edge_mask(smoothed_image)
    cartoon_image = combine_colors_with_edges(quantized_image, edge_mask)

    feature_mask = create_major_feature_mask(
        smoothed_image,
        min_area=180,
        threshold_value=20,
    )
    cartoon_image = apply_feature_mask(cartoon_image, feature_mask)

    saved_avatar_path = save_rgb_image(cartoon_image, avatar_output_path)

    return {
        "input_path": str(input_path),
        "output_dir": str(output_path),
        "avatar_path": str(saved_avatar_path),
        "processing": {
            "method": "opencv_cartoon_avatar",
            "status": "completed",
            "max_size": int(max_size),
            "smoothing": "bilateral_filter_x3_plus_median_blur",
            "color_quantization": "kmeans",
            "color_count": int(color_count),
            "edge_detection": "adaptive_threshold_cleaned",
            "feature_enhancement": "major_dark_features",
            "composition": "quantized_colors_with_simplified_edge_mask",
            "output_format": "png",
            **preprocessing_metadata,
        },
    }

def parse_arguments() -> argparse.Namespace:
    """
    Parses command-line arguments for cartoon avatar generation.
    """
    parser = argparse.ArgumentParser(
        description="Generate a cartoon-style avatar from an input image."
    )

    parser.add_argument(
        "image_path",
        nargs="?",
        default="test-images/burger.jpg",
        help="Path to the input image.",
    )

    parser.add_argument(
        "--output-dir",
        default=str(DEFAULT_OUTPUT_DIR),
        help="Directory where the generated avatar will be saved.",
    )

    parser.add_argument(
        "--colors",
        type=int,
        default=5,
        help="Number of colors used for K-means quantization.",
    )

    parser.add_argument(
        "--size",
        type=int,
        default=512,
        help="Maximum size of the longest image side before cropping.",
    )

    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    result = generate_cartoon_avatar(
        args.image_path,
        args.output_dir,
        color_count=args.colors,
        max_size=args.size,
    )
    print(json.dumps(result, indent=4))
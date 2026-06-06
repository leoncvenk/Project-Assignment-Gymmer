from pathlib import Path
import cv2 as cv
import numpy as np
import argparse
from uuid import uuid4
from PIL import Image, ImageOps


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

    cropped_image = center_crop_square(resized_image)
    cropped_height, cropped_width = cropped_image.shape[:2]

    metadata = {
        "original_width": int(original_width),
        "original_height": int(original_height),
        "resized_width": int(resized_width),
        "resized_height": int(resized_height),
        "cropped_width": int(cropped_width),
        "cropped_height": int(cropped_height),
    }

    return cropped_image, metadata

def apply_bilateral_smoothing(
    image_rgb: np.ndarray,
    diameter: int = 9,
    sigma_color: int = 75,
    sigma_space: int = 75,
) -> np.ndarray:
    """
    Applies bilateral filtering to smooth colors while preserving edges.
    This helps create a cleaner cartoon-like appearance.
    """
    smoothed = cv.bilateralFilter(
        image_rgb,
        diameter,
        sigma_color,
        sigma_space,
    )

    return smoothed

def quantize_colors(image_rgb: np.ndarray, color_count: int = 8) -> np.ndarray:
    """
    Reduces the number of colors in the image using K-means clustering.
    Fewer colors create a flatter cartoon-like style.
    """
    pixels = image_rgb.reshape((-1, 3)).astype(np.float32)

    criteria = (
        cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER,
        20,
        1.0,
    )

    _, labels, centers = cv.kmeans(
        pixels,
        color_count,
        None,
        criteria,
        3,
        cv.KMEANS_PP_CENTERS,
    )

    centers = np.uint8(centers)
    quantized_pixels = centers[labels.flatten()]
    quantized_image = quantized_pixels.reshape(image_rgb.shape)

    return quantized_image

def create_edge_mask(
    image_rgb: np.ndarray,
    blur_kernel_size: int = 7,
    block_size: int = 9,
    c_value: int = 2,
) -> np.ndarray:
    """
    Creates a black/white edge mask from the image.

    White areas represent flat color regions.
    Black areas represent detected edges.
    """
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

    return edge_mask

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

def generate_cartoon_avatar(image_path: str | Path, output_dir: str | Path = DEFAULT_OUTPUT_DIR) -> dict:
    """
    Generates a cartoon-style avatar from an input image.

    This function will be implemented step by step.
    """
    input_path = Path(image_path)

    if not input_path.exists():
        raise FileNotFoundError(f"Input image was not found: {input_path}")

    output_path = ensure_output_dir(output_dir)
    avatar_output_path = create_output_path(input_path, output_path)

    image_rgb = load_image_rgb(input_path)
    preprocessed_image, preprocessing_metadata = preprocess_avatar_image(image_rgb)

    smoothed_image = apply_bilateral_smoothing(preprocessed_image)
    quantized_image = quantize_colors(smoothed_image)
    edge_mask = create_edge_mask(preprocessed_image)
    cartoon_image = combine_colors_with_edges(quantized_image, edge_mask)

    saved_avatar_path = save_rgb_image(cartoon_image, avatar_output_path)

    return {
        "input_path": str(input_path),
        "output_dir": str(output_path),
        "avatar_path": str(saved_avatar_path),
        "processing": {
            "method": "opencv_cartoon_avatar",
            "status": "completed",
            "smoothing": "bilateral_filter",
            "color_quantization": "kmeans",
            "color_count": 8,
            "edge_detection": "adaptive_threshold",
            "composition": "quantized_colors_with_edge_mask",
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

    return parser.parse_args()

if __name__ == "__main__":
    args = parse_arguments()
    result = generate_cartoon_avatar(args.image_path, args.output_dir)
    print(result)
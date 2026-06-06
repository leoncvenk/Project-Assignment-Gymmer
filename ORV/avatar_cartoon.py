from pathlib import Path
import cv2 as cv
import numpy as np
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


def generate_cartoon_avatar(image_path: str | Path, output_dir: str | Path = DEFAULT_OUTPUT_DIR) -> dict:
    """
    Generates a cartoon-style avatar from an input image.

    This function will be implemented step by step.
    """
    input_path = Path(image_path)

    if not input_path.exists():
        raise FileNotFoundError(f"Input image was not found: {input_path}")
    
    image_rgb = load_image_rgb(input_path)
    height, width = image_rgb.shape[:2]

    output_path = ensure_output_dir(output_dir)

    avatar_output_path = create_output_path(input_path, output_path)

    return {
        "input_path": str(input_path),
        "output_dir": str(output_path),
        "avatar_path": str(avatar_output_path),
        "processing": {
            "method": "opencv_cartoon_avatar",
            "status": "not_implemented_yet",
            "original_width": int(width),
            "original_height": int(height),
        },
    }


if __name__ == "__main__":
    result = generate_cartoon_avatar("test-images/burger.jpg")
    print(result)
from pathlib import Path


DEFAULT_OUTPUT_DIR = Path("test-images/results_avatar")


def ensure_output_dir(output_dir: str | Path = DEFAULT_OUTPUT_DIR) -> Path:
    """
    Creates and returns the output directory for generated cartoon avatars.
    """
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)
    return output_path


def generate_cartoon_avatar(image_path: str | Path, output_dir: str | Path = DEFAULT_OUTPUT_DIR) -> dict:
    """
    Generates a cartoon-style avatar from an input image.

    This function will be implemented step by step.
    """
    input_path = Path(image_path)

    if not input_path.exists():
        raise FileNotFoundError(f"Input image was not found: {input_path}")

    output_path = ensure_output_dir(output_dir)

    return {
        "input_path": str(input_path),
        "output_dir": str(output_path),
        "avatar_path": None,
        "processing": {
            "method": "opencv_cartoon_avatar",
            "status": "not_implemented_yet",
        },
    }


if __name__ == "__main__":
    result = generate_cartoon_avatar("test-images/burger.jpg")
    print(result)
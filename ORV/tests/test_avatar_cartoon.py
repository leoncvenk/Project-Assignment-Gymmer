import pytest

from avatar_cartoon import generate_cartoon_avatar, validate_avatar_parameters


def test_generate_cartoon_avatar_raises_for_missing_file(tmp_path):
    missing_image = tmp_path / "missing.jpg"

    with pytest.raises(FileNotFoundError):
        generate_cartoon_avatar(missing_image, output_dir=tmp_path)

def test_validate_avatar_parameters_rejects_too_few_colors():
    with pytest.raises(ValueError, match="color_count must be at least 2"):
        validate_avatar_parameters(color_count=1, max_size=512)


def test_validate_avatar_parameters_rejects_too_many_colors():
    with pytest.raises(ValueError, match="color_count must not be greater than 32"):
        validate_avatar_parameters(color_count=33, max_size=512)


def test_validate_avatar_parameters_rejects_too_small_size():
    with pytest.raises(ValueError, match="max_size must be at least 128"):
        validate_avatar_parameters(color_count=8, max_size=64)


def test_validate_avatar_parameters_rejects_too_large_size():
    with pytest.raises(ValueError, match="max_size must not be greater than 2048"):
        validate_avatar_parameters(color_count=8, max_size=4096)


def test_validate_avatar_parameters_accepts_valid_values():
    validate_avatar_parameters(color_count=8, max_size=512)
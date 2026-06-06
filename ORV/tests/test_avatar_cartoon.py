import pytest

from avatar_cartoon import generate_cartoon_avatar


def test_generate_cartoon_avatar_raises_for_missing_file(tmp_path):
    missing_image = tmp_path / "missing.jpg"

    with pytest.raises(FileNotFoundError):
        generate_cartoon_avatar(missing_image, output_dir=tmp_path)
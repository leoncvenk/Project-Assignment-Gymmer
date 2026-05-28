import re
from pathlib import Path

import cv2 as cv
import numpy as np
import pytest

from profile_theme import (
    generate_profile_theme,
    rgb_to_hex,
    get_text_color,
    create_complementary_color,
)


HEX_COLOR_PATTERN = re.compile(r"^#[0-9A-Fa-f]{6}$")


def create_test_image(path, color):
    """
    Ustvari enobarvno testno sliko.
    Barva je podana kot RGB, OpenCV pa shranjuje v BGR.
    """
    rgb_image = np.full((100, 100, 3), color, dtype=np.uint8)
    bgr_image = cv.cvtColor(rgb_image, cv.COLOR_RGB2BGR)
    cv.imwrite(str(path), bgr_image)


def test_rgb_to_hex_returns_valid_hex():
    assert rgb_to_hex((255, 0, 128)) == "#FF0080"


def test_get_text_color_returns_white_for_dark_background():
    assert get_text_color((20, 20, 20)) == "#FFFFFF"


def test_get_text_color_returns_black_for_light_background():
    assert get_text_color((230, 230, 230)) == "#000000"


def test_create_complementary_color_returns_rgb_tuple():
    result = create_complementary_color((120, 60, 30))

    assert isinstance(result, tuple)
    assert len(result) == 3

    for value in result:
        assert 0 <= value <= 255


def test_generate_profile_theme_returns_expected_fields(tmp_path):
    image_path = tmp_path / "test_image.jpg"
    create_test_image(image_path, (120, 70, 30))

    result = generate_profile_theme(image_path)

    assert "dominant_color" in result
    assert "secondary_color" in result
    assert "text_color" in result
    assert "banner_gradient" in result


def test_generate_profile_theme_returns_valid_hex_colors(tmp_path):
    image_path = tmp_path / "test_image.jpg"
    create_test_image(image_path, (80, 120, 40))

    result = generate_profile_theme(image_path)

    assert HEX_COLOR_PATTERN.match(result["dominant_color"])
    assert HEX_COLOR_PATTERN.match(result["secondary_color"])
    assert result["text_color"] in ["#FFFFFF", "#000000"]


def test_generate_profile_theme_returns_css_gradient(tmp_path):
    image_path = tmp_path / "test_image.jpg"
    create_test_image(image_path, (40, 90, 160))

    result = generate_profile_theme(image_path)

    assert result["banner_gradient"].startswith("linear-gradient")
    assert result["dominant_color"] in result["banner_gradient"]
    assert result["secondary_color"] in result["banner_gradient"]


def test_generate_profile_theme_raises_error_for_missing_file():
    missing_path = Path("test-images/this_image_does_not_exist.jpg")

    with pytest.raises(FileNotFoundError):
        generate_profile_theme(missing_path)
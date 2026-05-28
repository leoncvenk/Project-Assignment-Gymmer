import json
import sys
from pathlib import Path

import cv2 as cv
import numpy as np
from PIL import Image, ImageOps


def rgb_to_hex(color):
    """Pretvori RGB tuple/list v HEX zapis."""
    r, g, b = [int(max(0, min(255, value))) for value in color]
    return f"#{r:02X}{g:02X}{b:02X}"


def get_text_color(rgb_color):
    """
    Izbere belo ali črno barvo besedila glede na svetlost ozadja.
    Uporabi standardno formulo za relativno svetlost.
    """
    r, g, b = rgb_color
    brightness = (0.299 * r) + (0.587 * g) + (0.114 * b)

    if brightness > 150:
        return "#000000"

    return "#FFFFFF"


def create_complementary_color(rgb_color):
    """
    Ustvari približno komplementarno barvo.
    Barvo najprej pretvori v HSV, nato zamakne hue za 90 stopinj,
    da dobimo kontrastno, vendar ne preveč agresivno barvo za gradient.
    """
    color_array = np.uint8([[rgb_color]])
    hsv = cv.cvtColor(color_array, cv.COLOR_RGB2HSV)

    hsv[0][0][0] = (int(hsv[0][0][0]) + 45) % 180
    hsv[0][0][1] = min(255, int(hsv[0][0][1]) + 25)
    hsv[0][0][2] = max(80, int(hsv[0][0][2]))

    complementary = cv.cvtColor(hsv, cv.COLOR_HSV2RGB)[0][0]
    return tuple(int(value) for value in complementary)


def load_image_rgb(image_path):
    """
    Varno naloži sliko s Pillow, popravi EXIF rotacijo in jo pretvori v RGB.
    """
    path = Path(image_path)

    if not path.exists():
        raise FileNotFoundError(f"Slika ne obstaja: {image_path}")

    try:
        pil_img = Image.open(path)
        pil_img = ImageOps.exif_transpose(pil_img)
        pil_img = pil_img.convert("RGB")
        return np.array(pil_img)
    except Exception as error:
        raise ValueError(f"Napaka pri nalaganju slike: {error}") from error


def extract_dominant_color(image_rgb, clusters=4):
    """
    Iz slike izračuna dominantno barvo z uporabo K-means algoritma.

    Postopek:
    - sliko pomanjša zaradi hitrosti
    - odstrani skoraj bele, črne in sive piksle
    - nad ostalimi piksli izvede K-means
    - izbere največji barvni cluster kot dominantno barvo
    """
    resized = cv.resize(image_rgb, (120, 120), interpolation=cv.INTER_AREA)
    pixels = resized.reshape((-1, 3))

    hsv_pixels = cv.cvtColor(resized, cv.COLOR_RGB2HSV).reshape((-1, 3))

    saturation = hsv_pixels[:, 1]
    value = hsv_pixels[:, 2]

    # Odstranimo zelo sive, zelo temne in zelo svetle piksle,
    # ker pogosto predstavljajo ozadje, senco ali belo svetlobo.
    mask = (saturation > 35) & (value > 35) & (value < 245)
    filtered_pixels = pixels[mask]

    # Če je filtriranje preveč strogo, uporabimo vse piksle.
    if len(filtered_pixels) < 50:
        filtered_pixels = pixels

    filtered_pixels = np.float32(filtered_pixels)

    cluster_count = min(clusters, len(filtered_pixels))

    criteria = (
        cv.TERM_CRITERIA_EPS + cv.TERM_CRITERIA_MAX_ITER,
        100,
        0.2,
    )

    _, labels, centers = cv.kmeans(
        filtered_pixels,
        cluster_count,
        None,
        criteria,
        10,
        cv.KMEANS_RANDOM_CENTERS,
    )

    labels = labels.flatten()
    counts = np.bincount(labels)

    dominant_index = int(np.argmax(counts))
    dominant_color = centers[dominant_index]

    return tuple(int(value) for value in dominant_color)


def generate_profile_theme(image_path):
    """
    Glavna funkcija za generiranje barvne teme profila iz slike.
    Vrne dominantno barvo, sekundarno barvo, barvo teksta in CSS gradient.
    """
    image_rgb = load_image_rgb(image_path)

    dominant_color = extract_dominant_color(image_rgb)
    secondary_color = create_complementary_color(dominant_color)
    text_color = get_text_color(dominant_color)

    dominant_hex = rgb_to_hex(dominant_color)
    secondary_hex = rgb_to_hex(secondary_color)

    return {
        "dominant_color": dominant_hex,
        "secondary_color": secondary_hex,
        "text_color": text_color,
        "banner_gradient": f"linear-gradient(135deg, {dominant_hex}, {secondary_hex})",
    }


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uporaba: python profile_theme.py <pot_do_slike>")
        sys.exit(1)

    result = generate_profile_theme(sys.argv[1])
    print(json.dumps(result, indent=4))
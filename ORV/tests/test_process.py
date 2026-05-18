import pytest
import numpy as np
import cv2 as cv
from PIL import Image
import os

# Popravimo pot, da lahko uvozimo process_image iz starševske mape
import sys
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from process import process_image

@pytest.fixture
def dummy_image_path(tmp_path):
    """Fixture, ki ustvari začasno testno sliko."""
    img_p = tmp_path / "test_food.jpg"
    # Ustvarimo naključno RGB sliko velikosti 1200x800 (širina > 1024, da testiramo resize)
    random_image = np.random.randint(0, 255, (800, 1200, 3), dtype=np.uint8)
    img = Image.fromarray(random_image)
    img.save(img_p)
    return str(img_p)

def test_process_image_resizing(dummy_image_path):
    """Testira, ali se prevelika slika pravilno pomanjša na širino 1024 slikovnih pik."""
    processed = process_image(dummy_image_path)
    
    assert processed is not None, "Obdelana slika ne bi smela biti None"
    
    # Preverimo dimenzije (OpenCV vrne h, w, c)
    h, w, c = processed.shape
    assert w == 1024, f"Širina slike bi morala biti pomanjšana na 1024, dobili pa smo {w}"

def test_process_image_invalid_path():
    """Testira, kako funkcija reagira, če datoteka ne obstaja."""
    processed = process_image("neobstojeca_slika.jpg")
    assert processed is None, "Za neobstoječo pot bi morala funkcija vrniti None"
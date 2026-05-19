import pytest
import numpy as np
import cv2 as cv
from PIL import Image
import os
import sys

# Uvozimo GymProcessor
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from process_gym import GymProcessor

@pytest.fixture(scope="module")
def processor():
    return GymProcessor()

@pytest.fixture
def dummy_image_path(tmp_path):
    """Fixture, ki ustvari začasno testno sliko z dimenzijami večjimi od 1024."""
    img_p = tmp_path / "test_gym.jpg"
    random_image = np.random.randint(0, 255, (800, 1200, 3), dtype=np.uint8)
    img = Image.fromarray(random_image)
    img.save(img_p)
    return str(img_p)

def test_process_gym_resizing(processor, dummy_image_path):
    """Testira, ali procesor pravilno pomanjša sliko."""
    processed = processor.process_image(dummy_image_path)
    
    assert processed is not None, "Obdelana slika ne bi smela biti None"
    
    # Preverimo dimenzije
    h, w, c = processed.shape
    assert w == 1024, f"Širina slike bi morala biti pomanjšana na 1024, dobili pa smo {w}"

def test_process_gym_invalid_path(processor):
    """Testira obravnavo neobstoječe datoteke."""
    processed = processor.process_image("neobstojeca_slika_opreme.jpg")
    assert processed is None, "Za neobstoječo pot bi morala funkcija vrniti None"
    
def test_predict_gym_invalid_path(processor):
    """Testira glavno metodo za napoved pri napačni poti."""
    result = processor.predict("neobstojeca.jpg")
    assert "error" in result
import unittest
import os
from fastapi.testclient import TestClient

import sys
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from api import app

class TestGymmerAPI(unittest.TestCase):
    def setUp(self):
        # Ustvarimo testnega odjemalca
        self.client = TestClient(app)
        
        # Nastavimo poti do tvojih obstoječih testnih slik
        self.food_image_path = "test-images/burger.jpg"
        self.gym_image_path = "test-images/lat.jpg"

    def test_predict_food_endpoint(self):
        # Preverimo, če testna slika obstaja, preden jo pošljemo
        if not os.path.exists(self.food_image_path):
            self.skipTest(f"Testna slika {self.food_image_path} ne obstaja.")

        # Simuliramo nalaganje datoteke
        with open(self.food_image_path, "rb") as image_file:
            response = self.client.post(
                "/predict/food",
                files={"file": ("burger.jpg", image_file, "image/jpeg")}
            )

        # 1. Preverimo, če je statusna koda 200 (OK)
        self.assertEqual(response.status_code, 200)
        
        # 2. Preverimo strukturo JSON odgovora
        response_data = response.json()
        self.assertIn("found", response_data, "Odgovor ne vsebuje ključa 'found'")
        
        # 3. Preverimo, če je dejansko prepoznal hrano v seznamu
        self.assertTrue(len(response_data["found"]) > 0, "Model ni prepoznal nobene hrane na sliki")

    def test_predict_gym_endpoint(self):
        # Preverimo, če testna slika obstaja
        if not os.path.exists(self.gym_image_path):
            self.skipTest(f"Testna slika {self.gym_image_path} ne obstaja.")

        # Simuliramo nalaganje datoteke
        with open(self.gym_image_path, "rb") as image_file:
            response = self.client.post(
                "/predict/gym",
                files={"file": ("lat.jpg", image_file, "image/jpeg")}
            )

        # 1. Preverimo statusno kodo
        self.assertEqual(response.status_code, 200)
        
        # 2. Preverimo strukturo JSON odgovora
        response_data = response.json()
        self.assertIn("found", response_data, "Odgovor ne vsebuje ključa 'found'")
        
        # 3. Preverimo, če je dejansko prepoznal opremo
        self.assertTrue(len(response_data["found"]) > 0, "Model ni prepoznal nobene opreme na sliki")

if __name__ == "__main__":
    unittest.main()
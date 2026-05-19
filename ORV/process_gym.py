import cv2 as cv
import numpy as np
import os
from PIL import Image, ImageOps
from ultralytics import YOLO

class GymProcessor:
    def __init__(self):
        # Naložimo model ob inicializaciji
        base_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(base_dir, "models", "gym", "best.pt")
        try:
            self.model = YOLO(model_path)
        except Exception as e:
            print(f"Opozorilo: Ni mogoče naložiti modela {model_path}. Napaka: {e}")
            self.model = None

    def process_image(self, image_path):
        """Predobdelava slike (podobno kot pri Food modelu)"""
        try:
            pil_img = Image.open(image_path)
            pil_img = ImageOps.exif_transpose(pil_img)
            image = cv.cvtColor(np.array(pil_img), cv.COLOR_RGB2BGR)
        except Exception as e:
            print(f"Napaka pri nalaganju slike: {e}")
            return None

        # 1. Pomanjševanje (Resize)
        max_width = 1024
        h, w = image.shape[:2]
        if w > max_width:
            ratio = max_width / w
            new_h = int(h * ratio)
            image = cv.resize(image, (max_width, new_h), interpolation=cv.INTER_AREA)

        # 2. Izboljšanje kontrasta (CLAHE)
        lab = cv.cvtColor(image, cv.COLOR_BGR2LAB)
        l_channel, a, b = cv.split(lab)
        clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        cl = clahe.apply(l_channel)
        merged_lab = cv.merge((cl, a, b))
        image = cv.cvtColor(merged_lab, cv.COLOR_LAB2BGR)

        # 3. Odstranjevanje šuma (Gaussian Blur)
        image = cv.GaussianBlur(image, (5, 5), 0)

        return image

    def predict(self, image_path, min_confidence=0.5):
        """Predobdelava in detekcija"""
        img = self.process_image(image_path)
        if img is None:
            return {"error": "Slike ni bilo mogoče naložiti ali obdelati."}
            
        if self.model is None:
            return {"error": "Model ni naložen."}

        # YOLO napoved na obdelani sliki (numpy array)
        results = self.model.predict(img, conf=min_confidence)
        
        response = {"model": "gym", "found": []}
        for result in results:
            for box in result.boxes:
                response["found"].append({
                    "class": result.names[int(box.cls[0])],
                    "confidence": round(float(box.conf[0]), 3)
                })
        return response
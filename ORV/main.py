from ultralytics import YOLO
import json
import sys
import cv2 as cv

from process import process_image 

def predict_food(image_path, model_path):
    print("Processing image...")
    img = process_image(image_path)
    
    if img is None:
        return json.dumps({"error": "Image could not be loaded or processed."})

    # Opomba: Ko bo to postalo API strežnik, bomo model naložili samo enkrat ob zagonu, 
    # da ne izgubljamo časa pri vsaki sliki. Za testiranje pa je tukaj.
    model = YOLO(model_path)

    print("Searching for food in the image...")
    results = model.predict(source=image_path, save=True, save_dir="test-images/results")
    # save=True bo shranil sliko z narisanimi okvirčki, save_dir pa določa, kam se shranijo te slike.

    response = {"found": []}
    
    for result in results:
        boxes = result.boxes
        for box in boxes:
            # box.cls vsebuje ID razreda, model.names pa je slovar imen
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            # box.conf vsebuje stopnjo prepričanosti (0.0 do 1.0)
            confidence = float(box.conf[0])
            
            # IMPORTANT!
            # To bo slo v ALGORITEM (namesto confidence), ki bo odločil, ali je najdena hrana dovolj verjetna, da jo vključimo v odgovor.
            # Zdaj: V aplikacijo pošljemo samo tiste rezultate, ki so nad določeno mejo prepričanosti (npr. 0.3 ali 30%)
            # --------------------------------------------
            if confidence > 0.1:
                response["found"].append({
                    "food": class_name,
                    "confidence": round(confidence, 2)
                })

    # Vrnemo odgovor kot tekst v formatu JSON
    return json.dumps(response, indent=4)


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python main.py <path_to_image.jpg>")
        sys.exit(1)
        
    test_image = sys.argv[1]
    
    path_model = r"models/best.pt"
    
    output_json = predict_food(test_image, path_model)
    
    print("------------------------------------")
    print(output_json)
    print("------------------------------------")
    print("Image with bounding boxes can be found in the folder: runs/detect/predict (or wherever YOLO saves it)")
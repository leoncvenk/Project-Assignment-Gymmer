from ultralytics import YOLO

def main():
    # Load the pre-trained YOLO11 Medium model. 
    model = YOLO("yolo11m.pt")

    # Training process with optimized settings
    results = model.train(
        data="Food-1/data.yaml",
        epochs=150,
        imgsz=640,              
        batch=8,
        workers=0,                  
        device='0',                 # Ensures it utilizes dedicated GPU
        project="runs/detect",  
        name="training_food_yolo11m", 
        patience=25                 # The model will automatically stop if accuracy doesn't improve for 25 epochs
    )

    print("Learning Complete. Results:", results)

if __name__ == '__main__':
    main()
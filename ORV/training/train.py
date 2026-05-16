from ultralytics import YOLO

def main():
    # Naloži predtrenirani model YOLOv8s. 
    # Ta model je že bil treniran na velikem naboru podatkov in bo služil
    # kot dobra osnova za nadaljnje učenje na naboru slik hrane.
    model = YOLO("yolov8s.pt")

    # proces učenja z optimiziranimi nastavitvami
    results = model.train(
        data="Complete-Food-1/data.yaml",
        epochs=100,             # Povečamo število epoh. Model bo sam ustavil učenje (early stopping), če napredka ne bo več.
        imgsz=640,              
        batch=16,               # Če med učenjem dobiš napako 'Out of Memory', zmanjšaj to vrednost na 8.
        workers=8,              # Uporaba več jeder procesorja za hitrejše nalaganje 47k slik.
        device='0',           # 'cpu' Uporaba CPU namesto GPU. Če imaš dostop do GPU, spremeni na 'cuda'.
        project="runs/detect",  
        name="training_food_v2" 
    )

    print("Learning Complete. Best results are in runs/detect/training_food_v2/weights/best.pt")

if __name__ == '__main__':
    main()
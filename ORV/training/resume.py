from ultralytics import YOLO

def main():
    # 1. Naloži datoteko 'last.pt' 
    # # Spremeni pot do datoteke 'last.pt' glede na tvojo strukturo map in imena datotek.
    model = YOLO(r"runs\detect\training_food_yolo11m-3\weights\last.pt")    

    results = model.train(resume=True)

if __name__ == '__main__':
    main()
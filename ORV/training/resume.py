from ultralytics import YOLO

def main():
    # 1. Naloži datoteko 'last.pt' 
    # # Spremenite pot do datoteke 'last.pt' glede na vašo strukturo map in imena datotek.
    model = YOLO(r"\Project-Assignment-Gymmer\runs\detect\runs\detect\training_food_v2-3\weights\last.pt")

    results = model.train(resume=True)

if __name__ == '__main__':
    main()
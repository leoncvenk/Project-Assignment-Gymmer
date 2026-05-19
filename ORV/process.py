import cv2 as cv
import numpy as np
import sys
from PIL import Image, ImageOps

def process_image(image_path, is_gym=False):
    # Uporabimo knjižnico PIL (Pillow), ki ima vgrajeno varno funkcijo za popravek EXIF rotacije.
    try:
        pil_img = Image.open(image_path)
        pil_img = ImageOps.exif_transpose(pil_img)
        # Pretvorba iz PIL (RGB) v OpenCV format (BGR array)
        image = cv.cvtColor(np.array(pil_img), cv.COLOR_RGB2BGR)
    except Exception as e:
        print(f"Napaka pri nalaganju slike: {e}")
        return None

    # 1. Zmanjšanje obremenitve strežnika in API-ja
    # Namesto fiksnega (1024x512) ohranimo razmerje stranic, da hrane ne raztegnemo.
    max_width = 1024
    h, w = image.shape[:2]
    if w > max_width:
        ratio = max_width / w
        new_h = int(h * ratio)
        # INTER_AREA je najboljša metoda za pomanjševanje slik
        image = cv.resize(image, (max_width, new_h), interpolation=cv.INTER_AREA)

    # 2. Izboljšanje kontrasta (CLAHE filter)
    # Da ne popačimo barv hrane (kar bi zmedlo YOLO), sliko pretvorimo v LAB barvni prostor
    # in CLAHE nanesemo samo na L (Luminance - svetlost) kanal.
    lab = cv.cvtColor(image, cv.COLOR_BGR2LAB)
    l_channel, a, b = cv.split(lab)
    clahe = cv.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    cl = clahe.apply(l_channel)
    # Združimo obdelan L kanal nazaj z originalnima a in b barvnima kanaloma
    merged_lab = cv.merge((cl, a, b))
    image = cv.cvtColor(merged_lab, cv.COLOR_LAB2BGR)

    # 3. Odstranjevanje šuma (Denoising)
    # Gaussov filter uporabimo SAMO, če ni gym model
    if not is_gym:
        image = cv.GaussianBlur(image, (5, 5), 0)
    else:
        print("DEBUG: Preskakujem Gaussian Blur za gym model.")

    return image


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Uporaba: python process.py <slika.jpg>")
        sys.exit(1)

    image_path = sys.argv[1]
    # Privzeto nastavimo False, če kličemo skripto direktno
    processed_image = process_image(image_path, is_gym=False)

    if processed_image is not None:
        cv.imshow("Processed Image", processed_image)
        cv.waitKey(0)
        cv.destroyAllWindows()
import os
from dotenv import load_dotenv
from roboflow import Roboflow

# Nalozimo spremenljivke iz .env
load_dotenv()

api_kljuc = os.getenv("ROBOFLOW_API_KEY")

rf = Roboflow(api_key=api_kljuc)
project = rf.workspace("food-becxj").project("complete-food")
version = project.version(1)
dataset = version.download("yolov8")

print("Podatki so preneseni v:", dataset.location)
                

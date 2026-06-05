import uvicorn
import json
import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from main import predict_food, predict_gym

app = FastAPI(title="Gymmer Vision API", description="Združen API za hrano in fitnes")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pomožna funkcija, za shranjevanje slik
def process_upload(file: UploadFile, predict_function, model_path):
    temp_dir = "test-images"
    os.makedirs(temp_dir, exist_ok=True)
    temp_image_path = os.path.join(temp_dir, f"temp_{file.filename}")
    
    with open(temp_image_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    result_string = predict_function(temp_image_path, model_path)
    result_data = json.loads(result_string)
    
    if os.path.exists(temp_image_path):
        os.remove(temp_image_path)
        
    return result_data

# ---------------------------------------------------------
# 1. API KONČNA TOČKA ZA HRANO
# ---------------------------------------------------------
@app.post("/predict/food")
async def api_detect_food(file: UploadFile = File(...)):
    try:
        model_path = r"models/food/best.pt"
        return process_upload(file, predict_food, model_path)
    except Exception as e:
        return {"error": str(e)}

# ---------------------------------------------------------
# 2. API KONČNA TOČKA ZA FITNES OPREMO
# ---------------------------------------------------------
@app.post("/predict/gym")
async def api_detect_gym(file: UploadFile = File(...)):
    try:
        model_path = r"models/gym/best.pt"
        return process_upload(file, predict_gym, model_path)
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    # Vse skupaj zdaj teče na enem portu (8001)
    uvicorn.run("api:app", host="127.0.0.1", port=8001, reload=True)
# ORV

## Setup

1.  **Set up the Python environment** 
*Ensure you have Python 3.12+ installed.*
    ```Bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\\Scripts\\activate
    pip install -r requirements.txt
    ```
    _(Required packages: `fastapi`, `uvicorn`, `ultralytics`, `opencv-python`, `numpy`, `Pillow`, `python-dotenv`, `roboflow`)_
    
4.  **Configure Environment Variables** Create a `.env` file in the root directory to download Roboflow datasets:
   
    
    
    ```Code snippet
    ROBOFLOW_API_KEY=your_api_key_here
    ```
    

##  Usage

### 1. Starting the API Server

Run the FastAPI application locally:


```Bash
python api.py
# or directly via uvicorn:
# uvicorn api:app --host 127.0.0.1 --port 8001 --reload
```

The API will be available at `http://127.0.0.1:8001`. Interactive API documentation can be accessed at `http://127.0.0.1:8001/docs`.

### 2. Command Line Inference

You can test the models directly from the CLI without spinning up the server:



```Bash
# For Food Detection
python main.py path/to/image.jpg food

# For Gym Equipment Detection
python main.py path/to/image.jpg gym
```

_Results will be printed as JSON, and images with bounding boxes will be saved to the `test-images/` or `runs/detect/` directories._

### 3. Profile Theme Generation

Extract aesthetic UI themes from an image:



```Bash
python profile_theme.py path/to/profile_pic.jpg
```

Returns a JSON object with a dominant hex color, a secondary complementary color, a calculated text color (black/white based on luminance), and a CSS gradient string.

##  API Endpoints

### `POST /predict/food`

Upload an image of a meal to detect food items.

-   **Confidence Threshold**: `> 10%`
    
-   **Response Format**:
    
    ```JSON
    {
        "found": [
            {"food": "Pizza", "confidence": 0.85},
            {"food": "Tomato", "confidence": 0.62}
        ]
    }
    ```
    

### `POST /predict/gym`

Upload an image of gym equipment.

-   **Confidence Threshold**: `> 50%`
    
-   **Response Format**:
    
    
    
    ```JSON
    {
        "found": [
            {"item": "treadmill", "confidence": 0.92}
        ]
    }
    ```
    

##  Model Training

### Dataset Acquisition

The dataset is managed via Roboflow. Run `prenos_podatkov.py` to pull the latest version of the `yolov11` formatted data.

### Training the Model

We utilize the `YOLO11m` (Medium) architecture for an optimal balance of speed and accuracy.



```Bash
python train.py
```

**Training Parameters used (`train.py`):**

-   **Epochs**: 150
    
-   **Image Size**: 640px
    
-   **Batch Size**: 8
    
-   **Patience**: 25 (Early stopping)
    
-   **Device**: 0 (Dedicated GPU)
    

_(To resume an interrupted training session, run `python resume.py`)_

### Performance (Food Model)

Based on the latest training session:

-   **mAP50**: `0.633` overall across 9,339 images and 23,881 instances.
    
-   **Top Performing Classes**: Rice (`0.815`), French Fries (`0.815`), Mung Bean Sprouts (`0.927`), Pizza (`0.781`).
    

##  Project Structure



```Plaintext
├── api.py               # FastAPI server setup and routes
├── main.py              # Core YOLO inference and JSON formatting logic
├── process.py           # Image preprocessing (CLAHE, Denoising, Resize)
├── profile_theme.py     # UI/UX utility for dominant color extraction
├── train.py             # YOLO11 model training configuration
├── resume.py            # Utility to resume training from last.pt
├── prenos_podatkov.py   # Roboflow API script for dataset download
└── models/
    ├── food/best.pt     # Compiled Food weights
    └── gym/best.pt      # Compiled Gym weights
```
# ORV

## Setup

### 1. Create and Activate a Python Virtual Environment

> Requires Python 3.12+

```bash
python -m venv venv
```

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

Required packages include:

* fastapi
* uvicorn
* ultralytics
* opencv-python
* numpy
* Pillow
* python-dotenv
* roboflow

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
ROBOFLOW_API_KEY=your_api_key_here
```

---

## Usage

### 1. Start the API Server

Run the FastAPI application using Uvicorn:

```bash
uvicorn api:app --host 0.0.0.0 --port 8001 --reload
```

Alternatively:

```bash
python api.py
```

The API will be available at:

```text
http://localhost:8001
```

Interactive Swagger documentation:

```text
http://localhost:8001/docs
```

---

### 2. Command Line Inference

#### Food Detection

```bash
python main.py path/to/image.jpg food
```

#### Gym Equipment Detection

```bash
python main.py path/to/image.jpg gym
```

Results are printed as JSON and annotated images are saved to the appropriate output directory.

---

### 3. Profile Theme Generation

Generate a UI color theme from an image:

```bash
python profile_theme.py path/to/profile_pic.jpg
```

Returns:

* Dominant color
* Secondary complementary color
* Recommended text color
* CSS gradient string

---

## API Endpoints

### POST `/predict/food`

Upload a food image and detect food items.

**Confidence Threshold:** > 10%

Example response:

```json
{
  "found": [
    {
      "food": "Pizza",
      "confidence": 0.85
    },
    {
      "food": "Tomato",
      "confidence": 0.62
    }
  ]
}
```

---

### POST `/predict/gym`

Upload an image containing gym equipment.

**Confidence Threshold:** > 50%

Example response:

```json
{
  "found": [
    {
      "item": "treadmill",
      "confidence": 0.92
    }
  ]
}
```

---

## Model Training

### Download Dataset

The dataset is managed through Roboflow.

Download the latest YOLO-formatted dataset:

```bash
python prenos_podatkov.py
```

### Train the Model

```bash
python train.py
```

Training configuration:

| Parameter  | Value   |
| ---------- | ------- |
| Model      | YOLO11m |
| Epochs     | 150     |
| Image Size | 640     |
| Batch Size | 8       |
| Patience   | 25      |
| Device     | GPU (0) |

Resume interrupted training:

```bash
python resume.py
```

---

## Performance (Food Model)

Latest training results:

* mAP50: 0.633
* Dataset Size: 9,339 images
* Instances: 23,881

Top performing classes:

| Class             | mAP50 |
| ----------------- | ----- |
| Rice              | 0.815 |
| French Fries      | 0.815 |
| Mung Bean Sprouts | 0.927 |
| Pizza             | 0.781 |

---

## Project Structure

```text
├── api.py               # FastAPI server setup and routes
├── main.py              # YOLO inference and JSON formatting
├── process.py           # Image preprocessing
├── profile_theme.py     # Theme generation utility
├── train.py             # YOLO11 training configuration
├── resume.py            # Resume training utility
├── prenos_podatkov.py   # Roboflow dataset download script
└── models/
    ├── food/
    │   └── best.pt
    └── gym/
        └── best.pt
```
****

from dataclasses import dataclass


@dataclass
class RecognitionPrediction:
    label: str
    confidence: float
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import numpy as np

app = FastAPI(title="LifeGuard AI Service", version="0.1.0")


class SymptomRequest(BaseModel):
    symptoms: List[str]


class LifestyleRequest(BaseModel):
    age: int
    weight: float
    height: float
    exercise_level: str
    sleep_hours: float
    stress_level: int
    diet_quality: str


def simple_softmax(scores: List[float]) -> List[float]:
    arr = np.array(scores)
    exps = np.exp(arr - np.max(arr))
    probs = exps / exps.sum()
    return probs.tolist()


@app.get("/health")
async def health():
    return {"status": "ok", "service": "lifeguard-ai"}


@app.post("/symptom-check")
async def symptom_check(body: SymptomRequest) -> Dict:
    # Placeholder probabilities
    labels = ["Flu", "Viral Infection", "COVID Risk"]
    probs = simple_softmax([0.7, 0.3, 0.2])
    return {
        "symptoms": body.symptoms,
        "predictions": [{"condition": label, "probability": round(prob, 3)} for label, prob in zip(labels, probs)]
    }


@app.post("/risk-predict")
async def risk_predict(body: LifestyleRequest) -> Dict:
    base = body.stress_level * 0.03 + (body.age / 120)
    heart = min(0.95, base + 0.2)
    diabetes = min(0.95, base + 0.15)
    stress = min(0.95, base + 0.25)
    return {
        "risks": {
          "heart_disease": round(heart, 3),
          "diabetes": round(diabetes, 3),
          "stress": round(stress, 3)
        }
    }

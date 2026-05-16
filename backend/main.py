from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import json
import os
import pandas as pd
try:
    from .schemas import PredictionRequest, PredictionResponse, MetadataResponse
except ImportError:
    from schemas import PredictionRequest, PredictionResponse, MetadataResponse

app = FastAPI(title="Car Price Prediction API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load model and metadata
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', 'ml_engine', 'car_price_pipeline.pkl')
METADATA_PATH = os.path.join(os.path.dirname(__file__), '..', 'ml_engine', 'metadata.json')

model = None
metadata = None

def load_resources():
    global model, metadata
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
    if os.path.exists(METADATA_PATH):
        with open(METADATA_PATH, 'r') as f:
            metadata = json.load(f)

@app.on_event("startup")
async def startup_event():
    load_resources()

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.get("/metadata", response_model=MetadataResponse)
def get_metadata():
    if not metadata:
        # Try loading again in case training just finished
        load_resources()
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found. Model training might be in progress.")
    return metadata

@app.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest):
    if not model:
        load_resources()
    if not model:
        raise HTTPException(status_code=404, detail="Model not found. Model training might be in progress.")
    
    # Prepare data for prediction
    input_df = pd.DataFrame([request.dict()])
    
    # Predict
    try:
        prediction = model.predict(input_df)[0]
        # Calculate a simple confidence range (±5%)
        # In a real scenario, this could be based on prediction variance or MAE
        confidence_range = prediction * 0.05
        
        return {
            "predicted_price": float(prediction),
            "confidence_range_min": float(prediction - confidence_range),
            "confidence_range_max": float(prediction + confidence_range)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/get_brands")
def get_brands():
    if not metadata:
        load_resources()
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found.")
    return metadata['companies']

@app.get("/get_models/{company}")
def get_models(company: str):
    if not metadata:
        load_resources()
    if not metadata:
        raise HTTPException(status_code=404, detail="Metadata not found.")
    
    models = metadata['models_by_company'].get(company)
    if not models:
        raise HTTPException(status_code=404, detail=f"No models found for company: {company}")
    return models

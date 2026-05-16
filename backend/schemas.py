from pydantic import BaseModel, Field
from typing import List, Dict

class PredictionRequest(BaseModel):
    name: str = Field(..., example="Maruti Swift Dzire VDI")
    company: str = Field(..., example="Maruti")
    year: int = Field(..., ge=1900, le=2100, example=2014)
    kms_driven: int = Field(..., ge=0, example=145500)
    fuel_type: str = Field(..., example="Diesel")

class PredictionResponse(BaseModel):
    predicted_price: float
    confidence_range_min: float
    confidence_range_max: float

class MetadataResponse(BaseModel):
    companies: List[str]
    years: List[int]
    fuel_types: List[str]
    models_by_company: Dict[str, List[str]]

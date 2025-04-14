from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class Character(BaseModel):
    name: str
    type: Optional[str] = None
    description: Optional[str] = None
    actions: Optional[str] = None

class Prop(BaseModel):
    name: str
    importance: str = "medium"  # high, medium, low
    description: Optional[str] = None

class Scene(BaseModel):
    number: str
    location: str
    time: str
    description: str
    characters: List[Character]
    props: List[Prop]
    technical_requirements: Optional[str] = None
    estimated_duration: float  # in hours
    special_notes: Optional[str] = None

class ScriptAnalysis(BaseModel):
    script_id: str
    filename: str
    upload_time: datetime
    scenes: List[Scene]
    characters: List[Character]
    props: List[Prop]
    statistics: dict
    status: str = "completed"  # pending, processing, completed, failed 
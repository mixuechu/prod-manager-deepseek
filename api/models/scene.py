from typing import List, Optional
from .base import TimestampedModel, StatusModel
from pydantic import BaseModel
from datetime import datetime

class SceneCharacter(TimestampedModel):
    name: str
    role: str = "supporting"
    actions: List[str] = []

class SceneProp(TimestampedModel):
    name: str
    importance: str = "low"
    description: Optional[str] = None
    quantity: int = 1

class Scene(TimestampedModel):
    number: int
    project_id: str
    location: str
    time: str
    characters: List[SceneCharacter] = []
    props: List[SceneProp] = []
    special_notes: Optional[str] = None
    technical_requirements: List[str] = []
    estimated_duration: int = 0  # in minutes
    shooting_suggestions: List[str] = []
    status: Optional[StatusModel] = None

class Character(BaseModel):
    name: str
    actions: str

class Prop(BaseModel):
    name: str
    importance: str  # high, medium, low

class SceneStatus(BaseModel):
    status: str  # pending, in_progress, completed
    progress: float
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    notes: Optional[str] = None

class SceneDetail(BaseModel):
    number: str
    location: str
    time: str
    description: str
    characters: List[Character]
    props: List[Prop]
    technical_requirements: Optional[str] = None
    estimated_duration: float
    special_notes: Optional[str] = None
    status: Optional[SceneStatus] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

class SceneUpdate(BaseModel):
    location: Optional[str] = None
    time: Optional[str] = None
    description: Optional[str] = None
    characters: Optional[List[Character]] = None
    props: Optional[List[Prop]] = None
    technical_requirements: Optional[str] = None
    estimated_duration: Optional[float] = None
    special_notes: Optional[str] = None
    status: Optional[SceneStatus] = None

class ScriptAnalysis(TimestampedModel):
    scenes: List[Scene]
    characters: List[Character] 
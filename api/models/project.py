from typing import List, Optional
from datetime import date
from .base import TimestampedModel, StatusModel

class ProjectMember(TimestampedModel):
    name: str
    role: str
    contact: Optional[str] = None

class Project(TimestampedModel):
    title: str
    description: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: StatusModel = StatusModel(status="planned")
    team: List[ProjectMember] = []
    budget: Optional[float] = None
    genre: Optional[str] = None
    tags: List[str] = []

class ProjectStats(TimestampedModel):
    scene_stats: dict
    character_stats: dict
    prop_stats: dict 
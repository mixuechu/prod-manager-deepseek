from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class TimestampedModel(BaseModel):
    created_at: str = datetime.now().isoformat()
    updated_at: str = datetime.now().isoformat()

class StatusModel(BaseModel):
    status: str
    progress: int = 0
    start_time: Optional[str] = None
    end_time: Optional[str] = None
    notes: Optional[str] = None
    issues: List[str] = [] 
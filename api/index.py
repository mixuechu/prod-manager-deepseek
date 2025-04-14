from fastapi import FastAPI, HTTPException
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timedelta
from itertools import groupby
from operator import itemgetter
from fastapi.responses import JSONResponse
import json

app = FastAPI()

# MongoDB connection
client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.film_production
scenes_collection = db.scenes
projects_collection = db.projects

class ProjectStats(BaseModel):
    total_scenes: int
    completed_scenes: int
    in_progress_scenes: int
    pending_scenes: int
    total_characters: int
    total_props: int
    avg_scene_duration: float
    top_characters: List[Dict[str, Any]]
    top_props: List[Dict[str, Any]]
    total_duration: float
    completion_percentage: float

class ScheduleUpdate(BaseModel):
    scene_number: str
    date: str
    start_time: str
    end_time: str

class BudgetItem(BaseModel):
    category: str
    description: str
    amount: float
    status: str  # planned, approved, spent
    date: str
    notes: Optional[str] = None

class BudgetUpdate(BaseModel):
    items: List[BudgetItem]

@app.get("/")
async def root():
    return {"message": "AI Film Production Management System API"}

@app.get("/api/projects/{project_id}/stats", response_model=ProjectStats)
async def get_project_stats(project_id: str):
    try:
        # Get all scenes for the project
        scenes = await scenes_collection.find({"project_id": project_id}).to_list(None)
        
        if not scenes:
            raise HTTPException(status_code=404, detail="Project not found or has no scenes")
        
        # Calculate statistics
        total_scenes = len(scenes)
        completed_scenes = sum(1 for scene in scenes if scene.get("status", {}).get("status") == "completed")
        in_progress_scenes = sum(1 for scene in scenes if scene.get("status", {}).get("status") == "in_progress")
        pending_scenes = total_scenes - completed_scenes - in_progress_scenes
        
        # Character statistics
        all_characters = []
        for scene in scenes:
            all_characters.extend(scene.get("characters", []))
        
        character_counts = {}
        for char in all_characters:
            name = char.get("name")
            if name:
                character_counts[name] = character_counts.get(name, 0) + 1
        
        top_characters = [
            {"name": name, "count": count}
            for name, count in sorted(character_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]
        
        # Prop statistics
        all_props = []
        for scene in scenes:
            all_props.extend(scene.get("props", []))
        
        prop_counts = {}
        for prop in all_props:
            name = prop.get("name")
            if name:
                prop_counts[name] = prop_counts.get(name, 0) + 1
        
        top_props = [
            {"name": name, "count": count}
            for name, count in sorted(prop_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        ]
        
        # Duration statistics
        total_duration = sum(scene.get("estimated_duration", 0) for scene in scenes)
        avg_scene_duration = total_duration / total_scenes if total_scenes > 0 else 0
        
        # Calculate completion percentage
        completion_percentage = (completed_scenes / total_scenes * 100) if total_scenes > 0 else 0
        
        return ProjectStats(
            total_scenes=total_scenes,
            completed_scenes=completed_scenes,
            in_progress_scenes=in_progress_scenes,
            pending_scenes=pending_scenes,
            total_characters=len(character_counts),
            total_props=len(prop_counts),
            avg_scene_duration=avg_scene_duration,
            top_characters=top_characters,
            top_props=top_props,
            total_duration=total_duration,
            completion_percentage=completion_percentage
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}/schedule")
async def get_project_schedule(project_id: str):
    try:
        # Get all scenes for the project
        scenes = await scenes_collection.find({"project_id": project_id}).to_list(None)
        
        # Sort scenes by date and filter out unscheduled scenes
        scheduled_scenes = []
        for scene in scenes:
            if scene.get("status") and scene["status"].get("start_time"):
                date = datetime.fromisoformat(scene["status"]["start_time"]).date().isoformat()
                start_time = datetime.fromisoformat(scene["status"]["start_time"]).strftime("%H:%M")
                end_time = (datetime.fromisoformat(scene["status"]["start_time"]) + 
                          timedelta(hours=scene["estimated_duration"])).strftime("%H:%M")
                
                scheduled_scenes.append({
                    "number": scene["number"],
                    "date": date,
                    "startTime": start_time,
                    "endTime": end_time,
                    "location": scene["location"],
                    "characters": scene["characters"],
                    "estimated_duration": scene["estimated_duration"],
                    "status": scene["status"]
                })
        
        # Group scenes by date
        scheduled_scenes.sort(key=itemgetter("date"))
        schedule = []
        for date, scenes in groupby(scheduled_scenes, key=itemgetter("date")):
            schedule.append({
                "date": date,
                "scenes": list(scenes)
            })
        
        return schedule
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/projects/{project_id}/schedule")
async def update_project_schedule(project_id: str, schedule_update: ScheduleUpdate):
    try:
        # Validate scene exists
        scene = await scenes_collection.find_one({
            "project_id": project_id,
            "number": schedule_update.scene_number
        })
        if not scene:
            raise HTTPException(status_code=404, detail="Scene not found")
        
        # Update scene schedule
        start_datetime = f"{schedule_update.date}T{schedule_update.start_time}"
        end_datetime = f"{schedule_update.date}T{schedule_update.end_time}"
        
        update_result = await scenes_collection.update_one(
            {"project_id": project_id, "number": schedule_update.scene_number},
            {"$set": {
                "status.start_time": start_datetime,
                "status.end_time": end_datetime
            }}
        )
        
        if update_result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update scene schedule")
        
        # Log the schedule update
        await projects_collection.update_one(
            {"_id": project_id},
            {"$push": {
                "activity_log": {
                    "action": "schedule_update",
                    "scene_number": schedule_update.scene_number,
                    "timestamp": datetime.utcnow().isoformat(),
                    "details": f"Updated schedule for scene {schedule_update.scene_number}"
                }
            }}
        )
        
        return {"message": "Schedule updated successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}/report")
async def generate_project_report(project_id: str, report_type: str = "full"):
    try:
        # Get project details
        project = await projects_collection.find_one({"_id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")

        # Get all scenes for the project
        scenes = await scenes_collection.find({"project_id": project_id}).to_list(None)
        
        report_data = {
            "project": {
                "title": project["title"],
                "description": project.get("description", ""),
                "created_at": project.get("created_at", ""),
                "status": project.get("status", ""),
            },
            "generated_at": datetime.utcnow().isoformat(),
            "summary": {
                "total_scenes": len(scenes),
                "completed_scenes": sum(1 for s in scenes if s.get("status", {}).get("status") == "completed"),
                "total_duration": sum(s.get("estimated_duration", 0) for s in scenes),
                "total_characters": len(set(char["name"] for s in scenes for char in s.get("characters", []))),
                "total_props": len(set(prop["name"] for s in scenes for prop in s.get("props", [])))
            }
        }

        if report_type == "full":
            # Group props by importance
            all_props = []
            for scene in scenes:
                for prop in scene.get("props", []):
                    all_props.append({
                        "name": prop["name"],
                        "importance": prop["importance"],
                        "scene_number": scene["number"]
                    })
            
            props_by_importance = {
                "high": [],
                "medium": [],
                "low": []
            }
            for prop in all_props:
                props_by_importance[prop["importance"]].append(prop)

            # Get character appearances
            character_appearances = {}
            for scene in scenes:
                for char in scene.get("characters", []):
                    if char["name"] not in character_appearances:
                        character_appearances[char["name"]] = []
                    character_appearances[char["name"]].append(scene["number"])

            report_data["detailed"] = {
                "scenes": [{
                    "number": s["number"],
                    "location": s["location"],
                    "estimated_duration": s["estimated_duration"],
                    "status": s.get("status", {}),
                    "characters": s.get("characters", []),
                    "props": s.get("props", [])
                } for s in scenes],
                "props_by_importance": props_by_importance,
                "character_appearances": character_appearances
            }

        return JSONResponse(content=report_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/projects/{project_id}/budget")
async def get_project_budget(project_id: str):
    try:
        project = await projects_collection.find_one({"_id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        budget_items = project.get("budget", [])
        
        # Calculate budget summary
        total_planned = sum(item["amount"] for item in budget_items if item["status"] == "planned")
        total_approved = sum(item["amount"] for item in budget_items if item["status"] == "approved")
        total_spent = sum(item["amount"] for item in budget_items if item["status"] == "spent")
        
        # Group items by category
        items_by_category = {}
        for item in budget_items:
            category = item["category"]
            if category not in items_by_category:
                items_by_category[category] = []
            items_by_category[category].append(item)
        
        return {
            "items": budget_items,
            "summary": {
                "total_planned": total_planned,
                "total_approved": total_approved,
                "total_spent": total_spent
            },
            "by_category": items_by_category
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/projects/{project_id}/budget")
async def update_project_budget(project_id: str, budget_update: BudgetUpdate):
    try:
        project = await projects_collection.find_one({"_id": project_id})
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update budget items
        update_result = await projects_collection.update_one(
            {"_id": project_id},
            {
                "$set": {"budget": [item.dict() for item in budget_update.items]},
                "$push": {
                    "activity_log": {
                        "action": "budget_update",
                        "timestamp": datetime.utcnow().isoformat(),
                        "details": "Updated project budget"
                    }
                }
            }
        )
        
        if update_result.modified_count == 0:
            raise HTTPException(status_code=500, detail="Failed to update budget")
        
        return {"message": "Budget updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
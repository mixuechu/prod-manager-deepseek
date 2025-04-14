from fastapi import APIRouter, HTTPException
from typing import List
from ..models.project import Project, ProjectStats
from ..services.db_service import projects_collection, scenes_collection

router = APIRouter()

@router.post("/projects")
async def create_project(project: Project):
    result = await projects_collection.insert_one(project.dict())
    return {"id": str(result.inserted_id)}

@router.get("/projects")
async def get_projects() -> List[Project]:
    projects = await projects_collection.find().to_list(None)
    return [Project(**project) for project in projects]

@router.get("/projects/{project_id}")
async def get_project(project_id: str) -> Project:
    project = await projects_collection.find_one({"_id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return Project(**project)

@router.get("/projects/{project_id}/stats")
async def get_project_stats(project_id: str) -> ProjectStats:
    project = await projects_collection.find_one({"_id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    scenes = await scenes_collection.find({"project_id": project_id}).to_list(None)
    
    # Calculate statistics
    scene_stats = {
        "total_scenes": len(scenes),
        "completed_scenes": sum(1 for s in scenes if s.get("status", {}).get("status") == "completed"),
        "in_progress_scenes": sum(1 for s in scenes if s.get("status", {}).get("status") == "in_progress"),
        "planned_scenes": sum(1 for s in scenes if s.get("status", {}).get("status") == "planned")
    }
    
    # Character statistics
    characters = {}
    for scene in scenes:
        for char in scene.get("characters", []):
            name = char.get("name")
            if name:
                if name not in characters:
                    characters[name] = {"count": 0, "role": char.get("role", "supporting")}
                characters[name]["count"] += 1
    
    # Prop statistics
    props = {}
    for scene in scenes:
        for prop in scene.get("props", []):
            name = prop.get("name")
            if name:
                if name not in props:
                    props[name] = {"count": 0, "importance": prop.get("importance", "low")}
                props[name]["count"] += 1
    
    return ProjectStats(
        scene_stats=scene_stats,
        character_stats={"characters": characters},
        prop_stats={"props": props}
    ) 
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import List, Optional
from ..models.scene import Scene, ScriptAnalysis, SceneDetail, SceneUpdate
from ..services.db_service import scenes_collection
from ..services.ai_service import analyze_script
from ..services.scene_service import get_scene_by_number, update_scene
from datetime import datetime

router = APIRouter()

@router.post("/scenes/analyze")
async def analyze_script_route(file: UploadFile = File(...)) -> ScriptAnalysis:
    content = await file.read()
    text = content.decode()
    return await analyze_script(text)

@router.get("/projects/{project_id}/scenes")
async def get_project_scenes(project_id: str) -> List[Scene]:
    scenes = await scenes_collection.find({"project_id": project_id}).to_list(None)
    return [Scene(**scene) for scene in scenes]

@router.get("/scenes/{scene_number}")
async def get_scene(scene_number: int) -> Scene:
    scene = await scenes_collection.find_one({"number": scene_number})
    if not scene:
        raise HTTPException(status_code=404, detail="Scene not found")
    return Scene(**scene)

@router.put("/scenes/{scene_number}")
async def update_scene(scene_number: int, scene: Scene):
    result = await scenes_collection.update_one(
        {"number": scene_number},
        {"$set": scene.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Scene not found")
    return {"message": "Scene updated successfully"}

@router.get("/{scene_number}", response_model=SceneDetail)
async def get_scene(scene_number: str):
    try:
        scene = await get_scene_by_number(scene_number)
        if not scene:
            raise HTTPException(status_code=404, detail="场景不存在")
        return scene
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{scene_number}", response_model=SceneDetail)
async def update_scene_details(scene_number: str, scene_update: SceneUpdate):
    try:
        # 检查场景是否存在
        existing_scene = await get_scene_by_number(scene_number)
        if not existing_scene:
            raise HTTPException(status_code=404, detail="场景不存在")
        
        # 更新场景信息
        updated_scene = await update_scene(scene_number, scene_update)
        
        # 记录更新历史
        update_time = datetime.now()
        await db.scene_history.insert_one({
            "scene_number": scene_number,
            "update_time": update_time,
            "changes": scene_update.dict(),
            "type": "edit"
        })
        
        return updated_scene
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 
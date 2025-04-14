from typing import Optional
from ..models.scene import SceneDetail, SceneUpdate
from motor.motor_asyncio import AsyncIOMotorClient

client = AsyncIOMotorClient("mongodb://localhost:27017")
db = client.film_production
scenes_collection = db.scenes

async def get_scene_by_number(scene_number: str) -> Optional[SceneDetail]:
    """
    根据场景编号获取场景详情
    """
    scene = await scenes_collection.find_one({"number": scene_number})
    if scene:
        return SceneDetail(**scene)
    return None

async def update_scene(scene_number: str, scene_update: SceneUpdate) -> SceneDetail:
    """
    更新场景信息
    """
    update_data = scene_update.dict(exclude_unset=True)
    
    # 更新场景信息
    result = await scenes_collection.find_one_and_update(
        {"number": scene_number},
        {"$set": update_data},
        return_document=True
    )
    
    if not result:
        raise ValueError("场景不存在")
    
    return SceneDetail(**result) 
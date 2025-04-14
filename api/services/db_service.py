from motor.motor_asyncio import AsyncIOMotorClient
from ..config.settings import MONGODB_URL, DATABASE_NAME

# Initialize MongoDB client
client = AsyncIOMotorClient(MONGODB_URL)
db = client[DATABASE_NAME]

# Collections
scenes_collection = db.scenes
characters_collection = db.characters
projects_collection = db.projects

# Export collections for use in other modules
__all__ = [
    "scenes_collection",
    "characters_collection",
    "projects_collection"
] 
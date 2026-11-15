from fastapi import APIRouter

from app.models.schemas import PostRequest
from app.services.platform_manager import platform_manager

router = APIRouter()


@router.post("/posting")
async def create_post(request: PostRequest):

    return await platform_manager.publish(request.message)
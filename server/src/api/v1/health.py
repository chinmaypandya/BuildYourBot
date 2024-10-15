from fastapi import APIRouter

router = APIRouter(prefix='/health')

@router.get('/')
async def check_heath():
    return 'API running properly'
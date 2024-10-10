from fastapi import APIRouter

router = APIRouter(prefix='/v1')

@router.get('/health')
async def check_heath():
    return 'API running properly'
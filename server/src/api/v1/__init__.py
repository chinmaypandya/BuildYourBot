from fastapi import APIRouter, Request

router = APIRouter(prefix='/v1/chat')

@router.get('/health')
async def check_heath():
    return 'API running properly'

@router.get('/')
async def create_graph(request: Request):
    pass
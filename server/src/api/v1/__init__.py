from fastapi import APIRouter, Request

from IPython.display import Image, display
from langchain_core.runnables.graph import CurveStyle, MermaidDrawMethod, NodeStyles

from ..models.chat import ChatRequest
from src.buildyourbot.graph import get_graph
router = APIRouter(prefix='/v1/chat')

@router.get('/health')
async def check_heath():
    return 'API running properly'

@router.get('/graph/create')
async def create_graph(request: Request, chat_request: ChatRequest):
    graph = get_graph(**(chat_request.model_dump())).get_workflow()
    
    try:
        display(
            Image(
                graph.get_graph().draw_mermaid_png(
                    draw_method=MermaidDrawMethod.API,
                )
            )
        )    
    except Exception as e:
        print("Cannot Display png")
    
    return graph.get_graph().draw_mermaid
    
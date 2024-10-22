from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

from IPython.display import Image, display
from langchain_core.runnables.graph import CurveStyle, MermaidDrawMethod, NodeStyles

from ..models.chat import ChatRequest
from src.buildyourbot.graph import get_graph
from src.buildyourbot.cache import cache_graph_data, get_cached_graph_data


router = APIRouter(prefix='/v1/chat')

@router.get('/health')
async def check_heath():
    return 'API running properly'

@router.post('/graph/create')
async def create_graph(request: Request, graph_data: ChatRequest):
    graph = get_graph(
        graph_id=graph_data.graph_id,
        nodes=graph_data.nodes,
        name=graph_data.name,
        description=graph_data.description
    ).get_workflow()
    
    try:
        display(
            Image(
                graph.get_graph().draw_mermaid_png(
                    draw_method=MermaidDrawMethod.API,
                )
            )
        )
        
        cache_graph_data(
            graph_id=graph_data.graph_id,
            nodes=graph_data.nodes,
            name=graph_data.name,
            description=graph_data.description
        )
        
        print(get_cached_graph_data(graph_data.graph_id))
        
    except Exception as e:
        print("Cannot Display png")
    
    # Generate the image as bytes
    image_bytes = graph.get_graph().draw_mermaid_png(draw_method=MermaidDrawMethod.API)

    # Save the image to a file
    image_path = "./graph_image.png"
    with open(image_path, "wb") as f:
        f.write(image_bytes)
    
    
    return FileResponse(image_path, media_type="image/png", filename="graph_image.png")
    
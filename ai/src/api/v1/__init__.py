from fastapi import APIRouter, Request
from fastapi.responses import FileResponse

from IPython.display import Image, display
from langchain_core.runnables.graph import MermaidDrawMethod
from langchain_core.messages import HumanMessage

from ..models.chat import CreateGraphRequest, ChatRequest
from src.buildyourbot.graph import get_graph
from src.buildyourbot.cache import cache_graph_data, get_cached_graph_data


router = APIRouter(prefix='/v1')

@router.get('/health')
async def check_heath():
    return 'API running properly'

@router.post('/graph/create')
async def create_graph(request: Request, graph_data: CreateGraphRequest):
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

@router.post("/chat")
async def generate_response(request: Request, chat_request: ChatRequest):
    graph_data = get_cached_graph_data(chat_request.graph_id)
    
    graph = get_graph(
        graph_id=graph_data["graph_id"],
        nodes=graph_data["nodes"],
        name=graph_data["name"],
        description=graph_data["description"]
    ).get_workflow()
    
    state = graph.a_invoke({
        "messages": [HumanMessage(chat_request.user_message)]
    })
    
    ai_response = state["messages"][-1]
    
    return ai_response
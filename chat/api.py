from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import redis

# Initialize Redis connection
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

app = FastAPI()

# Configure CORS middleware
origins = [
    "http://localhost:8501",  # Allow requests from the Streamlit app

]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

# Model to define the POST request payload structure
class GraphData(BaseModel):
    description: str
    nodes:str

# Endpoint to handle graph_id check and storage
@app.post("/c/{graph_id}")
async def store_graph_data(graph_id: str, data: GraphData):
    # Check if graph_id already exists in Redis
    if not redis_client.exists(graph_id):
        # Store the description in Redis with graph_id as key
        redis_client.set(graph_id, data.description, data.nodes)
        return {"message": f"Data saved for graph_id: {graph_id}"}
    else:
        return {"message": f"Graph ID '{graph_id}' already exists."}

# Endpoint to retrieve data for the given graph_id
@app.get("/c/{graph_id}")
async def get_graph_data(graph_id: str):
    # Fetch the description from Redis
    description = redis_client.get(graph_id)
    nodes = redis_client.get(graph_id)
    if description and nodes:
        return {"graph_id": graph_id, "description": description , "nodes": nodes}
    else:
        raise HTTPException(status_code=404, detail="Graph ID not found.")

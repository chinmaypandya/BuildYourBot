import redis
import pickle

def cache_graph_data(**kwargs):
    # Create a Redis client
    redis_client = redis.Redis(host='redis', port=6379)

    # Your object (can be any Python object)
    my_object = {}
    
    for key, value in kwargs.items():
        my_object[key] = value

    # Serialize object using pickle and store it in Redis
    redis_client.set(kwargs["graph_id"], pickle.dumps(my_object))
    
    return "Done"

def get_cached_graph_data(graph_id:str):
    redis_client = redis.Redis(host='redis', port=6379)
    retrieved_object = pickle.loads(redis_client.get(graph_id))
    return retrieved_object
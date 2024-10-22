import redis
import pickle

def cache_graph_data(**kwargs):
    # Create a Redis client
    r = redis.Redis(host='redis', port=6379)

    # Your object (can be any Python object)
    my_object = {}
    
    for key, value in kwargs.items():
        my_object[key] = value

    # Serialize object using pickle and store it in Redis
    r.set(kwargs["graph_id"], pickle.dumps(my_object))
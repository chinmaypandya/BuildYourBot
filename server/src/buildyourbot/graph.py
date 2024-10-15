from functools import cache
from collections import defaultdict

from langgraph.graph import END, StateGraph, START

from src.buildyourbot.agents.simple import get_simple_agent

class Graph:
    def __init__(self, graph_id, state, nodes, edges, llm):
        self.__id = graph_id
        self.__state = state
        self.__nodes = nodes
        self.__edges = edges
        self.__llm = llm
    
    @cache
    def get_workflow(self):
        self.__workflow = StateGraph(self.__state)
        
        for node in self.__nodes:
            if node["type"] == "router":
                pass
            else:
                agent = get_simple_agent(node, self.__llm)
            
            self.__workflow.add_node(agent.get_name(), agent.node)
    
    @cache
    def derive_simple_edges(self):
        # Step 1: Organize data by id and parent_id
        id_to_name = {item["id"]: item["name"] for item in self.__nodes}
        parent_to_children = defaultdict(list)
        
        # Keep track of which nodes are parents or children
        all_ids = set()
        
        for item in self.__nodes:
            all_ids.add(item["id"])
            parent_id = item["parent_id"]
            if parent_id is not None:
                parent_to_children[parent_id].append(item["id"])

        # Nodes without parent ids are START nodes
        start_nodes = [id_to_name[item["id"]] for item in self.__nodes if item["parent_id"] is None]
        
        # Nodes without children are END nodes
        end_nodes = [id_to_name[node_id] for node_id in all_ids if node_id not in parent_to_children]

        # Step 2: Derive simple edges (a, b) form
        simple_edges = []
        
        # Create edges for parent-child relationships
        for parent_id, children in parent_to_children.items():
            parent_name = id_to_name[parent_id]
            for child_id in children:
                child_name = id_to_name[child_id]
                simple_edges.append((parent_name, child_name))
        
        # Add START and END edges
        for start in start_nodes:
            simple_edges.append((START, start))
        for end in end_nodes:
            simple_edges.append((end, END))

        return simple_edges
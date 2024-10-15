from functools import cache
from langgraph.graph import END, StateGraph, START

class Graph:
    @cache
    def __init__(self, graph_id, state, nodes, edges):
        self.__id = graph_id
        self.__state = state
        self.__nodes = nodes
        self.__edges = edges
    
    @cache
    def get_workflow(self):
        self.__node_map = {}
        for node in self.__nodes:
            # self.__node_map[node['name']] = node_type_map[node['node']]
            pass
        
        self.__workflow = StateGraph(self.__state)
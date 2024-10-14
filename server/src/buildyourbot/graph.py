from functools import cache
from langgraph.graph import END, StateGraph, START

class Graph:
    def __init__(self, graph_id, state, nodes, edges):
        self.__id = graph_id
        self.__state = state
        self.__nodes = nodes
        self.__edges = edges
    
    @cache
    def get_workflow(self):
        self.__workflow = StateGraph(self.__state)
        
        for node in self.__nodes:
            pass
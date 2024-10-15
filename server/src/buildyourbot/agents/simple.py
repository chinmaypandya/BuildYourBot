from langchain_core.prompts import ChatPromptTemplate

from src.buildyourbot.models import SimpleNode

class SimpleAgent:
    def __init__(self, node: SimpleNode):
        self.__id = node['id']
        self.__name = node['name']
        self.__persona = node['persona']
        self.__dos = node['dos']
        self.__donts = node['donts']
        self.__examples = node['examples']
    
    def create(self):
        self.prompt
from functools import cache

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.runnables import RunnableConfig

from src.buildyourbot.models.simple import SimpleNode
from src.buildyourbot.state import State

class SimpleAgent:
    def __init__(self, node: dict, llm):
        node = SimpleAgent(**node).model_dump()
        
        self.__id = node['id']
        self.__parent_id = node['parent_id']
        self.__name = node['name']
        self.__persona = node['persona']
        self.__dos = node['dos']
        self.__donts = node['donts']
        self.__examples = node['examples']
        self.__llm = llm
        
        self.__prompt = ChatPromptTemplate.from_messages([
            SystemMessage(
                f"""You are {self.__persona}
                    Your jobs are to:
                    {self.__dos}
                    Make sure you follow these:
                    {self.__donts}
                    Here are some response examples for you:
                    {self.__examples}
                """
            ),
            MessagesPlaceholder("messages")    
        ])
        
        self.__agent = self.__prompt | self.__llm
    
    @cache
    async def node(self, state: State, config: RunnableConfig) -> dict:
        result = self.__agent.a_invoke(state, config)
        result.name = self.__name
        return {
            "messages": [result]
        }
    
    def get_id(self) -> str:
        return self.__id
    
    def get_parent_id(self) -> str:
        return self.__parent_id
    
    def get_name(self) -> str:
        return self.__name

@cache
def get_simple_agent(node: SimpleNode, llm) -> SimpleAgent:
    return SimpleAgent(node=node, llm=llm)
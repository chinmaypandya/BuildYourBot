from functools import cache

from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, BaseMessage
from langchain_core.runnables import RunnableConfig

from src.buildyourbot.models import SimpleNode
from src.buildyourbot.state import State

class SimpleAgent:
    def __init__(self, node: SimpleNode, llm):
        self.__id = node['id']
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
    def node(self, state: State, config: RunnableConfig):
        result = self.__agent.a_invoke(state, config)
        result.name = self.__name
        return {
            "messages": [result]
        }
from typing import List, Optional, Literal, Union, Dict, Any
from pydantic import BaseModel, Field
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from .llm import gemini_model
from ..utils.prompts import MERMAID_SYSTEM_PROMPT

# Define the diagram types
DiagramType = Literal[
    "flowchart", "sequence", "class", "state", "entity_relationship", 
    "user_journey", "gantt", "pie", "quadrant", "requirement", "gitgraph", 
    "c4", "mindmap", "timeline", "zenuml", "sankey", "xy_chart", "block", 
    "packet", "kanban", "architecture", "radar", "treemap"
]

class ResponseBlock(BaseModel):
    """A single response block that can be either text or diagram."""
    type: Literal["explanation", "diagram"] = Field(description="Type of block")
    title: str = Field(description="Title of the block", min_length=1, max_length=100)
    content: Optional[str] = Field(default=None, description="Content - either markdown text or mermaid code (can be None for empty diagrams)", max_length=5000)
    diagram_type: Optional[DiagramType] = Field(default=None, description="Diagram type if this is a diagram block")

class ChatbotResponse(BaseModel):
    """Simple response structure with alternating blocks."""
    blocks: List[ResponseBlock] = Field(description="List of explanation and diagram blocks", min_items=1, max_items=100)
    summary: str = Field(description="Brief summary of the response", min_length=1, max_length=200)

# Custom message model for history storage
class HistoryMessage(BaseModel):
    role: str
    content: Union[str, Dict[str, Any]]

class MermaidChatbot:
    """Simple AI chatbot that explains concepts with text and mermaid diagrams."""
    
    def __init__(self):
        self.model = gemini_model
        self.structured_model = self.model.with_structured_output(ChatbotResponse)
    
    def generate_response(self, query: str, history: Optional[List[dict]] = None) -> ChatbotResponse:
        """
        Generate response with explanations and diagrams.
        
        Args:
            query: User's question
            history: Chat history in format [{"role": "user/agent", "content": ...}]
        
        Returns:
            ChatbotResponse with alternating explanation and diagram blocks
        """
        
        try:
            messages = [SystemMessage(content=MERMAID_SYSTEM_PROMPT)]
            if history:
                for entry in history:
                    if entry["role"] == "user":
                        messages.append(HumanMessage(content=entry["content"]))
                    elif entry["role"] == "agent":
                        content = entry["content"]
                        if isinstance(content, dict):
                            content = str(content)
                        messages.append(AIMessage(content=content))
            messages.append(HumanMessage(content=f"{query}"))
            response = self.structured_model.invoke(messages)
            return response
            
        except Exception as e:
            # Return simple error response
            return ChatbotResponse(
                blocks=[
                    ResponseBlock(
                        type="explanation",
                        title="Error",
                        content=f"I encountered an error: {str(e)}. Please try again with a different question."
                    )
                ],
                summary="Error occurred during processing"
            )

# Simple usage function
def create_mermaid_chatbot():
    """Create and return a simple chatbot instance."""
    return MermaidChatbot()
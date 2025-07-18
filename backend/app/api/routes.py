from fastapi import APIRouter, Form
from fastapi.responses import JSONResponse
from app.services.mermaid_services import create_mermaid_chatbot

router = APIRouter()

@router.post("/")
async def mermaid_chatbot_endpoint(user_input: str = Form(...)):
    if not user_input:
        return JSONResponse(status_code=400, content={"error": "Missing 'user_input' in request body."})
    chatbot = create_mermaid_chatbot()
    response = chatbot.generate_response(user_input)
    return JSONResponse(content=response.dict())
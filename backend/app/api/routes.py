from fastapi import APIRouter, Request, Path
from fastapi.responses import JSONResponse
from app.services.mermaid_services import create_mermaid_chatbot
from app.services.user import sync_user
from app.utils.auth import is_signed_in
from app.models.users import collection

router = APIRouter()

@router.post("/api/chat/{chatid}")
async def mermaid_chatbot_endpoint(request: Request, chatid: str = Path(...)):
    if chatid == "new":
        return JSONResponse(status_code=400, content={"error": "Invalid chat id: 'new' is not allowed."})
    user_id = is_signed_in(request)
    if not user_id:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    data = await request.json()
    user_input = data.get("user_input")
    history = data.get("history") if "history" in data else None
    if not user_input:
        return JSONResponse(status_code=400, content={"error": "Missing 'user_input' in request body."})
    chatbot = create_mermaid_chatbot()
    response = chatbot.generate_response(user_input, history=history)

    # Store the message in MongoDB under the user's chat with chatid
    user = collection.find_one({"user_id": user_id})
    if user:
        chats = user.get("chats", [])
        chat_idx = next((i for i, c in enumerate(chats) if c["chat_id"] == chatid), None)
        user_msg = {"role": "user", "content": user_input}
        ai_msg = {"role": "agent", "content": response.dict()}
        if chat_idx is not None:
            # Check if the chat history has reached the limit
            if len(chats[chat_idx]["history"]) >= 20:
                return JSONResponse(
                    status_code=400,
                    content={"error": "Maximum limit of conversation reached, please start a new conversation."}
                )
            # Append to existing chat
            chats[chat_idx]["history"].append(user_msg)
            chats[chat_idx]["history"].append(ai_msg)
        else:
            # If already 10 chats, remove the oldest
            if len(chats) >= 10:
                chats.pop(0)
            # Create new chat
            chats.append({"chat_id": chatid, "history": [user_msg, ai_msg]})
        collection.update_one({"user_id": user_id}, {"$set": {"chats": chats}})

    return JSONResponse(content=response.dict())

@router.get("/api/get-history/{chatid}")
async def get_chat_history(request: Request, chatid: str = Path(...)):
    user_id = is_signed_in(request)
    if not user_id:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    user = collection.find_one({"user_id": user_id})
    if not user:
        return JSONResponse(content={"history": []})
    chats = user.get("chats", [])
    chat = next((c for c in chats if c["chat_id"] == chatid), None)
    if not chat:
        return JSONResponse(content={"history": []})
    return JSONResponse(content={"history": chat["history"]})

@router.get("/api/chat-list")
async def get_chat_list(request: Request):
    user_id = is_signed_in(request)
    if not user_id:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    user = collection.find_one(
        {"user_id": user_id},
        {"_id": 0, "chats.chat_id": 1, "chats.history": {"$slice": 1}}
    )
    if not user or "chats" not in user:
        return JSONResponse(content={"chats": []})
    chat_summaries = [
        {
            "chat_id": chat["chat_id"],
            "first_message": chat["history"][0]["content"] if chat["history"] else ""
        }
        for chat in reversed(user["chats"])
    ]
    return JSONResponse(content={"chats": chat_summaries})

@router.post("/api/sync-user")
async def sync_user_route(request: Request):
    user_id = is_signed_in(request)
    if not user_id:
        return JSONResponse(status_code=401, content={"error": "Unauthorized"})
    data = await request.json()
    email = data.get("email")
    name = data.get("name")
    if not email or not name:
        return JSONResponse(status_code=400, content={"error": "Missing email or name."})
    user = sync_user(user_id, email, name)
    return JSONResponse(content=user)
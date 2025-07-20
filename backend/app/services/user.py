from app.models.users import collection

def sync_user(user_id: str, email: str, name: str):
    """
    Check if a user exists by user_id. If not, create the user with the required schema.
    Returns only user_id and email as a dict.
    """
    user = collection.find_one(
        { "user_id": user_id }, 
        { "user_id": 1, "email": 1 }
    )
    
    if user:
        return {"user_id": user["user_id"], "email": user["email"]}
    new_user = {
        "user_id": user_id,
        "email": email,
        "name": name,
        "chats": []
    }
    collection.insert_one(new_user)
    return {"user_id": user_id, "email": email}


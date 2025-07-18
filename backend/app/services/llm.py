import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
load_dotenv()

# Google Gemini 2.0 Flash model
def get_gemini_model():
    return ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        google_api_key=os.getenv("GOOGLE_API_KEY"),
        temperature=0.8,
    )

# Export the model instance for easy import
gemini_model = get_gemini_model()
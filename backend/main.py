from fastapi import FastAPI
from app.api.routes import router as mermaid_router

app = FastAPI()

app.include_router(mermaid_router)
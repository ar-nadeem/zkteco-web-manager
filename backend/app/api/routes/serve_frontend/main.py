import os
from fastapi import APIRouter
from fastapi.responses import HTMLResponse
from app.models.message import Message


router = APIRouter()


@router.get("/")
def serve_frontend() -> HTMLResponse:
    """
    Serve the Frontend
    """
    index_path = os.path.join("static", "index.html")
    with open(index_path) as f:
        return HTMLResponse(content=f.read())


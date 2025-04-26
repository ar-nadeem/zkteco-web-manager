from fastapi import APIRouter
from app.models.message import Message

router = APIRouter()


@router.get("/")
def welcome() -> Message:
    """
    Welcome message for the API
    """
    return Message(message="Welcome to ZKteco Backend !")

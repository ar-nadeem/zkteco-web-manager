from fastapi import APIRouter
from app.models.message import Message

router = APIRouter()


@router.get("/welcome")
def welcome() -> Message:
    """
    Welcome message for the API
    """
    return Message(message="Welcome to ZKteco Backend !")

from pydantic import BaseModel, Field


class UserSettings(BaseModel):
    """User settings for the ZKTeco device."""
    uid: int = Field(..., description="User ID")
    name: str = Field(..., description="User name")
    privilege: int = Field(..., description="User privilege")
    password: str = Field(..., description="User password")
    group_id: str = Field(..., description="Group ID")
    user_id: str = Field(..., description="User ID in string")
    card: int = Field(..., description="Card Number")

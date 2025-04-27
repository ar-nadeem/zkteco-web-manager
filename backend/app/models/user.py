from pydantic import BaseModel, Field


class UserSettings(BaseModel):
    """User settings for the ZKTeco device."""
    ip: str = Field(..., description="Device IP address")
    port: int = Field(default=4370, description="Device port")
    password: int = Field(default=0, description="Device password")
    force_udp: bool = Field(
        default=False, description="Whether to force UDP connection")
    ommit_ping: bool = Field(
        default=False, description="Whether to omit ping check")
    timeout: int = Field(
        default=5, description="Connection timeout in seconds")

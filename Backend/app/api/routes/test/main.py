from fastapi import APIRouter, HTTPException
from app.models.device import DeviceSettings
from app.zkteko.base import ZktekoBase
from app.models.message import Message


router = APIRouter()


@router.post("/test", response_model=Message)
async def test(
    device_settings: DeviceSettings,
) -> Message:
    zk = ZktekoBase(
        ip=device_settings.ip,
        port=device_settings.port,
        password=device_settings.password,
        force_udp=device_settings.force_udp,
        ommit_ping=device_settings.ommit_ping,
        timeout=device_settings.timeout,
    )
    try:
        zk.connect()
        zk.disconnect()
        return Message(message="Connected to device")
    except Exception as e:
        raise HTTPException(
            status_code=400, detail="Unable to connect to device")

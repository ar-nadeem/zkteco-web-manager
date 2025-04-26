from fastapi import APIRouter
from app.zkteko.user.user_manager import UserManager
from app.models.user import UserSettings
from app.models.device import DeviceSettings
router = APIRouter()


@router.post("/get_users")
async def get_users(
    device_settings: DeviceSettings,
):
    user_manager = UserManager(
        ip=device_settings.ip,
        port=device_settings.port,
        password=device_settings.password,
        force_udp=device_settings.force_udp,
        ommit_ping=device_settings.ommit_ping,
        timeout=device_settings.timeout)
    return user_manager.get_all_users()

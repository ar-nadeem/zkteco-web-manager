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


@router.post("/update_user")
async def update_user(
    device_settings: DeviceSettings,
    user_settings: UserSettings,
):
    user_manager = UserManager(
        ip=device_settings.ip,
        port=device_settings.port,
        password=device_settings.password,
        force_udp=device_settings.force_udp,
        ommit_ping=device_settings.ommit_ping,
        timeout=device_settings.timeout
    )
    try:
        user_manager.delete_user(uid=user_settings.uid)
    except Exception as e:
        print(f"Error deleting user inorder to update: {e}")
        return False

    return user_manager.add_user(
        uid=user_settings.uid,
        name=user_settings.name,
        privilege=user_settings.privilege,
        password=user_settings.password,
        group_id=user_settings.group_id,
        user_id=user_settings.user_id,
        card=user_settings.card
    )


@router.post("/delete_user")
async def delete_user(
    device_settings: DeviceSettings,
    user_settings: UserSettings,
):
    user_manager = UserManager(
        ip=device_settings.ip,
        port=device_settings.port,
        password=device_settings.password,
        force_udp=device_settings.force_udp,
        ommit_ping=device_settings.ommit_ping,
        timeout=device_settings.timeout
    )
    return user_manager.delete_user(uid=user_settings.uid)


@router.post("/add_user")
async def add_user(
    device_settings: DeviceSettings,
    user_settings: UserSettings,
):
    user_manager = UserManager(
        ip=device_settings.ip,
        port=device_settings.port,
        password=device_settings.password,
        force_udp=device_settings.force_udp,
        ommit_ping=device_settings.ommit_ping,
        timeout=device_settings.timeout
    )
    return user_manager.add_user(
        uid=user_settings.uid,
        name=user_settings.name,
        privilege=user_settings.privilege,
        password=user_settings.password,
        group_id=user_settings.group_id,
        user_id=user_settings.user_id,
        card=user_settings.card
    )

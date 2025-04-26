from fastapi import APIRouter
from app.models.device import DeviceSettings
from app.models.attendance import AttendanceSettings, AttendanceResponse
from app.zkteko.attendance.attendance_manager import AttendanceManager

router = APIRouter()


@router.post("/get_attendance", response_model=AttendanceResponse)
async def get_attendance(
    device_settings: DeviceSettings,
    attendance_settings: AttendanceSettings = AttendanceSettings()
):
    attendance_manager = AttendanceManager(
        ip=device_settings.ip,
        port=device_settings.port,
        password=device_settings.password,
        force_udp=device_settings.force_udp,
        ommit_ping=device_settings.ommit_ping,
        timeout=device_settings.timeout,
        office_start=attendance_settings.office_start,
        office_end=attendance_settings.office_end,
        grace_period=attendance_settings.grace_period
    )
    return attendance_manager.get_attendance_as_json()

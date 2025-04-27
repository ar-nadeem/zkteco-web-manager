from fastapi import APIRouter, Depends
from app.api.routes.welcome.main import router as welcome
from app.api.routes.attendance.main import router as attendance
from app.api.routes.users.main import router as users
from app.api.routes.test.main import router as test
api_router = APIRouter()
api_router.include_router(welcome, tags=["welcome"])
api_router.include_router(attendance, tags=["attendance"])
api_router.include_router(users, tags=["users"])
api_router.include_router(test, tags=["test"])

prefix_v1 = "/api/v1"

from app.api.main import api_router
from starlette.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from fastapi import FastAPI
from contextlib import asynccontextmanager
import time


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"Starting app {time.asctime()}")
    # Run it without blocking the app startup
    yield
    print(f"Stopping app {time.asctime()}")

app = FastAPI(
    title="ZkTeco Backend",
    description="Interact with ZkTeco devices",
    docs_url="/docs",
    version="0.1",
    generate_unique_id_function=custom_generate_unique_id,
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router)

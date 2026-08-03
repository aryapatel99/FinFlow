from fastapi import FastAPI

from app.api.admin_api import router as admin_router
from app.api.auth_api import router as auth_router
from app.api.payment_api import router as payment_router
from app.config.settings import settings
from app.exceptions.exception_handler import register_exception_handlers

app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)

register_exception_handlers(app)

app.include_router(auth_router)
app.include_router(payment_router)
app.include_router(admin_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to FinFlow API"
    }
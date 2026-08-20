from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth_api import router as auth_router
from app.api.payment_api import router as payment_router
from app.api.webhook_api import router as webhook_router
from app.api.payment_verify_api import router as payment_verify_router
from app.api.checkout_api import router as checkout_router
from app.api.admin_api import router as admin_router
from app.api.user_api import router as user_router

from app.config.settings import settings
from app.exceptions.exception_handler import register_exception_handlers


app = FastAPI(
    title=settings.app_name,
    description=settings.app_description,
    version=settings.app_version,
)


# ==========================
# CORS
# ==========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in settings.cors_origins.split(",")
        if origin.strip()
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================
# Exception Handlers
# ==========================

register_exception_handlers(app)


# ==========================
# Routers
# ==========================

app.include_router(auth_router)

app.include_router(payment_router)

app.include_router(webhook_router)

app.include_router(payment_verify_router)

app.include_router(checkout_router)

app.include_router(admin_router)

app.include_router(user_router)


# ==========================
# Root
# ==========================

@app.get("/")
def root():

    return {
        "message": "Welcome to FinFlow API"
    }
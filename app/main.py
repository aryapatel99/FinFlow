from fastapi import FastAPI

from app.api.payment_api import router as payment_router

app = FastAPI(
    title="FinFlow API",
    description="Event-Driven Payment Processing Platform",
    version="1.0.0"
)

app.include_router(payment_router)


@app.get("/")
def root():
    return {
        "message": "Welcome to FinFlow API"
    }
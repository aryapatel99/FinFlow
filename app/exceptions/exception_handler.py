from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.exceptions.payment_exception import PaymentNotFoundException


def register_exception_handlers(app: FastAPI):

    @app.exception_handler(PaymentNotFoundException)
    async def payment_not_found_handler(
        request: Request,
        exc: PaymentNotFoundException
    ):
        return JSONResponse(
            status_code=404,
            content={
                "error": "Payment Not Found",
                "message": exc.message
            }
        )
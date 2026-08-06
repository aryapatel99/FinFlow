from fastapi import APIRouter, Depends, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates

from app.auth.dependencies import get_current_user
from app.services.payment_service import PaymentService


router = APIRouter(
    prefix="/checkout",
    tags=["Checkout"],
)


templates = Jinja2Templates(
    directory="app/templates"
)


payment_service = PaymentService()


# =====================================
# Production Checkout Route
# =====================================
# Uses JWT authentication.
# Keep this route for the final React frontend.
# React will send JWT token while calling this API.
# =====================================

@router.get(
    "/{payment_id}",
    response_class=HTMLResponse,
)
def checkout_page(
    request: Request,
    payment_id: str,
    current_user=Depends(get_current_user),
):

    order = payment_service.create_checkout(
        payment_id,
        current_user,
    )

    return templates.TemplateResponse(
        request=request,
        name="checkout.html",
        context={

            "razorpay_key_id":
                order.razorpay_key_id,

            "razorpay_order_id":
                order.razorpay_order_id,

            "amount":
                int(order.amount * 100),

            "currency":
                order.currency,
        }
    )


# =====================================
# TEMPORARY TEST ROUTE
# =====================================
# REMOVE THIS AFTER REACT FRONTEND LOGIN
# IS IMPLEMENTED.
#
# Reason:
# Normal browser URL does not send JWT token,
# so testing checkout directly gives:
# "Not authenticated"
#
# This route is only for local Razorpay
# test payment flow.
# =====================================

@router.get(
    "/test/{payment_id}",
    response_class=HTMLResponse,
)
def test_checkout_page(
    request: Request,
    payment_id: str,
):

    payment = payment_service.repository.get_by_id(
        payment_id
    )

    if payment is None:

        return HTMLResponse(
            content="Payment not found",
            status_code=404,
        )

    # Simulate the authenticated payment owner.
    current_user = {
        "user_id": payment.user_id,
        "role": "customer",
    }

    order = payment_service.create_checkout(
        payment_id,
        current_user,
    )

    return templates.TemplateResponse(
        request=request,
        name="checkout.html",
        context={

            "razorpay_key_id":
                order.razorpay_key_id,

            "razorpay_order_id":
                order.razorpay_order_id,

            "amount":
                int(order.amount * 100),

            "currency":
                order.currency,
        }
    )
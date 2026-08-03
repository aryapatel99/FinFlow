from fastapi import APIRouter, Depends

from app.auth.dependencies import require_admin
from app.schemas.payment_schema import PaymentResponse, MessageResponse
from app.schemas.user_schema import UserResponse
from app.services.admin_service import AdminService

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

admin_service = AdminService()


# ==========================
# User Management
# ==========================

@router.get(
    "/users",
    response_model=list[UserResponse]
)
def get_all_users(
    current_admin=Depends(require_admin),
):
    return admin_service.get_all_users()


@router.get(
    "/users/{email}",
    response_model=UserResponse
)
def get_user(
    email: str,
    current_admin=Depends(require_admin),
):
    return admin_service.get_user(email)


@router.patch(
    "/users/{email}/role",
    response_model=UserResponse
)
def update_user_role(
    email: str,
    role: str,
    current_admin=Depends(require_admin),
):
    return admin_service.update_user_role(
        email,
        role
    )


@router.delete(
    "/users/{email}",
    response_model=MessageResponse
)
def delete_user(
    email: str,
    current_admin=Depends(require_admin),
):
    admin_service.delete_user(email)

    return MessageResponse(
        message="User deleted successfully."
    )


# ==========================
# Payment Management
# ==========================

@router.get(
    "/payments",
    response_model=list[PaymentResponse]
)
def get_all_payments(
    current_admin=Depends(require_admin),
):
    return admin_service.get_all_payments()


@router.get(
    "/payments/{payment_id}",
    response_model=PaymentResponse
)
def get_payment(
    payment_id: str,
    current_admin=Depends(require_admin),
):
    return admin_service.get_payment(payment_id)


@router.delete(
    "/payments/{payment_id}",
    response_model=MessageResponse
)
def delete_payment(
    payment_id: str,
    current_admin=Depends(require_admin),
):
    admin_service.delete_payment(payment_id)

    return MessageResponse(
        message="Payment deleted successfully."
    )
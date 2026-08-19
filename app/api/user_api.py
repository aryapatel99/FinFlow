from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user

from app.schemas.password_schema import (
    ChangePasswordRequest,
)

from app.schemas.payment_schema import MessageResponse

from app.schemas.user_schema import UserResponse

from app.services.user_service import UserService


router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


user_service = UserService()


# ==========================
# Current User Profile
# ==========================

@router.get(
    "/me",
    response_model=UserResponse,
)
def get_my_profile(
    current_user=Depends(get_current_user),
):

    user = user_service.get_current_user(
        current_user["user_id"]
    )

    return user


# ==========================
# Change Own Password
# ==========================

@router.patch(
    "/me/password",
    response_model=MessageResponse,
)
def change_my_password(
    data: ChangePasswordRequest,
    current_user=Depends(get_current_user),
):

    user_service.change_password(
        user_id=current_user["user_id"],
        current_password=data.current_password,
        new_password=data.new_password,
    )

    return MessageResponse(
        message="Password changed successfully."
    )
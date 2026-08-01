from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm

from app.auth.jwt_handler import create_access_token
from app.schemas.user_schema import (
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.services.user_service import UserService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

service = UserService()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=201
)
def register(user: UserRegister):
    try:
        created_user = service.register_user(user)

        return UserResponse(
            user_id=created_user.user_id,
            full_name=created_user.full_name,
            email=created_user.email,
            role=created_user.role,
            created_at=created_user.created_at,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    form_data: OAuth2PasswordRequestForm = Depends()
):
    authenticated_user = service.authenticate_user(
        form_data.username,   # Email goes here
        form_data.password
    )

    if authenticated_user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = create_access_token(
        {
            "user_id": authenticated_user.user_id,
            "email": authenticated_user.email,
            "role": authenticated_user.role,
        }
    )

    return TokenResponse(
        access_token=token
    )
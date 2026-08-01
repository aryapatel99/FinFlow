from datetime import datetime
from uuid import uuid4


class User:
    def __init__(
        self,
        full_name: str,
        email: str,
        hashed_password: str,
        role: str = "customer",
        user_id: str | None = None,
        created_at: datetime | None = None,
    ):
        self.user_id = user_id or str(uuid4())
        self.full_name = full_name
        self.email = email
        self.hashed_password = hashed_password
        self.role = role
        self.created_at = created_at or datetime.utcnow()

    def to_dict(self):
        return {
            "user_id": self.user_id,
            "full_name": self.full_name,
            "email": self.email,
            "hashed_password": self.hashed_password,
            "role": self.role,
            "created_at": self.created_at.isoformat(),
        }

    @classmethod
    def from_dict(cls, data: dict):
        return cls(
            user_id=data["user_id"],
            full_name=data["full_name"],
            email=data["email"],
            hashed_password=data["hashed_password"],
            role=data.get("role", "customer"),
            created_at=datetime.fromisoformat(data["created_at"]),
        )
from app.config.dynamodb import get_dynamodb
from app.models.user_model import User


class UserRepository:
    def __init__(self):
        dynamodb = get_dynamodb()
        self.table = dynamodb.Table("FinFlowUsers")

    def save(self, user: User):
        self.table.put_item(
            Item=user.to_dict()
        )

    def get_by_email(self, email: str):
        response = self.table.get_item(
            Key={
                "email": email
            }
        )

        item = response.get("Item")

        if item:
            return User.from_dict(item)

        return None

    def get_all(self):
        response = self.table.scan()

        return [
            User.from_dict(item)
            for item in response.get("Items", [])
        ]

    def update_role(
        self,
        email: str,
        role: str
    ):
        self.table.update_item(
            Key={
                "email": email
            },
            UpdateExpression="SET #r = :role",
            ExpressionAttributeNames={
                "#r": "role"
            },
            ExpressionAttributeValues={
                ":role": role
            }
        )

        return self.get_by_email(email)

    def delete(
        self,
        email: str
    ):
        user = self.get_by_email(email)

        if user:
            self.table.delete_item(
                Key={
                    "email": email
                }
            )

        return user
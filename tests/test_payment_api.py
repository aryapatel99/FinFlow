from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_home():
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Welcome to FinFlow API"
    }


def test_create_payment():
    payload = {
        "customer_name": "Arya Patel",
        "email": "arya@gmail.com",
        "amount": 1500,
        "currency": "INR",
        "description": "AWS Developer Course"
    }

    response = client.post("/payments", json=payload)

    assert response.status_code == 200

    data = response.json()

    assert data["customer_name"] == payload["customer_name"]
    assert data["email"] == payload["email"]
    assert data["amount"] == payload["amount"]
    assert data["currency"] == payload["currency"]
    assert data["description"] == payload["description"]
    assert data["status"] == "PENDING"

    assert "payment_id" in data
    assert "created_at" in data
    assert "updated_at" in data


def test_get_all_payments():
    response = client.get("/payments")

    assert response.status_code == 200

    data = response.json()

    assert isinstance(data, list)
    assert len(data) >= 1


def test_get_payment_by_id():
    payload = {
        "customer_name": "Test User",
        "email": "test@gmail.com",
        "amount": 999,
        "currency": "INR",
        "description": "Testing Payment"
    }

    create_response = client.post("/payments", json=payload)

    assert create_response.status_code == 200

    payment_id = create_response.json()["payment_id"]

    response = client.get(f"/payments/{payment_id}")

    assert response.status_code == 200

    data = response.json()

    assert data["payment_id"] == payment_id
    assert data["customer_name"] == payload["customer_name"]
    assert data["email"] == payload["email"]
    assert data["amount"] == payload["amount"]


def test_delete_payment():
    payload = {
        "customer_name": "Delete User",
        "email": "delete@gmail.com",
        "amount": 500,
        "currency": "INR",
        "description": "Delete Test"
    }

    create_response = client.post("/payments", json=payload)

    assert create_response.status_code == 200

    payment_id = create_response.json()["payment_id"]

    response = client.delete(f"/payments/{payment_id}")

    assert response.status_code == 200
    assert response.json() == {
        "message": "Payment deleted successfully"
    }


def test_invalid_payment_amount():
    payload = {
        "customer_name": "Arya Patel",
        "email": "arya@gmail.com",
        "amount": -100,
        "currency": "INR",
        "description": "Invalid Payment"
    }

    response = client.post("/payments", json=payload)

    assert response.status_code == 422
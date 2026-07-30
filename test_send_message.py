from app.config.sqs import send_message

payment = {
    "customer_name": "Arya Patel",
    "email": "arya@example.com",
    "amount": 1500,
    "currency": "INR",
    "description": "Laptop Purchase"
}

send_message(payment)
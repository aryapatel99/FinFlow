import json

from app.config.sqs import QUEUE_URL, get_sqs_client
from app.models.payment_model import Payment
from app.services.payment_service import PaymentService

client = get_sqs_client()
payment_service = PaymentService()

print("🚀 Payment Worker Started...")

while True:

    response = client.receive_message(
        QueueUrl=QUEUE_URL,
        MaxNumberOfMessages=1,
        WaitTimeSeconds=10
    )

    messages = response.get("Messages", [])

    if not messages:
        continue

    for message in messages:

        try:

            body = json.loads(message["Body"])

            print("\n📩 New Payment Received")
            print(body)

            payment = Payment(
                customer_name=body["customer_name"],
                email=body["email"],
                amount=body["amount"],
                currency=body["currency"],
                description=body["description"],
                user_id=body["user_id"],
                user_email=body["user_email"],
            )

            saved_payment = payment_service.create_payment(payment)

            print("✅ Payment saved successfully!")
            print(f"Payment ID: {saved_payment.payment_id}")

            client.delete_message(
                QueueUrl=QUEUE_URL,
                ReceiptHandle=message["ReceiptHandle"]
            )

            print("🗑 Message deleted from queue")

        except Exception as e:

            print("❌ Error:", e)
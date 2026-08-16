import {
    Link,
} from "react-router-dom";

import PaymentStatus from "./PaymentStatus";


function PaymentCard({ payment }) {

    const formattedAmount =
        new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: payment.currency,
            }
        ).format(payment.amount);


    const formattedDate =
        new Date(
            payment.created_at
        ).toLocaleString();


    return (
        <div>

            <h3>
                {payment.description}
            </h3>


            <p>
                Payment ID:
                {" "}
                {payment.payment_id}
            </p>


            <p>
                Customer:
                {" "}
                {payment.customer_name}
            </p>


            <p>
                Amount:
                {" "}
                {formattedAmount}
            </p>


            <p>
                Status:
                {" "}

                <PaymentStatus
                    status={payment.status}
                />

            </p>


            <p>
                Created:
                {" "}
                {formattedDate}
            </p>


            <Link
                to={`/payments/${payment.payment_id}`}
            >
                View Details
            </Link>

        </div>
    );
}


export default PaymentCard;
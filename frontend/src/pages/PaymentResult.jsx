import {
    Link,
    useSearchParams,
} from "react-router-dom";


function PaymentResult() {

    const [
        searchParams
    ] = useSearchParams();


    const status =
        searchParams.get(
            "status"
        );


    const razorpayPaymentId =
        searchParams.get(
            "razorpay_payment_id"
        );


    const isSuccess =
        status === "success";


    return (
        <div>

            <h1>
                FinFlow
            </h1>


            {isSuccess ? (

                <div>

                    <h2>
                        Payment Submitted
                    </h2>


                    <p>
                        Razorpay reported that
                        the payment was successful.
                    </p>


                    <p>
                        Your payment status will
                        be confirmed by the FinFlow
                        backend.
                    </p>


                    {razorpayPaymentId && (

                        <p>
                            <strong>
                                Razorpay Payment ID:
                            </strong>

                            {" "}

                            {razorpayPaymentId}
                        </p>

                    )}

                </div>

            ) : (

                <div>

                    <h2>
                        Payment Failed or Cancelled
                    </h2>


                    <p>
                        The payment was not completed.
                    </p>

                </div>

            )}


            <p>

                <Link to="/payments">
                    Back to My Payments
                </Link>

            </p>

        </div>
    );
}


export default PaymentResult;
import {
    CheckCircle2,
    XCircle,
    ShieldCheck,
    CreditCard,
    ArrowRight,
    Home,
    Copy,
} from "lucide-react";

import {
    Link,
    useParams,
    useSearchParams,
} from "react-router-dom";

import AppShell from "../components/AppShell";

import "../styles/premium-pages.css";


function PaymentResult() {

    const {
        paymentId,
    } = useParams();


    const [
        searchParams,
    ] = useSearchParams();


    const status =
        String(
            searchParams.get("status") ||
            ""
        ).toLowerCase();


    const razorpayPaymentId =
        searchParams.get(
            "razorpay_payment_id"
        );


    const isSuccess =
        status === "success";


    const copyPaymentId =
        async () => {

            if (!razorpayPaymentId) {
                return;
            }

            try {

                await navigator.clipboard.writeText(
                    razorpayPaymentId
                );

            } catch {
                // Clipboard may be unavailable.
            }

        };


    return (
        <AppShell>

            <main className="ff-result-page">

                <section className="ff-result-card">

                    <div
                        className={
                            `ff-result-icon ${
                                isSuccess
                                    ? "success"
                                    : "failed"
                            }`
                        }
                    >

                        {isSuccess ? (
                            <CheckCircle2
                                size={42}
                                strokeWidth={2}
                            />
                        ) : (
                            <XCircle
                                size={42}
                                strokeWidth={2}
                            />
                        )}

                    </div>


                    <div className="ff-eyebrow">
                        <span className="ff-eyebrow-dot" />

                        {isSuccess
                            ? "PAYMENT SUBMITTED"
                            : "PAYMENT NOT COMPLETED"
                        }
                    </div>


                    <h1>

                        {isSuccess
                            ? "Payment submitted successfully"
                            : "Payment could not be completed"
                        }

                    </h1>


                    <p>

                        {isSuccess
                            ? "Razorpay reported a successful payment submission. FinFlow will confirm the final payment state through the backend."
                            : "The payment was cancelled or could not be completed. Your payment record remains available in FinFlow."
                        }

                    </p>


                    {isSuccess && razorpayPaymentId && (

                        <div className="ff-result-details">

                            <div className="ff-result-detail">

                                <span>
                                    Razorpay Payment ID
                                </span>

                                <strong>
                                    {razorpayPaymentId}
                                </strong>

                            </div>


                            <div className="ff-result-detail">

                                <span>
                                    Verification
                                </span>

                                <strong>
                                    Pending backend confirmation
                                </strong>

                            </div>

                        </div>

                    )}


                    <div className="ff-result-details">

                        <div className="ff-result-detail">

                            <span>
                                FinFlow Payment
                            </span>

                            <strong>
                                {paymentId}
                            </strong>

                        </div>


                        <div className="ff-result-detail">

                            <span>
                                Transaction state
                            </span>

                            <strong>
                                {isSuccess
                                    ? "Submitted"
                                    : "Not completed"
                                }
                            </strong>

                        </div>

                    </div>


                    <div className="ff-result-actions">

                        <Link
                            to={`/payments/${paymentId}`}
                            className="ff-primary-btn"
                        >
                            <CreditCard size={16} />
                            View Payment
                            <ArrowRight size={16} />
                        </Link>


                        {razorpayPaymentId && (

                            <button
                                type="button"
                                className="ff-secondary-btn"
                                onClick={
                                    copyPaymentId
                                }
                            >
                                <Copy size={15} />
                                Copy Payment ID
                            </button>

                        )}


                        <Link
                            to="/payments"
                            className="ff-secondary-btn"
                        >
                            Back to Payments
                        </Link>

                    </div>


                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "9px",
                            marginTop: "30px",
                            paddingTop: "21px",
                            borderTop:
                                "1px solid rgba(139,163,204,0.08)",
                            color: "#657894",
                            fontSize: "12px",
                        }}
                    >

                        <ShieldCheck
                            size={16}
                        />

                        FinFlow secure payment workflow

                    </div>


                    <Link
                        to="/dashboard"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "7px",
                            marginTop: "16px",
                            color: "#6d9ee2",
                            fontSize: "12px",
                            textDecoration: "none",
                        }}
                    >
                        <Home size={14} />
                        Dashboard
                    </Link>

                </section>

            </main>

        </AppShell>
    );
}


export default PaymentResult;
import {
    useEffect,
    useState,
} from "react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    deletePayment,
    getPayment,
} from "../services/api";

import PaymentStatus from "../components/PaymentStatus";
import RazorpayCheckout from "../components/RazorpayCheckout";
import AppShell from "../components/AppShell";


function PaymentDetails() {

    const {
        paymentId,
    } = useParams();

    const navigate = useNavigate();

    const [
        payment,
        setPayment
    ] = useState(null);

    const [
        loading,
        setLoading
    ] = useState(true);

    const [
        error,
        setError
    ] = useState("");

    const [
        deleting,
        setDeleting
    ] = useState(false);


    // =========================================
    // LOAD PAYMENT
    // =========================================

    const loadPayment = async () => {

        setLoading(true);
        setError("");

        try {

            const data =
                await getPayment(paymentId);

            setPayment(data);

        } catch (error) {

            console.error(
                "Failed to load payment:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to load payment."
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadPayment();

    }, [paymentId]);


    // =========================================
    // DELETE PAYMENT
    // =========================================

    const handleDelete = async () => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this payment?"
            );

        if (!confirmed) {
            return;
        }

        setDeleting(true);
        setError("");

        try {

            await deletePayment(
                paymentId
            );

            navigate(
                "/payments",
                {
                    replace: true,
                }
            );

        } catch (error) {

            console.error(
                "Failed to delete payment:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Unable to delete payment."
            );

        } finally {

            setDeleting(false);

        }

    };


    // =========================================
    // LOADING
    // =========================================

    if (loading) {

        return (

            <AppShell>

                <main className="ff-payment-details-page">

                    <div className="ff-details-loading">

                        <div className="ff-loading-spinner" />

                        <span>
                            Loading payment details...
                        </span>

                    </div>

                </main>

            </AppShell>

        );

    }


    // =========================================
    // ERROR
    // =========================================

    if (error && !payment) {

        return (

            <AppShell>

                <main className="ff-payment-details-page">

                    <div className="ff-details-error">

                        <div className="ff-details-error-icon">
                            !
                        </div>

                        <h2>
                            Unable to load payment
                        </h2>

                        <p>
                            {error}
                        </p>

                        <Link
                            to="/payments"
                            className="ff-primary-action"
                        >
                            ← Back to Payments
                        </Link>

                    </div>

                </main>

            </AppShell>

        );

    }


    if (!payment) {

        return (

            <AppShell>

                <main className="ff-payment-details-page">

                    <div className="ff-details-error">

                        <div className="ff-details-error-icon">
                            ?
                        </div>

                        <h2>
                            Payment Not Found
                        </h2>

                        <p>
                            The payment you're looking for
                            could not be found.
                        </p>

                        <Link
                            to="/payments"
                            className="ff-primary-action"
                        >
                            ← Back to Payments
                        </Link>

                    </div>

                </main>

            </AppShell>

        );

    }


    // =========================================
    // FORMATTING
    // =========================================

    const formattedAmount =
        new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: payment.currency,
            }
        ).format(payment.amount);


    const createdDate =
        new Date(
            payment.created_at
        ).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );


    const updatedDate =
        new Date(
            payment.updated_at
        ).toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short",
            }
        );


    const status =
        payment.status?.toUpperCase();


    const statusClass =
        status === "COMPLETED"
            ? "success"
            : status === "FAILED"
                ? "danger"
                : status === "PROCESSING"
                    ? "warning"
                    : "pending";


    return (

        <AppShell>

            <main className="ff-payment-details-page">

                {/* =================================
                    TOP BAR
                ================================= */}

                <div className="ff-details-topbar">

                    <Link
                        to="/payments"
                        className="ff-back-link"
                    >
                        ← Back to Payments
                    </Link>

                </div>


                {/* =================================
                    PAGE HEADER
                ================================= */}

                <section className="ff-details-header">

                    <div>

                        <div className="ff-eyebrow">
                            PAYMENT DETAILS
                        </div>

                        <h1>
                            {payment.description}
                        </h1>

                        <p>
                            Complete information associated
                            with this transaction.
                        </p>

                    </div>


                    <div
                        className={
                            `ff-details-status ff-status-${statusClass}`
                        }
                    >

                        <span className="ff-status-indicator" />

                        {status}

                    </div>

                </section>


                {/* =================================
                    MAIN GRID
                ================================= */}

                <section className="ff-details-grid">

                    {/* =================================
                        LEFT COLUMN
                    ================================= */}

                    <div className="ff-details-main">


                        {/* PAYMENT OVERVIEW */}

                        <div className="ff-detail-card ff-overview-card">

                            <div className="ff-card-heading">

                                <div className="ff-card-icon">
                                    ₹
                                </div>

                                <div>

                                    <span>
                                        PAYMENT AMOUNT
                                    </span>

                                    <h2>
                                        {formattedAmount}
                                    </h2>

                                </div>

                            </div>


                            <div className="ff-overview-meta">

                                <div>

                                    <span>
                                        Currency
                                    </span>

                                    <strong>
                                        {payment.currency}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Status
                                    </span>

                                    <strong>
                                        {status}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        Type
                                    </span>

                                    <strong>
                                        Transaction
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* PAYMENT INFORMATION */}

                        <div className="ff-detail-card">

                            <div className="ff-section-heading">

                                <div className="ff-section-icon">
                                    ◈
                                </div>

                                <div>

                                    <h3>
                                        Payment Information
                                    </h3>

                                    <p>
                                        Identifiers and customer
                                        information for this transaction.
                                    </p>

                                </div>

                            </div>


                            <div className="ff-information-grid">

                                <div className="ff-information-item">

                                    <span>
                                        Payment ID
                                    </span>

                                    <strong className="ff-mono-value">
                                        {payment.payment_id}
                                    </strong>

                                </div>


                                <div className="ff-information-item">

                                    <span>
                                        Customer
                                    </span>

                                    <strong>
                                        {payment.customer_name}
                                    </strong>

                                </div>


                                <div className="ff-information-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {payment.email}
                                    </strong>

                                </div>


                                <div className="ff-information-item">

                                    <span>
                                        Created
                                    </span>

                                    <strong>
                                        {createdDate}
                                    </strong>

                                </div>


                                <div className="ff-information-item">

                                    <span>
                                        Last Updated
                                    </span>

                                    <strong>
                                        {updatedDate}
                                    </strong>

                                </div>


                                {payment.razorpay_order_id && (

                                    <div className="ff-information-item">

                                        <span>
                                            Razorpay Order ID
                                        </span>

                                        <strong className="ff-mono-value">
                                            {payment.razorpay_order_id}
                                        </strong>

                                    </div>

                                )}


                                {payment.razorpay_payment_id && (

                                    <div className="ff-information-item">

                                        <span>
                                            Razorpay Payment ID
                                        </span>

                                        <strong className="ff-mono-value">
                                            {payment.razorpay_payment_id}
                                        </strong>

                                    </div>

                                )}

                            </div>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="ff-detail-card">

                            <div className="ff-section-heading">

                                <div className="ff-section-icon">
                                    ≡
                                </div>

                                <div>

                                    <h3>
                                        Description
                                    </h3>

                                    <p>
                                        Payment purpose provided
                                        during creation.
                                    </p>

                                </div>

                            </div>


                            <div className="ff-description-box">

                                {payment.description}

                            </div>

                        </div>

                    </div>


                    {/* =================================
                        RIGHT COLUMN
                    ================================= */}

                    <aside className="ff-details-sidebar">


                        {/* PAYMENT ACTION */}

                        <div className="ff-action-card">

                            <div className="ff-action-icon">
                                {status === "PENDING"
                                    ? "→"
                                    : status === "COMPLETED"
                                        ? "✓"
                                        : "!"}
                            </div>


                            <div className="ff-action-content">

                                <span className="ff-action-label">
                                    PAYMENT ACTION
                                </span>

                                {status === "PENDING" && (

                                    <>

                                        <h3>
                                            Complete payment
                                        </h3>

                                        <p>
                                            Your payment is ready.
                                            Continue securely through
                                            Razorpay to complete the
                                            transaction.
                                        </p>

                                        <div className="ff-checkout-wrapper">

                                            <RazorpayCheckout

                                                paymentId={
                                                    payment.payment_id
                                                }

                                                customerName={
                                                    payment.customer_name
                                                }

                                                customerEmail={
                                                    payment.email
                                                }

                                            />

                                        </div>

                                    </>

                                )}


                                {status === "PROCESSING" && (

                                    <>

                                        <h3>
                                            Payment processing
                                        </h3>

                                        <p>
                                            Your payment is currently
                                            being processed. Please wait
                                            for confirmation.
                                        </p>

                                    </>

                                )}


                                {status === "COMPLETED" && (

                                    <>

                                        <h3>
                                            Payment completed
                                        </h3>

                                        <p>
                                            This transaction has been
                                            successfully completed.
                                        </p>

                                    </>

                                )}


                                {status === "FAILED" && (

                                    <>

                                        <h3>
                                            Payment failed
                                        </h3>

                                        <p>
                                            This payment could not be
                                            completed.
                                        </p>

                                    </>

                                )}

                            </div>

                        </div>


                        {/* STATUS CARD */}

                        <div className="ff-side-card">

                            <div className="ff-side-card-heading">

                                <div className="ff-mini-icon">
                                    ✓
                                </div>

                                <div>

                                    <h3>
                                        Transaction status
                                    </h3>

                                    <span>
                                        Current payment state
                                    </span>

                                </div>

                            </div>


                            <div
                                className={
                                    `ff-large-status ff-status-${statusClass}`
                                }
                            >

                                <span className="ff-status-indicator" />

                                <div>

                                    <strong>
                                        {status}
                                    </strong>

                                    <span>
                                        {status === "COMPLETED"
                                            ? "Successfully processed"
                                            : status === "PENDING"
                                                ? "Awaiting payment"
                                                : status === "PROCESSING"
                                                    ? "Processing transaction"
                                                    : "Transaction unsuccessful"}
                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* SECURITY */}

                        <div className="ff-security-panel">

                            <div className="ff-security-shield">
                                ✓
                            </div>

                            <div>

                                <strong>
                                    Secure transaction
                                </strong>

                                <p>
                                    FinFlow protects your payment
                                    information using secure
                                    processing.
                                </p>

                            </div>

                        </div>


                        {/* DELETE */}

                        {status !== "COMPLETED" && (

                            <button
                                type="button"
                                className="ff-delete-button"
                                onClick={handleDelete}
                                disabled={deleting}
                            >

                                <span>
                                    {deleting
                                        ? "Deleting..."
                                        : "Delete Payment"}
                                </span>

                                {!deleting && (
                                    <span>
                                        ×
                                    </span>
                                )}

                            </button>

                        )}

                    </aside>

                </section>

            </main>

        </AppShell>

    );

}


export default PaymentDetails;
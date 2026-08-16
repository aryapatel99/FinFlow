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


function PaymentDetails() {

    const {
        payment_id,
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


    // =====================================
    // Load Payment
    // =====================================

    const loadPayment =
        async () => {

            setLoading(true);

            setError("");


            try {

                const data =
                    await getPayment(
                        payment_id
                    );


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

    }, [payment_id]);


    // =====================================
    // Delete Payment
    // =====================================

    const handleDelete =
        async () => {

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
                    payment_id
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


    // =====================================
    // Loading
    // =====================================

    if (loading) {

        return (
            <div>

                <p>
                    Loading payment...
                </p>

            </div>
        );

    }


    // =====================================
    // Error
    // =====================================

    if (error && !payment) {

        return (
            <div>

                <h1>
                    Payment
                </h1>


                <p>
                    {error}
                </p>


                <Link to="/payments">
                    Back to Payments
                </Link>

            </div>
        );

    }


    // =====================================
    // Payment Not Found
    // =====================================

    if (!payment) {

        return (
            <div>

                <h1>
                    Payment Not Found
                </h1>


                <Link to="/payments">
                    Back to Payments
                </Link>

            </div>
        );

    }


    // =====================================
    // Formatting
    // =====================================

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
        ).toLocaleString();


    const updatedDate =
        new Date(
            payment.updated_at
        ).toLocaleString();


    return (
        <div>

            <h1>
                Payment Details
            </h1>


            <p>

                <Link to="/dashboard">
                    Dashboard
                </Link>

                {" | "}

                <Link to="/payments">
                    My Payments
                </Link>

            </p>


            <hr />


            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* ==============================
                Payment Information
            =============================== */}

            <h2>
                {payment.description}
            </h2>


            <p>
                <strong>
                    Payment ID:
                </strong>

                {" "}

                {payment.payment_id}
            </p>


            <p>
                <strong>
                    Customer:
                </strong>

                {" "}

                {payment.customer_name}
            </p>


            <p>
                <strong>
                    Email:
                </strong>

                {" "}

                {payment.email}
            </p>


            <p>
                <strong>
                    Amount:
                </strong>

                {" "}

                {formattedAmount}
            </p>


            <p>
                <strong>
                    Currency:
                </strong>

                {" "}

                {payment.currency}
            </p>


            <p>
                <strong>
                    Status:
                </strong>

                {" "}

                <PaymentStatus
                    status={payment.status}
                />

            </p>


            <p>
                <strong>
                    Created:
                </strong>

                {" "}

                {createdDate}
            </p>


            <p>
                <strong>
                    Last Updated:
                </strong>

                {" "}

                {updatedDate}
            </p>


            {/* ==============================
                Razorpay Information
            =============================== */}

            {payment.razorpay_order_id && (

                <p>

                    <strong>
                        Razorpay Order ID:
                    </strong>

                    {" "}

                    {payment.razorpay_order_id}

                </p>

            )}


            {payment.razorpay_payment_id && (

                <p>

                    <strong>
                        Razorpay Payment ID:
                    </strong>

                    {" "}

                    {payment.razorpay_payment_id}

                </p>

            )}


            <hr />


            {/* ==============================
                Actions
            =============================== */}

            {payment.status === "PENDING" && (

                <button
                    onClick={() =>
                        navigate(
                            `/payments/${payment.payment_id}/checkout`
                        )
                    }
                >
                    Pay Now
                </button>

            )}


            {payment.status !== "COMPLETED" && (

                <button
                    onClick={handleDelete}
                    disabled={deleting}
                >

                    {deleting
                        ? "Deleting..."
                        : "Delete Payment"
                    }

                </button>

            )}

        </div>
    );
}


export default PaymentDetails;
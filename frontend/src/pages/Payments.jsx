import {
    useEffect,
    useState,
} from "react";

import {
    Link,
} from "react-router-dom";

import {
    getMyPayments,
} from "../services/api";

import PaymentCard from "../components/PaymentCard";


function Payments() {

    const [
        payments,
        setPayments
    ] = useState([]);


    const [
        loading,
        setLoading
    ] = useState(true);


    const [
        error,
        setError
    ] = useState("");


    const loadPayments =
        async () => {

            setLoading(true);

            setError("");


            try {

                const data =
                    await getMyPayments();


                setPayments(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (error) {

                console.error(
                    "Failed to load payments:",
                    error
                );


                setError(
                    error.response?.data?.detail ||
                    "Unable to load your payments."
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadPayments();

    }, []);


    return (
        <div>

            <h1>
                My Payments
            </h1>


            <Link to="/dashboard">
                Back to Dashboard
            </Link>


            <br />
            <br />


            {loading && (

                <p>
                    Loading payments...
                </p>

            )}


            {!loading && error && (

                <div>

                    <p>
                        {error}
                    </p>


                    <button
                        onClick={loadPayments}
                    >
                        Try Again
                    </button>

                </div>

            )}


            {!loading &&
                !error &&
                payments.length === 0 && (

                    <div>

                        <h2>
                            No payments yet
                        </h2>

                        <p>
                            You haven't created
                            any payments yet.
                        </p>


                        <Link
                            to="/payments/create"
                        >
                            Create Payment
                        </Link>

                    </div>

                )
            }


            {!loading &&
                !error &&
                payments.length > 0 && (

                    <div>

                        <p>
                            Total Payments:
                            {" "}
                            {payments.length}
                        </p>


                        {payments.map(
                            (payment) => (

                                <PaymentCard
                                    key={
                                        payment.payment_id
                                    }
                                    payment={payment}
                                />

                            )
                        )}

                    </div>

                )
            }

        </div>
    );
}


export default Payments;
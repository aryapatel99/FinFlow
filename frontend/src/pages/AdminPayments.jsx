import {
    useEffect,
    useState,
} from "react";

import {
    deleteAdminPayment,
    getAdminPayments,
    updateAdminPaymentStatus,
} from "../services/api";


function AdminPayments() {

    const [
        payments,
        setPayments,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        error,
        setError,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");


    const loadPayments =
        async () => {

            try {

                setLoading(true);

                const data =
                    await getAdminPayments();

                setPayments(data);

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to load payments."
                );

            } finally {

                setLoading(false);

            }

        };


    useEffect(() => {

        loadPayments();

    }, []);


    const changeStatus =
        async (
            paymentId,
            status,
        ) => {

            try {

                await updateAdminPaymentStatus(
                    paymentId,
                    status
                );

                setMessage(
                    "Payment status updated successfully."
                );

                await loadPayments();

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    err.message ||
                    "Unable to update payment status."
                );

            }

        };


    const handleDelete =
        async (paymentId) => {

            const confirmed =
                window.confirm(
                    "Delete this payment permanently?"
                );

            if (!confirmed) {
                return;
            }

            try {

                await deleteAdminPayment(
                    paymentId
                );

                setMessage(
                    "Payment deleted successfully."
                );

                await loadPayments();

            } catch (err) {

                setError(
                    err.response?.data?.detail ||
                    "Unable to delete payment."
                );

            }

        };


    if (loading) {

        return (
            <div>
                Loading payments...
            </div>
        );

    }


    return (
        <div>

            <h1>All Payments</h1>

            {error && (
                <p>{error}</p>
            )}

            {message && (
                <p>{message}</p>
            )}

            <table>

                <thead>

                    <tr>
                        <th>Payment ID</th>
                        <th>Customer</th>
                        <th>Email</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>

                </thead>

                <tbody>

                    {payments.map(
                        (payment) => (

                            <tr
                                key={payment.payment_id}
                            >

                                <td>
                                    {payment.payment_id}
                                </td>

                                <td>
                                    {payment.customer_name}
                                </td>

                                <td>
                                    {payment.email}
                                </td>

                                <td>
                                    {payment.currency}{" "}
                                    {payment.amount}
                                </td>

                                <td>
                                    {payment.status}
                                </td>

                                <td>

                                    {payment.status === "PENDING" && (

                                        <button
                                            type="button"
                                            onClick={() =>
                                                changeStatus(
                                                    payment.payment_id,
                                                    "PROCESSING"
                                                )
                                            }
                                        >
                                            Processing
                                        </button>

                                    )}

                                    {payment.status === "PROCESSING" && (

                                        <>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeStatus(
                                                        payment.payment_id,
                                                        "COMPLETED"
                                                    )
                                                }
                                            >
                                                Complete
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    changeStatus(
                                                        payment.payment_id,
                                                        "FAILED"
                                                    )
                                                }
                                            >
                                                Fail
                                            </button>

                                        </>

                                    )}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDelete(
                                                payment.payment_id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        )
                    )}

                </tbody>

            </table>

        </div>
    );
}


export default AdminPayments;
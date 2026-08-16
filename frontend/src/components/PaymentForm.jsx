import {
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    createPayment,
} from "../services/api";


function PaymentForm() {

    const navigate = useNavigate();


    const [
        customerName,
        setCustomerName
    ] = useState("");


    const [
        email,
        setEmail
    ] = useState("");


    const [
        amount,
        setAmount
    ] = useState("");


    const [
        currency,
        setCurrency
    ] = useState("INR");


    const [
        description,
        setDescription
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(false);


    // =====================================
    // Submit Payment
    // =====================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");


        // ---------------------------------
        // Basic frontend validation
        // ---------------------------------

        const trimmedName =
            customerName.trim();


        const trimmedEmail =
            email.trim();


        const trimmedDescription =
            description.trim();


        const numericAmount =
            Number(amount);


        if (
            trimmedName.length < 3
        ) {

            setError(
                "Customer name must contain at least 3 characters."
            );

            return;
        }


        if (
            !trimmedEmail
        ) {

            setError(
                "Please enter an email address."
            );

            return;
        }


        if (
            !Number.isFinite(
                numericAmount
            ) ||
            numericAmount <= 0
        ) {

            setError(
                "Amount must be greater than 0."
            );

            return;
        }


        if (
            trimmedDescription.length < 5
        ) {

            setError(
                "Description must contain at least 5 characters."
            );

            return;
        }


        setLoading(true);


        try {

            const payment =
                await createPayment({

                    customer_name:
                        trimmedName,

                    email:
                        trimmedEmail,

                    amount:
                        numericAmount,

                    currency:
                        currency,

                    description:
                        trimmedDescription,

                });


            // ---------------------------------
            // Payment created successfully
            // ---------------------------------

            navigate(
                `/payments/${payment.payment_id}`
            );


        } catch (error) {

            console.error(
                "Payment creation failed:",
                error
            );


            setError(
                error.response?.data?.detail ||
                "Unable to create payment. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    return (
        <form
            onSubmit={handleSubmit}
        >

            <h2>
                Create Payment
            </h2>


            {error && (

                <p>
                    {error}
                </p>

            )}


            {/* =========================
                Customer Name
            ========================== */}

            <div>

                <label>
                    Customer Name
                </label>


                <input

                    type="text"

                    value={customerName}

                    onChange={(event) =>
                        setCustomerName(
                            event.target.value
                        )
                    }

                    placeholder="Enter customer name"

                    minLength={3}

                    maxLength={100}

                    required

                />

            </div>


            <br />


            {/* =========================
                Email
            ========================== */}

            <div>

                <label>
                    Email
                </label>


                <input

                    type="email"

                    value={email}

                    onChange={(event) =>
                        setEmail(
                            event.target.value
                        )
                    }

                    placeholder="customer@example.com"

                    required

                />

            </div>


            <br />


            {/* =========================
                Amount
            ========================== */}

            <div>

                <label>
                    Amount
                </label>


                <input

                    type="number"

                    value={amount}

                    onChange={(event) =>
                        setAmount(
                            event.target.value
                        )
                    }

                    placeholder="Enter amount"

                    min="0.01"

                    step="0.01"

                    required

                />

            </div>


            <br />


            {/* =========================
                Currency
            ========================== */}

            <div>

                <label>
                    Currency
                </label>


                <select

                    value={currency}

                    onChange={(event) =>
                        setCurrency(
                            event.target.value
                        )
                    }

                >

                    <option value="INR">
                        INR
                    </option>

                    <option value="USD">
                        USD
                    </option>

                    <option value="EUR">
                        EUR
                    </option>

                    <option value="GBP">
                        GBP
                    </option>

                </select>

            </div>


            <br />


            {/* =========================
                Description
            ========================== */}

            <div>

                <label>
                    Description
                </label>


                <textarea

                    value={description}

                    onChange={(event) =>
                        setDescription(
                            event.target.value
                        )
                    }

                    placeholder="What is this payment for?"

                    minLength={5}

                    maxLength={255}

                    rows={4}

                    required

                />

            </div>


            <br />


            {/* =========================
                Submit
            ========================== */}

            <button

                type="submit"

                disabled={loading}

            >

                {loading
                    ? "Creating Payment..."
                    : "Create Payment"
                }

            </button>

        </form>
    );
}


export default PaymentForm;
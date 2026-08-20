import {
    useState,
} from "react";

import {
    ArrowLeft,
    ArrowRight,
    BadgeCheck,
    CreditCard,
    FileText,
    Mail,
    ShieldCheck,
    User,
    WalletCards,
} from "lucide-react";

import {
    Link,
    useNavigate,
} from "react-router-dom";

import {
    createPayment,
} from "../services/api";

import AppShell from "../components/AppShell";


function CreatePayment() {

    const navigate = useNavigate();


    const [
        form,
        setForm
    ] = useState({
        customer_name: "",
        email: "",
        amount: "",
        currency: "INR",
        description: "",
    });


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        success,
        setSuccess
    ] = useState("");


    const handleChange = (
        event
    ) => {

        const {
            name,
            value,
        } = event.target;


        setForm(
            previous => ({
                ...previous,
                [name]: value,
            })
        );


        setError("");
        setSuccess("");

    };


    const handleSubmit =
        async (event) => {

            event.preventDefault();

            setError("");
            setSuccess("");


            if (
                !form.customer_name ||
                !form.email ||
                !form.amount ||
                !form.description
            ) {

                setError(
                    "Please complete all payment details."
                );

                return;

            }


            if (
                Number(form.amount) <= 0
            ) {

                setError(
                    "Payment amount must be greater than zero."
                );

                return;

            }


            setLoading(true);


            try {

                const payment =
                    await createPayment({
                        customer_name:
                            form.customer_name.trim(),

                        email:
                            form.email.trim(),

                        amount:
                            Number(form.amount),

                        currency:
                            form.currency,

                        description:
                            form.description.trim(),
                    });


                setSuccess(
                    "Payment created successfully."
                );


                navigate(
                    `/payments/${payment.payment_id}`
                );


            } catch (error) {

                console.error(
                    "Failed to create payment:",
                    error
                );


                const detail =
                    error.response?.data?.detail;


                if (Array.isArray(detail)) {

                    setError(
                        detail
                            .map(
                                item =>
                                    item.msg
                            )
                            .join(", ")
                    );

                } else if (
                    typeof detail === "string"
                ) {

                    setError(detail);

                } else {

                    setError(
                        "Unable to create payment. Please check your details and try again."
                    );

                }

            } finally {

                setLoading(false);

            }

        };


    const amount =
        Number(form.amount) || 0;


    const formattedAmount =
        new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: form.currency,
                maximumFractionDigits: 2,
            }
        ).format(amount);


    return (

        <AppShell>

            <main className="ff-page">

                {/* =====================================
                    TOP BAR
                ====================================== */}

                <div className="ff-page-topbar">

                    <div>

                        <Link
                            to="/payments"
                            className="ff-back-link"
                        >
                            <ArrowLeft size={16} />
                            Back to Payments
                        </Link>


                        <div className="ff-page-eyebrow">
                            <ShieldCheck size={15} />
                            SECURE PAYMENT CREATION
                        </div>


                        <h1 className="ff-page-title">
                            Create a new payment
                        </h1>


                        <p className="ff-page-subtitle">
                            Create a secure payment request
                            and continue to checkout when
                            you're ready.
                        </p>

                    </div>

                </div>


                {/* =====================================
                    CONTENT
                ====================================== */}

                <div className="ff-create-grid">

                    {/* =================================
                        FORM
                    ================================== */}

                    <section className="ff-glass-card ff-form-card">

                        <div className="ff-card-heading">

                            <div className="ff-icon-box">
                                <CreditCard size={21} />
                            </div>

                            <div>

                                <h2>
                                    Payment information
                                </h2>

                                <p>
                                    Enter the details below
                                </p>

                            </div>

                        </div>


                        {error && (

                            <div className="ff-alert ff-alert-error">
                                {error}
                            </div>

                        )}


                        {success && (

                            <div className="ff-alert ff-alert-success">
                                {success}
                            </div>

                        )}


                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="ff-payment-form"
                        >

                            {/* CUSTOMER */}

                            <div className="ff-section-label">
                                <User size={16} />
                                Customer details
                            </div>


                            <div className="ff-field">

                                <label>
                                    Customer name
                                </label>

                                <div className="ff-input-wrap">

                                    <User size={17} />

                                    <input
                                        name="customer_name"
                                        value={
                                            form.customer_name
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Aditya Sharma"
                                        autoComplete="name"
                                    />

                                </div>

                            </div>


                            <div className="ff-field">

                                <label>
                                    Email address
                                </label>

                                <div className="ff-input-wrap">

                                    <Mail size={17} />

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            form.email
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="customer@example.com"
                                        autoComplete="email"
                                    />

                                </div>

                            </div>


                            {/* PAYMENT */}

                            <div className="ff-section-label ff-section-spaced">
                                <WalletCards size={16} />
                                Payment details
                            </div>


                            <div className="ff-amount-row">

                                <div className="ff-field ff-amount-field">

                                    <label>
                                        Amount
                                    </label>

                                    <div className="ff-input-wrap ff-amount-input">

                                        <span className="ff-currency-symbol">
                                            ₹
                                        </span>

                                        <input
                                            type="number"
                                            name="amount"
                                            min="0.01"
                                            step="0.01"
                                            value={
                                                form.amount
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="0.00"
                                        />

                                    </div>

                                </div>


                                <div className="ff-field ff-currency-field">

                                    <label>
                                        Currency
                                    </label>

                                    <div className="ff-input-wrap">

                                        <select
                                            name="currency"
                                            value={
                                                form.currency
                                            }
                                            onChange={
                                                handleChange
                                            }
                                        >

                                            <option value="INR">
                                                INR — Indian Rupee
                                            </option>

                                            <option value="USD">
                                                USD — US Dollar
                                            </option>

                                            <option value="EUR">
                                                EUR — Euro
                                            </option>

                                            <option value="GBP">
                                                GBP — British Pound
                                            </option>

                                        </select>

                                    </div>

                                </div>

                            </div>


                            <div className="ff-field">

                                <label>
                                    Payment description
                                </label>

                                <div className="ff-input-wrap ff-textarea-wrap">

                                    <FileText size={17} />

                                    <textarea
                                        name="description"
                                        value={
                                            form.description
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="What is this payment for?"
                                        maxLength={255}
                                    />

                                </div>


                                <div className="ff-field-footer">

                                    <span>
                                        Add a short description
                                    </span>

                                    <span>
                                        {
                                            form.description.length
                                        }
                                        /255
                                    </span>

                                </div>

                            </div>


                            <button
                                type="submit"
                                className="ff-primary-button"
                                disabled={loading}
                            >

                                <span>

                                    {loading
                                        ? "Creating payment..."
                                        : "Create Payment"
                                    }

                                </span>


                                {!loading && (
                                    <ArrowRight size={18} />
                                )}

                            </button>

                        </form>

                    </section>


                    {/* =================================
                        PREVIEW
                    ================================== */}

                    <aside className="ff-preview-column">

                        <div className="ff-glass-card ff-preview-card">

                            <div className="ff-preview-top">

                                <div>

                                    <span className="ff-preview-label">
                                        PAYMENT PREVIEW
                                    </span>

                                    <h2>
                                        {formattedAmount}
                                    </h2>

                                </div>


                                <div className="ff-preview-icon">
                                    <CreditCard size={22} />
                                </div>

                            </div>


                            <div className="ff-preview-divider" />


                            <div className="ff-preview-row">

                                <span>
                                    Customer
                                </span>

                                <strong>
                                    {form.customer_name ||
                                        "Not provided"}
                                </strong>

                            </div>


                            <div className="ff-preview-row">

                                <span>
                                    Email
                                </span>

                                <strong className="ff-preview-email">
                                    {form.email ||
                                        "Not provided"}
                                </strong>

                            </div>


                            <div className="ff-preview-row">

                                <span>
                                    Currency
                                </span>

                                <strong>
                                    {form.currency}
                                </strong>

                            </div>


                            <div className="ff-preview-row ff-preview-description">

                                <span>
                                    Description
                                </span>

                                <strong>
                                    {form.description ||
                                        "No description added"}
                                </strong>

                            </div>


                            <div className="ff-preview-status">

                                <div className="ff-status-dot" />

                                <span>
                                    Ready for secure checkout
                                </span>

                            </div>

                        </div>


                        <div className="ff-security-card">

                            <div className="ff-security-icon">
                                <BadgeCheck size={20} />
                            </div>

                            <div>

                                <h3>
                                    Secure by design
                                </h3>

                                <p>
                                    Your payment is processed
                                    through FinFlow's secure
                                    payment workflow.
                                </p>

                            </div>

                        </div>


                        <div className="ff-info-strip">

                            <ShieldCheck size={18} />

                            <span>
                                Payment data is protected
                                throughout the transaction.
                            </span>

                        </div>

                    </aside>

                </div>

            </main>

        </AppShell>
    );
}


export default CreatePayment;
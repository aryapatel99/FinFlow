import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import {
    createCheckout,
    verifyPayment,
} from "../services/api";


const RAZORPAY_SCRIPT_URL =
    "https://checkout.razorpay.com/v1/checkout.js";


function RazorpayCheckout({
    paymentId,
    customerName,
    customerEmail,
}) {

    const navigate = useNavigate();


    const [
        loading,
        setLoading
    ] = useState(false);


    const [
        error,
        setError
    ] = useState("");


    const [
        scriptLoaded,
        setScriptLoaded
    ] = useState(false);


    // =====================================
    // Load Razorpay Checkout Script
    // =====================================

    useEffect(() => {

        if (
            window.Razorpay
        ) {

            setScriptLoaded(true);

            return;

        }


        const existingScript =
            document.querySelector(
                `script[src="${RAZORPAY_SCRIPT_URL}"]`
            );


        if (existingScript) {

            existingScript.addEventListener(
                "load",
                () => {
                    setScriptLoaded(true);
                }
            );


            existingScript.addEventListener(
                "error",
                () => {
                    setError(
                        "Unable to load Razorpay Checkout."
                    );
                }
            );


            return;

        }


        const script =
            document.createElement(
                "script"
            );


        script.src =
            RAZORPAY_SCRIPT_URL;


        script.async = true;


        script.onload = () => {

            setScriptLoaded(true);

        };


        script.onerror = () => {

            setError(
                "Unable to load Razorpay Checkout."
            );

        };


        document.body.appendChild(
            script
        );


        return () => {

            script.onload = null;

            script.onerror = null;

        };

    }, []);


    // =====================================
    // Start Checkout
    // =====================================

    const handleCheckout =
        async () => {

            setError("");


            if (!paymentId) {

                setError(
                    "Payment ID is missing."
                );

                return;

            }


            if (!scriptLoaded) {

                setError(
                    "Razorpay Checkout is still loading. Please try again."
                );

                return;

            }


            if (!window.Razorpay) {

                setError(
                    "Razorpay Checkout is unavailable."
                );

                return;

            }


            setLoading(true);


            try {

                // ---------------------------------
                // Ask backend to create/reuse order
                // ---------------------------------

                const order =
                    await createCheckout(
                        paymentId
                    );


                // ---------------------------------
                // Razorpay Checkout configuration
                // ---------------------------------

                const options = {

                    key:
                        order.razorpay_key_id,

                    amount:
                        Math.round(
                            Number(
                                order.amount
                            ) * 100
                        ),

                    currency:
                        order.currency,

                    name:
                        "FinFlow",

                    description:
                        "FinFlow Payment",

                    order_id:
                        order.razorpay_order_id,


                    prefill: {

                        name:
                            customerName || "",

                        email:
                            customerEmail || "",

                    },


                    theme: {

                        color:
                            "#2563eb",

                    },


                    // ---------------------------------
                    // Razorpay Success
                    // ---------------------------------

                    handler:
                        async function (
                            response
                        ) {

                            try {

                                setLoading(true);


                                await verifyPayment({

                                    payment_id:
                                        paymentId,

                                    razorpay_order_id:
                                        response.razorpay_order_id,

                                    razorpay_payment_id:
                                        response.razorpay_payment_id,

                                    razorpay_signature:
                                        response.razorpay_signature,

                                });


                                navigate(

                                    `/payments/${paymentId}/result?status=success&razorpay_payment_id=${encodeURIComponent(
                                        response.razorpay_payment_id
                                    )}`,

                                    {
                                        replace: true,
                                    }

                                );


                            } catch (error) {

                                console.error(
                                    "Payment verification failed:",
                                    error
                                );


                                setError(

                                    error.response?.data?.detail ||

                                    "Payment verification failed."

                                );


                                setLoading(false);


                                navigate(

                                    `/payments/${paymentId}/result?status=failed`,

                                    {
                                        replace: true,
                                    }

                                );

                            }

                        },


                    // ---------------------------------
                    // Razorpay Modal Dismissed
                    // ---------------------------------

                    modal: {

                        ondismiss:
                            function () {

                                setLoading(
                                    false
                                );

                            },

                    },

                };


                const razorpay =
                    new window.Razorpay(
                        options
                    );


                // ---------------------------------
                // Razorpay Payment Failed
                // ---------------------------------

                razorpay.on(

                    "payment.failed",

                    function () {

                        setLoading(
                            false
                        );


                        navigate(

                            `/payments/${paymentId}/result?status=failed`,

                            {
                                replace: true,
                            }

                        );

                    }

                );


                razorpay.open();


            } catch (error) {

                console.error(
                    "Razorpay checkout failed:",
                    error
                );


                setError(

                    error.response?.data?.detail ||

                    "Unable to start Razorpay checkout."

                );


                setLoading(false);

            }

        };


    return (

        <div>

            {error && (

                <p>
                    {error}
                </p>

            )}


            <button

                type="button"

                onClick={
                    handleCheckout
                }

                disabled={
                    loading ||
                    !scriptLoaded
                }

            >

                {loading

                    ? "Processing Payment..."

                    : scriptLoaded

                        ? "Pay Now"

                        : "Loading Razorpay..."

                }

            </button>

        </div>

    );

}


export default RazorpayCheckout;
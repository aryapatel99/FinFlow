import axios from "axios";


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";


const api = axios.create({

    baseURL: API_URL,

    headers: {
        "Content-Type": "application/json",
    },

});


// =====================================
// Request Interceptor
// =====================================
// Automatically attach JWT to protected
// FastAPI endpoints.
// =====================================

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem(
                "access_token"
            );


        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }


        return config;

    },

    (error) => {

        return Promise.reject(error);

    }

);


// =====================================
// Response Interceptor
// =====================================
// Remove invalid/expired token when
// FastAPI returns 401.
// =====================================

api.interceptors.response.use(

    (response) => {

        return response;

    },

    (error) => {

        if (
            error.response?.status === 401
        ) {

            localStorage.removeItem(
                "access_token"
            );

        }


        return Promise.reject(error);

    }

);


// =====================================
// Authentication
// =====================================

export const registerUser = async (
    userData
) => {

    const response = await api.post(
        "/auth/register",
        userData
    );


    return response.data;

};


export const loginUser = async (
    email,
    password
) => {

    const formData =
        new URLSearchParams();


    formData.append(
        "username",
        email
    );


    formData.append(
        "password",
        password
    );


    const response = await api.post(

        "/auth/login",

        formData,

        {
            headers: {
                "Content-Type":
                    "application/x-www-form-urlencoded",
            },
        }

    );


    return response.data;

};


// =====================================
// Payments
// =====================================

// Create Payment

export const createPayment = async (
    paymentData
) => {

    const response = await api.post(
        "/payments",
        paymentData
    );


    return response.data;

};


// Get My Payments

export const getMyPayments = async () => {

    const response = await api.get(
        "/payments"
    );


    return response.data;

};


// Get Payment By ID

export const getPayment = async (
    paymentId
) => {

    const response = await api.get(
        `/payments/${paymentId}`
    );


    return response.data;

};


// Delete Payment

export const deletePayment = async (
    paymentId
) => {

    const response = await api.delete(
        `/payments/${paymentId}`
    );


    return response.data;

};


// =====================================
// Razorpay Checkout
// =====================================
// Used in Phase 4 Part 3.
// =====================================

export const createCheckout = async (
    paymentId
) => {

    const response = await api.post(
        `/payments/${paymentId}/checkout`
    );


    return response.data;

};


// =====================================
// Export Axios Instance
// =====================================

export default api;
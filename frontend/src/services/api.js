import axios from "axios";


const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "http://127.0.0.1:8000";


const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// =====================================
// Authentication Interceptor
// =====================================

api.interceptors.request.use(
    (config) => {

        const token =
            localStorage.getItem("access_token");

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
// Authentication
// =====================================

export const registerUser =
    async (data) => {

        const response =
            await api.post(
                "/auth/register",
                data
            );

        return response.data;
    };


export const loginUser =
    async (email, password) => {

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

        const response =
            await api.post(
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
// User Profile
// =====================================

export const getMyProfile =
    async () => {

        const response =
            await api.get(
                "/users/me"
            );

        return response.data;
    };


// Compatibility alias used by Profile.jsx

export const getAccount =
    getMyProfile;


// =====================================
// User Password
// =====================================

export const changeMyPassword =
    async (
        current_password,
        new_password
    ) => {

        const response =
            await api.patch(
                "/users/me/password",
                {
                    current_password,
                    new_password,
                }
            );

        return response.data;
    };


// Compatibility alias used by ChangePassword.jsx

export const changePassword =
    changeMyPassword;


// =====================================
// Customer Payments
// =====================================

export const createPayment =
    async (data) => {

        const response =
            await api.post(
                "/payments",
                data
            );

        return response.data;
    };


export const getPayments =
    async () => {

        const response =
            await api.get(
                "/payments"
            );

        return response.data;
    };


// Alias used by Payments.jsx

export const getMyPayments =
    async () => {

        const response =
            await api.get(
                "/payments"
            );

        return response.data;
    };


export const getPayment =
    async (paymentId) => {

        const response =
            await api.get(
                `/payments/${paymentId}`
            );

        return response.data;
    };


export const deletePayment =
    async (paymentId) => {

        const response =
            await api.delete(
                `/payments/${paymentId}`
            );

        return response.data;
    };


// =====================================
// Razorpay Checkout
// =====================================

export const createCheckout =
    async (paymentId) => {

        const response =
            await api.post(
                `/payments/${paymentId}/checkout`
            );

        return response.data;
    };


// =====================================
// Razorpay Verification
// =====================================

export const verifyPayment =
    async ({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    }) => {

        const response =
            await api.post(
                "/payments/verify",
                {
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                }
            );

        return response.data;
    };


// =====================================
// Admin Dashboard
// =====================================

export const getAdminDashboard =
    async () => {

        const response =
            await api.get(
                "/admin/dashboard"
            );

        return response.data;
    };


// =====================================
// Admin User Management
// =====================================

export const getAdminUsers =
    async () => {

        const response =
            await api.get(
                "/admin/users"
            );

        return response.data;
    };


export const getAdminUser =
    async (email) => {

        const response =
            await api.get(
                `/admin/users/${encodeURIComponent(email)}`
            );

        return response.data;
    };


export const updateUserRole =
    async (
        email,
        role
    ) => {

        const response =
            await api.patch(
                `/admin/users/${encodeURIComponent(email)}/role`,
                null,
                {
                    params: {
                        role,
                    },
                }
            );

        return response.data;
    };


// Compatibility alias used by AdminUsers.jsx

export const updateAdminUserRole =
    updateUserRole;


export const resetUserPassword =
    async (
        email,
        new_password
    ) => {

        const response =
            await api.patch(
                `/admin/users/${encodeURIComponent(email)}/password`,
                {
                    new_password,
                }
            );

        return response.data;
    };


export const deleteUser =
    async (email) => {

        const response =
            await api.delete(
                `/admin/users/${encodeURIComponent(email)}`
            );

        return response.data;
    };


// Compatibility alias used by AdminUsers.jsx

export const deleteAdminUser =
    deleteUser;


// =====================================
// Admin Payment Management
// =====================================

export const getAdminPayments =
    async () => {

        const response =
            await api.get(
                "/admin/payments"
            );

        return response.data;
    };


export const getAdminPayment =
    async (paymentId) => {

        const response =
            await api.get(
                `/admin/payments/${paymentId}`
            );

        return response.data;
    };


export const updateAdminPaymentStatus =
    async (
        paymentId,
        status
    ) => {

        const response =
            await api.patch(
                `/admin/payments/${paymentId}/status`,
                {
                    status,
                }
            );

        return response.data;
    };


export const deleteAdminPayment =
    async (paymentId) => {

        const response =
            await api.delete(
                `/admin/payments/${paymentId}`
            );

        return response.data;
    };


// =====================================
// Default Axios Instance
// =====================================

export default api;
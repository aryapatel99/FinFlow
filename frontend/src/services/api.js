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
// If FastAPI returns 401, remove the
// invalid/expired token.
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
// Register
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


// =====================================
// Login
// =====================================

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
// Export Axios Instance
// =====================================

export default api;
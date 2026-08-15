import {
    createContext,
    useContext,
    useState,
} from "react";

import { jwtDecode } from "jwt-decode";

import { loginUser } from "../services/api";


const AuthContext = createContext(null);


// =====================================
// Decode JWT
// =====================================

function getUserFromToken(token) {

    if (!token) {
        return null;
    }

    try {

        const decoded = jwtDecode(token);

        // Check token expiration
        if (
            decoded.exp &&
            decoded.exp * 1000 < Date.now()
        ) {
            localStorage.removeItem(
                "access_token"
            );

            return null;
        }


        return {
            user_id: decoded.user_id,
            email: decoded.email,
            role: decoded.role,
        };

    } catch (error) {

        console.error(
            "Invalid authentication token."
        );

        localStorage.removeItem(
            "access_token"
        );

        return null;
    }
}


// =====================================
// Authentication Provider
// =====================================

export function AuthProvider({ children }) {

    const initialToken =
        localStorage.getItem(
            "access_token"
        );


    const [token, setToken] = useState(
        initialToken
    );


    const [user, setUser] = useState(
        getUserFromToken(
            initialToken
        )
    );


    // =================================
    // Login
    // =================================

    const login = async (
        email,
        password
    ) => {

        const data = await loginUser(
            email,
            password
        );


        const authenticatedUser =
            getUserFromToken(
                data.access_token
            );


        if (!authenticatedUser) {

            throw new Error(
                "Invalid authentication token received."
            );
        }


        localStorage.setItem(
            "access_token",
            data.access_token
        );


        setToken(
            data.access_token
        );


        setUser(
            authenticatedUser
        );


        return data;
    };


    // =================================
    // Logout
    // =================================

    const logout = () => {

        localStorage.removeItem(
            "access_token"
        );


        setToken(null);

        setUser(null);
    };


    // =================================
    // Authentication State
    // =================================

    const isAuthenticated =
        Boolean(
            token &&
            user
        );


    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}


// =====================================
// useAuth Hook
// =====================================

export function useAuth() {

    return useContext(
        AuthContext
    );
}
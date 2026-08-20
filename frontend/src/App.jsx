import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import {
    useContext,
} from "react";

import {
    AuthContext,
} from "./context/AuthContext";

import AppShell from "./components/AppShell";


// ==========================================
// Public Pages
// ==========================================

import Login from "./pages/Login";
import Register from "./pages/Register";


// ==========================================
// Customer Pages
// ==========================================

import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentResult from "./pages/PaymentResult";

import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";


// ==========================================
// Admin Pages
// ==========================================

import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";


// ==========================================
// Protected Route
// ==========================================

function ProtectedRoute({
    children,
}) {

    const {
        user,
        loading,
    } = useContext(AuthContext);


    // --------------------------------------
    // Authentication still loading
    // --------------------------------------

    if (loading) {

        return (
            <div className="app-loading-screen">

                <div className="app-loading-card">

                    <div className="app-loading-logo">
                        F
                    </div>

                    <div className="app-loading-spinner" />

                    <h2>
                        FinFlow
                    </h2>

                    <p>
                        Loading your workspace...
                    </p>

                </div>

            </div>
        );

    }


    // --------------------------------------
    // Not authenticated
    // --------------------------------------

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // --------------------------------------
    // Authenticated
    // --------------------------------------

    return (
        <AppShell>
            {children}
        </AppShell>
    );

}


// ==========================================
// Admin Route
// ==========================================

function AdminRoute({
    children,
}) {

    const {
        user,
        loading,
    } = useContext(AuthContext);


    // --------------------------------------
    // Authentication still loading
    // --------------------------------------

    if (loading) {

        return (
            <div className="app-loading-screen">

                <div className="app-loading-card">

                    <div className="app-loading-logo">
                        F
                    </div>

                    <div className="app-loading-spinner" />

                    <h2>
                        FinFlow
                    </h2>

                    <p>
                        Loading administration...
                    </p>

                </div>

            </div>
        );

    }


    // --------------------------------------
    // Not authenticated
    // --------------------------------------

    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    // --------------------------------------
    // Not an admin
    // --------------------------------------

    if (user.role !== "admin") {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    // --------------------------------------
    // Admin authenticated
    // --------------------------------------

    return (
        <AppShell>
            {children}
        </AppShell>
    );

}


// ==========================================
// Application
// ==========================================

function App() {

    return (
        <BrowserRouter>

            <Routes>


                {/* ==================================
                    PUBLIC
                ================================== */}

                <Route
                    path="/login"
                    element={
                        <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        <Register />
                    }
                />


                {/* ==================================
                    CUSTOMER / AUTHENTICATED
                ================================== */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>

                            <Dashboard />

                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute>

                            <Payments />

                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/payments/create"
                    element={
                        <ProtectedRoute>

                            <CreatePayment />

                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/payments/:paymentId"
                    element={
                        <ProtectedRoute>

                            <PaymentDetails />

                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/payments/:paymentId/result"
                    element={
                        <ProtectedRoute>

                            <PaymentResult />

                        </ProtectedRoute>
                    }
                />


                {/* ==================================
                    ACCOUNT
                ================================== */}

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>

                            <Profile />

                        </ProtectedRoute>
                    }
                />


                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute>

                            <ChangePassword />

                        </ProtectedRoute>
                    }
                />


                {/* ==================================
                    ADMIN
                ================================== */}

                <Route
                    path="/admin/users"
                    element={
                        <AdminRoute>

                            <AdminUsers />

                        </AdminRoute>
                    }
                />


                <Route
                    path="/admin/payments"
                    element={
                        <AdminRoute>

                            <AdminPayments />

                        </AdminRoute>
                    }
                />


                {/* ==================================
                    DEFAULT
                ================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* ==================================
                    UNKNOWN ROUTES
                ================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );

}


export default App;
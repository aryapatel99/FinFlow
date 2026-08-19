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


import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentResult from "./pages/PaymentResult";

import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import AdminUsers from "./pages/AdminUsers";
import AdminPayments from "./pages/AdminPayments";


function ProtectedRoute({
    children,
}) {

    const {
        user,
        loading,
    } = useContext(AuthContext);


    if (loading) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return children;
}


function AdminRoute({
    children,
}) {

    const {
        user,
        loading,
    } = useContext(AuthContext);


    if (loading) {

        return (
            <div>
                Loading...
            </div>
        );

    }


    if (!user) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    if (user.role !== "admin") {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    return children;
}


function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* ==========================
                    Public
                ========================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* ==========================
                    Customer / Authenticated
                ========================== */}

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


                {/* ==========================
                    Admin
                ========================== */}

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


                {/* ==========================
                    Default
                ========================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

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
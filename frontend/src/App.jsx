import {
    BrowserRouter,
    Navigate,
    Route,
    Routes,
} from "react-router-dom";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Payments from "./pages/Payments";
import CreatePayment from "./pages/CreatePayment";
import PaymentDetails from "./pages/PaymentDetails";
import PaymentResult from "./pages/PaymentResult";


// =====================================
// Protected Route
// =====================================

function ProtectedRoute({ children }) {

    const {
        isAuthenticated,
    } = useAuth();


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    return children;
}


// =====================================
// Admin Route
// =====================================

function AdminRoute({ children }) {

    const {
        isAuthenticated,
        user,
    } = useAuth();


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    if (user?.role !== "admin") {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );
    }


    return children;
}


// =====================================
// Temporary Admin Dashboard
// =====================================

function AdminDashboard() {

    const {
        user,
    } = useAuth();


    return (
        <div>

            <h1>
                FinFlow Admin Dashboard
            </h1>


            <p>
                Welcome, {user?.email}
            </p>


            <p>
                Role: {user?.role}
            </p>

        </div>
    );
}


// =====================================
// Application
// =====================================

function App() {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Dashboard */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Payments */}

                <Route
                    path="/payments"
                    element={
                        <ProtectedRoute>
                            <Payments />
                        </ProtectedRoute>
                    }
                />


                {/* Create Payment */}

                <Route
                    path="/payments/create"
                    element={
                        <ProtectedRoute>
                            <CreatePayment />
                        </ProtectedRoute>
                    }
                />


                {/* Payment Details */}

                <Route
                    path="/payments/:payment_id"
                    element={
                        <ProtectedRoute>
                            <PaymentDetails />
                        </ProtectedRoute>
                    }
                />


                {/* Payment Result */}

                <Route
                    path="/payments/:payment_id/result"
                    element={
                        <ProtectedRoute>
                            <PaymentResult />
                        </ProtectedRoute>
                    }
                />


                {/* Admin */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />


                {/* Root */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* Unknown */}

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
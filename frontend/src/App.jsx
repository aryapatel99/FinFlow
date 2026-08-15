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

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* Customer / Authenticated Route */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />


                {/* Admin Route */}

                <Route
                    path="/admin"
                    element={
                        <AdminRoute>
                            <AdminDashboard />
                        </AdminRoute>
                    }
                />


                {/* Default Route */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />


                {/* Unknown Route */}

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
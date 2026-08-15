import {
    useState,
} from "react";

import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import { useAuth } from "../context/AuthContext";


function Login() {

    const navigate = useNavigate();

    const {
        login,
        isAuthenticated,
    } = useAuth();


    const [
        email,
        setEmail
    ] = useState("");


    const [
        password,
        setPassword
    ] = useState("");


    const [
        error,
        setError
    ] = useState("");


    const [
        loading,
        setLoading
    ] = useState(false);


    // =================================
    // Already authenticated
    // =================================

    if (isAuthenticated) {

        return (
            <Navigate
                to="/dashboard"
                replace
            />
        );

    }


    // =================================
    // Login
    // =================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");

        setLoading(true);


        try {

            const data =
                await login(
                    email,
                    password
                );


            /*
             * Redirect admins to the
             * admin dashboard.
             *
             * Customers go to the
             * normal dashboard.
             */

            if (data?.access_token) {

                navigate(
                    "/dashboard",
                    {
                        replace: true,
                    }
                );

            }

        } catch (error) {

            const message =
                error.response?.data?.detail ||
                "Login failed. Please check your email and password.";


            setError(message);

        } finally {

            setLoading(false);

        }

    };


    return (
        <div>

            <h1>
                FinFlow
            </h1>


            <h2>
                Login
            </h2>


            {error && (

                <p>
                    {error}
                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >

                <div>

                    <label>
                        Email
                    </label>


                    <input

                        type="email"

                        value={email}

                        onChange={(event) =>
                            setEmail(
                                event.target.value
                            )
                        }

                        placeholder="Enter your email"

                        autoComplete="email"

                        required

                    />

                </div>


                <br />


                <div>

                    <label>
                        Password
                    </label>


                    <input

                        type="password"

                        value={password}

                        onChange={(event) =>
                            setPassword(
                                event.target.value
                            )
                        }

                        placeholder="Enter your password"

                        autoComplete="current-password"

                        required

                    />

                </div>


                <br />


                <button

                    type="submit"

                    disabled={loading}

                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>

            </form>


            <p>

                Don't have an account?{" "}

                <Link to="/register">
                    Register
                </Link>

            </p>

        </div>
    );
}


export default Login;
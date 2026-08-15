import {
    useState,
} from "react";

import {
    Link,
    Navigate,
    useNavigate,
} from "react-router-dom";

import { registerUser } from "../services/api";

import { useAuth } from "../context/AuthContext";


function Register() {

    const navigate = useNavigate();


    const {
        isAuthenticated,
    } = useAuth();


    const [
        fullName,
        setFullName
    ] = useState("");


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
        success,
        setSuccess
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
    // Registration
    // =================================

    const handleSubmit = async (
        event
    ) => {

        event.preventDefault();


        setError("");

        setSuccess("");

        setLoading(true);


        try {

            await registerUser({

                full_name:
                    fullName.trim(),

                email:
                    email.trim(),

                password,

            });


            setSuccess(
                "Account created successfully. Redirecting to login..."
            );


            setTimeout(
                () => {

                    navigate(
                        "/login",
                        {
                            replace: true,
                        }
                    );

                },
                1000
            );


        } catch (error) {

            const message =
                error.response?.data?.detail ||
                "Registration failed. Please try again.";


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
                Create Account
            </h2>


            {error && (

                <p>
                    {error}
                </p>

            )}


            {success && (

                <p>
                    {success}
                </p>

            )}


            <form
                onSubmit={handleSubmit}
            >

                <div>

                    <label>
                        Full Name
                    </label>


                    <input

                        type="text"

                        value={fullName}

                        onChange={(event) =>
                            setFullName(
                                event.target.value
                            )
                        }

                        placeholder="Enter your full name"

                        autoComplete="name"

                        required

                    />

                </div>


                <br />


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

                        placeholder="Minimum 8 characters"

                        autoComplete="new-password"

                        minLength={8}

                        required

                    />

                </div>


                <br />


                <button

                    type="submit"

                    disabled={loading}

                >

                    {loading
                        ? "Creating Account..."
                        : "Register"
                    }

                </button>

            </form>


            <p>

                Already have an account?{" "}

                <Link to="/login">
                    Login
                </Link>

            </p>

        </div>
    );
}


export default Register;
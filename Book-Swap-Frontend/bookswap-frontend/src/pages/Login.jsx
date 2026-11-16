
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let message = "";

        if (name === "email") {
            if (!value.trim()) {
                message = "Email is required.";
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                message = "Please enter a valid email address.";
            }
        }

        if (name === "password") {
            if (!value) {
                message = "Password is required.";
            }
        }

        return message;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "email") {
            setEmail(value);
        }

        if (name === "password") {
            setPassword(value);
        }

        setFieldErrors({
            ...fieldErrors,
            [name]: validateField(name, value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = {
            email: validateField("email", email),
            password: validateField("password", password)
        };

        setFieldErrors(errors);

        if (Object.values(errors).some((message) => message !== "")) {
            return;
        }
        setError("");
        setLoading(true);

        try {
            await login({ email, password });
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message || "Invalid email or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Welcome Back!</h1>
                <p>Log in to continue your BookSwap journey.</p>

                <form onSubmit={handleSubmit}>
                    <label>Email Address</label>
                    <input type="email" name="email" placeholder="Enter your email" value={email} onChange={handleChange} required/>
                    {fieldErrors.email && ( <p className="field-error">{fieldErrors.email}</p>)}

                    <label>Password</label>
                    <input type="password" name="password" placeholder="Enter your password" value={password} onChange={handleChange} required/>
                    {fieldErrors.password && (<p className="field-error">{fieldErrors.password}</p>)}

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account? <Link to="/register">Register</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;

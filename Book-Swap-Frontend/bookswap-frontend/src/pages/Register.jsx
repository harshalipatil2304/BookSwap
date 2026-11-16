
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        city: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});

    const { register } = useAuth();
    const navigate = useNavigate();

    const validateField = (name, value) => {
        let message = "";

        if (name === "fullName") {
            if (!value.trim()) {
                message = "Full name is required.";
            } else if (!/^[A-Za-z ]+$/.test(value)) {
                message = "Only letters and spaces are allowed.";
            }
        }

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
            } else if (value.length < 8) {
                message = "Password must contain at least 8 characters.";
            }
        }

        if (name === "city" && value.trim() && !/^[A-Za-z ]+$/.test(value)) {
            message = "City should contain only letters and spaces.";
        }

        return message;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });

        setFieldErrors({
            ...fieldErrors,
            [name]: validateField(name, value)
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = {};

        Object.keys(formData).forEach((name) => {
            errors[name] = validateField(name, formData[name]);
        });

        setFieldErrors(errors);

        if (Object.values(errors).some((message) => message !== "")) {
            return;
        }

        setError("");
        setLoading(true);

        try {
            await register(formData);
            navigate("/");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <h1>Create Account</h1>
                <p>Join BookSwap and give your books a new life.</p>

                <form onSubmit={handleSubmit}>
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Enter your full name"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.fullName && (
                        <p className="field-error">{fieldErrors.fullName}</p>
                    )}

                    <label>Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    {fieldErrors.email && (
                        <p className="field-error">{fieldErrors.email}</p>
                    )}

                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Minimum 8 characters"
                        value={formData.password}
                        onChange={handleChange}
                        minLength={8}
                        required
                    />
                    {fieldErrors.password && (
                        <p className="field-error">{fieldErrors.password}</p>
                    )}

                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Enter your city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    {fieldErrors.city && ( <p className="field-error">{fieldErrors.city}</p>)}

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;

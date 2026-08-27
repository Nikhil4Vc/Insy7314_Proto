import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/api";

export default function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("client");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");
        setLoading(true);

        try {
            await api.post("/auth/register", {
                name,
                email,
                password,
                role
            });

            navigate("/login");
        } catch (requestError) {
            const response = requestError.response?.data;

            if (response?.errors?.length > 0) {
                setError(
                    response.errors
                        .map((item) => item.message)
                        .join(" ")
                );
            } else {
                setError(
                    response?.message ||
                    "Registration failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-page">
            <section className="auth-card">
                <div className="auth-header">
                    <h1>HustleHub+</h1>
                    <h2>Create your account</h2>

                    <p>
                        Join the marketplace as a client
                        or freelancer.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >
                    <div className="form-group">
                        <label htmlFor="name">
                            Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(event) =>
                                setName(event.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">
                            Email
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Create a password"
                            required
                        />

                        <small className="form-help">
                            At least 8 characters with
                            uppercase, lowercase, a number
                            and a special character.
                        </small>
                    </div>

                    <div className="form-group">
                        <span className="form-label">
                            I want to join as
                        </span>

                        <div className="role-selector">
                            <button
                                type="button"
                                className={
                                    role === "client"
                                        ? "role-option selected"
                                        : "role-option"
                                }
                                onClick={() =>
                                    setRole("client")
                                }
                            >
                                <strong>Client</strong>
                                <span>
                                    Find and book services
                                </span>
                            </button>

                            <button
                                type="button"
                                className={
                                    role === "freelancer"
                                        ? "role-option selected"
                                        : "role-option"
                                }
                                onClick={() =>
                                    setRole("freelancer")
                                }
                            >
                                <strong>Freelancer</strong>
                                <span>
                                    Create gigs and earn
                                </span>
                            </button>
                        </div>
                    </div>

                    {error && (
                        <p
                            className="form-error"
                            role="alert"
                        >
                            {error}
                        </p>
                    )}

                    <button
                        className="button auth-submit"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating account..."
                            : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </section>
        </main>
    );
}
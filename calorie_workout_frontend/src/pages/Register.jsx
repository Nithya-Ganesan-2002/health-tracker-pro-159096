import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// PUBLIC_INTERFACE
/** Registration page for creating a new account. */
export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await register(name, email, password);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create your account</h1>
          <p className="muted">Start tracking calories and workouts</p>
        </div>
        <form onSubmit={onSubmit} className="form">
          <label>Name</label>
          <input type="text" placeholder="Jane Doe" value={name} onChange={e => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" placeholder="Create a password" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <div className="alert">{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>
        <div className="auth-footer">
          <span>Already have an account?</span> <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

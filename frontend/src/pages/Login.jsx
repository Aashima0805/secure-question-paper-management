import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import { saveSession } from "../auth";
import StatusMessage from "../components/StatusMessage";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/users/login", form);

      if (response.data.token) {
        saveSession(response.data);
        navigate("/dashboard");
      } else {
        localStorage.setItem("pendingEmail", response.data.email || form.email);
        navigate("/verify-otp");
      }
    } catch (error) {
      setMessage(error.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-mark">SQ</div>
        <h1>SecureQPM</h1>
        <p className="muted">Secure Question Paper Management</p>

        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})} required />

          <label>Password</label>
          <input type="password" value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})} required />

          <button disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
        </form>

        <StatusMessage message={message} error />
        <p className="auth-link">New user? <Link to="/register">Create account</Link></p>
      </div>
    </div>
  );
}

export default Login;
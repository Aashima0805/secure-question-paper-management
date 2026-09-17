import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      await api.post("/users/register", form);
      navigate("/login");
    } catch (error) {
      setMessage(error.response?.data || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-mark">SQ</div>
        <h1>Create Account</h1>
        <p className="muted">New accounts are registered with the USER role.</p>

        <form onSubmit={submit}>
          <label>Name</label>
          <input value={form.name}
            onChange={(e) => setForm({...form, name: e.target.value})} required />

          <label>Email</label>
          <input type="email" value={form.email}
            onChange={(e) => setForm({...form, email: e.target.value})} required />

          <label>Password</label>
          <input type="password" value={form.password}
            onChange={(e) => setForm({...form, password: e.target.value})} required />

          <button disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
        </form>

        <StatusMessage message={message} error />
        <p className="auth-link"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}

export default Register;
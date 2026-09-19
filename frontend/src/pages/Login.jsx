
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

  const demoAccounts = [
    { role: "Question Setter", email: "setter@test.com", password: "User@123" },
    { role: "Reviewer", email: "reviewer@test.com", password: "User@123" },
    { role: "Approver", email: "approver@test.com", password: "User@123" },
    { role: "Exam Center", email: "examcenter@test.com", password: "User@123" }
  ];

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
        localStorage.setItem(
          "pendingEmail",
          response.data.email || form.email
        );
        navigate("/verify-otp");
      }
    } catch (error) {
      setMessage(error.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const useDemoAccount = (account) => {
    setForm({
      email: account.email,
      password: account.password
    });
    setMessage("");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-mark">SQ</div>

        <h1>SecureQPM</h1>

        <p className="muted">
          Secure Question Paper Management
        </p>

        <form onSubmit={submit}>
          <label>Email</label>

          <input
            type="email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value
              })
            }
            required
          />

          <label>Password</label>

          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value
              })
            }
            required
          />

          <button disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <StatusMessage message={message} error />

        <div className="demo-accounts">
          <div className="demo-header">
            <div>
              <h3>Demo Accounts</h3>
              <p className="muted">
                Select a role to fill in the login details.
              </p>
            </div>
          </div>

          <div className="demo-list">
            {demoAccounts.map((account) => (
              <button
                type="button"
                className="demo-account"
                key={account.role}
                onClick={() => useDemoAccount(account)}
              >
                <span className="demo-role">
                  {account.role}
                </span>

                <span className="demo-email">
                  {account.email}
                </span>

                <span className="demo-use">
                  Use
                </span>
              </button>
            ))}
          </div>

          <p className="demo-note">
            Password: <strong>User@123</strong>
            <br />
            Admin login always requires OTP verification.
          </p>
        </div>

        <p className="auth-link">
          New user? <Link to="/register">Create account</Link>
        </p>
      </div>
    </div>
  );
}

export default Login
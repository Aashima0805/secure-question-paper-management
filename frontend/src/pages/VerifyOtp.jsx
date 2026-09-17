import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { saveSession } from "../auth";
import StatusMessage from "../components/StatusMessage";

function VerifyOtp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState(localStorage.getItem("pendingEmail") || "");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("/users/verify-otp", { email, otp });
      saveSession(response.data);
      localStorage.removeItem("pendingEmail");
      navigate("/dashboard");
    } catch (error) {
      setMessage(error.response?.data || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="logo-mark">SQ</div>
        <h1>Verify OTP</h1>
        <p className="muted">Enter the 6-digit OTP sent to your email.</p>

        <form onSubmit={submit}>
          <label>Email</label>
          <input type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} required />

          <label>OTP</label>
          <input inputMode="numeric" maxLength="6" value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} required />

          <button disabled={loading}>{loading ? "Verifying..." : "Verify OTP"}</button>
        </form>

        <StatusMessage message={message} error />
      </div>
    </div>
  );
}

export default VerifyOtp;
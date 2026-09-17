import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

const roles = [
  "USER",
  "QUESTION_SETTER",
  "REVIEWER",
  "APPROVER",
  "EXAM_CENTER"
];

function AdminUsers() {
  const [id, setId] = useState("");
  const [role, setRole] = useState("USER");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadMfaStatus();
  }, []);

  const loadMfaStatus = async () => {
    try {
      const response = await api.get("/admin/mfa");
      setMfaEnabled(response.data);
    } catch (err) {
      setError("Unable to load MFA status.");
    }
  };

  const submitRole = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await api.put(`/admin/users/${id}/role`, null, {
        params: { role }
      });

      setMessage("Role assigned successfully.");
      setId("");
    } catch (err) {
      setError(
        err.response?.data || "Role assignment failed."
      );
    }
  };

  const updateMfa = async (enabled) => {
    setMessage("");
    setError("");

    try {
      const response = await api.put("/admin/mfa", null, {
        params: { enabled }
      });

      setMfaEnabled(enabled);
      setMessage(response.data);
    } catch (err) {
      setError(
        err.response?.data || "MFA update failed."
      );
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Administrator</p>

        <h1>Users & Roles</h1>

        <p className="muted">
          Assign application roles and manage security settings.
        </p>
      </div>

      <div className="form-card narrow">

        <form onSubmit={submitRole}>
          <label>User ID</label>

          <input
            type="number"
            min="1"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />

          <label>Role</label>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            {roles.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button type="submit">
            Assign Role
          </button>
        </form>

        <div className="security-box">

          <h3>Global MFA</h3>

          <p className="muted">
            This setting controls OTP verification for all users.
          </p>

          <p>
            Current status:{" "}
            <strong>
              {mfaEnabled ? "ON" : "OFF"}
            </strong>
          </p>

          <div className="mfa-actions">

            <button
              type="button"
              onClick={() => updateMfa(true)}
            >
              Turn MFA ON
            </button>

            <button
              type="button"
              onClick={() => updateMfa(false)}
            >
              Turn MFA OFF
            </button>

          </div>

          <p className="muted">
            ADMIN always requires OTP verification.
          </p>

        </div>

        <StatusMessage message={message} />

        <StatusMessage
          message={error}
          error
        />

      </div>
    </Layout>
  );
}

export default AdminUsers;
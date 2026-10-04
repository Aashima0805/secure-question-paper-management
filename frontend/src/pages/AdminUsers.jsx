import React from "react";
import { useState } from "react";
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
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Administrator</p>

        <h1>Users & Roles</h1>

        <p className="muted">
          Assign application roles to users.
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
import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function ApprovePapers() {
  const [id, setId] = useState("");
  const [action, setAction] = useState("APPROVE");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/question-papers/approve", null, {
        params: {
          id: Number(id),
          action: action
        }
      });

      setMessage(
        action === "APPROVE"
          ? "Question paper approved successfully."
          : "Question paper rejected successfully."
      );

      setId("");
    } catch (err) {
      setError(
        err.response?.data || "Approval request failed."
      );
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Approver</p>

        <h1>Approve Question Paper</h1>

        <p className="muted">
          Approve or reject a question paper after review.
        </p>
      </div>

      <div className="form-card narrow">
        <form onSubmit={submit}>

          <label>Question Paper ID</label>

          <input
            type="number"
            min="1"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />

          <label>Action</label>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="APPROVE">Approve</option>
            <option value="REJECT">Reject</option>
          </select>

          <button type="submit">
            {action === "APPROVE"
              ? "Approve Paper"
              : "Reject Paper"}
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

export default ApprovePapers;
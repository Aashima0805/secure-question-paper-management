import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function ScheduleRelease() {
  const [id, setId] = useState("");
  const [releaseTime, setReleaseTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    try {
      await api.post("/question-papers/schedule", null, {
        params: {
          id: Number(id),
          releaseTime: releaseTime
        }
      });

      setMessage("Question paper release scheduled successfully.");

      setId("");
      setReleaseTime("");
    } catch (err) {
      setError(
  err.response?.data || err.message || "Scheduling failed."
);
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Approver</p>

        <h1>Schedule Release</h1>

        <p className="muted">
          Schedule the approved question paper for controlled release.
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

          <label>Release Date & Time</label>

          <input
  type="datetime-local"
  min={new Date().toISOString().slice(0, 16)}
  value={releaseTime}
  onChange={(e) => setReleaseTime(e.target.value)}
  required
/>

          <button type="submit">
            Schedule Release
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

export default ScheduleRelease;
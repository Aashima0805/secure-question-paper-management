import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function ApprovePapers() {
  const [id, setId] = useState("");
  const [papers, setPapers] = useState([]);
  const [action, setAction] = useState("APPROVE");
  const [releaseTime, setReleaseTime] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPapers = async () => {
    try {
      const response = await api.get("/question-papers/approve");
      setPapers(response.data);
    } catch (err) {
      setError(
        err.response?.data || "Unable to load reviewed papers."
      );
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const submit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!id) {
      setError("Please select a question paper.");
      return;
    }

    try {
      await api.post("/question-papers/approve", null, {
        params: {
          id: Number(id),
          action: action
        }
      });

      if (action === "APPROVE") {
        if (!releaseTime) {
          setError("Please select a release date and time.");
          return;
        }

        await api.post("/question-papers/schedule", null, {
          params: {
            id: Number(id),
            releaseTime: releaseTime
          }
        });

        setMessage(
          "Question paper approved and release scheduled successfully."
        );
      } else {
        setMessage(
          "Question paper rejected successfully."
        );
      }

      setId("");
      setReleaseTime("");
      setAction("APPROVE");

      loadPapers();

    } catch (err) {
      setError(
        err.response?.data ||
        err.message ||
        "Approval request failed."
      );
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Approver</p>

        <h1>Approve Question Paper</h1>

        <p className="muted">
          Approve or reject reviewed question papers and schedule approved papers for release.
        </p>
      </div>

      <div className="form-card narrow">
        <form onSubmit={submit}>

          <label>Question Paper</label>

          <select
            value={id}
            onChange={(e) => {
              setId(e.target.value);
              setMessage("");
              setError("");
            }}
            required
          >
            <option value="">
              Select question paper
            </option>

            {papers.map((paper) => (
              <option
                key={paper.id}
                value={paper.id}
              >
                ID: {paper.id} - {paper.title}
              </option>
            ))}
          </select>

          {papers.length === 0 && (
            <p className="muted">
              No reviewed question papers are currently available.
            </p>
          )}

          <label>Action</label>

          <select
            value={action}
            onChange={(e) => setAction(e.target.value)}
          >
            <option value="APPROVE">Approve</option>
            <option value="REJECT">Reject</option>
          </select>

          {action === "APPROVE" && (
            <>
              <label>Release Date & Time</label>

              <input
                type="datetime-local"
                min={new Date().toISOString().slice(0, 16)}
                value={releaseTime}
                onChange={(e) => setReleaseTime(e.target.value)}
                required
              />
            </>
          )}

          <button type="submit">
            {action === "APPROVE"
              ? "Approve & Schedule Paper"
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
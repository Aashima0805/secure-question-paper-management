
import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function ReviewPapers() {
  const [id, setId] = useState("");
  const [papers, setPapers] = useState([]);
  const [action, setAction] = useState("");
  const [remarks, setRemarks] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const getErrorMessage = async (err, fallback) => {
    const data = err.response?.data;

    if (data instanceof Blob) {
      return await data.text();
    }

    return data || fallback;
  };

  const loadPapers = async () => {
    try {
      const response = await api.get("/question-papers/review");
      setPapers(response.data);
    } catch (err) {
      setError(
        await getErrorMessage(
          err,
          "Unable to load question papers."
        )
      );
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const viewPaper = async () => {
    setMessage("");
    setError("");

    if (!id) {
      setError("Please select a question paper.");
      return;
    }

    try {
      const response = await api.get(
        `/question-papers/review/${id}`,
        {
          responseType: "blob"
        }
      );

      const fileUrl = URL.createObjectURL(response.data);

      window.open(fileUrl, "_blank");

    } catch (err) {
      setError(
        await getErrorMessage(
          err,
          "Unable to view question paper."
        )
      );
    }
  };

  const submit = async (status) => {
    setMessage("");
    setError("");

    if (!id) {
      setError("Please select a question paper.");
      return;
    }

    if (status === "REJECTED" && !remarks.trim()) {
      setError("Please provide a reason for rejection.");
      return;
    }

    try {
      await api.post("/question-papers/review", null, {
        params: {
          id: Number(id),
          status: status,
          remarks: status === "REJECTED" ? remarks : undefined
        }
      });

      setMessage(
        status === "REVIEWED"
          ? "Question paper marked as reviewed."
          : "Question paper rejected successfully."
      );

      setId("");
      setRemarks("");
      setAction("");

      loadPapers();

    } catch (err) {
      setError(
        await getErrorMessage(
          err,
          "Review request failed."
        )
      );
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Reviewer</p>

        <h1>Review Question Paper</h1>

        <p className="muted">
          View the question paper and complete the review.
        </p>
      </div>

      <div className="form-card narrow">

        <label>Question Paper</label>

        <select
          value={id}
          onChange={(e) => {
            setId(e.target.value);
            setAction("");
            setRemarks("");
            setMessage("");
            setError("");
          }}
        >
          <option value="">Select question paper</option>

          {papers.map((paper) => (
            <option key={paper.id} value={paper.id}>
              ID: {paper.id} - {paper.title}
            </option>
          ))}
        </select>

        {papers.length === 0 && (
          <p className="muted">
            No question papers are currently pending review.
          </p>
        )}

        <button
          type="button"
          onClick={viewPaper}
        >
          View Question Paper
        </button>

        <label>Review Decision</label>

        <select
          value={action}
          onChange={(e) => setAction(e.target.value)}
        >
          <option value="">Select decision</option>
          <option value="REVIEWED">Mark as Reviewed</option>
          <option value="REJECTED">Reject</option>
        </select>

        {action === "REJECTED" && (
          <>
            <label>Reason for Rejection</label>

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter the reason for rejecting this question paper"
              rows="5"
            />
          </>
        )}

        {action && (
          <button
            type="button"
            onClick={() => submit(action)}
          >
            {action === "REVIEWED"
              ? "Mark as Reviewed"
              : "Reject Question Paper"}
          </button>
        )}

        <StatusMessage message={message} />

        <StatusMessage
          message={error}
          error
        />

      </div>
    </Layout>
  );
}

export default ReviewPapers;


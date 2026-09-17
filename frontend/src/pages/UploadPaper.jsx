import React from "react";
import { useState } from "react";
import api from "../api";
import Layout from "../components/Layout";
import StatusMessage from "../components/StatusMessage";

function UploadPaper() {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Please select a question paper.");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("file", file);

    setLoading(true);

    try {
      await api.post("/question-papers/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage("Question paper uploaded successfully.");
      setTitle("");
      setFile(null);
      e.target.reset();

    } catch (err) {
      setError(
        err.response?.data || "Upload failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Question Setter</p>

        <h1>Upload Question Paper</h1>

        <p className="muted">
          The file is encrypted before private cloud storage.
        </p>
      </div>

      <div className="form-card">
        <form onSubmit={submit}>

          <label>Question Paper Title</label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Example: General Studies - 2026"
            required
          />

          <label>Question Paper File</label>

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            required
          />

          <button disabled={loading}>
            {loading ? "Uploading..." : "Securely Upload"}
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

export default UploadPaper;
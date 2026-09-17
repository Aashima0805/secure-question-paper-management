import React from "react";
import { useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function DownloadPapers() {
  const [id, setId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const download = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await api.get(`/question-papers/download/${id}`, {
        responseType: "blob"
      });

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = `question-paper-${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      setMessage("Question paper downloaded successfully.");
    } catch (err) {
      if (err.response?.data instanceof Blob) {
        setError("Download denied. The paper may not be approved or released yet.");
      } else {
        setError(err.response?.data || "Download failed.");
      }
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Exam Center</p>
        <h1>Download Released Paper</h1>
        <p className="muted">Download is available only after approval and scheduled release.</p>
      </div>

      <div className="form-card narrow">
        <form onSubmit={download}>
          <label>Question Paper ID</label>
          <input type="number" min="1" value={id}
            onChange={(e) => setId(e.target.value)} required />
          <button>Secure Download</button>
        </form>
        <StatusMessage message={message} />
        <StatusMessage message={error} error />
      </div>
    </Layout>
  );
}

export default DownloadPapers;
import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function DownloadPapers() {
  const [id, setId] = useState("");
  const [papers, setPapers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPapers = async () => {
    try {
      const response = await api.get("/question-papers/download");
      setPapers(response.data);
    } catch (err) {
      setError(
        err.response?.data ||
        "Unable to load approved question papers."
      );
    }
  };

  useEffect(() => {
    loadPapers();
  }, []);

  const download = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!id) {
      setError("Please select a question paper.");
      return;
    }

    try {
      const response = await api.get(
        `/question-papers/download/${id}`,
        {
          responseType: "blob"
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      link.href = url;
      link.download = `question-paper-${id}.pdf`;

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      setMessage(
        "Question paper downloaded successfully."
      );

    } catch (err) {
      if (err.response?.data instanceof Blob) {
        setError(
          "Download denied. The paper may not be released yet."
        );
      } else {
        setError(
          err.response?.data ||
          "Download failed."
        );
      }
    }
  };

  return (
    <Layout>
      <div className="content-header">
        <p className="eyebrow">Exam Center</p>

        <h1>Download Released Paper</h1>

        <p className="muted">
          Select an approved question paper. Download is available only after its scheduled release time.
        </p>
      </div>

      <div className="form-card narrow">
        <form onSubmit={download}>

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
              No approved question papers are currently available.
            </p>
          )}

          <button type="submit">
            Secure Download
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

export default DownloadPapers;
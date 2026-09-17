import React from "react";
import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import api from "../api";
import StatusMessage from "../components/StatusMessage";

function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await api.get("/admin/audit-logs");
      setLogs(response.data);
      setError("");
    } catch (err) {
      setError(err.response?.data || "Unable to load audit logs.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Layout>
      <div className="content-header row-header">
        <div>
          <p className="eyebrow">Administrator</p>
          <h1>Audit Logs</h1>
          <p className="muted">Latest security events are shown first.</p>
        </div>
        <button className="auto-button" onClick={load}>Refresh</button>
      </div>

      <StatusMessage message={error} error />

      <div className="table-card">
        {logs.length === 0 ? (
          <p className="empty">No audit records found.</p>
        ) : (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Action</th>
                  <th>User</th>
                  <th>Paper ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td>{log.id}</td>
                    <td><span className="action-tag">{log.action}</span></td>
                    <td>{log.userEmail}</td>
                    <td>{log.questionPaperId ?? "-"}</td>
                    <td>{log.timestamp ? new Date(log.timestamp).toLocaleString() : "-"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default AuditLogs;
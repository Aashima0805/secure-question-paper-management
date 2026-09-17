import React from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { getName, getRole } from "../auth";

const cards = {
  USER: [["Account", "Authenticated user access is active.", "/dashboard"]],
  QUESTION_SETTER: [["Upload Question Paper", "Create and securely submit a question paper.", "/upload"]],
  REVIEWER: [["Review Papers", "Review submitted question papers.", "/review"]],
  APPROVER: [["Approve Papers", "Approve or reject reviewed papers.", "/approve"]],
  EXAM_CENTER: [["Released Papers", "Access papers only after authorization and scheduled release.", "/download"]],
  ADMIN: [["Users & Roles", "Manage authorized application roles.", "/admin/users"], ["Audit Logs", "Monitor recorded security activity.", "/admin/audit-logs"]]
};

function Dashboard() {
  const role = getRole();

  return (
    <Layout>
      <section className="hero">
        <div>
          <p className="eyebrow">Secure Portal</p>
          <h1>Welcome, {getName()}</h1>
          <p className="muted">Role: <strong>{role}</strong></p>
        </div>
        <div className="security-badge">Protected Access</div>
      </section>

      <div className="section-title">
        <h2>Available Actions</h2>
        <p>Access is controlled according to your assigned role.</p>
      </div>

      <div className="card-grid">
        {(cards[role] || cards.USER).map(([title, text, path]) => (
          <Link className="feature-card" to={path} key={path}>
            <span className="card-icon">↗</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </Link>
        ))}
      </div>

      <div className="security-panel">
        <h2>Security Controls</h2>
        <div className="security-list">
          <span>✓ JWT Authentication</span>
          <span>✓ Role-Based Access Control</span>
          <span>✓ MFA for privileged roles</span>
          <span>✓ Encrypted private storage</span>
          <span>✓ Integrity verification</span>
          <span>✓ Audit logging</span>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getName, getRole, logout } from "../auth";

function Layout({ children }) {
  const navigate = useNavigate();
  const role = getRole();

  const links = {
    USER: [{ label: "Dashboard", path: "/dashboard" }],
    QUESTION_SETTER: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Upload Paper", path: "/upload" }
    ],
    REVIEWER: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Review Papers", path: "/review" }
    ],
   APPROVER: [
  { label: "Dashboard", path: "/dashboard" },
  { label: "Approve Papers", path: "/approve" }
],
    EXAM_CENTER: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Download Papers", path: "/download" }
    ],
    ADMIN: [
      { label: "Dashboard", path: "/dashboard" },
      { label: "Users & Roles", path: "/admin/users" },
      { label: "Audit Logs", path: "/admin/audit-logs" }
    ]
  };

  return (
    <div className="app">
      <header className="navbar">
        <button className="brand-button" onClick={() => navigate("/dashboard")}>
          SecureQPM
        </button>

        <nav>
          {(links[role] || links.USER).map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-user">
          <span>{getName()}</span>
          <button className="small-button" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="page-content">{children}</main>
    </div>
  );
}

export default Layout;
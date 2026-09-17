import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyOtp from "./pages/VerifyOtp";
import Dashboard from "./pages/Dashboard";
import UploadPaper from "./pages/UploadPaper";
import ReviewPapers from "./pages/ReviewPapers";
import ApprovePapers from "./pages/ApprovePapers";
import DownloadPapers from "./pages/DownloadPapers";
import AdminUsers from "./pages/AdminUsers";
import AuditLogs from "./pages/AuditLogs";
import ProtectedRoute from "./components/ProtectedRoute";
import ScheduleRelease from "./pages/ScheduleRelease";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />

      <Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<Dashboard />} />
  <Route
  element={<ProtectedRoute allowedRoles={["QUESTION_SETTER"]} />}
>
  <Route path="/upload" element={<UploadPaper />} />
</Route>
  <Route
  element={<ProtectedRoute allowedRoles={["REVIEWER"]} />}
>
  <Route path="/review" element={<ReviewPapers />} />
</Route>
  <Route
  element={<ProtectedRoute allowedRoles={["APPROVER"]} />}
>
  <Route path="/approve" element={<ApprovePapers />} />
</Route>

  <Route
    element={<ProtectedRoute allowedRoles={["APPROVER"]} />}
  >
    <Route
      path="/schedule-release"
      element={<ScheduleRelease />}
    />
  </Route>

  <Route
  element={<ProtectedRoute allowedRoles={["EXAM_CENTER"]} />}
>
  <Route path="/download" element={<DownloadPapers />} />
</Route>
  <Route
  element={<ProtectedRoute allowedRoles={["ADMIN"]} />}
>
  <Route path="/admin/users" element={<AdminUsers />} />
  <Route path="/admin/audit-logs" element={<AuditLogs />} />
</Route>
</Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
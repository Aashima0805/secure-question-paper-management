import React from "react";
function StatusMessage({ message, error = false }) {
  if (!message) return null;
  return <div className={error ? "message error" : "message success"}>{message}</div>;
}

export default StatusMessage;
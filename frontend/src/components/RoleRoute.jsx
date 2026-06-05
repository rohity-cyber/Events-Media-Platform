import { Navigate } from "react-router-dom";

export default function RoleRoute({ children, roles }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) return <Navigate to="/" replace />;
  if (!roles.includes(user?.role)) return <Navigate to="/access-denied" replace />;

  return children;
}
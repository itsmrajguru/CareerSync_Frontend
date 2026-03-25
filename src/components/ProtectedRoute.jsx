import { Navigate } from "react-router-dom";

/* This function checks for the token everytime, while the user
tries to jump to the protected pages and if token not found,
user is redirected to the login page */

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

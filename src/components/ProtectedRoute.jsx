import { Navigate } from "react-router-dom";

/* This function checks for the token everytime, while the user
tries to jump to the protected pages and if token not found,
user is redirected to the login page */

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // Check for authentication token 
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required, verify user role
  if (role && user.role !== role) {
    // \Redirect unauthorized users back to their respective dashboards
    return <Navigate to={user.role === 'company' ? '/company/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
}

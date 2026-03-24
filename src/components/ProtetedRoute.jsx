import { Navigate } from "react-router-dom";

/*ProtectedRoute: If no token is found in localStorage,
 redirect to /login.*/
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

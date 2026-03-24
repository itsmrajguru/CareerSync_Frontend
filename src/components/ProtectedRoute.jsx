import { Navigate } from "react-router-dom";

/*
  ProtectedRoute — wraps any route that requires the user to be logged in.
  If no token is found in localStorage, redirects to /login.
  Usage: <Route path="/jobs" element={<ProtectedRoute><JobsPage /></ProtectedRoute>} />
*/
export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

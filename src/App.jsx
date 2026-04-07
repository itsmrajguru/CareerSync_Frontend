import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import JobsPage from "./pages/JobsPage";
import ResumePage from "./pages/ResumePage";
import ProfilePage from "./pages/ProfilePage";
import VerifySignupOtpPage from "./pages/VerifySignupOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import JobDetailsPage from "./pages/JobDetailsPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CreateJobPage from "./pages/company/CreateJobPage";
import CompanyJobsPage from "./pages/company/CompanyJobsPage";
import ApplicantsPage from "./pages/company/ApplicantsPage";
import CompanyProfilePage from "./pages/company/CompanyProfilePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-signup-otp" element={<VerifySignupOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected routes — require login as 'student' */}
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><DashboardPage /></ProtectedRoute>} />
        <Route path="/student/jobs" element={<ProtectedRoute role="student"><JobsPage /></ProtectedRoute>} />
        <Route path="/student/jobs/:id" element={<ProtectedRoute role="student"><JobDetailsPage /></ProtectedRoute>} />
        <Route path="/student/profile" element={<ProtectedRoute role="student"><ProfilePage /></ProtectedRoute>} />
        <Route path="/student/resume" element={<ProtectedRoute role="student"><ResumePage /></ProtectedRoute>} />

        {/* Company routes — require login as 'company' */}
        <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/jobs" element={<ProtectedRoute role="company"><CompanyJobsPage /></ProtectedRoute>} />
        <Route path="/company/jobs/create" element={<ProtectedRoute role="company"><CreateJobPage /></ProtectedRoute>} />
        <Route path="/company/jobs/:jobId/applicants" element={<ProtectedRoute role="company"><ApplicantsPage /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute role="company"><CompanyProfilePage /></ProtectedRoute>} />

        {/* Catch-all route to prevent 404s for logged-in users trying to reach old paths */}
        <Route path="*" element={<Navigate to="/student/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

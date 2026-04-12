import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CompanyLoginPage from "./pages/CompanyLoginPage";
import SignupPage from "./pages/SignupPage";
import VerifySignupOtpPage from "./pages/VerifySignupOtpPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import AboutPage from "./pages/AboutPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Student pages
import StudentDashboard from "./pages/student/StudentDashboard";
import ExternalJobsPage from "./pages/student/ExternalJobsPage";
import ResumePage from "./pages/student/ResumePage";
import StudentProfilePage from "./pages/student/StudentProfilePage";
import ExternalJobDetailsPage from "./pages/student/ExternalJobDetailsPage";
import StudentSettingsPage from "./pages/student/StudentSettingsPage";
import JobsPage from "./pages/student/JobsPage";
import JobDetailsPage from "./pages/student/JobDetailsPage";
import ApplyPage from "./pages/student/ApplyPage";
import ApplicationsPage from "./pages/student/ApplicationsPage";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageCompaniesPage from "./pages/admin/ManageCompaniesPage";
import ManageJobsPage from "./pages/admin/ManageJobsPage";

// Company pages
import CompanyDashboard from "./pages/company/CompanyDashboard";
import CreateJobPage from "./pages/company/CreateJobPage";
import EditJobPage from "./pages/company/EditJobPage";
import CompanyJobsPage from "./pages/company/CompanyJobsPage";
import ApplicantsPage from "./pages/company/ApplicantsPage";
import CompanyProfilePage from "./pages/company/CompanyProfilePage";
import ApplicationDetailPage from "./pages/company/ApplicationDetailPage";
import SettingsPage from "./pages/company/SettingsPage";

//Page Not Found Page
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/company-login" element={<CompanyLoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verify-signup-otp" element={<VerifySignupOtpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/about" element={<AboutPage />} />

        {/* Protected routes — require login as 'student' */}
        <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
        
        {/* Internal Jobs */}
        <Route path="/student/jobs" element={<ProtectedRoute role="student"><JobsPage /></ProtectedRoute>} />
        <Route path="/student/jobs/:id" element={<ProtectedRoute role="student"><JobDetailsPage /></ProtectedRoute>} />
        <Route path="/student/apply/:id" element={<ProtectedRoute role="student"><ApplyPage /></ProtectedRoute>} />
        <Route path="/student/applications" element={<ProtectedRoute role="student"><ApplicationsPage /></ProtectedRoute>} />

        {/* External Jobs (Adzuna) */}
        <Route path="/student/discover-jobs" element={<ProtectedRoute role="student"><ExternalJobsPage /></ProtectedRoute>} />
        <Route path="/student/discover-jobs/:id" element={<ProtectedRoute role="student"><ExternalJobDetailsPage /></ProtectedRoute>} />

        {/* Admin Section */}
        <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/companies" element={<ProtectedRoute role="admin"><ManageCompaniesPage /></ProtectedRoute>} />
        <Route path="/admin/jobs" element={<ProtectedRoute role="admin"><ManageJobsPage /></ProtectedRoute>} />

        {/* Student Profile & Settings */}
        <Route path="/student/profile" element={<ProtectedRoute role="student"><StudentProfilePage /></ProtectedRoute>} />
        <Route path="/student/resume" element={<ProtectedRoute role="student"><ResumePage /></ProtectedRoute>} />
        <Route path="/student/settings" element={<ProtectedRoute role="student"><StudentSettingsPage /></ProtectedRoute>} />

        {/* Company routes — require login as 'company' */}
        <Route path="/company/dashboard" element={<ProtectedRoute role="company"><CompanyDashboard /></ProtectedRoute>} />
        <Route path="/company/jobs" element={<ProtectedRoute role="company"><CompanyJobsPage /></ProtectedRoute>} />
        <Route path="/company/jobs/create" element={<ProtectedRoute role="company"><CreateJobPage /></ProtectedRoute>} />
        <Route path="/company/jobs/:jobId/edit" element={<ProtectedRoute role="company"><EditJobPage /></ProtectedRoute>} />
        <Route path="/company/jobs/:jobId/applicants" element={<ProtectedRoute role="company"><ApplicantsPage /></ProtectedRoute>} />
        <Route path="/company/applications/:appId" element={<ProtectedRoute role="company"><ApplicationDetailPage /></ProtectedRoute>} />
        <Route path="/company/profile" element={<ProtectedRoute role="company"><CompanyProfilePage /></ProtectedRoute>} />
        <Route path="/company/settings" element={<ProtectedRoute role="company"><SettingsPage /></ProtectedRoute>} />

        {/* Catch-all route to display the premium 404 page... */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

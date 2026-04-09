import { useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Footer from "../components/Footer";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        //step 1: Fetching the token from the params
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            //Returning the response given by the backend
            const res = await resetPassword(token, password);
            setMessage(res.message || "Password reset successfully. You can now log in.");
            setPassword("");
            setConfirmPassword("");
        } catch (err) {
            console.error("Reset Password Error:", err.response?.data || err);
            const serverMessage = err.response?.data?.message;
            setError(serverMessage || err.message || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-app-bg font-sans">
            <div className="flex-1 flex items-center justify-center px-4 w-full py-12">
                <div className="w-full max-w-md relative z-10">
                <div className="cs-card p-10 w-full">

                    {/* Hero section with careeersync logo and reset header*/}

                    <div className="text-center mb-8">
                        <img
                            src="/logo.svg"
                            alt="Logo"
                            className="h-16 w-16 rounded-full mx-auto mb-4 object-cover"
                        />
                        <span className="text-2xl font-black text-black tracking-tight">
                            Career<span className="text-black">Sync</span>
                        </span>
                        <h2 className="text-xl font-bold mt-4 text-black">Reset Password</h2>
                        <p className="text-black mt-2 text-sm font-medium">Enter your new password below</p>
                    </div>

                    {/* Displaying the login failed errors */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="text-center mb-6">
                            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-4 text-sm font-semibold">
                                {message}
                            </div>
                            <Link to="/login" className="btn-primary inline-block py-3 px-6">
                                Proceed to Login
                            </Link>
                        </div>
                    )}

                    {!message && (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                {/*thorugh this form, we will take the password and confim password
from the user and set to login page*/}
                                <label className="text-xs font-bold text-black ml-1 uppercase tracking-wider">New Password</label>
                                <input
                                    type="password"
                                    className="cs-input"
                                    placeholder="Enter new password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    autoComplete="new-password"
                                />
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-black ml-1 uppercase tracking-wider">Confirm Password</label>
                                <input
                                    type="password"
                                    className="cs-input"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength="6"
                                    autoComplete="new-password"
                                />
                            </div>
                            {/*The submit button will submit the form,
with the help of inbuilt Onsubmit Function called in the form */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary mt-4 w-full py-3.5 flex items-center justify-center gap-2 text-base"
                            >
                                {loading ? "Resetting..." : "Reset Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
        <Footer />
    </div>
);
}






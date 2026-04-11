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
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        <div className="min-h-screen w-full flex bg-white font-sans overflow-y-auto">
            {/*added new 40-60 view
and this is the left side 60 panel*/}
            <div className="hidden lg:flex lg:flex-[0.6] bg-[#0c1a2e] relative flex-col items-center pt-[12vh] p-8 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">
                {/* Decorative elements */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />

                {/* this diaplays the content on the left panel with 
carrersync logo and the text below it
we have also added the return to home page here*/}
                <div className="relative z-10 w-full max-w-[440px] text-center">
                    <img
                        src="/logo.svg"
                        alt="CareerSync Logo"
                        className="w-32 h-32 mx-auto mb-6 shadow-2xl rounded-[32px] border border-white/10 p-2"
                        style={{ filter: "drop-shadow(0 0 50px rgba(239, 68, 68, 0.3))" }}
                    />
                    <h2 className="text-[52px] font-black text-white leading-[0.9] tracking-[-3px] mb-3">
                        Secure your <span className="text-[#ef4444]">account.</span>
                    </h2>
                    <p className="text-[17px] text-[#94a3b8] font-medium leading-relaxed mb-4 mx-auto max-w-[380px]">
                        Re-establishing trust starts with a secure credential. Update your password to the highest security standards and regain full access.
                    </p>
                </div>

                {/* Back to Home Button */}
                <Link to="/" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-[2px] whitespace-nowrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Home
                </Link>
            </div>

            {/*This side shows the actual form with newpassword and confirm newpassword */}
            <div className="flex-1 lg:flex-[0.4] flex flex-col items-center justify-center px-6 lg:px-12 py-12 relative z-10 bg-white">
                <div className="w-full max-w-[320px] flex flex-col gap-6">

                    {/* mobile logo - only visible on small screens */}
                    <div className="lg:hidden flex justify-center mb-2">
                        <Link to="/">
                            <img src="/logo.svg" alt="Logo" className="w-14 h-14 rounded-2xl shadow-lg border border-slate-100" />
                        </Link>
                    </div>

                    {/* Header section */}
                    <div className="text-left">
                        <h1 className="text-[30px] font-black text-[#0f172a] tracking-[-1.5px] leading-tight mb-1">
                            Reset Password.
                        </h1>
                        <p className="text-[#64748b] text-[12px] font-medium leading-tight">
                            Generate a new secure password for your account.
                        </p>
                    </div>

                    {/* Displaying state messages 
i.e. those error message , which shoudl be shown on incorrect email,
incorrect password, email not verified... etc*/}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-2 text-[12px] font-bold flex items-center gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            {error}
                        </div>
                    )}

                    {message ? (
                        <div className="flex flex-col gap-6">
                            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-xl text-[12px] font-bold flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                {message}
                            </div>
                            <Link
                                to="/login"
                                className="btn-primary w-full py-4 text-[14px] flex items-center justify-center font-bold shadow-lg shadow-primary-200/50"
                            >
                                Return to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-3.5 pr-10 py-2.5 text-[14px] text-[#0f172a] font-bold focus:ring-4 focus:ring-primary-50 transition-all outline-none placeholder:text-[#94a3b8]"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        autoComplete="new-password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
                                        tabIndex={-1} aria-label={showPassword ? "Hide" : "Show"}>
                                        {showPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1">
                                <label className="text-[9px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-0.5">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-lg pl-3.5 pr-10 py-2.5 text-[14px] text-[#0f172a] font-bold focus:ring-4 focus:ring-primary-50 transition-all outline-none placeholder:text-[#94a3b8]"
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        autoComplete="new-password"
                                    />
                                    {/* we have added teh eye button here
so that user can show and hide the password */}
                                    <button type="button" onClick={() => setShowConfirmPassword(v => !v)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#475569] transition-colors"
                                        tabIndex={-1} aria-label={showConfirmPassword ? "Hide" : "Show"}>
                                        {showConfirmPassword ? (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                                        ) : (
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                            {/* at the last this is the submit button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-[14px] shadow-lg shadow-primary-200/50 font-bold mt-1"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}






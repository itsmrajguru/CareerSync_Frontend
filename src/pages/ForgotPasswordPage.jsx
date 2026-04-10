import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import Footer from "../components/Footer";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    /* This function call the forgotPassword axios,and just returns
    the response coming from the server,whether it may be error or success */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setMessage("");

        try {
            const res = await forgotPassword(email);
            setMessage(res.message || "Password reset link sent to your email.");
            setEmail("");
        } catch (err) {
            setError(err.message || "Failed to send reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen flex bg-white font-sans overflow-hidden">
            {/*added new 40-60 view
and this is the left side 60 panel*/}
            <div className="hidden lg:flex lg:flex-[0.6] bg-[#0c1a2e] relative flex-col items-center pt-[12vh] p-8 overflow-hidden shadow-[inset_-20px_0_40px_rgba(0,0,0,0.1)]">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary-500/10 rounded-full blur-[120px]" />
                <div className="relative z-10 w-full max-w-[440px] text-center">
                    {/* this diaplays the content on the left panel with 
carrersync logo and the text below it
we have also added the return to home page here*/}
                    <img
                        src="/logo.svg"
                        alt="CareerSync Logo"
                        className="w-32 h-32 mx-auto mb-6 shadow-2xl rounded-[32px] border border-white/10 p-2"
                        style={{ filter: "drop-shadow(0 0 50px rgba(239, 68, 68, 0.3))" }}
                    />
                    <h2 className="text-[52px] font-black text-white leading-[0.9] tracking-[-3px] mb-3">
                        Recover your <span className="text-[#ef4444]">access.</span>
                    </h2>
                    <p className="text-[17px] text-[#94a3b8] font-medium leading-relaxed mb-4 mx-auto max-w-[380px]">
                        Identity protection is a core pillar of CareerSync. Recover your credentials through our encrypted channels to ensure your data remains yours.
                    </p>
                </div>

                {/* Back to Home Button */}
                <Link to="/" className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl text-[10px] font-bold text-white/50 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all uppercase tracking-[2px] whitespace-nowrap">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="mb-0.5"><path d="m15 18-6-6 6-6" /></svg>
                    Back to Home
                </Link>
            </div>

            {/* added new 40-60 view
and this is the right side 40 panel*/}
            <div className="flex-1 lg:flex-[0.4] flex flex-col items-center justify-center px-8 lg:px-12 relative z-10 bg-white">
                <div className="w-full max-w-[320px] py-4 flex flex-col gap-6">

                    {/* Hero section */}
                    <div className="text-left">
                        <h1 className="text-[30px] font-black text-[#0f172a] tracking-[-1.5px] leading-tight mb-1">
                            Account Recovery.
                        </h1>
                        <p className="text-[#64748b] text-[12px] font-medium leading-relaxed">
                            Enter your email below to receive a secure recovery link.
                        </p>
                    </div>

                    {/* Displaying state messages */}
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl mb-8 text-[12px] font-bold flex items-center gap-3">
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
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-extrabold text-[#475569] uppercase tracking-[1.5px] ml-1">Email Address</label>
                                <input
                                    type="email"
                                    className="w-full bg-[#f8fafc] border border-[#e2e8f0] rounded-xl px-4 py-3 text-[14px] text-[#0f172a] font-bold focus:ring-4 focus:ring-primary-50 focus:border-primary-300 transition-all outline-none placeholder:text-[#94a3b8] placeholder:font-medium"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary w-full py-4 text-[14px] shadow-lg shadow-primary-200/50"
                            >
                                {loading ? "Sending link..." : "Send Reset Link"}
                            </button>
                        </form>
                    )}

                    {/* Navigation Footer */}
                    {!message && (
                        <div className="text-center text-[12px] text-[#64748b] font-medium border-t border-[#f1f5f9] pt-6 flex flex-col gap-3">
                            <div>
                                <Link to="/login" className="text-[#0f172a] hover:text-[#ef4444] font-black transition-colors underline decoration-[#ef4444]/20 hover:decoration-[#ef4444]">
                                    Back to Login
                                </Link>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

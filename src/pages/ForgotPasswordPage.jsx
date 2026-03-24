import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

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
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 px-4 font-sans">
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm">
                    <div className="text-center mb-8">
                        <span className="text-2xl font-black text-neutral-700 tracking-tight">
                            Career<span className="text-primary-500">Sync</span>
                        </span>
                        <h2 className="text-xl font-bold mt-4 text-neutral-700">Forgot Password</h2>
                        <p className="text-neutral-400 mt-2 text-sm font-medium">Enter your email to receive a reset link</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
                            {error}
                        </div>
                    )}

                    {message && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-semibold text-center">
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-neutral-400 ml-1 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                className="w-full p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-neutral-700 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all font-medium text-sm"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-4 w-full py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                        >
                            {loading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="text-center mt-8 text-sm text-neutral-400 font-medium">
                        Remember your password?{" "}
                        <Link to="/login" className="text-primary-500 hover:text-primary-600 font-bold transition-colors">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

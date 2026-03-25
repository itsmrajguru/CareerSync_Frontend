import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail } from "../api";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");
    const effectRan = useRef(false);

    /* We are calling this useEffect , due to the dependency of token */
    useEffect(() => {
        if (effectRan.current) return;
        effectRan.current = true;
        //step 1: Fetching the token from the params
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }
        /* And passing the token to the controller inn the backend to check
        whether this token exists in the database or not*/
        verifyEmail(token)
            .then((res) => {
                setStatus("success");
                setMessage(res.message || "Email verified successfully!");
            })
            .catch((err) => {
                setStatus("error");
                setMessage(err.message || "Failed to verify email. The link may have expired.");
            });
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f0fbfe] px-4 font-sans">
            <div className="w-full max-w-md relative z-10">
                <div className="bg-white p-10 rounded-3xl border border-[#b3eefb] shadow-sm text-center">
                    <div className="mb-8">
                        <span className="text-2xl font-black text-neutral-700 tracking-tight">
                            Career<span className="text-primary-500">Sync</span>
                        </span>
                        <h2 className="text-xl font-bold mt-4 text-neutral-700">Email Verification</h2>
                    </div>
                    {/*these are 3 diffrent conditions ,where depending on the status messages,
we display the message to the user... */}

                    {/* Dummy conddition, as we often dont get response earlier, so till now
we are showing this message , as there is no any status message as verifying exists*/}
                    {status === "verifying" && (
                        <p className="text-neutral-400 font-medium animate-pulse">Verifying your email, please wait...</p>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4">✓</div>
                            <p className="text-neutral-600 font-medium mb-6">{message}</p>
                            <button
                                className="w-full py-3.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold transition-all shadow-sm"
                                onClick={() => navigate("/login")}
                            >
                                Proceed to Login
                            </button>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4">✗</div>
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-semibold w-full">
                                {message}
                            </div>
                            <Link to="/login" className="text-primary-500 font-bold hover:text-primary-600 transition-colors">
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import { FiCopy, FiCheck } from "react-icons/fi";

export default function Success({ result }) {
    const regId = result?.data?.candidateRegId || "";
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!regId) return;

        navigator.clipboard.writeText(regId);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className="w-full font-sans text-center">

            {/* Success Icon */}
            <div className="text-6xl mb-4 animate-bounce">🎉</div>

            {/* Title */}
            <h2 className="text-3xl font-extrabold text-brand-primary font-display">
                Registration Successful!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mt-4 text-sm sm:text-base leading-relaxed font-medium">
                Congratulations! Your registration has been submitted successfully.
                <br />
                <span className="font-bold text-brand-dark bg-brand-light/30 px-3 py-1 rounded-full border border-brand-mint/10 inline-block mt-2">
                    Status: Under Admin Review
                </span>
                <br className="mb-2" />
                Once your payment is verified, your registration status will be updated.
            </p>

            {/* Registration ID */}
            <div className="mt-8 bg-brand-light/10 border border-brand-mint/20 rounded-2xl p-6 relative">

                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Your Registration ID</p>

                <div className="flex items-center justify-center gap-3 mt-3">
                    <p className="text-2xl font-black text-brand-dark tracking-wider font-display">
                        {regId || "N/A"}
                    </p>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        disabled={!regId}
                        className="p-2 bg-white border border-gray-100 hover:border-brand-primary rounded-xl text-gray-400 hover:text-brand-primary shadow-xs transition cursor-pointer disabled:cursor-not-allowed"
                    >
                        {copied ? <FiCheck className="text-brand-primary" /> : <FiCopy className="text-lg" />}
                    </button>
                </div>

                {/* Tooltip */}
                {copied && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-xs px-3 py-1 rounded-full shadow-md animate-fade font-bold">
                        Copied to Clipboard!
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mt-6 text-sm text-gray-500 font-semibold leading-relaxed">
                <p>Please save this Registration ID to check your status and sign in later.</p>
            </div>

            {/* Button */}
            <div className="mt-8">
                <Link
                    to="/login"
                    className="inline-block bg-gradient-to-r from-brand-primary to-brand-mint text-brand-dark font-extrabold px-8 py-3.5 rounded-2xl hover:scale-[1.03] active:scale-[0.98] transition-all shadow-md shadow-brand-primary/15 border border-brand-gold/20"
                >
                    Access Portal Login
                </Link>
            </div>

        </div>
    );
}
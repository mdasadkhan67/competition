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
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg mx-auto text-center">

            {/* Success Icon */}
            <div className="text-5xl mb-3 animate-pulse">🎉</div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-green-600">
                Registration Successful!
            </h2>

            {/* Message */}
            <p className="text-gray-600 mt-3 text-sm leading-relaxed">
                Congratulations! Your registration has been submitted successfully.
                <br />
                <span className="font-semibold text-gray-800">
                    Your registration is currently under review.
                </span>
                <br />
                Once your payment is verified, your registration will be approved.
            </p>

            {/* Registration ID */}
            <div className="mt-6 bg-gray-100 rounded-xl p-4 border relative">

                <p className="text-sm text-gray-500">Your Registration ID</p>

                <div className="flex items-center justify-center gap-2 mt-2">
                    <p className="text-lg font-bold text-blue-600 tracking-wide">
                        {regId || "N/A"}
                    </p>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        disabled={!regId}
                        className="text-gray-500 hover:text-blue-600 transition"
                    >
                        {copied ? <FiCheck className="text-green-600" /> : <FiCopy />}
                    </button>
                </div>

                {/* Tooltip */}
                {copied && (
                    <div className="absolute -top-3 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded shadow animate-fade">
                        Copied!
                    </div>
                )}
            </div>

            {/* Instructions */}
            <div className="mt-5 text-sm text-gray-600 leading-relaxed">
                <p>You can check your payment status using the link below.</p>
                <p className="mt-2">
                    Copy your <span className="font-semibold">Registration ID</span> and use it on the status page.
                </p>
            </div>

            {/* Button */}
            <div className="mt-6">
                <Link
                    to="/check-status"
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                >
                    Check Status
                </Link>
            </div>

        </div>
    );
}
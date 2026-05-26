import { useState, useRef } from "react";

export default function Terms({ next }) {
    const [accepted, setAccepted] = useState(false);
    const [error, setError] = useState("");
    const [scrolledToBottom, setScrolledToBottom] = useState(false);

    const scrollRef = useRef();

    const handleScroll = () => {
        const el = scrollRef.current;

        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 5) {
            setScrolledToBottom(true);
        }
    };

    const handleNext = () => {
        if (!accepted) {
            setError("⚠️ Please accept Terms & Conditions to continue");
            return;
        }

        next();
    };

    return (
        <div className="max-w-3xl mx-auto overflow-hidden">

            {/* ================= Banner Section ================= */}
            <div className="relative rounded-2xl overflow-hidden mb-6 border border-brand-mint/20">

                {/* Banner Image */}
                <img
                    src="/banner.jpeg"
                    alt="Sunni Dawate Islami Annual Naat Competition 2026"
                    className="w-full h-48 md:h-64 object-cover"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-brand-dark/20 to-transparent"></div>
            </div>

            {/* ================= Terms Content ================= */}
            <div className="flex flex-col">

                {/* Header */}
                <h2 className="text-2xl font-bold text-center mb-1 text-gray-800 font-display">
                    Terms & Conditions
                </h2>

                <p className="text-center text-gray-500 text-xs mb-6 font-medium">
                    Please read all terms carefully before continuing
                </p>

                {/* Scroll Box */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="border border-gray-200 rounded-2xl p-5 h-64 overflow-y-auto bg-gray-50/50 shadow-inner space-y-4 text-sm text-gray-600 leading-relaxed font-medium"
                >

                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="border-b border-gray-100 pb-3 last:border-b-0">
                            <h3 className="font-bold text-brand-dark mb-1 font-display">
                                {i + 1}. Guidelines & Qualifications
                            </h3>

                            <p className="text-xs">
                                Candidates must recite the Naat in its correct pronunciation (makhraj) and accent. 
                                Using auto-tune, background rhythm, or musical instruments is strictly prohibited 
                                and will lead to immediate disqualification. Decision of the judges will be final and binding.
                            </p>
                        </div>
                    ))}

                </div>

                {/* Scroll Hint */}
                {!scrolledToBottom && (
                    <p className="text-xs text-brand-gold font-semibold mt-3.5 text-center animate-pulse">
                        ⬇️ Please scroll to the bottom to enable acceptance
                    </p>
                )}

                {/* Checkbox */}
                <div className="mt-6 flex items-center gap-3">
                    <input
                        type="checkbox"
                        disabled={!scrolledToBottom}
                        checked={accepted}
                        onChange={() => {
                            setAccepted(!accepted);
                            setError("");
                        }}
                        className="w-4.5 h-4.5 rounded-md accent-brand-primary cursor-pointer disabled:cursor-not-allowed"
                    />

                    <label
                        className={`text-sm font-semibold transition ${!scrolledToBottom
                            ? "text-gray-400 cursor-not-allowed"
                            : "text-gray-700 cursor-pointer"
                            }`}
                    >
                        I have read and agree to the Terms & Conditions
                    </label>
                </div>

                {/* Error */}
                {error && (
                    <p className="text-red-500 text-sm mt-3 text-center font-semibold">
                        {error}
                    </p>
                )}

                {/* Continue Button */}
                <button
                    onClick={handleNext}
                    className={`mt-6 w-full py-3.5 rounded-2xl text-white font-extrabold text-base shadow-md transition duration-300
                    ${accepted
                            ? "bg-gradient-to-r from-brand-primary to-brand-mint hover:from-emerald-500 hover:to-brand-primary cursor-pointer hover:shadow-brand-primary/20 active:scale-[0.99]"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                >
                    Accept & Continue
                </button>

            </div>
        </div>
    );
}
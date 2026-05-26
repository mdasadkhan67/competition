import { FiAlertTriangle, FiCheckCircle, FiInfo, FiSliders, FiMic } from "react-icons/fi";

export default function Rules() {
    const recordingRules = [
        "The video must be recorded in single, continuous take. Any cuts, editing, or splicing will result in immediate disqualification.",
        "Your face and hands must be completely visible in the frame at all times during the recitation.",
        "No studio microphones, echo filters, reverb, or artificial software filters are allowed. Recite in natural room acoustics.",
        "Ensure the background is quiet with minimal background noise. Submissions with heavy noise will be rejected."
    ];

    const recitationRules = [
        "The kalam chosen must be verified and from authentic Sunni scholars (Aala Hazrat, Tajush Shariah, etc. preferred).",
        "Reciting from memory is highly encouraged. Reading from mobile screens or papers will attract minor negative points.",
        "Respectful posture and dress code (traditional Islamic attire: Kurta, Pyjama, and Cap) is mandatory.",
        "Reciters must adhere strictly to the time limit designated for their respective category."
    ];

    return (
        <div className="bg-gray-50 text-gray-800 font-sans">
            
            {/* Page Header */}
            <section className="bg-brand-dark py-16 px-4 text-center text-white border-b border-brand-mint/10 relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                <div className="relative max-w-4xl mx-auto space-y-3">
                    <span className="text-brand-gold font-bold text-xs uppercase tracking-widest">Competition Guidelines</span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display">
                        Rules & Regulations
                    </h1>
                    <p className="text-gray-300 text-sm sm:text-base max-w-xl mx-auto font-medium">
                        Ensure you review and adhere strictly to all guidelines to guarantee your submission is accepted for evaluation.
                    </p>
                </div>
            </section>

            {/* Rules Content */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
                
                {/* 1. Recording Guidelines */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-brand-light flex items-center justify-center text-brand-primary text-xl">
                            <FiSliders />
                        </div>
                        <h2 className="text-2xl font-black text-brand-dark font-display">Video & Audio Recording Rules</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 font-sans font-semibold text-sm">
                        {recordingRules.map((rule, idx) => (
                            <div key={idx} className="bg-white border border-gray-150 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
                                <span className="w-6 h-6 rounded-full bg-brand-light text-brand-primary flex items-center justify-center text-xs font-bold shrink-0">
                                    {idx + 1}
                                </span>
                                <p className="text-gray-700 leading-relaxed font-semibold">{rule}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 2. Recitation Guidelines */}
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center text-brand-gold text-xl">
                            <FiMic />
                        </div>
                        <h2 className="text-2xl font-black text-brand-dark font-display">Kalam & Presentation Rules</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 font-sans font-semibold text-sm">
                        {recitationRules.map((rule, idx) => (
                            <div key={idx} className="bg-white border border-gray-150 rounded-2xl p-5 flex items-start gap-4 shadow-xs">
                                <span className="w-6 h-6 rounded-full bg-amber-50 text-brand-gold flex items-center justify-center text-xs font-bold shrink-0">
                                    {idx + 1}
                                </span>
                                <p className="text-gray-700 leading-relaxed font-semibold">{rule}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. Disqualification Alert */}
                <div className="bg-red-50/50 border border-red-200/50 rounded-3xl p-6 sm:p-8 space-y-4">
                    <div className="flex items-center gap-3 text-red-600">
                        <FiAlertTriangle className="text-2xl animate-pulse" />
                        <h3 className="text-xl font-bold font-display">Immediate Rejection Triggers</h3>
                    </div>
                    <ul className="list-disc pl-5 text-xs sm:text-sm text-gray-600 font-semibold space-y-2">
                        <li>Submitting an audio/video that belongs to another candidate.</li>
                        <li>Using pre-recorded background hums (dhikr loops) or backing vocals.</li>
                        <li>Over-editing the file (adding reverbs, pitch correctors, or voice synthesizers).</li>
                        <li>Exceeding the time limit by more than 15 seconds.</li>
                        <li>Submitting lyrics containing unapproved or controversial content.</li>
                    </ul>
                </div>

                {/* 4. Information Box */}
                <div className="bg-brand-light/20 border border-brand-mint/20 rounded-3xl p-6 sm:p-8 flex gap-4">
                    <FiInfo className="text-brand-primary text-2xl shrink-0 mt-0.5" />
                    <div className="space-y-1 font-semibold">
                        <h4 className="text-brand-dark font-bold text-base font-display">Need Kalam Approval?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                            If you are reciting a new or less-known kalam, you can submit the lyrics in PDF format during registration. Our scholarly council will verify the lines within 48 hours.
                        </p>
                    </div>
                </div>

            </section>

        </div>
    );
}

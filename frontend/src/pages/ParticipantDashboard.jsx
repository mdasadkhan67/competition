import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiFileText, FiUploadCloud, FiAward, FiSettings, FiLogOut, FiDownload, FiCheckCircle, FiClock, FiAlertTriangle } from "react-icons/fi";
import { jsPDF } from "jspdf";

export default function ParticipantDashboard() {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);

    // Verify session
    useEffect(() => {
        const stored = localStorage.getItem("participant");
        if (!stored) {
            navigate("/login");
        } else {
            setCandidate(JSON.parse(stored));
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("participant");
        localStorage.removeItem("participantRegId");
        navigate("/login");
    };

    if (!candidate) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    // Dynamic checks
    const regId = candidate.candidateRegId || "N/A";
    const name = candidate.name || "Participant";
    const group = candidate.group || "Junior";
    const isApproved = candidate.payment?.status === "Approved";
    const isPending = candidate.payment?.status === "Pending";
    const naatTitle = candidate.naatTitle || "Kalam Not Provided";

    // Mock round status tracker
    const steps = [
        { label: "Registration", done: true, desc: "Form Submitted" },
        { label: "Payment Verification", done: isApproved, desc: isApproved ? "Payment Audited" : "Under Review" },
        { label: "Video Upload", done: isApproved && candidate.submissionUploaded, desc: isApproved && candidate.submissionUploaded ? "File Submitted" : "Pending Approval" },
        { label: "Score Results", done: candidate.scoreReleased, desc: candidate.scoreReleased ? `Graded: ${candidate.score || 0}/100` : "Evaluation Active" }
    ];

    // Download invoice PDF
    const downloadInvoice = () => {
        const doc = new jsPDF();
        
        // Header styling
        doc.setFillColor(3, 37, 32); // Brand dark teal
        doc.rect(0, 0, 210, 40, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(22);
        doc.text("SDI Naat Competition Portal", 20, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Hera Islamic Channel • Quba Zone (Kurla)", 20, 32);

        // Body Content
        doc.setTextColor(50, 50, 50);
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text("Registration Payment Receipt", 20, 55);

        doc.setDrawColor(200, 200, 200);
        doc.line(20, 60, 190, 60);

        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.text("Candidate Details:", 20, 72);
        
        doc.setFont("helvetica", "normal");
        doc.text(`Registration ID: ${regId}`, 20, 80);
        doc.text(`Full Name: ${name}`, 20, 88);
        doc.text(`Mobile Number: ${candidate.phone || "N/A"}`, 20, 96);
        doc.text(`Category Group: ${group}`, 20, 104);
        doc.text(`Kalam Chosen: ${naatTitle}`, 20, 112);

        doc.setFont("helvetica", "bold");
        doc.text("Payment Audit:", 20, 126);
        
        doc.setFont("helvetica", "normal");
        doc.text(`UPI Transaction ID: ${candidate.payment?.transactionId || "N/A"}`, 20, 134);
        doc.text(`Receipt Amount: Rs. ${candidate.payment?.amount || "200"}.00`, 20, 142);
        doc.text(`Status: ${candidate.payment?.status || "Pending"}`, 20, 150);

        doc.setFillColor(236, 253, 245);
        doc.rect(20, 160, 170, 20, "F");
        doc.setTextColor(16, 185, 129);
        doc.setFont("helvetica", "bold");
        doc.text("Thank you for registering. Keep this receipt for audition verification.", 25, 172);

        // Save doc
        doc.save(`Receipt-${regId}.pdf`);
    };

    // Download Participation Certificate
    const downloadCertificate = () => {
        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4"
        });

        // Background decorative border
        doc.setFillColor(3, 37, 32); // Brand dark teal
        doc.rect(0, 0, 297, 210, "F");
        
        // Inner white card
        doc.setFillColor(255, 255, 255);
        doc.rect(10, 10, 277, 190, "F");
        
        // Gold border lines
        doc.setDrawColor(217, 119, 6); // Brand Gold
        doc.setLineWidth(1.5);
        doc.rect(14, 14, 269, 182);
        doc.rect(16, 16, 265, 178);

        // Certificate content
        doc.setTextColor(3, 37, 32);
        doc.setFont("times", "italic");
        doc.setFontSize(28);
        doc.text("Annual Naat Competition 2026", 148, 48, { align: "center" });

        doc.setFont("times", "normal");
        doc.setFontSize(14);
        doc.setTextColor(217, 119, 6);
        doc.text("ORGANIZED BY: SUNNI DAWATE ISLAMI (QUBA ZONE)", 148, 58, { align: "center" });

        doc.setDrawColor(220, 220, 220);
        doc.setLineWidth(0.5);
        doc.line(80, 68, 217, 68);

        doc.setFont("times", "italic");
        doc.setFontSize(18);
        doc.setTextColor(80, 80, 80);
        doc.text("This certificate of participation is proudly presented to", 148, 85, { align: "center" });

        doc.setFont("times", "bold");
        doc.setFontSize(32);
        doc.setTextColor(3, 37, 32);
        doc.text(name, 148, 105, { align: "center" });

        doc.setFont("times", "italic");
        doc.setFontSize(16);
        doc.setTextColor(80, 80, 80);
        doc.text(`for recitative participation in the ${group} group category, performing Kalam`, 148, 122, { align: "center" });
        doc.setFont("times", "bolditalic");
        doc.text(`"${naatTitle}"`, 148, 132, { align: "center" });

        doc.setFont("times", "normal");
        doc.setFontSize(12);
        doc.setTextColor(120, 120, 120);
        doc.text(`Registration Verified ID: ${regId}`, 148, 145, { align: "center" });

        // Signatures
        doc.line(40, 175, 100, 175);
        doc.text("Event Coordinator", 70, 181, { align: "center" });

        doc.line(197, 175, 257, 175);
        doc.text("Jury Chairman", 227, 181, { align: "center" });

        // Save PDF
        doc.save(`Certificate-${regId}.pdf`);
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col">
            
            {/* Sub-Header */}
            <div className="bg-brand-dark text-white border-b border-brand-mint/10 py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-brand-primary/20 border border-brand-mint/30 flex items-center justify-center text-xl font-bold text-brand-mint">
                            {name[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-extrabold tracking-tight font-display">{name}</h2>
                            <p className="text-xs text-brand-mint font-semibold mt-0.5">Registration ID: {regId}</p>
                        </div>
                    </div>
                    
                    {/* Log out */}
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-400 rounded-xl text-xs font-bold border border-white/10 hover:border-red-500/30 flex items-center gap-2 transition-all cursor-pointer"
                    >
                        <FiLogOut /> Logout
                    </button>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Side: Summary Card + Stepper */}
                <div className="lg:col-span-8 space-y-8">
                    
                    {/* Alert banner for verification status */}
                    {isPending && (
                        <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 flex items-start gap-4">
                            <FiClock className="text-brand-gold text-2xl shrink-0 mt-0.5" />
                            <div className="space-y-1 font-semibold">
                                <h3 className="text-brand-dark font-bold text-sm sm:text-base font-display">Payment Under Audit</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                                    Our audit team is verifying your payment screenshot (Transaction ID: {candidate.payment?.transactionId}). You will receive an approval notification once validated.
                                </p>
                            </div>
                        </div>
                    )}

                    {isApproved && (
                        <div className="bg-emerald-50/30 border border-emerald-200/50 rounded-2xl p-5 flex items-start gap-4">
                            <FiCheckCircle className="text-brand-primary text-2xl shrink-0 mt-0.5" />
                            <div className="space-y-1 font-semibold">
                                <h3 className="text-brand-dark font-bold text-sm sm:text-base font-display">Registration Approved</h3>
                                <p className="text-xs text-gray-500 leading-relaxed font-semibold">
                                    Congratulations! Your payment receipt has been verified. You are now officially approved to submit your Naat video.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Stepper Status tracker */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-8 shadow-xs space-y-8">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-lg font-bold text-brand-dark font-display">Evaluation Roadmap</h3>
                            <p className="text-xs text-gray-400 font-semibold mt-0.5">Track your audition milestones</p>
                        </div>

                        {/* Vertically styled stepper for dashboard */}
                        <div className="space-y-6 font-semibold text-xs sm:text-sm">
                            {steps.map((step, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {/* Indicator connector line */}
                                    {idx < steps.length - 1 && (
                                        <span className={`absolute left-4 top-8 bottom-[-16px] w-0.5 ${
                                            steps[idx + 1].done ? "bg-brand-primary" : "bg-gray-250"
                                        }`}></span>
                                    )}

                                    {/* Dot */}
                                    <span className={`w-8.5 h-8.5 rounded-full flex items-center justify-center font-bold border-2 shrink-0 ${
                                        step.done 
                                        ? "bg-brand-primary border-brand-primary text-white" 
                                        : "bg-white border-gray-200 text-gray-400"
                                    }`}>
                                        {step.done ? "✓" : idx + 1}
                                    </span>

                                    {/* Info text */}
                                    <div className="space-y-0.5">
                                        <h4 className="font-extrabold text-brand-dark text-sm sm:text-base font-display">{step.label}</h4>
                                        <p className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side: Quick Action Panel */}
                <div className="lg:col-span-4 space-y-6">
                    
                    {/* Participant Details Summary */}
                    <div className="bg-white border border-gray-150 rounded-3xl p-6 shadow-xs space-y-4">
                        <h4 className="font-extrabold text-brand-dark text-base font-display border-b border-gray-100 pb-3">Reciter Record</h4>
                        
                        <div className="space-y-3 font-semibold text-xs text-gray-600">
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Group Category</span>
                                <span className="text-brand-dark font-extrabold text-sm">{group} Category</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Kalam Choice</span>
                                <span className="text-brand-dark font-extrabold text-sm">{naatTitle}</span>
                            </div>
                            <div>
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Registered Mobile</span>
                                <span className="text-brand-dark font-extrabold text-sm">{candidate.phone || "N/A"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Panel Buttons */}
                    <div className="flex flex-col gap-3 font-sans">
                        
                        {/* 1. Upload Submission button */}
                        <Link 
                            to="/participant/upload"
                            className={`w-full py-4 text-center font-extrabold rounded-2xl flex items-center justify-center gap-2 border transition-all text-sm ${
                                isApproved 
                                ? "bg-gradient-to-r from-brand-primary to-brand-mint text-brand-dark border-brand-gold/20 shadow-md hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                                : "bg-gray-100 text-gray-400 border-gray-200/50 cursor-not-allowed select-none"
                            }`}
                        >
                            <FiUploadCloud className="text-base" /> Upload Video Recitation
                        </Link>

                        {/* 2. Download Invoice */}
                        <button
                            onClick={downloadInvoice}
                            className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-150 rounded-2xl text-brand-dark font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                            <FiFileText /> Download Payment Receipt
                        </button>

                        {/* 3. Download Certificate (Only enabled if scoring is released!) */}
                        <button
                            onClick={downloadCertificate}
                            disabled={!isApproved}
                            className={`w-full py-4 border text-sm font-extrabold rounded-2xl flex items-center justify-center gap-2 transition-all ${
                                isApproved 
                                ? "bg-amber-50 hover:bg-amber-100/70 border-brand-gold/30 text-brand-gold cursor-pointer shadow-xs"
                                : "bg-gray-100 text-gray-400 border-gray-200/50 cursor-not-allowed select-none"
                            }`}
                        >
                            <FiAward /> Participation Certificate
                        </button>

                        {/* 4. Settings */}
                        <Link
                            to="/participant/profile"
                            className="w-full py-4 bg-white hover:bg-gray-50 border border-gray-150 rounded-2xl text-gray-600 font-bold text-sm shadow-xs flex items-center justify-center gap-2 transition-all"
                        >
                            <FiSettings /> Account Profile Settings
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiUploadCloud, FiFile, FiCheckCircle, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

export default function UploadSubmission() {
    const navigate = useNavigate();
    const [candidate, setCandidate] = useState(null);
    const [kalamName, setKalamName] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    
    // Upload state
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // Verify session
    useEffect(() => {
        const stored = localStorage.getItem("participant");
        if (!stored) {
            navigate("/login");
            return;
        }
        
        const candidateData = JSON.parse(stored);
        setCandidate(candidateData);
        setKalamName(candidateData.naatTitle || "");

        // Verify payment is approved
        if (candidateData.payment?.status !== "Approved") {
            setError("⚠️ You can only upload files after your payment has been approved.");
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation: Max 100MB
        if (file.size > 100 * 1024 * 1024) {
            setError("⚠️ Video file size exceeds the 100MB limit.");
            return;
        }

        // Validation: MP4/MKV/MOV/WebM/MP3/WAV
        const allowedTypes = ["video/mp4", "video/x-matroska", "video/quicktime", "video/webm", "audio/mpeg", "audio/wav", "audio/mp3"];
        if (!allowedTypes.includes(file.type) && !file.name.endsWith(".mkv")) {
            setError("⚠️ Invalid file format. Upload MP4, MKV, MOV, WebM, MP3, or WAV.");
            return;
        }

        setError("");
        setSelectedFile(file);
    };

    const handleUpload = (e) => {
        e.preventDefault();
        if (error) return;

        if (!selectedFile) {
            setError("⚠️ Please choose a video or audio file first.");
            return;
        }

        setUploading(true);
        setProgress(0);

        // Simulate progress bar upload
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setUploading(false);
                    setSuccess(true);
                    
                    // Update local candidate record
                    const updated = { ...candidate, submissionUploaded: true, naatTitle: kalamName };
                    localStorage.setItem("participant", JSON.stringify(updated));
                    return 100;
                }
                return prev + 10;
            });
        }, 300);
    };

    if (!candidate) return null;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-xl mx-auto space-y-6">
                
                {/* Back Link */}
                <Link to="/participant/dashboard" className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-brand-primary hover:text-emerald-700 transition-colors">
                    <FiArrowLeft /> Back to Dashboard
                </Link>

                <div className="bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>
                    
                    {success ? (
                        <div className="text-center py-10 space-y-5 animate-fade">
                            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center text-brand-primary text-4xl mx-auto shadow-sm">
                                <FiCheckCircle />
                            </div>
                            <div className="space-y-1">
                                <h3 className="text-2xl font-bold text-brand-dark font-display">Recitation Submitted</h3>
                                <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Kalam: {kalamName}</p>
                            </div>
                            <p className="text-sm text-gray-500 max-w-sm mx-auto font-medium leading-relaxed">
                                Your recitation has been uploaded successfully. The grading jury has been notified and will evaluate your performance soon.
                            </p>
                            <Link 
                                to="/participant/dashboard"
                                className="inline-block bg-brand-primary hover:bg-emerald-600 text-white px-8 py-3 rounded-2xl text-xs font-bold transition-all shadow-md"
                            >
                                View Dashboard Status
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleUpload} className="space-y-6">
                            
                            <div className="space-y-1">
                                <h2 className="text-2xl font-black text-brand-dark font-display">Upload Recitation</h2>
                                <p className="text-xs text-gray-400 font-semibold mt-0.5">Submit your Naat audio/video file</p>
                            </div>

                            {error && (
                                <div className="bg-red-50/50 border border-red-200/50 text-red-500 p-3.5 rounded-2xl text-xs font-semibold text-center">
                                    {error}
                                </div>
                            )}

                            {/* Guidelines list */}
                            <div className="bg-brand-light/20 border border-brand-mint/20 rounded-2xl p-5 space-y-2 text-xs font-semibold text-brand-dark leading-relaxed">
                                <h4 className="font-extrabold font-display uppercase tracking-wider text-[10px] text-brand-primary">File Guidelines</h4>
                                <ul className="list-disc pl-4 space-y-1 font-medium text-gray-600">
                                    <li>Supported formats: MP4, MKV, MOV, MP3, WAV.</li>
                                    <li>File size limit: Maximum 100MB.</li>
                                    <li>Ensure background acoustics are quiet with clear voice.</li>
                                    <li>No voice synthesizers, auto-tune, or backing rhythm.</li>
                                </ul>
                            </div>

                            {/* Kalam Title input */}
                            <div>
                                <label className="label">Kalam / Naat Title</label>
                                <div className="inputBox">
                                    <span>🎤</span>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Tajalliyate Huzoor"
                                        value={kalamName}
                                        onChange={(e) => setKalamName(e.target.value)}
                                        disabled={uploading || candidate.payment?.status !== "Approved"}
                                    />
                                </div>
                            </div>

                            {/* File Drag and Drop */}
                            <div>
                                <label className="label">Select Video/Audio File</label>
                                <label className={`uploadBox flex flex-col items-center justify-center gap-3 border-2 border-dashed rounded-2xl p-8 bg-white hover:bg-brand-light/10 transition-all duration-300 ${
                                    candidate.payment?.status === "Approved" ? "cursor-pointer border-gray-200 hover:border-brand-primary" : "cursor-not-allowed border-gray-100 bg-gray-50/30"
                                }`}>
                                    <input
                                        type="file"
                                        accept="video/*,audio/*"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        disabled={uploading || candidate.payment?.status !== "Approved"}
                                    />
                                    <span className="text-4xl">📹</span>
                                    <span className="text-sm font-bold text-gray-700">Choose Recitation File</span>
                                    <span className="text-[10px] text-gray-400">MP4, MKV, MP3 up to 100MB</span>
                                </label>

                                {selectedFile && (
                                    <div className="mt-4 flex items-center gap-4 p-3 bg-brand-light/20 border border-brand-mint/20 rounded-xl animate-fade">
                                        <div className="w-12 h-12 bg-white rounded-lg border border-brand-mint/20 flex items-center justify-center text-2xl">
                                            🎞️
                                        </div>
                                        <div className="flex flex-col flex-1 truncate">
                                            <span className="text-xs text-brand-dark font-bold truncate max-w-[200px]">{selectedFile.name}</span>
                                            <span className="text-[10px] text-gray-500 font-bold">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Progress bar */}
                            {uploading && (
                                <div className="space-y-2 animate-fade">
                                    <div className="flex justify-between text-xs font-bold text-gray-500">
                                        <span>Uploading Submission...</span>
                                        <span>{progress}%</span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div className="h-full bg-brand-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                            )}

                            {/* Upload Trigger Button */}
                            <button
                                type="submit"
                                disabled={uploading || candidate.payment?.status !== "Approved"}
                                className="w-full py-4 bg-brand-primary hover:bg-emerald-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-brand-primary/20 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FiUploadCloud /> {uploading ? "Uploading..." : "Start Upload"}
                            </button>

                        </form>
                    )}

                </div>
            </div>
        </div>
    );
}

import { useState } from "react";

export default function Upload({ files, handleFile, next, prev }) {
    const [error, setError] = useState("");

    const handleLocalFile = (e) => {
        const file = e.target.files[0];
        const name = e.target.name;

        if (!file) return;

        // ✅ File Size Validation (Max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError(`⚠️ ${name === "photo" ? "Photo" : "Aadhar"} size must be less than 5MB`);
            return;
        }

        // ✅ Type Validation
        if (name === "photo") {
            if (!file.type.startsWith("image/")) {
                setError("⚠️ Photo must be an image file (JPEG/PNG)");
                return;
            }
        }

        if (name === "proof") {
            if (
                !file.type.startsWith("image/") &&
                file.type !== "application/pdf"
            ) {
                setError("⚠️ Aadhar must be an image or a PDF file");
                return;
            }
        }

        setError("");
        handleFile(name, file);
    };

    const handleNext = () => {
        if (!files?.photo) {
            setError("⚠️ Please upload your Photo");
            return;
        }
        if (!files?.proof) {
            setError("⚠️ Please upload your Aadhar document");
            return;
        }
        setError("");
        next();
    };

    return (
        <div className="w-full font-sans">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-display">
                    Upload Documents
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                    Upload your photo and Aadhar proof (JPEG, PNG, or PDF)
                </p>
            </div>

            <div className="space-y-6">

                {/* Photo */}
                <div>
                    <label className="label">Applicant Photograph</label>
                    <label className="uploadBox flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl p-6 bg-white hover:bg-brand-light/10 transition-all duration-300 cursor-pointer">
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleLocalFile}
                            className="hidden"
                        />
                        <span className="text-3xl">📸</span>
                        <span className="text-sm font-bold text-gray-700">Select Photograph</span>
                        <span className="text-xs text-gray-400">JPG or PNG (Max 5MB)</span>
                    </label>

                    {files?.photo && (
                        <div className="mt-3 flex items-center gap-4 p-3 bg-brand-light/20 border border-brand-mint/20 rounded-xl animate-fade">
                            <img
                                src={URL.createObjectURL(files.photo)}
                                className="w-16 h-16 object-cover rounded-lg border border-brand-mint"
                                alt="Preview"
                            />
                            <div className="flex flex-col">
                                <span className="text-xs text-brand-dark font-bold truncate max-w-[200px]">{files.photo.name}</span>
                                <span className="text-[10px] text-gray-500">{(files.photo.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Aadhar */}
                <div>
                    <label className="label">
                        Aadhar ID Document
                    </label>
                    <label className="uploadBox flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl p-6 bg-white hover:bg-brand-light/10 transition-all duration-300 cursor-pointer">
                        <input
                            type="file"
                            name="proof"
                            accept="image/*,application/pdf"
                            onChange={handleLocalFile}
                            className="hidden"
                        />
                        <span className="text-3xl">📄</span>
                        <span className="text-sm font-bold text-gray-700">Select Aadhar Card</span>
                        <span className="text-xs text-gray-400">JPG, PNG, or PDF (Max 5MB)</span>
                    </label>

                    {files?.proof && (
                        <div className="mt-3 flex items-center gap-4 p-3 bg-brand-light/20 border border-brand-mint/20 rounded-xl animate-fade">
                            {files.proof.type === "application/pdf" ? (
                                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-lg flex items-center justify-center text-3xl font-bold border border-red-100">
                                    PDF
                                </div>
                            ) : (
                                <img
                                    src={URL.createObjectURL(files.proof)}
                                    className="w-16 h-16 object-cover rounded-lg border border-brand-mint"
                                    alt="Preview"
                                />
                            )}
                            <div className="flex flex-col">
                                <span className="text-xs text-brand-dark font-bold truncate max-w-[200px]">{files.proof.name}</span>
                                <span className="text-[10px] text-gray-500">{(files.proof.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm mt-5 text-center font-semibold">
                    {error}
                </p>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-10">
                <button
                    onClick={prev}
                    className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold transition-all"
                >
                    ← Back
                </button>

                <button
                    onClick={handleNext}
                    className="px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-emerald-600 font-bold transition-all shadow-md shadow-brand-primary/10"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
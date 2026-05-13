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
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg mx-auto">

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Upload Documents
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Upload your photo and Aadhar proof
                </p>
            </div>

            <div className="space-y-6">

                {/* Photo */}
                <div>
                    <label className="label">Upload Photo (Image only)</label>
                    <div className="uploadBox">
                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleLocalFile}
                        />
                    </div>

                    {files?.photo && (
                        <img
                            src={URL.createObjectURL(files.photo)}
                            className="mt-2 w-24 h-24 object-cover rounded-lg"
                        />
                    )}
                </div>

                {/* Aadhar */}
                <div>
                    <label className="label">
                        Upload Aadhar (Image / PDF)
                    </label>
                    <div className="uploadBox">
                        <input
                            type="file"
                            name="proof"
                            accept="image/*,application/pdf"
                            onChange={handleLocalFile}
                        />
                    </div>

                    {files?.proof && (
                        <div className="mt-2">
                            {files.proof.type === "application/pdf" ? (
                                <p className="text-sm text-blue-600">
                                    📄 {files.proof.name}
                                </p>
                            ) : (
                                <img
                                    src={URL.createObjectURL(files.proof)}
                                    className="w-24 h-24 object-cover rounded-lg"
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-500 text-sm mt-4 text-center">
                    {error}
                </p>
            )}

            {/* Buttons */}
            <div className="flex justify-between mt-8">
                <button
                    onClick={prev}
                    className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
                >
                    ← Back
                </button>

                <button
                    onClick={handleNext}
                    className="px-6 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                >
                    Next →
                </button>
            </div>
        </div>
    );
}
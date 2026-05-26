import { useState, useEffect } from "react";

export default function Payment({ form, handleChange, handleFile, submit, prev, files }) {
    const [file, setFile] = useState(files?.transactionProof || null);
    const [error, setError] = useState("");

    useEffect(() => {
        setFile(files?.transactionProof || null);
    }, [files?.transactionProof]);

    const handleLocalFile = (e) => {
        const selected = e.target.files[0];

        if (!selected) return;

        // ✅ File Size Validation (Max 5MB)
        if (selected.size > 5 * 1024 * 1024) {
            setError("⚠️ Screenshot size must be less than 5MB");
            return;
        }

        // ✅ Only image allowed
        if (!selected.type.startsWith("image/")) {
            setError("⚠️ Payment proof must be an image");
            return;
        }

        setError("");
        setFile(selected);

        // ✅ Send file directly to parent state
        handleFile("transactionProof", selected);
    };

    const handleSubmit = () => {
        const { amount, transactionId } = form;

        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            setError("⚠️ Please enter a valid payment amount");
            return;
        }

        if (!transactionId || transactionId.trim().length < 5) {
            setError("⚠️ Please enter a valid Transaction ID (min 5 chars)");
            return;
        }

        const selectedFile = file || files?.transactionProof;
        if (!selectedFile) {
            setError("⚠️ Please upload payment screenshot");
            return;
        }

        setError("");
        submit();
    };

    return (
        <div className="w-full font-sans">

            {/* Header */}
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800 font-display">
                    Payment Verification
                </h2>
                <p className="text-xs text-gray-400 mt-1 font-medium">
                    Scan the QR code and upload payment screenshot
                </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-8 bg-brand-light/10 border border-brand-mint/20 rounded-2xl p-4">
                <img
                    src="/qr.png"
                    alt="QR Code"
                    className="w-40 h-40 object-contain border border-brand-mint/30 p-2 bg-white rounded-xl shadow-xs"
                />
                <p className="text-xs text-brand-dark font-bold mt-3">
                    Scan & Pay using any UPI App
                </p>
                <p className="text-[10px] text-gray-500 font-semibold mt-1">
                    Beneficiary: Hera Islamic Channel
                </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

                {/* Payment Amount */}
                <div>
                    <label className="label">Payment Amount (INR)</label>
                    <div className="inputBox">
                        <span>💳</span>
                        <input
                            name="amount"
                            value={form.amount || ""}
                            onChange={handleChange}
                            placeholder="Enter Amount (e.g. 200)"
                        />
                    </div>
                </div>

                {/* Transaction ID */}
                <div>
                    <label className="label">Transaction ID / UTR</label>
                    <div className="inputBox">
                        <span>🏷️</span>
                        <input
                            name="transactionId"
                            value={form.transactionId || ""}
                            onChange={handleChange}
                            placeholder="Enter 12-digit UPI Transaction Ref"
                        />
                    </div>
                </div>

                {/* Upload Screenshot */}
                <div>
                    <label className="label">Upload Payment Screenshot</label>
                    <label className="uploadBox flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 hover:border-brand-primary rounded-2xl p-6 bg-white hover:bg-brand-light/10 transition-all duration-300 cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLocalFile}
                            className="hidden"
                        />
                        <span className="text-3xl">📸</span>
                        <span className="text-sm font-bold text-gray-700">Select Screenshot</span>
                        <span className="text-xs text-gray-400">Image format (Max 5MB)</span>
                    </label>

                    {/* Preview */}
                    {file && (
                        <div className="mt-3 flex items-center gap-4 p-3 bg-brand-light/20 border border-brand-mint/20 rounded-xl animate-fade">
                            <img
                                src={URL.createObjectURL(file)}
                                className="w-16 h-16 object-cover rounded-lg border border-brand-mint"
                                alt="Preview"
                            />
                            <div className="flex flex-col">
                                <span className="text-xs text-brand-dark font-bold truncate max-w-[200px]">{file.name}</span>
                                <span className="text-[10px] text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB • Ready</span>
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
                    onClick={handleSubmit}
                    className="px-6 py-2.5 rounded-xl bg-brand-primary text-white hover:bg-emerald-600 font-bold transition-all shadow-md shadow-brand-primary/10"
                >
                    Submit ✔
                </button>
            </div>
        </div>
    );
}
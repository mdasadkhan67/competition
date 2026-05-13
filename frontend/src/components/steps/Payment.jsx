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
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 max-w-lg mx-auto">

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Payment
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                    Scan QR and complete payment
                </p>
            </div>

            {/* QR Code */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src="/qr.png"
                    alt="QR Code"
                    className="w-40 h-40 object-contain border p-2 rounded-lg"
                />
                <p className="text-sm text-gray-500 mt-2">
                    Scan & Pay using any UPI app
                </p>
            </div>

            {/* Form */}
            <div className="space-y-5">

                {/* Payment Amount */}
                <div>
                    <label className="label">Payment Amount</label>
                    <div className="inputBox">
                        <span>💳</span>
                        <input
                            name="amount"
                            value={form.amount || ""}
                            onChange={handleChange}
                            placeholder="Enter Amount"
                        />
                    </div>
                </div>

                {/* Transaction ID */}
                <div>
                    <label className="label">Transaction ID</label>
                    <div className="inputBox">
                        <span>💳</span>
                        <input
                            name="transactionId"
                            value={form.transactionId || ""}
                            onChange={handleChange}
                            placeholder="Enter transaction ID"
                        />
                    </div>
                </div>

                {/* Upload Screenshot */}
                <div>
                    <label className="label">Upload Payment Screenshot</label>
                    <div className="uploadBox">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleLocalFile}
                        />
                    </div>

                    {/* Preview */}
                    {file && (
                        <img
                            src={URL.createObjectURL(file)}
                            className="mt-2 w-28 h-28 object-cover rounded-lg"
                        />
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
                    onClick={handleSubmit}
                    className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition shadow"
                >
                    Submit ✔
                </button>
            </div>
        </div>
    );
}
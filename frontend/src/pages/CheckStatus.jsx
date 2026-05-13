import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatus, clearRegistrationState } from "../store/slices/registrationSlice";

export default function CheckStatus() {
    const [regId, setRegId] = useState("");
    const dispatch = useDispatch();

    // Get state from Redux store instead of local state
    const { statusData: data, loading, error } = useSelector((state) => state.registration);

    // Clear state on unmount
    useEffect(() => {
        return () => {
            dispatch(clearRegistrationState());
        };
    }, [dispatch]);

    const handleCheck = () => {
        if (!regId) {
            // We can still use local state or dispatch an error action, but for simple validation, an alert or just letting the user know is fine. 
            // We'll dispatch an action that just updates the error state (you can add a setValidationError reducer if needed, but let's stick to the thunk logic)
            // For now, let's just trigger the thunk with empty which will fail in the API, or handle it here:
            alert("Please enter Registration ID");
            return;
        }

        // Dispatch the async thunk
        dispatch(fetchStatus(regId.trim()));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center">

                {/* Title */}
                <h2 className="text-2xl font-bold mb-4">
                    Check Registration Status
                </h2>

                {/* Input */}
                <input
                    value={regId}
                    onChange={(e) => setRegId(e.target.value.toUpperCase())}
                    placeholder="Enter Registration ID"
                    className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
                />

                {/* Button */}
                <button
                    onClick={handleCheck}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check Status"}
                </button>

                {/* Error */}
                {error && (
                    <div className="text-red-500 text-sm mt-3 bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="font-semibold mb-2">
                            ❌  {error}
                        </p>

                        <ol className="list-decimal pl-5 space-y-2">
                            <li>
                                Please check and verify that your registration number is 100% correct.
                            </li>

                            <li>
                                If your registration details were showing earlier but are not showing now,
                                there is a chance that your registration has been cancelled by our team
                                due to a valid reason such as:

                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Payment verification not completed</li>
                                    <li>Transaction ID mismatch</li>
                                    <li>Incorrect or incomplete details</li>
                                    <li>Invalid or unclear proof/document upload</li>
                                </ul>
                            </li>

                            <li>
                                Kindly contact us or register again with proper details.
                            </li>
                        </ol>

                        <p className="mt-4 font-medium">
                            Contact Us:
                            <a
                                href="tel:+918080859144"
                                className="text-blue-600 underline ml-1"
                            >
                                +91 80808 59144
                            </a>
                        </p>
                    </div>
                )}

                {/* Result */}
                {data && (
                    <div className="mt-5 p-4 rounded-lg border">

                        {/* Pending */}
                        {data.registrationStatus === "pending" && (
                            <div className="text-yellow-600 font-semibold">
                                ⏳ Pending
                                <p className="text-sm text-gray-500 mt-1">
                                    Your payment is under verification
                                </p>
                            </div>
                        )}

                        {/* Approved */}
                        {data.registrationStatus === "approved" && (
                            <div className="text-green-600 font-semibold">
                                ✅ Approved
                                <p className="text-sm text-gray-500 mt-1">
                                    Your registration is confirmed
                                </p>
                            </div>
                        )}

                        {/* Rejected */}
                        {data.registrationStatus === "rejected" && (
                            <div className="text-red-600 font-semibold">
                                ❌ Rejected
                                <p className="text-sm text-gray-500 mt-1">
                                    Reason: {data.reason || "No reason provided"}
                                </p>
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}
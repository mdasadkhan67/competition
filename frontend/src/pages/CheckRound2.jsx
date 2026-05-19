import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStatus, clearRegistrationState, submitFinalNaat } from "../store/slices/registrationSlice";

// Dynamic naats will be provided by backend

export default function CheckRound2() {
    const [regId, setRegId] = useState("");
    const [selectedNaat, setSelectedNaat] = useState("");
    const dispatch = useDispatch();

    const { statusData: data, loading, error } = useSelector((state) => state.registration);

    useEffect(() => {
        return () => {
            dispatch(clearRegistrationState());
        };
    }, [dispatch]);

    const handleCheck = () => {
        if (!regId) {
            alert("Please enter Registration ID");
            return;
        }
        dispatch(fetchStatus(regId.trim()));
    };

    const handleSubmitNaat = () => {
        if (!selectedNaat) {
            alert("Please select a Naat title");
            return;
        }
        dispatch(submitFinalNaat({ regId: data.candidateRegId, naatTitle: selectedNaat }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-xl rounded-2xl p-6 w-full max-w-md text-center">

                <h2 className="text-2xl font-bold mb-4">
                    Check Final Round Status
                </h2>

                <input
                    value={regId}
                    onChange={(e) => setRegId(e.target.value.toUpperCase())}
                    placeholder="Enter Registration ID"
                    className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
                />

                <button
                    onClick={handleCheck}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
                    disabled={loading}
                >
                    {loading ? "Checking..." : "Check Status"}
                </button>

                {error && (
                    <div className="text-red-500 text-sm mt-3 bg-red-50 border border-red-200 rounded-xl p-4">
                        <p className="font-semibold mb-2">
                            ❌ {typeof error === "string" ? error : error.message}
                        </p>
                        <p>Make sure your Registration ID is correct.</p>
                    </div>
                )}

                {data && (
                    <div className="mt-5 space-y-4 text-left">
                        
                        {data.paymentStatus !== "approved" && (
                            <div className="p-4 rounded-lg border bg-white shadow-sm">
                                <div className="text-red-600 font-semibold flex flex-col">
                                    <span>❌ Not a Participant</span>
                                    <span className="text-sm text-gray-500 mt-1 font-normal">
                                        You are not a participant in Round One.
                                    </span>
                                </div>
                            </div>
                        )}

                        {data.paymentStatus === "approved" && !data.isRound2Selected && !data.isRound1Rejected && (
                            <div className="p-4 rounded-lg border bg-white shadow-sm">
                                <div className="text-blue-600 font-semibold flex flex-col">
                                    <span>⏳ Evaluation Pending</span>
                                    <span className="text-sm text-gray-500 mt-1 font-normal">
                                        You are in Round 1, but your performance is currently being evaluated.
                                    </span>
                                </div>
                            </div>
                        )}

                        {data.paymentStatus === "approved" && data.isRound1Rejected && (
                            <div className="p-4 rounded-lg border bg-white shadow-sm">
                                <div className="text-red-600 font-semibold flex flex-col">
                                    <span>❌ Not Eligible</span>
                                    <span className="text-sm text-gray-500 mt-1 font-normal">
                                        You are not eligible for Round 2.
                                    </span>
                                </div>
                            </div>
                        )}

                        {data.paymentStatus === "approved" && data.isRound2Selected && (
                            <div className="p-4 rounded-lg border bg-white shadow-sm">
                                <div className="text-purple-700 font-bold bg-purple-50 p-3 rounded-xl border border-purple-100 mb-4">
                                    🏆 Selected for Final Round!
                                    <p className="text-sm text-purple-600 mt-1 font-medium">
                                        Congratulations! You have been selected for the final judging round.
                                    </p>
                                </div>

                                {data.finalRoundNaat ? (
                                    <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                        <h4 className="text-sm font-bold text-green-800">Your Selected Naat:</h4>
                                        <p className="text-green-700 mt-1">{data.finalRoundNaat}</p>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <label className="block text-sm font-bold text-gray-700 mb-2">
                                            Select Naat Title for Final Round:
                                        </label>
                                        <select
                                            value={selectedNaat}
                                            onChange={(e) => setSelectedNaat(e.target.value)}
                                            className="w-full border p-2 rounded-lg mb-3 focus:ring-2 focus:ring-purple-500 outline-none"
                                        >
                                            <option value="">-- Choose a Title --</option>
                                            {data.availableNaats?.map((title, idx) => (
                                                <option key={idx} value={title}>
                                                    {title}
                                                </option>
                                            ))}
                                        </select>
                                        <button
                                            onClick={handleSubmitNaat}
                                            disabled={loading}
                                            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                                        >
                                            Submit Selection
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                )}
            </div>
        </div>
    );
}

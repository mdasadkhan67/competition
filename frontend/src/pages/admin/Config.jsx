import { useState, useEffect } from "react";
import { getGroupAvailability, updateGroupLimit, getGlobalConfig, updateGlobalConfig } from "../../api/config";

export default function Config() {
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [newLimit, setNewLimit] = useState("");
    const [globalConfig, setGlobalConfig] = useState({ startDate: "", endDate: "" });
    const [savingGlobal, setSavingGlobal] = useState(false);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const [groupRes, globalRes] = await Promise.all([
                getGroupAvailability(),
                getGlobalConfig()
            ]);

            if (groupRes.success) {
                setAvailability(groupRes.data);
            } else {
                setError(groupRes.message);
            }

            if (globalRes.success && globalRes.data) {
                setGlobalConfig({
                    startDate: globalRes.data.startDate ? new Date(globalRes.data.startDate).toISOString().slice(0, 16) : "",
                    endDate: globalRes.data.endDate ? new Date(globalRes.data.endDate).toISOString().slice(0, 16) : ""
                });
            }
        } catch (err) {
            setError("Failed to fetch configurations.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSaveLimit = async (group) => {
        try {
            const limitNum = Number(newLimit);
            if (isNaN(limitNum) || limitNum < 0) {
                alert("Please enter a valid positive number");
                return;
            }
            const res = await updateGroupLimit(group, limitNum);
            if (res.success) {
                setEditingGroup(null);
                fetchConfig(); // Refresh
            } else {
                alert(res.message);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update limit");
        }
    };

    const handleSaveGlobalConfig = async () => {
        try {
            setSavingGlobal(true);
            const res = await updateGlobalConfig(
                globalConfig.startDate || null,
                globalConfig.endDate || null
            );
            if (res.success) {
                alert("Registration window updated successfully!");
                fetchConfig();
            } else {
                alert(res.message);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to update registration window");
        } finally {
            setSavingGlobal(false);
        }
    };

    if (loading && availability.length === 0) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Registration Limits & Config</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Registration Window</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={globalConfig.startDate}
                            onChange={(e) => setGlobalConfig({ ...globalConfig, startDate: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to keep open indefinitely</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date & Time</label>
                        <input
                            type="datetime-local"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={globalConfig.endDate}
                            onChange={(e) => setGlobalConfig({ ...globalConfig, endDate: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave blank to keep open indefinitely</p>
                    </div>
                </div>
                <button
                    onClick={handleSaveGlobalConfig}
                    disabled={savingGlobal}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                    {savingGlobal ? "Saving..." : "Save Window"}
                </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Limits</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {availability.map((item) => (
                    <div key={item.group} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-800">{item.group} Group</h2>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.isFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {item.isFull ? "FULL" : "OPEN"}
                            </span>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Current Limit</p>
                                {editingGroup === item.group ? (
                                    <div className="flex items-center space-x-2 mt-1">
                                        <input
                                            type="number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                            value={newLimit}
                                            onChange={(e) => setNewLimit(e.target.value)}
                                            min="0"
                                        />
                                        <button
                                            onClick={() => handleSaveLimit(item.group)}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={() => setEditingGroup(null)}
                                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-2xl font-bold text-gray-900">{item.limit}</span>
                                        <button
                                            onClick={() => {
                                                setEditingGroup(item.group);
                                                setNewLimit(item.limit);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                        >
                                            Edit Limit
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <p className="text-sm text-gray-500">Current Registrations</p>
                                <span className="text-lg font-semibold text-gray-800">{item.count}</span>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                                    <div
                                        className={`h-2.5 rounded-full ${item.isFull ? 'bg-red-500' : 'bg-blue-500'}`}
                                        style={{ width: `${Math.min(100, item.limit > 0 ? (item.count / item.limit) * 100 : 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    {item.limit - item.count > 0 ? `${item.limit - item.count} spots remaining` : 'No spots remaining'}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

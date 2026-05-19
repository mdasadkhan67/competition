import { useEffect, useState } from "react";
import API from "../../api/admin";
import { FiTrash2, FiPlus, FiUser, FiMail, FiLock, FiAlertCircle, FiEdit2 } from "react-icons/fi";
import { SCORING } from "../../constants/scoring";

export default function Judges() {
    const [judges, setJudges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingJudge, setEditingJudge] = useState(null);
    const [formData, setFormData] = useState({ name: "", email: "", password: "" });

    const fetchJudges = async () => {
        try {
            setLoading(true);
            const res = await API.get("/admin/judges");
            setJudges(res.data.data);
            setError("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to fetch judges");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJudges();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this judge?")) return;
        try {
            await API.delete(`/admin/judges/${id}`);
            fetchJudges();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to delete judge");
        }
    };

    const handleEdit = (judge) => {
        setEditingJudge(judge);
        setFormData({ name: judge.name, email: judge.email, password: "" }); // Password blank unless changing
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingJudge) {
                // Update
                const updateData = { ...formData };
                if (!updateData.password) delete updateData.password; // Don't send empty password
                await API.put(`/admin/judges/${editingJudge._id}`, updateData);
            } else {
                // Create
                await API.post("/admin/judges", formData);
            }
            setShowModal(false);
            setEditingJudge(null);
            setFormData({ name: "", email: "", password: "" });
            fetchJudges();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${editingJudge ? 'update' : 'create'} judge`);
        }
    };

    const openCreateModal = () => {
        setEditingJudge(null);
        setFormData({ name: "", email: "", password: "" });
        setShowModal(true);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-800">Judge Management</h2>
                    <p className="text-gray-500 mt-1">Create and manage competition judges (Limit: {SCORING.MAX_JUDGES})</p>
                </div>

                <button
                    onClick={openCreateModal}
                    disabled={judges.length >= SCORING.MAX_JUDGES}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${judges.length >= SCORING.MAX_JUDGES
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30"
                        }`}
                >
                    <FiPlus />
                    <span>Add Judge</span>
                </button>
            </div>

            {error && (
                <div className="mb-6 bg-red-50 text-red-500 p-4 rounded-xl border border-red-100 flex items-center space-x-2">
                    <FiAlertCircle />
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full text-center py-12 text-gray-400">Loading judges...</div>
                ) : judges.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-gray-400">No judges found. Add your first judge!</div>
                ) : (
                    judges.map((judge) => (
                        <div key={judge._id} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 group">
                            <div className="flex justify-between items-start">
                                <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl font-bold">
                                    {judge.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex space-x-1">
                                    <button
                                        onClick={() => handleEdit(judge)}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Judge"
                                    >
                                        <FiEdit2 />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(judge._id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Judge"
                                    >
                                        <FiTrash2 />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4">
                                <h3 className="text-lg font-bold text-gray-800">{judge.name}</h3>
                                <p className="text-gray-500 flex items-center space-x-2 mt-1">
                                    <FiMail className="text-sm" />
                                    <span>{judge.email}</span>
                                </p>
                            </div>
                            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                                    Active Judge
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                        <h3 className="text-2xl font-bold text-gray-800 mb-6">{editingJudge ? 'Edit Judge' : 'Create New Judge'}</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <div className="relative">
                                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="Enter judge name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="judge@example.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password {editingJudge && <span className="text-xs text-gray-400 font-normal">(Leave blank to keep current)</span>}
                                </label>
                                <div className="relative">
                                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="password"
                                        required={!editingJudge}
                                        minLength="6"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="flex space-x-3 mt-8">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-3 px-6 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all"
                                >
                                    {editingJudge ? 'Update Judge' : 'Create Account'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

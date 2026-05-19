import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../../store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FiLock, FiMail, FiUserCheck } from "react-icons/fi";

export default function JudgeLogin() {
    const [form, setForm] = useState({ email: "", password: "" });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token && user?.role === "judge") {
            navigate("/judge/dashboard");
        }
    }, [token, user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) return;

        const res = await dispatch(adminLogin(form));
        if (res.meta.requestStatus === "fulfilled") {
            const loggedInUser = res.payload.user;
            if (loggedInUser.role === "judge") {
                navigate("/judge/dashboard");
            } else {
                navigate("/admin/dashboard");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-blue-900 to-black p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-3xl shadow-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center h-20 w-20 bg-indigo-500 rounded-2xl mb-6 shadow-lg shadow-indigo-500/50">
                        <FiUserCheck className="text-4xl text-white" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">Judge Portal</h2>
                    <p className="text-indigo-200 mt-2">Welcome to Naat Competition Evaluation</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-3 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Judge Email</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiMail className="text-gray-400" />
                            </div>
                            <input
                                type="email"
                                placeholder="judge@example.com"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300 ml-1">Secret Key</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FiLock className="text-gray-400" />
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                required
                                className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg shadow-indigo-500/30 transition-all duration-200 flex justify-center items-center text-lg"
                    >
                        {loading ? (
                            <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            "Start Judging"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}

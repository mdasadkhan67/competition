import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useEffect } from "react";
import { FiHome, FiLogOut, FiCheck } from "react-icons/fi";

export default function JudgeLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { token, user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!token) {
            navigate("/judge/login");
        } else if (!user?.role) {
            dispatch(logout());
            navigate("/judge/login");
        } else if (user?.role !== "judge") {
            navigate("/admin/login"); // Redirect non-judges
        }
    }, [token, user, navigate, dispatch]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/judge/login");
    };

    if (!token || user?.role !== "judge") return null;

    const navItems = [
        { name: "Dashboard", path: "/judge/dashboard", icon: <FiHome className="text-xl" /> },
        { name: "Jr Group", path: "/judge/judging/Jr.", icon: <FiCheck className="text-xl" /> },
        { name: "Middle Group", path: "/judge/judging/Middle", icon: <FiCheck className="text-xl" /> },
        { name: "Sr Group", path: "/judge/judging/Sr", icon: <FiCheck className="text-xl" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-indigo-900 text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-indigo-800 flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-bold text-white">JudgePortal</h2>
                    <p className="text-indigo-300 text-xs mt-1 uppercase tracking-widest font-bold">Naat Competition</p>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-white/10 text-white shadow-lg border border-white/10 backdrop-blur-md"
                                    : "text-indigo-200 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-indigo-800">
                    <div className="mb-4 px-4">
                        <p className="text-xs text-indigo-400 uppercase font-bold">Logged in as</p>
                        <p className="text-sm font-medium truncate">{user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-indigo-300 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200"
                    >
                        <FiLogOut className="text-xl" />
                        <span className="font-medium">Logout</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

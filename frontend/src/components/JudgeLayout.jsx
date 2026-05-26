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
            <div className="w-64 bg-brand-dark text-white flex flex-col shadow-2xl border-r border-brand-mint/10">
                
                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/5 flex items-center gap-3">
                    <img src="/logo.svg" alt="SDI Logo" className="w-10 h-10 bg-white rounded-full p-0.5 border border-brand-gold" />
                    <div className="flex flex-col">
                        <span className="text-white font-extrabold text-base tracking-tight font-display">
                            SDI Judge
                        </span>
                        <span className="text-brand-mint font-bold text-[9px] uppercase tracking-wider mt-0.5">
                            Evaluation Portal
                        </span>
                    </div>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + "/");
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-brand-primary/20 text-brand-mint border-l-4 border-brand-gold font-bold shadow-inner"
                                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                <span className="font-semibold text-xs sm:text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Sidebar Footer / User and Logout */}
                <div className="p-4 border-t border-white/5">
                    <div className="mb-4 px-4 font-semibold text-xs text-gray-400">
                        <p className="text-[10px] text-brand-mint font-bold uppercase tracking-wider">Logged in as</p>
                        <p className="text-sm font-extrabold text-white mt-1 truncate">{user?.name}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200 cursor-pointer"
                    >
                        <FiLogOut className="text-xl" />
                        <span className="font-bold text-xs sm:text-sm">Logout</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-auto bg-gray-50/50">
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

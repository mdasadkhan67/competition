import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { useEffect } from "react";
import { FiHome, FiUsers, FiLogOut, FiSettings, FiDownload } from "react-icons/fi";

export default function AdminLayout() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!token) {
            navigate("/admin/login");
        }
    }, [token, navigate]);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/admin/login");
    };

    if (!token) return null; // Prevent rendering before redirect

    const navItems = [
        { name: "Dashboard", path: "/admin/dashboard", icon: <FiHome className="text-xl" /> },
        { name: "Users", path: "/admin/users", icon: <FiUsers className="text-xl" /> },
        { name: "Export", path: "/admin/export", icon: <FiDownload className="text-xl" /> },
        { name: "Limits", path: "/admin/config", icon: <FiSettings className="text-xl" /> },
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-800 flex items-center justify-center">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        AdminPro
                    </h2>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = location.pathname.includes(item.path);
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                                    }`}
                            >
                                {item.icon}
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-800">
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all duration-200"
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
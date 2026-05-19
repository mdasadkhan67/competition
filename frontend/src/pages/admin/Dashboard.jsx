import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStats } from "../../store/slices/adminSlice";

export default function Dashboard() {
    const dispatch = useDispatch();
    const { stats, loading, error } = useSelector((state) => state.admin);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(fetchStats());
    }, [dispatch]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl border border-red-100">
                Error loading stats: {error}
            </div>
        );
    }

    // Map keys to readable titles and colors
    const formatKey = (key) => {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    };

    const colorMap = [
        "from-blue-500 to-cyan-400",
        "from-purple-500 to-pink-500",
        "from-orange-500 to-yellow-400",
        "from-emerald-500 to-teal-400",
    ];


    return (
        <div>
            <div className="mb-8">
                {user?.role === "judge" ? (
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-xl shadow-blue-500/20">
                        <h1 className="text-4xl font-extrabold mb-2">Welcome to Naat Competition</h1>
                        <p className="text-blue-100 text-lg opacity-90">Honorable Judge, <span className="font-bold underline decoration-blue-300 underline-offset-4">{user.name}</span></p>
                        <p className="mt-4 text-sm bg-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm">Evaluation Portal Active</p>
                    </div>
                ) : (
                    <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Object.entries(stats || {}).map(([key, value], index) => {
                    const gradient = colorMap[index % colorMap.length];
                    return (
                        <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
                            <div className="p-6">
                                <p className="text-sm font-medium text-gray-500 mb-1">{formatKey(key)}</p>
                                <h2 className="text-4xl font-extrabold text-gray-900">{value}</h2>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
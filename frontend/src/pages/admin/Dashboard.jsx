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
        "from-brand-dark to-brand-primary",
        "from-brand-primary to-brand-mint",
        "from-brand-gold to-brand-gold-light",
        "from-[#044e43] to-emerald-400",
    ];


    return (
        <div className="font-sans">
            <div className="mb-8">
                {user?.role === "judge" ? (
                    <div className="bg-gradient-to-r from-brand-dark to-[#054e42] border border-brand-mint/20 rounded-3xl p-8 text-white shadow-xl soft-glow-emerald relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[120px] pointer-events-none"></div>
                        <h1 className="text-4xl font-extrabold mb-2 font-display">Welcome to Naat Competition</h1>
                        <p className="text-brand-mint text-lg opacity-95">Honorable Judge, <span className="font-bold underline decoration-brand-gold underline-offset-4">{user.name}</span></p>
                        <p className="mt-4 text-xs font-bold bg-white/10 text-brand-mint border border-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm tracking-wide uppercase">Evaluation Portal Active</p>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-brand-dark to-[#054e42] border border-brand-mint/20 rounded-3xl p-8 text-white shadow-xl soft-glow-emerald relative overflow-hidden animate-fade-in-up">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-[120px] pointer-events-none"></div>
                        <h1 className="text-4xl font-extrabold mb-2 font-display">Welcome to SDI Admin</h1>
                        <p className="text-brand-mint text-lg opacity-95">Systems Administrator, <span className="font-bold underline decoration-brand-gold underline-offset-4">{user?.name || "Officer"}</span></p>
                        <p className="mt-4 text-xs font-bold bg-white/10 text-brand-mint border border-white/10 w-fit px-4 py-2 rounded-full backdrop-blur-sm tracking-wide uppercase">Naat Portal Controller</p>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 font-sans">
                {Object.entries(stats || {}).map(([key, value], index) => {
                    const gradient = colorMap[index % colorMap.length];
                    return (
                        <div key={key} className="bg-white rounded-2xl shadow-sm border border-gray-150 overflow-hidden hover:shadow-lg transition-all duration-300">
                            <div className={`h-2 w-full bg-gradient-to-r ${gradient}`}></div>
                            <div className="p-6">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">{formatKey(key)}</p>
                                <h2 className="text-4xl font-black text-brand-dark font-display">{value}</h2>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
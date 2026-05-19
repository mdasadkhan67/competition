import { useSelector } from "react-redux";
import { SCORING, scoringScaleLabel, maxGrandTotal, scoringCategoriesList } from "../../constants/scoring";

export default function JudgeDashboard() {
    const { user } = useSelector((state) => state.auth);

    return (
        <div className="space-y-8">
            <div className="bg-gradient-to-r from-indigo-600 to-blue-700 rounded-3xl p-10 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-5xl font-extrabold mb-4 tracking-tight">Welcome to Naat Competition</h1>
                    <p className="text-indigo-100 text-xl opacity-90 font-medium">
                        Honorable Judge,{" "}
                        <span className="text-white underline decoration-white/30 underline-offset-8 decoration-4">
                            {user?.name}
                        </span>
                    </p>
                    <div className="mt-8 flex gap-4">
                        <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 text-sm font-bold uppercase tracking-widest">
                            Evaluation Portal Active
                        </div>
                    </div>
                </div>
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-black/10 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-4">Marking Criteria</h3>
                    <ul className="space-y-2 text-sm text-gray-700 font-medium">
                        {scoringCategoriesList().map((line) => (
                            <li key={line} className="flex gap-2">
                                <span className="text-indigo-600 font-bold shrink-0">•</span>
                                <span>{line}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="text-xs text-gray-500 mt-4 font-medium">
                        Total per candidate: {SCORING.MAX_TOTAL_PER_JUDGE} marks · Grand max {maxGrandTotal()} (
                        {SCORING.MAX_JUDGES} judges)
                    </p>
                </div>
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="text-gray-400 uppercase text-xs font-bold tracking-widest mb-2">Instructions</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Select a <strong>group</strong> (Jr. / Middle / Sr) from the sidebar to score participants.
                    </p>
                    <p className="text-3xl font-black text-blue-600">{scoringScaleLabel()}</p>
                    <p className="text-xs text-gray-500 mt-2 font-medium">
                        Each criterion is scored 0–10. Submissions are locked after save.
                    </p>
                </div>
            </div>
        </div>
    );
}

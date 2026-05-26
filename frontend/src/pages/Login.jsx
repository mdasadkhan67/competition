import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../store/slices/authSlice";
import { fetchStatus } from "../store/slices/registrationSlice";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FiLock, FiMail, FiUser, FiSmartphone, FiKey, FiArrowLeft, FiLogOut } from "react-icons/fi";

export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    // Tabs: 'participant' or 'portal' (admin/judge)
    const initialTab = searchParams.get("role") === "admin" || searchParams.get("role") === "judge" ? "portal" : "participant";
    const [activeTab, setActiveTab] = useState(initialTab);

    // Form states
    const [participantForm, setParticipantForm] = useState({ regId: "", phone: "" });
    const [portalForm, setPortalForm] = useState({ email: "", password: "" });

    // Status/Errors
    const [participantError, setParticipantError] = useState("");
    const [participantLoading, setParticipantLoading] = useState(false);

    // Redux auth states
    const { loading: authLoading, error: authError, token, user } = useSelector((state) => state.auth);

    // Redirect admins/judges if already logged in
    useEffect(() => {
        if (token && user?.role) {
            if (user.role === "judge") {
                navigate("/judge/dashboard");
            } else {
                navigate("/admin/dashboard");
            }
        }
    }, [token, user, navigate]);

    // Handle Participant Login via Status Check
    const handleParticipantSubmit = async (e) => {
        e.preventDefault();
        setParticipantError("");

        if (!participantForm.regId || !participantForm.phone) {
            setParticipantError("⚠️ Both fields are required.");
            return;
        }

        setParticipantLoading(true);
        try {
            // Dispatch fetchStatus which calls /api/status/:id
            const res = await dispatch(fetchStatus(participantForm.regId)).unwrap();
            
            if (res && res.success && res.data) {
                const candidate = res.data;
                
                // Simple validation: check if phone matches (we can normalize it)
                const candidatePhone = candidate.phone ? String(candidate.phone).trim() : "";
                const enteredPhone = String(participantForm.phone).trim();

                if (candidatePhone && candidatePhone.slice(-10) !== enteredPhone.slice(-10)) {
                    setParticipantError("⚠️ Mobile number does not match our records.");
                    setParticipantLoading(false);
                    return;
                }

                // If valid, save participant credentials to local storage
                localStorage.setItem("participant", JSON.stringify(candidate));
                localStorage.setItem("participantRegId", candidate.candidateRegId);
                
                navigate("/participant/dashboard");
            } else {
                setParticipantError("⚠️ Registration ID not found.");
            }
        } catch (err) {
            setParticipantError(err || "⚠️ ID not found or server is offline.");
        } finally {
            setParticipantLoading(false);
        }
    };

    // Handle Admin/Judge Login
    const handlePortalSubmit = async (e) => {
        e.preventDefault();
        if (!portalForm.email || !portalForm.password) return;

        const res = await dispatch(adminLogin(portalForm));
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
        <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row font-sans">
            
            {/* Left Column: Visual Banner */}
            <div className="lg:w-1/2 premium-gradient-bg text-white p-12 flex flex-col justify-between items-center lg:items-start relative overflow-hidden text-center lg:text-left min-h-[300px] lg:min-h-screen">
                <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none"></div>
                
                {/* Header */}
                <Link to="/" className="flex items-center gap-3 relative z-10">
                    <img src="/logo.svg" alt="SDI Logo" className="w-12 h-12 bg-white rounded-full p-0.5 border border-brand-gold" />
                    <div>
                        <h3 className="text-white font-extrabold text-lg tracking-tight font-display leading-none">SDI Portal</h3>
                        <p className="text-brand-mint font-bold text-[10px] uppercase tracking-wider mt-1 leading-none">Hera Islamic Channel</p>
                    </div>
                </Link>

                {/* Banner Content */}
                <div className="space-y-4 max-w-md my-auto relative z-10 py-10 lg:py-0">
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-display">
                        Naat Competition Evaluation Center
                    </h2>
                    <p className="text-gray-300 text-sm leading-relaxed font-semibold">
                        Enter your participant dashboard to track document audits, review scoring guides, view feedback from the jury, and upload your naat recordings.
                    </p>
                </div>

                {/* Footer Info */}
                <div className="text-xs text-gray-400 relative z-10 hidden lg:block">
                    &copy; 2026 SDI Naat Competition Portal. Quba Zone, Kurla.
                </div>
            </div>

            {/* Right Column: Forms Panel */}
            <div className="lg:w-1/2 flex items-center justify-center p-6 sm:p-12 min-h-[500px]">
                <div className="w-full max-w-md bg-white border border-gray-150 rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden animate-fade-in-up">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary"></div>
                    
                    {/* Page titles */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-black text-brand-dark font-display">Sign In</h2>
                        <p className="text-xs text-gray-400 font-semibold mt-1">Access your respective dashboard</p>
                    </div>

                    {/* Tabs switcher */}
                    <div className="grid grid-cols-2 gap-1.5 bg-gray-100 rounded-2xl p-1 mb-8 font-display font-semibold text-xs border border-gray-150">
                        <button
                            onClick={() => {
                                setActiveTab("participant");
                                setParticipantError("");
                            }}
                            className={`py-3 rounded-xl transition-all cursor-pointer font-bold text-center ${
                                activeTab === "participant"
                                ? "bg-white text-brand-dark shadow-sm border border-gray-200/50"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Participant
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab("portal");
                                setParticipantError("");
                            }}
                            className={`py-3 rounded-xl transition-all cursor-pointer font-bold text-center ${
                                activeTab === "portal"
                                ? "bg-white text-brand-dark shadow-sm border border-gray-200/50"
                                : "text-gray-500 hover:text-gray-800"
                            }`}
                        >
                            Admin / Judge
                        </button>
                    </div>

                    {/* ================= TAB 1: PARTICIPANT LOGIN ================= */}
                    {activeTab === "participant" && (
                        <form onSubmit={handleParticipantSubmit} className="space-y-5">
                            {participantError && (
                                <div className="bg-red-50/50 border border-red-200/50 text-red-500 p-3 rounded-xl text-xs font-semibold text-center animate-fade">
                                    {participantError}
                                </div>
                            )}

                            <div>
                                <label className="label">Registration ID</label>
                                <div className="inputBox">
                                    <span>🆔</span>
                                    <input
                                        type="text"
                                        placeholder="e.g. SDI-2026-081"
                                        required
                                        value={participantForm.regId}
                                        onChange={(e) => setParticipantForm({ ...participantForm, regId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Registered Phone Number</label>
                                <div className="inputBox">
                                    <span>📞</span>
                                    <input
                                        type="text"
                                        placeholder="10-digit mobile number"
                                        required
                                        value={participantForm.phone}
                                        onChange={(e) => setParticipantForm({ ...participantForm, phone: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={participantLoading}
                                className="w-full py-3.5 bg-brand-primary hover:bg-emerald-600 text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md hover:shadow-brand-primary/25 transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {participantLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Enter Dashboard"
                                )}
                            </button>
                        </form>
                    )}

                    {/* ================= TAB 2: PORTAL LOGIN ================= */}
                    {activeTab === "portal" && (
                        <form onSubmit={handlePortalSubmit} className="space-y-5">
                            {(authError || authError === "Request failed with status code 401") && (
                                <div className="bg-red-50/50 border border-red-200/50 text-red-500 p-3 rounded-xl text-xs font-semibold text-center animate-fade">
                                    {authError === "Request failed with status code 401" ? "⚠️ Invalid email or password credentials." : `⚠️ ${authError}`}
                                </div>
                            )}

                            <div>
                                <label className="label">Portal Email</label>
                                <div className="inputBox">
                                    <span>📧</span>
                                    <input
                                        type="email"
                                        placeholder="admin@example.com"
                                        required
                                        onChange={(e) => setPortalForm({ ...portalForm, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="label">Password</label>
                                <div className="inputBox">
                                    <span>🔒</span>
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        required
                                        onChange={(e) => setPortalForm({ ...portalForm, password: e.target.value })}
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={authLoading}
                                className="w-full py-3.5 bg-brand-dark hover:bg-brand-dark-hover text-white font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {authLoading ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    "Sign In to Portal"
                                )}
                            </button>
                        </form>
                    )}

                </div>
            </div>

        </div>
    );
}

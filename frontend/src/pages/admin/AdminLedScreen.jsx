import { useEffect, useState, useRef } from "react";
import { FiPlay, FiPause, FiChevronRight, FiChevronLeft, FiRotateCcw, FiTv, FiInfo, FiAward } from "react-icons/fi";
import { SCORING, SCORING_CATEGORIES } from "../../constants/scoring";

// Audio Synthesizers using Web Audio API
const playTickSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "sine";
        osc.frequency.setValueAtTime(1000, ctx.currentTime);

        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

        osc.start();
        osc.stop(ctx.currentTime + 0.06);
    } catch (e) {
        console.warn("Synth Audio tick error:", e);
    }
};

const playTriumphSound = () => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const now = ctx.currentTime;
        // Cinematic Major 7th chord synth structure (C, E, G, B, D)
        const notes = [261.63, 329.63, 392.00, 493.88, 587.33];

        notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
            osc.frequency.setValueAtTime(freq, now);
            // Slight detune for chorus warmth
            osc.detune.setValueAtTime((Math.random() - 0.5) * 15, now);

            // Rich envelope
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.08, now + 0.15 + (idx * 0.05)); // staggered attack
            gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5);

            osc.start(now);
            osc.stop(now + 2.8);
        });
    } catch (e) {
        console.warn("Synth Audio triumph error:", e);
    }
};

// CountUp number component
function CountUp({ value, duration = 1000 }) {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(value, 10);
        if (isNaN(end)) return;
        if (end === 0) {
            setCurrent(0);
            return;
        }

        const stepTime = Math.max(Math.floor(duration / end), 15);
        const timer = setInterval(() => {
            start += 1;
            setCurrent(start);
            if (start >= end) {
                clearInterval(timer);
            }
        }, stepTime);

        return () => clearInterval(timer);
    }, [value, duration]);

    return <span>{current}</span>;
}

export default function AdminLedScreen({ isEmbedded = false, embeddedCandidate = null, onClose = null }) {
    const [candidate, setCandidate] = useState(null);

    // Steps:
    // 0: Standby / Welcome Screen
    // 1: Candidate Intro & 5-Second Countdown
    // 2: Reveal Judge 1
    // 3: Reveal Judge 2
    // 4: Reveal Judge 3
    // 5: Reveal Grand Total
    const [step, setStep] = useState(0);
    const [countdown, setCountdown] = useState(5);
    const [isPlaying, setIsPlaying] = useState(true);
    const [speedMultiplier, setSpeedMultiplier] = useState(1); // 1 = 1x speed

    const timerRef = useRef(null);
    const countdownTimerRef = useRef(null);

    // Load candidate from props or localStorage
    useEffect(() => {
        if (isEmbedded && embeddedCandidate) {
            setCandidate(embeddedCandidate);
            setStep(1);
            setCountdown(5);
            setIsPlaying(true);
        } else {
            // Standalone page: load initial and listen for updates
            const handleStorageChange = (e) => {
                if (e.key === "active_led_candidate" && e.newValue) {
                    try {
                        const parsed = JSON.parse(e.newValue);
                        setCandidate(parsed);
                        setStep(1);
                        setCountdown(5);
                        setIsPlaying(true);
                    } catch (err) {
                        console.error("Error parsing stored candidate:", err);
                    }
                }
            };

            const currentVal = localStorage.getItem("active_led_candidate");
            if (currentVal) {
                try {
                    setCandidate(JSON.parse(currentVal));
                    setStep(1);
                    setCountdown(5);
                    setIsPlaying(true);
                } catch (err) {
                    console.error("Error parsing stored candidate:", err);
                }
            }

            window.addEventListener("storage", handleStorageChange);
            return () => window.removeEventListener("storage", handleStorageChange);
        }
    }, [isEmbedded, embeddedCandidate]);

    // Handle countdown timer (step 1 only)
    useEffect(() => {
        if (step === 1 && isPlaying && candidate) {
            countdownTimerRef.current = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownTimerRef.current);
                        setStep(2);
                        return 5;
                    }
                    playTickSound();
                    return prev - 1;
                });
            }, 1000 / speedMultiplier);
        }

        return () => {
            if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        };
    }, [step, isPlaying, candidate, speedMultiplier]);

    // Handle auto progression timer (steps 2, 3, 4)
    useEffect(() => {
        if (step >= 2 && step <= 4 && isPlaying && candidate) {
            timerRef.current = setTimeout(() => {
                setStep((prev) => {
                    const next = prev + 1;
                    if (next === 5) {
                        playTriumphSound();
                    }
                    return next;
                });
            }, 5000 / speedMultiplier);
        }

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [step, isPlaying, candidate, speedMultiplier]);

    // Keyboard controls (Esc to close in embedded, space to pause, arrows for manual skip)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isEmbedded && onClose) {
                onClose();
            } else if (e.key === " ") {
                e.preventDefault();
                setIsPlaying(prev => !prev);
            } else if (e.key === "ArrowRight") {
                handleNext();
            } else if (e.key === "ArrowLeft") {
                handlePrev();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [step, isPlaying, isEmbedded, onClose]);

    const handleNext = () => {
        if (step === 1) {
            setStep(2);
        } else if (step < 5) {
            const next = step + 1;
            setStep(next);
            if (next === 5) {
                playTriumphSound();
            }
        }
    };

    const handlePrev = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handleReset = () => {
        setStep(1);
        setCountdown(5);
    };

    // Calculate sum of scores
    const getGrandTotal = () => {
        if (!candidate || !candidate.scores) return 0;
        return candidate.scores.reduce((sum, s) => sum + (s.totalScore || 0), 0);
    };

    return (
        <div className="h-screen w-full select-none bg-radial from-[#042d27] via-[#021f1b] to-[#000d0b] text-white flex flex-col justify-between p-4 md:p-6 font-sans overflow-hidden relative">
            {/* Ambient Animated Particles in Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-[10%] left-[20%] w-72 h-72 rounded-full bg-brand-primary/10 blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-brand-gold/5 blur-[120px] animate-pulse"></div>
                <div className="absolute top-[50%] left-[60%] w-80 h-80 rounded-full bg-brand-mint/5 blur-[90px] animate-pulse"></div>
            </div>

            {/* Standby View */}
            {(!candidate || step === 0) ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-8 animate-fade-in-up">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-brand-mint/20 blur-xl animate-ping duration-1000"></div>
                        <img src="/logo.svg" alt="SDI Logo" className="w-32 h-32 bg-white/5 border border-brand-gold rounded-full p-4 relative z-10 animate-float" />
                    </div>
                    <div>
                        <h1 className="text-5xl font-black tracking-wider uppercase bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-transparent bg-clip-text font-display">
                            SDI Naat Competition 2026
                        </h1>
                        <p className="text-gray-400 text-lg uppercase font-bold tracking-widest mt-4">
                            Waiting For Candidate Result Presentation...
                        </p>
                    </div>
                </div>
            ) : (
                /* Active Result Presentation View */
                <div className="flex-1 flex flex-col justify-between py-1 overflow-hidden">
                    {/* Header: Candidate spotlight info */}
                    <div className="flex justify-between items-center border-b border-brand-mint/10 pb-3 mb-2 animate-fade-in-up">
                        <div className="flex items-center gap-4">
                            {candidate.photo ? (
                                <img
                                    src={`http://localhost:5000/${candidate.photo}`}
                                    className="h-14 w-14 rounded-2xl object-cover border-2 border-brand-mint/40 shadow-md shadow-brand-mint/10"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            ) : (
                                <div className="h-14 w-14 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-black text-xl border border-brand-mint/20">
                                    {candidate.name?.charAt(0).toUpperCase() || 'A'}
                                </div>
                            )}
                            <div className="space-y-0.5">
                                <div className="flex items-center gap-3">
                                    <span className="bg-brand-gold/15 text-brand-gold border border-brand-gold/30 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider">
                                        {candidate.group === "Jr." ? "Junior" : candidate.group === "Middle" ? "Middle" : "Senior"} Group
                                    </span>
                                    <span className="text-brand-mint font-bold tracking-wide text-sm">
                                        Naat: "{candidate.naatTitle}"
                                    </span>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight font-display bg-gradient-to-r from-white via-slate-100 to-slate-300 text-transparent bg-clip-text">
                                    {candidate.name}
                                </h1>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Candidate ID</span>
                            <h3 className="text-2xl font-black font-display text-brand-gold/90 uppercase tracking-wider">{candidate.candidateRegId}</h3>
                        </div>
                    </div>

                    {/* Step 1: Countdown Spotlight */}
                    {step === 1 && (
                        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-16 py-6 overflow-hidden">
                            {/* Candidate Spotlight Card */}
                            <div className="relative animate-fade-in-up">
                                <div className="absolute inset-0 bg-brand-primary/10 rounded-[30px] blur-2xl animate-pulse"></div>
                                <div className="dark-glass-card border-brand-mint/25 rounded-[30px] p-6 relative z-10 flex flex-col items-center text-center space-y-4 shadow-[0_0_50px_-10px_rgba(52,211,153,0.15)]">
                                    {candidate.photo ? (
                                        <img
                                            src={`http://localhost:5000/${candidate.photo}`}
                                            className="w-48 h-48 rounded-2xl object-cover border-2 border-brand-mint/40 shadow-xl"
                                        />
                                    ) : (
                                        <div className="w-48 h-48 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-black text-6xl border border-brand-mint/20">
                                            {candidate.name?.charAt(0).toUpperCase() || 'A'}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-2xl font-black text-white leading-tight">{candidate.name}</h3>
                                        <p className="text-xs text-brand-mint font-bold uppercase tracking-wider mt-1">{candidate.candidateRegId}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Countdown Circular Timer */}
                            <div className="space-y-6 text-center animate-fade-in-up">
                                <h2 className="text-3xl font-black uppercase tracking-widest text-brand-mint animate-pulse">
                                    Preparing Results
                                </h2>
                                <div className="relative h-44 w-44 flex items-center justify-center mx-auto">
                                    <svg className="absolute top-0 left-0 w-full h-full transform -rotate-90">
                                        <circle cx="88" cy="88" r="80" stroke="rgba(52, 211, 153, 0.05)" strokeWidth="6" fill="transparent" />
                                        <circle cx="88" cy="88" r="80" stroke="#34d399" strokeWidth="6" fill="transparent"
                                            strokeDasharray="502"
                                            strokeDashoffset={(502 * (5 - countdown)) / 5}
                                            className="transition-all duration-1000 ease-linear"
                                        />
                                    </svg>
                                    <span className="text-7xl font-black font-display text-brand-gold drop-shadow-[0_0_15px_rgba(217,119,6,0.6)] animate-ping duration-1000">
                                        {countdown}
                                    </span>
                                </div>
                                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                    Revealing judges' scores shortly
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Step 2-5: Score Cards Display */}
                    {step >= 2 && (
                        <div className="flex-1 flex flex-col justify-center space-y-4 md:space-y-6 overflow-hidden py-1">
                            {/* Cards Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                                {[0, 1, 2].map((idx) => {
                                    const scoreEntry = candidate.scores?.[idx];
                                    const judgeName = scoreEntry?.judgeName || `Judge ${idx + 1}`;
                                    const isRevealed = step >= (idx + 2);

                                    return (
                                        <div
                                            key={idx}
                                            className={`dark-glass-card rounded-2xl p-4 md:p-5 border transition-all duration-1000 flex flex-col justify-between relative overflow-hidden ${isRevealed
                                                ? "opacity-100 scale-100 border-brand-mint/35 shadow-[0_0_25px_-5px_rgba(52,211,153,0.15)]"
                                                : "opacity-15 scale-95 border-white/5"
                                                }`}
                                        >
                                            {/* Glowing border glow reflection */}
                                            {isRevealed && (
                                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-brand-mint/50 to-transparent"></div>
                                            )}

                                            <div>
                                                <div className="flex justify-between items-center mb-3">
                                                    <span className="text-[10px] uppercase font-black text-gray-400 tracking-widest">
                                                        Evaluation Card
                                                    </span>
                                                    <span className={`px-2.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isRevealed ? "bg-brand-mint/10 text-brand-mint border border-brand-mint/20" : "bg-white/5 text-gray-400"
                                                        }`}>
                                                        {isRevealed ? "REVEALED" : "LOCKED"}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-black text-white tracking-tight mb-4 truncate">
                                                    {judgeName}
                                                </h3>

                                                {/* Score Breakdowns */}
                                                <div className="space-y-2 font-semibold text-xs md:text-sm text-gray-300">
                                                    {SCORING_CATEGORIES.map((cat) => {
                                                        const val = scoreEntry?.[cat.key] || 0;
                                                        return (
                                                            <div key={cat.key} className="flex justify-between items-center border-b border-white/5 pb-1">
                                                                <span className="text-gray-400">{cat.label}</span>
                                                                <span className="font-black text-white text-sm">
                                                                    {isRevealed ? <CountUp value={val} duration={500} /> : "--"}
                                                                    <span className="text-[9px] text-gray-500 font-bold ml-0.5">/10</span>
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Total Per Judge */}
                                            <div className="border-t border-white/5 pt-3 mt-3 flex justify-between items-center">
                                                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Total Marks</span>
                                                <span className="text-3xl font-black font-display text-brand-gold">
                                                    {isRevealed ? <CountUp value={scoreEntry?.totalScore || 0} duration={800} /> : "--"}
                                                    <span className="text-xs text-gray-500 font-bold ml-1">/50</span>
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Grand Total Area (Revealed at step 5) */}
                            <div className="flex justify-center mt-2 md:mt-4">
                                <div
                                    className={`relative transition-all duration-1000 transform ${step === 5
                                        ? "opacity-100 translate-y-0 scale-100"
                                        : "opacity-0 translate-y-10 scale-90 pointer-events-none"
                                        }`}
                                >
                                    {/* Giant Glowing Aura */}
                                    <div className="absolute inset-0 bg-brand-gold/15 rounded-3xl blur-3xl animate-pulse"></div>

                                    {/* Grand Total Shield */}
                                    <div className="dark-glass-card border-brand-gold/45 rounded-3xl px-8 py-3 md:py-4 text-center relative z-10 flex items-center gap-6 shadow-[0_0_60px_-10px_rgba(217,119,6,0.3)]">
                                        <div className="h-12 w-12 bg-brand-gold/10 text-brand-gold rounded-2xl flex items-center justify-center text-2xl border border-brand-gold/30 shadow-inner">
                                            <FiAward />
                                        </div>

                                        <div className="text-left space-y-0.5">
                                            <h4 className="text-[10px] font-black tracking-widest text-brand-gold uppercase">
                                                Final Result Leaderboard
                                            </h4>
                                            <h2 className="text-xl font-black text-white leading-none">
                                                Grand Total Score
                                            </h2>
                                        </div>

                                        <div className="text-4xl md:text-5xl font-black font-display bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 text-transparent bg-clip-text px-5 py-1 border-l border-white/10 pl-6">
                                            <CountUp value={getGrandTotal()} duration={1200} />
                                            <span className="text-sm text-brand-gold/60 font-bold ml-1">/150</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Footer / Standard branding */}
            <div className="border-t border-white/5 pt-2 text-center flex justify-between items-center text-xs text-gray-500 font-bold tracking-wide">
                <span>SYSTEM STATUS: ONLINE</span>
                <span className="uppercase">SDI IT CELL PRESENTATION ENGINE v2.0</span>
            </div>

            {/* Operator Overlay Toolbar (Floating at bottom, shows on hover/mouse move) */}
            <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-brand-dark/95 border border-brand-mint/20 px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl backdrop-blur-md opacity-0 hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 z-50">

                {/* Status Indicator */}
                <div className="flex items-center gap-2 border-r border-white/10 pr-4 text-xs font-bold text-gray-400">
                    <FiTv className="text-brand-mint text-sm" />
                    <span>LED Display Console</span>
                </div>

                {/* Flow Buttons */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handlePrev}
                        disabled={step <= 1}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Previous Step"
                    >
                        <FiChevronLeft className="text-lg" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(prev => !prev)}
                        className="p-2 rounded-lg bg-brand-primary text-white hover:bg-brand-mint transition cursor-pointer"
                        title={isPlaying ? "Pause Automation" : "Play Automation"}
                    >
                        {isPlaying ? <FiPause className="text-lg" /> : <FiPlay className="text-lg" />}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={step >= 5}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Next Step"
                    >
                        <FiChevronRight className="text-lg" />
                    </button>

                    <button
                        onClick={handleReset}
                        disabled={step === 0}
                        className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                        title="Reset Timeline"
                    >
                        <FiRotateCcw className="text-lg" />
                    </button>
                </div>

                {/* Speed Controls */}
                <div className="flex items-center gap-2 border-l border-white/10 pl-4 text-xs font-bold text-gray-400">
                    <span>Speed:</span>
                    {[1, 1.5, 2].map((s) => (
                        <button
                            key={s}
                            onClick={() => setSpeedMultiplier(s)}
                            className={`px-2 py-1 rounded cursor-pointer ${speedMultiplier === s ? "bg-brand-primary text-white" : "hover:bg-white/5 text-gray-400"
                                }`}
                        >
                            {s}x
                        </button>
                    ))}
                </div>

                {/* Close Button for Modal/Embedded View */}
                {isEmbedded && onClose && (
                    <button
                        onClick={onClose}
                        className="ml-2 px-4 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold tracking-wide transition cursor-pointer"
                    >
                        Exit Fullscreen
                    </button>
                )}
            </div>
        </div>
    );
}

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Stepper from "../components/Stepper";
import { getGroupAvailability } from "../api/config";

import Terms from "../components/steps/Terms";
import Personal from "../components/steps/Personal";
import Address from "../components/steps/Address";
import Details from "../components/steps/Details";
import Upload from "../components/steps/Upload";
import Payment from "../components/steps/Payment";
import Success from "../components/steps/Success";

import { submitRegistration } from "../store/slices/registrationSlice";

export default function Home() {
    const [step, setStep] = useState(0);
    const [form, setForm] = useState({});
    const [files, setFiles] = useState({});
    const [config, setConfig] = useState(null);
    const [configLoading, setConfigLoading] = useState(true);

    const dispatch = useDispatch();
    const { registrationData, loading, error } = useSelector((state) => state.registration);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await getGroupAvailability();
                if (res.success) {
                    setConfig(res);
                }
            } catch (err) {
                console.error("Failed to fetch registration config", err);
            } finally {
                setConfigLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const isRegistrationOpen = () => {
        if (!config || !config.globalConfig) return { open: false, message: "Unable to verify registration status." };

        return {
            open: config.globalConfig.isOpen,
            message: config.globalConfig.message
        };
    };

    const next = () => setStep((p) => p + 1);
    const prev = () => setStep((p) => p - 1);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFile = (name, file) => {
        setFiles((prev) => ({
            ...prev,
            [name]: file
        }));
    };

    const submit = async () => {
        try {
            await dispatch(submitRegistration({ form, files })).unwrap();
            next();
        } catch (err) {
            alert(err || "Something went wrong");
        }
    };

    if (configLoading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
                <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-red-100">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
                    <p className="text-gray-600 mb-8">We couldn't connect to the registration server. Please check your internet connection and refresh the page.</p>
                    <button onClick={() => window.location.reload()} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition">
                        Refresh Page
                    </button>
                </div>
            </div>
        );
    }

    const regStatus = isRegistrationOpen();

    if (!regStatus.open && step !== 6) {
        return (
            <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
                <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-gray-100 transform transition-all hover:scale-[1.01]">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Registration Status</h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">
                        {regStatus.message}
                    </p>

                    {(config?.globalConfig?.startDate || config?.globalConfig?.endDate) && (
                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 mb-8 text-left">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Scheduled Window</p>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Starts:</span>
                                    <span className="text-sm font-bold text-gray-800">
                                        {config.globalConfig.startDate ? new Date(config.globalConfig.startDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Always Open'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-500">Ends:</span>
                                    <span className="text-sm font-bold text-gray-800">
                                        {config.globalConfig.endDate ? new Date(config.globalConfig.endDate).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }) : 'Until Full'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        onClick={() => window.location.reload()}
                        className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Refresh Status
                    </button>

                    <div className="mt-6 flex flex-col gap-3">
                        <Link to="/check-status" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-all">Check Payment Status</Link>
                        <Link to="/check-round2" className="text-sm font-medium text-purple-600 hover:text-purple-800 hover:underline transition-all">Check Final Round Status</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4">
            
            <div className="w-full max-w-2xl flex justify-between items-center mb-6 px-4">
                <Link to="/check-status" className="px-4 py-2 bg-blue-100 text-blue-700 font-bold rounded-lg hover:bg-blue-200 transition">
                    Check Payment Status
                </Link>
                <Link to="/check-round2" className="px-4 py-2 bg-purple-100 text-purple-700 font-bold rounded-lg hover:bg-purple-200 transition">
                    Check Final Round
                </Link>
            </div>

            <div className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-2xl border border-gray-50">

                {/* Stepper */}
                <div className="mb-10">
                    <Stepper step={step} />
                </div>

                {/* Steps */}
                <div className="transition-all duration-500">
                    {step === 0 && <Terms next={next} />}
                    {step === 1 && <Personal form={form} handleChange={handleChange} next={next} prev={prev} />}
                    {step === 2 && <Address form={form} handleChange={handleChange} next={next} prev={prev} />}
                    {step === 3 && <Details form={form} handleChange={handleChange} next={next} prev={prev} />}
                    {step === 4 && <Upload files={files} handleFile={handleFile} next={next} prev={prev} />}
                    {step === 5 && <Payment form={form} files={files} handleChange={handleChange} handleFile={handleFile} submit={submit} prev={prev} loading={loading} />}
                    {step === 6 && <Success result={registrationData} />}
                </div>

            </div>
        </div>
    );
}
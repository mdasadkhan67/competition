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
import { FiCheckCircle, FiAlertCircle, FiRefreshCw } from "react-icons/fi";

export default function Registration() {
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
            <div className="min-h-[70vh] bg-gray-50 flex justify-center items-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-semibold text-sm tracking-wide">Verifying connection...</p>
                </div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="min-h-[70vh] bg-gray-50 flex justify-center items-center p-6">
                <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center border border-red-100 animate-fade-in-up">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FiAlertCircle className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Connection Error</h1>
                    <p className="text-gray-600 mb-8 font-medium">We couldn't connect to the registration server. Please check your network connection and refresh.</p>
                    <button onClick={() => window.location.reload()} className="w-full py-3.5 bg-brand-primary hover:bg-emerald-600 text-white rounded-xl font-bold transition-all shadow-md flex items-center justify-center gap-2">
                        <FiRefreshCw /> Retry Connection
                    </button>
                </div>
            </div>
        );
    }

    const regStatus = isRegistrationOpen();

    if (!regStatus.open && step !== 6) {
        return (
            <div className="min-h-[75vh] bg-gray-50 flex justify-center items-center p-6">
                <div className="bg-white shadow-xl rounded-3xl p-10 w-full max-w-lg text-center border border-gray-100 transition-all hover:scale-[1.01] animate-fade-in-up">
                    <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
                        <FiAlertCircle className="w-12 h-12 text-red-500" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Registration Closed</h1>
                    <p className="text-gray-600 text-lg mb-8 leading-relaxed font-medium">
                        {regStatus.message}
                    </p>

                    {(config?.globalConfig?.startDate || config?.globalConfig?.endDate) && (
                        <div className="bg-brand-light/20 rounded-2xl p-6 border border-brand-mint/20 mb-8 text-left">
                            <p className="text-xs font-bold text-brand-primary uppercase tracking-widest mb-3">Scheduled Window</p>
                            <div className="space-y-3 font-medium">
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
                        className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-brand-primary/20 active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                        <FiRefreshCw /> Refresh Status
                    </button>

                    <div className="mt-6 flex flex-col gap-3 font-semibold">
                        <Link to="/check-status" className="text-sm text-brand-primary hover:text-emerald-700 hover:underline transition-all">Check Payment Status</Link>
                        <Link to="/check-round2" className="text-sm text-brand-gold hover:text-amber-700 hover:underline transition-all">Check Final Round Status</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto flex justify-between items-center mb-8">
                <Link to="/check-status" className="px-4 py-2 bg-brand-light hover:bg-emerald-100 text-brand-primary font-bold rounded-xl text-sm transition-all border border-brand-mint/30 shadow-xs">
                    Check Payment Status
                </Link>
                <Link to="/check-round2" className="px-4 py-2 bg-amber-50 hover:bg-amber-100 text-brand-gold font-bold rounded-xl text-sm transition-all border border-brand-gold/30 shadow-xs">
                    Check Final Round
                </Link>
            </div>

            <div className="bg-white shadow-2xl rounded-3xl p-6 sm:p-10 max-w-2xl mx-auto border border-gray-100 animate-fade-in-up relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-dark via-brand-primary to-brand-gold-light"></div>
                
                {/* Stepper Header */}
                <div className="mb-10 mt-2">
                    <Stepper step={step} />
                </div>

                {/* Steps Content */}
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

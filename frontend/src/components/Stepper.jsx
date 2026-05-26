export default function Stepper({ step }) {
    const steps = [
        "Terms",
        "Personal",
        "Address",
        "Details",
        "Upload",
        "Payment",
        "Done"
    ];

    return (
        <div className="w-full mb-8 font-sans">

            {/* Line Background */}
            <div className="relative flex items-center justify-between">

                {/* Base Line */}
                <div className="absolute top-4 left-0 w-full h-1 bg-gray-200 rounded-full"></div>

                {/* Active Line */}
                <div
                    className="absolute top-4 left-0 h-1 bg-brand-primary transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{
                        width: `${(step / (steps.length - 1)) * 100}%`
                    }}
                ></div>

                {/* Steps */}
                {steps.map((label, index) => {
                    const isActive = index <= step;
                    const isCurrent = index === step;

                    return (
                        <div key={index} className="relative z-10 flex flex-col items-center flex-1">

                            {/* Circle */}
                            <div
                                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 border-2
                                ${isActive
                                        ? "bg-brand-primary border-brand-primary text-white shadow-md shadow-brand-primary/20"
                                        : "bg-gray-100 border-gray-200 text-gray-400"
                                    }
                                ${isCurrent ? "scale-110 ring-4 ring-brand-light/50 border-brand-mint" : ""}
                                `}
                            >
                                {index + 1}
                            </div>

                            {/* Label */}
                            <p
                                className={`text-[10px] sm:text-xs mt-2 text-center transition font-semibold tracking-wide
                                ${isActive
                                        ? "text-brand-primary font-bold"
                                        : "text-gray-400"
                                    }`}
                            >
                                {label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
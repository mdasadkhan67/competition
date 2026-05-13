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
        <div className="w-full mb-8">

            {/* Line Background */}
            <div className="relative flex items-center justify-between">

                {/* Base Line */}
                <div className="absolute top-4 left-0 w-full h-1 bg-gray-300"></div>

                {/* Active Line */}
                <div
                    className="absolute top-4 left-0 h-1 bg-blue-600 transition-all duration-300"
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
                                className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-semibold transition-all duration-300
                ${isActive
                                        ? "bg-blue-600 text-white shadow-md"
                                        : "bg-gray-300 text-gray-600"
                                    }
                ${isCurrent ? "scale-110" : ""}
                `}
                            >
                                {index + 1}
                            </div>

                            {/* Label */}
                            <p
                                className={`text-xs mt-2 text-center transition
                ${isActive
                                        ? "text-blue-600 font-semibold"
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
import { Calendar, Search, Sparkles, Users } from 'lucide-react';

const steps = [
    {
        number: 1,
        title: "Match Making",
        description: "Answer a few quick questions about your interests & personality.",
        icon: <span><Search size={35} /></span >
    },

    {
        number: 2,
        title: "Pick Meet Up",
        description: "ConnectX AI finds dinners, meetups, and events that fit your energy.",
        icon: <span className="text-5xl" ><Calendar size={35} /></span >
    },
    {
        number: 3,
        title: "Create Account",
        description: "See your results? Great. Register to reserve your spot.",
        icon: <span className="text-5xl" ><Users size={35} /> </span >
    },
    {
        number: 4,
        title: "Build Connections",
        description: "Show up to enjoy meaningful, authentic connections.",
        icon: <span className="text-5xl" ><Sparkles size={35} /></span >
    },
];

export default function HowItWorks() {
    return (
        <div className="py-16 md:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

                <h2 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-2">
                    How it works
                </h2>
                
                <p className="text-lg mb-16">
                    Four simple steps to expand your social circle
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
                    {steps.map((step) => (
                        <div key={step.number} className="flex flex-col items-center text-center">

                            <div className="relative mb-6 p-2">
                                <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-lg`}
                                    style={{ backgroundColor: 'var(--color-secondary)' }}>
                                    {step.icon}
                                </div>

                                <div className="absolute top-0 right-0 transform translate-Z-1 translate-y-1 w-7 h-7 bg-black rounded-full flex items-center justify-center">
                                    <span className="text-xs font-bold text-[var(--color-secondary)]">{step.number}</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-extrabold text-gray-800 mb-2">
                                {step.title}
                            </h3>

                            <p className="text-sm px-4">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
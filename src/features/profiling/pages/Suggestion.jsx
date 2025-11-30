import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useProfilling } from "../hooks/useProfiling";
import { useAuthStore } from "../../auth/stores/authStore";
import { buildProfilingPayload } from "../utils/payload";
import { Calendar, MapPin, X } from "lucide-react";
import { env } from "../../../core/config/env";
import { format } from "date-fns";
import { useAuth } from "../../../core/auth/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../auth/utils/validation";
import { useLogin } from "../../auth/hooks/useLogin";
import { LoginModal } from "../../auth/components/LoginModal";

function Loading({ isComplete }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (isComplete) {
            setProgress(100);
            return;
        }

        // Slow progress simulation
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 90) return prev; // Stall at 90% until complete
                // Random increment between 1 and 5
                const increment = Math.floor(Math.random() * 5) + 1;
                return Math.min(prev + increment, 90);
            });
        }, 800);

        return () => clearInterval(interval);
    }, [isComplete]);

    return (
        <div className="flex min-h-[300px] items-center justify-center flex-col w-full max-w-md mx-auto">
            <div className="w-full mb-8">
                {/* Brand ring animation */}
                <div className="relative mx-auto mb-8 h-20 w-20">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-yellow-300 to-orange-500 opacity-80 animate-spin" style={{ animationDuration: "2s" }}></div>
                    <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                        <span className="text-lg font-bold text-orange-500">{progress}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 transition-all duration-500 ease-out rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Status copy */}
                <div className="text-center space-y-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                        {progress === 100 ? "Matches Found!" : "Analyzing your profile..."}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {progress < 30 && "Reading your preferences..."}
                        {progress >= 30 && progress < 60 && "Searching for best events..."}
                        {progress >= 60 && progress < 90 && "Curating personalized list..."}
                        {progress >= 90 && progress < 100 && "Finalizing recommendations..."}
                        {progress === 100 && "Here are your top picks!"}
                    </p>
                </div>
            </div>
        </div>
    );
}

function EventCard({ slug, banner, title, placeName, category, city, datetime, onDetail }) {
    return (
        <div
            key={slug}
            className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden text-left flex flex-col"
        >
            <div className="relative h-48 w-full overflow-hidden">
                <img
                    src={env.VITE_API_BASE_URL + '/rooms/image/' + banner}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <span
                    className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full text-white bg-[var(--color-primary)]`}>
                    {category?.name}
                </span>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="flex-grow">
                    <h3 className="text-base font-bold text-gray-900 mb-3 min-h-[2.5rem] [display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden">
                        {title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-700 mb-1">
                        <span className="mr-2 text-sm"><Calendar size={15} /></span>
                        <span>{format(new Date(datetime), "dd MMMM yyyy, HH:mm")}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-700 mb-4">
                        <span className="mr-2 text-sm"><MapPin size={15} /></span>
                        <span>{placeName}, {city?.name}</span>
                    </div>
                </div>

                <button
                    onClick={() => onDetail?.(slug)}
                    className="w-full bg-primary text-white font-semibold py-2 rounded-full hover:bg-secondary cursor-pointer transition duration-300 mt-auto"
                >
                    Detail Event
                </button>
            </div>
        </div>
    );
}

export default function Suggestion() {
    const navigate = useNavigate();
    const { state } = useLocation();
    const { profileData } = state || {};
    const { mutateAsync: postProfiling, isPending } = useProfilling();
    const [error, setError] = useState(null);
    const [suggestedRooms, setSuggestedRooms] = useState([]);
    const { isAuthenticated, user } = useAuth();
    const submitted = useRef(false);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [isRetryPending, setRetryPending] = useState(false);

    // State to track if loading animation should still be shown (for 100% completion effect)
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        if (suggestedRooms.length > 0) {
            // Give a small delay to show 100% before hiding loading
            const timer = setTimeout(() => {
                setShowLoading(false);
            }, 800);
            return () => clearTimeout(timer);
        }
    }, [suggestedRooms]);

    useEffect(() => {
        if (submitted.current) return;

        if (!profileData && !isAuthenticated) {
            setError("Profile data not found");
            return;
        }
        submitted.current = true;
        submitProfile();
    }, [profileData]);

    // Retry submission after successful login
    useEffect(() => {
        if (isAuthenticated && isRetryPending) {
            setRetryPending(false);
            setShowLoginModal(false);
            submitProfile();
        }
    }, [isAuthenticated, isRetryPending]);

    const submitProfile = async () => {
        try {
            setError(null);
            const answersRaw = localStorage.getItem("profilingAnswers");
            const prefsRaw = localStorage.getItem("profilingPreferences");
            const meetUpRaw = localStorage.getItem("profilingMeetUpPref");
            const answers = answersRaw ? JSON.parse(answersRaw) : null;
            const preferences = prefsRaw ? JSON.parse(prefsRaw) : [];
            const meetUp = meetUpRaw ? JSON.parse(meetUpRaw) : "";

            if (!answers || !Array.isArray(answers)) {
                throw new Error("Jawaban quiz tidak lengkap.");
            }

            const payload = buildProfilingPayload({ ...profileData }, answers, user);
            payload.preferences = preferences;
            payload.meetUpPreference = meetUp;
            payload.isAuthenticated = isAuthenticated;

            const response = await postProfiling({ data: payload });

            if (response.data.requestLogin) {
                setShowLoginModal(true);
                setRetryPending(true);
                return;
            }
            if (response.data.id) {
                localStorage.setItem("uid", response.data.id);
            }
            setSuggestedRooms(response.data.rooms);

        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Failed to submit profiling data.";
            setError(message);
            setShowLoading(false); // Hide loading on error
        }
    };

    const goDashboard = () => {
        navigate("/home", { replace: true });
    };

    const handleDetail = (id) => {
        navigate(`/home/event/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">Top Recommendations for You</h1>
                    <p className="text-gray-600">Handpicked events tailored to your interests and preferences.</p>
                </div>

                {showLoading && !error && (
                    <Loading isComplete={!isPending && suggestedRooms.length > 0} />
                )}

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                {!showLoading && suggestedRooms.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        {suggestedRooms.map((c, idx) => (
                            <EventCard key={idx} {...c} onDetail={handleDetail} />
                        ))}
                        <div className="col-span-full flex justify-end">
                            <button onClick={goDashboard} className="mx-0 text-center rounded-full px-6 py-2.5 border border-primary text-primary cursor-pointer hover:bg-secondary hover:text-white transition duration-300">
                                Discover more events
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <LoginModal
                isOpen={showLoginModal}
                onClose={() => setShowLoginModal(false)}
            />
        </div>
    );
}
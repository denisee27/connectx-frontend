import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfilling } from "../hooks/useProfiling";
import { useAuthStore } from "../../auth/stores/authStore";
import { buildProfilingPayload } from "../utils/payload";
import { Calendar, MapPin } from "lucide-react";
import { env } from "../../../core/config/env";
import { format } from "date-fns";

function Loading() {
    return (
        <div className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
                {/* Brand ring animation */}
                <div className="relative mx-auto mb-5 h-14 w-14">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-orange-400 via-yellow-300 to-orange-500 opacity-80 animate-spin" style={{ animationDuration: "1.4s" }}></div>
                    <div className="absolute inset-2 rounded-full bg-white"></div>
                    {/* Pulsing dots */}
                    <div className="absolute inset-0 flex items-center justify-center gap-1">
                        <span className="h-2 w-2 rounded-full bg-orange-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                        <span className="h-2 w-2 rounded-full bg-orange-400 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                        <span className="h-2 w-2 rounded-full bg-yellow-400 animate-bounce" style={{ animationDelay: "300ms" }}></span>
                    </div>
                </div>
                {/* Status copy */}
                <p className="text-sm text-gray-700">Please wait, your personalization is being processed and will be generated shortly.</p>
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
    const { mutateAsync: postProfiling } = useProfilling();
    const setAuth = useAuthStore((state) => state.setAuth);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [suggestedRooms, setSuggestedRooms] = useState([]);
    const submitted = useRef(false);

    useEffect(() => {
        if (submitted.current) return;

        if (!profileData) {
            setError("Data profil tidak ditemukan. Silakan kembali ke halaman sebelumnya.");
            setLoading(false);
            return;
        }
        submitted.current = true;
        submitProfile();
    }, [profileData]);

    const submitProfile = async () => {
        try {
            const answersRaw = localStorage.getItem("profilingAnswers");
            const prefsRaw = localStorage.getItem("profilingPreferences");
            const meetUpRaw = localStorage.getItem("profilingMeetUpPref");
            const answers = answersRaw ? JSON.parse(answersRaw) : null;
            const preferences = prefsRaw ? JSON.parse(prefsRaw) : [];
            const meetUp = meetUpRaw ? JSON.parse(meetUpRaw) : "";

            if (!answers || !Array.isArray(answers)) {
                throw new Error("Jawaban quiz tidak lengkap.");
            }

            const payload = buildProfilingPayload({ ...profileData }, answers);
            payload.preferences = preferences;
            payload.meetUpPreference = meetUp;
            const response = await postProfiling({ data: payload });
            setSuggestedRooms(response.data.rooms);

        } catch (e) {
            const message = e?.response?.data?.message || e?.message || "Gagal mengirim data";
            setError(message);
        } finally {
            setLoading(false);
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
                    <h1 className="text-3xl font-semibold text-gray-900">Your Suggestions</h1>
                    <p className="text-gray-600">Curated events that match your preferences</p>
                </div>

                {loading && <Loading />}
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 mb-4">
                        {error}
                    </div>
                )}

                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6">
                        {suggestedRooms.map((c, idx) => (
                            <EventCard key={idx} {...c} onDetail={handleDetail} />
                        ))}
                    </div>
                )}

                {!loading && !error && (
                    <div className="mt-8 flex justify-end">
                        <button onClick={goDashboard} className="rounded-full px-6 py-2.5 border border-gray-300 text-gray-800 hover:bg-gray-100">
                            Other Event
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
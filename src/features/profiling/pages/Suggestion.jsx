import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useProfilling } from "../hooks/useProfiling";
import { useAuthStore } from "../../auth/stores/authStore";
import { buildProfilingPayload } from "../utils/payload";
import { resetProfilingAll } from "../utils/reset";

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

function EventCard({ slug, image, title, venue, category, city, dateText, onDetail }) {
    return (
        <article
            role="article"
            className="group overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md focus-within:ring-2 focus-within:ring-orange-500"
        >
            <div className="relative h-44 md:h-48 w-full overflow-hidden rounded-t-2xl">
                <img
                    src={image}
                    alt={title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                    decoding="async"
                />
            </div>
            <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h3>
                <p className="mt-1 text-sm text-gray-600">{venue}</p>
                <p className="mt-3 text-sm text-gray-700">
                    <span className="font-medium text-gray-800">{category?.name}</span>
                    <span className="mx-2 text-gray-400">•</span>
                    <span className="text-gray-700">{city?.name}</span>
                </p>
                <p className="mt-3 text-base font-medium text-gray-900">{dateText}</p>
                <button
                    type="button"
                    aria-label={`Lihat detail untuk ${title}`}
                    onClick={() => onDetail?.(slug)}
                    className="mt-4 w-full rounded-full bg-primary text-white py-2.5 font-semibold tracking-wide transition-colors duration-150 hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                >
                    Detail Event
                </button>
            </div>
        </article>
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

    useEffect(() => {
        if (!profileData) {
            setError("Data profil tidak ditemukan. Silakan kembali ke halaman sebelumnya.");
            setLoading(false);
            return;
        }

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

                // const today = new Date();
                // const birthDate = new Date(profileData.bornDate);
                // let age = today.getFullYear() - birthDate.getFullYear();
                // const m = today.getMonth() - birthDate.getMonth();
                // if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                //     age--;
                // }

                const payload = buildProfilingPayload({ ...profileData }, answers);
                payload.preferences = preferences;
                payload.meetUpPreference = meetUp;

                const response = await postProfiling({ data: payload });
                console.log('res:', response)
                console.log('response.accessToken', response.data.accessToken)
                setAuth({ user: null, accessToken: response.data.accessToken });
                setSuggestedRooms(response.data.rooms);

                resetProfilingAll(() => { });
            } catch (e) {
                const message = e?.response?.data?.message || e?.message || "Gagal mengirim data";
                setError(message);
            } finally {
                setLoading(false);
            }
        };

        submitProfile();
    }, []);

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
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useModal } from "../../../core/stores/uiStore";
import { TriangleAlert } from "lucide-react";

const TOPICS = [
    "Career & Networking",
    "Women Empowerment",
    "Healing & Self-Development",
    "Motherhood",
    "Tech & Startup",
    "Finance & Investment",
    "Social Hangout",
    "Book / Coffee Meetup",
    "Wellness & Fitness",
];

const MEET_UP = ["Intimate", "Small group", "Open event"];

export default function Preference() {
    const navigate = useNavigate();
    const refreshModal = useModal("profilingRefreshConfirm");
    const [selected, setSelected] = useState(() => {
        try {
            const raw = localStorage.getItem("profilingPreferences");
            return raw ? JSON.parse(raw) : [];
        } catch (_) {
            return [];
        }
    });
    const [meetUp, setMeetUp] = useState(() => {
        try {
            const raw = localStorage.getItem("profilingMeetUpPref");
            return raw ? JSON.parse(raw) : "";
        } catch (_) {
            return "";
        }
    });
    const [error, setError] = useState(null);

    // Determine previous label based on last known question index
    const currentIndex = useMemo(() => {
        try {
            const v = localStorage.getItem("profilingCurrentIndex");
            const n = v != null ? Number(v) : null;
            return Number.isFinite(n) ? n : null;
        } catch (_) {
            return null;
        }
    }, []);
    const isFirstQuestion = currentIndex === 0;

    const canContinue = useMemo(() => {
        return selected.length >= 3 && selected.length <= 5 && Boolean(meetUp);
    }, [selected, meetUp]);

    const toggleTopic = (t) => {
        setSelected((prev) => {
            const exists = prev.includes(t);
            let next = exists ? prev.filter((x) => x !== t) : [...prev, t];
            if (next.length > 5) {
                // prevent adding more than 5
                return prev;
            }
            return next;
        });
    };

    const continueNext = () => {
        setError(null);
        if (selected.length < 3) {
            setError("Please select at least 3 preferences.");
            return;
        }
        if (selected.length > 5) {
            setError("You can select a maximum of 5 preferences.");
            return;
        }
        if (!meetUp) {
            setError("Please choose your meet up preference.");
            return;
        }
        try {
            localStorage.setItem("profilingPreferences", JSON.stringify(selected));
            localStorage.setItem("profilingMeetUpPref", JSON.stringify(meetUp));
        } catch (_) { }
        navigate("/profiling/form");
    };


    // Alert sebelum refresh dan tandai reload terkonfirmasi
    useEffect(() => {
        const onBeforeUnload = (e) => {
            const message = "Perubahan Anda belum disimpan. Apakah Anda yakin ingin memuat ulang halaman?";
            e.preventDefault();
            e.returnValue = message;
            return message;
        };
        const onPageHide = () => {
            try {
                sessionStorage.setItem("profilingReloadConfirmed", "1");
                sessionStorage.setItem("profilingReloadOrigin", "preference");
            } catch (_) { }
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("pagehide", onPageHide);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("pagehide", onPageHide);
        };
    }, []);

    // Saat reload terkonfirmasi, reset input dan kembali ke questioner
    useEffect(() => {
        try {
            const navigationEntries = performance.getEntriesByType?.("navigation") || [];
            const navType = navigationEntries[0]?.type || "navigate";
            const confirmed = sessionStorage.getItem("profilingReloadConfirmed") === "1";
            const origin = sessionStorage.getItem("profilingReloadOrigin");
            if (navType === "reload" && confirmed) {
                // Reset state lokal
                setSelected([]);
                setMeetUp("");
                try {
                    localStorage.removeItem("profilingPreferences");
                    localStorage.removeItem("profilingMeetUpPref");
                    localStorage.removeItem("profilingAnswers");
                    localStorage.removeItem("profilingCurrentIndex");
                } catch (_) { }
                try {
                    sessionStorage.removeItem("profilingReloadConfirmed");
                    sessionStorage.removeItem("profilingReloadOrigin");
                } catch (_) { }
                // Redirect ke questioner
                try {
                    navigate("/profiling/questioner", { replace: true });
                } catch (err) {
                    console.error("Navigasi gagal setelah reload:", err);
                }
            }
        } catch (err) {
            console.error("Reset saat reload gagal:", err);
        }
    }, [navigate]);

    const confirmYes = () => {
        refreshModal.close();
        // Reset local state inputs on this page
        setSelected([]);
        setMeetUp("");
        try {
            localStorage.removeItem("profilingPreferences");
            localStorage.removeItem("profilingMeetUpPref");
        } catch (_) { }
        navigate("/profiling/questioner", { replace: true });
    };

    const confirmNo = () => refreshModal.close();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-3xl bg-white shadow-md rounded-2xl p-8">
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-semibold text-gray-900">Your Preferences</h1>
                    <p className="text-gray-600">Pick the topics that best match your energy</p>
                    <p className="text-sm text-gray-500 mt-1">Select a minimum of 3 and a maximum of 5</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {TOPICS.map((t) => {
                        const active = selected.includes(t);
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => toggleTopic(t)}
                                className={`text-left px-4 py-3 rounded-xl border transition ${active ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 hover:border-gray-300"}`}
                            >
                                <span className="text-sm">{t}</span>
                            </button>
                        );
                    })}
                </div>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prefer meet up</label>
                    <div className="flex flex-wrap gap-3">
                        {MEET_UP.map((m) => {
                            const active = meetUp === m;
                            return (
                                <button
                                    key={m}
                                    type="button"
                                    onClick={() => setMeetUp(m)}
                                    className={`px-4 py-2 rounded-full border text-sm transition ${active ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 hover:border-gray-300"
                                        }`}
                                >
                                    {m}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

                <div className="mt-6 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={continueNext}
                        disabled={!canContinue}
                        className="rounded-full px-6 py-2.5 bg-orange-500 text-white font-semibold disabled:opacity-50"
                    >
                        Continue
                    </button>
                </div>

                {refreshModal.isOpen && (
                    <div>
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" aria-hidden="true" />
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <div
                                className="relative w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl"
                                role="dialog"
                                aria-modal="true"
                                aria-labelledby="profiling-refresh-title"
                            >
                                <div className="bg-gradient-to-br from-orange-50 to-yellow-50 px-6 pt-8 pb-6 text-center">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                                        <svg className="h-8 w-8 text-orange-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <TriangleAlert />
                                        </svg>
                                    </div>
                                </div>
                                <div className="px-6 py-6">
                                    <h3 id="profiling-refresh-title" className="text-center text-lg font-semibold text-gray-900 mb-3">
                                        Konfirmasi Refresh
                                    </h3>
                                    <p className="text-center text-sm text-gray-600">
                                        Apakah Anda yakin ingin memulai ulang? Semua jawaban akan direset.
                                    </p>
                                    <div className="mt-6 flex items-center justify-center gap-3">
                                        <button
                                            id="profiling-refresh-yes-btn"
                                            onClick={confirmYes}
                                            className="rounded-full px-5 py-2.5 bg-orange-500 text-white font-semibold hover:bg-orange-600"
                                        >
                                            Yes
                                        </button>
                                        <button
                                            onClick={confirmNo}
                                            className="rounded-full px-5 py-2.5 border border-gray-300 bg-white text-gray-700"
                                        >
                                            No
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
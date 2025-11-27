import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
// Submission now happens in FormProfile per revised flow
import { useModal } from "../../../core/stores/uiStore";
import { Loader2, TriangleAlert } from "lucide-react";
import { useQuestions } from "../hooks/useProfiling";

/**
 * Questioner type rendering and validation rules
 * - number: renders 1–10 boxes, stores integer 1..10
 * - scale: renders Likert (Sangat Setuju..Tidak Setuju), stores integer 5..1
 * Tipe "single" telah dihapus. Untuk menambah tipe baru: definisikan UI dan validasi.
 */

const LIKERT = [
    { label: "Strongly Agree", value: "Strongly Agree" },       // Sangat Setuju
    { label: "Agree", value: "Agree" },                         // Setuju
    { label: "Neutral", value: "Neutral" },                     // Netral
    { label: "Disagree", value: "Disagree" },                   // Kurang Setuju
    { label: "Strongly Disagree", value: "Strongly Disagree" }, // Tidak Setuju
];

function ProgressBar({ current, total }) {
    const percent = useMemo(() => Math.round((current / total) * 100), [current, total]);
    return (
        <div className="w-full h-2 bg-orange-100 rounded-full">
            <div
                className="h-2 rounded-full bg-gradient-to-r from-orange-300 via-yellow-300 to-orange-500 transition-all"
                style={{ width: `${percent}%` }}
            />
        </div>
    );
}

export default function Questioner() {
    const navigate = useNavigate();
    const { data: questionsData, isPending: isPendingQuestions, error: questionsError } = useQuestions();
    console.log('123', questionsData)
    const questions = useMemo(() => questionsData?.data?.mbti_questions || [], [questionsData]);

    const total = questions.length;
    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const refreshModal = useModal("profilingRefreshConfirm");
    const q = questions[index];

    useEffect(() => {
        if (total > 0) {
            setAnswers(Array(total).fill(null));
        }
    }, [total]);

    const selectOption = (answer) => {
        setAnswers((prev) => {
            const next = [...prev];
            next[index] = {
                id: q.id,
                type: q.type,
                category: q.category,
                statement: q.question, // Use q.question instead of q.text
                answer,
            };
            try {
                localStorage.setItem("profilingAnswers", JSON.stringify(next));
            } catch (_) { }
            return next;
        });
    };

    const selectNumber = (value) => {
        // Store as string
        selectOption(String(value));
    };

    const selectScale = (value) => {
        // value is already a string from the radio button
        selectOption(value);
    };

    const next = () => setIndex((i) => Math.min(i + 1, total - 1));
    const prev = () => setIndex((i) => Math.max(i - 1, 0));

    const isValidAnswer = () => {
        if (!q) return false; // Add guard for when q is not yet available
        const a = answers[index]?.answer;
        if (q.type === "number") {
            if (typeof a !== 'string') return false;
            const num = Number(a);
            return Number.isInteger(num) && num >= 1 && num <= 10;
        }
        if (q.type === "scale") {
            return typeof a === 'string' && LIKERT.some(opt => opt.value === a);
        }
        return false;
    };
    const canNext = isValidAnswer();
    const isLast = index === total - 1;
    const isFirst = index === 0;

    const handleSubmit = () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const answered = (answers || []).filter(Boolean);
            if (answered.length !== total) { // Use total instead of QUESTIONS.length
                throw new Error("Mohon jawab semua pertanyaan dulu.");
            }
            localStorage.setItem("profilingAnswers", JSON.stringify(answered));
            try { localStorage.setItem("profilingCurrentIndex", String(index)); } catch (_) { }
            setSuccess(true);
            navigate("/profiling/preference");
        } catch (e) {
            const message = e?.message || "Terjadi kesalahan saat menyimpan jawaban";
            setError(message);
        } finally {
            setLoading(false);
        }
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
                sessionStorage.setItem("profilingReloadOrigin", "questioner");
            } catch (_) { }
        };
        window.addEventListener("beforeunload", onBeforeUnload);
        window.addEventListener("pagehide", onPageHide);
        return () => {
            window.removeEventListener("beforeunload", onBeforeUnload);
            window.removeEventListener("pagehide", onPageHide);
        };
    }, []);

    useEffect(() => {
        const navigationEntries = performance.getEntriesByType?.("navigation") || [];
        const navType = navigationEntries[0]?.type || "navigate";
        const isReload = navType === "reload";
        // Also treat explicit reset navigation from FormProfile as a hard reset
        const fromFormReset = sessionStorage.getItem("profilingSkipRefreshModal") === "1";
        const fromPreference = sessionStorage.getItem("profilingReturn") === "1";
        const reloadConfirmed = sessionStorage.getItem("profilingReloadConfirmed") === "1";
        if (isReload || fromFormReset) {
            setAnswers(Array(total).fill(null));
            setIndex(0);
            try {
                localStorage.removeItem("profilingProfile");
                localStorage.removeItem("profilingAnswers");
                localStorage.removeItem("profilingCurrentIndex");
                if (fromFormReset) sessionStorage.removeItem("profilingSkipRefreshModal");
                if (reloadConfirmed) {
                    sessionStorage.removeItem("profilingReloadConfirmed");
                    sessionStorage.removeItem("profilingReloadOrigin");
                }
            } catch (_) { }
        } else if (fromPreference) {
            try {
                const idxRaw = localStorage.getItem("profilingCurrentIndex");
                const idx = idxRaw != null ? Number(idxRaw) : 0;
                const safeIdx = Number.isFinite(idx) ? Math.max(0, Math.min(idx, total - 1)) : 0;
                setIndex(safeIdx);
                const saved = localStorage.getItem("profilingAnswers");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length === total) {
                        setAnswers(parsed);
                    }
                }
            } catch (_) {
                setIndex(0);
            }
            try { sessionStorage.removeItem("profilingReturn"); } catch (_) { }
        } else {
            // Fresh mount: hydrate from storage if available
            try {
                const saved = localStorage.getItem("profilingAnswers");
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (Array.isArray(parsed) && parsed.length === total) {
                        setAnswers(parsed);
                    }
                }
                const idxRaw = localStorage.getItem("profilingCurrentIndex");
                const idx = idxRaw != null ? Number(idxRaw) : null;
                if (Number.isFinite(idx)) {
                    setIndex(Math.max(0, Math.min(idx, total - 1)));
                }
            } catch (_) { }
        }
    }, [total]);

    // Persist current index whenever it changes
    useEffect(() => {
        try { localStorage.setItem("profilingCurrentIndex", String(index)); } catch (_) { }
    }, [index]);

    const handleConfirmRefreshYes = () => {
        // Ketika user klik "Iya", kembali ke pertanyaan pertama dengan aman
        try {
            refreshModal.close();
            // Pastikan state jawaban tetap ada; jika tidak ada, coba rehidrasi dari storage
            setAnswers((prev) => {
                if (!Array.isArray(prev) || prev.length !== total) {
                    try {
                        const saved = localStorage.getItem("profilingAnswers");
                        if (saved) {
                            const parsed = JSON.parse(saved);
                            if (Array.isArray(parsed) && parsed.length === total) return parsed;
                        }
                    } catch (_) { }
                    return Array(total).fill(null);
                }
                return prev;
            });
            setIndex(0);
            try { localStorage.setItem("profilingCurrentIndex", "0"); } catch (_) { }
        } catch (err) {
            // Error handling: gagal reset index/state
            setError("Gagal kembali ke pertanyaan pertama. Silakan coba lagi.");
            try { navigate("/profiling/questioner", { replace: true }); } catch (_) { }
        }
    };

    const handleConfirmRefreshNo = () => {
        // Do nothing; keep the current page/state
        refreshModal.close();
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
            <div className="w-full max-w-2xl bg-white shadow-md rounded-2xl p-8">
                {isPendingQuestions ? (
                    <div className="flex flex-col items-center justify-center py-10">
                        {/* Icon Spinner */}
                        <Loader2 className="h-10 w-10 animate-spin text-blue-600 mb-4" />

                        {/* Text dengan animasi pulse halus */}
                        <p className="text-gray-500 text-sm font-medium animate-pulse">
                            Sedang menyiapkan pertanyaan...
                        </p>
                    </div>
                ) : questionsError ? (
                    <div className="text-center">
                        <p className="text-red-600">Failed to load questions: {questionsError.message}</p>
                    </div>
                ) : !q ? (
                    <div className="text-center">
                        <p className="text-gray-600">No questions available.</p>
                    </div>
                ) : (
                    <>
                        <div className="text-center mb-6">
                            <h1 className="text-3xl font-semibold text-gray-900">Personality Quiz</h1>
                            <p className="text-gray-500">Help us understand you better for perfect matches</p>
                        </div>

                        <div className="mb-4">
                            <ProgressBar current={index + 1} total={total} />
                        </div>
                        <p className="text-center text-sm text-gray-600 mb-6">Question {index + 1} of {total}</p>

                        <div className="rounded-2xl border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">{q.question}</h2>
                            {q.type === "number" && (
                                <div className="flex flex-col gap-3">
                                    <div className="text-xs text-gray-500 px-1">
                                        <span>Does not describe me</span>
                                    </div>
                                    <div className="flex justify-between">
                                        {Array.from({ length: 5 }, (_, i) => i + 1).map((n) => {
                                            const selected = answers[index]?.answer === String(n);
                                            return (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => selectNumber(n)}
                                                    aria-pressed={selected}
                                                    className={
                                                        "flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-lg border text-base sm:text-lg font-semibold transition " +
                                                        (selected
                                                            ? "border-orange-500 bg-orange-50 text-orange-600"
                                                            : "border-gray-200 bg-white text-gray-800 hover:border-orange-300")
                                                    }
                                                >
                                                    {n}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-between">
                                        {Array.from({ length: 5 }, (_, i) => i + 6).map((n) => {
                                            const selected = answers[index]?.answer === String(n);
                                            return (
                                                <button
                                                    key={n}
                                                    type="button"
                                                    onClick={() => selectNumber(n)}
                                                    aria-pressed={selected}
                                                    className={
                                                        "flex items-center justify-center h-12 w-12 sm:h-14 sm:w-14 rounded-lg border text-base sm:text-lg font-semibold transition " +
                                                        (selected
                                                            ? "border-orange-500 bg-orange-50 text-orange-600"
                                                            : "border-gray-200 bg-white text-gray-800 hover:border-orange-300")
                                                    }
                                                >
                                                    {n}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="text-xs text-gray-500 px-1 text-right">
                                        <span>Describes me perfectly</span>
                                    </div>
                                </div>
                            )}

                            {q.type === "scale" && (
                                <ul className="space-y-3">
                                    {LIKERT.map((opt) => {
                                        const selected = answers[index]?.answer === opt.value;
                                        return (
                                            <li key={opt.label}>
                                                <label className={"flex items-center gap-3 px-4 py-3 rounded-xl border transition " + (selected ? "border-orange-400 bg-orange-50" : "border-gray-200 hover:border-orange-300 hover:bg-orange-50")}>
                                                    <input
                                                        type="radio"
                                                        name={`likert-${q.id}`}
                                                        value={opt.value}
                                                        checked={selected}
                                                        onChange={(e) => selectScale(e.target.value)}
                                                        className="h-5 w-5 text-orange-500"
                                                    />
                                                    <span className="text-gray-800">{opt.label}</span>
                                                </label>
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}

                            {q.type !== "number" && q.type !== "scale" && (
                                <p className="text-sm text-red-600">Tipe pertanyaan tidak dikenali.</p>
                            )}
                        </div>
                        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
                        {success && <p className="mt-4 text-sm text-green-600">Berhasil dikirim!</p>}

                        <div className="mt-6 flex items-center justify-between">
                            <button
                                type="button"
                                onClick={() => (isFirst ? navigate("/") : prev())}
                                disabled={loading}
                                className="rounded-full px-5 py-2.5 border border-gray-300 text-gray-700 bg-white disabled:opacity-50"
                            >
                                {isFirst ? "Back to Home" : "Previous"}
                            </button>
                            {!isLast ? (
                                <button
                                    type="button"
                                    onClick={next}
                                    disabled={!canNext || loading}
                                    className="rounded-full px-6 py-2.5 bg-orange-500 text-white font-semibold disabled:opacity-50"
                                >
                                    Next
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={!canNext || loading}
                                    className="rounded-full px-6 py-2.5 bg-orange-500 text-white font-semibold disabled:opacity-50"
                                >
                                    {loading ? "Next Step..." : "Continue"}
                                </button>
                            )}
                        </div>
                    </>
                )}

                {/* Refresh Confirmation Modal */}
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
                                            onClick={handleConfirmRefreshYes}
                                            className="rounded-full px-5 py-2.5 bg-orange-500 text-white font-semibold hover:bg-orange-600"
                                        >
                                            Iya
                                        </button>
                                        <button
                                            onClick={handleConfirmRefreshNo}
                                            className="rounded-full px-5 py-2.5 border border-gray-300 bg-white text-gray-700"
                                        >
                                            Tidak
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
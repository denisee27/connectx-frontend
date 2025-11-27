import React, { useEffect, useMemo, useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { useGetSessionChat, useSendMessage } from "../hooks/useNewEvent";
import Markdown from "react-markdown";
import { SyncLoader } from "react-spinners";

const LoadingIndicator = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md transition-all">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl animate-in fade-in zoom-in duration-300">

            {/* Spinner Baru: Double Ring dengan Warna AI */}
            <div className="relative h-16 w-16">
                <div className="absolute h-full w-full rounded-full border-4 border-indigo-100 opacity-50"></div>
                <div className="absolute h-full w-full rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
            </div>

            {/* Text Section */}
            <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-gray-800 tracking-tight">
                    Initializing ConnectX AI...
                </h3>
                <p className="text-sm text-gray-500 font-medium animate-pulse">
                    Calibrating your personal session
                </p>
            </div>
        </div>
    </div>
);

/**
 * NewEvent Page
 * Alur: Intro greeting → Chat conversation + CTA → Form Acara
 * - Responsif, konsisten dengan theme (bg-card, border-border, accent/primary)
 * - Animasi ringan pada bubble dan transisi antar tahap
 * - Validasi dasar form
 */
export const NewEvent = () => {
    const { mutateAsync: startSession, isPending: isPendingSession } = useGetSessionChat();
    const { mutateAsync: sendMessage } = useSendMessage();
    const [step, setStep] = useState("intro"); // intro | chat | form
    const [sessionId, setSessionId] = useState(null);

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi there! Tell me what kind of event you have in mind. I'm here to help you plan a truly memorable experience! ✨",
        },
    ]);
    const [input, setInput] = useState("");

    // Form state
    const [form, setForm] = useState({
        title: "",
        datetime: "",
        locationDetail: "",
        mapsUrl: "",
        type: "",
    });
    const [errors, setErrors] = useState({});
    const [submitState, setSubmitState] = useState("idle"); // idle | success | error

    const typeOptions = useMemo(
        () => [
            { key: "event", label: "Event", desc: "Tidak ada batas peserta" },
            { key: "meetup", label: "Meetup", desc: "Maksimal 10 peserta" },
            {
                key: "dinner",
                label: "Dinner",
                desc: "Acara makan bersama intim (max 4 orang)",
            },
        ],
        []
    );

    useEffect(() => {
        getSessionId();
    }, []);

    const getSessionId = async () => {
        const id = await startSession();
        setSessionId(id?.data?.sessionId);
    }

    const handleSend = async () => {
        const data = input.trim();
        if (!data) return;
        setInput("");
        const userMsg = { role: "user", text: data, };
        setMessages((prev) => [...prev, userMsg, { role: "loading", text: '' }]);
        const restMsg = await sendMessage({ data, sessionId });
        console.log('restMsg', restMsg);
        setMessages((prevMessages) => prevMessages.slice(0, -1));
        const assistantMsg = { role: "assistant", text: restMsg?.data?.plainText, };
        setMessages((prev) => [...prev, assistantMsg]);
        // setStep("chat");
    };

    const validateForm = () => {
        const nextErrors = {};
        if (!form.title || form.title.trim().length < 3) {
            nextErrors.title = "Judul acara minimal 3 karakter";
        }
        if (!form.datetime) {
            nextErrors.datetime = "Tanggal & waktu wajib diisi";
        }
        if (!form.locationDetail || form.locationDetail.trim().length < 10) {
            nextErrors.locationDetail = "Tuliskan detail lokasi yang cukup jelas";
        }
        if (!form.mapsUrl) {
            nextErrors.mapsUrl = "Link Google Maps wajib diisi";
        } else {
            try {
                const url = new URL(form.mapsUrl);
                if (!/(maps|goo\.gl)/.test(url.hostname + url.pathname)) {
                    nextErrors.mapsUrl = "Mohon masukkan link Google Maps yang valid";
                }
            } catch (e) {
                nextErrors.mapsUrl = "Format URL tidak valid";
            }
        }
        if (!form.type) {
            nextErrors.type = "Pilih tipe acara";
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitState("idle");
        if (!validateForm()) {
            setSubmitState("error");
            return;
        }
        // Simulasi submit
        setSubmitState("success");
    };

    if (isPendingSession || !sessionId) {
        return <LoadingIndicator />;
    }

    return (
        <div className="min-h-screen mx-auto max-w-3xl bg-white px-4 sm:px-6 text-foreground">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 grid place-items-center rounded-full bg-accent text-black shadow-sm">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Craft Your Experience</h1>
                    <p className="text-sm text-muted-foreground">
                        From a simple spark of an idea to a perfect plan.
                    </p>
                </div>
            </div>

            {/* Conversation Area */}
            <div className="mt-6 space-y-4">
                {messages.map((m, idx) => (
                    <ChatBubble key={idx} role={m.role} text={m.text} />
                ))}

                {/* CTA hanya di tahap chat */}
                {step === "chat" && (
                    <div className="mt-2">
                        <button
                            type="button"
                            onClick={() => setStep("form")}
                            className="mx-auto block rounded-full bg-accent px-5 py-2 font-semibold text-black shadow-sm transition-colors hover:bg-primary"
                        >
                            Create Event
                        </button>
                    </div>
                )}
            </div>

            {/* Input Bar: tampil di intro & chat */}
            {step !== "form" && (
                <div className="fixed left-0 right-0 bottom-6">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="flex items-center gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSend();
                                }}
                                placeholder="Tell me about the event you'd like to create..."
                                className="flex-1 bg-transparent px-3 py-2 text-sm sm:text-base focus:outline-none"
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                className="hover:cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent text-black shadow-sm transition-colors hover:bg-primary"
                                aria-label="Kirim"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Form Card: tampil setelah klik Buat Acara */}
            {step === "form" && (
                <div className="mt-6">
                    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                        <h2 className="text-xl font-semibold">Detail Acara</h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Lengkapi informasi berikut agar acara kamu siap dipublikasikan.
                        </p>

                        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                            {/* Title */}
                            <div>
                                <label className="text-sm font-medium">Title Event</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    placeholder="Contoh: Creative Workshop"
                                />
                                {errors.title && (
                                    <p className="mt-1 text-xs text-red-600">{errors.title}</p>
                                )}
                            </div>

                            {/* DateTime */}
                            <div>
                                <label className="text-sm font-medium">Date & Time</label>
                                <input
                                    type="datetime-local"
                                    value={form.datetime}
                                    onChange={(e) => setForm({ ...form, datetime: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                />
                                {errors.datetime && (
                                    <p className="mt-1 text-xs text-red-600">{errors.datetime}</p>
                                )}
                            </div>

                            {/* Location Detail */}
                            <div>
                                <label className="text-sm font-medium">Detail Lokasi</label>
                                <textarea
                                    rows={3}
                                    value={form.locationDetail}
                                    onChange={(e) =>
                                        setForm({ ...form, locationDetail: e.target.value })
                                    }
                                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    placeholder="Tulis alamat, patokan, atau catatan khusus lokasi"
                                />
                                {errors.locationDetail && (
                                    <p className="mt-1 text-xs text-red-600">{errors.locationDetail}</p>
                                )}
                            </div>

                            {/* Maps URL */}
                            <div>
                                <label className="text-sm font-medium">Google Maps Link</label>
                                <input
                                    type="url"
                                    value={form.mapsUrl}
                                    onChange={(e) => setForm({ ...form, mapsUrl: e.target.value })}
                                    className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    placeholder="https://maps.google.com/..."
                                />
                                {errors.mapsUrl && (
                                    <p className="mt-1 text-xs text-red-600">{errors.mapsUrl}</p>
                                )}
                            </div>

                            {/* Type */}
                            <div>
                                <label className="text-sm font-medium">Type Event</label>
                                <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    {typeOptions.map((opt) => (
                                        <label
                                            key={opt.key}
                                            className={
                                                "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-white p-3 shadow-sm transition hover:border-primary"
                                            }
                                        >
                                            <input
                                                type="radio"
                                                name="type"
                                                value={opt.key}
                                                checked={form.type === opt.key}
                                                onChange={(e) =>
                                                    setForm({ ...form, type: e.target.value })
                                                }
                                                className="mt-1"
                                            />
                                            <div>
                                                <p className="text-sm font-semibold">{opt.label}</p>
                                                <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                {errors.type && (
                                    <p className="mt-1 text-xs text-red-600">{errors.type}</p>
                                )}
                            </div>

                            {/* Submit */}
                            <div className="pt-2 flex items-center justify-between">
                                <p className="text-xs text-muted-foreground">
                                    Pastikan informasi yang diisi akurat dan jelas.
                                </p>
                                <button
                                    type="submit"
                                    className="hover:cursor-pointer rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-foreground"
                                >
                                    Buat Event
                                </button>
                            </div>
                            {submitState === "success" && (
                                <p className="text-xs text-green-700">Berhasil menyimpan draft acara ✨</p>
                            )}
                            {submitState === "error" && (
                                <p className="text-xs text-red-700">Periksa kembali kolom yang belum valid.</p>
                            )}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

/** Chat bubble component */
const ChatBubble = ({ role, text }) => {
    const isUser = role === "user";
    return (
        <div
            className={
                "flex " + (isUser ? "justify-end" : "justify-start")
            }
        >
            <div
                className={
                    (isUser
                        ? "bg-accent text-black"
                        : "bg-card text-foreground") +
                    " max-w-[680px] rounded-3xl border border-border px-4 py-3 shadow-sm transition-all"
                }
                style={{
                    transform: "translateY(2px)",
                    animation: "fadeInUp 280ms ease-out both",
                }}
            >
                <p className="text-sm sm:text-base leading-relaxed">
                    {role === "loading" ? (
                        <div className="h-2 justify-center items-center flex px-2 py-1">
                            <SyncLoader size={6} color="#FF9836" />
                        </div>
                    ) : (
                        <Markdown>{text}</Markdown>
                    )}
                </p>
            </div>
            {/* lightweight keyframe for smooth pop-in */}
            <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
        </div>
    );
};

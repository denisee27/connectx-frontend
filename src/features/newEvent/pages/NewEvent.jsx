import React, { useMemo, useState } from "react";
import { Sparkles, Send } from "lucide-react";

/**
 * NewEvent Page
 * Alur: Intro greeting → Chat conversation + CTA → Form Acara
 * - Responsif, konsisten dengan theme (bg-card, border-border, accent/primary)
 * - Animasi ringan pada bubble dan transisi antar tahap
 * - Validasi dasar form
 */
export const NewEvent = () => {
    const { mutateAsync: startSession } = useFormSession();
    const [step, setStep] = useState("intro"); // intro | chat | form
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text:
                "Halo! Ceritakan acara apa yang ingin kamu buat. Kami siap membantumu merencanakan acara yang menyenangkan!",
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

    const handleSend = () => {
        const text = input.trim();
        if (!text) return;

        // Masukkan pesan user
        const userMsg = { role: "user", text };
        // Respon asisten yang ramah
        const assistantMsg = {
            role: "assistant",
            text:
                "Wah, ide yang menarik! Saya dapat membantu kamu membuat acara tersebut. Berdasarkan deskripsi kamu, saya merekomendasikan untuk membuat acara dengan detail yang telah kamu sebutkan. Apakah kamu ingin saya siapkan form untuk melengkapi detail acara?",
        };

        setMessages((prev) => [...prev, userMsg, assistantMsg]);
        setInput("");
        setStep("chat");
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

    return (
        <div className="min-h-screen mx-auto max-w-3xl bg-white px-4 sm:px-6 text-foreground">
            {/* Header */}
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 grid place-items-center rounded-full bg-accent text-black shadow-sm">
                    <Sparkles size={20} />
                </div>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold">Buat Acara</h1>
                    <p className="text-sm text-muted-foreground">Mulai dari ide, lanjut ke detail.</p>
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
                            Buat Acara
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
                                placeholder="Jelaskan acara yang ingin kamu buat..."
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
                <p className="text-sm sm:text-base leading-relaxed">{text}</p>
            </div>
            {/* lightweight keyframe for smooth pop-in */}
            <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(6px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
        </div>
    );
};

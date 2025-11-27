import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    MapPin,
    CalendarDays,
    Users,
    Tag,
    X,
    CheckCircle2,
    QrCode,
    CreditCard,
} from "lucide-react";
import { useEvent } from "../hooks/useEvent";
import { format } from "date-fns";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader";
import { FadeIn } from "../../../shared/components/ui/FadeIn";
import { useAuth } from "../../../core/auth/useAuth";
import LoginModal from "../../auth/components/LoginModal";
import { env } from "../../../core/config/env";

function Modal({ open, onClose, children }) {
    React.useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        if (open) document.addEventListener("keydown", onKey);
        return () => document.removeEventListener("keydown", onKey);
    }, [open, onClose]);

    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="pointer-events-auto absolute inset-x-0 bottom-0 mx-auto w-full max-w-2xl rounded-t-2xl bg-card shadow-xl transition-transform duration-200 sm:inset-y-10 sm:bottom-auto sm:rounded-2xl">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 rounded-full p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
                {children}
            </div>
        </div>
    );
}

function Badge({ type }) {
    const map = {
        meetup: "bg-indigo-100 text-indigo-700",
        dinner: "bg-pink-100 text-pink-700",
        event: "bg-orange-100 text-orange-700",
    };
    const label = type === "meetup" ? "Meetup" : type === "dinner" ? "Dinner" : "Event";
    return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[type] || map.event}`}>{label}</span>;
}

export default function Event() {
    const { slug } = useParams();
    const { data: event, isPending } = useEvent(slug);
    const { isAuthenticated } = useAuth();
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isPaymentOpen, setPaymentOpen] = useState(false);
    const [isSuccessOpen, setSuccessOpen] = useState(false);

    const handleJoinClick = () => {
        if (isAuthenticated) {
            setPaymentOpen(true);
        } else {
            setLoginOpen(true);
        }
    };

    const handleLoginSuccess = () => {
        setLoginOpen(false);
        setPaymentOpen(true);
    };

    const handlePaymentSuccess = () => {
        setPaymentOpen(false);
        setSuccessOpen(true);
    };

    return (
        <>
            <div className="min-h-screen bg-card">
                {isPending ? (
                    <div className="mx-auto w-full max-w-4xl">
                        <SkeletonLoader className="h-56 w-full rounded-b-2xl sm:h-72 md:h-80" />
                        <div className="px-4 py-6 sm:px-6 md:px-8">
                            <SkeletonLoader className="h-8 w-3/4 rounded" />
                            <div className="mt-4 flex flex-wrap items-center gap-4">
                                <SkeletonLoader className="h-5 w-1/4 rounded" />
                                <SkeletonLoader className="h-5 w-1/3 rounded" />
                                <SkeletonLoader className="h-5 w-1/4 rounded" />
                            </div>
                            <div className="mt-6 space-y-3">
                                <SkeletonLoader className="h-4 w-full rounded" />
                                <SkeletonLoader className="h-4 w-full rounded" />
                                <SkeletonLoader className="h-4 w-5/6 rounded" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <FadeIn show={!isPending}>
                        <div className="mx-auto w-full max-w-4xl">
                            {event?.banner && (
                                <img
                                    src={env.VITE_API_BASE_URL + '/rooms/image/' + event?.banner}
                                    alt={event?.title}
                                    className="h-56 w-full rounded-b-2xl object-cover sm:h-72 md:h-80"
                                />
                            )}
                            <div className="px-4 py-6 sm:px-6 md:px-8">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">{event?.title}</h1>
                                        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="inline-flex items-center gap-1"><MapPin size={16} /> {event?.address}</span>
                                            <span className="inline-flex items-center gap-1"><CalendarDays size={16} />
                                                {event?.datetime && format(new Date(event.datetime), 'dd MMMM yyyy, HH:mm')}
                                            </span>
                                            {event?.maxParticipant && (
                                                <span className="inline-flex items-center gap-1"><Users size={16} /> Capacity {event?.maxParticipant}</span>
                                            )}
                                            <span className="inline-flex items-center gap-1"><Tag size={16} /> <Badge type={event?.type} /></span>
                                        </div>
                                    </div>
                                </div>
                                <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/80">{event?.description}</p>
                            </div>
                        </div>
                    </FadeIn>
                )}
                <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-glass backdrop-blur supports-[backdrop-filter]:bg-glass">
                    <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
                        <div className="text-sm text-muted-foreground">
                            Registration Fee: <span className="font-semibold text-foreground">Rp {(50000).toLocaleString("id-ID")}</span>
                        </div>
                        <button
                            onClick={handleJoinClick}
                            className="w-full max-w-xs bg-primary text-white font-semibold py-3 px-6 rounded-full hover:bg-secondary transition-colors duration-300"
                        >
                            Join This Event
                        </button>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => setLoginOpen(false)}
                onSuccess={handleLoginSuccess}
            />

            <PaymentModal
                isOpen={isPaymentOpen}
                onClose={() => setPaymentOpen(false)}
                onSuccess={handlePaymentSuccess}
                event={event}
            />

            <SuccessModal
                isOpen={isSuccessOpen}
                onClose={() => setSuccessOpen(false)}
            />
        </>
    );
}

function PaymentModal({ isOpen, onClose, onSuccess, event }) {
    const [processing, setProcessing] = useState(false);
    const [payMethod, setPayMethod] = useState("qris");
    const [selectedBank, setSelectedBank] = useState("");
    const [payError, setPayError] = useState("");
    const [showDetails, setShowDetails] = useState("");
    const [vaCode, setVaCode] = useState("");
    const [reference] = useState(() => Math.random().toString(36).slice(2, 8).toUpperCase());

    const BANKS = [
        { key: "bca", label: "BCA", code: "014" },
        { key: "bri", label: "BRI", code: "002" },
        { key: "mandiri", label: "Mandiri", code: "008" },
        { key: "bni", label: "BNI", code: "009" },
    ];

    function generateVaCode(bank) {
        const bankCode = BANKS.find((b) => b.key === bank)?.code || "000";
        const rand = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
        return `${bankCode}${rand}`;
    }

    function onStartPayment() {
        setPayError("");
        if (payMethod === "va") {
            if (!selectedBank) {
                setPayError("Pilih bank terlebih dahulu.");
                return;
            }
            const code = generateVaCode(selectedBank);
            setVaCode(code);
            setShowDetails("va");
        } else {
            setShowDetails("qris");
        }
    }

    function onConfirmPayment() {
        if (!showDetails) {
            setPayError("Lakukan langkah 'Payment Dulu' terlebih dahulu.");
            return;
        }
        setPayError("");
        setProcessing(true);
        setTimeout(() => {
            setProcessing(false);
            const failed = Math.random() < 0.1;
            if (failed) {
                setPayError("Pembayaran gagal, silakan ulangi.");
            } else {
                onSuccess();
            }
        }, 900);
    }

    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="px-5 py-6">
                <h3 className="text-xl font-semibold text-card-foreground">Pembayaran</h3>
                <p className="mt-1 text-sm text-muted-foreground">Biaya: Rp {(50000).toLocaleString("id-ID")}</p>
                <div className="mt-4 space-y-3">
                    <label className="flex items-center gap-3 rounded-lg border border-input p-3">
                        <input type="radio" name="pay" checked={payMethod === "qris"} onChange={() => setPayMethod("qris")} />
                        <QrCode size={18} /> QRIS
                    </label>
                    <label className="flex items-center gap-3 rounded-lg border border-input p-3">
                        <input type="radio" name="pay" checked={payMethod === "va"} onChange={() => setPayMethod("va")} />
                        <CreditCard size={18} /> Virtual Account
                    </label>
                    {payMethod === "va" && (
                        <div className="grid grid-cols-2 gap-2">
                            {BANKS.map((b) => (
                                <label key={b.key} className="flex items-center gap-2 rounded-lg border border-input p-2">
                                    <input
                                        type="radio"
                                        name="bank"
                                        checked={selectedBank === b.key}
                                        onChange={() => setSelectedBank(b.key)}
                                    />
                                    <span className="text-sm text-card-foreground">{b.label}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>
                {payError && <p className="mt-2 rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">{payError}</p>}
                <div className="mt-6 flex items-center justify-end gap-2">
                    <button onClick={onClose} className="rounded-lg border border-input px-4 py-2 text-sm text-foreground hover:bg-muted">
                        Tutup
                    </button>
                    <button
                        onClick={onStartPayment}
                        disabled={processing}
                        className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
                    >
                        {processing ? "Memproses..." : "Lanjutkan Pembayaran"}
                    </button>
                </div>

                {showDetails && (
                    <div className="mt-6 space-y-4 transition-opacity duration-200">
                        {showDetails === "qris" && (
                            <div className="rounded-lg border border-input bg-card p-4 text-center">
                                <img
                                    className="mx-auto h-44 w-44"
                                    alt="QRIS"
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                                        `CONNECTX:${reference}`
                                    )}`}
                                />
                                <p className="mt-2 text-sm text-muted-foreground">Scan QRIS untuk menyelesaikan pembayaran</p>
                            </div>
                        )}
                        {showDetails === "va" && (
                            <div className="rounded-lg border border-input bg-card p-4">
                                <p className="text-sm text-muted-foreground">Bank: {BANKS.find((b) => b.key === selectedBank)?.label}</p>
                                <p className="mt-1 text-2xl font-semibold tracking-wider text-card-foreground">{vaCode}</p>
                                <p className="mt-2 text-sm text-muted-foreground">Transfer ke nomor virtual account di atas.</p>
                            </div>
                        )}

                        <div className="flex items-center justify-end">
                            <button
                                onClick={onConfirmPayment}
                                disabled={processing}
                                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
                            >
                                {processing ? "Memproses..." : "Konfirmasi Pembayaran"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}

function SuccessModal({ isOpen, onClose }) {
    return (
        <Modal open={isOpen} onClose={onClose}>
            <div className="px-5 py-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
                    <CheckCircle2 size={24} />
                </div>
                <h3 className="text-xl font-semibold text-card-foreground">Pembayaran Berhasil</h3>
                <p className="mt-2 text-sm text-muted-foreground">Anda telah berhasil terdaftar di acara ini.</p>
                <div className="mt-6 flex items-center justify-center">
                    <button onClick={onClose} className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary">
                        OK
                    </button>
                </div>
            </div>
        </Modal>
    );
}

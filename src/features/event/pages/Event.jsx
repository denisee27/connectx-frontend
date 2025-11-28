import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, CalendarDays, Users, Tag, X, CheckCircle2 } from "lucide-react";
import { useEvent } from "../hooks/useEvent";
import { format } from "date-fns";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader";
import { FadeIn } from "../../../shared/components/ui/FadeIn";
import { useAuth } from "../../../core/auth/useAuth";
import LoginModal from "../../auth/components/LoginModal";
import { env } from "../../../core/config/env";
import { useCreatePayment } from "../hooks/usePayment";

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
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
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
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        map[type] || map.event
      }`}
    >
      {label}
    </span>
  );
}

export default function Event() {
  const { slug } = useParams();
  const { data: event, isPending } = useEvent(slug);
  const { isAuthenticated } = useAuth();
  const registrationFee = useMemo(() => {
    const rawPrice = event?.price ?? event?.fee ?? event?.registrationFee ?? 50000;
    const numericPrice = Number(rawPrice);
    if (Number.isNaN(numericPrice) || !Number.isFinite(numericPrice)) {
      return 50000;
    }
    return Math.max(0, Math.round(numericPrice));
  }, [event]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

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

  const handlePaymentSuccess = (paymentData) => {
    setPaymentOpen(false);
    setPaymentResult(paymentData || null);
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
                  src={env.VITE_API_BASE_URL + "/rooms/image/" + event?.banner}
                  alt={event?.title}
                  className="h-56 w-full rounded-b-2xl object-cover sm:h-72 md:h-80"
                />
              )}
              <div className="px-4 py-6 sm:px-6 md:px-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">
                      {event?.title}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={16} /> {event?.address}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={16} />
                        {event?.datetime && format(new Date(event.datetime), "dd MMMM yyyy, HH:mm")}
                      </span>
                      {event?.maxParticipant && (
                        <span className="inline-flex items-center gap-1">
                          <Users size={16} /> Capacity {event?.maxParticipant}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Tag size={16} /> <Badge type={event?.type} />
                      </span>
                    </div>
                  </div>
                </div>
                <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/80">
                  {event?.description}
                </p>
              </div>
            </div>
          </FadeIn>
        )}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-glass backdrop-blur supports-[backdrop-filter]:bg-glass">
          <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
            <div className="text-sm text-muted-foreground">
              Registration Fee:{" "}
              <span className="font-semibold text-foreground">
                Rp {registrationFee.toLocaleString("id-ID")}
              </span>
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
        price={registrationFee}
      />

      <SuccessModal
        isOpen={isSuccessOpen}
        onClose={() => {
          setSuccessOpen(false);
          setPaymentResult(null);
        }}
        payment={paymentResult}
      />
    </>
  );
}

function PaymentModal({ isOpen, onClose, onSuccess, event, price }) {
  const { user } = useAuth();
  const { mutateAsync: createPayment, isPending } = useCreatePayment();
  const [payError, setPayError] = useState("");

  const amount = useMemo(() => {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || !Number.isFinite(numericPrice)) {
      return 50000;
    }
    return Math.max(0, Math.round(numericPrice));
  }, [price]);

  const handleClose = () => {
    setPayError("");
    onClose();
  };

  const buildCustomerPayload = () => {
    if (!user) return undefined;

    const derivedName =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.name;
    const [first, ...rest] = (derivedName || "").split(/\s+/).filter(Boolean);

    return {
      firstName: user.firstName || first || undefined,
      lastName: user.lastName || (rest.length ? rest.join(" ") : undefined),
      email: user.email,
      phone: user.phone || user.phoneNumber,
    };
  };

  const handleCreatePayment = async () => {
    setPayError("");
    try {
      const payload = {
        amount: amount || 1,
        items: [
          {
            id: String(event?._id || event?.id || event?.slug || "event-registration"),
            name: event?.title || "Event Registration",
            price: amount || 1,
            quantity: 1,
          },
        ],
        metadata: {
          eventId: event?._id || event?.id || event?.slug,
          eventTitle: event?.title,
          eventType: event?.type,
          userId: user?._id || user?.id,
        },
        customer: buildCustomerPayload(),
      };

      const response = await createPayment(payload);
      const paymentData = response?.data || response;

      if (paymentData?.redirectUrl) {
        window.open(paymentData.redirectUrl, "_blank", "noopener,noreferrer");
      }

      onSuccess(paymentData);
    } catch (error) {
      const message = error?.message || "Pembayaran gagal, silakan coba lagi.";
      setPayError(message);
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="px-5 py-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-card-foreground">Pembayaran</h3>
          <p className="text-sm text-muted-foreground">
            Kamu akan dialihkan ke Midtrans Snap (sandbox) untuk menyelesaikan pembayaran.
          </p>
        </div>

        <div className="rounded-lg border border-input bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Acara</span>
            <span className="text-sm font-semibold text-card-foreground">
              {event?.title || "Event Registration"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Biaya</span>
            <span className="text-lg font-bold text-card-foreground">
              Rp {amount.toLocaleString("id-ID")}
            </span>
          </div>
          {user && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium text-card-foreground">{user.email}</span>
            </div>
          )}
        </div>

        {payError && (
          <p className="mt-2 rounded bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {payError}
          </p>
        )}

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={handleClose}
            className="rounded-lg border border-input px-4 py-2 text-sm text-foreground hover:bg-muted"
          >
            Tutup
          </button>
          <button
            onClick={handleCreatePayment}
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
          >
            {isPending ? "Memproses..." : "Bayar via Midtrans"}
          </button>
        </div>
      </div>
    </Modal>
  );
}

function SuccessModal({ isOpen, onClose, payment }) {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <div className="px-5 py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-xl font-semibold text-card-foreground">Pembayaran Dibuat</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Pesananmu sudah dibuat di Midtrans. Selesaikan pembayaran di halaman Snap.
        </p>

        <div className="mt-4 space-y-1 text-sm text-card-foreground">
          {payment?.orderId && <p className="font-semibold">Order ID: {payment.orderId}</p>}
          {payment?.status && (
            <p className="text-muted-foreground">Status: {payment.status.toUpperCase()}</p>
          )}
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          {payment?.redirectUrl && (
            <button
              onClick={() => window.open(payment.redirectUrl, "_blank", "noopener,noreferrer")}
              className="rounded-lg border border-input px-5 py-2 text-sm font-semibold text-foreground hover:bg-muted"
            >
              Buka Halaman Pembayaran
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary"
          >
            Tutup
          </button>
        </div>
      </div>
    </Modal>
  );
}

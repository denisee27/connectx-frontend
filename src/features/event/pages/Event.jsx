import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, Tag, X, CheckCircle2, ExternalLink, Bookmark } from "lucide-react";
import { useEvent } from "../hooks/useEvent";
import { format } from "date-fns";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader";
import { FadeIn } from "../../../shared/components/ui/FadeIn";
import { useAuth } from "../../../core/auth/useAuth";
import LoginModal from "../../auth/components/LoginModal";
import { env } from "../../../core/config/env";
import { useCreatePayment, useStatusPayment } from "../hooks/usePayment";

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
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${map[type] || map.event
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
  const navigate = useNavigate();
  const [latestOrderId, setLatestOrderId] = useState(null);
  const { data: polledPaymentStatus } = useStatusPayment(latestOrderId);
  const registrationFee = useMemo(() => {
    const rawPrice = event?.price ?? event?.fee ?? event?.registrationFee ?? 5000;
    const numericPrice = Number(rawPrice);
    if (Number.isNaN(numericPrice) || !Number.isFinite(numericPrice)) {
      return 5000;
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
    console.log("paymentData received", paymentData);
    if (paymentData?.orderId) {
      setLatestOrderId(paymentData.orderId);
      console.log("orderId set for polling:", paymentData.orderId);
    }
    setPaymentOpen(false);
    setPaymentResult(paymentData || null);
    setSuccessOpen(true);
  };

  // Navigate when polled status becomes ACTIVE (runs every 5s via hook)
  React.useEffect(() => {
    const status = polledPaymentStatus?.data?.status;
    if (status) {
      console.log("Polled payment status:", status);
    }
    if (status && String(status).toUpperCase() === "SETTLED") {
      navigate("/home/schedule");
    }
  }, [polledPaymentStatus, navigate]);

  return (
    <>
      <div className="min-h-screen bg-card pb-12">
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
                <div className="relative">
                  <img
                    src={env.VITE_API_BASE_URL + "/rooms/image/" + event?.banner}
                    alt={event?.title}
                    className="h-56 w-full rounded-b-2xl object-cover sm:h-72 md:h-80"
                  />
                  {event?.type && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center rounded-full bg-orange-500 px-4 py-1.5 text-sm font-bold text-white shadow-md capitalize">
                        {event.type}
                      </span>
                    </div>
                  )}
                </div>
              )}
              <div className="px-4 py-6 sm:px-6 md:px-8">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-card-foreground sm:text-3xl">
                      {event?.title}
                    </h1>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <a
                        href={event?.gmaps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-1 hover:text-primary transition-colors ${!event?.gmaps && "pointer-events-none"
                          }`}
                      >
                        <MapPin size={16} />
                        <span>
                          {event?.address}
                          {event?.city?.name && `, ${event.city.name}`}
                        </span>
                        {event?.gmaps && <ExternalLink size={12} />}
                      </a>

                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={16} />
                        {event?.datetime && format(new Date(event.datetime), "dd MMMM yyyy, HH:mm")}
                      </span>

                      {event?.maxParticipant && (
                        <span className="inline-flex items-center gap-1">
                          <Users size={16} /> Capacity {event?.maxParticipant}
                        </span>
                      )}

                      {/* <span className="inline-flex items-center gap-1">
                        <Tag size={16} /> <Badge type={event?.type} />
                      </span> */}

                      {event?.category?.name && (
                        <span className="inline-flex items-center gap-1">
                          <Bookmark size={16} /> {event.category.name}
                        </span>
                      )}
                    </div>

                    {/* Hosted By Section */}
                    {event?.createdBy && (
                      <div className="mt-6 flex items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/40 max-w-md hover:bg-muted/50 transition-colors">
                        <img
                          src={
                            event.createdBy.profilePictureUrl
                              ? `${env.VITE_API_BASE_URL}/rooms/image/${event.createdBy.profilePictureUrl}`
                              : `https://ui-avatars.com/api/?name=${event.createdBy.name}&background=random`
                          }
                          alt={event.createdBy.name}
                          className="w-10 h-10 rounded-full object-cover border border-border"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-0.5">
                            Hosted by
                          </p>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-foreground truncate">
                              {event.createdBy.name}
                            </span>
                            {event.createdBy.mbti && (
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${["INTJ", "ENTJ", "INTP", "ENTP"].includes(event.createdBy.mbti) ? "bg-purple-100 text-purple-700 border-purple-200" :
                                ["INFJ", "ENFJ", "INFP", "ENFP"].includes(event.createdBy.mbti) ? "bg-green-100 text-green-700 border-green-200" :
                                  ["ISTJ", "ESTJ", "ISFJ", "ESFJ"].includes(event.createdBy.mbti) ? "bg-blue-100 text-blue-700 border-blue-200" :
                                    "bg-orange-100 text-orange-700 border-orange-200"
                                }`}>
                                {event.createdBy.mbti}
                              </span>
                            )}
                          </div>
                          {event.createdBy.mbtiDesc && (
                            <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                              {event.createdBy.mbtiDesc}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground/80">
                  {event?.description}
                </p>

                {/* Attendees Section */}
                {event?.participants?.length > 0 && (
                  <div className="mt-10 border-t border-border pt-8">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary" />
                        Attendees
                        <span className="text-muted-foreground font-medium text-base">
                          ({event.participants.length} going)
                        </span>
                      </h2>
                    </div>

                    {/* Facepile */}
                    <div className="flex items-center -space-x-3 mb-8 overflow-visible">
                      {event.participants.slice(0, 8).map((p, i) => (
                        <div key={p.id} className="group relative z-0 hover:z-10 transition-all duration-200 hover:scale-110">
                          <img
                            src={
                              p.user.profilePictureUrl
                                ? `${env.VITE_API_BASE_URL}/rooms/image/${p.user.profilePictureUrl}`
                                : `https://ui-avatars.com/api/?name=${p.user.name}&background=random`
                            }
                            alt={p.user.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-card object-cover shadow-sm cursor-pointer"
                          />

                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-64 p-4 bg-popover text-popover-foreground text-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-border scale-95 group-hover:scale-100 origin-bottom">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold truncate pr-2">{p.user.name}</span>
                              {p.user.mbti && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-primary/10 text-primary border border-primary/20">
                                  {p.user.mbti}
                                </span>
                              )}
                            </div>
                            {p.user.mbtiDesc && (
                              <p className="text-xs text-muted-foreground leading-relaxed">
                                {p.user.mbtiDesc}
                              </p>
                            )}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-popover drop-shadow-sm"></div>
                          </div>
                        </div>
                      ))}

                      {event.participants.length > 8 && (
                        <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-card bg-muted text-xs font-bold text-muted-foreground z-0">
                          +{event.participants.length - 8}
                        </div>
                      )}
                    </div>

                    {/* Detailed List (Max 3) */}
                    <div className="space-y-4">
                      {event.participants.slice(0, 3).map((p) => (
                        <div
                          key={p.id}
                          className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300 group"
                        >
                          <div className="relative shrink-0">
                            <img
                              src={
                                p.user.profilePictureUrl
                                  ? `${env.VITE_API_BASE_URL}/rooms/image/${p.user.profilePictureUrl}`
                                  : `https://ui-avatars.com/api/?name=${p.user.name}&background=random`
                              }
                              alt={p.user.name}
                              className="w-12 h-12 rounded-full object-cover border border-border"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground truncate">
                                {p.user.name}
                              </h3>
                              {p.user.mbti && (
                                <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase border ${["INTJ", "ENTJ", "INTP", "ENTP"].includes(p.user.mbti) ? "bg-purple-100 text-purple-700 border-purple-200" :
                                  ["INFJ", "ENFJ", "INFP", "ENFP"].includes(p.user.mbti) ? "bg-green-100 text-green-700 border-green-200" :
                                    ["ISTJ", "ESTJ", "ISFJ", "ESFJ"].includes(p.user.mbti) ? "bg-blue-100 text-blue-700 border-blue-200" :
                                      "bg-orange-100 text-orange-700 border-orange-200"
                                  }`}>
                                  {p.user.mbti}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2 italic group-hover:text-foreground/80 transition-colors">
                              {p.user.mbtiDesc || "No personality description available."}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
  const [orderId, setOrderId] = useState();

  const [payError, setPayError] = useState("");
  const vatBase = 5000;
  const vatRate = 0.10;
  const vatAmount = (vatBase * vatRate);

  const amount = useMemo(() => {
    const numericPrice = Number(price);
    if (Number.isNaN(numericPrice) || !Number.isFinite(numericPrice)) {
      return 50000;
    }
    return Math.max(0, Math.round(numericPrice));
  }, [price]);
  const totalPayable = amount + vatAmount;

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
        amount: totalPayable || 1,
        items: [
          {
            id: String(event?._id || event?.id || event?.slug || "event-registration"),
            name: event?.title || "Event Registration",
            price: totalPayable || 1,
            quantity: 1,
          },
        ],
        metadata: {
          eventId: event?.id || event?.slug,
          eventTitle: event?.title,
          eventType: event?.type,
          userId: user?._id || user?.id,
        },
        customer: buildCustomerPayload(),
      };
      const response = await createPayment(payload);
      const paymentData = response?.data || response;
      if (!paymentData?.orderId) {
        throw new Error("Payment failed, please try again.");
      }
      console.log('paymentdata', paymentData)
      setOrderId(paymentData?.orderId);
      if (paymentData?.redirectUrl) {
        window.open(paymentData.redirectUrl, "_blank", "noopener,noreferrer");
      }

      onSuccess(paymentData);
    } catch (error) {
      const message = error?.message || "Payment failed, please try again.";
      setPayError(message);
    }
  };

  // Polling moved to Event component via latestOrderId

  return (
    <Modal open={isOpen} onClose={handleClose}>
      <div className="px-5 py-6 space-y-4">
        <div>
          <h3 className="text-xl font-semibold text-card-foreground">Payment</h3>
          <p className="text-sm text-muted-foreground">
            You will be redirected to Midtrans to complete your payment.
          </p>
        </div>

        <div className="rounded-lg border border-input bg-card p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Event</span>
            <span className="text-sm font-semibold text-card-foreground">
              {event?.title || "Event Registration"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Fee</span>
            <span className="text-lg font-bold text-card-foreground">
              Rp {amount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">VAT 10% of Rp {vatBase.toLocaleString("id-ID")}</span>
            <span className="text-sm font-medium text-card-foreground">
              Rp {vatAmount.toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Total to Pay</span>
            <span className="text-lg font-bold text-card-foreground">
              Rp {totalPayable.toLocaleString("id-ID")}
            </span>
          </div>
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
            Close
          </button>
          <button
            onClick={handleCreatePayment}
            disabled={isPending}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary disabled:opacity-60"
          >
            {isPending ? "Processing..." : "Payment"}
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
        <h3 className="text-xl font-semibold text-card-foreground">Payment Created</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order has been created in Midtrans. Complete your payment on the Snap page.
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
              Open Payment Page
            </button>
          )}
          <button
            onClick={onClose}
            className="rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}

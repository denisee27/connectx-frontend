import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, CalendarDays, Users, Tag, X, CheckCircle2, ExternalLink, Bookmark, AlertTriangle } from "lucide-react";
import { useEvent, useJoinEvent } from "../hooks/useEvent";
import { format } from "date-fns";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader";
import { FadeIn } from "../../../shared/components/ui/FadeIn";
import { useAuth } from "../../../core/auth/useAuth";
import { env } from "../../../core/config/env";
import { useCreatePayment, useStatusPayment } from "../hooks/usePayment";
import { LoginModal } from "../../auth/components/LoginModal";

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

function ConfirmationModal({ isOpen, onClose, onConfirm, eventTitle, isLoading }) {
  if (!isOpen) return null;
  return (
    <Modal open={isOpen} onClose={isLoading ? undefined : onClose}>
      <div className="p-6 sm:p-8">
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-xl font-bold text-foreground sm:text-2xl">Join Event</h2>
          <p className="mt-2 text-muted-foreground">
            Are you sure you want to join <span className="font-semibold text-foreground">{eventTitle}</span>?
          </p>
          <div className="mt-8 flex w-full gap-3">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-border bg-card py-2.5 font-semibold text-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
            >
              No, Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 rounded-xl bg-primary py-2.5 font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Joining...
                </>
              ) : (
                "Yes, Join"
              )}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default function Event() {
  const { slug } = useParams();
  const { data: event, isPending } = useEvent(slug);
  const { isAuthenticated, user } = useAuth();
  const { mutateAsync: joinRoom, isPending: isJoining } = useJoinEvent();
  const navigate = useNavigate();
  const [latestOrderId, setLatestOrderId] = useState(null);
  const { data: polledPaymentStatus } = useStatusPayment(latestOrderId);
  const vat = 0.1;
  const registrationFee = useMemo(() => {
    const rawPrice = event?.price ?? 0;
    const numericPrice = Number(rawPrice);
    if (Number.isNaN(numericPrice) || !Number.isFinite(numericPrice)) {
      return 5000;
    }
    return Math.max(0, Math.round(numericPrice));
  }, [event]);
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isPaymentOpen, setPaymentOpen] = useState(false);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isSuccessOpen, setSuccessOpen] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);

  const isUserPaid = useMemo(() => {
    return event?.isPayment;
  }, [user]);

  const remainingSpots = useMemo(() => {
    const max = event?.maxParticipant || 0;
    const current = event?._count?.participants || 0;
    return Math.max(0, max - current);
  }, [event]);

  const isEventFull = remainingSpots === 0 && (event?.maxParticipant > 0);

  const handleJoinClick = () => {
    if (isEventFull) return;

    if (!isAuthenticated) {
      setLoginOpen(true);
      return;
    }

    if (event?.price <= 0) {
      setConfirmationOpen(true);
      return;
    }

    setPaymentOpen(true);
  };

  const handleLoginSuccess = () => {
    setLoginOpen(false);
    setPaymentOpen(true);
  };

  const handleConfirmationJoin = async () => {
    await joinRoom(event?.id);
    setConfirmationOpen(false);
    navigate("/home/schedule");
  };

  const handlePaymentSuccess = (paymentData) => {
    if (paymentData?.orderId) {
      setLatestOrderId(paymentData.orderId);
    }
    setPaymentOpen(false);
    setPaymentResult(paymentData || null);
    setSuccessOpen(true);
  };

  React.useEffect(() => {
    const status = polledPaymentStatus?.data?.status;
    if (status) {
      console.log("Polled payment status:", status);
    }
    if (status && (String(status).toUpperCase() === "SETTLED" || String(status).toUpperCase() === "PAID")) {
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
                          {event?.gmaps && <ExternalLink size={12} />}
                        </span>
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
                            <span className="capitalize font-semibold text-foreground truncate">
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
                {/* Availability Alert Section */}
                <div className="mt-6 space-y-4">
                  {isEventFull && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-red-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 shrink-0 text-red-600" size={20} />
                        <div>
                          <h3 className="font-semibold text-red-900">Event Fully Booked</h3>
                          <p className="mt-1 text-sm text-red-700">
                            We apologize, but this event has reached its maximum capacity. Please check back later or look for other upcoming events.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {!event?.isCreator && !event.isJoining && remainingSpots <= 5 && remainingSpots > 0 && (
                    <div className="rounded-xl border border-orange-200 bg-orange-50 p-4 text-orange-800">
                      <div className="flex items-start gap-3">
                        <AlertTriangle className="mt-0.5 shrink-0 text-orange-600" size={20} />
                        <div>
                          <h3 className="font-semibold text-orange-900">Hurry up! Limited spots available</h3>
                          <p className="mt-1 text-sm text-orange-700">
                            There are only <strong>{remainingSpots}</strong> spots remaining for this event. Secure your place now before it's too late!
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                          <div className={`absolute bottom-full mb-3 w-64 p-4 bg-popover text-popover-foreground text-sm rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none border border-border scale-95 group-hover:scale-100 origin-bottom z-50 ${
                            // Adjust position based on index to prevent overflow
                            i === 0 ? 'left-0' :
                              i === 1 ? 'left-0 sm:-left-8' :
                                i === 2 ? 'left-0 sm:-left-16' :
                                  i === 3 ? 'left-0 sm:-left-24' :
                                    'left-1/2 -translate-x-1/2'
                            }`}>
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
                            <div className={`absolute top-full border-8 border-transparent border-t-popover drop-shadow-sm ${
                              // Adjust arrow position to match the tooltip offset
                              i === 0 ? 'left-6' :
                                i === 1 ? 'left-6 sm:left-12' :
                                  i === 2 ? 'left-6 sm:left-20' :
                                    i === 3 ? 'left-6 sm:left-28' :
                                      'left-1/2 -translate-x-1/2'
                              }`}></div>
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

        {event && (
          <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-glass backdrop-blur supports-[backdrop-filter]:bg-glass">
            <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8">
              {event?.isCreator ? (
                <div className="w-full text-center py-3 font-semibold text-primary">
                  You are the Host of this Event ✨
                </div>
              ) : event?.isJoining ? (
                <div className="w-full text-center py-3 font-semibold text-green-600">
                  You have already joined this Event ✅
                </div>
              ) : (
                <>
                  <div className="text-sm text-muted-foreground">
                    {!isUserPaid && (
                      <>
                        Registration Fee:{" "}
                        <span className="font-semibold text-foreground">
                          {event?.price > 0 ? (
                            <>
                              Rp {registrationFee.toLocaleString("id-ID")}
                            </>
                          )
                            : "Free"}
                        </span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={handleJoinClick}
                    disabled={isJoining || isEventFull}
                    className={`w-full max-w-xs font-semibold py-3 px-6 rounded-full transition-colors duration-300 text-white ${isEventFull ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-secondary"
                      }`}
                  >
                    {isEventFull ? "Full Booked" : "Join This Event"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <ConfirmationModal
        isOpen={isConfirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={handleConfirmationJoin}
        eventTitle={event?.title}
        isLoading={isJoining}
      />

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        event={event}
        vat={vat}
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

function PaymentModal({ isOpen, onClose, onSuccess, event, price, vat }) {
  const { user } = useAuth();

  const { mutateAsync: createPayment, isPending } = useCreatePayment();
  const [orderId, setOrderId] = useState();

  const [payError, setPayError] = useState("");
  const vatBase = event?.price ?? 0;
  const vatRate = vat ?? 0.1;
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

    const fullName = (user.name || "").trim();
    const nameParts = fullName.split(/\s+/).filter(Boolean);
    let firstName = null;
    let lastName = null;

    if (nameParts.length > 0) {
      firstName = nameParts[0];
      if (nameParts.length > 1) {
        lastName = nameParts.slice(1).join(" ");
      }
    }
    return {
      firstName: firstName || undefined,
      lastName: lastName || undefined,
      email: user?.email,
      phone: user?.phoneNumber || user?.phoneNumber,
    };
  };

  const handleCreatePayment = async () => {
    setPayError("");
    try {
      const payload = {
        amount: totalPayable || 1,
        roomId: event?.id,
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
      console.log("Payment Data:", paymentData);
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
            <span className="text-xs text-muted-foreground">VAT 10% of Rp {amount.toLocaleString("id-ID")}</span>
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

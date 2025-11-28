import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { Sparkles, Send } from "lucide-react";
import { useCreateRoom, useGetSessionChat, useSendMessage } from "../hooks/useNewEvent";
import Markdown from "react-markdown";
import { SyncLoader } from "react-spinners";
import { useCategories } from "../../dashboard/hooks/useDashboard";
import { useCountries } from "../../listEvent/hooks/useListEvent";
import { useCities } from "../../profiling/hooks/useProfiling";

const LoadingIndicator = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-md transition-all">
        <div className="flex flex-col items-center gap-6 p-8 rounded-2xl animate-in fade-in zoom-in duration-300">
            {/* Spinner Baru: Double Ring dengan Warna AI */}
            <div className="relative h-16 w-16">
                <div className="absolute h-full w-full rounded-full border-4 border-indigo-100 opacity-50"></div>
                <div className="absolute h-full w-full rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
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
    const navigate = useNavigate();
    const { mutateAsync: startSession, isPending: isPendingSession } = useGetSessionChat();
    const { mutateAsync: sendMessage } = useSendMessage();
    const [step, setStep] = useState("intro"); // intro | chat | form
    const [sessionId, setSessionId] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState("");
    const { data: categories = [], isLoading: isLoadingCategories } = useCategories();
    const { data: countries = [], isLoading: isLoadingCountries } = useCountries();
    const {
        data: cities,
        isLoading: isLoadingCities,
        isError: isErrorCities,
    } = useCities(selectedCountry);
    const { mutateAsync: createRoom, isPending: isPendingCreateRoom } = useCreateRoom();

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hi there! Tell me what kind of event you have in mind. I'm here to help you plan a truly memorable experience! ✨",
        },
    ]);
    const [input, setInput] = useState("");
    const textareaRef = useRef(null);

    // Form state
    const [form, setForm] = useState({
        title: "",
        datetime: "",
        locationDetail: "",
        mapsUrl: "",
        type: "",
        max_participant: "",
        place_name: "",
        reserve_information: "",
        cityId: "",
        countryId: "",
        categoryId: "",
        description: "",
        imageFile: null,
    });
    const [errors, setErrors] = useState({});
    const [submitState, setSubmitState] = useState("idle"); // idle | success | error
    const [imagePreview, setImagePreview] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const MAX_IMAGE_SIZE_MB = 5; // batas ukuran file gambar
    const MIN_IMAGE_WIDTH = 1280; // recommended minimum width
    const MIN_IMAGE_HEIGHT = 720; // recommended minimum height

    // Zod schema for form validation (English messages)
    const formSchema = z.object({
        title: z.string().min(3, "Title must be at least 3 characters"),
        datetime: z.string().min(1, "Date & time is required"),
        categoryId: z.string().min(1, "Category is required"),
        countryId: z.string().min(1, "Country is required"),
        cityId: z.string().min(1, "City is required"),
        locationDetail: z.string().min(10, "Please provide a clear location detail"),
        mapsUrl: z
            .string()
            .min(1, "Google Maps link is required")
            .refine((val) => {
                try {
                    const url = new URL(val);
                    return /(maps|goo\.gl)/.test(url.hostname + url.pathname);
                } catch (_) {
                    return false;
                }
            }, "Please enter a valid Google Maps link"),
        type: z.enum(["event", "meetup", "dinner"], {
            required_error: "Please select an event type",
            invalid_type_error: "Please select an event type",
        }),
        description: z.string().optional(),
        max_participant: z.union([z.string(), z.number()]).optional(),
        place_name: z.string().optional(),
        reserve_information: z.string().optional(),
        imageFile: z.custom((val) => val instanceof File, {
            message: "Event image is required",
        }),
    });

    useEffect(() => {
        getSessionId();
    }, []);

    const getSessionId = async () => {
        const id = await startSession();
        setSessionId(id?.data?.sessionId);
    };

    const cleanMapsLink = (val) => {
        if (typeof val !== "string") return "";
        return val.replace(/`/g, "").trim();
    };

    const toDatetimeLocalString = (val) => {
        if (!val || typeof val !== "string") return "";
        // Expect input like YYYY-MM-DDTHH:MM:SS; trim to YYYY-MM-DDTHH:MM
        const m = val.match(/^(\d{4}-\d{2}-\d{2}T\d{2}:\d{2})/);
        if (m) return m[1];
        try {
            const d = new Date(val);
            const pad = (n) => String(n).padStart(2, "0");
            const yyyy = d.getFullYear();
            const mm = pad(d.getMonth() + 1);
            const dd = pad(d.getDate());
            const hh = pad(d.getHours());
            const min = pad(d.getMinutes());
            return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
        } catch (_) {
            return "";
        }
    };

    const handleSend = async () => {
        const data = input.trim();
        if (!data) return;
        setInput("");
        const userMsg = { role: "user", text: data };
        setMessages((prev) => [...prev, userMsg, { role: "loading", text: "" }]);
        const restMsg = await sendMessage({ data, sessionId });
        console.log("restMsg", restMsg);
        setMessages((prevMessages) => prevMessages.slice(0, -1));
        if (!restMsg?.data?.structuredPayload) {
            const assistantMsg = { role: "assistant", text: restMsg?.data?.plainText };
            setMessages((prev) => [...prev, assistantMsg]);
            return;
        }
        // Prefill form dari structuredPayload dan pindah ke step form
        const sp = restMsg?.data?.structuredPayload;
        const payload = Array.isArray(sp) ? sp[0] : sp;
        const nextForm = {
            title: payload?.event_name ?? "",
            datetime: toDatetimeLocalString(payload?.start_date),
            locationDetail: payload?.address ?? payload?.location ?? "",
            mapsUrl: cleanMapsLink(payload?.maps_link ?? ""),
            type: payload?.room_type ?? "",
            imageFile: null,
            max_participant: payload?.max_participant ?? "",
            place_name: payload?.location ?? "",
            reserve_information: payload?.reserve_information ?? payload?.contact_information ?? "",
            countryId: payload?.country_id ?? "",
            cityId: payload?.city_id ?? "",
            categoryId: payload?.category_id ?? "",
            description: payload?.description ?? "",
        };
        setForm(nextForm);
        if (payload?.country_id) {
            setSelectedCountry(payload.country_id);
        }
        setStep("form");
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0] ?? null;
        if (!file) {
            setForm({ ...form, imageFile: null });
            setErrors((prev) => ({ ...prev, imageFile: undefined }));
            return;
        }

        // Validasi ukuran file
        if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
            setErrors((prev) => ({
                ...prev,
                imageFile: `Maximum image size is ${MAX_IMAGE_SIZE_MB}MB`,
            }));
            setForm({ ...form, imageFile: null });
            return;
        }

        // Validasi rasio (harus landscape: width > height)
        const objectUrl = URL.createObjectURL(file);
        const img = new Image();
        img.onload = () => {
            const isLandscape = img.width > img.height;
            if (!isLandscape) {
                setErrors((prev) => ({
                    ...prev,
                    imageFile: "Image must be landscape (width > height)",
                }));
                setForm({ ...form, imageFile: null });
            } else {
                setErrors((prev) => ({ ...prev, imageFile: undefined }));
                setForm({ ...form, imageFile: file });
            }
            URL.revokeObjectURL(objectUrl);
        };
        img.onerror = () => {
            setErrors((prev) => ({ ...prev, imageFile: "Invalid image file" }));
            URL.revokeObjectURL(objectUrl);
        };
        img.src = objectUrl;
    };

    const validateForm = () => {
        const result = formSchema.safeParse(form);
        if (!result.success) {
            const nextErrors = {};
            for (const issue of result.error.issues) {
                const field = issue.path?.[0] || "form";
                nextErrors[field] = issue.message;
            }
            setErrors(nextErrors);
            return false;
        }
        setErrors({});
        return true;
    };

    const slugifyTitle = (str) =>
        (str || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitState("idle");
        if (!validateForm()) {
            setSubmitState("error");
            return;
        }
        try {
            // Build multipart form data with binary image
            const fd = new FormData();
            fd.append("imageFile", form.imageFile);
            fd.append("title", form.title);
            fd.append("slug", slugifyTitle(form.title));
            fd.append("categoryId", form.categoryId);
            fd.append("cityId", form.cityId);
            fd.append("type", form.type || "");
            fd.append("placeName", form.place_name || "");
            fd.append("description", form.description || "");
            fd.append("datetime", new Date(form.datetime).toISOString());
            fd.append("address", form.locationDetail || "");
            fd.append("gmaps", form.mapsUrl || "");
            const maxP =
                Number(form.max_participant) ||
                (form.type === "event" ? 0 : form.type === "meetup" ? 10 : form.type === "dinner" ? 4 : 0);
            fd.append("maxParticipant", String(maxP));

            const res = await createRoom(fd);
            console.log("createRoom result", res);
            setSubmitState("success");
            setShowSuccessModal(true);
        } catch (err) {
            console.error("Failed to create room", err);
            setSubmitState("error");
        }
    };

    // Preview image when user selects a file
    useEffect(() => {
        if (!form.imageFile) {
            setImagePreview(null);
            return;
        }
        const url = URL.createObjectURL(form.imageFile);
        setImagePreview(url);
        return () => URL.revokeObjectURL(url);
    }, [form.imageFile]);

    // Auto-resize textarea height based on content
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = "auto"; // Reset height to recalculate
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = 120; // Max height in pixels (approx. 5-6 lines)

            if (scrollHeight > maxHeight) {
                textarea.style.height = `${maxHeight}px`;
                textarea.style.overflowY = "auto"; // Show scrollbar when max height is reached
            } else {
                textarea.style.height = `${scrollHeight}px`;
                textarea.style.overflowY = "hidden"; // Hide scrollbar when below max height
            }
        }
    }, [input]);

    if (isPendingSession || !sessionId) {
        return <LoadingIndicator />;
    }

    return (
        <div className="relative h-screen w-full bg-white text-foreground">
            {showSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl">
                        <h3 className="text-lg font-bold">Success! Your event is ready.</h3>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Event saved successfully. You can check the details and schedule below.
                        </p>
                        <div className="mt-4 flex justify-end gap-2">
                            <button
                                type="button"
                                className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white"
                                onClick={() => navigate("/home/schedule")}
                            >
                                Detail
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Scrollable Content Area (Header + Chat/Form) */}
            <div className="absolute inset-0 overflow-y-auto pb-15">
                {/* Header */}
                <div className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 max-w-3xl mx-auto">
                        <div className="h-10 w-10 grid place-items-center rounded-full bg-primary text-white shadow-sm">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold">Craft Your Experience</h1>
                            <p className="text-sm text-muted-foreground">
                                From a simple spark of an idea to a perfect plan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content: Conversation or Form */}
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6">
                    {step !== "form" ? (
                        // Conversation Area
                        <div className="space-y-4">
                            {messages.map((m, idx) => (
                                <ChatBubble key={idx} role={m.role} text={m.text} />
                            ))}

                            {/* CTA only in chat step */}
                            {step === "chat" && (
                                <div className="pt-4 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setStep("form")}
                                        className="rounded-full bg-primary px-5 py-2 font-semibold text-black shadow-sm transition-colors hover:bg-secondary"
                                    >
                                        Create Event
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Form Card
                        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                            <h2 className="text-xl font-semibold">Event Details</h2>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Complete the information below to get your event ready.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                                {/* Image Preview */}
                                {imagePreview && (
                                    <div className="mb-3">
                                        <img
                                            src={imagePreview}
                                            alt="Event image preview"
                                            className="w-full max-h-64 object-cover rounded-xl border border-border"
                                        />
                                    </div>
                                )}
                                {/* Event Image */}

                                <div>
                                    <label className="text-sm font-medium">Event Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        Recommended minimum resolution: {MIN_IMAGE_WIDTH}×{MIN_IMAGE_HEIGHT}{" "}
                                        (landscape). Max size: {MAX_IMAGE_SIZE_MB}MB.
                                    </p>
                                    {errors.imageFile && (
                                        <p className="mt-1 text-xs text-red-600">{errors.imageFile}</p>
                                    )}
                                </div>
                                {/* Form fields remain unchanged... */}
                                {/* Title */}
                                <div>
                                    <label className="text-sm font-medium">Title Event</label>
                                    <input
                                        type="text"
                                        value={form.title}
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                        placeholder="Example: Creative Workshop"
                                    />
                                    {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="text-sm font-medium">Description</label>
                                    <textarea
                                        rows={5}
                                        value={form.description}
                                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                        placeholder="Describe the event details, vibe, and rules..."
                                    />
                                </div>

                                {/* Max Participant */}
                                <div>
                                    <label className="text-sm font-medium">Max Participant</label>
                                    <input
                                        type="number"
                                        min={1}
                                        value={form.max_participant}
                                        onChange={(e) => setForm({ ...form, max_participant: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                        placeholder="e.g., 15"
                                    />
                                </div>

                                {/* Place Name */}
                                <div>
                                    <label className="text-sm font-medium">Place Name</label>
                                    <input
                                        type="text"
                                        value={form.place_name}
                                        onChange={(e) => setForm({ ...form, place_name: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                        placeholder="e.g., Chillax Sudirman"
                                    />
                                </div>

                                {/* Reserve Information */}
                                <div>
                                    <label className="text-sm font-medium">Reserve Information</label>
                                    <textarea
                                        rows={3}
                                        value={form.reserve_information}
                                        onChange={(e) => setForm({ ...form, reserve_information: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                        placeholder="Contact or reservation instructions"
                                    />
                                </div>

                                {/* Country */}
                                <div>
                                    <label className="text-sm font-medium">Country</label>
                                    <select
                                        value={form.countryId}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setForm({ ...form, countryId: val, cityId: "" });
                                            setSelectedCountry(val);
                                        }}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    >
                                        <option value="">Select Country</option>
                                        {isLoadingCountries ? (
                                            <option disabled>Loading countries...</option>
                                        ) : (
                                            countries?.map((country) => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name || country.display_name || country.title}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                </div>

                                {/* City */}
                                <div>
                                    <label className="text-sm font-medium">City</label>
                                    <select
                                        value={form.cityId}
                                        onChange={(e) => setForm({ ...form, cityId: e.target.value })}
                                        disabled={!selectedCountry || isLoadingCities || isErrorCities}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    >
                                        <option value="">Select City</option>
                                        {isLoadingCities ? (
                                            <option disabled>Loading cities...</option>
                                        ) : isErrorCities ? (
                                            <option disabled>Error loading cities</option>
                                        ) : (
                                            cities?.map((city) => (
                                                <option key={city.id} value={city.id}>
                                                    {city.name || city.display_name || city.title}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    {errors.cityId && <p className="mt-1 text-xs text-red-600">{errors.cityId}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="text-sm font-medium">Category</label>
                                    <select
                                        value={form.categoryId}
                                        onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                    >
                                        <option value="">Select Category</option>
                                        {isLoadingCategories ? (
                                            <option disabled>Loading categories...</option>
                                        ) : (
                                            categories?.map((category) => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name || category.display_name || category.title}
                                                </option>
                                            ))
                                        )}
                                    </select>
                                    {errors.categoryId && (
                                        <p className="mt-1 text-xs text-red-600">{errors.categoryId}</p>
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
                                    <label className="text-sm font-medium">Location Detail</label>
                                    <textarea
                                        rows={3}
                                        value={form.locationDetail}
                                        onChange={(e) => setForm({ ...form, locationDetail: e.target.value })}
                                        className="mt-1 w-full rounded-xl border border-border bg-white px-3 py-2 shadow-sm focus:outline-none"
                                        placeholder="Write the address, landmarks, or special location notes"
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
                                    {errors.mapsUrl && <p className="mt-1 text-xs text-red-600">{errors.mapsUrl}</p>}
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="text-sm font-medium">Event Type</label>
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
                                                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                                                    className="mt-1"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold">{opt.label}</p>
                                                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                    {errors.type && <p className="mt-1 text-xs text-red-600">{errors.type}</p>}
                                </div>

                                {/* Submit */}
                                <div className="pt-2 flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                        Ensure the information provided is accurate and clear.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isPendingCreateRoom}
                                        className="hover:cursor-pointer rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-foreground"
                                    >
                                        {isPendingCreateRoom ? "Creating..." : "Create Event"}
                                    </button>
                                </div>
                                {submitState === "success" && (
                                    <p className="text-xs text-green-700">Event draft saved successfully ✨</p>
                                )}
                                {submitState === "error" && (
                                    <p className="text-xs text-red-700">Please check the invalid fields again.</p>
                                )}
                            </form>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Input Bar */}
            {step !== "form" && (
                <div className="absolute bottom-0 left-0 right-0 z-10 bg-gradient-to-t from-white via-white to-transparent pt-8">
                    <div className="mx-auto max-w-3xl px-4">
                        <div className="flex items-start gap-2 rounded-3xl border border-border bg-card p-2 shadow-lg transition-all duration-200">
                            <textarea
                                ref={textareaRef}
                                rows={1}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    // Send on Enter, new line on Shift+Enter
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                                placeholder="Tell me about the event you'd like to create..."
                                className="flex-1 resize-none overflow-hidden bg-transparent px-3 py-2 text-sm sm:text-base focus:outline-none transition-height duration-200 ease-in-out"
                            />
                            <button
                                type="button"
                                onClick={handleSend}
                                className="hover:cursor-pointer inline-flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-sm transition-colors hover:bg-primary"
                                aria-label="Send"
                            >
                                <Send size={18} />
                            </button>
                        </div>
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
        <div className={"flex " + (isUser ? "justify-end" : "justify-start")}>
            <div
                className={
                    (isUser ? "bg-accent text-black" : "bg-card text-foreground") +
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

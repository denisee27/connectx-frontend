import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import api from "../../../core/api/index.js";
import { useCategory } from "../hooks/useCategory.js";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import { env } from "../../../core/config/env.js";

const labelDay = (iso) => {
    const d = new Date(iso);
    const monthShort = d.toLocaleDateString("en-US", { month: "short" });
    const day = d.toLocaleDateString("en-US", { day: "2-digit" });
    const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
    return { dayLabel: `${monthShort} ${day}`, dayName: weekday, time: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) };
};


function HeaderSection({ title, description, iconUrl }) {
    return (
        <section className="relative rounded-3xl bg-white text-foreground shadow-sm border border-border overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                <div className="p-8 sm:p-10 lg:p-12">
                    <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
                    <p className="mt-6 max-w-xl text-muted-foreground">
                        {description}
                    </p>
                </div>
                <div className="relative p-6 sm:p-10 lg:p-12">
                    <div className="mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl bg-muted">
                        {iconUrl ? (
                            <img src={iconUrl} alt="Kategori" className="h-full w-full object-cover" />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-muted-foreground">Image</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

// Event Card (copied structure & styling from Schedule.jsx)
const EventCard = ({ time, title, location, guests, thumbnail, onClick }) => (
    <div data-testid="event-card" onClick={onClick} className="cursor-pointer flex items-center justify-between gap-3 md:gap-6 rounded-2xl border border-border bg-card p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-muted-foreground leading-[1.5]">{time}</div>
            <h3 className="mt-1 text-base md:text-xl font-semibold leading-[1.5] line-clamp-2">
                {title}
            </h3>

            <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground leading-[1.5]">
                <span className="inline-flex items-center gap-1"><MapPin size={16} /> {location}</span>
                <span className="inline-flex items-center gap-1"><Users size={16} /> {guests}</span>
            </div>
        </div>

        {/* Thumbnail */}
        <div className="shrink-0">
            <img
                src={env.VITE_API_BASE_URL + '/rooms/image/' + thumbnail}
                alt="event thumbnail"
                className="h-24 w-24 md:h-36 md:w-36 rounded-xl object-cover"
                loading="lazy"
            />
        </div>
    </div>
);

export const DetailCategory = ({ category: categoryProp, events: eventsProp, fetchEvents }) => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data: categoryData, isPending: isPendingCategory } = useCategory(slug);
    console.log('categoryData', categoryData)
    const [category, setCategory] = useState(() => (
        categoryProp || {
            slug: slug || "tech",
            title: "Teknologi",
            description:
                "Ikuti hackathon, berkreasi dalam desain produk, dan bertemu sesama innovator di industri masa depan.",
            iconUrl: null,
        }
    ));

    const [events, setEvents] = useState(() => eventsProp || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch data
    useEffect(() => {
        let active = true;
        const run = async () => {
            setLoading(true);
            setError(null);
            try {
                if (eventsProp && eventsProp.length) {
                    setEvents(eventsProp);
                } else if (typeof fetchEvents === "function") {
                    const { data } = await fetchEvents(category.slug);
                    if (active) setEvents(Array.isArray(data) ? data : []);
                } else {
                    // Attempt API call if available; otherwise use sample
                    try {
                        const res = await api.getPaginated(`/categories/${category.slug}/events`, {
                            params: { page: 1, limit: 20 },
                            retry: false,
                        });
                        const data = res?.data || [];
                        if (active) setEvents(data);
                    } catch (_) {
                    }
                }
            } catch (e) {
                setError(e.message || "Gagal memuat event");
            } finally {
                if (active) setLoading(false);
            }
        };
        run();
        return () => {
            active = false;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category.slug]);

    // Raw items: no client-side sorting. Keep order as provided.
    const items = useMemo(() => (Array.isArray(events) ? events : []), [events]);

    // No pagination

    const onDetail = useCallback((id) => navigate(`/home/event/${id}`), [navigate]);

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-foreground ">
                {isPendingCategory ? (
                    <div className="space-y-6">
                        <SkeletonLoader className="h-48 w-full rounded-3xl" />
                        <div className="space-y-4">
                            <SkeletonLoader className="h-10 w-3/4 rounded-lg" />
                            <SkeletonLoader className="h-24 w-full rounded-lg" />
                        </div>
                    </div>
                ) : (
                    <FadeIn show={!isPendingCategory}>
                        <HeaderSection title={categoryData?.name} description={categoryData?.description} iconUrl={categoryData?.banner} />
                    </FadeIn>
                )}

                {/* Loading / Error */}
                {loading && (
                    <div className="mt-8 space-y-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <SkeletonLoader key={index} className="h-32 w-full rounded-2xl" />
                        ))}
                    </div>
                )}
                {error && (
                    <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-700">{error}</div>
                )}

                {/* List - mirror schedule timeline, with mobile re-ordering */}
                {!loading && !error && (
                    <FadeIn show={!loading}>
                        <div className="mt-8 relative">
                            {/* Continuous vertical line: aligned with dot center and spaced top/bottom */}
                            <div data-testid="timeline-line" className="absolute left-[10px] md:left-[132px] md:sm:left-[178px] top-3 bottom-3 w-px bg-border" aria-hidden />

                            {(() => {
                                const grouped = new Map();
                                categoryData?.rooms?.forEach((it) => {
                                    const { dayLabel, dayName, time } = labelDay(it.datetime);
                                    const entry = grouped.get(dayLabel) || { dayLabel, dayName, items: [] };
                                    entry.items.push({ ...it, time });
                                    grouped.set(dayLabel, entry);
                                });
                                const days = Array.from(grouped.values());
                                return (
                                    <div className="space-y-8 md:space-y-10 transition-all duration-300 ease-out">
                                        {days.map((day, di) => (
                                            <div key={`${day.dayLabel}-${di}`} className="relative">
                                                {/* Mobile: 2 cols (dot, content). Desktop: 3 cols (date, dot, cards) */}
                                                <div className="grid grid-cols-[20px_1fr] md:grid-cols-[100px_24px_1fr] sm:md:grid-cols-[140px_28px_1fr] gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-6 items-start" data-testid="day-grid">
                                                    {/* 1. Dot */}
                                                    <div className="relative col-start-1 row-start-1 md:col-start-2 md:row-start-1">
                                                        <div data-testid="timeline-dot" className="absolute left-1/2 -translate-x-1/2 top-2 h-3 w-3 rounded-full bg-accent border-2 border-white shadow" aria-hidden />
                                                    </div>

                                                    {/* 2. Date & Day: mobile right of dot, desktop left column */}
                                                    <div className="col-start-2 row-start-1 md:col-start-1 md:row-start-1 text-left md:text-right pr-0 md:pr-2 sm:md:pr-3" data-testid="mobile-date-label">
                                                        <div className="text-xl sm:text-2xl font-semibold leading-tight">{day.dayLabel}</div>
                                                        <div className="text-sm sm:text-base text-muted-foreground leading-tight">{day.dayName}</div>
                                                    </div>

                                                    {/* 3. Cards: below date on mobile, right column on desktop */}
                                                    <div className="col-start-2 row-start-2 md:col-start-3 md:row-start-1 space-y-6">
                                                        {day.items.map((ev) => (
                                                            <>
                                                                {console.log('ev', ev)}
                                                                <EventCard
                                                                    key={`${day.dayLabel}-${ev.id}`}
                                                                    time={ev.time}
                                                                    title={ev.title}
                                                                    location={ev?.city?.name}
                                                                    guests={typeof ev._count.participants === "number" ? (ev._count.participants === 0 ? "No guests" : `${ev._count.participants} guests`) : ev._count.participants}
                                                                    thumbnail={ev.banner}
                                                                    onClick={() => onDetail(ev.slug)}
                                                                />
                                                            </>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
};

export default DetailCategory;
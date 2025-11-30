import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExternalLink, MapPin, Users, CalendarCheck, Handshake, Utensils } from "lucide-react";
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
const EventCard = ({ time, title, location, guests, thumbnail, onClick, type, placeName, gmaps }) => {
    const getIcon = (label) => {
        const lowerLabel = label?.toLowerCase();
        if (lowerLabel === "dinner") return <Utensils size={14} className="text-white" />;
        if (lowerLabel === "meetup") return <Handshake size={14} className="text-white" />;
        return <CalendarCheck size={14} className="text-white" />;
    };

    return (
        <div data-testid="event-card" onClick={onClick} className="cursor-pointer flex items-center justify-between gap-3 md:gap-6 rounded-2xl border border-border bg-card p-3 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    {type && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9836] px-3 py-1 text-xs font-bold text-white shadow-sm capitalize">
                            {getIcon(type)}
                            {type}
                        </span>
                    )}
                    <div className="text-xs md:text-sm text-muted-foreground leading-[1.5]">{time}</div>
                </div>
                <h3 className="mt-1 text-base md:text-xl font-semibold leading-[1.5] line-clamp-2">
                    {title}
                </h3>

                <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground leading-[1.5]">
                    {placeName && gmaps && (
                        <a
                            href={gmaps}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 hover:text-primary transition-colors z-10"
                        >
                            <MapPin size={16} />
                            {placeName}
                        </a>
                    )}
                    {!placeName && <span className="inline-flex items-center gap-1"><MapPin size={16} /> {location}</span>}
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
};

export const DetailCategory = ({ category: categoryProp, events: eventsProp, fetchEvents }) => {
    const navigate = useNavigate();
    const { slug } = useParams();
    const { data: categoryData, isPending: isPendingCategory } = useCategory(slug);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

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
                                                        <div data-testid="timeline-dot" className="absolute left-1/2 -translate-x-1/2 top-2 h-3 w-3 rounded-full bg-primary border-2 border-white shadow" aria-hidden />
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
                                                                <EventCard
                                                                    key={`${day.dayLabel}-${ev.id}`}
                                                                    time={ev.time}
                                                                    title={ev.title}
                                                                    location={ev?.city?.name}
                                                                    guests={typeof ev._count.participants === "number" ? (ev.maxParticipant === 0 ? "Capacity" : `${ev.maxParticipant} capacity`) : ev.maxParticipant}
                                                                    thumbnail={ev.banner}
                                                                    type={ev.type}
                                                                    placeName={ev.placeName}
                                                                    gmaps={ev.gmaps}
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
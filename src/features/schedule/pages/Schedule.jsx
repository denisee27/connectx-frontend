import React, { useMemo, useState, useEffect } from "react";
import { MapPin, Users, ChevronRight, ExternalLink, Utensils, Handshake, CalendarCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePastEvent, useUpcomingEvent } from "../hooks/useSchedule";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { env } from "../../../core/config/env.js";

const groupEventsByDay = (events) => {
    if (!Array.isArray(events)) {
        return [];
    }

    const grouped = events.reduce((acc, event) => {
        const eventDate = new Date(event.datetime);
        const dayKey = eventDate.toISOString().split("T")[0];

        if (!acc[dayKey]) {
            acc[dayKey] = {
                dayLabel: eventDate.toLocaleDateString("en", { day: "2-digit", month: "short" }),
                dayName: eventDate.toLocaleDateString("en", { weekday: "long" }),
                items: [],
            };
        }

        const formattedEvent = {
            ...event,
            time: eventDate.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" }),
            location: event.address || event.city?.name || "N/A",
            guests: event.maxParticipant != null ? `${event.maxParticipant} capacity` : "N/A",
            banner: event?.banner?.trim().replace(/`/g, '') || "https://via.placeholder.com/144",
        };

        acc[dayKey].items.push(formattedEvent);
        return acc;
    }, {});

    return Object.values(grouped).sort((a, b) => new Date(a.items[0].datetime) - new Date(b.items[0].datetime));
};


/**
 * Schedule Page
 * - Tabs: Upcoming / Past
 * - Vertical timeline line (continuous), dot per day
 * - Responsive cards with smooth tab transitions
 */
export const Schedule = () => {
    const [activeTab, setActiveTab] = useState("upcoming");
    const navigate = useNavigate();

    const { data: upcomingEvent, refetch: refetchUpcoming, isLoading: isLoadingUpcoming } = useUpcomingEvent();
    const { data: pastEvent, refetch: refetchPast, isLoading: isLoadingPast } = usePastEvent();
    useEffect(() => {
        if (activeTab === "upcoming") {
            refetchUpcoming();
        } else {
            refetchPast();
        }
    }, [activeTab, refetchUpcoming, refetchPast]);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    const { data, isLoading } = useMemo(() => {
        if (activeTab === "upcoming") {
            const rawData = upcomingEvent?.data || [];
            const groupedData = groupEventsByDay(rawData);
            return { data: groupedData, isLoading: isLoadingUpcoming };
        }
        const rawData = pastEvent?.data || [];
        const groupedData = groupEventsByDay(rawData);
        return { data: groupedData, isLoading: isLoadingPast };
    }, [activeTab, upcomingEvent, pastEvent, isLoadingUpcoming, isLoadingPast]);

    return (
        <div className="mx-auto max-w-7xl bg-white px-4 sm:px-8 text-foreground">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Schedules</h1>

                {/* Tabs */}
                <div className="flex items-center gap-2 rounded-full border border-border p-1 bg-card">
                    <TabButton
                        active={activeTab === "upcoming"}
                        onClick={() => handleTabClick("upcoming")}
                    >
                        Upcoming
                    </TabButton>
                    <TabButton
                        active={activeTab === "past"}
                        onClick={() => handleTabClick("past")}
                    >
                        Past
                    </TabButton>
                </div>
            </div>

            {/* Content */}
            <div className="mt-8 relative">
                {/* Continuous vertical timeline line (adjusted for mobile) */}
                <div className="absolute left-[9px] md:left-[178px] top-2 bottom-0 w-px bg-border" aria-hidden />
                {/* Animated list container */}
                <FadeIn show={!isLoading}>
                    {isLoading ? (
                        <SkeletonLoader />
                    ) : (
                        <div
                            key={activeTab}
                            className="space-y-8 md:space-y-10 transition-all duration-300 ease-out"
                        >
                            {Array.isArray(data) && data.length > 0 ? (
                                data.map((day, di) => (
                                    <div key={`${day.dayLabel}-${di}`} className="relative">
                                        <div className="grid grid-cols-[20px_1fr] md:grid-cols-[140px_28px_1fr] gap-3 md:gap-6 items-start">
                                            {/* 1. Date & Day (desktop only) */}
                                            <div className="hidden md:block text-right pr-2 md:pr-3">
                                                <div className="text-xl md:text-2xl font-semibold leading-tight">{day.dayLabel}</div>
                                                <div className="text-sm md:text-base text-muted-foreground leading-tight">{day.dayName}</div>
                                            </div>

                                            {/* 2. Timeline column with dot; line is global */}
                                            <div className="relative">
                                                <div className="absolute left-1/2 -translate-x-1/2 top-1.5 h-3 w-3 rounded-full bg-primary border-2 border-white shadow" aria-hidden />
                                            </div>

                                            {/* 3. Cards column */}
                                            <div className="space-y-4 md:space-y-6 pl-2 md:pl-0">
                                                <div className="block md:hidden text-left pr-2 md:pr-3">
                                                    <div className="text-xl md:text-2xl font-semibold leading-tight">{day.dayLabel}</div>
                                                    <div className="text-sm md:text-base text-muted-foreground leading-tight">{day.dayName}</div>
                                                </div>
                                                {/* Mobile date above cards */}
                                                {day.items.map((ev, ei) => (
                                                    <EventCard key={ei} {...ev} onClick={() => navigate(`/home/event/${ev.slug}`)} />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-gray-500">No events to display.</div>
                            )}
                        </div>
                    )}
                </FadeIn>
            </div>
        </div>
    );
};

/** Tab Button */
const TabButton = ({ active, children, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={
            "px-4 py-1.5 text-sm sm:text-base rounded-full transition-all duration-200 " +
            (active
                ? "bg-primary text-white shadow-sm"
                : "bg-muted text-foreground hover:bg-primary/10")
        }
    >
        {children}
    </button>
);

/** Event Card */
const EventCard = ({ time, title, location, guests, banner, onClick, type, gmaps, placeName }) => {
    const getIcon = (label) => {
        const lowerLabel = label?.toLowerCase();
        if (lowerLabel === "dinner") return <Utensils size={14} className="text-white" />;
        if (lowerLabel === "meetup") return <Handshake size={14} className="text-white" />;
        return <CalendarCheck size={14} className="text-white" />;
    };

    return (
        <div onClick={onClick} className="cursor-pointer flex items-center justify-between gap-3 md:gap-6 rounded-2xl border border-border bg-card p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF9836] px-3 py-1 text-xs font-bold text-white shadow-sm capitalize">
                        {getIcon(type)}
                        {type}
                    </span>
                    <div className="text-xs md:text-sm text-muted-foreground">{time}</div>
                </div>
                <h3 className="mt-1 text-base md:text-xl font-semibold leading-tight md:leading-snug line-clamp-2">
                    {title}
                </h3>
                <div className="mt-2 md:mt-3 flex flex-wrap items-center gap-2 md:gap-3 text-xs md:text-sm text-muted-foreground">
                    {placeName && gmaps && (
                        <a
                            href={gmaps || "#"}
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="inline-flex items-center gap-1 hover:text-primary transition-colors z-10"
                        >
                            <MapPin size={16} />
                            {placeName}
                            {gmaps && <ExternalLink size={12} />}
                        </a>
                    )}
                    {!placeName && <span className="inline-flex items-center gap-1"><MapPin size={16} /> {location}</span>}
                    <span className="inline-flex items-center gap-1"><Users size={16} /> {guests}</span>
                </div>
            </div>

            {/* Thumbnail */}
            <div className="shrink-0">
                <img
                    src={env.VITE_API_BASE_URL + '/rooms/image/' + banner}
                    alt={`${title}`}
                    className="h-24 w-24 md:h-36 md:w-36 rounded-xl object-cover"
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 767px) 96px, 144px"
                />
            </div>
        </div>
    );
};

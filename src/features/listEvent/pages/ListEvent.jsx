import React from "react";
import { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SectionHeader from "../../dashboard/components/SectionHeader.jsx";
import EventFilter from "../components/EventFilter.jsx";
import EventCard from "../../dashboard/components/EventCard.jsx";
import PopularTabs from "../../dashboard/components/PopularTabs.jsx";
import { useListEvent } from "../hooks/useListEvent.js";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";

function parseISO(iso) {
    const d = new Date(iso);
    return Number.isNaN(d.getTime()) ? null : d.getTime();
}

function makeData() {
    const base = [
        {
            id: 1,
            title: "UR Team Strength Training Night",
            venue: "Senayan Park Mall",
            dateISO: "2025-11-27T19:00:00",
            meta: "Fitness • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1517836357463-d25dfeac3e9f?q=80&w=800&auto=format&fit=crop",
            popularity: 92,
        },
        {
            id: 2,
            title: "City Music Festival",
            venue: "JIExpo Kemayoran",
            dateISO: "2025-12-01T17:00:00",
            meta: "Music • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
            popularity: 88,
        },
        {
            id: 3,
            title: "Product Conference",
            venue: "Balai Kartini",
            dateISO: "2025-12-05T09:00:00",
            meta: "Conference • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
            popularity: 75,
        },
        {
            id: 4,
            title: "Art Expo Week",
            venue: "Museum Nasional",
            dateISO: "2025-12-09T11:00:00",
            meta: "Art • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format&fit=crop",
            popularity: 64,
        },
        {
            id: 5,
            title: "React Jakarta Meetup",
            venue: "Goltrix Treasury Tower",
            dateISO: "2025-11-28T18:30:00",
            meta: "Tech • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=800&auto=format&fit=crop",
            popularity: 83,
        },
        {
            id: 6,
            title: "Startup Coffee Chat",
            venue: "SCBD",
            dateISO: "2025-12-03T09:00:00",
            meta: "Startup • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1447933604927-51323c4f564f?q=80&w=800&auto=format&fit=crop",
            popularity: 72,
        },
        {
            id: 7,
            title: "AI Builders Meetup",
            venue: "Kota Kasablanka",
            dateISO: "2025-12-08T18:00:00",
            meta: "AI • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=800&auto=format&fit=crop",
            popularity: 68,
        },
        {
            id: 8,
            title: "Wine & Talk Dinner",
            venue: "Kuningan",
            dateISO: "2025-12-06T20:00:00",
            meta: "Food & Drink • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1510627498534-ff0c5a59be0b?q=80&w=800&auto=format&fit=crop",
            popularity: 74,
        },
        {
            id: 9,
            title: "Chef's Table Night",
            venue: "Senopati",
            dateISO: "2025-12-12T19:00:00",
            meta: "Food & Drink • Jakarta",
            thumbnail: "https://images.unsplash.com/photo-1526318472351-c75fd3eb77af?q=80&w=800&auto=format&fit=crop",
            popularity: 69,
        },
    ];

    // Expand to ~24 items per category by cloning with small tweaks
    function expand(items, extraCount, mutate) {
        const arr = [...items];
        for (let i = 0; i < extraCount; i++) {
            const src = items[i % items.length];
            arr.push({ ...src, id: src.id * 100 + i, popularity: src.popularity - (i % 5), ...mutate(i, src) });
        }
        return arr;
    }

    const events = expand(base, 16, (i, src) => ({ title: `${src.title} #${i + 1}` }));
    const meetups = expand(base.filter((e) => /Meetup/i.test(e.title)), 16, (i, src) => ({ title: `${src.title} • ${i + 1}` }));
    const dinners = expand(base.filter((e) => /Dinner|Table/i.test(e.title)), 16, (i, src) => ({ title: `${src.title} • ${i + 1}` }));
    return { events, meetups, dinners };
}

export const ListEvent = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [filters, setFilters] = useState({});

    const queryFilters = useMemo(() => {
        return {
            page,
            limit,
            title: filters.title,
            categories: filters.categories,
            country: filters.country,
            sort: filters.sort,
        };
    }, [page, limit, filters]);

    const {
        data: { data: eventList = [], meta } = {},
        isLoading,
        isFetching,
        error,
    } = useListEvent(queryFilters);

    const handleDetail = useCallback((id) => navigate(`/home/event/${id}`), [navigate]);

    const handleFilterChange = useCallback((newFilters) => {
        setPage(1);
        setFilters(newFilters);
    }, []);

    const Pagination = () => {
        if (!meta || meta.totalPages <= 1) return null;

        const { currentPage, totalPages } = meta;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="mt-8 flex items-center justify-between">
                <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors disabled:opacity-50 hover:bg-gray-100"
                >
                    Previous
                </button>

                <div className="flex items-center gap-2">
                    {pageNumbers.map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n)}
                            className={
                                "h-8 w-8 rounded-full text-sm transition-colors " +
                                (currentPage === n
                                    ? "bg-primary text-white"
                                    : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100")
                            }
                        >
                            {n}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors disabled:opacity-50 hover:bg-gray-100"
                >
                    Next
                </button>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionHeader title="Discover Highlights" />

                <EventFilter onFilterChange={handleFilterChange} />

                {/* Grid */}
                <div className="mt-6">
                    {isLoading ? (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {Array.from({ length: 8 }).map((_, index) => (
                                <SkeletonLoader key={index} className="h-64 w-full rounded-lg" />
                            ))}
                        </div>
                    ) : error ? (
                        <p>Error fetching events.</p>
                    ) : eventList.length === 0 ? (
                        <p>No events found.</p>
                    ) : (
                        <FadeIn show={!isLoading}>
                            <div className={`transition-opacity duration-300 ${isFetching ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                    {eventList.map((event) => (
                                        <div key={event.id} className="relative" onClick={() => handleDetail(event.slug)}>
                                            <EventCard
                                                title={event.title}
                                                venue={event.city.name}
                                                dateISO={event.datetime}
                                                meta={`${event.category.name} • ${event.city.name}`}
                                                thumbnail={event.category.banner}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </FadeIn>
                    )}
                </div>

                {/* Pagination */}
                <Pagination />
            </div>
        </div>
    );
};


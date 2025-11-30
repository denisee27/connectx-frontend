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
                                                type={event.type}
                                                title={event.title}
                                                venue={event.city.name}
                                                dateISO={event.datetime}
                                                meta={`${event.category.name} • ${event.city.name}`}
                                                banner={event.banner}
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


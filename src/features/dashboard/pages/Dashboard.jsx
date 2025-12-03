import React, { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../../shared/components/ui/ErrorBoundary.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import EventCard from "../components/EventCard.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import CityGrid from "../components/CityGrid.jsx";
import PopularTabs from "../components/PopularTabs.jsx";
import FeaturedGrid from "../components/FeaturedGrid.jsx";
import { useCategories, useHighlights, usePopular, useRegionRooms, useTemporaryUser } from "../hooks/useDashboard.js";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";
import { resetProfilingStorage } from "../../profiling/utils/reset.js";
import { useAuth } from "../../../core/auth/useAuth.js";
import { useQueryClient } from "@tanstack/react-query";

const formatText = (text) => {
  if (!text) return null;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    return <span key={index}>{part}</span>;
  });
};

function DashboardContent({ initial }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth()
  const queryClient = useQueryClient();

  const { data: categories = [], isPending: isPendingCategory } = useCategories();
  const { data: highlights = [], isPending: isPendingHighlights } = useHighlights(user?.city?.id);
  const { data: popular = null, isPending: isPendingPopular } = usePopular(user?.city?.id);
  const { data: regions = [], isPending: isPendingRegions } = useRegionRooms();
  const { data: temporaryUser = {}, isPending: isPendingTemporaryUser } = useTemporaryUser(localStorage.getItem("uid"), isAuthenticated);

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["highlightsKey"] });
    queryClient.invalidateQueries({ queryKey: ["popularKey"] });
  }, [isAuthenticated, queryClient]);

  // Tabs for "Acara Populer"
  const popularTabs = useMemo(() => [
    { key: "meetup", label: "Meetup" },
    { key: "dinner", label: "Dinner" },
    { key: "event", label: "Event" },
  ], []);

  const [popularActive, setPopularActive] = useState("meetup");
  const [isLoadingTab, setIsLoadingTab] = useState(false);

  // Set initial active tab based on available data
  useEffect(() => {
    resetProfilingStorage();
  }, []);

  useEffect(() => {
    setIsLoadingTab(true);
    const timer = setTimeout(() => setIsLoadingTab(false), 500); // Simulate loading or wait for transition
    return () => clearTimeout(timer);
  }, [popularActive]);

  const popularData = useMemo(() => {
    if (!popular) {
      return { dinner: [], meetup: [], event: [] };
    }

    const mapItems = (items) => (items || []).map(item => ({
      id: item.id,
      title: item.title,
      venue: item.address,
      slug: item.slug,
      date: item.datetime,
      banner: item.banner,
      placeName: item.placeName,
      type: item.type,
      dateISO: item.datetime,
      meta: `${item.category?.name || "General"} • ${item.city?.name || "City"}`,
    }));

    return {
      dinner: mapItems(popular.dinner),
      meetup: mapItems(popular.meetup),
      event: mapItems(popular.event),
    };
  }, [popular]);

  /**
   * FadeIn wrapper for smooth content transitions when tab changes
   */


  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {!isAuthenticated && !isPendingTemporaryUser && temporaryUser?.data?.mbti && (
          <div className="mb-10 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="bg-gradient-to-r from-primary to-primary-600 px-6 py-4 sm:px-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-white">
                <span role="img" aria-label="sparkles">✨</span> Your Personality Insight
              </h2>
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
                <div className="shrink-0 text-center md:text-left">
                  <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-orange-400 ring-4 ring-orange-200">
                    <span className="text-3xl font-extrabold text-white">{temporaryUser.data.mbti}</span>
                  </div>
                  <p className="mt-3 text-sm font-medium text-primary">Personality Type</p>
                </div>

                <div className="flex-1 space-y-6">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary">Overview</h3>
                    <p className="mt-2 text-base leading-relaxed text-gray-700">
                      {temporaryUser.data.mbtiDesc}
                    </p>
                  </div>

                  {temporaryUser.data.descPersonal && (
                    <div className="relative rounded-xl bg-gray-50 p-4 sm:p-6">
                      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-primary">Personal Analysis</h3>
                      <p className="text-base leading-relaxed text-gray-700">
                        {formatText(temporaryUser.data.descPersonal)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find Your Vibe</h1>
            <p className="mt-2 max-w-2xl text-gray-600">
              Uncover exciting events happening right around the corner. Filter by your interests or explore our curated categories to find your perfect match.
            </p>
          </div>
        </div>

        {/* Featured */}
        <div className="mt-10">
          <SectionHeader
            title="Spotlight"
            action={
              <button
                onClick={() => navigate("/home/list-event")}
                className="cursor-pointer rounded-full border border-gray-300 px-3 py-1.5 text-sm text-gray-800 transition-colors hover:bg-gray-100"
              >
                View All
              </button>
            }
          />
          {isPendingHighlights ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-64" />)}
            </div>
          ) : (
            <FadeIn show={!isPendingHighlights} deps={highlights}>
              <FeaturedGrid items={highlights} />
            </FadeIn>
          )}
        </div>

        {/* Popular area */}
        <div className="mt-14">
          <SectionHeader
            title="Trending Now"
            subtitle={user?.city?.name}
            action={<PopularTabs tabs={popularTabs} active={popularActive} onChange={setPopularActive} />}
          />
          {isPendingPopular || isLoadingTab ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-80" />)}
            </div>
          ) : (
            <FadeIn show={!isPendingPopular && !isLoadingTab} deps={popularActive}>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {popularData[popularActive]?.map((e, i) => (
                  <div key={i} onClick={() => window.open(`/home/event/${e.slug}`)}>
                    {console.log(e)}
                    <EventCard {...e} />
                  </div>
                ))}
              </div>
            </FadeIn>
          )}
        </div>

        {/* Categories */}
        <div className="mt-14">
          {isPendingCategory ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
              {[...Array(6)].map((_, i) => <SkeletonLoader key={i} className="h-32" />)}
            </div>
          ) : (
            <FadeIn show={!isPendingCategory} deps={categories}>
              <CategoryGrid categories={categories} />
            </FadeIn>
          )}
        </div>

        {/* Explore Local */}
        <div className="mt-14">
          <SectionHeader title="Discover Local Event" />
          {isPendingRegions ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-40" />)}
            </div>
          ) : (
            <FadeIn show={!isPendingRegions} deps={regions}>
              <CityGrid regions={regions} />
            </FadeIn>
          )}
        </div>
      </div>
    </div>
  );
}

// Removed old FilterAction; using PopularTabs component.

DashboardContent.propTypes = {
  initial: PropTypes.object,
};

export default function Dashboard(props) {
  return (
    <ErrorBoundary>
      <DashboardContent {...props} />
    </ErrorBoundary>
  );
}
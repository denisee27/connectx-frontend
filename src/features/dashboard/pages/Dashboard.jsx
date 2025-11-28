import React, { useMemo } from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import ErrorBoundary from "../../../shared/components/ui/ErrorBoundary.jsx";
import SectionHeader from "../components/SectionHeader.jsx";
import EventCard from "../components/EventCard.jsx";
import CategoryGrid from "../components/CategoryGrid.jsx";
import CityGrid from "../components/CityGrid.jsx";
import PopularTabs from "../components/PopularTabs.jsx";
import FeaturedGrid from "../components/FeaturedGrid.jsx";
import { useCategories, useHighlights, usePopular, useRegionRooms } from "../hooks/useDashboard.js";
import { useAuthStore } from "../../auth/stores/authStore.js";
import SkeletonLoader from "../../../shared/components/ui/SkeletonLoader.jsx";
import { FadeIn } from "../../../shared/components/ui/FadeIn.jsx";

function DashboardContent({ initial }) {
  const navigate = useNavigate();
  const { data: categories = [], isPending: isPendingCategory } = useCategories();
  const { data: highlights = [], isPending: isPendingHighlights } = useHighlights();
  const { data: popular = [], isPending: isPendingPopular } = usePopular();
  const { data: regions = [], isPending: isPendingRegions } = useRegionRooms();
  const accessToken = useAuthStore((state) => state.accessToken);

  // Tabs for "Acara Populer"
  const popularTabs = useMemo(() => {
    if (!popular || popular.length === 0) {
      return [
        { key: "dinner", label: "Dinner" },
        { key: "meetup", label: "Meetup" },
        { key: "event", label: "Event" },
      ];
    }
    const types = [...new Set(popular.map((p) => p.type))];
    const tabOrder = ["dinner", "meetup", "event"];
    const tabs = tabOrder
      .filter((type) => types.includes(type))
      .map((type) => ({
        key: type,
        label: type.charAt(0).toUpperCase() + type.slice(1),
      }));
    return tabs.length > 0 ? tabs : [{ key: "event", label: "Event" }];
  }, [popular]);



  const [popularActive, setPopularActive] = React.useState("dinner");

  // Set initial active tab based on available data
  React.useEffect(() => {
    if (popularTabs.length > 0 && !popularTabs.find((t) => t.key === popularActive)) {
      setPopularActive(popularTabs[0].key);
    }
  }, [popularTabs, popularActive]);

  const popularData = useMemo(() => {
    if (!popular || popular.length === 0) {
      return { dinner: [], meetup: [], event: [] };
    }
    return popular.reduce((acc, item) => {
      const type = item.type || "event"; // Default to 'event' if type is not specified
      if (!acc[type]) {
        acc[type] = [];
      }
      acc[type].push({
        id: item.id,
        title: item.title,
        venue: item.address,
        slug: item.slug,
        date: item.datetime,
        banner: item.banner,
        placeName: item.placeName,
        dateISO: item.datetime,
        meta: `${item.category?.name || "General"} • ${item.city?.name || "City"}`,
      });
      return acc;
    }, {});
  }, [popular]);

  /**
   * FadeIn wrapper for smooth content transitions when tab changes
   */


  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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
            subtitle="Jakarta"
            action={<PopularTabs tabs={popularTabs} active={popularActive} onChange={setPopularActive} />}
          />
          {isPendingPopular ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => <SkeletonLoader key={i} className="h-80" />)}
            </div>
          ) : (
            <FadeIn show={!isPendingPopular} deps={popularActive}>
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
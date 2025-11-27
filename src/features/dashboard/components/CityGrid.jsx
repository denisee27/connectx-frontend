import React from "react";
import PropTypes from "prop-types";
import EventCard from "./EventCard.jsx";

function Tab({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "rounded-full px-3 py-1.5 text-sm transition-colors cursor-pointer " +
        (active
          ? "bg-primary text-white shadow-sm"
          : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100")
      }
      aria-selected={active}
    >
      {label}
    </button>
  );
}

function CityItem({ name, abbr, count, colorClass }) {
  return (
    <div className="flex text-start items-center gap-4 rounded-lg border border-gray-200 bg-white p-3 transition-shadow hover:shadow-sm">
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorClass}`}
      >
        <span className="uppercase">
          {name.slice(0, 2)}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-500">{count} Event</p>
      </div>
    </div>
  );
}

export default function CityGrid({ regions, initialActive = "Asia" }) {
  const tabs = React.useMemo(() => regions?.map((r) => ({ key: r.name, label: r.name })) || [], [regions]);
  const [active, setActive] = React.useState(initialActive);

  const activeRegion = React.useMemo(() => regions?.find((r) => r.name === active) || null, [regions, active]);

  const accentColors = React.useMemo(
    () => [
      "bg-orange-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-green-600",
      "bg-blue-600",
      "bg-purple-600",
      "bg-amber-500",
      "bg-teal-600",
    ],
    []
  );

  return (
    <div>
      {/* Tabs */}
      <div className="mb-5 flex flex-wrap items-center gap-2">
        {tabs.length > 0 ? (
          tabs.map((t) => (
            <Tab key={t.key} label={t.label} active={t.key === active} onClick={() => setActive(t.key)} />
          ))
        ) : (
          <div className="text-sm text-gray-500">Tidak ada region tersedia</div>
        )}
      </div>

      {/* Content */}
      <div className="transition-opacity duration-200">
        {/* Cities grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {activeRegion?.cities?.length ? (
            activeRegion.cities.map((city, i) => (
              <CityItem
                key={city.name}
                name={city.name}
                abbr={city.abbr}
                count={city.count}
                colorClass={accentColors[i % accentColors.length]}
              />
            ))
          ) : (
            <div className="col-span-full rounded-lg border border-gray-200 bg-white p-6 text-center text-sm text-gray-600">
              Tidak ada kota untuk region ini.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

CityGrid.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      cities: PropTypes.arrayOf(
        PropTypes.shape({ name: PropTypes.string.isRequired, abbr: PropTypes.string.isRequired, count: PropTypes.number.isRequired })
      ),
    })
  ),
  initialActive: PropTypes.string,
};
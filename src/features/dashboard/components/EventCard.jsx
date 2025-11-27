import React from "react";
import PropTypes from "prop-types";

function formatEventDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ];
  const dayName = days[d.getDay()];
  const dayNum = String(d.getDate()).padStart(2, "0");
  const monthName = months[d.getMonth()];
  const year = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dayName}, ${dayNum} ${monthName} ${year}, ${hh}.${mm}`;
}

export default function EventCard({ title, venue, date, dateISO, thumbnail, badge, meta }) {
  const [category, location] = React.useMemo(() => {
    if (!meta) return [null, null];
    const parts = String(meta).split("•").map((p) => p.trim());
    return [parts[0] || null, parts[1] || null];
  }, [meta]);

  const displayDate = dateISO ? formatEventDate(dateISO) : date || "";

  return (
    <div className="hover:cursor-pointer group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {thumbnail && (
        <img
          src={thumbnail}
          alt={title}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-36"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 truncate text-sm text-gray-600">{venue}</p>
          </div>
          {badge && (
            <span className="ml-2 inline-flex shrink-0 items-center rounded-full bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700">
              {badge}
            </span>
          )}
        </div>

        {(category || location) && (
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            {category && <span className="font-medium text-gray-700">{category}</span>}
            {category && location && <span className="h-1 w-1 rounded-full bg-gray-300" />}
            {location && <span>{location}</span>}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700">{displayDate}</span>
        </div>
      </div>
    </div>
  );
}

EventCard.propTypes = {
  title: PropTypes.string.isRequired,
  venue: PropTypes.string,
  date: PropTypes.string,
  dateISO: PropTypes.string,
  thumbnail: PropTypes.string,
  badge: PropTypes.string,
  meta: PropTypes.string,
};
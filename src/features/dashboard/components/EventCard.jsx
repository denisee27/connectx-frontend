import React from "react";
import { env } from "../../../core/config/env";
import { format } from "date-fns";

export default function EventCard({ title, placeName, date, dateISO, banner, badge, meta }) {
  const [category, location] = React.useMemo(() => {
    if (!meta) return [null, null];
    const parts = String(meta).split("•").map((p) => p.trim());
    return [parts[0] || null, parts[1] || null];
  }, [meta]);

  const displayDate = dateISO ? format(new Date(dateISO), "eee, dd MMM yyyy, HH:mm") : date || "";

  return (
    <div className="hover:cursor-pointer group overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-200 hover:shadow-md">
      {banner && (
        <img
          src={env.VITE_API_BASE_URL + '/rooms/image/' + banner}
          alt={title}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-36"
        />
      )}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-gray-900">{title}</h3>
            <p className="mt-1 truncate text-sm text-gray-600">{placeName}</p>
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
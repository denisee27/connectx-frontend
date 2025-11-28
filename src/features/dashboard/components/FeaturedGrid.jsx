/**
 * FeaturedGrid
 * Grid layout for the "Unggulan" section, matching reference: left image + vertical info.
 * Ensures proportional image, consistent spacing, and responsive columns.
 */
import React from "react";
import PropTypes from "prop-types";
import { env } from "../../../core/config/env";
import { format } from "date-fns";

function formatEventDate(isoString) {
  if (!isoString) return "";
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return "";
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  const dayName = days[d.getDay()];
  const dayNum = String(d.getDate()).padStart(2, "0");
  const monthName = months[d.getMonth()];
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${dayName}, ${dayNum} ${monthName}, ${hh}.${mm}`;
}

function FeaturedItem({ title, city, placeName, dateISO, banner, slug }) {
  return (
    <div onClick={() => window.open(`/home/event/${slug}`)} className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-3 transition-shadow duration-200 hover:shadow-sm">
      {banner && (
        <img
          src={env.VITE_API_BASE_URL + '/rooms/image/' + banner}
          alt={title}
          className="h-16 w-16 shrink-0 rounded-lg object-cover sm:h-20 sm:w-20"
        />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-gray-900">{title}</p>
        <p className="mt-1 text-sm text-gray-600">{format(new Date(dateISO), "eee, dd MMM yyyy, HH:mm")}</p>
        <p className="mt-0.5 text-sm text-gray-600">{placeName}, {city}</p>
      </div>
    </div>
  );
}

export default function FeaturedGrid({ items }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items?.map((e, i) => (
        <FeaturedItem key={`featured-grid-${i}`} title={e.title} city={e.city?.name} placeName={e.placeName} dateISO={e.datetime} banner={e.banner} slug={e.slug} />
      ))}
    </div>
  );
}
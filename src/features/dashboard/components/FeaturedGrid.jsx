/**
 * FeaturedGrid
 * Grid layout for the "Unggulan" section, matching reference: left image + vertical info.
 * Ensures proportional image, consistent spacing, and responsive columns.
 */
import { CalendarCheck, Handshake, Utensils, } from "lucide-react";
import { env } from "../../../core/config/env";
import { format } from "date-fns";

function FeaturedItem({ type, title, city, placeName, dateISO, banner, slug }) {
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
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-primary px-3 py-1 text-sm shadow-sm">
          {type === 'dinner' ?
            <Utensils size={16} className="text-white" /> :
            type === 'meetup' ?
              <Handshake size={16} className="text-white" /> :
              <CalendarCheck size={16} className="text-white" />
          }
          <span className="capitalize text-white">
            {type}
          </span>
        </span>
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
        <FeaturedItem key={`featured-grid-${i}`} type={e.type} title={e.title} city={e.city?.name} placeName={e.placeName} dateISO={e.datetime} banner={e.banner} slug={e.slug} />
      ))}
    </div>
  );
}
/**
 * PopularTabs
 * Renders pill-style tabs used in the "Acara Populer" section.
 * Active tab styling is prominent; non-active tabs have hover state.
 */
import React from "react";
import PropTypes from "prop-types";
import { CalendarCheck, Handshake, Utensils } from "lucide-react";

export default function PopularTabs({ tabs, active, onChange }) {
  if (!tabs || tabs.length === 0) return null;

  const getIcon = (label) => {
    const lowerLabel = label.toLowerCase();
    if (lowerLabel === "dinner") return <Utensils size={16} />;
    if (lowerLabel === "meetup") return <Handshake size={16} />;
    return <CalendarCheck size={16} />;
  };

  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange?.(t.key)}
          aria-selected={active === t.key}
          className={
            "flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 " +
            (active === t.key
              ? "bg-primary text-white shadow-md scale-105"
              : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900")
          }
        >
          {getIcon(t.label)}
          <span className="capitalize">{t.label}</span>
        </button>
      ))}
    </div>
  );
}

PopularTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string.isRequired, label: PropTypes.string.isRequired })
  ),
  active: PropTypes.string,
  onChange: PropTypes.func,
};
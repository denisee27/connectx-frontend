/**
 * PopularTabs
 * Renders pill-style tabs used in the "Acara Populer" section.
 * Active tab styling is prominent; non-active tabs have hover state.
 */
import React from "react";
import PropTypes from "prop-types";

export default function PopularTabs({ tabs, active, onChange }) {
  if (!tabs || tabs.length === 0) return null;
  return (
    <div className="flex items-center gap-2">
      {tabs.map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={() => onChange?.(t.key)}
          aria-selected={active === t.key}
          className={
            "cursor-pointer rounded-full px-3 py-1.5 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 " +
            (active === t.key
              ? "bg-secondary text-white shadow-sm"
              : "border border-gray-300 bg-white text-gray-800 hover:bg-gray-100")
          }
        >
          {t.label}
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
import React from "react";
import PropTypes from "prop-types";

export default function Chip({ label, color = "gray" }) {
  const colorMap = {
    gray: "bg-gray-100 text-gray-700",
    green: "bg-green-100 text-green-700",
    indigo: "bg-indigo-100 text-indigo-700",
    orange: "bg-orange-100 text-orange-700",
    pink: "bg-pink-100 text-pink-700",
    purple: "bg-purple-100 text-purple-700",
    teal: "bg-teal-100 text-teal-700",
    blue: "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
      colorMap[color] || colorMap.gray
    }`}>{label}</span>
  );
}

Chip.propTypes = {
  label: PropTypes.string.isRequired,
  color: PropTypes.oneOf(["gray", "green", "indigo", "orange", "pink", "purple", "teal", "blue"]),
};
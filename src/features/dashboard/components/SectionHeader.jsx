import React from "react";
import PropTypes from "prop-types";

export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
      </div>
      {action && <div className="w-full overflow-x-auto sm:w-auto pb-1 sm:pb-0">{action}</div>}
    </div>
  );
}

SectionHeader.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
};
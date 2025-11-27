import React from "react";
import PropTypes from "prop-types";

/**
 * FadeIn wrapper for smooth content transitions
 */
export const FadeIn = ({ deps, children, show }) => {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setVisible(false);
    if (show) {
      const timer = setTimeout(() => setVisible(true), 10); // Small delay to trigger transition
      return () => clearTimeout(timer);
    }
  }, [deps, show]);

  return (
    <div
      className={`transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

FadeIn.propTypes = {
  deps: PropTypes.any,
  children: PropTypes.node.isRequired,
  show: PropTypes.bool.isRequired,
};

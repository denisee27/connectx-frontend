import React from 'react';

const SkeletonLoader = ({ className }) => {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-md ${className}`}></div>
  );
};

export default SkeletonLoader;

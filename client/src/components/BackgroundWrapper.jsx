import React from 'react';

function BackgroundWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 dark:bg-[#0f172a] dark:text-gray-100 transition-colors duration-300">
      {children}
    </div>
  );
}

export default BackgroundWrapper;
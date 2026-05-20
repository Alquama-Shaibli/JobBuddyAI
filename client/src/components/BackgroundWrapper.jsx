import React from 'react';

function BackgroundWrapper({ children }) {
  return (
    <div className="bg-white text-gray-700 dark:bg-gray-900 dark:text-gray-200 min-h-screen transition-colors duration-500">
      {children}
    </div>
  );
}

export default BackgroundWrapper;
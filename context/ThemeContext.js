import React, { createContext, useContext, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  const theme = {
    darkMode,
    colors: {
      background:   darkMode ? '#0f1923' : '#f0f4f5',
      card:         darkMode ? '#1e2d3d' : '#ffffff',
      text:         darkMode ? '#e8f4f8' : '#1a3a42',
      subText:      darkMode ? '#7fa0a8' : '#7fa0a8',
      sectionLabel: darkMode ? '#5a8a95' : '#8aa5ac',
      border:       darkMode ? '#2a3d4d' : '#edf1f2',
      hero:         darkMode ? '#1a2e3d' : '#3aa0b8',
      iconBgBlue:   darkMode ? '#1a3a4a' : '#e4f5f9',
      iconBgPurple: darkMode ? '#2a2040' : '#eeebfd',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
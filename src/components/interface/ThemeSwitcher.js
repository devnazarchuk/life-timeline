import React, { useEffect, useState } from 'react';

const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem('theme');
    if (mode) {
      setDarkMode(mode === 'dark');
      document.body.classList.toggle('dark-mode', mode === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    const newMode = darkMode ? 'light' : 'dark';
    localStorage.setItem('theme', newMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  return (
    <button onClick={toggleTheme} style={{ marginLeft: '10px' }}>
      {darkMode ? 'Light Mode' : 'Dark Mode'}
    </button>
  );
};

export default ThemeSwitcher;

import React, { useState, useEffect } from 'react';
import styles from '../styles/Main.module.css';

const Main = () => {
  const [shape, setShape] = useState('square');
  const [interval, setInterval] = useState('years');
  const [color, setColor] = useState('green');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem('theme');
    if (mode) {
      setDarkMode(mode === 'dark');
      document.body.classList.toggle('dark-mode', mode === 'dark');
    }
  }, []);

  const handleShapeChange = (newShape) => {
    setShape(newShape);
  };

  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
  };

  const handleColorChange = (newColor) => {
    setColor(newColor);
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    const newMode = darkMode ? 'light' : 'dark';
    localStorage.setItem('theme', newMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const generateLifeGrid = () => {
    const totalYears = 90;
    const totalElements = interval === 'weeks' ? totalYears * 52 : interval === 'months' ? totalYears * 12 : totalYears;
    let elements = [];

    for (let i = 0; i < totalElements; i++) {
      elements.push(
        <div key={i} className={`${styles[shape]} ${styles.gridItem} ${styles[color]}`}></div>
      );
    }

    return elements;
  };

  return (
    <div className={styles.container}>
      <h1>Life Timeline</h1>
      <div className={styles.topControls}>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Shape</button>
          <div className={styles.dropdownContent}>
            <button onClick={() => handleShapeChange('square')}>Square</button>
            <button onClick={() => handleShapeChange('circle')}>Circle</button>
            <button onClick={() => handleShapeChange('heart')}>Heart</button>
            <button onClick={() => handleShapeChange('triangle')}>Triangle</button>
          </div>
        </div>
        <div className={styles.dropdown}>
          <button className={styles.dropbtn}>Color</button>
          <div className={styles.dropdownContent}>
            <button onClick={() => handleColorChange('green')}>Green</button>
            <button onClick={() => handleColorChange('red')}>Red</button>
            <button onClick={() => handleColorChange('blue')}>Blue</button>
            <button onClick={() => handleColorChange(darkMode ? 'white' : 'black')}>
              {darkMode ? 'White' : 'Black'}
            </button>
          </div>
        </div>
        <button className={styles.themeButton} onClick={toggleTheme}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className={styles.controls}>
        <button onClick={() => handleIntervalChange('weeks')}>Weeks</button>
        <button onClick={() => handleIntervalChange('months')}>Months</button>
        <button onClick={() => handleIntervalChange('years')}>Years</button>
      </div>
      <div className={styles.grid}>
        {generateLifeGrid()}
      </div>
    </div>
  );
};

export default Main;

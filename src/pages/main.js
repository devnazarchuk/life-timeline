import React, { useState, useEffect } from 'react';
import styles from '../styles/Main.module.css';
import { useRouter } from 'next/router';

const Main = () => {
  const [shape, setShape] = useState('square');
  const [interval, setInterval] = useState('years');
  const [color, setColor] = useState('green');
  const [darkMode, setDarkMode] = useState(false);
  const [searchDate, setSearchDate] = useState('');
  const router = useRouter();
  const { birthDate } = router.query;


  useEffect(() => {
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const mode = localStorage.getItem('theme') || (userPrefersDark ? 'dark' : 'light');
    setDarkMode(mode === 'dark');
    document.body.classList.toggle('dark-mode', mode === 'dark');
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
    const newMode = !darkMode ? 'dark' : 'light';
    setDarkMode(!darkMode);
    localStorage.setItem('theme', newMode);
    document.body.classList.toggle('dark-mode', !darkMode);
  };

  const handleSearch = () => {
    router.push(`/date/${searchDate}`);
  };

  const generateLifeGrid = () => {
    const totalYears = 90;
    const totalElements = interval === 'weeks' ? totalYears * 52 : interval === 'months' ? totalYears * 12 : totalYears;
    let elements = [];
    const currentDate = new Date();

    const getTimeDifference = () => {
      if (interval === 'weeks') {
        return Math.floor((currentDate - new Date(birthDate)) / (1000 * 60 * 60 * 24 * 7));
      } else if (interval === 'months') {
        return (currentDate.getFullYear() - new Date(birthDate).getFullYear()) * 12 + (currentDate.getMonth() - new Date(birthDate).getMonth());
      } else {
        return currentDate.getFullYear() - new Date(birthDate).getFullYear();
      }
    };
    const timeDifference = getTimeDifference();

    for (let i = 0; i < totalElements; i++) {
      let itemColor = i < timeDifference ? (darkMode ? 'white' : 'black') : i === timeDifference ? 'orange' : color;
      let itemStyle = { backgroundColor: itemColor };

      if (shape === 'heart') {
        itemStyle = {
          ...itemStyle,
          width: '35px',
          height: '35px',
          position: 'relative',
          transform: 'rotate(-45deg)',
          backgroundColor: i < timeDifference ? (darkMode ? 'white' : 'black') : i === timeDifference ? 'orange' : color,
        };
      }

      elements.push(
        <div
          key={i}
          className={`${styles[shape]} ${styles.gridItem}`}
          style={itemStyle}
          title={`Interval ${i + 1}`}
          onClick={() => router.push(`/interval/${i + 1}`)}
        >
          {shape === 'heart' && (
            <>
              <div
                style={{
                  content: '""',
                  position: 'absolute',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  backgroundColor: i < timeDifference ? (darkMode ? 'white' : 'black') : i === timeDifference ? 'orange' : color,
                  top: '-15px',
                  left: '0',
                }}
              ></div>
              <div
                style={{
                  content: '""',
                  position: 'absolute',
                  width: '35px',
                  height: '35px',
                  borderRadius: '50%',
                  backgroundColor: i < timeDifference ? (darkMode ? 'white' : 'black') : i === timeDifference ? 'orange' : color,
                  left: '15px',
                  top: '0',
                }}
              ></div>
            </>
          )}
        </div>
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
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
      <div className={styles.controls}>
        <button onClick={() => handleIntervalChange('weeks')}>Weeks</button>
        <button onClick={() => handleIntervalChange('months')}>Months</button>
        <button onClick={() => handleIntervalChange('years')}>Years</button>
      </div>
      <div className={styles.search}>
        <input
          type="date"
          
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button onClick={handleSearch} className={styles.searchButton}>Search</button>
      </div>
      <div className={styles.grid}>
        {generateLifeGrid()}
      </div>
    </div>
  );
};

export default Main;

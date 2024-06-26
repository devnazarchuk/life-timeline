import React, { useState } from 'react';
import styles from '../styles/Main.module.css';

const Main = () => {
  const [shape, setShape] = useState('square');
  const [interval, setInterval] = useState('years');
  
  const handleShapeChange = (newShape) => {
    setShape(newShape);
  };
  
  const handleIntervalChange = (newInterval) => {
    setInterval(newInterval);
  };

  const generateLifeGrid = () => {
    const totalYears = 90;
    const totalElements = interval === 'weeks' ? totalYears * 52 : interval === 'months' ? totalYears * 12 : totalYears;
    let elements = [];

    for (let i = 0; i < totalElements; i++) {
      elements.push(
        <div key={i} className={`${styles[shape]} ${styles.gridItem}`}></div>
      );
    }

    return elements;
  };

  return (
    <div className={styles.container}>
      <h1>Life Timeline</h1>
      <div className={styles.controls}>
        <button onClick={() => handleShapeChange('square')}>Square</button>
        <button onClick={() => handleShapeChange('circle')}>Circle</button>
        <button onClick={() => handleShapeChange('heart')}>Heart</button>
        <button onClick={() => handleShapeChange('triangle')}>Triangle</button>
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

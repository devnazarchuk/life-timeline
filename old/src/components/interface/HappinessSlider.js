import React, { useState } from 'react';
import styles from '../../styles/Intro.module.css';

const HappinessSlider = ({ happiness, setHappiness }) => {
  const handleSliderChange = (e) => {
    setHappiness(e.target.value);
  };

  const getEmoji = (value) => {
    if (value > 75) return '😄';
    if (value > 50) return '🙂';
    if (value > 25) return '😐';
    return '☹️';
  };

  return (
    <div className={styles.sliderContainer}>
      <input
        type="range"
        min="0"
        max="100"
        value={happiness}
        onChange={handleSliderChange}
        className={styles.slider}
      />
      <span className={styles.emoji}>{getEmoji(happiness)}</span>
    </div>
  );
};

export default HappinessSlider;

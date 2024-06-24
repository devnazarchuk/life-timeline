import React, { useState } from 'react';
import HappinessSlider from './interface/HappinessSlider';
import styles from '../styles/Intro.module.css'; 

const UserForm = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [happiness, setHappiness] = useState(50);
  const [birthDate, setBirthDate] = useState({
    day: '',
    month: '',
    year: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Обробка даних форми
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="gender">Gender:</label>
        <select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label>Happiness Level:</label>
        <HappinessSlider happiness={happiness} setHappiness={setHappiness} />
      </div>
      <div className={styles.formGroup}>
        <label>Date of Birth:</label>
        <div className={styles.datePicker}>
          <input
            type="number"
            placeholder="Day"
            value={birthDate.day}
            onChange={(e) => setBirthDate({ ...birthDate, day: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Month"
            value={birthDate.month}
            onChange={(e) => setBirthDate({ ...birthDate, month: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Year"
            value={birthDate.year}
            onChange={(e) => setBirthDate({ ...birthDate, year: e.target.value })}
            required
          />
        </div>
      </div>
      <button type="submit" className={styles.submitButton}>Submit</button>
    </form>
  );
};

export default UserForm;

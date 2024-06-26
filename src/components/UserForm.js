import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HappinessSlider from './interface/HappinessSlider';
import styles from '../styles/Intro.module.css';
import { useRouter } from 'next/router';

const UserForm = () => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('');
  const [country, setCountry] = useState('');
  const [happiness, setHappiness] = useState(50);
  const [birthDate, setBirthDate] = useState(null);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Обробка даних форми
    router.push('/main'); // Перенаправлення на основну сторінку
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
        <DatePicker
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          dateFormat="dd/MM/yyyy"
          placeholderText="Select your birth date"
          className={styles.datePicker}
        />
      </div>
      <button type="submit" className={styles.submitButton}>Submit</button>
    </form>
  );
};

export default UserForm;

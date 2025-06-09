import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import HappinessSlider from "../components/interface/HappinessSlider";
import styles from "../styles/Intro.module.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Intro = () => {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [happiness, setHappiness] = useState(50);
  const [birthDate, setBirthDate] = useState(null); 
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const userPrefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    const mode =
      localStorage.getItem("theme") || (userPrefersDark ? "dark" : "light");
    setDarkMode(mode === "dark");
    document.body.classList.toggle("dark-mode", mode === "dark");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedDate = birthDate.toLocaleDateString('en-GB').split('/').reverse().join('-');
    router.push({
      pathname: '/main',
      query: { birthDate: formattedDate },
    });
  };

  const toggleTheme = () => {
    const newMode = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    localStorage.setItem("theme", newMode);
    document.body.classList.toggle("dark-mode", !darkMode);
  };

  return (
    <div className={styles.container}>
      <button className={styles.themeButton} onClick={toggleTheme}>
        {darkMode ? "🌙" : "☀️"}
      </button>
      <h1>Welcome</h1>
      <p className={styles.p}>Please fill in the form below to get started.</p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          type="text"
          placeholder="Name"
          className={styles.formText}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          id="gender"
          className={styles.formText}
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <input
          type="text"
          placeholder="Country"
          className={styles.formText}
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <DatePicker
          selected={birthDate}
          onChange={(date) => setBirthDate(date)}
          dateFormat="dd/MM/yyyy"
          className={styles.formText}
          placeholderText="Birth Date"
          required
        />
        <label className={styles.label}>Happiness Level:</label>
        <HappinessSlider happiness={happiness} setHappiness={setHappiness} />
        <button type="submit" className={styles.submitButton}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default Intro;

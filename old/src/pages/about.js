import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import styles from '../styles/Home.module.css';

const About = () => (
  <div className={styles.container}>
    <Header />
    <main className={styles.main}>
      <h1 className={styles.h1}>About Us</h1>
      <p className={styles.p}>This is the about page.</p>
    </main>
    <Footer />
  </div>
);

export default About;

import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import styles from '../styles/Home.css';

const Home = () => (
  <div className={styles.container}>
    <Header />
    <main>
      <h1>Welcome to My Next.js Project</h1>
      <p>This is the homepage.</p>
    </main>
    <Footer />
  </div>
);

export default Home;

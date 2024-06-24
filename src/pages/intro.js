import React from 'react';
import UserForm from '../components/UserForm';
import styles from '../styles/Intro.module.css';

const Intro = () => (
  <div className={styles.container}>
    <h1>Welcome to the Life Timeline Project</h1>
    <UserForm />
  </div>
);

export default Intro;

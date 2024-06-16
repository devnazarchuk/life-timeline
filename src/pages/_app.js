import React from 'react';
import '../styles/globals.css'; // Імпорт глобальних стилів

const MyApp = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

export default MyApp;

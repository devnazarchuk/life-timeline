// pages/_app.js
import '../styles/globals.css';
import '../styles/Intro.module.css';
import '../styles/Main.module.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

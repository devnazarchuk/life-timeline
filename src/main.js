import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './assets/main.css';
import './assets/tailwind.css';

// Create the app
const app = createApp(App);

// Use Pinia and router
app.use(createPinia());
app.use(router);

// Mount the app
app.mount('#app');

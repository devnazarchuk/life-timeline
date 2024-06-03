import { createRouter, createWebHistory } from 'vue-router';
import UserForm from '../components/UserForm.vue';
import Timeline from '../components/Timeline.vue';
import DateView from '../components/DateView.vue';

const routes = [
  { path: '/', name: 'Home', component: UserForm },
  { path: '/timeline', name: 'Timeline', component: Timeline, props: true },
  { path: '/date/:date', name: 'DateView', component: DateView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

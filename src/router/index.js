import { createRouter, createWebHistory } from 'vue-router';
import UserForm from '../components/UserForm.vue';
import Timeline from '../components/Timeline.vue';
import DateView from '../components/DateView.vue';

const routes = [
  { path: '/', name: 'Home', component: UserForm },
  { 
    path: '/timeline', 
    name: 'Timeline', 
    component: Timeline, 
    props: route => ({
      name: route.query.name,
      gender: route.query.gender,
      country: route.query.country,
      happiness: route.query.happiness,
      birthdate: route.query.birthdate,
    })
  },
  { path: '/date/:date', name: 'DateView', component: DateView, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

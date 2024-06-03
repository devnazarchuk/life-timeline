import Vue from 'vue';
import VueRouter from 'vue-router';
import UserForm from '../components/UserForm.vue';
import Timeline from '../components/Timeline.vue';
import DateView from '../components/DateView.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/', name: 'Home', component: UserForm },
  { path: '/timeline', name: 'Timeline', component: Timeline, props: true },
  { path: '/date/:date', name: 'DateView', component: DateView, props: true },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;

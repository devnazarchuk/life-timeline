import Vue from 'vue';
import Router from 'vue-router';
import UserForm from '../components/UserForm.vue';
import Calendar from '../components/Calendar.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: UserForm
    },
    {
      path: '/calendar',
      component: Calendar
    }
  ]
});

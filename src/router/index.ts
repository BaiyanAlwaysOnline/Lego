import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import Detail from '../views/Detail.vue';
import Index from '../views/Index.vue';
import Login from '../views/Login.vue';
import Editor from '../views/Editor.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Index',
    component: Index,
    children: [
      { path: '', name: 'Home', component: Home },
      { path: 'detail/:id', name: 'Detail', component: Detail },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/editor',
    name: 'Editor',
    component: Editor,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

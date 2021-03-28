import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.css';
import {
  Card,
  Layout,
  Avatar,
  Icon,
} from 'ant-design-vue';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
  .use(Card)
  .use(Icon)
  .use(Layout)
  .use(Avatar)
  .use(store)
  .use(router)
  .mount('#app');

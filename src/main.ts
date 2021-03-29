import { createApp } from 'vue';
import 'ant-design-vue/dist/antd.css';
import Antd from 'ant-design-vue/es';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App)
  .use(Antd)
  .use(store)
  .use(router)
  .mount('#app');

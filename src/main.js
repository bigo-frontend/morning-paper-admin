import 'babel-polyfill';

import Vue from 'vue';

import 'normalize.css/normalize.css';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import '@/styles/index.scss'; // global css

import App from './App';
import store from './store';
import router from './router';

import '@/icons'; // icon

import '@/permission'; // permission control

import filters from '@/filters';

import Alert from '@/plugin/alert.js';

Vue.use(filters);

Vue.use(ElementUI);

Vue.use(Alert);

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
});

import Vue from 'vue';
import App from './App';
import router from './route';

// eslint-disable-next-line no-new
new Vue({
  el: '#app',
  router,
  render: h => h(App) // es6渲染App
});

import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import goods from '../components/goods/goods';
import ratings from '../components/ratings/ratings';
import seller from '../components/seller/seller';
import '../util/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);
// Vue 2.0路由写法
export default new VueRouter({
  // 路由active
  linkActiveClass: 'active',
  routes: [
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    },
    {
      path: '/',
      redirect: '/goods'
    }
  ]
});

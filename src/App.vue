<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由 -->
    <router-view></router-view>
  </div>
</template>

<script>
import header from './components/header/header';
const ERR_OK = 0;
export default {
  name: 'app',
  data () {
    return {
      seller: {}
    };
  },
  // 相当于componetwillmount
  created () {
    this.$http
      .get('/api/seller')
      .then(res => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.seller = res.data;
          console.log(this.seller);
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  components: {
    'v-header': header
  }
};
</script>

<style lang='stylus' rel='stylesheet/stylus'>
// 引入封装的style
@import './util/stylus/mixin.styl';

#app {
  .tab {
    display: flex;
    width: 100%;
    height: 40px;
    line-height: 40px;
    // 调用封装的style
    border-1px(rgba(7, 17, 27, 0.1));

    .tab-item {
      flex: 1;
      text-align: center;

      // 伪类选择器
      &>a {
        display: block;
        font-size: 14px;
        color: rgb(77, 85, 93);

        &.active {
          color: rgb(240, 20, 20);
        }
      }
    }
  }
}
</style>

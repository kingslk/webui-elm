<template>
  <div class="cartcontrol">
    <transition name="move">
      <div
        class="cart-decrease "
        v-show="food.count > 0"
        @click.stop.prevent="decreaseCart"
      >
        <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count > 0">{{ food.count }}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
  </div>
</template>
<script>
import Vue from 'vue';
export default {
  props: {
    food: {
      type: Object
    }
  },
  methods: {
    addCart () {
      if (!this.food.count) {
        // 在food中添加了一个count
        Vue.set(this.food, 'count', 1);
      } else {
        this.food.count++;
      }
      // 向上传递监听element
      this.$emit('cart-add', event.target);
    },
    decreaseCart () {
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>
<style lang="stylus">
// padding增加点击区域
.cartcontrol {
  font-size: 0;
  display: flex;
  align-items: center;

  // 减少图标动画
  .cart-decrease {
    display: inline-block;
    padding: 6px;

    .inner {
      display: inline-block;
      font-size: 24px;
      color: rgb(0, 160, 220);
      transform: rotate(0);
      transition: all 0.4s linear;
    }

    &.move-enter-active, &.move-leave-active {
      opacity: 1;
      transform: translate3d(0, 0, 0);
      transition: all 0.4s linear;
    }

    &.move-enter, &.move-leave-to {
      opacity: 0;
      transform: translate3d(24px, 0, 0);

      .inner {
        transform: rotate(180deg);
      }
    }
  }

  .cart-count {
    display: inline-block;
    width: 12px;
    text-align: center;
    font-size: 10px;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    padding: 6px;
    font-size: 24px;
    color: rgb(0, 160, 220);
  }
}
</style>

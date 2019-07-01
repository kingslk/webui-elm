<template>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          :key="index"
          class="menu-item"
          :class="{ current: currentIndex === index }"
          @click="selectMenu(index)"
        >
          <span class="text border-1px">
            <span
              v-show="item.type > 0"
              class="icon"
              :class="classMap[item.type]"
            ></span>
            <span>{{ item.name }}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li
          v-for="(item, index) in goods"
          :key="index"
          class="food-list food-list-hook"
        >
          <h1 class="title">{{ item.name }}</h1>
          <ul>
            <li
              v-for="(food, index) in item.foods"
              :key="index"
              class="food-item border-1px"
              @click="selectFood(food)"
            >
              <div class="icon">
                <img :src="food.icon" width="57" />
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span>
                  <span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <!-- span不加回车中间没有间距 -->
                  <span class="now">￥{{ food.price }}</span>
                  <span class="old" v-show="food.oldPrice"
                    >￥{{ food.oldPrice }}</span
                  >
                </div>
                <div class="cartcontrol-wrapper">
                  <!-- Vue2.0使用v-on代替$dispatch -->
                  <cartcontrol
                    :food="food"
                    v-on:cartadd="cartAdd"
                  ></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <!-- 联动购物车与商品 -->
    <shopcart
      ref="shopCart"
      :delivery-price="seller.deliveryPrice"
      :min-price="seller.minPrice"
      :select-foods="selectFoods"
      v-on:cartadd="cartAdd"
    ></shopcart>
    <!-- 食物详情覆盖层 -->
    <food :food="selectedFood" ref="food" v-on:cartadd="cartAdd"></food>
  </div>
</template>
<script type='text/ecmascript-6'>
// 滚动组件
import BScroll from 'better-scroll';
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';

const ERR_OK = 0;

export default {
  props: {
    seller: {
      type: Object
    }
  },
  components: { shopcart, cartcontrol, food },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      selectedFood: {}
    };
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];

    this.$http.get('/api/goods').then(res => {
      res = res.body;
      if (res.errno === ERR_OK) {
        this.goods = res.data;
        // 异步
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
        });
      }
    });
  },
  computed: {
    // 计算滚动区间，变换css
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    // 选中的食物
    selectFoods () {
      let foods = [];
      // 分类
      this.goods.forEach(good => {
        // 食物
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food);
          }
        });
      });
      return foods;
    }
  },
  methods: {
    // 点击滚动
    selectMenu (index) {
      // vue2.0不需要判断是浏览器还是手机端
      // if (!event._constructed) {
      //   return;
      // }
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        'food-list-hook'
      );
      let el = foodList[index];
      // 滚动到某个元素
      this.foodScroll.scrollToElement(el, 300);
    },
    selectFood (food) {
      this.selectedFood = food;
      this.$refs.food.show();
    },
    _initScroll () {
      // 监听ref的滚动
      this.menuScroll = new BScroll(this.$refs.menuWrapper, {
        // 使scroll能够点击
        click: true
      });
      this.foodScroll = new BScroll(this.$refs.foodsWrapper, {
        // 监听滚动用3
        probeType: 3,
        click: true
      });
      // 获取实时滚动高度
      this.foodScroll.on('scroll', pos => {
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight () {
      // 获取所有class为'food-list-hook'，为一个数组
      let foodList = this.$refs.foodsWrapper.getElementsByClassName(
        'food-list-hook'
      );
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        // 网页可见区域高度
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    // ref可调用shopcart中的方法
    cartAdd (el) {
      this.$nextTick(() => {
        this.$refs.shopCart.drop(el);
      });
    }
  }
};
</script>
<style lang='stylus' rel='stylesheet/stylus'>
@import '../../util/stylus/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 80px;
    width: 80px;
    background: #f3f5f7;

    .menu-item {
      // 垂直居中最好的布局
      display: table;
      height: 54px;
      width: 56px;
      line-height: 14px;
      padding: 0 12px;

      &.current {
        position: relative;
        z-index: 10;
        margin-top: -1px;
        background: #fff;
        font-weight: 700;

        .text {
          border-none();
        }
      }

      .icon {
        display: inline-block;
        width: 12px;
        height: 12px;
        margin-right: 2px;
        background-size: 12px 12px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.special {
          bg-image('special_3');
        }
      }

      .text {
        display: table-cell;
        width: 56px;
        vertical-align: middle;
        border-1px(rgba(7, 17, 27, 0.1));
        font-size: 12px;
      }
    }
  }

  .foods-wrapper {
    flex: 1;

    .title {
      padding-left: 14px;
      height: 26px;
      line-height: 26px;
      border-left: 2px solid #d9dde1;
      font-size: 12px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
    }

    .food-item {
      display: flex;
      margin: 18px;
      // ?????
      padding-bottom: 22px;
      border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        border-none();
        margin-bottom: 0;
      }

      .icon {
        flex: 0 0 57px;
        margin-right: 10px;
      }

      .content {
        flex: 1;

        .name {
          margin: 2px 0 8px 0;
          height: 14px;
          line-height: 14px;
          font-size: 14px;
          color: rgb(7, 17, 27);
        }

        .desc, .extra {
          line-height: 10px;
          font-size: 10px;
          color: rgb(147, 153, 159);
        }

        .desc {
          margin-bottom: 8px;
          line-height: 12px;
        }

        .extra {
          .count {
            margin-right: 12px;
          }
        }

        .price {
          font-weight: 700;
          line-height: 24px;

          .now {
            margin-right: 8px;
            font-size: 14px;
            color: rgb(240, 20, 20);
          }

          .old {
            text-decoration: line-through;
            font-size: 10px;
            color: rgb(147, 153, 159);
          }
        }

        .cartcontrol-wrapper {
          position: absolute;
          right: 0;
          bottom: 12px;
        }
      }
    }
  }
}
</style>

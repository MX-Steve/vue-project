<template>
  <transition :name="transitionName">
    <div v-show="visible" :style="customStyle" class="back-to-ceiling" @click="backToTop">
      <svg width="16" height="16" viewBox="0 0 17 17" xmlns="http://www.w3.org/2000/svg" class="Icon Icon--backToTopArrow" aria-hidden="true" style="height:16px;width:16px"><path d="M12.036 15.59a1 1 0 0 1-.997.995H5.032a.996.996 0 0 1-.997-.996V8.584H1.03c-1.1 0-1.36-.633-.578-1.416L7.33.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58 1.415h-3.004v7.004z" /></svg>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'BackToTop',
  props: {
    visibilityHeight: { /* 达到多大高度按钮展示 */
      type: Number,
      default: 400
    },
    backPosition: { /* 点击按钮后返回到页面什么位置 */
      type: Number,
      default: 0
    },
    customStyle: { /* 定义按钮css样式; 属性有连词符的，需要使用引号*/
      type: Object,
      default: function() {
        return {
          right: '50px',
          bottom: '50px',
          width: '40px',
          height: '40px',
          'border-radius': '4px',
          'line-height': '45px',
          background: '#e7eaf1'
        }
      }
    },
    transitionName: { /* 过渡类型,默认fade , 配置再transition标签 name 属性后 */
      type: String,
      default: 'fade'
    }
  },
  data() {
    return {
      visible: false, /* 控制开关:显示隐藏 */
      interval: null,
      isMoving: false /* 是否在运动移动 */
    }
  },
  mounted() {
    //  浏览器监听scroll滚屏事件，触发handleScroll函数
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll)
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    handleScroll() {
      //  滚动高度大于显示高度的时候，visible修改为true
      this.visible = window.pageYOffset > this.visibilityHeight
    },
    backToTop() {
      //  按钮上绑定事件: backToTop
      // isMoving初始值为false，进入下一步
      /**
       * start: 开始滚动位置
       * setInterval: 周期性循环操作,参数1:处理函数；参数2:时间(毫秒)
       * */
      if (this.isMoving) return
      const start = window.pageYOffset
      let i = 0
      this.isMoving = true
      this.interval = setInterval(() => {
        const next = Math.floor(this.easeInOutQuad(10 * i, start, -start, 500))
        if (next <= this.backPosition) {
          window.scrollTo(0, this.backPosition)
          clearInterval(this.interval)
          this.isMoving = false
        } else {
          window.scrollTo(0, next)
        }
        i++
      }, 16.7)
    },
    easeInOutQuad(t, b, c, d) {
      if ((t /= d / 2) < 1) return c / 2 * t * t + b
      return -c / 2 * (--t * (t - 2) - 1) + b
    }
  }
}
</script>

<style scoped>
.back-to-ceiling {
  position: fixed;
  display: inline-block;
  text-align: center;
  cursor: pointer;
}

.back-to-ceiling:hover {
  background: #d5dbe7;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0
}

.back-to-ceiling .Icon {
  fill: #9aaabf;
  background: none;
}
</style>

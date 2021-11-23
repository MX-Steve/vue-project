import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css' // CSS样式重置

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // 全局样式

import App from './App'
import store from './store'
import router from './router'

import './icons' // icon字体图标
import './permission' // 权限控制
import './utils/error-log' // 错误日志

import * as filters from './filters' // 全局 filter 过滤器

// 引入echarts
import echarts from 'echarts'
Vue.prototype.$echarts = echarts

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * 目前生产环境使用MockJs,如果要上线,则移除此配置
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // 设置 element-ui 默认大小: small / medium ...
})


// 注册全局工具过滤器
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false
Object.defineProperty(Vue.prototype, '$Cookies', { value: Cookies })




/**
 * 生成Vue项目实例
 */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})

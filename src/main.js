import Vue from 'vue'
import App from './App.vue'
// 导入通用的样式
import './styles/base.less'
// 导入字体图标文件
import './styles/iconfont.less'
// 导入lib-flexible模块，会自动适配所有的屏幕
// 他会给每一个屏幕设置一个html的大小  会把屏幕的大小/10 = 1rem
import 'lib-flexible'
// 导入路由对象
import router from './router'

import axios from 'axios'

// -------------------------全局注册组件-------------------------------
import HmHeader from './components/HmHeader'
import HmLogo from './components/HmLogo'
import HmButton from './components/HmButton.vue'
import HmInput from './components/HmInput.vue'
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-input', HmInput)

// axios的优化
// axios和vue没有关系，强行让axios和Vue有关系
// 把axios绑定到了vue的原型上，所有的vue实例（组件）都可以通过 this.axios访问到axios
// 给axios配置默认的基础路径
// axios在发请求的时候，把url的路径自动拼接上baseURL
axios.defaults.baseURL = 'http://localhost:3000'
Vue.prototype.$axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

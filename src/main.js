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
import HmNavbar from './components/HmNavbar.vue'
import HmPost from './components/HmPost.vue'
Vue.component('hm-header', HmHeader)
Vue.component('hm-logo', HmLogo)
Vue.component('hm-button', HmButton)
Vue.component('hm-input', HmInput)
Vue.component('hm-navbar', HmNavbar)
Vue.component('hm-post', HmPost)

// ----------------------vant-ui的处理--------------------------------
// import Vant from 'vant'
// import 'vant/lib/index.css'
// // 使用vant插件
// Vue.use(Vant)

// 按需加载的方式
import {
  Button,
  Field,
  Toast,
  Dialog,
  Radio,
  RadioGroup,
  Cell,
  CellGroup,
  Uploader,
  List,
  Tab,
  Tabs
} from 'vant'
Vue.use(Button)
Vue.use(Field)
Vue.use(Toast)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Cell)
Vue.use(CellGroup)
Vue.use(Uploader)
Vue.use(List)
Vue.use(Tab)
Vue.use(Tabs)

// axios的优化
// axios和vue没有关系，强行让axios和Vue有关系
// 把axios绑定到了vue的原型上，所有的vue实例（组件）都可以通过 this.axios访问到axios
// 给axios配置默认的基础路径
// axios在发请求的时候，把url的路径自动拼接上baseURL
axios.defaults.baseURL = 'http://localhost:3000'

// 配置axios的响应拦截器，，，，所有的axios的响应会先经过响应拦截器
// 可以在响应拦截器中对响应做一些通用的处理
axios.interceptors.response.use(function(res) {
  // 拦截器会拦截所有的请求的响应，返回拦截到的res
  // console.log('拦截到了res', res)
  // 通用对token失效进行处理
  const { statusCode, message } = res.data
  if (statusCode === 401 && message === '用户信息验证失败') {
    // 说明token是验证失败的
    // 就需要跳转到登录页面去
    router.push({ name: 'login' })
    // 删除过期的token信息
    localStorage.removeItem('token')
    localStorage.removeItem('user_id')

    // 可以给一个提示消息
    Toast.fail(message)
  }

  return res
})

// axios的请求拦截器，所有的axios的请求都会先经过axios的请求拦截器
axios.interceptors.request.use(function(config) {
  // console.log('所有的请求杯拦截le ', config)
  // 统一的给请求添加token
  const token = localStorage.getItem('token')
  // 如果token，我们就给请求添加token
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

Vue.prototype.$axios = axios

// -----------------------全局过滤器=---------------------------------
import moment from 'moment'
Vue.filter('date', function(input, format = 'YYYY-MM-DD') {
  return moment(input).format(format)
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import User from '../pages/User.vue'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由规则
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    // 命名路由：给每一个路由规则起一个名字，指定name即可。
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/user',
      component: User,
      name: 'user'
    }
  ]
})

export default router

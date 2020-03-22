// 配置路由信息
import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入组件
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import User from '../pages/User.vue'
import Edit from '../pages/Edit.vue'
import Test from '../pages/Test.vue'
import MyFollow from '../pages/MyFollow.vue'
import MyComments from '../pages/MyComments.vue'
import MyStar from '../pages/MyStar.vue'
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
    },
    {
      path: '/edit',
      component: Edit,
      name: 'edit'
    },
    {
      path: '/test',
      component: Test,
      name: 'test'
    },
    {
      path: '/my-follow',
      component: MyFollow,
      name: 'my-follow'
    },
    {
      path: '/my-comments',
      component: MyComments,
      name: 'my-comments'
    },
    {
      path: '/my-star',
      component: MyStar,
      name: 'my-star'
    }
  ]
})

// 注册全局的导航守卫
// 只要路由发生了跳转，先经过导航守卫
// 参数to: 到哪儿去
// 参数from: 从哪儿来
// next: 函数   next()表示放行  next('/login') 去登录

//1. 所有的路由跳转都要先经过导航守卫
//2. 判断是否有token,如果有token，说明就是登录的，如果没有token，那就是没有登录的

// 需要授权的路径，需要登录才能访问的路径
const authUrl = ['/user', '/edit', '/my-follow', '/my-comments', '/my-star']
router.beforeEach(function(to, from, next) {
  // console.log('to', to)
  // console.log('from', from)
  // console.log('所有的路由的跳转都必须先经过导航守卫')
  const token = localStorage.getItem('token')
  // // 如果去个人中心,必须要登录
  if (authUrl.includes(to.path)) {
    // 判断是否有token
    if (token) {
      // 有token,放行
      next()
    } else {
      // 没有token
      // 跳转到登录页
      next('/login')
    }
  } else {
    // 放行
    next()
  }
  // 简化
  // 如果去的是user并且还没有token
  // if (to.path === '/user' && !token) {
  //   next('/login')
  // } else {
  //   next()
  // }
})

export default router

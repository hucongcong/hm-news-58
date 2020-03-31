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
import Home from '../pages/Home.vue'
import PostDetail from '../pages/PostDetail.vue'
import TabEdit from '../pages/TabEdit.vue'
import Search from '../pages/Search.vue'

Vue.use(VueRouter)

// 解决NavigationDuplicated报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

const router = new VueRouter({
  // 配置路由规则
  routes: [
    {
      path: '/',
      component: Home,
      name: 'home'
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
    },
    {
      path: '/post-detail/:id',
      component: PostDetail,
      name: 'post-detail'
    },
    {
      path: '/tab-edit',
      component: TabEdit,
      name: 'tab-edit'
    },
    {
      path: '/search',
      component: Search,
      name: 'search'
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
      // next('/login')
      // 如果没有登录，不推荐使用 next('/login') 使用 router.push('/login')
      router.push({
        name: 'login'
      })
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

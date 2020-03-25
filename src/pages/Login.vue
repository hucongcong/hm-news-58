<template>
  <div class="login">
    <hm-header>登录</hm-header>
    <hm-logo></hm-logo>

    <!-- 目的：hm-input是一个组件，当成一个input框来用的，hm-input组件要有input框的能力 -->
    <!-- 要求用户名只能是手机号  10086 10010 -->
    <hm-input
      type="text"
      placeholder="请输入用户名"
      v-model="username"
      :rule="/^1\d{4,10}$/"
      message="用户名格式不对"
      ref="username"
    ></hm-input>

    <hm-input
      type="password"
      placeholder="请输入密码"
      v-model="password"
      :rule="/^\d{3,12}$/"
      message="用户密码格式错误"
      ref="password"
    ></hm-input>

    <hm-button @click="login">登录</hm-button>

    <!-- 去注册的连接 -->
    <div class="go-register">
      没有账号？去
      <router-link class="link" to="/register">注册</router-link>
    </div>
  </div>
</template>

<script>
// 导入axios
// import axios from 'axios'
export default {
  methods: {
    // 给DOM注册的事件，可以通过DOM的方式触发  给DOM元素注册点击事件，就可以点击触发
    // 如果给组件去注册事件，通过DOM是无法触发。而是通过 this.$emit触发
    async login() {
      // 做一个表单的校验,如果表单校验不通过，不应该去发送请求
      const result1 = this.$refs.username.validate(this.username)
      const result2 = this.$refs.password.validate(this.password)

      if (!result1 || !result2) {
        return
      }

      const res = await this.$axios({
        method: 'post',
        url: '/login',
        data: {
          username: this.username,
          password: this.password
        }
      })
      // res.data才是后台真正返回的数据
      const { statusCode, data, message } = res.data
      if (statusCode === 200) {
        // alert('恭喜你，登录成功了')
        this.$toast.success(message)
        // 保存登录的token和用户信息
        localStorage.setItem('token', data.token)
        localStorage.setItem('user_id', data.user.id)
        // 如果登录成功了，需要跳转到个人中心,也可能需要回跳
        // this.$router.push('/user')
        // this.$router.back()
        if (this.$route.params.back) {
          this.$router.back()
        } else {
          this.$router.push('/user')
        }
      } else {
        this.$toast.fail(message)
      }
    }
  },
  data() {
    return {
      username: '',
      password: ''
    }
  },
  created() {
    console.log(this.$route)
    this.username = this.$route.params.username
    this.password = this.$route.params.password
  }
}
</script>

<style scoped lang="less">
.go-register {
  padding: 0 20px;
  font-size: 18px;
  text-align: right;
  .link {
    color: orange;
  }
}
</style>

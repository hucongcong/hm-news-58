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
  </div>
</template>

<script>
// 导入axios
// import axios from 'axios'
export default {
  methods: {
    // 给DOM注册的事件，可以通过DOM的方式触发  给DOM元素注册点击事件，就可以点击触发
    // 如果给组件去注册事件，通过DOM是无法触发。而是通过 this.$emit触发
    login() {
      // 做一个表单的校验,如果表单校验不通过，不应该去发送请求
      const result1 = this.$refs.username.validate(this.username)
      const result2 = this.$refs.password.validate(this.password)

      if (!result1 || !result2) {
        return
      }

      // 如果用户名没有校验成功，不发请求
      // if (!this.$refs.username.validate(this.username)) {
      //   return
      // }
      // // 如果密码没有校验成功，不发请求
      // if (!this.$refs.password.validate(this.password)) {
      //   return
      // }

      this.$axios({
        method: 'post',
        url: '/login',
        data: {
          username: this.username,
          password: this.password
        }
      }).then(res => {
        // res.data才是后台真正返回的数据
        console.log(res.data)
        if (res.data.statusCode === 200) {
          // alert('恭喜你，登录成功了')
          this.$toast.success('登录成功')
          // 如果登录成功了，需要跳转到个人中心
          this.$router.push('/user')
        } else {
          this.$toast.fail('用户名或者密码错误')
        }
      })
    }
  },
  data() {
    return {
      username: '',
      password: ''
    }
  }
}
</script>

<style scoped></style>

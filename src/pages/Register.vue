<template>
  <div class="register">
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>

    <hm-input
      placeholder="用户名/手机号码"
      v-model="username"
      :rule="/^1\d{4,10}$/"
      message="用户名格式不对"
      ref="username"
    ></hm-input>
    <!-- 
      昵称的校验： 中文[3-7] 
      [\u4e00-\u9fa5]  中文范围
      [a-z]            小写字母的范围
    -->
    <hm-input
      placeholder="昵称"
      v-model="nickname"
      :rule="/^[\u4e00-\u9fa5]{3,7}$/"
      message="用户的昵称必须是3-7位的中文"
      ref="nickname"
    ></hm-input>
    <hm-input
      placeholder="密码"
      v-model="password"
      :rule="/^\d{3,12}$/"
      message="用户密码格式错误"
      ref="password"
    ></hm-input>

    <hm-button @click="register">注册</hm-button>

    <!-- 去登录的连接 -->
    <div class="go-login">
      已有账号？去
      <router-link class="link" to="/login">登录</router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      nickname: ''
    }
  },
  methods: {
    register() {
      // 进行表单校验
      let status1 = this.$refs.username.validate(this.username)
      let status2 = this.$refs.nickname.validate(this.nickname)
      let status3 = this.$refs.password.validate(this.password)
      // 只有三个都通过了，才发送ajax请求
      if (!status1 || !status2 || !status3) {
        return
      }
      // 发送ajax请求
      console.log('发送ajax请求')
      this.$axios({
        method: 'post',
        url: '/register',
        data: {
          username: this.username,
          password: this.password,
          nickname: this.nickname
        }
      }).then(res => {
        console.log(res.data)
        // 判断响应状态
        if (res.data.statusCode === 200) {
          this.$toast.success(res.data.message)
          // 跳转到登录页面
          // 发送请求登录就行，登录成功直接跳个人中心就行
          // $router.push()进行路由跳转，还可以传递额外的参数
          this.$router.push({
            path: '/login',
            query: { username: this.username, password: this.password }
          })

          // this.$router.push(`/login?username=${this.username}&password=${this.password}`)

          // 通过params传递参数，必须要是命名路由。
          this.$router.push({
            name: 'login',
            params: { username: this.username, password: this.password }
          })
        } else {
          this.$toast.fail(res.data.message)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.go-login {
  padding: 0 20px;
  font-size: 18px;
  text-align: right;
  .link {
    color: orange;
  }
}
</style>

<template>
  <div class="register">
    <hm-header>注册</hm-header>
    <hm-logo></hm-logo>

    <!-- vant的按钮 -->
    <!-- <van-button type="primary">这是一个按钮</van-button> -->
    <!-- <van-button color="linear-gradient(to right, #4bb0ff, #6149f6)">渐变色按钮</van-button> -->
    <!-- <van-field v-model="username" type="password" placeholder="请输入用户名" /> -->
  </div>
</template>

<script>
export default {
  methods: {
    register() {
      console.log('我要注册了')
    }
  },
  data() {
    return {
      username: '213'
    }
  }
}
</script>

<style scoped></style>

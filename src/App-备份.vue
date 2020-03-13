<template>
  <div>
    我是根组件
    <span class="iconfont iconweixin"></span>
    <div class="box">中国</div>
    <button>按钮</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '123'
    }
  }
}
</script>

<style>
button {
  width: 80px;
  height: 40px;
}
.box {
  width: 100px;
  height: 100px;
  background-color: pink;
  font-size: 20px;
}
</style>

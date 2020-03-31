<template>
  <div class="son">
    我是Son组件-----{{user.name}} ----{{user.age}}
    <!-- 
      在son组件中使用son组件继续渲染son的信息，就需要使用递归组件
      1. 必须提供一个name属性
      2. 通过name属性进行渲染  <son></son>
      3. 一定要有结束条件   v-if="user.son"
    -->
    <son v-if="user.son" :user="user.son"></son>
  </div>
</template>

<script>
export default {
  name: 'son',
  props: ['user']
}
</script>

<style lang="less" scoped>
.son {
  border: 1px solid #000;
  padding: 10px;
}
</style>
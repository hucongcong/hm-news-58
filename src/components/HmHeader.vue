<template>
  <div class="hm-header">
    <div class="left" @click="$router.go(-1)">
      <span class="iconfont iconjiantou2"></span>
    </div>
    <div class="center">
      <slot></slot>
    </div>
    <div class="right"></div>
  </div>
</template>

<script>
export default {};
</script>


<style lang="less" scoped>
// 在单文件组件中， style有两个属性需要掌握
// lang="less" 指定css的预处理器
// scoped: 只要给某个组件的style添加scoped属性，那么就可以保证当前组件的样式只会影响到当前组件本身。
.hm-header {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 0 10px;
  text-align: center;
  .left,
  .right {
    width: 30px;
  }
  .center {
    flex: 1;
    font-weight: 700;
  }
}
</style>
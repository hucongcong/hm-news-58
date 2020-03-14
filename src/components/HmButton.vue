<template>
  <div class="hm-button" @click="clickFn">
    <slot></slot>
  </div>
</template>

<script>
export default {
  methods: {
    clickFn() {
      // 只是通知父组件处理，触发组件的事件
      this.$emit("click");
    }
  }
};
</script>

<style lang="less" scoped>
.hm-button {
  margin: 20px;
  height: 50px;
  line-height: 50px;
  background-color: #cc3300;
  color: #fff;
  text-align: center;
  font-size: 18px;
  border-radius: 25px;
}
</style>
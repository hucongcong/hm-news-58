<template>
  <div class="home">
    <van-button type="primary">哈哈哈哈</van-button>
    <br />
    <van-uploader />
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
// 给test组件添加了样式，没有使用scoped
// scoped的原理：
// 一旦给组件添加了scoped属性，scoped会做两件事情  data-v-xxxxxx
// 1. 会给当前组件中所有的样式的选择器添加一个额外的属性选择器
// 2. 会给当前组件的模板的所有的标签都添加一个 额外的属性选择器

// 如果添加了scoped属性，我们会发现覆盖第三方样式的时候，可能会覆盖不动。

// 深度作用选择器： 保证的样式能够在子组件中也生效
// css中   >>>
// less中  /deep/
// scss中  ::v-deep
.van-button {
  color: red;
}

// .van-uploader {
//   width: 200px;
//   height: 200px;
//   background-color: pink;
// }

/deep/ .van-uploader__upload {
  width: 200px;
  height: 200px;
}

/deep/ .van-icon {
  font-size: 50px;
}
</style>
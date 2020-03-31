<template>
  <div class="wrapper">
    <hm-floor :count="count - 1" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="hm-floor" :class="{bt: !comment.parent}">
      <div class="header">
        <div class="left">{{count}}楼 {{comment.user.nickname}}</div>
        <div class="center">{{comment.create_date | date2}}</div>
        <div class="right" @click="reply(comment.id, comment.user.nickname)">回复</div>
      </div>
      <div class="content">{{comment.content}}</div>
    </div>
  </div>
</template>

<script>
export default {
  // 想在组件中使用组件本身，需要给组件指定name属性
  name: 'hm-floor',
  props: {
    comment: Object,
    count: Number
  },
  methods: {
    // reply有两种情况会触发
    // 1. 点击了当前组件的回复按钮，触发   @click="reply(comment.id, commnet.user.nickname)"
    // 2. 子组件触发了reply事件   this.$emit('reply', id, nickname)
    reply(id, nickname) {
      console.log(id, nickname)
      // 触发一个事件, 子组件触发reply事件
      // this.$emit('reply', id, nickname)
      this.$bus.$emit('reply', id, nickname)
    }
  }
}

// react  4-5
</script>

<style lang="less" scoped>
.hm-floor {
  background-color: #eee;
  padding: 10px;
  border: 1px solid #000;
  border-top: none;
  &.bt {
    border-top: 1px solid #000;
  }
  .header {
    font-size: 14px;
    display: flex;
    .center {
      flex: 1;
      padding-left: 10px;
      color: #999;
    }
    .right {
      color: #999;
      font-size: 12px;
    }
  }
  .content {
    font-size: 14px;
    padding: 10px 0;
    word-break: break-all;
  }
}
</style>
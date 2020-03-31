<template>
  <div class="hm-comment">
    <div class="header">
      <div class="left">
        <img :src="$axios.defaults.baseURL + comment.user.head_img" alt />
      </div>
      <div class="center">
        <div class="name">{{comment.user.nickname}}</div>
        <div class="time">{{comment.create_date | date2}}</div>
      </div>
      <div class="right" @click="reply(comment.id, comment.user.nickname)">回复</div>
    </div>
    <!-- 
      楼层
        只有当评论有parent，才会去渲染楼层组件 
        把楼层展示数据传递给楼层组件
    -->
    <hm-floor :count="getCount(0, comment)" v-if="comment.parent" :comment="comment.parent"></hm-floor>
    <div class="content">{{comment.content}}</div>
  </div>
</template>

<script>
import HmFloor from './HmFloor'
export default {
  name: 'hm-comment',
  props: {
    comment: Object
  },
  components: {
    HmFloor
  },
  // 需要在评论中统计一下总共的楼层数
  methods: {
    // 递归方法，用于统计楼层的层数
    getCount(num, obj) {
      if (obj.parent) {
        return this.getCount(num + 1, obj.parent)
      } else {
        return num
      }
    },
    reply(id, nickname) {
      console.log(id, nickname)
      // 触发reply事件，把id和nickname传给父组件
      // this.$emit('reply', id, nickname)
      // 触发bus的reply事件
      this.$bus.$emit('reply', id, nickname)
    }
    // 给楼层组件注册的reply事件
    // aa(id, nickname) {
    //   console.log('评论组件', id, nickname)
    //   this.$emit('reply', id, nickname)
    // }
  }
}
</script>

<style lang="less" scoped>
.hm-comment {
  border-bottom: 1px solid #ccc;
  padding: 20px;
  align-items: center;
  .header {
    display: flex;
    margin-bottom: 10px;
    .left {
      img {
        width: 50px;
        height: 50px;
        display: block;
        border-radius: 50%;
      }
    }
    .center {
      flex: 1;
      padding-left: 10px;
      .name {
        font-size: 16px;
        margin-top: 5px;
      }
      .time {
        font-size: 14px;
        color: #999;
      }
    }
    .right {
      margin-top: 5px;
      color: #999;
      font-size: 14px;
    }
  }

  .content {
    font-size: 16px;
    margin-top: 10px;
    word-break: break-all;
  }
}
</style>
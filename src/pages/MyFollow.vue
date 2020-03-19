<template>
  <div class="my-follow">
    <hm-header>我的关注</hm-header>

    <div class="list">
      <!-- 关注 -->
      <div class="item" v-for="item in list" :key="item.id">
        <div class="left">
          <img :src="$axios.defaults.baseURL + item.head_img" alt="" />
        </div>
        <div class="center">
          <div class="name">{{ item.nickname }}</div>
          <div class="date">{{ item.create_date | date }}</div>
        </div>
        <div class="right" @click="unfollow(item.id)">取消关注</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 关注列表
      list: []
    }
  },
  created() {
    // 获取关注列表
    this.getFollowList()
  },
  methods: {
    getFollowList() {
      this.$axios({
        method: 'get',
        url: '/user_follows'
      }).then(res => {
        // console.log(res.data)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.list = data
          console.log(this.list)
        }
      })
    },
    unfollow(id) {
      // 弹出一个框
      this.$dialog
        .confirm({
          title: '温馨提示',
          message: '你确定要取关改用户吗？'
        })
        .then(() => {
          // 发送ajax请求，进行取消关注
          this.$axios({
            method: 'get',
            url: `/user_unfollow/${id}`
          }).then(res => {
            // console.log(res.data)
            const { statusCode, message } = res.data
            if (statusCode === 200) {
              // 提示消息
              this.$toast.success(message)
              // 重新渲染
              this.getFollowList()
            }
          })
        })
        .catch(() => {
          // 取消
          this.$toast('操作取消')
        })
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  .left {
    img {
      width: 40px;
      height: 40px;
      display: block;
      border-radius: 50%;
    }
  }
  .center {
    flex: 1;
    padding-left: 10px;
    .name {
      font-size: 14px;
    }
    .date {
      color: #999;
      font-size: 12px;
    }
  }
  .right {
    background-color: #ddd;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    padding: 0 15px;
    color: #000;
  }
}
</style>

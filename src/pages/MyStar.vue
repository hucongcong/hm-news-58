<template>
  <div class="my-star">
    <hm-header>我的收藏</hm-header>
    <div class="list">
      <div class="item" v-for="item in list" :key="item.id">
        <div class="info">
          <div class="title">{{item.title}}</div>
          <div class="bottom">
            <span>{{item.user.nickname}}</span>
            <span>{{item.comments.length}}跟帖</span>
          </div>
        </div>
        <img :src="item.cover[0].url" alt />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  async created() {
    // 发送请求，渲染我的收藏页面
    // axios() $.ajax
    // axios().get(url)  $.get(url)
    // axios({method: 'get', url: url}) 可以写简写为  axios.get(url)
    // const res = await this.$axios({
    //   method: 'get',
    //   url: '/user_star'
    // })
    const res = await this.$axios.get('/user_star')
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.list = data
      console.log(this.list)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ccc;
  justify-content: space-between;
  .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .title {
      font-size: 16px;
    }
    .bottom {
      font-size: 12px;
      color: #999;
      span {
        margin-right: 10px;
      }
    }
  }

  // 图片失真
  img {
    width: 121px;
    height: 75px;
    display: block;
    // 可以让图片等比例的压缩 取值:cover  contain
    // 类似于 background-size: cover contain
    object-fit: cover;
  }
}
</style>
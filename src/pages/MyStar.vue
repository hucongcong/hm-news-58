<template>
  <div class="my-star">
    <hm-header>我的收藏</hm-header>
    <div class="list">
      <hm-post v-for="post in list" :key="post.id" :post="post"></hm-post>
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
    const res = await this.$axios.get('/user_star')
    // console.log(res)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      data.forEach(item => {
        item.comment_length = item.comments.length
      })
      this.list = data
      // 让list中文章对象有comment_length属性
      console.log(this.list)
    }
  }
}
</script>

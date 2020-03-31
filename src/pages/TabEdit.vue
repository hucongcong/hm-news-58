<template>
  <div class="tab-edit">
    <hm-header>栏目管理</hm-header>

    <div class="content">
      <p class="title">点击删除以下频道(至少保留3个)</p>
      <div class="list">
        <div
          class="item"
          v-for="item in activeTabs"
          :key="item.id"
          @click="del(item.id)"
        >{{item.name}}</div>
      </div>

      <p class="title">点击添加以下频道</p>
      <div class="list">
        <div
          class="item"
          v-for="item in deactiveTabs"
          :key="item.id"
          @click="add(item.id)"
        >{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放激活的栏目，默认所有的栏目都是激活的
      activeTabs: [],
      // 存放未激活的栏目
      deactiveTabs: []
    }
  },
  // 栏目管理一加载，应该先从缓存中获取数据，如果缓存中没有数据，才考虑发请求去获取所有的栏目
  async created() {
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    const deactiveTabs = JSON.parse(localStorage.getItem('deactiveTabs'))
    if (activeTabs && deactiveTabs) {
      this.activeTabs = activeTabs
      this.deactiveTabs = deactiveTabs
      return
    }
    const res = await this.$axios.get('/category')
    console.log(res.data)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      // 把获取到的所有的栏目放到激活的栏目中
      this.activeTabs = data
      this.deactiveTabs = []
    }
  },
  methods: {
    del(id) {
      // 根据id找到对应的栏目，并且删除，并且添加到未激活的栏目中
      if (this.activeTabs.length <= 3) {
        this.$toast('请至少保留3个')
        return
      }
      const idx = this.activeTabs.findIndex(item => item.id === id)
      // 把这个栏目添加到未激活的数组中
      this.deactiveTabs.push(this.activeTabs[idx])
      // 删除激活中的这个栏目
      this.activeTabs.splice(idx, 1)
    },
    add(id) {
      // 根据id找到下标
      const idx = this.deactiveTabs.findIndex(item => item.id === id)
      this.activeTabs.push(this.deactiveTabs[idx])
      this.deactiveTabs.splice(idx, 1)
    }
  },
  watch: {
    // 监听栏目的变化
    activeTabs: {
      deep: true,
      handler(value) {
        localStorage.setItem('activeTabs', JSON.stringify(this.activeTabs))
        localStorage.setItem('deactiveTabs', JSON.stringify(this.deactiveTabs))
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  padding: 20px;
  .title {
    color: #999;
    font-size: 14px;
  }
  .list {
    margin-top: 10px;
    overflow: hidden;
    .item {
      padding: 10px 15px;
      border: 1px solid #ccc;
      float: left;
      background-color: #ddd;
      margin-right: 10px;
      margin-bottom: 10px;
    }
  }
}
</style>
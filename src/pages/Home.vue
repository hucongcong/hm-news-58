<template>
  <div class="home">
    <div class="header">
      <div class="left">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="center" @click="$router.push('/search')">
        <span class="iconfont iconsearch"></span>
        <span class="text">搜索新闻</span>
      </div>
      <div class="right" @click="$router.push('/user')">
        <span class="iconfont iconwode"></span>
      </div>
    </div>

    <!-- 
      tab栏
      active用于指定选中的是哪个tab栏目，，，active对应的是选中的tab栏的下标
    -->
    <van-tabs v-model="active" sticky swipeable animated>
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <!-- 
          @refresh: 下拉会触发的refresh事件
          refreshing： 控制下拉状态
         -->
        <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
          <!-- 使用van-list组件包裹文章 -->
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
            :immediate-check="false"
            :offset="50"
          >
            <hm-post
              v-for="post in postList"
              :key="post.id"
              :post="post"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  name: 'home',
  data() {
    return {
      // 指定选中的那个tab
      active: 0,
      // 用于存放所有的tab栏数据
      tabList: [],
      // 用于存放文章的数据
      postList: [],
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 5,
      // 控制List组件的加载状态
      loading: false,
      // 控制是否还有更多数据
      finished: false,
      // 下拉的时候refreshing回变成true, 需要加载后，把refreshing改成false
      refreshing: false
    }
  },
  async created() {
    console.log('home组件创建了')
    // 发送请求，获取所有的tab数据
    const activeTabs = JSON.parse(localStorage.getItem('activeTabs'))
    if (activeTabs) {
      this.tabList = activeTabs
      // 发送请求，获取文章列表的数据
      this.getPostList(this.tabList[this.active].id)
      return
    }
    // 如果缓存中没有activeTabs，就发送请求，加载所有的栏目
    const res = await this.$axios.get('/category')
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      // 获取到时所有的分类数据
      this.tabList = data
      this.getPostList(this.tabList[this.active].id)
    }
  },
  destroyed() {
    console.log('home组件被销毁了')
  },
  methods: {
    // 用于获取文章数据
    // id: 分类的id
    async getPostList(id) {
      const res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      })
      const { statusCode, data } = res.data

      // 由于频繁的切换，会导致数据清空不及时
      // 如果页码值还是1，并且postList中还有数据
      if (this.postList.length > 0 && this.pageIndex === 1) {
        this.postList = []
      }

      // this.postList = data
      // 数据不能替换，只能追加
      this.postList = [...this.postList, ...data]
      // 数据加载完成，把loading改成false
      this.loading = false
      // 让refreshing变成false
      this.refreshing = false
      // 判断还有没有更多的数据
      if (data.length < this.pageSize) {
        this.finished = true
      }
    },
    onLoad() {
      // 上拉加载会执行的函数
      const id = this.tabList[this.active].id
      setTimeout(() => {
        this.pageIndex++
        this.getPostList(id)
      }, 1000)
    },
    onRefresh() {
      console.log('123')
      // 重新加载所有的数据
      this.pageIndex = 1
      this.postList = []
      this.loading = true
      this.finished = false
      setTimeout(() => {
        const id = this.tabList[this.active].id
        this.getPostList(id)
      }, 1000)
    }
  },
  // 监听active的变化，在active变化的时候，重新获取文章的数据
  watch: {
    active(value) {
      // 切换栏目的时候，需要初始化所有的状态
      this.postList = []
      this.pageIndex = 1
      this.finished = false

      // loading不应该是false，应该是true，这样可以保证切换的时候不去触发onload事件
      this.loading = true

      setTimeout(() => {
        const id = this.tabList[value].id
        this.getPostList(id)
      }, 1000)
      // this.onLoad()
    }
  }
}
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  line-height: 50px;
  background-color: #ff0000;
  color: #fff;
  display: flex;
  padding-left: 10px;
  align-items: center;
  .left,
  .right {
    width: 60px;
    height: 50px;
    line-height: 50px;
    text-align: center;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }
  .center {
    flex: 1;
    height: 34px;
    line-height: 34px;
    background-color: rgba(255, 255, 255, 0.5);
    text-align: center;
    border-radius: 17px;
    .text {
      font-size: 14px;
      margin-left: 5px;
    }
  }
}

// 覆盖tab栏的样式
// 深度作用选择器
/deep/ .van-tabs__nav {
  background-color: #ddd;
}
</style>

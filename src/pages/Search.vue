<template>
  <div class="search">
    <div class="header">
      <div class="left" @click="back">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <input
          type="text"
          placeholder="请输入搜索的内容"
          v-model="keyword"
          @keyup.enter="search"
          @input="recommend"
        />
        <span class="iconfont iconsearch"></span>
      </div>
      <div class="right" @click="search">搜索</div>
    </div>

    <!-- 推荐列表 -->
    <div class="recommend" v-if="recommendList.length > 0">
      <div
        class="item one-txt-cut"
        v-for="item in recommendList"
        :key="item.id"
        @click="history_search(item.title)"
      >
        {{ item.title }}
      </div>
    </div>

    <!-- 渲染文章列表 -->
    <div class="post-list" v-else-if="postList.length > 0">
      <hm-post v-for="post in postList" :key="post.id" :post="post"></hm-post>
    </div>
    <div class="content" v-else>
      <h3>历史纪录</h3>
      <div class="list">
        <div
          class="item"
          @click="history_search(item)"
          v-for="item in history"
          :key="item"
        >
          {{ item }}
        </div>
      </div>
      <h3>热门搜索</h3>
      <div class="list">
        <div
          class="item"
          @click="history_search(item)"
          v-for="item in hotList"
          :key="item"
        >
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      keyword: '',
      // 存放文章的搜索结果
      postList: [],
      // 历史记录
      history: [],
      // 热门搜索列表
      hotList: [],
      // 推荐列表
      recommendList: []
    }
  },
  created() {
    // 页面一加载，从缓存中获取历史记录
    const history = localStorage.getItem('history')
    if (history) {
      this.history = JSON.parse(history)
    }

    this.hotList = ['情火', '亲爱的', '新冠肺炎', '复工']
  },
  methods: {
    async search() {
      // 搜索时，关闭推荐
      this.recommendList = []
      // 把搜索的keyword保存到历史记录中
      // 判断历史记录中是否有这个历史记录,如果有，直接先删除掉
      this.history = this.history.filter(item => item !== this.keyword)
      this.history.unshift(this.keyword)
      localStorage.setItem('history', JSON.stringify(this.history))
      console.log('搜索')
      // 发送ajax请求，获取搜索结果
      const res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
          pageIndex: 1,
          pageSize: 6
        }
      })
      console.log(res.data)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.postList = data
      }
    },
    history_search(item) {
      console.log(item)
      this.keyword = item
      this.search()
    },
    back() {
      if (this.keyword) {
        this.keyword = ''
      } else {
        this.$router.go(-1)
      }
    },
    // 推荐
    // 使用lodash的防抖
    recommend: _.debounce(async function() {
      console.log('我执行了')
      // 如果输入的内容是空，不推荐
      if (!this.keyword) {
        return
      }
      // 发送请求，获取推荐数据
      const res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword
        }
      })
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.recommendList = data
        console.log(this.recommendList)
      }
    }, 500)
  },
  watch: {
    keyword(value) {
      if (!value) {
        // 如果没有输入任何的内容，搜索结果清空
        this.postList = []
        this.recommendList = []
      }
    }
  }
}
</script>

<style lang="less" scoped>
.search {
  position: relative;
  .header {
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ccc;
    padding: 0 20px;
    display: flex;
    align-items: center;
    .center {
      flex: 1;
      padding: 0 10px;
      position: relative;
      display: flex;
      input {
        flex: 1;
        height: 34px;
        line-height: 34px;
        border-radius: 17px;
        border: none;
        outline: none;
        border: 1px solid #ccc;
        padding-left: 30px;
        font-size: 12px;
      }
      .iconfont {
        position: absolute;
        top: 0;
        left: 20px;
        line-height: 34px;
      }
    }
    .right {
      font-size: 14px;
    }
  }
  .content {
    padding: 20px;
    h3 {
      padding: 10px 0;
      font-size: 20px;
    }
    .list {
      overflow: hidden;
      .item {
        font-size: 14px;
        border: 1px solid #ccc;
        background-color: #ddd;
        padding: 5px 10px;
        float: left;
        margin-right: 10px;
        margin-bottom: 10px;
      }
    }
  }

  .recommend {
    position: absolute;
    z-index: 999;
    background-color: #fff;
    width: 100%;
    .item {
      padding: 0 20px;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      border-bottom: 1px solid #ccc;
    }
  }
}
</style>

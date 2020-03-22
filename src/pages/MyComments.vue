<template>
  <div class="my-comment">
    <hm-header>我的跟帖</hm-header>
    <div class="list">
      <!-- 
        v-model="loading" : 用于指定List组件的加载状态 true: 代表List是加载中   false:List加载好了
            如果loading为true了，代表正在加载中，load就不会重复触发  如果loading为false,不在加载中，才会触发load事件
        :finished="finished" finished: 指定所有数据是否加载完成（是否还有更多数据) 如果finished为true，会显示没有更多数据了，，，，再加载也没有用了
        finished-text="没有更多了":  没有更多数据的文本提示
        @load="onLoad"： 当List触底了，onLoad事件就会触发
        :immediate-check="false" 指定页面初始化是否需要执行一个load
      -->

      <!-- 
        load事件会在滚动到最底部的时候触发
        :immediate-check="false"  关闭页面一加载就触发load事件
        :offset="50"  距离底部小于50的时候，就触发load事件
        loading用于指定加载状态  如果loading为true，不会触发load事件。只有loading为false才会触发load事件
           当滚动到底部，会自动把loading改成true，并且触发load事件  等到数据加载完成，需要把loading在改成false
      -->
      <van-list
        @load="onLoad"
        :immediate-check="false"
        :offset="50"
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
      >
        <!-- 内容随意指定的 -->
        <div class="item" v-for="item in list" :key="item.id">
          <div class="time">{{item.create_date | date('YYYY-MM-DD HH:mm')}}</div>
          <!-- 父评论的内容 -->
          <div class="parent-comment" v-if="item.parent">
            <div class="parent-name">回复： {{item.parent.user.nickname}}</div>
            <div class="parent-content">{{item.parent.content}}</div>
          </div>
          <div class="content">{{item.content}}</div>
          <div class="link" @click="$router.push(`/post-detail/${item.post.id}`)">
            <div class="title one-txt-cut">原文：{{item.post.title}}</div>
            <span class="iconfont iconjiantou1"></span>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 评论列表
      list: [],
      // 没有在加载数据
      loading: false,
      finished: false,
      // 当前页
      pageIndex: 1,
      // 每页的条数
      pageSize: 10
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    // 用于获取评论列表的数据
    getCommentList() {
      this.$axios({
        method: 'get',
        url: '/user_comments',
        // 注意：在使用axios发送ajax请求的时候，如果post请求有数据，需要放到data参数中。如果是get请求有数据，需要放到params中。
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }
      }).then(res => {
        console.log(res.data)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          // 因为涉及到分页，不能简单的把响应的data把list数据给覆盖了，而应该是追加
          // this.list = data
          this.list = [...this.list, ...data]
          // 合并数组
          // this.list = this.list.concat(data)
          console.log(this.list)

          // 额外处理
          // 数据加载完成了，记得让loading改成false,不然无法触发下一次的加载。
          this.loading = false
          // 判断是否还有更多数据？ 如果返回的数据的条数比 每页的条数少，说明没有更多数据。
          if (data.length < this.pageSize) {
            // 没有更多数据
            this.finished = true
          }
        }
      })
    },
    onLoad() {
      console.log('我触底了，我要加载更多数据了')
      setTimeout(() => {
        // 发送ajax请求，加载更多数据即可
        // 加载更多数据，让页码值+1
        this.pageIndex++
        // 重新发送ajax请求即可
        this.getCommentList()
      }, 1000)
    }
  }
}
</script>

<style lang="less" scoped>
.item {
  border-bottom: 1px solid #ccc;
  padding: 10px;
  .time {
    font-size: 14px;
    color: #999;
    height: 30px;
    line-height: 30px;
  }
  .content {
    font-size: 16px;
    padding: 10px 0;
  }
  .link {
    color: #999;
    display: flex;
    margin-top: 10px;
    font-size: 14px;
    justify-content: space-between;
    .title {
      flex: 1;
    }
    span {
      width: 50px;
      text-align: right;
    }
  }
  .parent-comment {
    background-color: #ddd;
    padding: 10px;
    font-size: 14px;
    color: #999;
    line-height: 30px;
    .parent-name {
      font-size: 12px;
    }
  }
}
</style>
<template>
  <div class="post-detail" :class="isShow? 'pd140': 'pd50'">
    <div class="header">
      <div class="left" @click="$router.back()">
        <span class="iconfont iconjiantou2"></span>
      </div>
      <div class="center">
        <span class="iconfont iconnew"></span>
      </div>
      <div class="right">
        <div class="followed" v-if="detail.has_follow" @click="unfollow(detail.user.id)">已关注</div>
        <div class="follow" v-else @click="follow(detail.user.id)">关注</div>
      </div>
    </div>

    <div class="detail-content">
      <!-- 新闻标题 -->
      <div class="title">{{detail.title}}</div>

      <!-- 新闻作者和时间 -->
      <div class="user">
        <span>{{detail.user.nickname}}</span>
        <span>{{detail.create_date | date}}</span>
      </div>

      <!-- 
        内容区域
          1. 对于type为1的文章，就是普通的文章，她的content是一系列的标签。所以需要使用v-html进行展示
          2. 对于type为2的文章，视频类的文章，它的content是一个url地址，是视频的地址，应该使用一个video标签进行展示。

          遇到的问题
            视频会报403错误
              404：not found  资源没找到，url地址写错
              403：forbidden  服务器有资源，拒绝访问。  视频的服务器做了防盗链的处理。
          
          屏蔽防盗链（不一定好使） 给index.html添加一个meta
            <meta name="referrer" content="no-referrer" />

          把视频下载本地，直接引入本地的视频即可。

          video常用的属性
            controls: 是否显示控制条  播放 进度条
            autoplay: 控制视频是否自动播放
            muted: 控制视频是否静音
      -->
      <div v-if="detail.type === 1" class="content" v-html="detail.content"></div>
      <video v-else :src="detail.content" controls autoplay muted></video>

      <div class="btns">
        <div class="btn like" :class="{active: detail.has_like}" @click="like">
          <span class="iconfont icondianzan"></span>
          <span>{{detail.like_length || 0}}</span>
        </div>
        <div class="btn share">
          <span class="iconfont iconweixin"></span>
          <span>微信</span>
        </div>
      </div>
    </div>

    <!-- 跟帖列表 -->
    <div class="comment-list">
      <div class="title">精彩跟帖</div>
      <!-- 渲染评论列表 -->
      <!-- <hm-comment v-for="item in commentList" :key="item.id" :comment="item" @reply="reply"></hm-comment> -->
      <hm-comment v-for="item in commentList" :key="item.id" :comment="item"></hm-comment>
    </div>

    <!-- 文章的底部 -->
    <div class="footer">
      <div class="input" v-if="!isShow">
        <input type="text" placeholder="写跟帖" @focus="handleFocus" />
        <span class="iconfont iconpinglun-">
          <span>{{detail.comment_length}}</span>
        </span>
        <span class="iconfont iconshoucang" :class="{active: detail.has_star}" @click="star"></span>
        <span class="iconfont iconfenxiang"></span>
      </div>
      <div class="textarea" v-else>
        <textarea
          :placeholder="'回复:' + replyNickname"
          @blur="handleBlur"
          ref="textarea"
          v-model="content"
        ></textarea>
        <div class="send" @click="add">发送</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用于存放文章详情
      detail: {
        user: {}
      },
      // 控制textarea的显示
      isShow: false,
      // 存放评论列表
      commentList: [],
      replyNickname: '',
      replyId: '',
      // 评论的内容
      content: ''
    }
  },
  created() {
    console.log('详情页组件创建')
    this.getDetail()
    this.getCommnents()

    // 在post-detail一创建，就给给bus注册一个事件
    this.$bus.$on('reply', async (id, nickname) => {
      console.log('父组件接受', id, nickname)
      // 父组件应该显示textarea框，并且要自动获取焦点
      this.isShow = true
      // 等待dom更新完成
      await this.$nextTick()
      this.$refs.textarea.focus()

      // 把接受到的id和nickname存储起来
      this.replyId = id
      this.replyNickname = nickname
    })
  },
  destroyed() {
    console.log('详情页组件被销毁了')
  },
  methods: {
    // 获取文章详情
    async getDetail() {
      // 获取文章详情
      const id = this.$route.params.id

      const res = await this.$axios.get(`/post/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.detail = data
      }
    },
    // 获取文章评论
    async getCommnents() {
      const id = this.$route.params.id
      const res = await this.$axios.get(`/post_comment/${id}`)
      const { statusCode, data } = res.data
      if (statusCode === 200) {
        this.commentList = data
      }
    },
    async follow(id) {
      // 关注功能
      // 思路1：先判断是否登录，如果登录了，就发送请求，如果没登录，让他跳转到登录页
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        this.$toast('请先登录')
        return
      }
      // 思路2：直接发送请求进行关注
      const res = await this.$axios.get(`/user_follows/${id}`)

      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('关注成功')
        // 关注成功，需要重新渲染
        // this.getDetail()
        this.detail.has_follow = true
      }
    },
    async unfollow(id) {
      // 思路2：直接发送请求进行取消关注
      const res = await this.$axios.get(`/user_unfollow/${id}`)

      const { statusCode } = res.data
      if (statusCode === 200) {
        this.$toast.success('取关成功')
        // 关注成功，需要重新渲染
        this.getDetail()
        // this.detail.has_follow = false
      }
    },
    async like() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({
          name: 'login',
          params: { back: true }
        })
        this.$toast('请先登录')
        return
      }
      // 发送请求，去点赞
      const res = await this.$axios.get(`/post_like/${this.detail.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    },
    async star() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({
          name: 'login',
          params: { back: true }
        })
        this.$toast('请先登录')
        return
      }
      // 登录了，发送请求
      const res = await this.$axios.get(`/post_star/${this.detail.id}`)
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        this.getDetail()
      }
    },
    async handleFocus() {
      // 获取到了input框的焦点, 需要显示textarea
      this.isShow = true
      // 需要让textarea框有焦点才行 focus()
      // 刚修改完数据，DOM不会立即更新的。
      // this.$nextTick(() => {
      // })
      // 等待DOM更新完成
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    handleBlur() {
      // 当textarea框没有焦点，重新显示input框
      // 如果textarea中有内容，不应该隐藏
      // 取消回复
      if (!this.content) {
        this.isShow = false
        this.replyNickname = ''
        this.replyId = ''
      }
    },
    async reply(id, nickname) {
      // 父组件应该显示textarea框，并且要自动获取焦点
      this.isShow = true
      // 等待dom更新完成
      await this.$nextTick()
      this.$refs.textarea.focus()

      // 把接受到的id和nickname存储起来
      this.replyId = id
      this.replyNickname = nickname
    },
    // 添加评论
    async add() {
      const token = localStorage.getItem('token')
      if (!token) {
        this.$router.push({
          name: 'login',
          params: {
            back: true
          }
        })
        this.$toast('请先登录')
        return
      }

      // 登录了，发送ajax请求
      // this.$axios({
      //   method: 'get',
      //   url: 'xxxx',
      //   params: {
      //     // get请求的参数
      //   }
      // })

      // // get请求简写
      // this.$axios.get('xxxx', {
      //   params: {
      //     username: 'zs',
      //     password: 123
      //   }
      // })

      // this.$axios({
      //   method: 'post',
      //   url: 'xxxx',
      //   data: {}
      // })

      // post请求的简写
      // this.$axios.post('url', {

      // })

      // this.$axios.post(`/post_comment/${this.detail.id}`, {})
      const res = await this.$axios.post(`/post_comment/${this.detail.id}`, {
        content: this.content,
        parent_id: this.replyId
      })
      // 回复成功的处理
      const { statusCode, message } = res.data
      if (statusCode === 200) {
        this.$toast.success(message)
        // 重新渲染评论和文章
        this.getCommnents()
        this.getDetail()

        // 隐藏textarea
        this.isShow = false
        this.replyNickname = ''
        this.replyId = ''
        this.content = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pd140 {
  padding-bottom: 140px;
}
.pd50 {
  padding-bottom: 50px;
}
.header {
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 0 20px;
  align-items: center;
  .center {
    height: 50px;
    line-height: 50px;
    padding-left: 5px;
    flex: 1;
    .iconfont {
      font-size: 40px;
    }
  }
  .followed {
    border: 1px solid #ccc;
    height: 30px;
    line-height: 30px;
    border-radius: 15px;
    padding: 0 15px;
  }
  .follow {
    height: 30px;
    line-height: 30px;
    border: 1px solid #ff0000;
    background-color: #ff0000;
    color: #fff;
    border-radius: 15px;
    padding: 0 15px;
  }
}
.detail-content {
  padding: 0 20px;
  .title {
    font-weight: 700;
    font-size: 24px;
    padding: 20px 0;
  }
  .user {
    color: #999;
    font-size: 14px;
    margin-bottom: 20px;
    span {
      margin-right: 10px;
    }
  }
  /deep/ img {
    width: 100%;
    display: block;
  }
  .content {
    font-size: 14px;
  }
  video {
    width: 100%;
  }
}
.btns {
  display: flex;
  justify-content: space-around;
  padding: 20px 0;
  .btn {
    width: 80px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #000;
    padding: 0 15px;
    border-radius: 15px;
    text-align: center;
    font-size: 14px;
    span:first-child {
      margin-right: 5px;
    }
    &.active {
      border-color: red;
      color: red;
    }
  }
  .share {
    color: #00c800;
    border: 1px solid #00c800;
  }
}

.comment-list {
  border-top: 3px solid #ccc;
  .title {
    font-size: 24px;
    font-weight: 700;
    text-align: center;
    padding: 20px 0;
  }
}
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #fff;
  .input {
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-top: 1px solid #ccc;
    input {
      height: 30px;
      width: 180px;
      background-color: #ddd;
      border-radius: 15px;
      outline: none;
      border: none;
      padding-left: 20px;
    }
    .iconfont {
      font-size: 22px;
    }
    .active {
      color: red;
    }
    .iconpinglun- {
      position: relative;
      span {
        position: absolute;
        font-size: 12px;
        background-color: red;
        color: #fff;
        top: -7px;
        left: 9px;
        padding: 0 5px;
      }
    }
  }
  .textarea {
    border-top: 1px solid #ccc;
    display: flex;
    height: 100px;
    display: flex;
    align-items: flex-end;
    padding: 20px;
    textarea {
      flex: 1;
      height: 80px;
      background-color: #ddd;
      border-radius: 10px;
      padding: 10px;
      border: none;
      outline: none;
    }
    .send {
      height: 30px;
      line-height: 30px;
      padding: 0 15px;
      border-radius: 15px;
      background-color: red;
      color: #fff;
      margin: 0 10px;
    }
  }
}
</style>
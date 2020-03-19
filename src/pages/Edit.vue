<template>
  <div class="edit">
    <hm-header>编辑资料</hm-header>
    <!-- avatar: 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt />
      <!-- 上传头像的组件 -->
      <van-uploader class="uploader" :after-read="afterRead" />
    </div>
    <hm-navbar
      title="昵称"
      :content="info.nickname"
      @click="showNickname"
    ></hm-navbar>
    <hm-navbar
      title="密码"
      :content="info.password | password"
      @click="showPassword"
    ></hm-navbar>
    <hm-navbar
      title="性别"
      :content="info.gender === 1 ? '男' : '女'"
      @click="showGenger"
    ></hm-navbar>

    <!-- 
      修改昵称的对话框
      v-model="show" 通过show的值来控制对话框的显示隐藏
    -->
    <van-dialog
      v-model="show"
      title="修改昵称"
      show-cancel-button
      @confirm="editNickname"
    >
      <van-field v-model="nickname" placeholder="请输入用户昵称" />
    </van-dialog>

    <!-- 
      修改密码的对话框
    -->
    <van-dialog
      v-model="show1"
      title="修改密码"
      show-cancel-button
      @confirm="editPassword"
    >
      <van-field v-model="password" placeholder="请输入用户密码" />
    </van-dialog>

    <van-dialog
      v-model="show2"
      title="修改性别"
      show-cancel-button
      @confirm="editGender"
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>

    <div class="cropper-mask" v-show="showCropper">
      <vue-cropper
        ref="cropper"
        :img="img"
        :autoCrop="true"
        :autoCropWidth="150"
        :autoCropHeight="150"
        :fixed="true"
      ></vue-cropper>
      <van-button class="crop" type="primary" @click="crop">裁剪</van-button>
      <van-button class="cancel" type="info" @click="cancel">取消</van-button>
    </div>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  data() {
    return {
      info: {},
      show: false,
      // 昵称
      nickname: '',
      // 控制密码框的显示和隐藏
      show1: false,
      password: '',
      show2: false,
      gender: 1,
      showCropper: false,
      img: ''
    }
  },
  created() {
    // 获取个人信息
    this.getInfo()
  },
  methods: {
    getInfo() {
      // 发送ajax请求,获取个人信息
      const user_id = localStorage.getItem('user_id')
      const token = localStorage.getItem('token')
      this.$axios({
        method: 'get',
        url: `/user/${user_id}`
      }).then(res => {
        // console.log(res)
        const { statusCode, data } = res.data
        if (statusCode === 200) {
          this.info = data
          // console.log(this.info)
        }
      })
    },
    // 修改用户，接收需要修改的数据
    editUser(data) {
      const user_id = localStorage.getItem('user_id')
      const token = localStorage.getItem('token')
      this.$axios({
        method: 'post',
        url: `/user_update/${user_id}`,
        data
      }).then(res => {
        // console.log(res.data)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          // 1. 重新渲染
          this.getInfo()
          // 2. 给一个成功的提示
          this.$toast.success(message)
        }
      })
    },
    // 显示修改昵称的对话框
    showNickname() {
      // 对话框显示
      this.show = true
      // 回显nickname
      this.nickname = this.info.nickname
    },
    // 修改昵称
    editNickname() {
      // console.log('我要修改昵称了')
      // 发送请求，修改昵称
      // const user_id = localStorage.getItem('user_id')
      // const token = localStorage.getItem('token')
      // this.$axios({
      //   method: 'post',
      //   url: `/user_update/${user_id}`,
      //   data: {
      //     nickname: this.nickname
      //   },
      //   headers: {
      //     Authorization: token
      //   }
      // }).then(res => {
      //   console.log(res.data)
      //   const { statusCode, message } = res.data
      //   if (statusCode === 200) {
      //     // 1. 重新渲染
      //     this.getInfo()
      //     // 2. 给一个成功的提示
      //     this.$toast.success(message)
      //   }
      // })
      // 添加一个校验
      if (!/^[\u4e00-\u9fa5]{3,7}$/.test(this.nickname)) {
        this.$toast.fail('用户昵称必须是3-7位的中文')
        return
      }
      this.editUser({
        nickname: this.nickname
      })
    },
    showPassword() {
      this.show1 = true
      this.password = this.info.password
    },
    editPassword() {
      this.editUser({
        password: this.password
      })
      // const user_id = localStorage.getItem('user_id')
      // const token = localStorage.getItem('token')
      // this.$axios({
      //   method: 'post',
      //   url: `/user_update/${user_id}`,
      //   data: {
      //     password: this.password
      //   },
      //   headers: {
      //     Authorization: token
      //   }
      // }).then(res => {
      //   console.log(res.data)
      //   const { statusCode, message } = res.data
      //   if (statusCode === 200) {
      //     // 1. 重新渲染
      //     this.getInfo()
      //     // 2. 给一个成功的提示
      //     this.$toast.success(message)
      //   }
      // })
    },
    showGenger() {
      this.show2 = true
      this.gender = this.info.gender
    },
    editGender() {
      this.editUser({
        gender: this.gender
      })
    },
    afterRead(file) {
      // 选择了图片之后，需要把图片异步的上传到服务器
      // ajax通过formData异步上传文件
      // console.log(file)
      // console.log('当选择完文件了，这个函数就会执行', file.file)

      // 读取完文件，需要裁剪这个文件
      this.showCropper = true
      // 设置上传的这个文件就是需要裁剪的文件
      this.img = file.content
      // // 需要异步的上传文件
      // const fd = new FormData()
      // fd.append('file', file.file)
      // this.$axios({
      //   method: 'post',
      //   url: '/upload',
      //   data: fd
      // }).then(res => {
      //   // console.log(res.data)
      //   // 成功了，需要做什么？
      //   const { statusCode, data } = res.data
      //   if (statusCode === 200) {
      //     // 能够拿到上传的图片的地址了，还需要修改掉用户的头像
      //     // console.log(data.url)
      //     this.editUser({
      //       head_img: data.url
      //     })
      //   }
      // })
    },
    beforeRead(file) {
      // 控制文件大小不能超过200k
      // console.log('上传之前', file)
      if (file.size / 1024 >= 200) {
        this.$toast.fail('文件大小不能超过200kb')
        return false
      }
      // 控制文件的格式 必须是jpg
      if (file.type !== 'image/jpeg') {
        this.$toast.fail('上传的文件必须是jpg图片')
        return false
      }
      return true
    },
    // 取消裁剪
    cancel() {
      this.showCropper = false
      this.img = ''
    },
    // 裁剪图片
    crop() {
      this.$refs.cropper.getCropBlob(data => {
        // console.log(data)
        // 需要把裁剪出来的文件进行上传
        const fd = new FormData()
        fd.append('file', data)
        this.$axios({
          method: 'post',
          url: '/upload',
          data: fd
        }).then(res => {
          const { statusCode, data } = res.data
          if (statusCode === 200) {
            // 能够拿到上传的图片的地址了，还需要修改掉用户的头像
            // console.log(data.url)
            // 隐藏裁剪框
            this.showCropper = false
            // 把裁剪的图片地址清楚
            this.img = ''
            // 修改头像
            this.editUser({
              head_img: data.url
            })
          }
        })
      })
    }
  },
  filters: {
    password(input) {
      if (input) {
        return input.replace(/./g, '*')
      } else {
        return ''
      }
    }
  },
  components: {
    VueCropper
  }
}
</script>

<style lang="less" scoped>
.avatar {
  position: relative;
  img {
    width: 70px;
    height: 70px;
    display: block;
    border-radius: 50%;
    margin: 30px auto;
  }
  .uploader {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
}
.van-dialog {
  padding: 0 10px;
}
.van-field {
  border: 1px solid #ccc;
  margin: 10px 0;
}
.cropper-mask {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 999;
  top: 0;
  left: 0;
  .crop,
  .cancel {
    position: absolute;
    top: 0;
  }
  .crop {
    left: 0;
  }
  .cancel {
    right: 0;
  }
}
</style>

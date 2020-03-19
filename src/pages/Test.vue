<template>
  <div class="test">
    <!-- 
      img: 用于指定需要裁剪那张图片
      outputSize: 指定裁剪的图片质量
      outputType: 指定裁剪出来的图片的格式  jpeg | png | webp
      autoCrop: 是否生成裁剪框   默认false
      info: 是否显示裁剪框的信息 默认true
      canScale: 图片是否允许滚轮缩放  是否允许通过滚轮进行缩放图片  默认是true
      autoCropWidth: 指定默认生成裁剪框的宽度
      autoCropHeight: 指定默认生成裁剪框的宽度
      fixed: 是否开启截图框宽高固定比例 是否宽高等比例缩放
      fixedNumber: 指定宽高比例  默认 [1,1]

      fixedBox: 是否固定裁剪框的大小，不允许调整大小  
      canMove: 图片能否移动

      canMoveBox： 裁剪框是否可以移动
      -->
    <vue-cropper
      ref="cropper"
      img="https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2829387590,2128721795&fm=26&gp=0.jpg"
      :outputSize="1"
      outputType="jpeg"
      :autoCrop="true"
      :info="true"
      :autoCropWidth="150"
      :autoCropHeight="150"
    ></vue-cropper>
    <van-button class="crop" type="primary" @click="crop">裁剪</van-button>
  </div>
</template>

<script>
import { VueCropper } from 'vue-cropper'
export default {
  // 局部注册了头像裁剪插件
  components: {
    VueCropper
  },
  methods: {
    crop() {
      // 裁剪图片, 获取裁剪的图片数据
      this.$refs.cropper.getCropBlob(data => {
        // data是图片的base64编码
        console.log(data)
      })
    },
    // 可以把图片的base64编码转成一个file文件
    convertBase64UrlToBlob(urlData) {
      let bytes = window.atob(urlData.split(',')[1]) // 去掉url的头，并转换为byte
      // 处理异常,将ascii码小于0的转换为大于0
      let ab = new ArrayBuffer(bytes.length)
      let ia = new Uint8Array(ab)
      for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i)
      }
      return new Blob([ab], { type: 'image/jpeg' })
    }
  }
}
</script>

<style lang="less" scoped>
.test {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.crop {
  position: absolute;
  bottom: 0;
}
</style>

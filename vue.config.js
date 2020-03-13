module.exports = {
  devServer: {
    open: true
  },
  // 配置px自动转rem的
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            // rem的单位， 因为使用了lib-flexible, lib-flexible会把所有的屏幕分成10份
            // 1rem 就应该配置为 设计图的  1/10   640
            // 如果设置为75px， 如果项目中还用到了第三方的库 vant-ui  写的单位也是px
            // 如果拿到750的设计图，记得缩小一倍，

            // 如果 750的设计图   1rem = 75px   直接1:1量设计图   400px  真正等比例  375的手机：  200px
            // 如果把设计图缩小一倍 1rem = 37.5px 量设计图：把750的设计图缩小到375  在375的设计图量   200px

            // 是一倍图的1/10
            remUnit: 36
          })
        ]
      }
    }
  }
}

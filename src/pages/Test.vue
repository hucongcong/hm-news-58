<template>
  <!-- 要在test组件中渲染son组件 -->
  <div class="test">
    我是test组件-----{{user.name}} ----- {{user.age}}
    <!-- 要把user的son的数据给son组件渲染，但是如果user没有son属性，没必要渲染son组件 -->
    <son v-if="user.son" :user="user.son"></son>
  </div>
</template>

<script>
// 使用son组件渲染孩子信息
import Son from './Son'
export default {
  components: {
    Son
  },
  data() {
    return {
      user: {
        name: '张安',
        age: 99,
        son: {
          name: '张斯柯达',
          age: 76,
          son: {
            name: '张斯',
            age: 50,
            son: {
              name: '张塑料袋口',
              age: 20
            }
          }
        }
      }
    }
  }
}
</script>

<style>
</style>
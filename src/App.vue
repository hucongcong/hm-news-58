<template>
  <div>
    <!-- 
      指定路由出口
      keep-alive默认会缓存所有的组件
      通过include属性可以设置keep-alive需要缓存的组件,需要在数组中指定需要缓存的组件的名字，组件如果需要被keep-alive缓存，也需要指定一个name
    -->
    <keep-alive :include="['home']">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style></style>

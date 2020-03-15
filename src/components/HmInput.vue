<template>
  <div class="hm-input">
    <input
      :type="type"
      :placeholder="placeholder"
      :value="value"
      @input="inputFn"
      :class="{ success: status === 'success', error: status === 'error' }"
    />
    <div class="tips" v-show="status === 'error'">{{ message }}</div>
  </div>
</template>

<script>
export default {
  // 用于接收父组件传递过来的数据
  // props: ['type', 'placeholder']
  props: {
    // 接收type属性
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: '请输入...'
    },
    value: String,
    // 传入正则表达式
    rule: RegExp,
    message: String
  },
  data() {
    return {
      // 记录表单的校验状态的
      status: ''
    }
  },
  methods: {
    // 需要把input框的值传给父组件
    inputFn(e) {
      // e.target能够获取到触发事件的元素
      // 怎么通过事件对象获取到值
      // console.log(e.target.value)
      let value = e.target.value
      this.$emit('input', value)

      this.validate(value)
    },
    // 对表单进行校验，返回值：返回值校验的状态
    validate(value) {
      // 添加表单校验
      if (this.rule) {
        // 判断value值是否符合传入 的正则
        if (this.rule.test(value)) {
          this.status = 'success'
          return true
        } else {
          this.status = 'error'
          return false
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.hm-input {
  height: 50px;
  margin: 0 10px;
  input {
    height: 30px;
    line-height: 30px;
    outline: none;
    border: none;
    border-bottom: 1px solid #ccc;
    width: 100%;
    font-size: 16px;
    color: #666;

    &.success {
      border-color: green;
    }

    &.error {
      border-color: red;
    }
  }

  .tips {
    color: red;
    font-size: 12px;
    height: 20px;
    line-height: 20px;
  }
}
</style>

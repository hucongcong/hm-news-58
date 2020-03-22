// try..catch语法用于处理错误的

// 这段代码可能会报错，也可能不会
// try: 尝试，，，，在try中写可能会报错的代码
// 只有当try中的代码报错了，catch的代码才会执行，并且catch会接收到错误信息，，，catch就是对try的错误处理。
try {
  var num = 1
  console.log(num)
} catch (err) {
  console.log(err)
  console.log('报错了')
}

console.log('123')

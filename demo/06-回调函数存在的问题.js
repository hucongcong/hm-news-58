// 使用nodejs中文件模块来演示
// 需求： 按照顺序读取 a b c 三个json文件
// 异步任务的问题： 如果多个异步任务需要有顺序的执行，会涉及到回调函数的嵌套。
// 回调地狱：在回调函数中嵌套回调函数，就会造成回调地狱，这样的代码很难维护。
const fs = require('fs')
fs.readFile('./a.json', 'utf8', (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log(data)
    // 等读取完成a文件，才开始读取b文件
    fs.readFile('./b.json', 'utf8', (err, data) => {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
        // 读取b之后，读取c文件
        fs.readFile('./c.json', 'utf8', (err, data) => {
          if (err) {
            console.log(err)
          } else {
            console.log(data)
          }
        })
      }
    })
  }
})

// $.ajax({
//   url: '/user/1',
//   type: 'get',
//   success: function() {
//     console.log('1请求')
//   }
// })
// $.ajax({
//   url: '/user/2',
//   type: 'get',
//   success: function() {
//     console.log('2请求')
//   }
// })
// $.ajax({
//   url: '/user/3',
//   type: 'get',
//   success: function() {
//     console.log('3请求')
//   }
// })

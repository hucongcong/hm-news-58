// 按照顺序读取3个文件
const fs = require('fs')
// 封装一个读取文件的方法，基于promise进行封装
function read(file) {
  return new Promise(function(resolve, reject) {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

// promise对象支持链式调用，解决回调低于的问题
// promise可以在一个.then中再返回一个新的promise对象，就可以实现链式的调用
// 基于promise封装的语法，解决了回调函数嵌套的问题，变成了链式编程。没有了回调低于的问题。
read('a.json')
  .then(res => {
    console.log(res)
    // 返回了一个新的promise对象
    return read('b.json')
  })
  .then(res => {
    console.log(res)
    return read('c.json')
  })
  .then(res => {
    console.log(res)
  })
  .catch(err => {
    console.log(err)
  })

// ES6推出promise语法，解决了回调地狱的问题，但是promise的链式调用也不方便。  es6  ES2015
// ES8的又推出async和await的语法：  async和await配合promise来用，非常的方便。

// async await之后，再无回调函数，，， async await异步编程终极解决方案

// 1. async和await是两个关键字
// 2. async用于修饰一个函数  async function fn(){} 就是一个异步函数
// 3. await用于等待一个值(promise)，await必须在async函数中使用才生效
// console.log(1)

// // async修饰一个函数，这个函数代表异步函数
// async function fn() {
//   const num = await 2
//   console.log(num)
// }
// fn()

// console.log(3)

const fs = require('fs')
// 只要调用read方法，就会得到一个promise对象
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

async function fn() {
  // await会等待 promise成功的结果  .then(res=>{})
  // await一旦没有等到promise成功的结果，如果promise失败了，await会抛出这个异常。
  // 如果要考虑到promise的异常，需要使用try..catch语法
  try {
    const res1 = await read('a.json')
    console.log(res1)
    const res2 = await read('db.json')
    console.log(res2)
    const res3 = await read('c.json')
    console.log(res3)
  } catch (err) {
    console.log('读取文件失败了', err)
  }

  console.log('123123123123')
}

fn()

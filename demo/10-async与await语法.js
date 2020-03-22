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
  // 正常，promise要得到成功的结果
  // await promise对象,  await就会暂停async函数的执行，会一直等待，等待promise的结果
  // read('a.json').then(res => {})
  const res = await read('a.json')
  console.log(res)
  const res2 = await read('b.json')
  console.log(res2)
  const res3 = await read('c.json')
  console.log(res3)
}

fn()

console.log(123)
console.log(234)

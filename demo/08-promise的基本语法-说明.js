// promise代表一个承诺，promise内部会封装一个异步的操作
const p = new Promise(function(resolve, reject) {
  // 异步操作
  // 延时器，得到一个随机数, 如果随机的值大于0.5
  setTimeout(function() {
    // 随机得到钱
    const money = (Math.random() * 1000) | 0
    console.log(money)
    if (money >= 500) {
      resolve('买口红')
    } else {
      reject('没钱，咱不买')
    }
  }, 1000)
})

p.then(function(res) {
  console.log('真开心', res)
}).catch(function(err) {
  console.log('哎，渣男', err)
})

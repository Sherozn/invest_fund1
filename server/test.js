let date = new Date("2019-04-15")
    // 设定一个初始时间
const start = new Date("2019-04-01")
let offset = date.getTime() - start.getTime()
console.log("offset",offset)
let cu = parseInt(offset / 1000 / 60 / 60 / 24 / 7) % 2
console.log("cu",cu)
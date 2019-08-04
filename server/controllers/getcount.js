const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {openid} = ctx.request.query
  const sum_count = await mysql('funds')
        .sum("count as c")
        .where({
          is_delete:false,
          openid:openid
        })
  console.log("sum_count",sum_count)
  ctx.state.data = {
    sum_count
  }
}
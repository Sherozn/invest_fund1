const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {openid} = ctx.request.query
	const funds = await mysql('funds')
  			.select('id','name','code')
  			.where({
          is_delete:false,
          openid:openid
        })
  ctx.state.data = {
  	funds
  }
}
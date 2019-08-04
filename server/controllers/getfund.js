const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {fund_id} = ctx.request.query
	try{
		const fund = await mysql('funds')
	  			.select()
	  			.where("id",fund_id).first()
	  console.log("fund",fund)
	  ctx.state.data = {
	  	fund
	  }
	}catch(e){
		ctx.state = {
      code: -1,
      data: {
        msg: '获取失败，请刷新重试'
      }
    }
	}
}
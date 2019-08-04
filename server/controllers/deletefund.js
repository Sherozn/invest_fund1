const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {fund_id} = ctx.request.body
	try{
		const res = await mysql('funds')
  			.where("id",fund_id)
  			.update("is_delete",true)
    await mysql('fund_items')
        .where("fund_id",fund_id)
        .update('status',7)
  	ctx.state.data = {
  		code: 0,
      msg: 'success'
    }
    console.log("ctx.state.data",ctx.state.data)
	}catch(e){
		ctx.state = {
      code: -1,
      data: {
        msg: '删除失败' + e.sqlMessage
      }
    }
	}
}
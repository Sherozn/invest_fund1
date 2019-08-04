const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {item_id,fund_id} = ctx.request.body
	try{
		const res = await mysql('fund_items')
  			.where("id",item_id)
  			.del()
    await mysql('funds').where("id",fund_id).decrement('count', 1)
  	ctx.state.data = {
  		code: 0,
      msg: 'success'
    }
	}catch(e){
    console.log("eeeeeee",e)
		ctx.state = {
      code: -1,
      data: {
        msg: '删除失败' + e.sqlMessage
      }
    }
	}
}
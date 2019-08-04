const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {fund_id,harvest_line,harvest_money,ready_money,step_cycle,step_day} = ctx.request.body
	try{
		const res = await mysql('funds')
  			.where("id",fund_id)
  			.update({harvest_line,harvest_money,ready_money,step_cycle,step_day})
  	ctx.state.data = {
  		code: 0,
      msg: 'success'
    }
	}catch(e){
		ctx.state = {
      code: -1,
      data: {
        msg: '新增失败' + e.sqlMessage
      }
    }
	}
}
const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
	const {as_type,fund_id} = ctx.request.body
  console.log("as_type === 1",as_type === 1)
  console.log("fund_id resetfund",fund_id)
	try{
    if(as_type === 0){
      await mysql('funds').where("id",fund_id).update('count',0)
      await mysql('fund_items').where("fund_id",fund_id).update("status",7)
    }else if(as_type === 1){
      await mysql('fund_items')
            .where("fund_id",fund_id)
            .havingIn('status', [0,3])
            .orderBy('date','desc').orderBy('id','desc').first()
            .update("status",3)
    }
		
  	ctx.state.data = {
  		code: 0,
      msg: 'success'
    }
	}catch(e){
		ctx.state = {
      code: -1,
      data: {
        msg: '失败' + e.sqlMessage
      }
    }
	}
}
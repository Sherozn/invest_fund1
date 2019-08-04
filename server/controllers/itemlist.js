const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {page,fund_id} = ctx.request.query
  console.log('page',page)
  const size = 15
  const fund_items = await mysql('fund_items')
   												 	.select('id','fund_id','date','cost','share','amount','net','busi_code','commission','sum_share','sum_amount','status')
			                      .where("fund_id",fund_id)
                            .havingIn('status', [0,3])
			                      .orderBy('date','desc').orderBy('id','desc')
                            .limit(size).offset(Number(page) * size)
	console.log('fund_items',fund_items.length)
  ctx.state.data = {
  	fund_items
  }
}

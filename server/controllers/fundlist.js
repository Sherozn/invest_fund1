const {mysql} = require('../qcloud')
const https = require('https')

module.exports = async (ctx) => {
  const {openid} = ctx.request.query
  // console.log('打印openid',openid)
  const funds = await mysql('funds')
  			.select('id','name','code','as_type','count','ready_money','step_cycle','step_day','single_week')
  			.where({
          is_delete:false,
          openid:openid
        })
  console.log('funds',funds)
 	try{
 		var funds_hash = []
	  if(funds){
	  	for(j = 0; j < funds.length; j++) {
	  		fund = funds[j]
   			// console.log('code',funds[j].code)
        const fundItem = await mysql('fund_items')
                                .select('date','cost','sum_share','sum_amount','real_money','average_price','sum_commission','status')
                                .where("fund_id",fund.id)
                                .havingIn('status', [0,3])
                                .orderBy('date','desc').orderBy('id','desc').first()
			  var data = {}
			  if(fundItem){
          let url = "https://fundgz.1234567.com.cn/js/" + fund.code + ".js"
          const fundinfo = await getJSON(url)
          
			    data = {
			      cost:fundItem.cost,
			      sum_share:fundItem.sum_share,
			      sum_amount:fundItem.sum_amount,
			      real_money:fundItem.real_money,
			      average_price:fundItem.average_price,
			      sum_commission:fundItem.sum_commission,
			      gsz:fundinfo.gsz,
            date:fundItem.date,
            status:fundItem.status
			    }
			  }else{
			    data = {
			      cost:0.0,
			      sum_share:0.0,
			      sum_amount:0.0,
			      real_money:0.0,
			      average_price:0.0,
			      sum_commission:0.0,
			      gsz:0.0,
            date:"",
            status:0
			    }
			  }
			  funds_hash.push(Object.assign({}, fund, {
	        item: data
	      }))
			} 
	  }
	  // console.log("funds_hash",funds_hash)
 	}catch (e){
 		console.log("eeeee",e)
 	}
  ctx.state.data = {
  	funds_hash
  }
}

function getJSON (url) {
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let urlData = ''
      res.on('data', data => {
        urlData += data
      })
      res.on('end', data => {
        // console.log('urlData',urlData)
        if(urlData.indexOf("jsonpgz") >= 0){
          const resData = urlData.slice(8,-2)
          // console.log('resData',resData)
          if(resData){
            const fundinfo = JSON.parse(urlData.slice(8,-2))
            if (fundinfo.fundcode) {
              resolve(fundinfo)
            }
            reject("无信息")
          }else{
            reject("无信息")
          }
        }else{
          reject("无信息")
        }
      })
    })
  })
}

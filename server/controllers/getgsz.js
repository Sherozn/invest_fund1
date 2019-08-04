const https = require('https')
const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {code,fund_id} = ctx.request.query
  // console.log('打印openid',openid)
  let url = "https://fundgz.1234567.com.cn/js/" + code + ".js"
  const fundinfo = await getJSON(url)
  const fundItem = await mysql('fund_items')
                        .select('cost','sum_share','sum_amount','invest_money','real_money','average_price','sum_commission','status')
                        .where("fund_id",fund_id)
                        .havingIn('status', [0,3])
                        .orderBy('date','desc').orderBy('id','desc').first()
  var data = {}
  if(fundItem){
    data = {
      cost:fundItem.cost,
      sum_share:fundItem.sum_share,
      invest_money:fundItem.invest_money,
      real_money:fundItem.real_money,
      average_price:fundItem.average_price,
      sum_commission:fundItem.sum_commission,
      sum_amount:fundItem.sum_amount,
    }
  }else{
    data = {
      cost:0.0,
      sum_share:0.0,
      invest_money:0.0,
      real_money:0.0,
      average_price:0.0,
      sum_commission:0.0,
      sum_amount:0.0,
    }
  }
  ctx.state.data = {
    item:data,
  	now:{
  		gsz:fundinfo.gsz
  	}
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
          console.log('resData',resData)
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

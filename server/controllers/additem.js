const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {fund_id,date,net,share,busi_code} = ctx.request.body

  const fund = await mysql('funds')
                        .select('commission','ready_money','count')
                        .where('id',fund_id).first()
  console.log('fund',fund)

  const fundItem = await mysql('fund_items')
                        .select('*')
                        .where('fund_id',fund_id)
                        .havingIn('status', [0,3])
                        .orderBy('date','desc').orderBy('id','desc').first()


  //净交易金额
  var final_fee = share * net
  //手续费
  // var commission = 0.1
  if(final_fee <= 1000){
    commission = 1000 * fund.commission
  }else{
    commission = parseFloat((final_fee * fund.commission).toFixed(2))
  }
  console.log('commission',commission)
  //实际投入金额
  var amount = commission + final_fee

  if(fundItem){
    sum_share = fundItem.sum_share + share*busi_code
    //剩余份额投入的金额  成本*总份额
    sum_amount = fundItem.sum_amount + final_fee*busi_code + commission
    // cost = (fundItem.sum_amount+amount*busi_code)/sum_share
    // sum_amount = fundItem.sum_amount + amount*busi_code
    if(sum_share > 0){
      cost = sum_amount/sum_share
    }else{
      cost = 0
    }
    
    sum_commission = fundItem.sum_commission + commission
    if(busi_code == -1){
      average_price = fundItem.average_price
      //实际赚取
      real_money = fundItem.real_money + (net-average_price)*share
    }else{
      average_price = (fundItem.average_price*fundItem.sum_share+final_fee)/sum_share
      real_money = fundItem.real_money
    }
    // invest_money = cost*sum_share + real_money + sum_commission
    //实际总投入金额
    invest_money = sum_amount + real_money
  }else{
    sum_share = parseFloat(share)*busi_code
    console.log('parseFloat(share)*busi_code',parseFloat(share)*busi_code)
    sum_amount = parseFloat(amount)*busi_code
    cost = amount/share
    average_price = net
    sum_commission = commission
    real_money = 0
    invest_money = amount + real_money
  }
  var count = fund.count + 1

  // if(fund.ready_money){
  //   //仓位
  //   var hold_local = sum_amount/fund.ready_money
  // }

  if(sum_share < 0){
    ctx.state = {
      code: -1,
      data: {
        msg: '当前份额小于0，请查看是否正确添加记录'
      }
    }
    return
  }

  try {
    const date_fund = {
      count
    }
    const data_item = {
      fund_id, 
      date, 
      net, 
      busi_code, 
      commission, 
      share, 
      amount,
      cost,
      real_money,
      invest_money,
      average_price,
      sum_amount,
      sum_share, 
      sum_commission
    }
    console.log("date_fund mysql",date_fund)
    await mysql('funds')
          .where('id',fund_id)
          .update(date_fund)
    console.log("data_item mysql",data_item)
    await mysql('fund_items').insert(data_item)
    ctx.state.data = {
      msg: 'success'
    }
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        msg: '新增失败' + e
      }
    }
  }

}
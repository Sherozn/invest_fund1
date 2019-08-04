//https://fundgz.1234567.com.cn/js/512980.js
const https = require('https')
const {mysql} = require('../qcloud')

module.exports = async (ctx) => {
  const {openid,code,name_auto,commission,as_type,ready_money,step_cycle,step_day,single_week,harvest_line,harvest_money} = ctx.request.body
  var name = ""
  if (openid && code) {
    const findRes = await mysql('funds').select().where({
      code:code,
      openid:openid
    }).first()
    console.log("findRes.is_delete",findRes.is_delete)
    console.log("findRes.is_delete === true",findRes.is_delete === true)
    if (findRes && findRes.is_delete === 0) {
      ctx.state = {
        code: -1,
        data: {
          msg: "基金已被添加过了哦"
        }
      }
      return
    }else if(findRes && findRes.is_delete === 1){
      try {
        const is_delete = false
        const count = 0
        const name = findRes.name
        await mysql('funds')
              .select()
              .where("id",findRes.id)
              .update({
                as_type,commission,count,ready_money,step_cycle,step_day,single_week,harvest_line,harvest_money,is_delete
              })
        ctx.state.data = {
          code,
          name,
          msg: 'success'
        }
      }catch (e) {
        ctx.state = {
          code: -1,
          data: {
            msg: '新增失败' + e.sqlMessage
          }
        }
      }
    }else{
      if(name_auto === ""){
        let url = "https://fundgz.1234567.com.cn/js/" + code + ".js"
        const fundinfo = await getJSON(url)
        var name = fundinfo.name
        console.log('name1',name)
        console.log('fundinfo1',fundinfo)
      }
      console.log('name2',name)
      try {
        var name = name? name : name_auto
        await mysql('funds').insert({
          openid, name, code, as_type, commission,ready_money,step_cycle,step_day,single_week,harvest_line,harvest_money
        })
        ctx.state.data = {
          code,
          name,
          msg: 'success'
        }
      } catch (e) {
        ctx.state = {
          code: -1,
          data: {
            msg: '新增失败' + e.sqlMessage
          }
        }
      }
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
        console.log('urlData',urlData)
        if(urlData.indexOf("jsonpgz") >= 0){
          const resData = urlData.slice(8,-2)
          console.log('resData',resData)
          if(resData){
            const fundinfo = JSON.parse(urlData.slice(8,-2))
            if (fundinfo.fundcode) {
              resolve(fundinfo)
            }
            reject(fundinfo)
          }else{
            reject("无法获取该基金名称,请手动添加")
          }
        }else{
          reject("该基金代码不存在")
        }
      })
    })
  })
}

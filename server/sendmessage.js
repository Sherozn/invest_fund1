const config = require('./config.js');
const https = require('https')
const urlGet = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+ config.appId + "&secret=" + config.appSecret

	https.get(urlGet, res => {
  let urlData = ''
  res.on('data', data => {
    urlData += data
  })
  res.on('end', data => {
    console.log('urlData',urlData)
    urlDatas = JSON.parse(urlData)
    if(urlDatas.access_token){
      access_token = urlDatas.access_token
      var datas = {
			  "touser": "oqURH46cYrMV3IwrrflosChndRTI",
			  "template_id":"ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
			  "page": "index",
			  "data":"{'User': {'value':'黄先生','color':'#173177'},'Date':{'value':'06月07日 19时24分','color':'#173177'},'CardNumber':{'value':'0426','color':'#173177'},'Type':{'value':'消费','color':'#173177'},'Money':{'value':'人民币260.00元','color':'#173177'},'DeadTime':{'value':'06月07日19时24分','color':'#173177'},'Left':{'value':'6504.09','color':'#173177'}}",
			  "emphasis_keyword": "keyword1.DATA"
			}
			// var datas = {
			// 	"touser":"oqURH46cYrMV3IwrrflosChndRTI",
			// 	"template_id":"ngqIpbwh8bUfcSsECmogfXcV14J0tQlEpBO27izEYtY",
			// 	"page": "index",
			// 	"data":{
			// 		"User": {
			// 		"value":"黄先生",
			// 		"color":"#173177"
			// 		},
			// 		"Date":{
			// 		"value":"06月07日 19时24分",
			// 		"color":"#173177"
			// 		},
			// 		"CardNumber":{
			// 		"value":"0426",
			// 		"color":"#173177"
			// 		},
			// 		"Type":{
			// 		"value":"消费",
			// 		"color":"#173177"
			// 		},
			// 		"Money":{
			// 		"value":"人民币260.00元",
			// 		"color":"#173177"
			// 		},
			// 		"DeadTime":{
			// 		"value":"06月07日19时24分",
			// 		"color":"#173177"
			// 		},
			// 		"Left":{
			// 		"value":"6504.09",
			// 		"color":"#173177"
			// 		}
			// 	}
			// }
			var da = require('querystring').stringify(datas)
			const urlPost = "https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=" + access_token + da
			
			
			var opt = {
	      host:'api.weixin.qq.com',
	      method:'POST',
	      path:"/cgi-bin/message/wxopen/template/send?access_token=" + access_token,
	      headers: {
			    'Content-Type': 'application/json',
			    'Content-Length': Buffer.byteLength(da)
			  }
			}

			var body = '';
			var req = https.request(opt, function(res) {
			    console.log("Got response: " + res.statusCode);
			    res.on('data',function(d){
			        body += d;
			    }).on('end', function(){
			    	  // console.log("res",res.content)
			        console.log("res.headers",res.headers)
			        console.log("body",body)
			    });
			}).on('error', function(e) {
			    console.log("Got error: " + e.message);
			})
			// data = {user:"hello",password:"world"};
			console.log("da",da)
			var ress = req.write(da);
			// console.log("ress",ress)
			req.end();
			

			// https.get(urlPost,data,res =>{
			// 	let postData = ''
			// 	res.on('data', data => {
			//     postData += data
			//   })
			//   res.on('end', data => {
			//   	console.log('postData',postData)
			//   })
			// })
    }
  })
})




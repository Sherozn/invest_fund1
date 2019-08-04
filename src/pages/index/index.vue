<template>
  <div>
  	<template v-if="userinfo.nickName">
  		<div v-if='funds_show'>
		  	<div class="prompt">暂未添加基金，点击下方按钮添加</div>
		  	<div class="add" >
		      <img :src="src" @click='addFund'>
		      <p>添加基金</p>
		    </div>
		 	</div>
		 	<div v-else>
		 		<div class="top">
		 			<div class="right">
		 				<label class="title">投入总额（元）</label><br>
		 		  	<label class="money">{{sum_amount}}</label>
		 			</div>
		 			<div class="left">
		 				<label class="title">总市值（元）</label><br>
		 		  	<label class="money">{{sum_value}}</label>
		 			</div>
		 			<div class="bottom">
		 				<label class="title">总盈亏</label><br>
		 		  	<label class="money">{{sum_total_money}} &nbsp; {{sum_total_profit}}%</label>
		 			</div>
		 		</div>
		 	  <FundList :key='index' v-for='(fund,index) in funds' :fund='fund' :sum_amount="fund.item.sum_amount"></FundList>
		 	</div>
  	</template>
  	<div v-else>
  		<div class="prompt">您还未登录，请先</div>
      <button open-type="getUserInfo" lang="zh_CN" class='btn' @getuserinfo="login">授权登录</button>
  	</div>
  	
	 	<!-- <div class="add">
      <img :src="src" @click='addFund'>
      <p>添加基金</p>
    </div> -->
  </div>
</template>

<script>
import {get,showSuccess} from '@/util'
import FundList from '@/components/FundList'
import qcloud from 'wafer2-client-sdk'
import config from '@/config'
export default {
	components: {
    FundList
  },
  data () {
    return {
      userinfo:{},
      // 就是我们刚刚粘贴的images文件夹中的图标路径
      src: "../../static/images/plus-circle.png",
      // 是否显示添加基金的图标
      funds_show:false,
      // 用户添加的基金，从数据库获取到之后会放在这个数组中
      funds:[],
      // 总市值
      sum_value:'',
      // 投入总额
      sum_amount:'',
      // 总盈亏比例
      sum_total_profit:'',
      // 总盈亏金额
      sum_total_money:'',
    }
  },
  methods: {
	  async addFund () {
	    wx.navigateTo({
	      url:'/pages/addfund/main'
	    })
	  },
	  async getFunds () {
	  	wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
	  	const data = {
	  		openid: this.userinfo.openId
	  	}
	  	const funds = await get('/weapp/fundlist', data)
	  	this.funds = funds.funds_hash
	  	// console.log('this.funds',this.funds)
	  	try{
	  		var sum_value = 0.0
		  	var sum_amount = 0.0
		  	for(var j = 0; j < this.funds.length; j++){
		  		sum_amount = sum_amount + this.funds[j].item.sum_amount
		  		sum_value = sum_value + this.funds[j].item.gsz * this.funds[j].item.sum_share
		  	}
		  	this.sum_amount = sum_amount.toFixed(2)
		  	this.sum_value = sum_value.toFixed(2)
		  	this.sum_total_money = (sum_value - sum_amount).toFixed(2)
		  	if(sum_amount < 0){
		  		if(sum_value != 0){
		  			this.sum_total_profit = ((sum_value - sum_amount)*100/sum_value).toFixed(2)
		  		}else{
		  			this.sum_total_profit = 100
		  		}
		  	}else if(sum_amount > 0){
		  		this.sum_total_profit = ((sum_value - sum_amount)*100/sum_amount).toFixed(2)
		  	}else{
		  		this.sum_total_profit = 0
		  	}
		  	// this.sum_total_profit = sum_amount != 0? (((sum_value - sum_amount)/sum_amount)*100).toFixed(2) : "0"
	  	}catch(e){
	  		console.log('eeee',e)
	  	}
	  	if(this.funds.length === 0){
	  		this.funds_show = true
	  	}else{
	  		this.funds_show = false
	  	}
	  	wx.hideToast()
	  },
    loginSuccess (res) {
      showSuccess('登录成功')
      //将res加入到Storage中
      wx.setStorageSync('userinfo', res)
      this.userinfo = res
    },
    login () {
      wx.showToast({
        title: '登录中',
        icon: 'loading'
      })
      qcloud.setLoginUrl(config.loginUrl)
      const session = qcloud.Session.get()
      if (session) {
        qcloud.login({
          success: res => {
          	wx.showTabBar()
            console.log('没过期的登录', res)
            this.loginSuccess(res)
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onPullDownRefresh();
          },
          fail: err => {
            console.error(err)
          }
        })
      } else {
        qcloud.login({
          success: res => {
          	wx.showTabBar()
            console.log('登录成功', res)
            this.loginSuccess(res)
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onPullDownRefresh();
          },
          fail: err => {
            console.error('登录失败', err)
          }
        })
      }
    }
	},
	onPullDownRefresh () {
    console.log("下拉程序正在运行中")
    this.getFunds()
    wx.stopPullDownRefresh()
  },
	mounted () {
		const userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
    console.log('this.userinfo index',this.userinfo)
    if(userinfo.nickName){
    	this.getFunds()
    }else{
    	wx.hideTabBar()
    }
  }
}
</script>

<style lang='scss'>
.add{
	margin-top: 20px;
	margin-bottom: 10px;
	text-align:center;
	img{
		width: 55px;
    height:55px;
    border-radius: 50%;
  }
  p{
  	font-size: 15px;
  }
}
.top{
	background:#EA5149;
	/*height: 100px;*/
	.right{
    float: right;
  }
  .left{
    margin-right:50px;
  }
	.title{
    font-size: 13px;
    color: #E8E8E8;
    margin-left: 15px;
    /*font-weight:lighter;*/
  }
  .money{
  	color: #FFFFFF;
  	font-size: 20px;
  	font-weight:bold;
  	margin: 10px 15px;
  }
  .bottom{
  	padding-bottom: 5px;
  }
}
</style>

<template>
	<div class="book-card">
		<div class="detail">
		  <div class="row">
        <div>
          <a class="a-line" :href="recordlUrl">
          <label class="name">{{fund.name}}</label>&nbsp;
          <label class="title">{{fund.code}}</label>
          <label class="title fund_type">{{as_type}}</label>
          </a>
          <Ellipsis :fund='fund' :elli="false"></Ellipsis>
        </div>
		  </div>
      <a class="a-line" :href="recordlUrl">
			<div class="row">
		  	<div class="left-top">
          <label class="title">累计盈亏</label>&nbsp;
          <label :style="profitStyle">
            <label class="green">{{total_money}}</label>&nbsp;&nbsp;
            <label class="green">{{total_profit}}%</label>
          </label>
		  	</div>
		  </div>
      
      <template v-if="fund.count > 0 && fund.item.sum_share === 0 && fund.item.status != 3">
        <div class="reset-fund">
         <div class="question">该基金份额已全部卖出，是否重新开始定投？</div>
         <div class="answer" @click="confirm(0)">‣ 重新开始定投<label class="vice">（累计盈亏、定投记录等清空）</label></div>
         <div class="answer" @click="confirm(1)">‣ 继续之前定投<label class="vice">（累计盈亏、定投记录等不清空）</label></div>
        </div>
        
      </template>
      <template v-else>
        <div class="row">
          <div class="right">
            <label class="title">实盈亏：</label>
            <label class="in-right">{{fund.item.real_money}}</label>
          </div>
          <div class="left">
            <label class="title">浮盈亏：</label>
            <label class="in-right">{{fake_lose}}</label>
          </div>
        </div>
        <div class="row">
          <div class="right">
            <label class="title">市值：</label>
            <label class="in-right">{{value}}</label>
          </div>
          <div class="left">
            <label class="title">市价：</label>
            <label class="in-right">{{gsz}}</label>
          </div>
        </div>
        <div class="row">
          <div class="right">
            <label class="title">投入金额：</label>
            <label class="in-right">{{sum_amount}}</label>
          </div>
          <div class="left">
            <label class="title">成本：</label>
            <label class="in-right">{{cost}}</label>
          </div>
        </div>
        <div class="row">
          <div class="right">
            <template v-if="show_count">
              <label class="title" >当前仓位：</label>
              <label class="in-right">{{hold_local}}%</label>
            </template>
            <template v-else> 
              <label class="title">交易次数：</label>
              <label class="in-right">{{fund.count}}</label>
            </template>
          </div>
          <div class="left">
            <label class="title">持仓数：</label>
            <label class="in-right">{{fund.item.sum_share}}</label>
          </div>
        </div>
      </template>
      </a>
		</div>
    <div v-if="getInvestDay" class="notice" @click="addFundItem">
      <label>今天是定投日，点此快速添加记录</label>
    </div>
	</div>
</template>

<script>
import {get,post} from '@/util'
import Ellipsis from '@/components/Ellipsis'
export default {
  components: {
    Ellipsis
  },
  props: ['fund'],
  data () {
    return {
      value:0.0,
      cost:"",
      gsz:0.0,
      sum_amount:0.0,
      total_profit:0.0,
      total_money:0.0,
      fake_lose:0.0,
      hold_local:0.0,
      show_count:false,
      as_type:''
    }
  },
  methods: {
    get_gsz () {
      const fund = this.fund
      if(fund.as_type == 1){
        this.as_type = "场内"
      }else if(fund.as_type == 2){
        this.as_type = "场外"
      }
      this.gsz = fund.item.gsz
      const sum_share = fund.item.sum_share
      this.value = parseInt(this.gsz * sum_share*100)/parseInt(100)
    
      const cost = fund.item.cost
      this.total_money = (this.gsz*sum_share - fund.item.sum_amount).toFixed(2)
      if(cost > 0){
        this.total_profit = ((this.gsz - cost)*100/cost).toFixed(2)
      }else if(cost < 0){
        this.total_profit = ((this.gsz - cost)*100/this.gsz).toFixed(2)
      }else if(cost === 0){
        if(this.total_money > 0){
          this.total_profit = 100
        }else if(this.total_money < 0){
          this.total_profit = -100
        }else{
          this.total_profit = 0
        }
        
      }
      
      this.cost = cost===0? 0 : cost.toFixed(4)
      this.fake_lose =((this.gsz - fund.item.average_price)*sum_share-fund.item.sum_commission).toFixed(2)
      this.sum_amount = fund.item.sum_amount.toFixed(2)
    },
    get_hold_local () {
      if(this.fund.ready_money){
        this.hold_local = (this.fund.item.sum_amount*100/this.fund.ready_money).toFixed(2)
        this.show_count = true
      }
    },
    async addFundItem () {
      const that = this
      wx.navigateTo({
        url:'/pages/additem/main?fund_id=' + that.fund.id + '&name=' + `${that.fund.name}（${that.fund.code}）` + '&as_type=1'
      })
    },
    confirm(as_type){
      var that = this
      if(as_type === 0){
        wx.showModal({
          content: `确定要重新开始定投基金吗？(累计盈亏、定投记录等清空)`,
          success: function (res) {
            if (res.confirm) {
              that.resetFund(as_type)
            }
          }
        })
      }else if(as_type === 1){
        wx.showModal({
          content: `确定要继续定投基金吗？(累计盈亏、定投记录等不清空)`,
          success: function (res) {
            if (res.confirm) {
              that.resetFund(as_type)
            }
          }
        })
      }
      
    },
    async resetFund(as_type){
      try{
        const data = {
          as_type:as_type,
          fund_id:this.fund.id
        }
        console.log("data fundlist",data)
        const res = await post('/weapp/resetfund', data)
        wx.switchTab({
          url: '/pages/index/main',
          success: function (e) { 
            var page = getCurrentPages().pop();
            console.log('page',page)
            if (page == undefined || page == null) return;
            page.onPullDownRefresh();
          } 
        })
      }catch(e){
        showModal('失败', e.data.msg)
      }
    }
  },
  computed: {
    recordlUrl () {
      return '/pages/record/main?id=' + this.fund.id + '&name=' + `${this.fund.name}（${this.fund.code}）`
    },
    getInvestDay () {
      var util = require('../utils/index.js')
      var date = new Date()
      var date_str = util.formatDate(date)
      var is_invest_day = false
      //今天周几
      var day = date.getDay()
      if(this.fund.item.date != date_str){
        if(this.fund.step_cycle === 1){
          if(day === parseInt(this.fund.step_day)+1){
            is_invest_day =  true
            // console.log('is_invest_day1111',is_invest_day)
          }
        }else if(this.fund.step_cycle === 2){
          const start = new Date("2019-04-01")
          let offset = date.getTime() - start.getTime()
          let cu = parseInt(offset / 1000 / 60 / 60 / 24 / 7) % 2
          if(day === parseInt(this.fund.step_day)+1 && cu === parseInt(this.fund.single_week)){
            is_invest_day =  true
          }
        }else if(this.fund.step_cycle === 3){
          var today = date.getDate();
          if(today === parseInt(this.fund.step_day)+1){
            is_invest_day =  true
          }
        }
      }
      // console.log("is_invest_day",is_invest_day)
      return is_invest_day
    },
    profitStyle () {
      if(this.total_money >= 0){
        return "color:red"
      }else{
        return "color:#009900"
      }
    }
  },
  updated () {
    this.get_gsz()
    this.get_hold_local ()
  },
  mounted () {
    this.get_gsz()
    this.get_hold_local ()
  }
}
</script>

<style lang='scss' scoped>
.book-card{
  background: #FFFFFF;
  margin-bottom:7px;
  .detail{
    padding: 10px 15px 2px 15px;
    .reset-fund{
      font-size: 14px;
      color: #EA5A49;
      .question{
        padding-top: 12px;
        font-weight:bold;
      }
      .answer{
        padding-top: 6px;
        .vice{
          color: #A0A0A0;
          font-size: 12px;
        }
      }
    }
    .row{
      line-height:18px;
      margin-bottom:6px;
      .name{
        font-size: 18px;
        font-weight:bold;
      }
      .left-top{
        margin-right:80px;
      }
      .right{
      width: 40%;
      float: right;
      }
      .in-right{
        float: right;
        font-size: 14px;
        margin-top: 3px;
      }
      .left{
        width: 40%;
        margin-right:80px;
      }
      .title{
        font-size: 13px;
        color: #808080;
      }
      .green{
        font-size: 14px;
        font-weight:bold;
      }
      .fund_type{
        display: inline-block;
        margin-left:8px;
        padding:0px 2px;
        border-radius: 5px;
        border:1px #EA5A49 solid;
        color:#EA5A49;
      }
      .a-line{
        display: inline;
      }
    }
  } 
  .notice{
    border-top:solid #F0F0F0 1px;
    font-size: 13px;
    color: #EA5A49;
    padding: 5px 10px;
  }
}
</style>

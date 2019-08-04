<template>
<div class="view-fund">
  <div class="row">
    <label class="label">基金：</label>
    <label class="radio-group">{{array.value}}</label>
<!--     <label class="right">
      >
    </label> -->
    <!-- <picker @change="bindPickerChange" :range="array" :value="index" range-key="value" v-if="show_funds">
      <view class="picker">
        {{array[index].value}}
      </view>
    </picker> -->
  </div>
  <div class="row">
    <label class="label">选择日期：</label>
    <label class="right">
      >
    </label>
    <picker
      mode="date"
      :value="date"
      start="2010-09-01"
      :end="date"
      @change="bindDateChange">
      <view class="picker">{{date}}</view>
    </picker>
  </div>
  <div class="row">
    <label class="label">选择操作：</label>
    <label class="right">
      >
    </label>
    <picker @change="bindbusiChange" :range="busi_array" :value="busi_index" range-key="name">
      <view class="picker">
        {{busi_array[busi_index].name}}
      </view>
    </picker>
  </div>
  <div class="row">
    <label class="label">基金净值：</label>
    <input v-model='net'
            type="digit"
            class="input"
            :maxlength='100'
            placeholder="输入定投基金净值">
  </div>
  <div class="row">
    <label class="label">定投份额：</label>
    <input v-model='share'
            type="number"
            class="input"
            :maxlength='100'
            placeholder="输入本次定投份额">
  </div>
  <button class="btn" @click='addItem'>
    添加
  </button>
  <div class="annotation">按定投时间顺序添加记录，否则可能影响收益率准确性 </div>
</div>
</template>


<script>
import {get,post, showModal,showSuccess} from '@/util'
export default {
  data () {
    var util = require('../../utils/index.js')
    return {
      index:0,
      array: {},
      fund_id:0,
      name:"",
      as_type:0,
      busi_index:0,
      busi_code:1,
      busi_array:[
        {code:1,name:"买入"},
        {code:-1,name:"卖出"}
      ],
      net:"",
      share:"",
      show_funds:false,
      date:util.formatDate(new Date)
    }
  },
  methods: {
    async addItem(){
      const data = {
        fund_id: this.fund_id,
        date: this.date,
        net: this.net,
        share: this.share,
        busi_code:this.busi_code
      }
      console.log('data addItem',data)
      try {
        if(data.net && data.share){
          const res = await post('/weapp/additem', data)
          const that = this
          if(that.as_type === '0'){
            wx.navigateBack({
              delta: 1,
              success: function (e) { 
                var page = getCurrentPages()[1];
                console.log('page',page)
                console.log('getCurrentPages()',getCurrentPages())
                if (page == undefined || page == null) return;
                page.onPullDownRefresh();
              }
            })
            // wx.reLaunch({
            //   url: '/pages/record/main?id=' + that.fund_id + '&name=' + `${that.name}`,
            //   success: function (e) { 
            //     var page = getCurrentPages().pop();
            //     console.log('page',page)
            //     if (page == undefined || page == null) return;
            //     page.onPullDownRefresh();
            //   }
            // })
          }else if(that.as_type === '1'){
            try{
              wx.redirectTo({
                url: '/pages/record/main?id=' + that.fund_id + '&name=' + `${that.name}`
              })
            }catch(e){
              console.log("eeeee",e)
            }
            
          }
          
          this.net = ''
          this.share = ''
          this.index = 0
          this.busi_index = 0
        }else{
          showModal('失败', "净值或份额不能为空")
        }
      } catch (e) {
        showModal('失败', e.data.msg)
      }
    },
    // bindPickerChange (e) {
    //   this.index = e.mp.detail.value
    //   this.fund_id = this.array[this.index].id
    //   console.log('array',this.fund_id)
    // },
    bindbusiChange (e) {
      this.busi_index = e.mp.detail.value
      this.busi_code = this.busi_array[this.busi_index].code
       console.log('busi_code',this.busi_code)
    },
    bindDateChange(e) {
      this.date = e.mp.detail.value
    },
    // async getFunds () {
    //   const data = {
    //     openid: this.userinfo.openId
    //   }
    //   const funds = await get('/weapp/funds', data)
    //   this.array = []
    //   funds.funds.map(v => {
    //     this.array.push({id:v.id,value:`${v.name}（${v.code}）`})
    //     // this.array[v.id] = `${v.name}（${v.code}）`
    //   })
    //   this.fund_id = this.array[0].id
    //   console.log('this.array',this.array)
    //   this.show_funds = true
    // }
  },
  // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted () {
    this.fund_id = this.$root.$mp.query.fund_id
    this.name = this.$root.$mp.query.name
    this.as_type = this.$root.$mp.query.as_type
    this.array = {id:this.fund_id,value:this.name}
    console.log('this.array',this.array)
    // const userinfo = wx.getStorageSync('userinfo')
    // if (userinfo) {
    //   this.userinfo = userinfo
    // }
    // this.getFunds()
  }
}
</script>

<style lang='scss'>
.view-fund{
  background: #ffffff;
  font-size: 14px;
  .row{
    border-bottom: 1px #E8E8E8 solid;
    height: 50px;
  }
  .input{
    height:50px;
  }
  .radio-group{
    line-height:50px;
  }
  .picker{
    line-height:50px;
  }
  .label{
    float: left;
    font-size: 15px;
    line-height:50px;
    margin-left: 6px;
  }
  .right{
    float: right;
    color: #C8C8C8;
    line-height:50px;
    margin-right: 15px;
  }
  .btn{
    width: 40%;
    margin-bottom: 10px;
  }
  .annotation{
    padding-top: 10px;
    font-size: 12px;
    color: #888888;
    text-align: center;
    background: #F0F0F0;
  }
}
</style>


<template>
<div class="view-fund">
  <div class="annotation">必填项（添加完成后不可修改）</div>
	<div class="row">
    <label class="label">基金代码：</label>
    <label v-if="showEdit" class="edit">{{fund.code}}</label>
    <input  v-else
            v-model='code'
            type="number"
            class="input"
            maxlength='20'
            placeholder="输入6位基金代码">
  </div>
  <div class="row" v-if="showName">
    <label class="label">基金名称：</label>
    <input v-model='name_auto'
            class="input"
            :maxlength='100'
            placeholder="输入基金名称">
  </div>
  <div class="row" v-else-if="showEdit">
    <label class="label">基金名称：</label>
    <label class="edit">{{fund.name}}</label>
  </div>
  <div class="row">
    <label class="label">基金类型：</label>  
    <label v-if="showEdit" class="edit">{{getAsType}}</label>
    <radio-group v-else class="radio-group" @change="radioChange">
      <label class="radio" v-for="(item, index) in items" :key="item.name">
        <radio color='#EA5149' :value="item.name" :checked="item.checked"  /> {{item.value}}
      </label>
    </radio-group>
  </div>
  <div class="row">
    <label class="label">手续费率：</label>
    <label v-if="showEdit" class="edit">{{getMultiIndex}}</label>

    <template v-else>
      <label class="right">
        >
      </label>
      <picker
        mode="multiSelector"
        @change="bindMultiPickerChange"
        :value="multiIndex"
        :range="multiArray"
      >
        <view class="picker">
          {{multiArray[0][multiIndex[0]]}} {{multiArray[1][multiIndex[1]]}}
        </view>
      </picker>
    </template>
	</div>
  <div class="annotation">选填项</div>
  <div class="row">
    <label class="label">计划投入：</label>
    <label class="right-yuan">
      元
    </label>
    <input  v-model='ready_money'
            type="number"
            class="input"
            :maxlength='20'
            placeholder="选填"
            >
  </div>
  <div class="row">
    <label class="label">定投周期：</label>
    <label class="right">
      >
    </label>
    <picker @change="bindCycleChange" :range="cycle_array" :value="cycle_index">
      <view class="picker">
        {{cycle_array[cycle_index]}}
      </view>
    </picker>
  </div>
  <template v-if="cycle_index > 0">
    <div class="row">
      <label class="label">定投日：</label>
      <label class="right">
        >
      </label>
      <picker @change="bindDayChange" v-if="cycle_index === '3' || cycle_index === 3" :range="day_array" :value="day_index">
        <view class="picker">
          &nbsp;&nbsp;&nbsp;{{day_array[day_index]}}
        </view>
      </picker>
      <picker @change="bindWeekChange" v-else :range="week_array" :value="week_index">
        <view class="picker">
          &nbsp;&nbsp;&nbsp;{{week_array[week_index]}}
        </view>
      </picker>
    </div>
    <div class="row" v-if="cycle_index === '2' || cycle_index === 2">
      <label class="label">下次定投日：</label>
      <label class="right">
        >
      </label>
      <picker @change="bindTwoWeekChange" :range="getTwoWeek" :value="two_week_index">
        <view class="picker">
          {{getTwoWeek[two_week_index]}}
        </view>
      </picker>
    </div>
<!--     <div class="row">
      <label class="label">定投提醒：</label>
      <switch class="switch"
              style='zoom:.8;'
              @change="switchChange"
              color="#EA5149" />&nbsp;
      <label class="radio-group">{{is_switch? "开启" : "关闭"}}</label>
    </div> -->
  </template>
  
  <div class="row">
    <label class="label">收割比率：</label>
    <label class="right">
      >
    </label>
    <picker @change="bindLineChange" :range="line_array" :value="line_index" range-key="name">
      <view class="picker">
        {{line_array[line_index].name}}
      </view>
    </picker>
  </div>
  <div class="row">
    <label class="label">收割金额：</label>
    <label class="right-yuan">
      元
    </label>
    <input v-model='harvest_money'
            type="digit"
            class="input"
            :maxlength='20'
            placeholder="选填">
  </div>
  <div class="annotation">
    <button v-if="showEdit" class="btn" @click='editFund'>
      修改
    </button>
    <button v-else class="btn" @click='addFund'>
      添加
    </button>
  </div>
</div>
</template>


<script>
import {get,post, showModal,showSuccess} from '@/util'
export default {
  // created () {
  //   as_type: 1
  // },
  data () {
    return {
      as_type: 1,
      fund_id:0,
      showEdit:false,
      fund:[],
      code: '',
      name_auto: '',
      ready_money:'',
      harvest_money:'',
      cycle_index:0,
      day_index:0,
      week_index:0,
      step_day:0,
      line_index:0,
      line_code:0,
      two_week_index:0,
      single_week:0,
      showName:false,
      userinfo: {},
      commission:0.0001,
      items: [
        {name: 1, value: '场内',checked: 'true'},
        {name: 2, value: '场外'}
      ],
      cycle_array:["选填","每周","每两周","每月"],
      week_array:["周一","周二","周三","周四","周五"],
      day_array:["1日","2日","3日","4日","5日","6日","7日","8日","9日","10日","11日","12日","13日","14日","15日","16日","17日","18日","19日","20日","21日","22日","23日","24日","25日","26日","27日","28日"],
      line_array:[
        {code:0,name:"选填"},
        {code:0.02,name:"盈利超过2%收割"},
        {code:0.03,name:"盈利超过3%收割"},
        {code:0.04,name:"盈利超过4%收割"},
        {code:0.05,name:"盈利超过5%收割"},
        {code:0.06,name:"盈利超过6%收割"},
        {code:0.07,name:"盈利超过7%收割"},
        {code:0.08,name:"盈利超过8%收割"},
        {code:0.09,name:"盈利超过9%收割"},
        {code:0.10,name:"盈利超过10%收割"}
      ],
      multiIndex: [0,0],
      multiArray: [['万', '千'], [1, 0.5, 0.6, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5]]
    }
  },
  methods: {
    async addFund () {
      const data = {
        openid: this.userinfo.openId,
        code: this.code,
        name_auto: this.name_auto,
        commission: this.commission,
        as_type: this.as_type? this.as_type : 1,
        ready_money:this.ready_money? this.ready_money : 0,
        step_cycle:this.cycle_index,
        step_day:this.step_day,
        single_week:this.single_week,
        harvest_line:this.line_code,
        harvest_money:this.harvest_money? this.harvest_money : 0

      }
      console.log('data addfund',data)
      if(this.code){
        try {
          const res = await post('/weapp/addfund', data)
          console.log("addFund res:",res)
          this.code = ''
          this.showName = false

          var that = this
          wx.showModal({
            title: '成功',
            confirmText: '继续',
            content: `${res.code}(${res.name})添加成功，要继续添加基金吗？`,
            success: function (res) {
              if (res.cancel) {
                wx.reLaunch({
                  url: '/pages/index/main',
                  success: function (e) { 
                    var page = getCurrentPages().pop();
                    console.log("getCurrentPages()",getCurrentPages())
                    if (page == undefined || page == null) return;
                    page.onPullDownRefresh();
                  } 
                })
              }
            }
          })
        } catch (e) {
          console.log("失败:",e)
          if(e.error){
            showModal('失败', e.error)
            if(e.error === "无法获取该基金名称,请手动添加"){
              this.showName = true
            }
          }else{
            this.showName = false
            this.name_auto = ''
            showModal('失败', e.data.msg)
          }
        }
      }else{
        showModal('失败', "基金代码不能为空")
      }

    },
    async editFund(){
      try{
        const data = {
          fund_id:this.fund_id,
          ready_money: this.ready_money? this.ready_money : 0,
          step_cycle:this.cycle_index,
          step_day: this.step_day,
          harvest_line:this.line_array[this.line_index].code,
          harvest_money:this.harvest_money? this.harvest_money : 0
        }
        const res = await post('/weapp/editfund', data)
        console.log("res",res)
        showSuccess("修改成功")
      }catch(e){
        showModal('失败', e.data.msg)
      }
    },
    async getfund(){
      const fund = await get('/weapp/getfund', {fund_id:this.fund_id})
      this.fund = fund.fund
      this.ready_money = this.fund.ready_money
      this.harvest_money = this.fund.harvest_money
      this.cycle_index = this.fund.step_cycle
      this.step_day = this.fund.step_day
      this.day_index = this.step_day
      this.week_index = this.step_day
      this.line_array.map((v,i)=>{
        if(v.code == this.fund.harvest_line ){
          this.line_index = i
        }
      })
      // console.log("this.cycle_index",this.cycle_index)
      // console.log("this.step_day",this.step_day)
      // console.log("this.day_index",this.day_index)
      // console.log("this.week_index",this.week_index)
    },
    radioChange (e) {
      this.as_type = e.target.value
      if(this.as_type === '2'){
        this.items[1].checked = 'true'
      }else{
        this.items[1].checked = ''
      }
      // console.log('this.as_type',this.as_type)
    },
    bindMultiPickerChange(e) {
      this.multiIndex = e.mp.detail.value
      this.commission = this.getCommission(this.multiIndex)
      // console.log('commission',this.commission)
    },
    getCommission(multiIndex) {
      const one = multiIndex[0] === 0? 0.0001 : 0.001
      const two = this.multiArray[1][multiIndex[1]]
      return one * two
    },
    bindCycleChange (e) {
      this.cycle_index = e.mp.detail.value
      this.day_index = 0
      this.week_index = 0
      this.step_day = 0
      this.resetTwoWeek()
    },
    bindWeekChange(e) {
      this.week_index = e.mp.detail.value
      this.step_day = this.week_index
      if(this.cycle_index === '2'){
        this.resetTwoWeek()
      }
    },
    bindDayChange(e) {
      this.day_index = e.mp.detail.value
      this.step_day = this.day_index
      // console.log('day_index',this.day_index)
    },
    bindLineChange(e) {
      this.line_index = e.mp.detail.value
      this.line_code = this.line_array[this.line_index].code
      // console.log('line_code',this.line_code)
    },
    bindTwoWeekChange(e) {
      this.two_week_index = e.mp.detail.value
      if(this.cycle_index === '2' || this.cycle_index === 2){
        var date = new Date()
        // 设定一个初始时间
        const start = new Date("2019-04-01")
        let offset = date.getTime() - start.getTime()
        let cu = parseInt(offset / 1000 / 60 / 60 / 24 / 7) % 2
        if(this.two_week_index === '0' || this.two_week_index === 0){
          //双周
          this.single_week = cu
        }else{
          this.single_week = cu + 1
        }
        // console.log("this.single_week11",this.single_week)
      }
    },
    resetTwoWeek(){
      var date = new Date()
      // 设定一个初始时间
      const start = new Date("2019-04-01")
      let offset = date.getTime() - start.getTime()
      let cu = parseInt(offset / 1000 / 60 / 60 / 24 / 7) % 2
      this.two_week_index = 0
      this.single_week = cu
      // console.log("this.single_week1",this.single_week)
    }
      
  },
  computed:{
    getMultiIndex(){
      var one = "万"
      var two = 0
      for(var i=0;i<this.multiArray[1].length;i++){
        if(this.fund.commission/0.0001 === this.multiArray[1][i]){
          two = this.multiArray[1][i]
          break
        }
      }
      if(two === 0 ){
        var one = "千"
        for(var i=0;i<this.multiArray[1].length;i++){
          if(this.fund.commission/0.001 === this.multiArray[1][i]){
            two = this.multiArray[1][i]
            break
          }
        }
      }
      return one+" "+two
    },
    getAsType(){
      if(this.fund.as_type === 1){
        return "场内"
      }else{
        return "场外"
      }
    },
    getTwoWeek() {
      var util = require('../../utils/index.js')
      var date = new Date()
      //今天周几
      var day = date.getDay()
      //选中了周几
      let between = (this.week_index) - day + 1
      //小于0说明已经过了本周定投时间，下次定投在下周或者下下周
      var two_week_array = []
      if(between < 0){
        var date1 = new Date(date.setDate(date.getDate()+7+between + 7))
        two_week_array.push(util.formatDate(date1)+"（下下" + this.week_array[this.week_index] + "）")
        var date2 = new Date(date1.setDate(date1.getDate()-7))
        two_week_array.push(util.formatDate(date2)+"（下" + this.week_array[this.week_index] + "）")
      }else{
        var date1 = new Date(date.setDate(date.getDate()+between))
        two_week_array.push(util.formatDate(date1)+"（本" + this.week_array[this.week_index] + "）")
        var date2 = new Date(date1.setDate(date1.getDate()+7))
        two_week_array.push(util.formatDate(date2)+"（下" + this.week_array[this.week_index] + "）")
      }
      console.log("this.two_week_array",two_week_array)
      return two_week_array
    }
  },
  // created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。
  // mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。
  mounted () {
    const userinfo = wx.getStorageSync('userinfo')
    if (userinfo) {
      this.userinfo = userinfo
    }
    this.fund_id = this.$root.$mp.query.id
    if(this.fund_id){
      this.showEdit = true
      this.getfund()
    }else{
      this.showEdit = false
      this.showName = false
      this.ready_money = ''
      this.harvest_money = ''
      this.cycle_index = 0
      this.step_day = 0
      this.line_index = 0
      this.day_index = 0
      this.week_index = 0
      this.name_auto = ''
    }
    console.log("this.single_week",this.single_week)
  }
}
</script>

<style lang='scss'>
  .view-fund{
    background: #ffffff;
    /*padding-bottom: 10px;*/
    font-size: 14px;
    .row{
      border-bottom: 1px #E8E8E8 solid;
      height: 50px;
    }
    .edit{
      line-height:50px;
    }
    .input{
      height:50px;
    }
    .radio-group{
      line-height:50px;
    }
    .switch{
      padding-top: 12px;
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
    .right-yuan{
      float: right;
      /*color: #C0C0C0;*/
      line-height:50px;
      margin-right: 190px;
    }
    .btn{
      width: 95%;
      font-size: 18px;
      font-weight:bold;
      border-radius:5px;
    }
    .annotation{
      padding: 5px;
      font-size: 14px;
      color: #888888;
      background: #F0F0F0;
    }
  }
</style>


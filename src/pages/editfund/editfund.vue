<template>
  <div class="view-fund">
    <div class="annotation">必填项</div>
    <div class="row">
      <label class="label">基金代码：</label>
      <input v-model='code'
              type="number"
              class="input"
              :maxlength='20'
              placeholder="输入6位基金代码">
    </div>
    <div class="row" v-if="showName">
      <label class="label">基金名称：</label>
      <input v-model='name_auto'
              class="input"
              :maxlength='100'
              placeholder="输入基金名称">
    </div>
<!--     <div class="row">
      <label class="label">基金类型：</label>  
      <radio-group class="radio-group" @change="radioChange">
        <label class="radio" v-for="(item, index) in items" :key="item.name">
          <radio color='#EA5A49' :value="item.name" :checked="item.checked"  /> {{item.value}}
        </label>
      </radio-group>
    </div>
    <div class="row">
      <label class="label">手续费率：</label>
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
    </div>
    <div class="annotation">选填项</div>
    <div class="row">
      <label class="label">计划投入：</label>
      <label class="right-yuan">
        元
      </label>
      <input v-model='ready_money'
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
    <div class="row" v-if="cycle_index > 0">
      <label class="label">定投日：</label>
      <label class="right">
        >
      </label>
      <picker @change="bindDayChange" v-if="cycle_index === '3'" :range="day_array" :value="day_index">
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
    </div> -->
    <div class="annotation">
      <button class="btn">
        添加
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fund:0
    }
  },
  methods:{
  	
  },
  mounted () {
    console.log("this.$root.$mp.query",this.$root.$mp.query)
  	this.fund = this.$root.$mp.query.id
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

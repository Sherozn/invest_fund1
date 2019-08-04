<template>
  <div class="book-card">
    <div class="table" width="98%">
      <div class="tr" @click='ellipsi'>
        <div class="date">{{fund_item.date}}</div>
        <div class="busi">{{getBusi}}</div>
        <div class="busi">{{fund_item.share}}</div>
        <div class="net">{{fund_item.net}}</div>
        <div class="net">{{getAmount}}</div>
        <div class="image"><image class='img' :src="ellipsis?'/static/images/right.png':'/static/images/down.png'"></image></div>
      </div>
    </div>
    <div class="hide" v-if="ellipsis">
      <div class="row">
        <div class="right">
          <label class="title">手续费：</label>
          <label class="in-right">{{fund_item.commission}} </label>
        </div>
        <div class="left">
          <label class="title">成交金额：</label>
          <label class="in-right">{{getDealAmount}}</label>
        </div>
      </div>
      <div class="row">
        <div class="right">
          <label class="title">总持仓数：</label>
          <label class="in-right">{{fund_item.sum_share}} </label>
        </div>
        <div class="left">
          <label class="title">已投入金额：</label>
          <label class="in-right">{{getSumAmount}}</label>
        </div>
      </div>
      <div class="row">
        <div class="right">
          <label class="title">成本：</label>
          <label class="in-right">{{getCost}} </label>
        </div>
        <div class="left">
          <label class="title">当前市值：</label>
          <label class="in-right">{{getCurrentValue}}</label>
        </div>
      </div>
      <div class="row">
        <div class="right" v-if="index === 0">
          <label class="title">操作：</label>
            <label class="in-right" @click="confirm">
              <image class='img-del' src="/static/images/delete1.png"></image>
              <label class="del">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;删除</label>
            </label>
        </div>
        <div class="left">
          <label class="title">当前盈亏：</label>
          <label class="in-right">{{getTotalMoney}}</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {get,post} from '@/util'
export default {
  props: ['fund_item','index','name'],
  data () {
    return {
      amount:0.0,
      busi_code:"",
      cost:0.0,
      ellipsis: false
    }
  },
  methods: {
    ellipsi(){  
      this.ellipsis = !this.ellipsis
      console.log("this.index",this.index)
    },
    confirm(){
      var that = this
      wx.showModal({
        content: `确定要删除${this.fund_item.date}记录吗？`,
        success: function (res) {
          if (res.confirm) {
            that.deleteItem()
          }
        }
      })
    },
    async deleteItem(){
      try{
        const data = {
          item_id:this.fund_item.id,
          fund_id:this.fund_item.fund_id
        }
        const res = await post('/weapp/deleteitem', data)
        const that = this
        wx.redirectTo({
          url: '/pages/record/main?id=' + `${that.fund_item.fund_id}`+ '&name=' + `${that.name}`
        })
      }catch(e){
        showModal('失败', e.data.msg)
      }
    }
  },
  computed: {
    getBusi(){
      if(this.fund_item.busi_code === 1){
        return "买入"
      }else{
        return "卖出"
      }
    },
    getCost(){
      return (parseInt(this.fund_item.cost*100000)/parseInt(100000)).toFixed(4)
    },
    getAmount(){
      return (parseInt(this.fund_item.amount*1000)/parseInt(1000)).toFixed(2)
    },
    getDealAmount(){
      return (parseInt((this.fund_item.amount-this.fund_item.commission)*1000)/parseInt(1000)).toFixed(2)
    },
    getCurrentValue(){
      return (parseInt(this.fund_item.net*this.fund_item.sum_share*1000)/parseInt(1000)).toFixed(2)
    },
    getSumAmount(){
      return (parseInt(this.fund_item.sum_amount*1000)/parseInt(1000)).toFixed(2)
    },
    getTotalMoney(){
      return (parseInt((this.fund_item.net*this.fund_item.sum_share-this.fund_item.sum_amount)*1000)/parseInt(1000)).toFixed(2)
    }
  }
}
</script>

<style lang='scss' scoped>
.book-card{
  background: #FFFFFF;
  margin-bottom:6px;
  .table {
    border: 0px solid darkgray;
    font-size: 15px;
    height: 42px;
    line-height:42px;
    .tr {
      display: flex;
      width: 100%;
    }
    .date{
      width: 90px;
      margin-left: 5px;
    }
    .busi{
      width: 50px;
      margin-left: 8px;
    }
    .net{
      width: 50px;
      margin-left: 5px;
    }
    .image{
      float: right;
      margin-left: 40px;
    }
  }
  .hide{
    background: #F0F0F0;
    font-size: 15px;
    padding: 5px 8px 3px 8px;
     .row{
      line-height:18px;
      margin-bottom:3px;
      .right{
        width: 40%;
        float: right;
      }
      .in-right{
        float: right;
        font-size: 13px;
        /*margin-top: 3px;*/
      }
      .left{
        width: 40%;
        margin-right:80px;
      }
      .title{
        font-size: 13px;
        color: #808080;
      }
      .img-del{
        position: absolute;
        width: 17px;
        height: 17px;
      }
      .del{

      }
    }
  }
  .img{
    width: 13px;
    height: 13px;
    margin-right: 5px;
  }
}
</style>

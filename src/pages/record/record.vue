<template>
  <div>
  	<div v-if='show_record'>
	  	<div class="prompt">还没有定投记录，点击下面添加</div>
	  	<div class="add" >
	      <img :src="src" @click='addFundItem'>
	      <p>添加记录</p>
	    </div>
	 	</div>
	 	<div v-else>
	 		<div class="table th">
        <div class="date">日期</div>
        <div class="busi">操作</div>
        <div class="busi">份额</div>
        <div class="net">净值</div>
        <div class="net">金额</div>
      </div>
	 	  <ItemList :key='index' v-for='(fund_item,index) in fund_items' :fund_item='fund_item' :index='index' :name='name'></ItemList>
      <p class="text-footer" v-if="!more">
        没有更多数据
      </p>
      <p class="text-footer" v-else-if="fund_items.length < 15">
      </p>
      <p class="text-footer" v-else>
        加载中···
      </p>
      <div class="add" v-if="fund_items.length > 0">
        <img :src="src" @click='addFundItem'>
        <p>添加记录</p>
      </div>
	 	</div>
  </div>
</template>

<script>
import {get} from '@/util'
import ItemList from '@/components/ItemList'
export default {
	components: {
    ItemList
  },
  data () {
    return {
      src: "../../static/images/plus-circle.png",
      // userinfo:{},
      fund_items:[],
      fund_id:0,
      name:"",
      page: 0,
      more: true,
      show_record:false
    }
  },
  methods:{
  	async getFundItems (init) {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
      if(init){
        this.page = 0
        this.more = true
      }
      if(this.page === 0){
        this.fund_items = []
      }
      const data = {
        page: this.page,
        fund_id:this.fund_id
      }
	  	const fund_items = await get('/weapp/itemlist', data)
	  	// fund_items = fund_items.fund_items
      if (fund_items.fund_items.length < 15 && this.page > 0) {
        this.more = false
      }
      this.fund_items = this.fund_items.concat(fund_items.fund_items)
      if(this.fund_items.length === 0){
        this.show_record = true
      }else{
        this.show_record = false
      }
	  	console.log('funds vue',this.fund_items)
      wx.hideToast()
	  },
	  async addFundItem () {
      const that = this
	    wx.navigateTo({
	      url:'/pages/additem/main?fund_id=' + that.fund_id + '&name=' + that.name + '&as_type=0'
	    })
	  },
	  setNavigationBarTitle(){
	  	wx.setNavigationBarTitle({
			  title: this.name
      })
	  }
  },
  onPullDownRefresh () {
    this.setNavigationBarTitle()
    this.getFundItems(true)
    wx.stopPullDownRefresh()
  },
  // 到达底部
  onReachBottom () {
    console.log("!this.more",!this.more)
    if (!this.more) {
      return false
    }

    this.page = this.page + 1
    console.log("this.page",this.page)
    this.getFundItems()
  },
  mounted () {
  	this.fund_id = this.$root.$mp.query.id
  	this.name = this.$root.$mp.query.name
  	this.setNavigationBarTitle()
    this.getFundItems(true)
    console.log("")
  }
}
</script>

<style lang='scss' scoped>
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
  .th {
    width: 100%;
    height: 30px;
    line-height:30px;
    background: #EA5149;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: bold;
    display: flex;
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
  .text-footer{
    text-align: center;
    font-size: 12px;
    margin-bottom:5px;
    padding-top: 5px;
  }
</style>

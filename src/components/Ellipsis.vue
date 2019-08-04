<template>
    <div class="set" @click='ellipsis' >
      <!-- <label class="ellipsis">•••</label> -->
      <label class="ellipsis">
      <img src="../../static/images/icon_more.png" >
      </label>
      <div class="hide" v-if="elli">
        <a :href="recordlUrl">
          <div class='text text-1'>
            <lebal>查看</lebal>
          </div>
        </a>
        <a :href="editUrl">
          <div class='text'>
            <lebal>编辑</lebal>
          </div>
        </a>
        <div class='text' @click="confirm">
          <lebal>删除</lebal>
        </div>
      </div>
    </div>
</template>

<script>
import {post,showSuccess,showModal} from '@/util'
export default {
  props: ['fund'],
  data () {
    return {
      elli:false
    }
  },
  methods: {
    ellipsis(){
      this.elli = !this.elli
    },
    confirm(){
      var that = this
      wx.showModal({
        content: `确定要删除${this.fund.name}基金吗？`,
        success: function (res) {
          if (res.confirm) {
            that.deleteFund()
          }
        }
      })
    },
    async deleteFund(){
      try{
        const res = await post('/weapp/deletefund', {fund_id:this.fund.id})
        console.log("res",res)
        wx.switchTab({
          url: '/pages/index/main',
          success: function (e) { 
            var page = getCurrentPages().pop();
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
    editUrl () {
      return '/pages/addfund/main?id=' + this.fund.id
    },
    recordlUrl () {
      return '/pages/record/main?id=' + this.fund.id + '&name=' + `${this.fund.name}（${this.fund.code}）`
    }
  }
}
</script>

<style lang='scss' scoped>
.set{
  float: right;
  height: 30px;
  .ellipsis{
    font-weight: bolder;
    font-size: 15px;
  }
  img{
    width: 22px;
    height:22px;
    /*border-radius: 50%;*/
  }
  .hide{
    width: 40px;
    position: absolute;
    right: 10px;
    border-radius: 7px;
    background: #202020;
    padding: 2px 7px;
    text-align: center;
    .text{
      font-size: 14px;
      color: #FFFFFF;
      padding-bottom: 12px;
    }
    .text-1{
      padding-top: 12px;
    }
  }
}

</style>

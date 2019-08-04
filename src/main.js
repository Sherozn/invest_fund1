import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

// wx.cloud.init({
//   env: 'ding-97e397',
//   traceUser:true
// })
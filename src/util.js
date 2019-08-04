// 工具函数库
import config from './config'

// http get工具函数 获取数据
export function get (url, data) {
  //返回的是一个Promise对象
  return request(url, 'GET', data)
}

// http post工具函数 获取数据
export function post (url, data) {
  
  return request(url, 'POST', data)
}

function request (url, method, data) {
  return new Promise((resolve, reject) => {

    wx.request({
      data,
      method,
      url: config.host + url,
      success: function (res) {
        console.log('res.data.code:', res.data.code)
        if (res.data.code === 0) {
          // console.log('我是我是007')
          resolve(res.data.data)
        } else {
          reject(res.data)
        }
      }
    })
  })
}

export function showModal (title, content) {
  wx.showModal({
    title,
    content,
    showCancel: false
  })
}

export function showSuccess (text) {
  wx.showToast({
    title: text,
    icon: 'success'
  })
}

// 配置

const host = 'http://localhost:5757'
// const host = 'https://xiolu.com'

const config = {
  host,
  loginUrl: `${host}/weapp/login`,
  // 测试的请求地址，用于测试会话
  requestUrl: `${host}/weapp/user`,

  // 测试的信道服务地址
  tunnelUrl: `${host}/weapp/tunnel`,

  // 上传图片接口
  uploadUrl: `${host}/weapp/upload`
}

export default config

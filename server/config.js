const CONF = {
    serverHost: 'localhost',
    tunnelServerUrl: '',
    // serverHost: 'https://xiolu.com',
    // tunnelServerUrl: 'http://tunnel.ws.qcloud.la',
    tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',
    // 腾讯云相关配置可以查看云 API 秘钥控制台：https://console.cloud.tencent.com/capi
    // appid   https://console.cloud.tencent.com/developer
    qcloudAppId: '1256820481',
    qcloudSecretId: 'AKIDjDTn9g48Em9Rg9y5z2hFb3IT2PaZAsYz',
    qcloudSecretKey: '7Rav62Og9wcmcBwUEmwKn47wXbc0OYAa',
    wxMessageToken: 'weixinmsgtoken',
    networkTimeout: 30000,
    port: '5757',
    rootPathname: '',
    // rootPathname: '/data/release/weapp/server',

    // 微信小程序 App ID
    appId: 'wxd2a52ff3594d8d7d',

    // 微信小程序 App Secret
    appSecret: 'd52b72db819fa63abc76c168336a7a81',

    // 是否使用腾讯云代理登录小程序
    // useQcloudLogin: true,
    useQcloudLogin: false,

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: 'localhost',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: '123456',
        // pass: '19950712xu@.',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF

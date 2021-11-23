module.exports = {
    title: '网站标题', // 网站标题
    port: 10092, // 网站端口

    /**
     * @type {boolean} true | false
     * @description 是否显示右侧配置按钮选项
     */
    showSettings: true,

    /**
     * @type {boolean} true | false
     * @description 是否需要 tagsView [源码文档等链接展示]
     */
    tagsView: true,

    /**
     * @type {boolean} true | false
     * @description 是否需要固定头部导航条
     */
    fixedHeader: false,

    /**
     * @type {boolean} true | false
     * @description 是否需要展示左侧边栏logo
     */
    sidebarLogo: false,

    /**
     * @type {string | array} 'production' | ['production', 'development']
     * @description 展示错误日志组件
     * 默认只在production展示
     * 如果dev也需要的话, ['production', 'development']
     */
    errorLog: 'production',

    /**
     * @type number
     * @description token过期时间与最后操作网页的时间少于这个 freshTokenTime 值时，开始去调用后端刷新Token值得接口
     * 默认两个小时内去请求新的token
     */
    freshTokenTime: 2 * 60 * 60 * 1000,

    /**
     * @type number
     * @description 设置超时时间
     * 用户登录到网站后，过多久未操作页面后则强制退出网站
     */
    timeOut: 2 * 60 * 60 * 1000,

    /**
     * @type number
     * @description 前端判断时差的周期时间
     */
    // 测试时间
    // intervalTime: 60*1000,
    intervalTime: 2 * 60 * 1000,
}

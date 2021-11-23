import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // 页面加载跳转进度条
import 'nprogress/nprogress.css' // 页面加载跳转进度条样式
import {getToken} from '@/utils/auth' // 从cookie上获取getToken方法
import getPageTitle from '@/utils/get-page-title' // 获取页标题
import Cookies from 'js-cookie'
import axios from 'axios'
import config from "@/utils/config";
import jwtDecode from "jwt-decode";


const backauth_url = config.backauth_url
/**
 * 有token: 看权限?去:不变
 * 无token: 到 login
 */

// console.log("开始清除sessionid/csrftoken值")
// console.log("清除完成")

NProgress.configure({showSpinner: false}) // 面加载跳转进度条配置, 是否有转圈效果

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist
/*
* beforeEach 全局前置守卫
*   params:
*       to  即将要进入的目标 路由对象
*       from 当前导航正要离开的路由
*       next 一定要调用该方法来 释放 这个钩子。执行效果依赖 next 方法的调用参数。
* afterEach 全局后置钩子
*       (to,from) => {
*           ...
*       }
*       这些钩子不会接受 next 函数也不会改变导航本身
* */

router.beforeEach(async (to, from, next) => {
    // console.log(to)
    // 开始进度条
    NProgress.start()

    // 设置页标题 document: DOM元素
    document.title = getPageTitle(to.meta.title)
    // 确定用户是否登录
    const hasToken = getToken()
    if (hasToken) {
        // var TokenKey = "Authorization"
        // console.log(jwtDecode(Cookies.get(TokenKey)))
        if (to.path === '/login') {
            // 如果当前用户在登录页面，准备登录，则接下来跳转到/首页
            next({path: '/'})
            // 完成导航跳转
            NProgress.done()
        } else {
            // 获取用户名：
            // let username = jwtDecode(Cookies.get('Authorization'))["username"]
            // let menu = to.path
            // 确认用户是否有权限访问这个导航路由
            const hasRoles = store.getters.roles && store.getters.roles.length > 0

            // const hasRoles = true
            if (hasRoles) {
                next()
            } else {
                // 没有roles权限却要访问对应的路由,去表中查找,找到,则跳过去,没有,则删除token并返回到登录页面
                try {
                    // 获取到用户信息
                    // 注意: 角色必须是一个数组: 例如: ["admin"] , ["developer","editor"]
                    axios.defaults.headers.common['Authorization'] = 'JWT ' + Cookies.get('Authorization')
                    axios.defaults.headers.common['X-Token'] = Cookies.get('Authorization')
                    const {roles} = await store.dispatch('user/getInfo')
                    // 生成可以到达的routes路由映射放在roles数组中
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)

                    // 动态添加路由
                    router.addRoutes(accessRoutes)
                    // 绑定一个方法去确认添加路由已经完成
                    // replace: true, 导航不会记录这一条路由信息
                    next({...to, replace: true})
                } catch (error) {
                    // 移除token并返回到登录页面
                    // console.log(error)
                    await store.dispatch('user/resetToken')
                    // Message.error(error || 'Has Error')
                    // Message.error('Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    } else {
        /* 没有token*/

        if (whiteList.indexOf(to.path) !== -1) {
            // 在白名单中，直接去
            next() // next 用来释放前置守卫钩子函数
        } else {
            // console.log(to.fullPath)
            // 没有权限访问的页面则会强制重定向到login登录页面
            next(`/login?redirect=${to.fullPath}`)
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    // 完成进度条
    NProgress.done()
})

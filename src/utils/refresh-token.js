import {logout,refreshtoken} from '@/api/user'
import {removeToken, getToken,setToken} from "@/utils/auth"
import router, {resetRouter} from '@/router'

const defaultSettings = require('@/settings.js')


function getEndTime() {
    let token = getToken()
    if (token === undefined) {
        window.location.href = '/login'
    }
    var jwt = require("jsonwebtoken")
    let endSecond = jwt.decode(token)['exp']
    return endSecond * 1000
}

// 检测用户是否活跃
export function isUserActive() {
    var arr = ['/login?']
    var result = arr.some(function (item) {
        var url = window.location.href
        if(url == null){
            return false
        }else {
            return url.indexOf(item) > 0
        }
    })
    // result 表示当前页面可能是index或者注册页面
    // 不是index页面 ，不是注册页面才会去检测用户的活跃状态（鼠标移动状态）
    if (!result) {
    // if (1) {
        var tokenExpireTime = getEndTime()
        var lastTime = new Date().getTime();
        var currentTime = new Date().getTime();
        //设置超时时间： 5h [1.2min]
        var timeOut = defaultSettings.timeOut;
        var freshTokenTime = defaultSettings.freshTokenTime
        var intervalTime = defaultSettings.intervalTime

        // window.onload = function () {
        //     /* 检测鼠标移动事件 */
        //     document.addEventListener('mousemove', function () {
        //         // 更新最后的操作时间
        //         lastTime = new Date().getTime();
        //     })
        // }

        /* 定时器  间隔15分钟，检测是否长时间未操作页面 [1min] intervalTime*/
        var quitTime = window.setInterval(testTime, intervalTime);
        console.log("intervalTime:",intervalTime)
        // 超时函数
        function testTime() {
            //更新当前时间
            currentTime = new Date().getTime();
            //1. 长时间未操作，则退出：判断是否超时,超时后，退出登录 timeOut
            console.log("开始查看",currentTime)
            tokenExpireTime = getEndTime()
            // if (currentTime - lastTime > timeOut) {
            //     console.log('已超时... ...')
            //     // removeToken()
            //     logout().then(response => {
            //         if (response.data.code === 200) {
            //             // 清除掉定时器
            //             removeToken()
            //             resetRouter()
            //             window.localStorage.clear()
            //             window.clearInterval(quitTime)
            //             router.push('/login')
            //         }
            //     })
            // }
            //2. 当token快要过期的时候(15min),调用刷新接口
            // console.log("过期时间：",tokenExpireTime)
            // console.log("当前时间：",currentTime)
            // freshTokenTime = 431683499
            // console.log("刷新时间：",freshTokenTime)
            // console.log("差时：",tokenExpireTime - currentTime)
            if (tokenExpireTime - currentTime <= freshTokenTime) {
                console.log("需要去刷新token了")
                refreshtoken().then(response=>{
                    if(response.data.code !== 200){
                        console.log("刷新token失败，已过期，跳转到登录页")
                        clearInterval(quitTime)
                        // 清除掉定时器
                        removeToken()
                        resetRouter()
                        window.localStorage.clear()
                        router.push('/login')
                    }else {
                        // console.log(response.data.data)
                        console.log("刷新后的新token:",response.data.data.token)
                        removeToken()
                        setToken(response.data.data.token)
                    }

                })
            }
        }
    }
}

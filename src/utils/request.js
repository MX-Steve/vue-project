import axios from 'axios'
import {MessageBox, Message} from 'element-ui'
import store from '@/store'
import {getToken} from '@/utils/auth'
import $ from 'jquery'
import config from "@/utils/config";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import router from '@/router'
import user from "@/store/modules/user";
import Vue from 'vue'
import NProgress from "nprogress";

function alert(data) {
    var a = document.createElement("div"),
        p = document.createElement("p"),
        btn = document.createElement("div"),
        textNode = document.createTextNode(data ? data : ""),
        btnText = document.createTextNode("X");
    a.setAttribute("id", "errAlert")
    p.appendChild(textNode);
    btn.appendChild(btnText);
    a.appendChild(p);
    a.appendChild(btn);
    $(a).css({
        "border": "2px solid #ebeef5",
        "color": "#F56C6C",
        "font-size": "16px",
        "z-index": 2000,
        "padding": "0px 15px ",
        "border-radius": "4px",
        "overflow": "hidden",
        "min-width": "420px",
        "position": "fixed",
        "left": "40%",
        "top": "20%",
        "background-color": "#fef0f0",
        "border-color": "#fde2e2"
    })
    $(btn).css({
        "position": "absolute",
        "right": "5px",
        "top": "25%",
        "padding": "5px 5px",
        "width": "30px",
        "color": "#C5C7CF",
        "cursor": "pointer",
        "margin": "0 auto",
        "background-color": "transparent",
        "border-radius": "50%",
    })
    document.getElementsByTagName("body")[0].appendChild(a);
    btn.onclick = function () {
        a.parentNode.removeChild(a);
    }
}

function removeAlert() {
    $("#errAlert").remove()
}
// 无需后台验证权限的后端接口
const BACK_SKIP_URLS_CHECK = [
    "/api/accounts/info/",
    "/api/accounts/put/",
    "/api/accounts/login/",
    "/api/accounts/logout/",
    "/api/rbac/judge/",
    "/api/rbac/refreshtoken/",
]
const backauth_url = config.backauth_url
// 创建一个 axios 实例
const service = axios.create({
    // withCredentials: true, // 前端跨域设置
    timeout: 20000 // 请求超时时间 5s
})
// 请求方法
const type_http = ["GET", "POST", "HEAD", "PUT", "PATCH", "DELETE"]
axios.interceptors.response.use(
    response => {
        return response
    },
    error => {
        if (error && error.response) {
            switch (error.response.status) {
                case 400:
                    error.message = "请求错误(400)";
                    break;
                case 401:
                    store.dispatch('user/resetToken').then(() => {
                        location.reload()
                    });
                    error.message = "未授权，请重新登录(401)";
                    break;
                case 403:
                    error.message = "拒绝访问(403)";
                    break;
                case 404:
                    error.message = "请求出错(404)";
                    break;
                case 408:
                    error.message = "请求超时(408)";
                    break;
                case 500:
                    error.message = "服务器错误(500)";
                    break;
                case 501:
                    error.message = "服务未实现(501)";
                    break;
                case 502:
                    error.message = "网络错误(502)";
                    break;
                case 503:
                    error.message = "服务不可用(503)";
                    break;
                case 504:
                    error.message = "网络超时(504)";
                    break;
                case 505:
                    error.message = "HTTP版本不受支持(505)";
                    break;
                default:
                    error.message = "连接出错(${error.response.status})!;"
            }
        } else {
            error.message = "连接服务器失败!"
        }
        if (error.message.indexOf('403') !== -1) {
            console.log(error.message)
            alert("没有权限操作该接口，如需开通，请联系运维操作")
            var time = setInterval(removeAlert, 3000);
            time = null
        }
        return Promise.reject(error)
    }
)
// request 拦截器
service.interceptors.request.use(
    config => {
        var isOk = false
        // 在request请求发送之前做一些操作
        if (store.getters.token) {
            // 封装功能，判断是否有访问后端接口的权限

            let username = jwtDecode(Cookies.get('Authorization'))["username"]
            if (BACK_SKIP_URLS_CHECK.indexOf(config.url) === -1 && username !== 'root') {
                if (!isOk) {
                    console.log("没有权限进这里去查后台查找")
                }
            }
            // 让每一次request请求都携带 token
            // ['X-Token'] 自定义头属性
            // 请根据实际情况修改
            config.headers['Authorization'] = 'JWT ' + getToken()
            config.headers['X-Token'] = getToken();
        }
        return config
    },
    error => {
        // 当请求失败的时候做一些操作
        return Promise.reject(error)
    }
)

// response 拦截器
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        // console.log('拦截器 response success ')
        // console.log(response.status)
        // if the custom code is not 20000, it is judged as an error.
        if (res.code !== 200) {
            Message({
                message: res.message || 'Error',
                type: 'error',
                duration: 5 * 1000
            })

            // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
            if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
                // to re-login
                MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
                    confirmButtonText: 'Re-Login',
                    cancelButtonText: 'Cancel',
                    type: 'warning'
                }).then(() => {
                    // store.dispatch('user/resetToken').then(() => {
                    //     location.reload()
                    // })
                    console.log("reset")
                })
            }
            return Promise.reject(new Error(res.message || 'Error'))
        } else {
            return res
        }
    },
    error => {
        console.log('err' + error); // for debug
        switch (error.response.status) {
            case 401:
                store.dispatch('user/resetToken').then(() => {
                    location.reload()
                });
                break;
            default:
                Message({
                    message: error.message,
                    type: 'error',
                    duration: 5 * 1000
                });
                return Promise.reject(error)
        }
    }
)

export default service

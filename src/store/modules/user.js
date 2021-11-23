import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken, setUsername} from '@/utils/auth'
import router, {resetRouter} from '@/router'
import Cookies from "js-cookie";
import {asyncRoutes} from "@/router";
import {recursion_reset} from "@/utils/mypath";
import {setJwtToken} from "../../utils/auth";
import axios from 'axios'
import jwtDecode from 'jwt-decode'
import da from "element-ui/src/locale/lang/da";
import config from "@/utils/config";
import $ from "jquery";
import ca from "element-ui/src/locale/lang/ca";

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    introduction: '',
    roles: []
}

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
        "min-width": "380px",
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

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    }
}
const actions = {
    // user login
    login({commit}, userInfo) {
        const {username, password, authcode, secCert} = userInfo
        return new Promise((resolve, reject) => {
            login({
                username: username.trim(),
                password: password,
                authcode: authcode,
                secCert: secCert
            }).then(response => {
                response = response['data']
                if (response['code'] === 500) {
                    alert("用户名或密码错误")
                    var time = setInterval(removeAlert, 3000);
                    time = null
                }
                if (response['isSecCert'] === 1) {
                    const token = response['token']
                    commit('SET_TOKEN', token) // 存在 vueX 中
                    axios.defaults.headers.common['Authorization'] = 'JWT ' + token;
                    setToken(token) // 存在 cookie 中
                    setUsername(username.trim())
                    var token_obj = jwtDecode(Cookies.get("Authorization"))
                    // var username = token_obj['username']
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // get user info
    getInfo({commit, state}) {
        return new Promise((resolve, reject) => {
            let url = config.backauth_url + "check/?project_id=2"
            let headers = {"Authorization": "JWT " + getToken()}
            try {
                axios.get(url, headers).then(res=>{
                    // console.log(res.data)
                    if(res.data['msg']==="token应该过期了"){
                        this.$router.push('/')
                    }
                })
            }catch (e) {
                console.log(e)
                this.$router.push('/login?redirect=%2Fdashboard')
            }
            getInfo(state.token).then(response => {
                const data = response
                if (!data) {
                    reject('认证失败，请重新登录.')
                }
                const {roles, name, avatar, introduction, menus} = data.data.data
                // ================= 后移除 开始 ==================

                var menusFromAuth = JSON.stringify(menus)
                window.localStorage.setItem('menusFromAuth', menusFromAuth)
                var userPaths = window.localStorage.getItem('menusFromAuth')
                var user_menus = recursion_reset(asyncRoutes, userPaths)
                data['menus'] = JSON.stringify(user_menus)
                // ================= 后移除 结束 ==================
                // roles must be a non-empty array
                if (!roles || roles.length <= 0) {
                    reject('getInfo: roles must be a non-null array!')
                }
                commit('SET_ROLES', roles)
                commit('SET_NAME', name)
                commit('SET_AVATAR', avatar)
                commit('SET_INTRODUCTION', introduction)
                resolve(data.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    },

    // user logout
    logout({commit, state, dispatch}) {
        return new Promise((resolve, reject) => {
            logout(state.token).then(() => {
                commit('SET_TOKEN', '')
                commit('SET_ROLES', [])
                removeToken()
                resetRouter()
                window.localStorage.clear()
                // reset visited views and cached views
                // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
                dispatch('tagsView/delAllViews', null, {root: true})
                router.push('/login')
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },

    // remove token
    resetToken({commit}) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken();
            resolve()
        })
    },

    // dynamically modify permissions11
    changeRoles({commit, dispatch}, role) {
        return new Promise(async resolve => {
            const token = role + '-token'
            commit('SET_TOKEN', token)
            setToken(token)

            const {roles} = await dispatch('getInfo')

            resetRouter()

            // generate accessible routes map based on roles
            const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true})

            // dynamically add accessible routes
            router.addRoutes(accessRoutes)

            // reset visited views and cached views
            dispatch('tagsView/delAllViews', null, {root: true})

            resolve()
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

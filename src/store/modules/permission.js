import {asyncRoutes, constantRoutes} from '@/router'
import {getInfo} from "@/api/user";
import {recursion_reset} from "@/utils/mypath";
import Cookies from "js-cookie";

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
function hasPermission(roles, route) {
    //  如果meta中配置了roles字段，走这一块
    if (route.meta && route.meta.roles) {
        return roles.some(role => route.meta.roles.includes(role))
    } else {
        return true
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, roles) {
    const res = []

    routes.forEach(route => {
        const tmp = {...route}
        // tmp: 存储路由映射
        if (hasPermission(roles, tmp)) {
            if (tmp.children) {
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })

    return res
}

const state = {
    routes: [],
    addRoutes: []
}
const mutations = {
    SET_ROUTES: (state, routes) => {
        state.addRoutes = routes
        state.routes = constantRoutes.concat(routes)
    }
}
function recursion(menus) {
        var paths = ['/dashboard']
        for (var i in menus) {
          var item = menus[i]
          var path = item['path']
          paths.push(path)
          var sub = item['children']
          if (sub !== undefined) {
            if (sub.length > 0) {
              for (var j in sub) {
                var jitem = sub[j]
                var jpath = path + '/' + jitem['path']
                paths.push(jpath)
                var son_sub = jitem['children']
                if (son_sub !== undefined && son_sub.length > 0) {
                  for (var s in son_sub) {
                    var sitem = son_sub[s]
                    var spath = jpath + '/' + sitem['path']
                    paths.push(spath)
                  }
                }
              }
            }
          }
        }
        for(var m in paths){
          if(paths[m].indexOf('//') !== -1){
            paths[m] = paths[m].replace('//','/')
          }
        }
        return paths
      }
const actions = {
    generateRoutes({commit}, roles) {
        return new Promise(resolve => {
            var token = Cookies.get('Authorization')
            getInfo(token).then(response => {
                const data = response
                // ================= 后移除 开始 ==================
                var userPaths = window.localStorage.getItem('menusFromAuth')
                var user_menus = recursion_reset(asyncRoutes,userPaths)
                data.data.data['menus'] = JSON.stringify(user_menus)
                // ================= 后移除 结束 ==================
                var menus = JSON.parse(data.data.data['menus'])
                var centers_str = JSON.stringify(data.data.data['centers'])
                var bus_str = JSON.stringify(data.data.data['bus'])
                window.localStorage.setItem('centers',centers_str)
                window.localStorage.setItem('bus_str',bus_str)
                resolve(data)
                return menus
            }).catch(error => {
                reject(error)
            }).then(response => {
                commit('SET_ROUTES', response)
            })
            let accessedRoutes
            if (roles.includes('super_admin')) {
                accessedRoutes = asyncRoutes || []
            } else {
                accessedRoutes = filterAsyncRoutes(asyncRoutes, roles)
            }
            resolve(accessedRoutes)
        })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

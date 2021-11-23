import axios from 'axios'
import config from '../../utils/config'

// 后台组信息
function GroupList(group_name) {
  return axios.get(config.backauth_url + 'groups/?name=' + group_name + "&project_id=2")
}

function ApiList(api_name) {
  return axios.get(config.backauth_url + 'apis/?name=' + api_name + "&project_id=2")
}

function GroupRemove(group_name) {
  return axios.delete(config.backauth_url + 'groups/' + group_name+"@2")
}

function ApiRemove(api_name) {
  return axios.delete(config.backauth_url + 'apis/' + api_name+"@2")
}

function GroupAdd(data) {
  data['project_id'] = "2"
  return axios.put(config.backauth_url + 'groups/', data)
}

function ApiAdd(data) {
  if (data.type === "modify") {
    data['project_id'] = "2"
    return axios.post(config.backauth_url + 'apis/', data)
  } else {
    data['project_id'] = "2"
    return axios.put(config.backauth_url + 'apis/', data)
  }
}

// 后台用户信息
function UserList(data) {
  if(data === ""){
    data = "?project_id=2"
  }else {
    data = data+"&project_id=2"
  }
  return axios.get(config.backauth_url + 'users/' + data)
}

function UserListFromGroup(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

function UserRemoveFromGroup(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

function UserRemove(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'groups/', data)
}

function GroupAddMenu(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'groups/', data)
}

function GroupAddApi(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'groups/', data)
}

function UserAddMenu(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

function UserRemoveMenu(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

function UserAdd(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

// 后台菜单信息
function MenusList(data) {
  if(data === ""){
    data = "?project_id=2"
  }else {
    data = data+"&project_id=2"
  }
  return axios.get(config.backauth_url + 'menus/' + data)
}

function MenusSearch(data) {
  if(data === ""){
    data = "?project_id=2"
  }else {
    data = data+"&project_id=2"
  }
  return axios.get(config.backauth_url + 'search/' + data)
}

function MenuListFromGroup(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'groups/', data)
}

function ApiListFromGroup(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'groups/', data)
}

function MenusRemove(menu_name) {
  return axios.delete(config.backauth_url + 'menus/' + menu_name+"@2")
}

function MenusAdd(data) {
  data['project_id'] = "2"
  return axios.put(config.backauth_url + 'menus/', data)
}

function MenusModify(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'menus/', data)
}

// 菜单
export const AuthLevels = [
  {label: '一级菜单', value: 1},
  {label: '二级菜单', value: 2},
  {label: '三级菜单', value: 3},
]

// 黑白名单
export const AuthMechanisms = [
  {label: '上线', value: 1},
  {label: '维护', value: 2},
]
// 请求方法
export const AuthMethods = [
  {label: "全部方法", value: 0},
  {label: "GET", value: 1},
  {label: "POST", value: 2},
  {label: "HEAD", value: 3},
  {label: "PUT", value: 4},
  {label: "PATCH", value: 5},
  {label: "DELETE", value: 6},
]
export const Scopes = [
  {value: 0, label: '所有场景'},
  {value: 10, label: '发布申请时'},
  {value: 20, label: '发布失败时'},
  {value: 21, label: '发布成功时'},
  {value: 30, label: '发布驳回时'},
  {value: 31, label: '发布转发时'},
  {value: 40, label: 'sql申请提交时'},
  {value: 50, label: 'sql执行成功时'},
  {value: 60, label: 'sql执行失败时'},
]

// 后台菜单信息(开放)
export function getMenus(params) {
  return new Promise((resolve, reject) => {
    MenusList(params).then(response => {
      // console.log("getMenus:",response.data.data)
      resolve(response.data.data)
    })
  })
}

export function getMenusFromUser(params) {
  return new Promise((resolve, reject) => {
    MenusSearch("?name=" + params).then(response => {
      // console.log("getMenus:",response.data.data)
      resolve(response.data.data)
    })
  })
}

export function removeMenus(menu_name) {
  return new Promise((resolve, reject) => {
    MenusRemove(menu_name).then(response => {
      resolve(response.data)
    })
  })
}

export function addMenus(data) {
  return new Promise((resolve, reject) => {
    MenusAdd(data).then(response => {
      resolve(response.data)
    })
  })
}

export function modifyMenus(data) {
  return new Promise((resolve, reject) => {
    MenusModify(data).then(response => {
      resolve(response.data)
    })
  })
}

export function addApis(data) {
  return new Promise((resolve, reject) => {
    ApiAdd(data).then(response => {
      resolve(response.data)
    })
  })
}

// 后台组信息(开放)
export function getGroups(group_name) {
  return new Promise((resolve, reject) => {
    GroupList(group_name).then(response => {
      resolve(response.data.data)
    })
  })
}

export function getApis(api_name) {
  return new Promise((resolve, reject) => {
    ApiList(api_name).then(response => {
      resolve(response.data.data)
    })
  })
}

// 后台组信息移除
export function removeGroups(group_name) {
  return new Promise((resolve, reject) => {
    GroupRemove(group_name).then(response => {
      resolve(response.data)
    })
  })
}

export function removeApis(api_name) {
  return new Promise((resolve, reject) => {
    ApiRemove(api_name).then(response => {
      resolve(response.data)
    })
  })
}

export function addGroups(data) {
  return new Promise((resolve, reject) => {
    GroupAdd(data).then(response => {
      resolve(response.data)
    })
  })
}

// 后台用户信息(开放)
export function getUsers(params) {
  return new Promise((resolve, reject) => {
    UserList(params).then(response => {
      resolve(response.data.data)
    })
  })
}

export function removeUsers(data) {
  return new Promise((resolve, reject) => {
    UserRemove(data).then(response => {
      resolve(response.data)
    })
  })
}

export function addMenuToGroup(data) {
  return new Promise((resolve, reject) => {
    GroupAddMenu(data).then(response => {
      resolve(response.data)
    })
  })
}

export function addApiToGroup(data) {
  return new Promise((resolve, reject) => {
    GroupAddApi(data).then(response => {
      resolve(response.data)
    })
  })
}

export function addMenuToUser(data) {
  return new Promise((resolve, reject) => {
    UserAddMenu(data).then(response => {
      resolve(response.data)
    })
  })
}

export function removeMenuToUser(data) {
  return new Promise((resolve, reject) => {
    UserRemoveMenu(data).then(response => {
      resolve(response.data)
    })
  })
}

export function getUsersFromGroup(data) {
  return new Promise((resolve, reject) => {
    UserListFromGroup(data).then(response => {
      resolve(response.data)
    })
  })
}

export function addUserToGroup(data) {
  return new Promise((resolve, reject) => {
    UserAdd(data).then(response => {
      resolve(response.data)
    })
  })
}

export function removeUserToGroup(data) {
  return new Promise((resolve, reject) => {
    UserRemoveFromGroup(data).then(response => {
      resolve(response.data)
    })
  })
}

export function getMenusFromGroup(data) {
  return new Promise((resolve, reject) => {
    MenuListFromGroup(data).then(response => {
      resolve(response.data)
    })
  })
}

export function getApisFromGroup(data) {
  return new Promise((resolve, reject) => {
    ApiListFromGroup(data).then(response => {
      resolve(response.data)
    })
  })
}

function UserCenters(username) {
  return axios.get(config.backauth_url + 'centers/?username=' + username + "&project_id=2")
}

export function getCenters(username) {
  return new Promise((resolve, reject) => {
    UserCenters(username).then(response => {
      resolve(response.data)
    })
  })
}

function ModTime(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

function ModLev(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'users/', data)
}

export function modExpire(data) {
  return new Promise((resolve, reject) => {
    ModTime(data).then(response => {
      resolve(response.data)
    })
  })
}

export function modLevel(data) {
  return new Promise((resolve, reject) => {
    ModLev(data).then(response => {
      resolve(response.data)
    })
  })
}

export function appDeploy(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'apps/', data)
}

function getInGits() {
  return axios.get(config.backauth_url + 'apps/' + "?project_id=2")
}

function getInGitTags(gitUrl) {
  return axios.get(config.backauth_url + 'apps/?gitUrl=' + gitUrl + "&project_id=2")
}

function getInJenkins(param_data) {
  return axios.get(config.backauth_url.split("out/")[0] + 'in/appjenkins/?' + param_data + "&project_id=2")
}

function getInHistory(count) {
  return axios.get(config.backauth_url + 'history/?c=' + count + "&project_id=2")
}

export function getGits() {
  return new Promise((resolve, reject) => {
    getInGits().then(response => {
      resolve(response.data)
    })
  })
}

export function getGitTags(gitUrl) {
  return new Promise((resolve, reject) => {
    getInGitTags(gitUrl).then(response => {
      resolve(response.data)
    })
  })
}

export function getJenkins(param_data) {
  return new Promise((resolve, reject) => {
    getInJenkins(param_data).then(response => {
      resolve(response.data)
    })
  })
}

export function getHistory(count) {
  return new Promise((resolve, reject) => {
    getInHistory(count).then(response => {
      resolve(response.data)
    })
  })
}

// =============
export function appPlatform(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'appplatform/', data)
}

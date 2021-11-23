import request from '@/utils/request'

import axios from 'axios'
import config from "@/utils/config";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

// 用户登录验证
export function login(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url.split('out/')[0] + 'login/', data)
}

// 获取用户详情
export function getInfo(token) {
  return axios.get(config.backauth_url + 'info/?project_id=2')
}

export function logout() {
  var data={"project_id":"2"}
  return axios.post(config.backauth_url + 'logout/',data)
}

export function refreshtoken() {
  var data={"project_id":"2"}
  return axios.post(config.backauth_url + 'refreshtoken/',data)
}

// 修改用户信息
export function modInfo(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'modinfo/', data)
}

// Dingding页面功能
export function getDingtalk() {
  return axios.get(config.backauth_url + 'dingtalk/?project_id=2')
}

export function getSvcFromBu(id) {
  return axios.get(config.backauth_url + 'dingtalk/?id=' + id+"&project_id=2")
}

export function addDingMsg(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'dingtalk/', data)
}

export function delDingMsg(data) {
  data['project_id'] = "2"
  return axios.post(config.backauth_url + 'delding/', data)
}

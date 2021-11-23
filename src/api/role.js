import request from '@/utils/request'

// 路由相关接口
export function getRoutes() {
  return request({
    url: '/api/rbac/route/',
    method: 'get'
  })
}

export function getRoles() {
  return request({
    url: '/api/rbac/role/',
    method: 'get'
  })
}

export function addRole(data) {
  return request({
    url: '/api/rbac/role/',
    method: 'post',
    data: data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/api/rbac/role/${id}`,
    method: 'put',
    data: data
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/rbac/role/${id}`,
    method: 'delete'
  })
}


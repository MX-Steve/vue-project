import request from '@/utils/request'

export function fetchList() {
  return request({
    url: '/api/accounts/article/',
    method: 'get'
  })
}

export function fetchArticle(id) {
  return request({
    url: '/api/accounts/articledetail/',
    method: 'get',
    params: { id }
  })
}

export function createArticle(data) {
  return request({
    url: '/api/accounts/article/',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/api/accounts/articledetail/',
    method: 'post',
    data
  })
}

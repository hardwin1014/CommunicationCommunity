import request from '@/utils/request'

export function getComments (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/articles',
    params
  })
}
// 发布评论
export const addComment = function (data) {
  return request({
    method: 'POST',
    url: '/app/v1_0/comments',
    data
  })
}

/**
 * 获取评论列表
 */
export function getComments2 (params) {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

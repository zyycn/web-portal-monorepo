import request from '../request'

export function getDbList(data: any) {
  return request({
    cancelDuplicate: true,
    headers: {
      source: 'java'
    },
    method: 'get',
    params: data,
    url: '/cmwa/other/dimensional/getDbList'
  })
}

// 用户名密码登录
export function loginUsername(data: any) {
  return request({
    cancelDuplicate: true,
    data,
    method: 'post',
    url: '/auth/user/login/username'
  })
}

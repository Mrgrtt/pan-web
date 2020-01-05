import request from '../util/request'

export function login(username, password) {
  return request({
    url: '/owner/login',
    method: 'post',
    params: {
      username,
      password
    }
  })
}

export function register(username, password) {
  return request({
    url: '/owner/register',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function changePassword(data) {
  return request({
    url: '/owner/update/password',
    method: 'post',
    data: data
  })
}

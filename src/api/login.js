import fetch from '@/utils/fetch'

export function login(phone, password) {
  return fetch({
    url: '/admin/user/login',
    method: 'post',
    data: {
      username: phone,
      password
    }
  })
}

export function getInfo(token) {
  return fetch({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return fetch({
    url: '/user/logout',
    method: 'post'
  })
}

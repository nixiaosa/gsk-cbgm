import http from '@/utils/fetch'
import userapi from '@/api/login1'

export default {
  login: async function(phone, password) {
    var params = {
      username: phone,
      password: password,
      passwordSha: this.$sha256AndBase64(password)
    }
    const res = await http.post(userapi.login, params)
    if (res.data.code === 0) return res.data.data
  }
}

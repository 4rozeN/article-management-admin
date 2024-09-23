import request from '../utils/request'

export const userRegisterService = ({ username, email, password }) => {
  // return request.post('/api/reg', { username, email, password })
  return request.post('/api/auth/local/register', { username, email, password })
}

export const userLoginService = ({ username, password }) => {
  // return request.post('/api/login', { username, password })

  const identifier = username
  return request.post('/api/auth/local', { identifier, password })
}

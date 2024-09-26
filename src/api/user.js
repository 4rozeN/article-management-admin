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

export const userForgotPasswordService = ({ email }) => {
  return request.post('/api/auth/forgot-password', { email })
}

export const userResetPasswordService = ({ password, confirmPassword, code }) => {
  const passwordConfirmation = confirmPassword
  return request.post('/api/auth/reset-password', {
    password,
    passwordConfirmation,
    code
  })
}

export const userGetProfileService = () => {
  return request.get(
    '/api/users/me?fields=username,email,blocked,telphone,createdAt,updatedAt,id&populate[avatar][fields]=id,height,width,name,updatedAt,ext,url'
  )
}

export const userProfileUpdateService = (id, dataObj) => {
  return request.put(`/api/users/${id}`, {
    ...dataObj
  })
}

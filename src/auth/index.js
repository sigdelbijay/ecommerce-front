import {API} from '../config'

export const SignupFn = (user) => (
  fetch(`${API}/signup`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(res => res.json())
  .catch(err => console.log(err))
)

export const SigninFn = (user) => (
  fetch(`${API}/signin`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(user)
  })
  .then(res => res.json())
  .catch(err => console.log(err))
)

export const Authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('jwt', JSON.stringify(data))
    next()
  }
}

export const Signout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('jwt')
    next()
    return fetch(`${API}/signout`, {
      method: 'GET'
    })
    .then(res => console.log("signout", res))
    .catch(err => console.log(err))
    
  }
}

export const IsAuthenticated = () => {
  if (typeof window == 'undefined') return false
  if (localStorage.getItem('jwt')) {
    return JSON.parse(localStorage.getItem('jwt'))
  } else return false
}
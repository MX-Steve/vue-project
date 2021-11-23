import Cookies from 'js-cookie'
import jwtDecode from 'jwt-decode'


// const TokenKey = 'Admin-Token'
const TokenKey = 'Authorization'

export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    if (document.domain.indexOf('.lark.t3go.com') === -1){
        return Cookies.set(TokenKey, token)
    }
    else {
        return Cookies.set(TokenKey, token, {domain: '.lark.t3go.com'})
    }
    // return Cookies.set(TokenKey, token)
}

export function removeToken() {
    if (document.domain.indexOf('.lark.t3go.com') === -1){
        return Cookies.remove(TokenKey)
    }
    else {
        return Cookies.remove(TokenKey, {domain: '.lark.t3go.com'})
    }
}

export function getTokenUserId() {
    return jwtDecode(Cookies.get(TokenKey))["user_id"]
}

export function setUsername(username) {
    return Cookies.set('username', username)
}

export function getUserName() {
    return Cookies.get('username')
}

import fly from '../utils/fly.js'
const baseUrl = getApp().globalData.baseUrl
/**
 * 获取当前登录的用户信息
 */
export function getUserInfo() {
    return fly({
        url: `${baseUrl}/getUserInfo`,
        method: 'get',
        needToken: true
    })
}

/**
 * 
 */
export function getVipCard() {
    return fly({
        url: `${baseUrl}/getUserInfo`,
        method: 'get',
        needToken: true
    })
}
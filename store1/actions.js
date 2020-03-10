import {GET_CART_LIST} from './mutation-types'
export default{
    getCartList({commit},data){
        // 触发对应的mutation
        commit(GET_CART_LIST,data)
        console.log("===action end",GET_CART_LIST,data)
    }
}
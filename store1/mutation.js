import {GET_CART_LIST} from './mutation-types'
console.log("mutaion",GET_CART_LIST)
export default{
    // 函数
    [GET_CART_LIST](state,data){
        if(data){
            state.cart = data
        }
        console.log("mutaion--state",state)
    }
}
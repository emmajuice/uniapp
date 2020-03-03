import Vue from 'vue'
import App from './App'
import fly from './utils/fly.js'
import cuCustom from './static/styles/colorui/components/cu-custom.vue'
Vue.component('cu-custom',cuCustom)
Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$fly = fly;

const app = new Vue({
    ...App
})
app.$mount()
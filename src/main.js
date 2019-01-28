import Vue from 'vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import './plugins/vuetify'

import App from './App.vue'
import { routes } from './router'
import store from './store'

Vue.use(VueRouter)
Vue.use(VueResource)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

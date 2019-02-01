import Vue from 'vue'
import VueResource from 'vue-resource'
import './plugins/vuetify'

import App from './App.vue'
import router from './router'
import store from './store'

Vue.use(VueResource)

// All url requets will go to this URL (POST, GET, etc.)
Vue.http.options.root = 'https://family-reminder-19fab.firebaseio.com/'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

import icon from 'vue-icon'
Vue.use(icon)

axios.defaults.baseURL =  'http://localhost:5000/api/'

Vue.prototype.$axios = axios

Vue.config.productionTip = false

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response.status === 401) {
      console.log('Sem autenticacao')
    }

    return Promise.reject(error)
  }
)

new Vue({
  router,
  store,
  render: h => h(App),
  async created () {
    let token = localStorage.getItem('token')
    if (token) {
      this.$axios.defaults.headers['Authorization'] = `Bearer ${token}`
      const { data } = await this.$axios.get('user')
      this.$store.commit('SET_USER', data)
    }
  }
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
axios.defaults.baseURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000/api/'
  : 'http://4fbd5341.ngrok.io/api/'

Vue.prototype.$axios = axios

Vue.config.productionTip = false


axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if(error.response.status === 403) {
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
      console.log(data)
      this.$store.commit('SET_USER', data)
    }
    console.log(process.env)
  }
}).$mount('#app')

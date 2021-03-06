import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {},
    token: null
  },
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
  },
  actions: {
    setLogin({ commit }, { user, token }) {
      commit('SET_USER', user)
      commit('SET_TOKEN', token)
      localStorage.setItem('token', token)
    },
    logout({ commit }, { vm }) {
      commit('SET_USER', null)
      commit('SET_TOKEN', null)
      localStorage.removeItem('token')
      vm.$axios.defaults.headers['Authorization'] = undefined
    }
  },
  modules: {
  }
})

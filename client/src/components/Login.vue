<template>
  <form @submit.prevent="submitLogin">
    <div class="form-block">
      <label for="email">Login</label>
      <input type="text" id="email" v-model="user.email">
    </div>
    <div class="form-block">
      <label for="email">Senha</label>
      <input type="password" id="password" v-model="user.password">
    </div>
    <div class="form-block">
      <div>
        Não possui um login ainda?
      </div>
      <div style="margin-bottom: 10px">
        <router-link :to="{ name: 'Register' }">Registre-se</router-link>
      </div>
      <button type="submit">Logar</button>
    </div>
  </form>
</template>

<script>
export default {
  data: () => ({
    user: {
      email: '',
      password: ''
    }
  }),
  methods: {
    async submitLogin() {
      let { email, password } = this.user
      if(!email || !password) return

      try {
        const { data: { user, token } } = await this.$axios.post('login', {
          email,
          password
        })
        this.$store.dispatch('setLogin', { user, token })
        this.$axios.defaults.headers['Authorization'] = `Bearer ${token}`
        this.$router.push({ name: 'Home' })
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

</style>
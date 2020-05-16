<template>
  <form @submit.prevent="submitRegister">
    <div class="form-block">
      <label for="email">Email</label>
      <input type="text" id="email" v-model="user.email">
    </div>
    <div class="form-block">
      <label for="name">Nome</label>
      <input type="text" id="name" v-model="user.name">
    </div>
    <div class="form-block">
      <label for="password">Senha</label>
      <input type="password" id="password" v-model="user.password">
    </div>
    <div class="form-block">
      <label for="password_confirmation">Confirmar Senha</label>
      <input type="password" id="password_confirmation" v-model="user.password_confirmation">
    </div>
    <div class="form-block">
      <div style="margin-bottom: 10px">
        <router-link :to="{ name: 'Login' }">Já possui um login?</router-link>
      </div>
      <button type="submit">Registrar</button>
    </div>
  </form>
</template>

<script>
export default {
  data: () => ({
    user: {
      name: '',
      email: '',
      password: '',
      password_confirmation: ''
    }
  }),
  methods: {
    async submitRegister() {
      let { name, email, password, password_confirmation } = this.user
      if(!email || !password) return
      if(password !== password_confirmation) return

      try {
        await this.$axios.post('user', {
          name,
          email,
          password
        })
        this.$router.push({
          name: 'Login'
        })
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>

</style>
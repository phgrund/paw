<template>
  <div class="login">
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
        <button type="submit">Logar</button>
      </div>
    </form>
  </div>
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
        this.$router.push({ name: 'Home' })
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style scoped>
form {
  margin: 0 auto;
}

.login {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-items: center;
}

.form-block {
  display: block;
  margin-bottom: 15px;
  text-align: center;
}

.form-block label {
  display: block;
  align-items: center;
  text-align: left;
}

.form-block input {
  padding: 7px 5px;
}

.form-block button {
  padding: 7px 15px;
  border: none;
  transition: 0.5s all;
  margin: 0 auto;
  text-align: center;
}

.form-block button:hover {
  transform: scale(1.1);
}

</style>
<template>
  <div class="login">
    <div class="form">
      <router-view />
    </div>
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
        this.$axios.defaults.headers['Authorization'] = `Bearer ${token}`
        this.$router.push({ name: 'Home' })
      } catch(err) {
        console.log(err)
      }
    }
  }
}
</script>

<style>
.form {
  margin: 0 auto;
  border-radius: 5px;
  padding: 40px 60px;
  background-color: white;
  border: 1px solid #075E54;
}

.login {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-items: center;
  background-color: #F9F9F9;
}

.form-block {
  display: block;
  margin-bottom: 15px;
  text-align: center;
  color: #009688;
  font-size: 14px;
}

.form-block a {
  text-decoration: none;
  font-size: 17px;
  color: #075E54;
  font-weight: 600;
}

.form-block label {
  display: block;
  align-items: center;
}

.form-block input {
  padding: 7px 5px;
}

.form-block button {
  padding: 7px 15px;
  border: 1px solid #075E54;
  border-radius: 5px;
  background-color: transparent;
  transition: 0.5s all;
  margin: 0 auto;
  text-align: center;
  color: #075E54;
  font-size: 18px;
}

.form-block button:hover {
  transform: scale(1.05);
}

</style>
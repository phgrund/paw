<template>
  <form @submit.prevent="submitRegister">
    <div class="form-block">
      <label for="email">Email</label>
      <input type="email" id="email" v-model="user.email" required>
    </div>
    <div class="form-block">
      <label for="name">Nome</label>
      <input type="text" id="name" v-model="user.name" required>
    </div>
    <div class="form-block">
      <label for="password">Senha</label>
      <input type="password" id="password" v-model="user.password" required>
    </div>
    <div class="form-block">
      <label for="password_confirmation">Confirmar Senha</label>
      <input type="password" id="password_confirmation" v-model="user.password_confirmation" required>
    </div>
    <div class="form-block">
      <label for="genre">Genero</label>
      <select v-model="user.genre" id="genre">
        <!-- <option value="Indefinido">Indefinido</option> -->
        <option value="Masculino">Masculino</option>
        <option value="Feminino">Feminino</option>
        <option value="Não Binário">Não Binário</option>
        <option value="Genderfluid">Genderfluid</option>
      </select>
    </div>
    <div class="form-block">
      <label for="age">Idade</label>
      <input style="width: 50px" type="number" id="age" min="0" max="100" v-model.number="user.age">
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
      password_confirmation: '',
      genre: 'Masculino',
      // genre: 'Indefinido',
      age: null
    }
  }),
  methods: {
    async submitRegister() {
      let { name, email, password, password_confirmation, genre, age = 0 } = this.user
      let errors = []

      !email.trim() && errors.push('Por favor, digite um e-mail')
      !name.trim() && errors.push('Por favor, digite um nome')
      !password.trim() && errors.push('Por favor, digite uma senha')
      password !== password_confirmation && errors.push('As senhas não conferem')
      age < 0 && errors.push('Idade inválida')

      if(errors.length > 0) {
        return alert(errors.join('\n'))
      }

      try {
        await this.$axios.post('user', {
          name,
          email,
          password,
          genre,
          age
        })
        this.$router.push({
          name: 'Login'
        })
      } catch(err) {
        alert(err)
      }
    }
  }
}
</script>

<style scoped>

</style>
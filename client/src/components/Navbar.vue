<template>
  <nav>
    <ul>
      <li>
        <router-link :to="{ name: 'Home' }">
          Início
        </router-link>
      </li>
      <li>
        <router-link :to="{ name: 'Profile' }">
          Perfil
        </router-link>
      </li>
      <li style="float: right">
        <a @click.prevent="logout">Sair</a>
      </li>
      <li style="float: right">
        <a @click.prevent>{{ name }}</a>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  computed: {
    name() {
      return (this.$store.state.user && this.$store.state.user.name) || 'Anônimo'
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout', { vm: this })
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  background-color: #2d2d2d;
  position: fixed;
}
ul {
  margin: 0;
  padding: 0;
  overflow: hidden;
  list-style-type: none;
}

li {
  float: left;
  cursor: pointer;
}

li a {
  display: block;
  color: white;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  transition: .5s all;
}

li a:hover {
  background-color: #3b3b3b;
}

.active,
.active:hover {
  color: white;
  background-color: #008CBA;
}

</style>

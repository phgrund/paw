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
      return this.$store.state.user.name
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>

<style scoped>
nav {
  width: 100%;
  background-color: #e7e7e7;
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
  color: #666;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
}

li a:hover {
  background-color: #d4d4d4;
}

.active,
.active:hover {
  color: white;
  background-color: #008CBA;
}

</style>

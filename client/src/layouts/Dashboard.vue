<template>
  <div class="dashboard">
    <!-- <navbar /> -->
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
// import Navbar from '../components/Navbar'
export default {
  components: {
    // Navbar
  }
}
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  background-color: white;
  overflow: hidden;
}
</style>

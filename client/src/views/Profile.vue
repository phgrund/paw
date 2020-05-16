<template>
  <div class="profile">
    <div class="info">
      Nome:
      {{ user.name }}
    </div>
    <div class="info">
      Email:
      {{ user.email }}
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    user: {}
  }),
  created() {
    this.getUser()
  },
  methods: {
    async getUser() {
      let { data } = await this.$axios.get('user')
      this.user = data
    }
  }
}
</script>

<style scoped>

</style>
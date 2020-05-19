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
    <div class="info">
      Gênero:
      {{ user.genre }}
    </div>
    <div class="info">
      Idade:
      {{ user.age || 'Não especificado' }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    user: {}
  }),
  created() {
    this.getUser()
  },
  methods: {
    async getUser() {
      let { data } = await this.$axios.get('user/' + this.id)
      this.user = data
    }
  },
  watch: {
    id() {
      this.getUser()
    }
  }
}
</script>

<style scoped>

</style>
<template>
  <div class="message">
    <h4>{{ message.user.name }}</h4>
    {{ message.content }}
    <div
      @click="deleteMessage"
      v-if="isOwnMessage"
      class="delete"
    >
      Excluir
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    isOwnMessage() {
      return this.$store.state.user._id === this.message.user._id
    }
  },
  methods: {
    async deleteMessage() {
      await this.$axios.delete(`message/${this.message._id}`)
      this.$emit('onDelete', this.message._id)
    }
  }
}
</script>

<style scoped>
.message {
  border: 1px solid #DDD;
  border-radius: 10px;
  padding: 10px;
  position: relative;
}
.delete {
  position: absolute;
  top: 0;
  right: 0;
  color: red;
  cursor: pointer;
  border: 1px solid red;
  border-radius: 3px;
  padding: 3px;
}
</style>
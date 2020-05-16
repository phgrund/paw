<template>
  <div class="home">
    <h2>Mensagens</h2>
    <span v-if="messages.length === 0">
      Nenhuma mensagem encontrada
    </span>
    <div v-else class="messages" ref="messages">
      <message
        v-for="(message, index) in messages"
        :key="index"
        :message="message"
        @onDelete="onDelete"
      />
    </div>
    <form @submit.prevent="sendMessage">
      <p>Enviar nova mensagem:</p>
      <input v-model="newMessage" type="text">
      <button type="submit">Enviar</button>
    </form>
  </div>
</template>

<script>
import Message from '../components/Message.vue'

export default {
  name: 'Home',
  components: {
    Message
  },
  data: () => ({
    messages: [],
    newMessage: ''
  }),
  created() {
    this.getMessages()
  },
  methods: {
    async getMessages() {
      let { data } = await this.$axios.get('messages')

      this.messages = data
    },
    async sendMessage() {
      if(!this.newMessage) return

      let { data } = await this.$axios.post('message', {
        content: this.newMessage
      })

      this.messages.push(data)
      this.newMessage = ''
      this.$nextTick(() => {
        this.scrollToBottom()
      })
    },
    scrollToBottom() {
      this.$refs.messages.scrollTop = this.$refs.messages.scrollHeight
    },
    onDelete(_id) {
      this.messages = this.messages.filter(message => message._id !== _id)
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}
.messages {
  height: 400px;
  max-width: 500px;
  border: 1px solid #AAA;
  border-radius: 10px;
  padding: 10px;
  overflow: auto;
  margin: 5px auto;
  position: relative;
}
.messages > * {
  margin-bottom: 5px;
}
</style>
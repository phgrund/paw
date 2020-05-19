<template>
  <div class="home">
    <h2 style="display: inline-block">Mensagens</h2>
    <button class="btn refresh" @click="getMessages">
      <icon name="refresh-ccw" class="icon-sm" />
    </button>
    <div class="message-container" ref="messages">
      <div class="message-box">
        <div
          v-for="(message, index) in messages"
          :key="index"
          :class="['message-row', isOwnMessage(message) ? 'message-right' : 'message-left']"
        >
          <message
            :message="message"
            :isOwnMessage="isOwnMessage(message)"
            @onDelete="onDelete"
            class="message"
          />
        </div>
      </div>
      <form class="new-message" @submit.prevent="sendMessage">
        <div class="send-message">
          <input v-model="newMessage" class="send-message" type="text">
          <button type="submit">
            <icon name="send" />
          </button>
        </div>
        <input v-model="anonymous" type="checkbox">
        Enviar Anônimo
      </form>
    </div>
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
    newMessage: '',
    anonymous: false
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
        content: this.newMessage,
        anonymous: this.anonymous
      })

      this.messages.unshift(data)
      this.newMessage = ''
    },
    onDelete(_id) {
      this.messages = this.messages.filter(message => message._id !== _id)
    },
    isOwnMessage(message) {
      return message.user
        ? this.$store.state.user._id === message.user._id
        : false
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}

.message-container {
  max-width: 450px;
  margin: 5px auto;
  border: 1px solid #AAA;
  border-radius: 10px;
}

.message-row {
  width: 100%;
  display: flex;
  padding: 5px 10px;
}

.message-left {
  justify-content: flex-start;
}

.message-left > .message {
  background-color: white;
  text-align: left;
}

.message-right {
  justify-content: flex-end;
}

.message-right > .message {
  background-color: #e1fec6;
  text-align: right;
}

.message {
  display: inline-block;
  text-align: left;
}

.message-box {
  height: 400px;
  max-height: 70vh;
  overflow: auto;
  position: relative;
  background-color: #f0e6dd;
}

.new-message {
  padding: 10px;
}

.send-message {
  display: block;
  margin: 0 auto 5px;
}

.send-message > input {
  border-radius: 10px;
  border: none;
  margin-right: 5px;
  display: inline-block;
  width: 70%;
  max-width: 450px;
  padding: 7px 5px;
}

.send-message > button {
  border-radius: 50%;
  border: none;
  padding: 5px;
  color: white;
  background-color: #028275;
  display: inline-flex;
  align-items: center;
}

.send-message > button > .icon {
  width: 20px;
}

.messages > * {
  margin-bottom: 5px;
}

.icon-sm {
  width: 16px;
}

.icon-md {
  width: 24px;
}

.btn {
  padding: 3px;
  border-width: 0;
  outline: none;
  border-radius: 2px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, .6);
  transition: background-color .3s;
}

.refresh {
  background-color: #2ecc71;
  margin-left: 5px;
}

.refresh {
  background-color: #27ae60;
}

.refresh > .icon-sm {
  color: white;
}
</style>
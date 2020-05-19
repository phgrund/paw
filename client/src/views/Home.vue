<template>
  <div class="home">
    <div class="message-container">
      <div class="message-title">
        <h2 style="display: inline-block">Mensagens</h2>
        <button class="btn-refresh" @click="getMessages">
          <icon name="refresh-ccw" />
        </button>
      </div>
      <div class="message-box" ref="message-box">
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
            Enviar
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

      this.scrollBottom()
    },
    async sendMessage() {
      this.newMessage = this.newMessage.trim()
      if(!this.newMessage) return

      let { data } = await this.$axios.post('message', {
        content: this.newMessage,
        anonymous: this.anonymous
      })

      this.messages.push(data)
      this.newMessage = ''

      this.scrollBottom()
    },
    onDelete(_id) {
      this.messages = this.messages.filter(message => message._id !== _id)
    },
    isOwnMessage(message) {
      return message.user
        ? this.$store.state.user && (this.$store.state.user._id === message.user._id)
        : false
    },
    scrollBottom() {
      this.$nextTick(() => {
        this.$refs['message-box'].scrollTop = this.$refs['message-box'].scrollHeight
      })
    }
  }
}
</script>

<style scoped>
.home {
  text-align: center;
}

.message-title {
  padding: 10px;
  background-color: #075E54;
  color: white;
  border-radius: 10px 10px 0 0;
}

.message-container {
  max-width: 450px;
  margin: 5px auto;
  border: 1px solid #AAA;
  border-radius: 10px;
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
}

.message-row {
  max-width: 100%;
  display: flex;
  padding: 5px 10px;
}

.message-left {
  justify-content: flex-start;
}

.message-left > .message {
  background-color: white;
  text-align: left;
  border-radius: 10px 10px 10px 0;
}

.message-right {
  justify-content: flex-end;
}

.message-right > .message {
  background-color: #e1fec6;
  text-align: right;
  border-radius: 10px 10px 0 10px;
}

.message {
  display: inline-block;
  text-align: left;
  max-width: 80%;
}

.message-box {
  height: 400px;
  max-height: 70vh;
  overflow: auto;
  position: relative;
  /* background-color: #f0e6dd; */
}

::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: rgba(7, 92, 82, .1);
}

::-webkit-scrollbar-thumb {
  background: rgba(7, 92, 82, .5);
}

::-webkit-scrollbar-thumb:hover {
  background: #075E54;
}

.new-message {
  padding: 10px;
  /* background-color: #f0e6dd; */
  border-radius: 0 0 10px 10px;
}

.send-message {
  display: block;
  margin: 0 auto 5px;
}

.send-message:after {
  content: "";
  display: table;
  clear: both;
}

.send-message > input {
  border-radius: 10px;
  border: none;
  margin-right: 5px;
  width: 70%;
  max-width: 450px;
  padding: 7px 5px;
  display: inline-block;
}

.send-message > button {
  border-radius: 5px;
  border: none;
  color: white;
  padding: 5px;
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

.btn-refresh {
  border-width: 0;
  outline: none;
  border-radius: 50%;
  transition: background-color .3s;
  color: white;
  background-color: transparent;
  margin-left: 5px;
}

.btn-refresh:hover {
  background-color: rgba(46, 204, 113, .2);
}

.btn-refresh > .icon {
  width: 20px;
}

.refresh > .icon-sm {
  color: white;
}
</style>
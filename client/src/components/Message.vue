<template>
  <div :class="['chat-row', message.sent ? 'sent-message' : 'received-message']">
    <div class="chat-bubble" @click="messageClick">
      <div v-if="!message.sent" class="message-owner">
        {{ username }}
      </div>
      <div class="message-content">
        {{ message.content }}
      </div>
      <span class="chat-time">
        {{ time }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    message: {
      type: Object,
      default: () => {}
    },
    isOwnMessage: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    editMode: false,
    newMessage: ''
  }),
  computed: {
    time() {
      let time = this.message.createdAt.split('T').pop()
      time = time.split('.').shift()
      let [hour, mins] = time.split(':')
      return `${hour}:${mins}`
    },
    username() {
      return this.message.user
        ? this.message.user.name
        : 'Anônimo'
    }
  },
  methods: {
    async deleteMessage() {
      await this.$axios.delete(`message/${this.message._id}`)
      this.$emit('onDelete', this.message._id)
    },
    async editMessage() {
      if(this.newMessage) {
        await this.$axios.put(`message/${this.message._id}`, {
          content: this.newMessage
        })
        this.message.content = this.newMessage
        this.newMessage = ''
      }
      this.editMode = false
    },
    cancelEdit() {
      this.newMessage = ''
      this.editMode = false
    },
    messageClick() {
      this.message.sent && this.$emit('messageClick', this.message)
    }
  },
  sockets: {
    connect() {
      console.log('connect')
    }
  }
}
</script>

<style scoped>
.chat-row {
  width: 100%;
  display: flex;
  margin-top: 3px;
}

.message-owner {
  font-weight: 600;
  margin-bottom: 1px;
}

.message-content {
  font-size: 14px;
}

.received-message {
  justify-content: flex-start;
}

.received-message > .chat-bubble {
  background-color: white;
}

.sent-message {
  justify-content: flex-end;
}

.sent-message > .chat-bubble {
  background-color: #dcf8c6;
}

.chat-bubble {
  padding: 6px 50px 8px 9px;
  background-color: white;
  border-bottom: #c7c0b9;
  margin-top: 2px;
  display: inline-block;
  max-width: 75%;
  border-radius: 7.5px;
  color: #303030;
  justify-self: flex-end;
  position: relative;
  cursor: pointer;
  overflow-wrap: break-word;
}

.chat-bubble:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
}

.sent-message > .chat-bubble:before {
  border-left: 8px solid #dcf8c6;
  border-right: 8px solid transparent;
  border-top: 8px solid #dcf8c6;
  border-bottom: 8px solid transparent;
  right: -8px;
  top: 0;
}

.received-message > .chat-bubble:before {
  border-left: 8px solid transparent;
  border-right: 8px solid white;
  border-top: 8px solid white;
  border-bottom: 8px solid transparent;
  left: -8px;
  top: 0;
}

.chat-time {
  position: absolute;
  bottom: 0px;
  right: 2px;
  color: rgba(0, 0, 0, .45);
  font-size: 11px;
}
</style>
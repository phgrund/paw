<template>
  <div class="message">
    <template v-if="!isOwnMessage">
      <router-link v-if="message.user" class="profile-link" :to="{ name: 'Profile', params: { id: message.user._id } }">
        {{ message.user.name }}
      </router-link>
      <div v-else class="profile-link">
        Anônimo
      </div>
    </template>
    <div class="message-content" :contenteditable="editMode" @input="e => newMessage = e.target.textContent">
      {{ message.content }}
    </div>
    <div class="info">
      <template v-if="isOwnMessage">
        <button
          v-if="!editMode"
          @click="editMode = true"
          class="action-edit"
        >
          <icon name="edit-2" />
        </button>
        <template v-else>
          <button
            @click="editMessage"
            class="action-save"
          >
            <icon name="check" />
          </button>
          <button
            @click="cancelEdit"
            class="action-cancel"
          >
            <icon name="delete" />
          </button>
        </template>
        <button
          @click="deleteMessage"
          class="action-delete"
        >
          <icon name="trash" />
        </button>
      </template>
      <div class="message-time">
        {{ formatDateTime(message.createdAt) }}
      </div>
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
    formatDateTime(str) {
      let [date, time] = str.split('T')
      time = time.split('.').shift()
      let [year, month, day] = date.split('-')
      let [hour, mins] = time.split(':')
      return `${day}/${month}/${year} ás ${hour}:${mins}`
    }
  }
}
</script>

<style scoped>
.message {
  border: 1px solid #DDD;
  border-radius: 10px;
  padding: 4px 8px 17px;
  position: relative;
  min-width: 150px;
}

.message-content {
  color: #444;
  font-size: 12px;
}

.message-time {
  font-size: 10px;
}

.info {
  position: absolute;
  bottom: 0;
  right: 2px;
}

.info > * {
  display: inline-block;
  margin-left: 2px;
}

.info > button {
  cursor: pointer;
  transition: background-color .3s;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  padding: 1px;
}

.info > button:hover {
  background-color: rgba(100, 100, 100, .1);
}

.action-delete {
  color: red;
}

.action-edit {
  color: blue;
}

.action-save {
  color: green;
}

.action-cancel {
  color: orange;
}

button > .icon {
  width: 11px;
}

.profile-link {
  font-size: 16px;
  text-decoration: none;
  color: black;
}
</style>
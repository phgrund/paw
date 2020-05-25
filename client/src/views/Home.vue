<template>
  <div class="home">
    <modal @close="closeMessage" v-model="editMessage">
      <form @click.prevent="saveMessage">
        <input v-model="selectedMessage.content" type="text">
        <button type="submit">Salvar</button>
        <button @click="deleteMessage">Deletar</button>
      </form>
    </modal>
    <aside>
      <div class="profile-header">
        <img
          @click="left = true"
          :src="user.photoUrl"
          alt="Imagem"
          class="img-avatar"
        >
        {{ user.name }}
      </div>
      <div class="chat-list">
        <profile-card
          v-for="user in users"
          :key="user._id"
          :user="user"
          @profileClick="openProfile"
        />
      </div>
      <div class="profile-edit" :style="menuStyle">
        <div v-show="left">
          <div class="profile-edit-top">
            <div class="profile-edit-menu">
              <button @click="left = false">
                <icon name="arrow-left" />
              </button>
              Perfil
            </div>
          </div>
          <div class="profile-edit-container">
            <div class="profile-avatar">
              <responsive-image style="cursor: pointer" @click.native="$refs.uploadPhoto.click()" round :src="user.photoUrl" />
            </div>
            <input v-show="false" @input="uploadPhoto" ref="uploadPhoto" type="file" />
            <div class="profile-edit-info">
              <div class="header">
                Seu Nome
              </div>
              <div class="edit" :contenteditable="editUsername">
                {{ user.name }}
              </div>
            </div>
            <div class="profile-edit-info">
              <div class="header">
                Status
              </div>
              <div class="edit" :contenteditable="editUsername">
                {{ user.status }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
    <main>
      <div class="chat-header">
        <div style="width: 100%">
          Mensagens
        </div>
        <button @click="logout">
          <icon name="log-out" />
        </button>
      </div>
      <div class="profile-info" :style="infoStyle">
        <div v-show="right">
          <div class="profile-info-top">
            <button @click="closeProfile">
              <icon name="x" />
            </button>
            <div class="avatar-container">
              <responsive-image style="cursor: pointer" round :src="selectedUser.photoUrl" />
            </div>
            <div class="profile-info-name">
              {{ selectedUser.name }}
            </div>
            <div class="profile-info-description">
              {{ selectedUser.status }}
            </div>
            <div class="profile-info-info">
              <!-- {{ selectedUser.messages }} -->
              <div class="header">
                Mensagens
              </div>
              <div
                v-for="message in selectedUser.messages"
                :key="message._id"
                class="info"
              >
                {{ message.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="chat-container" v-show="true" ref="chat">
        <message
          v-for="(message, i) in messages"
          :key="i"
          :message="message"
          @messageClick="openMessage"
        />
      </div>
      <form class="chat-actions" @submit.prevent="sendMessage">
        <div class="chat-input-anonymous">
          <input v-model="anonymous" type="checkbox">
          Anônimo
        </div>
        <div class="chat-input-message">
          <input v-model="newMessage" type="text" placeholder="Digite sua mensagem">
        </div>
        <div class="chat-input-send">
          <button type="submit">
            <icon name="send" />
          </button>
        </div>
      </form>
    </main>
  </div>
</template>

<script>
import io from 'socket.io-client'

// const socket = io.connect('http://135fcda5.ngrok.io', {
  const socket = io.connect('http://localhost:5000', {
    autoConnect: false
})

import Message from '../components/Message.vue'
import ProfileCard from '../components/ProfileCard.vue'
import ResponsiveImage from '../components/ResponsiveImage.vue'
import Modal from '../components/Modal'

export default {
  name: 'Home',
  components: {
    Message,
    ProfileCard,
    ResponsiveImage,
    Modal
  },
  data: () => ({
    users: [],
    messages: [],
    newMessage: '',
    anonymous: false,
    left: false,
    right: false,
    editUsername: false,
    editMessage: false,
    selectedUser: {},
    selectedMessage: {}
  }),
  computed: {
    user() {
      return this.$store.state.user || {}
    },
    menuStyle() {
      return {
        width: this.left
          ? '100%'
          : '0px'
      }
    },
    infoStyle() {
      return {
        width: this.right
          ? '350px'
          : '0px'
      }
    }
  },
  created() {
    window.onbeforeunload = () => {
      socket.emit('leave', {
        user: this.user
      })
    }
    socket.io.opts.query = {
      user: JSON.stringify(this.user)
    }
    socket.connect()
  },
  mounted() {
    this.getMessages()
    this.getUsers()
    this.socket()
  },
  methods: {
    socket() {
      socket.on('connect', () => {
        console.log('Connected')
      })
      socket.on('new-message', message => {
        this.messages.push({
          ...message,
          sent: message.user && this.user
            ? message.user._id === this.user._id
            : false
        })
        this.scrollBottom()
      })

      socket.on('update-message', message => {
        this.updateMessage(message._id, message.content)
      })

      socket.on('destroy-message', id => {
        this.destroyMessage(id)
      })
    },
    async getUsers() {
      let { data } = await this.$axios.get('users')

      this.users = data
        .filter(user => user._id !== this.$store.state.user._id)
        .map(user => ({
          ...user,
          photoUrl: user.photoUrl + '?t=' + new Date().getTime()
        }))
    },
    async getMessages() {
      let { data } = await this.$axios.get('messages')
      let { user } = this.$store.state

      this.messages = data.map(message => ({
        ...message,
        sent: message.user && user
          ? message.user._id === user._id
          : false
      }))

      this.scrollBottom()
    },
    async sendMessage() {
      this.newMessage = this.newMessage.trim()
      if(!this.newMessage) return

      await this.$axios.post('message', {
        content: this.newMessage,
        anonymous: this.anonymous
      })

      this.newMessage = ''

      this.scrollBottom()
    },
    async uploadPhoto(e) {
      const file = e.target.files[0]
      let accepted = [
        'image/jpeg',
        'image/png',
        'image/webp'
      ]
      if(!accepted.includes(file.type)) return

      let formData = new FormData()

      formData.append('avatar', file)

      let { data } = await this.$axios.post('user/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progress) => {
          let percentage = Math.round((progress.loaded * 100) / progress.total)
          console.log(percentage)
        }
      })

      this.$store.state.user = {
        ...data,
        photoUrl: data.photoUrl + '?t=' + new Date().getTime()
      }
    },
    async logout() {
      await this.$store.dispatch('logout', { vm: this })

      this.$router.push({ name: 'Login' })
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
        if(this.$refs.chat) {
          this.$refs['chat'].scrollTop = this.$refs['chat'].scrollHeight
        }
      })
    },
    devImage(e) {
      e.target.src = 'http://localhost:5000/' + e.target.src.split('/').pop()
    },
    async openProfile(user) {
      this.selectedUser = {
        ...user,
        messages: (await this.$axios.get('messages', {
          params: {
            user: user._id
          }
        })).data
      }
      this.right = true
    },
    closeProfile() {
      this.selectedUser = {}
      this.right = false
    },
    openMessage(message) {
      this.selectedMessage = { ...message }
      this.editMessage = true
    },
    closeMessage() {
      this.selectedMessage = {}
    },
    async saveMessage() {
      let { _id, content } = this.selectedMessage
      await this.$axios.put(`message/${this.selectedMessage._id}`, { content })
      this.updateMessage(_id, content)
    },
    updateMessage(_id, content) {
      let message = this.messages.find(message => message._id = _id)
      message && (message.content = content)
    },
    async deleteMessage() {
      let { _id } = this.selectedMessage
      await this.$axios.delete(`message/${_id}`)
      this.destroyMessage(_id)
      this.closeMessage()
      this.editMessage = false
    },
    destroyMessage(_id) {
      let index = this.messages.findIndex(message => message._id === _id)
      index > -1 && this.messages.splice(index, 1)
    }
  }
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: none;
}

::-webkit-scrollbar-thumb {
  background: #bcbcbc;
}

::-webkit-scrollbar-thumb:hover {
  background: #bcbcbc;
}

.home {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
}

aside {
  width: 300px;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

main {
  width: calc(100% - 300px);
  height: 100%;
  position: relative;
}

.img-avatar {
  width: 40px;
  height: 40px;
  margin-right: 5px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
}

.profile-avatar {
  width: 60%;
  cursor: pointer;
  margin: 15px auto 0;
}

.profile-header {
  height: 60px;
  background-color: #ededed;
  display: flex;
  align-items: center;
  padding: 10px 16px;
}

.profile-edit {
  position: absolute;
  height: 100%;
  top: 0;
  left: 0;
  background-color: #ededed;
  z-index: inherit;
  z-index: 1;
  transition: 0.2s;
  overflow-x: hidden;
}

.profile-info {
  position: absolute;
  height: calc(100% - 60px);
  top: 60px;
  right: 0;
  background-color: #ededed;
  z-index: inherit;
  z-index: 1;
  transition: 0.2s;
  overflow-x: hidden;
}

.profile-edit-top {
  height: 110px;
  background-color: #00bfa5;
  color: white;
  display: flex;
  align-items: flex-end;
}

.profile-info-top {
  margin: 0 auto;
  padding: 25px 40px;
  background-color: white;
}

.avatar-container {
  width: 75%;
  margin: 0 auto;
  padding-top: 25px;
}

.profile-info-name {
  margin-top: 15px;
  font-size: 19px;
}

.profile-info-description {
  margin-top: 5px;
}

.profile-info-top > button {
  position: absolute;
  top: 5px;
  left: 10px;
  width: 25px;
  background-color: transparent;
  border: none;
  color: #919191;
  cursor: pointer;
}

.profile-edit-container {
  text-align: center;
  margin-top: 20px;
  height: calc(100% - 110px);
}

.profile-edit-info {
  margin-top: 20px;
  padding: 14px 30px;
  background-color: white;
  text-align: left;
}

.profile-edit-info > .header {
  color: #009688;
  font-size: 14px;
  margin-bottom: 10px;
}

.profile-edit-info > .edit {
  color: #4a4a4a;
  padding: 10px 0;
}

.profile-info-info {
  margin-top: 20px;
  background-color: white;
  text-align: left;
}

.profile-info-info > .header {
  color: #009688;
  font-size: 14px;
  margin-bottom: 10px;
}

.profile-info-info > .info {
  margin-top: 7px;
  color: #4a4a4a;
  position: relative;
}

.profile-info-info > .info:before {
  position: absolute;
  bottom: 0;
  left: 0;
  content: "";
  height: 1px;
  border-bottom: 1px solid #e0e0e0;
  width: 75%;
}

.profile-edit-menu {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 19px;
}

.profile-edit-menu > button {
  width: 24px;
  border: none;
  background-color: transparent;
  color: white;
  margin-right: 29px;
  cursor: pointer;
}

.chat-list {
  height: calc(100% - 60px);
  overflow: auto;
}

.chat-header {
  height: 60px;
  background-color: #ededed;
  display: flex;
  align-items: center;
  padding: 10px 16px;
}

.chat-header > button {
  padding: 5px;
  width: 40px;
  background: none;
  border: none;
  border-radius: 50%;
  color: #919191;
  cursor: pointer;
}

.chat-header > button:hover {
  background-color: rgba(0, 0, 0, .05);
}

.chat-container {
  height: calc(100% - 120px);
  background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
  padding: 10px 35px 20px;
  overflow: auto;
}

.chat-actions {
  height: 60px;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  padding: 0 16px;
}

.chat-input-anonymous {
  display: flex;
  padding-right: 10px;
}

.chat-input-anonymous > input {
  margin-right: 5px;
}

.chat-input-message {
  width: 100%;
}

.chat-input-message > input {
  width: 100%;
  padding: 10px;
  line-height: 100%;
  border-radius: 21px;
  border: none;
}

.chat-input-send {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.chat-input-send > button {
  width: 40px;
  padding: 5px;
  border: none;
  background-color: transparent;
  color: #919191;
}

.chat-input-send > .icon {
  width: 20px;
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
</style>
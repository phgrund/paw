<template>
  <div class="home">
    <aside>
      <div class="profile-header">
        <img
          @click="left = true"
          :src="user.photoUrl || 'https://p2.trrsf.com/image/fget/cf/1200/1200/filters:quality(85)/images.terra.com/2019/04/09/mc-zoi-de-gato.jpeg'"
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
              <responsive-image style="cursor: pointer" @click.native="$refs.uploadPhoto.click()" round :src="user.photoUrl || 'https://www.24hnoticias.com/thumb/19/1/b/8/1b82333039089c2dc067ecc22f8db154.jpg'" />
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
        <!-- <img
          src="https://p2.trrsf.com/image/fget/cf/1200/1200/filters:quality(85)/images.terra.com/2019/04/09/mc-zoi-de-gato.jpeg"
          alt="Imagem"
          class="img-avatar"
        > -->
        <div style="width: 100%">
          Mensagens
        </div>
        <button @click="logout">
          <icon name="log-out" />
        </button>
      </div>
      <div class="chat-container" ref="chat">
          <message
            v-for="message in messages"
            :key="message._id"
            :message="message"
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
import Message from '../components/Message.vue'
import ProfileCard from '../components/ProfileCard.vue'
import ResponsiveImage from '../components/ResponsiveImage.vue'

export default {
  name: 'Home',
  components: {
    Message,
    ProfileCard,
    ResponsiveImage
  },
  data: () => ({
    users: [],
    messages: [],
    newMessage: '',
    anonymous: false,
    left: false,
    editUsername: false
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
    }
  },
  mounted() {
    this.getMessages()
    this.getUsers()
  },
  methods: {
    async getUsers() {
      let { data } = await this.$axios.get('users')

      this.users = data.filter(user => user._id !== this.$store.state.user._id)

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

      let { data } = await this.$axios.post('message', {
        content: this.newMessage,
        anonymous: this.anonymous
      })

      this.messages.push({
        ...data,
        sent: !this.anonymous
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
        }
      })

      this.$store.state.user = data
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
        this.$refs['chat'].scrollTop = this.$refs['chat'].scrollHeight
      })
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
  width: 350px;
  max-width: 350px;
  height: 100%;
  border-right: 1px solid #e0e0e0;
  position: relative;
}

main {
  width: 100%;
  height: 100%;
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

.profile-edit-top {
  height: 110px;
  background-color: #00bfa5;
  color: white;
  display: flex;
  align-items: flex-end;
  padding: 10px 25px;
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
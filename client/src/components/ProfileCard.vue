<template>
  <div class="profile-card" @click="$emit('profileClick', user)">
    <div class="profile-avatar">
      <img
        :src="user.photoUrl"
        alt="Imagem"
        class="img-avatar"
      />
    </div>
    <div class="profile-content">
      <div class="user-name">
        {{ user.name }}
      </div>
      <div class="user-status">
        {{ user.status }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    devImage(e) {
      e.target.src = 'http://localhost:5000/' + e.target.src.split('/').pop()
    }
  }
}
</script>

<style scoped>
.profile-card {
  width: 100%;
  display: flex;
  height: 72px;
  padding: 10px 16px;
  position: relative;
  overflow-x: hidden;
  cursor: pointer;
}

.profile-card:before {
  content: "";
  position: absolute;
  right: 0;
  bottom: 0;
  height: 1px;
  width: 75%;
  border-bottom: 1px solid #e0e0e0;
}

.profile-card:hover {
  background-color: #f5f5f5;
}

.profile-avatar {
  width: 60px;
  height: 100%;
}

.profile-content {
  width: 100%;
  padding: 0px 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
}

.user-name {
  font-weight: 600;
  text-transform: capitalize;
}

.user-status {
  width: calc(100% - 30px);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  overflow-wrap: break-word;
}

.img-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}
</style>
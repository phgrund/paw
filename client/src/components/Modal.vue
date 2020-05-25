<template>
  <div v-show="val" class="modal">
    <div class="modal-content">
      <div @click="val = false" class="close">&times;</div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    val: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
        if(!val) {
          this.$emit('close')
        }
      }
    }
  }
}
</script>

<style scoped>
/* The Modal (background) */
.modal {
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0,0,0);
  background-color: rgba(0,0,0,0.4);
}

.modal-content {
  display: inline-block;
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px 35px;
  border: 1px solid #888;
  position: relative;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
  animation-name: animatetop;
  animation-duration: 0.4s
}

.close {
  position: absolute;
  right: 5px;
  top: 0px;
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}

@keyframes animatetop {
  from {top: -300px; opacity: 0}
  to {top: 0; opacity: 1}
}
</style>

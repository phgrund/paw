<template>
  <div class="container" :style="containerStyle">
    <img
      :src="src"
      class="img"
      :style="imgStyle"
    />
  </div>
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      default: ''
    },
    ratioX: {
      type: Number,
      default: 1
    },
    ratioY: {
      type: Number,
      default: 1
    },
    round: {
      type: Boolean,
      default: false
    },
    width: {
      type: String,
      default: '100%'
    }
  },
  computed: {
    containerStyle() {
      return {
        paddingTop: `${(this.ratioY / this.ratioX) * 100}%`,
        backgroundImage: this.src,
        width: this.width,
      }
    },
    imgStyle() {
      return {
        borderRadius: this.round && '50%',
      }
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
.container {
  margin: 0 auto;
  position: relative;
}

.img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  text-align: center;
}
</style>

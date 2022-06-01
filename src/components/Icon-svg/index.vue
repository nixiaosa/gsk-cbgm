<template>
  <!-- <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg> -->
   <span :class="iconName"></span>
</template>

<script>
  export default {
    name: 'icon-svg',
    props: {
      iconClass: {
        type: String,
        required: true
      }
    },
    computed: { 
      iconName() {
        // return `#icon-${this.iconClass}`
        return `iconfont icon-${this.iconClass}`
      }
    }
  }
</script>

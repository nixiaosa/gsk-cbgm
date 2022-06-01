<template>
  <section class="app-main">

      <keep-alive>
        <router-view v-if="$route.meta.keepAlive"></router-view>
      </keep-alive>

      <router-view v-if="!$route.meta.keepAlive" :key="key"></router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key() {
      if (!this.$route.query.page) {
        return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
      }
    }
  }
}
</script>

<template>
  <div class="base-set">
    obs设置
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
export default {
  name: 'createLive',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style>
</style>

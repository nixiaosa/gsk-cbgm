<template>
  <div class="base-set">
    {{service===1?'店员培训配置设置' :'空中课堂配置设置'}}
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
export default {
  name: 'createLive',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'service'
    ])
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

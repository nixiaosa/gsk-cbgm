<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div style="margin-top: 40px"></div>
    <player :videoInfo="videoInfo"></player>
  </div>
</template>
<script>
import player from '@/views/base/player'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import {mapGetters} from 'vuex'
import HeaderContent from '@/components/header-content'

export default {
  name: 'modelist',
  data() {
    return {
      headerTitle: '',
      opertions: ['返回'],
      id: this.$route.params.id,
      videoInfo: {},
      page: this.$route.params.page
    }
  },
  computed: {
    ...mapGetters(['serviceType', 'service'])
  },
  mounted() {
    this.getVideoInfo()
  },
  methods: {
    getVideoInfo: async function () {
      let url = api.videoBusId + this.id
      const res = await http.get(url)
      if (res.data.code === 0) {
        this.headerTitle = res.data.data.name
        this.videoInfo = res.data.data
      } else {
        this.$message.error(res.data.message)
      }
    },
    headerClick() {
      this.$router.back()
    }
  },
  components: {
    player,
    HeaderContent
  }
}
</script>
<style scoped>
/* .videoList {
  padding: 10px;
  color: #333333;
  list-style: none;
  width: 800px;
  border: 1px solid #eeeeee;
} */
/* .videoList li {
  overflow: hidden;
  line-height: 40px;
  padding: 6px 10px;
  border-bottom: 1px solid #eeeeee;
}
.videoList li:nth-last-child(1) {
  border-bottom: none;
}
.piont-flex {
  display: flex;
  justify-content: space-between;
  height: 36px;
  margin-bottom: 15px;
}
.piont-flex .point-title {
  height: 36px;
  line-height: 36px;
} */
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100px;
  height: 80px;
}
</style>

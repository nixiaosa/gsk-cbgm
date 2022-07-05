<!--
 * @Author: liuchang
 * @Date: 2020-11-10 09:55:35
 * @LastEditTime: 2020-11-17 14:44:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/class/class.vue
-->
<template>
  <div>
    <!-- <normalVote-v1 v-if="isOld === 0"/>
    <normalVote-v2 v-if="isOld === 1"/> -->
    <normalVote-v1 />
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import normalVoteV1 from "./normalVoteVersion/normalVoteV1";
import normalVoteV2 from "./normalVoteVersion/normalVoteV2";

export default {
  name: "normalVoteAll",
  components: {
    normalVoteV1,
    normalVoteV2
  },
  data() {
    return {
      isOld: null // 0为老版 1为新版
    };
  },
  mounted() {
    this.getVersion();
  },
  methods: {
    getVersion: async function() {
      var res = await http.get(api.getVersion);
      if (res.data.code === 0) {
        this.isOld = res.data.data.webversion;
      } else {
        this.$message.error(res.data.message);
      }
    },
  }
};
</script>

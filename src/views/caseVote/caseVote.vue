<!--
 * @Author: liuchang
 * @Date: 2020-11-10 09:55:35
 * @LastEditTime: 2021-11-16 10:31:17
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/class/class.vue
-->
<template>
  <div>
    <caseVote-v1 v-if="isOld === 0"/>
    <caseVote-v2 v-if="isOld === 1"/>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import caseVoteV1 from "./caseVoteVersion/caseVoteV1";
import caseVoteV2 from "./caseVoteVersion/caseVoteV2";

export default {
  name: "caseVoteAll",
  components: {
    caseVoteV1,
    caseVoteV2
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
      var res = await http.post(api.getVersion);
      if (res.data.code === 0) {
        this.isOld = res.data.data.webversion;
      } else {
        this.$message.error(res.data.message);
      }
    },
  }
};
</script>
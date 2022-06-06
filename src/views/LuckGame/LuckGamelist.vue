<!--
 * @Author: liuchang
 * @Date: 2020-11-10 09:55:35
 * @LastEditTime: 2021-11-16 10:33:40
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/class/class.vue
-->
<template>
  <div>
    <LuckGamelist-v1 v-if="isOld === 0"/>
    <LuckGamelist-v1 v-if="isOld === 1"/><!-- 因抽奖活动前台无承载页，所以延用老的-->
    <!-- <LuckGamelist-v2 v-if="isOld === 1"/> -->
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import LuckGamelistV1 from "./LuckGameVersions/LuckGamelistV1";
import LuckGamelistV2 from "./LuckGameVersions/LuckGamelistV2";

export default {
  name: "LuckGameAll",
  components: {
    LuckGamelistV1,
    LuckGamelistV2
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

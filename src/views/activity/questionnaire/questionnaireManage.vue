<!--
 * @Author: liuchang
 * @Date: 2020-11-10 09:55:35
 * @LastEditTime: 2021-11-04 17:41:44
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/class/class.vue
-->
<template>
  <div>
    <questionnaireManage-v1 v-if="isOld === 0"/>
    <questionnaireManage-v2 v-if="isOld === 1"/>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import questionnaireManageV1 from "./questionnaireManageVersion/questionnaireManageV1";
import questionnaireManageV2 from "./questionnaireManageVersion/questionnaireManageV2";

export default {
  name: "questionnaireManageAll",
  components: {
    questionnaireManageV1,
    questionnaireManageV2
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

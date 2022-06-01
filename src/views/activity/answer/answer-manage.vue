<!--
 * @Author: liuchang
 * @Date: 2020-11-10 09:55:35
 * @LastEditTime: 2020-11-17 11:55:32
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/class/class.vue
-->
<template>
  <div>
    <answerManage-v1 v-if="isOld === 0"/>
    <answerManage-v2 v-if="isOld === 1"/>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import answerManageV1 from "./answerManageVersion/answerManageV1";
import answerManageV2 from "./answerManageVersion/answerManageV2";

export default {
  name: "answer-manageAll",
  components: {
    answerManageV1,
    answerManageV2
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
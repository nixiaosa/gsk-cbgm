<!--
 * @Author: liuchang
 * @Date: 2020-11-10 09:55:35
 * @LastEditTime: 2021-11-08 12:29:31
 * @LastEditors: Chance Lau
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/class/class.vue
-->
<template>
  <div>
    <class-v1 v-if="isOld === 0"/>
    <class-v2 v-if="isOld === 1"/>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import classV1 from "./classVersions/classV1";
import classV2 from "./classVersions/classV2";

export default {
  name: "classAll",
  components: {
    classV1,
    classV2
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

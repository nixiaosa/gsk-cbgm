<!--
 * @Author: your name
 * @Date: 2021-01-19 16:07:25
 * @LastEditTime: 2021-02-01 15:30:06
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/business/foreuser/userList.vue
-->
<template>
  <div>
    <userList-v1 v-if="identity === 0"/>
    <userList-v2 v-if="identity === 1"/>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import userListV1 from "./userListVersions/userListV1";
import userListV2 from "./userListVersions/userListV2";
import { mapGetters } from "vuex";
export default {
  name: "userListAll",
  components: {
    userListV1,
    userListV2
  },
  data() {
    return {
      // identity: null // 0未开启身份功能 1开启身份功能
    };
  },
  computed: {
    ...mapGetters(["identity","ipLocation"])
  },
  mounted() {
    // this.getIdentity();
  },
  methods: {
    // getIdentity: async function() {
    //   var res = await http.post(api.getcompanyconf);
    //   if (res.data.code === 0) {
    //     // this.identity = res.data.data.identity;
    //     // alert(this.identity)
    //   } else {
    //     this.$message.error(res.data.message);
    //   }
    // },
  }
};
</script>

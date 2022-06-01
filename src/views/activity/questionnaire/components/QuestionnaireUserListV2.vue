<!--
 * @Author: your name
 * @Date: 2021-01-11 21:53:44
 * @LastEditTime: 2021-08-17 14:56:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /CBGM/src/views/activity/questionnaire/components/QuestionnaireUserList.vue
-->
<template>
  <div>
    <search-form name="QuestionnaireUserList" @change="searchChange"/>
    <div class="identity-tab">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.titlename }}</el-button>
    </div>


    <IdentityTable
        v-if="titleId === 1"
        :data="data.list"
        :tableConfig="doctorConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 2"
        :data="data.list"
        :tableConfig="drugStoreConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 3"
        :data="data.list"
        :tableConfig="companyConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 4"
        :data="data.list"
        :tableConfig="patientConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 5"
        :data="data.list"
        :tableConfig="visitorConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 6"
        :data="data.list"
        :tableConfig="nurseConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 7"
        :data="data.list"
        :tableConfig="pharmacistConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
      <IdentityTable
        v-if="titleId === 8"
        :data="data.list"
        :tableConfig="technicianConfig"
        :hasSelect="false"
        ref="comment"
      ></IdentityTable>
    <el-pagination
      style="margin-top: 20px"
      background
      :current-page="pageNum"
      @current-change="pageNumChange"
      layout="total, prev, pager, next"
      :total="data.total"
    ></el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import SearchForm from "@/components/search/SearchForm";
import IdentityTable from "@/views/business/class/base/identityTable";
import QaConfig from "@/views/activity/questionnaire/components/identity.json";
export default {
  name: "QuestionnaireUserList",
  props: {
    data: {
      type: Object,
      default: () => {}
    },
    titleId: Number,
    identityArr: Array
  },
  components: {
    SearchForm,
    IdentityTable
  },
  data() {
    return {
      phone: "",
      pageNum: 1,
      dataList: [],
      total: 100,

      identityActive: 0,
      // identityArr: [],
      identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
      doctorConfig: QaConfig.doctorConfig, //医生身份
      companyConfig: QaConfig.companyConfig, //企业身份
      drugStoreConfig: QaConfig.drugStoreConfig, //药店身份
      patientConfig: QaConfig.patientConfig, //患者身份
      visitorConfig: QaConfig.visitorConfig, //游客身份
      nurseConfig: QaConfig.nurseConfig, //护士身份
      pharmacistConfig: QaConfig.pharmacistConfig, //药师身份
      technicianConfig: QaConfig.technicianConfig, //技师身份

    };
  },
  async mounted() {
    // await this.getIdentityList();
  },
  methods: {
    identityClick(item,index) {
      // this.identity = item.identity;
      this.identityActive = index;
      this.pageNumChange(1);
      this.$emit("identityClick",item,index);
    },
    // getIdentityList: async function() {
    //   //获取身份列表
    //   var params = {};
    //   var res = await http.post(api.getQaIdentityList,params);
    //   if (res.data.code === 0) {
    //     this.identityArr = res.data.data;
    //     this.identity = this.identityArr[0].titleId;
    //     // console.log(this.identity)
    //     // console.log(this.identityArr)
    //   } else {
    //     this.$message.error(res.data.message);
    //   }
    // },
    searchChange(item) {
      // 搜索触发
      if (item.prop === "SEARCH") {
        let params = {
          num: 1,
          phone: item.phone
        };
        this.pageNum = 1;
        this.phone = item.phone;
        this.$emit("change", params);
      }
    },
    pageNumChange(num) {
      // 切换分页触发
      this.pageNum = num;
      let params = {
        num: this.pageNum,
        phone: this.phone
      };
      this.$emit("change", params);
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.user-total {
  height: 45px;
  line-height: 50px;
  font-size: 16px;
  color: #333333;
  margin-bottom: 20px;
}
.list {
  position: relative;
}
.out-data {
  position: absolute;
  top: 0;
  right: 0;
}

.identity-tab {
  margin-bottom: 10px;
}
.identity-tab .el-button:hover{
  background-color: $c-theme2;
  color: $c-theme;
  border: 1px solid $c-theme;
}
.identityActive {
  background-color: $c-theme2;
  color: $c-theme;
}

</style>

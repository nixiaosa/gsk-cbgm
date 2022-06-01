<template>
  <div>
    <el-button style="float: right" type="primary" :loading="exportLoading" @click="exportList">导出</el-button>

    <div class="identity-tab">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.identityName }}</el-button>
    </div>

    <IdentityTable
      :data="identityTableData"
      :tableConfig="fieldsTitleArr"
      :hasSelect="true"
      ref="comment"
    ></IdentityTable>
    <!-- <table-list name="SignUp" :data="dataList"/> -->
    <pagination :total="total" @change="pageChange"/>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import IdentityTable from "@/views/business/class/base/identityTable";
import TableList from "@/components/table-content/TableList";
import Pagination from "@/components/pagination/Pagination";
export default {
  components: { Pagination, TableList, IdentityTable },
  data() {
    return {
      dataList: [],
      exportLoading: false,
      page: {
        pageSize: 10,
        pageNum: 1
      },
      total: 0,
      busId: this.$route.params.id,
      identityActive: 0,
      identityArr: [],
      identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: ""
    };
  },
  // mounted() {
  //   this.getSignUp();
  // },
  async mounted() {
    await this.getIdentityList();
    await this.getIdentityFields();
    this.getSignUp();
  },
  methods: {
    getIdentityFields: async function() {
      //获取身份表头
      var res = await http.get(
        api.getIdentityFields + this.busId + "/" + this.identity
      );
      if (res.data.code === 0) {
        this.fieldsTitleArr = res.data.data.map(item => {
          const resObj = {};
          resObj.label = item.fieldTitle;
          resObj.prop = item.fieldId;
          return resObj;
        });

        this.arrIndex = this.fieldsTitleArr.length;
        let resObj1 = {
          label: "手机号",
          prop: "phone",
        };
        let resObj2 = {
          label: "报名时间",
          prop: "createTime",
          type: "lastTime"
        };
        this.fieldsTitleArr.unshift(resObj1);
        this.fieldsTitleArr.push(resObj2);
      } else {
        this.$message.error(res.data.message);
      }
    },
    identityClick(item, index) {
      this.identity = item.identity;
      this.identityActive = index;
      this.getIdentityFields();
      this.getSignUp();
      this.pageChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var res = await http.get(api.getIdentityList + this.busId);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.identity = this.identityArr[0].identity;
        // console.log(this.identity)
        // console.log(this.identityArr)
      } else {
        this.$message.error(res.data.message);
      }
    },
    exportList() {
      // 导出列表
      this.exportLoading = true;
      let params = {
        busId: this.$route.params.id,
        identity: this.identity,
        type: 1   //1报名2签到
      };
      // this.$http.post(this.$api.signUp.export, params).then(res => {
      http.post(api.getIdentitySignExport, params).then(res => {
        let { code, data, message } = res.data;
        this.exportLoading = false;
        if (code === 0) {
          window.location.href = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    pageChange(item) {
      // 分页器触发
      this.page = item;
      this.getSignUp();
    },
    getSignUp() {
      // 获取报名列表
      let params = {
        ...this.page,
        params: {
          busId: this.$route.params.id,
          identity: this.identity,
          type: 1   //1报名2签到
        }
      };
      // this.$http.post(this.$api.signUp.list, params).then(res => {
      http.post(api.getIdentitySignList, params).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          // console.log(data);
          const enrollVo = res.data.data.list;
          // const enrollVo = this.testdata;
          // 用与生成el-table的data
          const data = enrollVo.map(item => {
            const res = {};
            item.enrollFieldVos.forEach(el => {
              res[el.fieldId] = el.fieldValue;
              // console.log(item.watchVo)
            });
            res["phone"] = item.phone;
            res["createTime"] = item.createTime;
            return res;
          });

          this.identityTableData = data;
          // this.dataList = data.list
          this.total = res.data.data.total;
        } else {
          this.$message.error(message);
        }
      });
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
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

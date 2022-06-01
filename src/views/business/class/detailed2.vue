<template>
  <div class="detailed">
    <header-component :title="headerTitle" :props="['返回']" @change="headerChange"/>
    <div style="margin:20px 0;"></div>
    <el-button v-if="IsInfo" @click="changeTab(0)">邀请观众列表</el-button>
    <el-button type="primary" v-if="!IsInfo">邀请观众列表</el-button>
    <el-button v-if="!IsInfo" @click="changeTab(1)">讲师列表</el-button>
    <el-button type="primary" v-if="IsInfo">讲师列表</el-button>
    <div style="margin: 10px;"></div>
    <el-button type="primary" :loading="isLoading" @click="exportList" v-show="!IsInfo"
               style="float:right;margin: 0 20px 20px 0">导出
    </el-button>
  <TableContent :tableConfig="tableConfig" :tableData="tableData" @change="tabRes"
                  v-if="businessId !== 1 && IsInfo"></TableContent>
  <TableContent :tableConfig="tableConfigs" :tableData="tableData" @change="tabRes"
                  v-if="businessId == 1 && IsInfo"></TableContent>

   <div class="identity-tab" v-if="!IsInfo">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.identityName }}</el-button>
    </div>
    <IdentityTable v-if="identity === 1 && !IsInfo" :data="tableData" :tableConfig="doctorConfig" :hasSelect="false" ref="comment"></IdentityTable>
    <IdentityTable v-if="identity === 3 && !IsInfo" :data="tableData" :tableConfig="companyConfig" :hasSelect="false" ref="comment"></IdentityTable>
    <IdentityTable v-if="identity === 2 && !IsInfo" :data="tableData" :tableConfig="drugStoreConfig" :hasSelect="false" ref="comment"></IdentityTable>
    <IdentityTable v-if="identity === 4 && !IsInfo" :data="tableData" :tableConfig="patientConfig" :hasSelect="false" ref="comment"></IdentityTable>
    
    <div style="margin: 20px;"></div>
    <el-pagination
        v-if="num == 0"
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="page"
        :total="total">
    </el-pagination>
  </div>
</template>
<script>
import TableContent from '@/components/table-content'
import Vue from 'vue'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderComponent from "../../../components/header-content/HeaderComponent";
import IdentityTable from "@/views/business/class/base/identityTable";

export default {
  name: 'detailed2',
  components: {
    HeaderComponent,
    TableContent,
    IdentityTable
  },
  data() {
    return {
      headerTitle: '查看导入明细数据',
      IsInfo: false,
      businessId: this.$route.matched[0].meta.businessId,
      num: 0,
      page: 1,
      total: 1,
      isLoading: false,
      tableData: [],
      // tableConfig:[],
      // tableConfigs:[],
      tableConfig: [
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'sex'},
        {label: '手机号', prop: 'phone'},
        {label: '电子邮箱', prop: 'email'},
        {label: '医院', prop: 'hospital'},
        {label: '省份', prop: 'province'},
        {label: '城市', prop: 'city'},
        {label: '区县', prop: 'county'},
        {label: '职称', prop: 'title'},
        {label: '科室', prop: 'office'},
        {label: '时间', prop: 'createTime', type: 'date'}
      ],
      tableConfigs: [
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'sex'},
        {label: '手机号', prop: 'phone'},
        {label: '电子邮箱', prop: 'email'},
        {label: '药店名称', prop: 'drugStore'},
        {label: '省份', prop: 'province'},
        {label: '城市', prop: 'city'},
        {label: '区县', prop: 'county'},
        {label: '职务', prop: 'title'},
        {label: '时间', prop: 'createTime', type: 'date'}
      ],

      doctorConfig: [  //医生身份
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'sex'},
        {label: '手机号', prop: 'phone'},
        {label: '省份', prop: 'province'},
        {label: '城市', prop: 'city'},
        {label: '区县', prop: 'county'},
        {label: '医院', prop: 'hospital'},
        {label: '科室', prop: 'office'},
        {label: '职称', prop: 'title'},
      ],
      companyConfig: [ //企业身份
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'sex'},
        {label: '手机号', prop: 'phone'},
        {label: '省份', prop: 'province'},
        {label: '城市', prop: 'city'},
        {label: '区县', prop: 'county'},
        {label: '部门', prop: 'department'},
        {label: '职务', prop: 'position'},
      ],
      drugStoreConfig: [ //药店身份
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'sex'},
        {label: '手机号', prop: 'phone'},
        {label: '省份', prop: 'province'},
        {label: '城市', prop: 'city'},
        {label: '区县', prop: 'county'},
        {label: '药店', prop: 'drugStore'},
        {label: '岗位', prop: 'station'},
      ],
      patientConfig: [ //患者身份
        {label: '姓名', prop: 'name'},
        {label: '性别', prop: 'sex'},
        {label: '手机号', prop: 'phone'},
        {label: '省份', prop: 'province'},
        {label: '城市', prop: 'city'},
        {label: '区县', prop: 'county'},
      ],
      
      identityActive: 0,
      identityArr: [],
      identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
    }
  },
  async mounted() {
    await this.getIdentityList();
    this.audiencelist(this.page);
  },
  computed: {
    isInfos: {
      get: function () {
        return window.location.href.indexOf('classroom') !== -1
      },
      set: function () {
      }
    }
  },
  methods: {
    identityClick(item, index) {
      this.identity = item.identity;
      this.identityActive = index;
      // this.getIdentityFields();
      // this.audiencelist();
      this.handleCurrentChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var res = await http.get(api.getIdentityList + this.$route.params.id);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.identity = this.identityArr[0].identity;
        // console.log(this.identityArr)
      } else {
        this.$message.error(res.data.message);
      }
    },
    headerChange() {
      let path = this.$route.matched[0].redirect
      this.$router.push({path: path})
    },
    exportList() {
      this.isLoading = true
      var params = {
          businessId: this.$route.matched[0].meta.businessId,
          busId: this.$route.params.id,
          identity: this.identity
      }
      http.post(api.audienceListExport,params).then(res => {
        const data = res.data
        if (data.code === 0) {
          this.isLoading = false
          window.open(data.message)
        } else {
          this.isLoading = false
          this.$message.error(data.message)
        }
      })
    },
    changeTab(data) {
      this.num = data
      if (data === 1) {
        this.IsInfo = true
        this.launchlist()
        for (var i in this.tableConfigs) {
          if (this.tableConfigs[i].label === '时间') {
            Vue.set(this.tableConfigs, i, {})
          }
        }
        for (var i in this.tableConfig) {
          if (this.tableConfig[i].label === '时间') {
            Vue.set(this.tableConfig, i, {})
          }
        }
      } else if (data === 0) {
        this.IsInfo = false
        // this.tableConfigs.push({label: '时间',prop: 'createTime', type: 'date'})
        Vue.set(this.tableConfigs, 9, {label: '时间', prop: 'createTime', type: 'date'})
        Vue.set(this.tableConfig, 10, {label: '时间', prop: 'createTime', type: 'date'})
        this.audiencelist(this.page)
      }
    },
    sex(str) {
      if (str === 'man') {
        return '男'
      }
      if (str === 'woman') {
        return '女'
      }
    },
    launchlist() {
      this.$http.get(this.$api.launchlist + this.$route.params.id).then(res => {
        this.tableData = res.data.data
        this.tableData.forEach(element => {
          element.sex = this.sex(element.sex)
        })
      }).catch(err => {
        this.$message.error(err.data.message)
      })
    },
    audiencelist: async function (page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        params: {
          busId: this.$route.params.id,
          identity: this.identity
        }
      }
      const res = await http.post(this.$api.audiencelist, params)
      if (res.data.code === 0) {
        if (res.data.data.list == null) {
          res.data.data.list = []
          this.tableData = res.data.data.list
        } else if (res.data.data.list && res.data.data.list !== null) {
          this.tableData = res.data.data.list
          this.tableData.forEach(element => {
            element.sex = this.sex(element.sex)
          })
        }
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message)
      }
    },
    handleCurrentChange(val) {
      this.page = val
      this.audiencelist(val)
    },
    tabRes() {
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.identity-tab {
  margin-top: 20px;
  /* margin-bottom: 10px; */
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



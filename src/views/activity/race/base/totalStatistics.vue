<template>
   <div class="participants">
     <div class="message">
       <span>总人数：{{totalUser}}人</span>
     </div>
     <el-form :inline="true" :model="formInline" class="demo-form-inline">
       <el-form-item label="手机号">
         <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
       </el-form-item>
       <el-form-item label="姓名">
         <el-input v-model="formInline.userName" placeholder="请输入姓名"></el-input>
       </el-form-item>
       <el-form-item>
         <el-button type="info" size="small" @click="onSubmit">查询</el-button>
         <el-button v-show="tabData.length > 0" type="info" size="small" @click="answerExport" v-if="identity === 1">导出</el-button>
         <el-button v-show="tabData.length > 0" type="info" size="small" @click="answerExport2" v-if="identity === 0">导出</el-button>
       </el-form-item>
         <el-table :data="tabData" v-if="identity === 0" border>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span>{{ scope.row.county }}</span>
        </template>
      </el-table-column>
      <el-table-column label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office}}</span>
        </template>
      </el-table-column>
      <el-table-column label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总答对数">
        <template slot-scope="scope">
          <span>{{ scope.row.sumRightNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总答题数">
        <template slot-scope="scope">
          <span>{{ scope.row.sumTotalNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总排名">
        <template slot-scope="scope">
          <span>{{ ((currentPage - 1)*10) + scope.$index + 1 }}</span>
        </template>
      </el-table-column>
    </el-table>


       <div class="identity-tab" v-if="identity === 1" style="margin-bottom:10px"> 
        <el-button
          v-for="(item,index) in identityArr"
          :key="item.titleId"
          @click="identityClick(item,index)"
          type="cancel"
          size="small"
          :class="{'identityActive':identityActive==index}"
        >{{ item.titlename }}</el-button>
      </div>
     </el-form>
     <div v-if="identity === 1">
       <IdentityTable
      v-if="titleId === 1"
      :data="tabData"
      :currentData="currentPage"
      :tableConfig="doctorConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 2"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="drugStoreConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 3"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="companyConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 4"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="patientConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 5"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="visitorConfig"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 6"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="doctorConfig2"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 7"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="doctorConfig3"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>
    <IdentityTable
      v-if="titleId === 8"
      :currentData="currentPage"
      :data="tabData"
      :tableConfig="doctorConfig4"
      :hasSelect="false"
      ref="comment"
    ></IdentityTable>

     </div>
     <div style="margin:20px"></div>
     <el-pagination
       background
       layout="total, prev, pager, next"
       :current-page.sync="currentPage"
       @current-change="handleCurrentChange"
       :total="total">
     </el-pagination>
   </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from "vuex";
  import IdentityTable from "@/views/business/class/base/identityTable";
  import userId from "@/views/activity/race/base/totalIdentity.json";
  export default {
    name: "totalstatistics",
    props:['id','page'],
    components: {
      IdentityTable
    },
    computed: {
      ...mapGetters(["companyid","identity"])
    },
    data() {
      return {
        titleId: 1,
        identityArr: [],
        totalUser: '',
        tabData: [],
        currentPage: 1,
        caseCollectId: '',
        hasTask: null,
        total: 1,
        // identityArr: [],
        identityActive: 0,
        // identity: 1,
        formInline: {
          phone: null,
          userName: null
        },
        doctorConfig: userId.doctorConfig, //医生身份 1
        companyConfig: userId.companyConfig, //企业身份 3
        drugStoreConfig: userId.drugStoreConfig, //药店身份 2 
        patientConfig: userId.patientConfig, //患者身份 4
        visitorConfig: userId.visitorConfig, //游客身份 5
        doctorConfig2: userId.doctorConfig2, //医生字段一样身份 6
        doctorConfig3: userId.doctorConfig3, //医生字段一样身份 7
        doctorConfig4: userId.doctorConfig4, //医生字段一样身份 8
      }
    },
    filters:{
      sex(val) {
        switch (val) {
          case 'man':
            return '男'
          case 'woman':
            return '女'
          default:
            return ''
        }
      },
      tomin(value) {
        var theTime = parseInt(value)// 秒
        var theTime1 = 0// 分
        var theTime2 = 0// 小时
        if (theTime > 60) {
          theTime1 = parseInt(theTime / 60)
          theTime = parseInt(theTime % 60)
          if (theTime1 > 60) {
            theTime2 = parseInt(theTime1 / 60)
            theTime1 = parseInt(theTime1 % 60)
          }
        }
        var result = '' + parseInt(theTime) + '秒'
        if (theTime1 > 0) {
          result = '' + parseInt(theTime1) + '分' + result
        }
        if (theTime2 > 0) {
          result = '' + parseInt(theTime2) + '小时' + result
        }
        return result
      },
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd hh:mm')
      },
      states(v) {
        switch (v) {
          case 0:
            return '待审核'
          case 1:
            return '已通过'
          case 2:
            return '审核未通过'
          case 3:
            return '已失效'
        }
      }
    },
    created() {
      if (this.$route.query.pages) {
        let page = Number(this.$route.query.pages)
        this.currentPage = page
      }
    },
    mounted() {
      this.participants(this.currentPage)
      this.getUserId()
    },
    methods: {
      answerExport2: async function(pageNum) {
        let params = {}
        params = {
          operate: "export",
          examId: this.id,
          phone: this.formInline.phone === '' ? this.formInline.phone = null : this.formInline.phone,
          userName: this.formInline.userName === '' ? this.formInline.userName = null : this.formInline.userName,
        }
        const res = await http.post(api.totalStatisticsList,params)
        if (res.data.code === 0) {
          window.open(res.data.data)
        } else {
          this.$message.error(res.data.message)
        }
      },
      async answerExport() {
        let params = {}
        params = {
          pageNum: 1,
          pageSize: 10,
          examId: this.id,
          operate: "export",
          phone: this.formInline.phone === '' ? this.formInline.phone = null : this.formInline.phone,
          userName: this.formInline.userName === '' ? this.formInline.userName = null : this.formInline.userName
        }
        await http.post(api.totalExport,params).then(res => {
          const data = res.data
          if (data.code !== 0) {
            this.$message.error(data.message)
          } else {
            window.open(data.data)
          }
        })
      },
      onSubmit() {
        this.participants(1)
      },
      // godetail(id) {
      //   this.$router.push({path: '/activity/casedetails/' + id})
      // },
      handleCurrentChange(val) {
        this.currentPage = val
        this.participants(val)
      },
      async getUserId() {
        let params = {}
        const res =  await http.get(api.getUserId + `${this.companyid}`, params)
        if(res.data.code === 0) {
          this.identityArr = res.data.data;
        }
      },
      identityClick(item, index) {
        this.titleId = item.titleId;
        this.identityActive = index;

        // this.identity = item.titleId;
        // this.identity = item.titleId;
        // this.identityActive = index;
        this.participants(1)
      },
      participants: async function(pageNum) {
        let params = {}
        params = {
          pageNum: pageNum,
          pageSize: 10,
          examId: this.id,
          phone: this.formInline.phone === '' ? this.formInline.phone = null : this.formInline.phone,
          userName: this.formInline.userName === '' ? this.formInline.userName = null : this.formInline.userName,
          // identity: this.titleId
        }
        if(this.identity === 1){
          params.identity = this.titleId
        }
        const res = await http.post(api.totalStatisticsList,params)
        if (res.data.code === 0) {
          this.totalUser = res.data.data.result.totalUser
          this.tabData = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 10px;
}
  .message span{
    color: $c-theme;
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
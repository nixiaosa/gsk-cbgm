<template>
  <div class="list">
    <div class="user-total">
      <div>
        <span>用户数：{{videoData.userCount}}</span>
        <span style="margin-left: 20px">观看人次：{{ videoData.viewCount}}</span>
        <span style="margin-left: 20px">观看总时长：{{ (videoData.totalViewTime / 60).toFixed(1) }}分钟</span>
        <span style="margin-left: 20px">观看平均时长：{{ (videoData.averageViewTime /60).toFixed(1) }}分钟</span>
      </div>
      <div class="out-data">
        <a @click="download()">
          <el-button :loading="isLoading" type="primary">导出</el-button>
        </a>
      </div>
    </div>


    <div class="identity-tab" v-if="identityPublic === false && identityExist === true">
      <el-button
        v-for="(item,index) in identityArr"
        :key="item.identity"
        @click="identityClick(item,index)"
        type="cancel"
        size="small"
        :class="{'identityActive':identityActive==index}"
      >{{ item.identityName }}</el-button>
    </div>

    <!-- 多身份表格start-->
    <IdentityTable v-if="identityPublic === false && identityExist === true" :data="identityTableData" :tableConfig="fieldsTitleArr" :hasSelect="false" ref="comment"></IdentityTable>
    <!-- 多身份表格end-->

    <!-- 非多身份表格start-->
    <el-table
      v-else
      :data="tableData"
      border
      >
      <el-table-column
        label="姓名">
        <template slot-scope="scope">
          <span v-if="scope.row.realname">{{ scope.row.realname }}</span>
          <span v-else>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex | sex}}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="区县">
        <template slot-scope="scope">
          <span v-if="scope.row.area">{{ scope.row.area }}</span>
          <span v-else>{{ scope.row.county }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        v-if="serviceId !== 1"
        label="医院名称">
        <template slot-scope="scope">
          <span v-if="scope.row.shopName">{{ scope.row.shopName }}</span>
          <span v-else>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="serviceId===1"
        label="药店名称">
        <template slot-scope="scope">
          <span>{{ scope.row.drugStore }}</span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="serviceId!==1"
        label="从业情况">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="serviceId===1"
        label="职务">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="serviceId!==1"
        label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office }}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="首次进入时间">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.firstEntryTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="最后离开时间">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.lastExitTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="累计观看时长(分)">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.totalWatchedDuration | tomin}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="观看设备">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.device }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="观看方式">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.browser }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="观看次数">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.watchTimes }}</span>
        </template>
      </el-table-column>
      <el-table-column
              v-if="ipLocation"
              label="最后登录IP">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.ip }}</span>
        </template>
      </el-table-column>
       <el-table-column
              v-if="ipLocation"
              label="最后登录IP归属地">
        <template slot-scope="scope">
          <span>{{ scope.row.watchVo.location }}</span>
        </template>
      </el-table-column>
    </el-table>
    <!-- 非多身份表格end-->
    
    <div style="margin: 20px"></div>
    <el-pagination
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import IdentityTable from "@/views/business/class/base/identityTable";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      videoData: "",
      isLoading: false,
      api: api,
      total: 1,
      currentPage: 0,
      usertotal: "暂无",
      usertime: "暂无",
      busId: this.$route.params.id,
      type: Number(this.$route.query.type),
      serviceId: Number(this.$route.query.service),
      tableData: [],
      identityActive: 0,
      identityArr: [],
      identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
      identityExist: "",
      identityPublic: "",
    };
  },
  props: {
    version: {
      type: String,
      default: ""
    },
    listType: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters(["ipLocation","companyid"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    tomin(value) {
      let result = (value / 60).toFixed(1);
      return result;
    },
    sex(str) {
      switch (str) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return "";
      }
    }
  },
  created: function() {},
  async mounted() {
    await this.getIdentityVideoVersion(this.$route.params.id);
    if (this.identityPublic === false && this.identityExist === true) {
      await this.getIdentityList();
      await this.getIdentityFields();
    }
    this.videoDataList(this.listType, 1);
  },
  methods: {
    getIdentityVideoVersion: async function (busId) {
      var res = await http.get(api.getIdentityVideoVersion + busId);
      if (res.data.code === 0) {
        this.identityExist = res.data.data.exist;
        this.identityPublic = res.data.data.isPublic;
      } else {
        this.$message.error(res.data.message);
      }
    },


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
        var resObj1 = {
          label: "手机号",
          prop: "phone"
        };
        var resObj2 = {
          label: "首次进入时间",
          prop: "firstEntryTime",
          type: "drawTime"
        };
        var resObj3 = {
          label: "最后离开时间",
          prop: "lastExitTime",
          type: "drawTime"
        };
        var resObj4 = {
          label: "累计观看时长（分）",
          prop: "totalWatchedDuration",
          type: "viewTime2"
        };
        var resObj5 = {
          label: "观看设备",
          prop: "device"
        };
        var resObj6 = {
          label: "观看方式",
          prop: "browser"
        };
        var resObj7 = {
          label: "观看次数",
          prop: "watchTimes"
        };
        var resObj8 = {
          label: "最后登录IP",
          prop: "ip"
        };
        var resObj9 = {
          label: "最后登录IP归属地",
          prop: "location"
        };
        this.fieldsTitleArr.unshift(resObj1);
        this.fieldsTitleArr.push(resObj2);
        this.fieldsTitleArr.push(resObj3);
        this.fieldsTitleArr.push(resObj4);
        this.fieldsTitleArr.push(resObj5);
        this.fieldsTitleArr.push(resObj6);
        this.fieldsTitleArr.push(resObj7);
        if (this.ipLocation) {
          this.fieldsTitleArr.push(resObj8);
          this.fieldsTitleArr.push(resObj9);
        }
        // console.log(this.fieldsTitleArr)
        // console.log(this.ipLocation)
      } else {
        this.$message.error(res.data.message);
      }
    },
    identityClick(item, index) {
      this.identity = item.identity;
      this.identityActive = index;
      this.getIdentityFields();
      // this.videoDataList(1, 1);
      this.handleCurrentChange(1);
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
    download() {
        this.isLoading = true;
        var params = {
          businessId: this.serviceId,
          contentId: this.busId,
          companyId: this.companyid,
          type: this.listType
        };
        if (this.identityPublic === false && this.identityExist === true) {
          params.identity = this.identity
        }
        let downLink = this.$api.watch.watchHistoryeExport
        http.post(downLink, params).then(res => {
          let data = res.data;
          if (data.code === 0) {
            this.isLoading = false;
            window.location.href = data.data;
          } else {
            this.isLoading = false;
            this.$message.error(data.message);
          }
        });
    },
    videoDataList: async function(type, pageNum) {
      var params1 = {
          pageNum: pageNum,
          pageSize: 10,
          businessId: this.serviceId,
          contentId: this.busId,
          companyId: this.companyid,
          type: type
      };
      // let apiLink = api.getIdentityWatchList;
      if (this.identityPublic === false && this.identityExist === true) {
        params1.identity = this.identity
      }
      let apiLink = this.$api.watch.watchHistory
      await http
        .post(apiLink, params1)
        .then(response => {
          var data1 = response.data.data;

          if(response.data.data.enrollVo){
            const enrollVo = response.data.data.enrollVo;
            // 用与生成el-table的data
            const data = enrollVo.map(item => {
            const res = {};
            item.enrollFieldVos.forEach(el => {
              res[el.fieldId] = el.fieldValue;
              // console.log(item.watchVo)
            });
           
              res["phone"] = item.phone;
              res["firstEntryTime"] = item.watchVo.firstEntryTime;
              res["lastExitTime"] = item.watchVo.lastExitTime;
              res["totalWatchedDuration"] = item.watchVo.totalWatchedDuration;
              res["device"] = item.watchVo.device;
              res["browser"] = item.watchVo.browser;
              res["watchTimes"] = item.watchVo.watchTimes;
              res["watchTimes"] = item.watchVo.watchTimes;
              res["ip"] = item.watchVo.ip;
              res["location"] = item.watchVo.location;
              return res;
            });

            this.identityTableData = data;
          }
          
          
          this.videoData = data1;
          this.tableData = data1.attendList;
          // this.total = data1.userCount;
          this.total = data1.total;
          this.usertotal = data1.viewCount;
          this.usertime = data1.userCount;
        })
        .catch(response => {
          if (response.data.code !== 0) {
            this.$message.error(response.data.message);
          }
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.videoDataList(this.listType, val);
    },
    initialPage() {
      if (this.currentPage !== 1) {
        this.handleCurrentChange(1);
      }
    }
  },
  components: { IdentityTable }
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





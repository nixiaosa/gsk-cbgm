<template>
  <div class="list">
    <div class="user-total">
      <div>
        <span>用户数：{{usertime}}</span>
        <span style="margin-left: 20px">观看人次：{{usertotal}}</span>
        <span style="margin-left: 20px">观看总时长：{{videoData.totalViewTime}}分钟</span>
        <span style="margin-left: 20px">观看平均时长：{{videoData.averageViewTime}}分钟</span>
      </div>
      <div class="out-data">
        <a @click="download(1)">
          <el-button :loading="isLoading" v-show="version==='1'" type="primary">导出</el-button>
        </a>
        <a @click="download(2)">
          <el-button :loading="isLoading" v-show="version==='2'" type="primary">导出</el-button>
        </a>
      </div>
    </div>

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

    <IdentityTable :data="identityTableData" :tableConfig="fieldsTitleArr" :hasSelect="false" ref="comment"></IdentityTable>

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
    };
  },
  props: {
    version: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters(["ipLocation"])
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    tomin(value) {
      let result = parseInt(value / 60);
      if (value % 60 > 0) result += 1;
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
    await this.getIdentityList();
    await this.getIdentityFields();
    this.videoDataList(1, 1);
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
        var resObj1 = {
          label: "手机号",
          // prop: this.arrIndex + 1,
          prop: "first1",
          // type: "lastTime"
        };
        var resObj2 = {
          label: "最新观看时间",
          // prop: this.arrIndex + 1,
          prop: "last3",
          type: "lastTime"
        };
        var resObj3 = {
          label: "累计观看时长(分)",
          // prop: this.arrIndex + 2,
          prop: "last2",
          type: "viewTime"
        };
        var resObj4 = {
          label: "IP归属地",
          // prop: this.arrIndex + 3
          prop: "last1",
        };
        this.fieldsTitleArr.unshift(resObj1);
        this.fieldsTitleArr.push(resObj2);
        this.fieldsTitleArr.push(resObj3);
        if (this.ipLocation) {
          this.fieldsTitleArr.push(resObj4);
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
    download(type) {
      if (type === 1) {
        this.isLoading = false;
        window.location.href = api.videoWatchOut + this.busId + "/" + 1;
      } else {
        this.isLoading = true;
        var params = {
          businessId: this.serviceId,
          busId: this.busId,
          type: 1,
          identity: this.identity
        };
        http.post(api.adminWatchListExport, params).then(res => {
          let data = res.data;
          if (data.code === 0) {
            this.isLoading = false;
            window.location.href = data.data;
          } else {
            this.isLoading = false;
            this.$message.error(data.message);
          }
        });
      }
    },
    videoDataList: async function(type, pageNum) {
      var params1 = {
        pageNum: pageNum,
        pageSize: 10,
        params: {
          businessId: this.serviceId,
          busId: this.busId,
          type: type,
          identity: this.identity
        }
      };
      let apiLink = api.getIdentityWatchList;
      // let apiLink = ''
      // if (this.serviceId !== 9) {
      //   apiLink = api.watchList
      //   if (this.version === '2') {
      //     if (this.serviceId === 5) {
      //       apiLink = api.watch3List
      //     } else {
      //       apiLink = api.watch2List
      //     }
      //   }
      // } else {
      //   apiLink = api.adminWatchList
      // }
      await http
        .post(apiLink, params1)
        .then(response => {
          var data1 = response.data.data;

          // this.fieldsValueArr = response.data.data.enrollVo.map(
          //   item => item.enrollFieldVos
          // );

          const enrollVo = response.data.data.enrollVo;
          // const enrollVo = this.testdata;
          // 用与生成el-table的data
          const data = enrollVo.map(item => {
            const res = {};
            item.enrollFieldVos.forEach(el => {
              res[el.fieldId] = el.fieldValue;
              // console.log(item.watchVo)
            });
            // res[this.arrIndex + 1] = item.watchVo.lastTime;
            // res[this.arrIndex + 2] = item.watchVo.viewTime;
            // res[this.arrIndex + 3] = item.location;
            res["first1"] = item.phone;
            res["last3"] = item.watchVo.lastTime;
            res["last2"] = item.watchVo.viewTime;
            res["last1"] = item.location;
            // item.watchVo.lastTime
            return res;
          });

          this.identityTableData = data;
          // console.log(this.identityTableData);

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
      this.videoDataList(1, val);
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





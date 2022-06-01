<template>
  <div class="casedetails">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="wrap" style="height: 100px">
      <span class="titls" style="width: 80px;position:relative;">头像:</span>
      <img
        v-if="userData.photo"
        :src="userData.photo"
        alt
        width="100"
        height="100"
        style="position: absolute;top: 129px;"
      >
      <img
        v-else
        src="https://yibaiserver-1252497236.file.myqcloud.com/yibai/default_user_avatar.png"
        alt
        width="100"
        height="100"
        style="position: absolute;top: 129px;"
      >
    </div>
    <div class="wrap">
      <span class="titls">
        姓名:
        <span>{{ userData.name }}</span>
      </span>
      <span class="titls">
        性别:
        <span>{{ userData.sex | sex }}</span>
      </span>
      <span class="titls">
        手机号:
        <span>{{ userData.phone }}</span>
      </span>
    </div>
    <div class="wrap">
      <span class="titls">
        省份:
        <span>{{ userData.province }}</span>
      </span>
      <span class="titls">
        城市:
        <span>{{ userData.city }}</span>
      </span>
      <span class="titls">
        区县:
        <span>{{ userData.county }}</span>
      </span>
    </div>
    <div class="wrap">
      <span class="titls">
        医院:
        <span>{{ userData.hospital }}</span>
      </span>
      <span class="titls">
        职称:
        <span>{{ userData.title }}</span>
      </span>
      <span class="titls">
        科室:
        <span>{{ userData.office }}</span>
      </span>
    </div>
    <el-tabs type="card">
      <el-tab-pane label="病例分配记录" name="first"></el-tab-pane>
    </el-tabs>
    <el-table :data="tabData" border>
      <el-table-column label="病例编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.caseCollectName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="病例名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分配时间">
        <template slot-scope="scope">
          <span>{{ scope.row.distributeTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="专家评分">
        <template slot-scope="scope">
          <span v-if="scope.row.score">{{ scope.row.score }}分</span>
          <span v-else>一一</span>
        </template>
      </el-table-column>
      <el-table-column label="点评内容">
        <template slot-scope="scope">
          <span>{{ scope.row.content ? scope.row.content : '一一' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="点评状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | isStop }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="godetail(scope.row.id)"
          >查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
export default {
  name: "specialdetails",
  components: {
    HeaderContent
  },
  data() {
    return {
      auditTask: {},
      auditFlowStatesList: [], // 审核级别当前信息
      dialogVisible: false,
      imgUrl: "",
      headerTitle: "专家分配详情",
      opertions: ["返回"],
      value1: true,
      id: this.$route.params.id,
      caseCollectId: "",
      userData: {},
      isDisabled: false,
      states: "",
      noPassReason: "",
      approveTime: "",
      hasTask: null,
      isActive: true,
      isActives: false,
      commitTime: "",
      title: "",
      isShow: null,
      num: null,
      fromName: "",
      attachList: [],
      description: "",
      caseType: null,
      isOcr: null,
      formId: null,
      ocrSuccess: null,
      ocrFail: null,
      caseCollectName: "",
      // goPFillShow: true
      caseFormType: "",
      caseFormStageName: "",
      currentSpecialPage: 1,
      totalSpecial: 1,
      specialComment: false,
      copyUrl: window.location.host,
      formMessage: {
        radio: "0"
      },
      multipleSelectionDialog: [],
      tabDataSpecial: [],
      caseFillIds: [],
      userIds: [],
      professorRemark: "", // 有无专家点评(0否1是)
      formSpecialUpload: {
        name: null // 专家名
      },
      professorRemarks: [],
      busId: "",
      currentPage: 1,
      total: 1,
      tabData: [],
      taskstatistics:{}
    };
  },
  filters: {
    sex(item) {
      switch (item) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return " ";
      }
    },
    formatDate(time) {
      if (!time) {
        return '一一';
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    number(item) {
      switch (item) {
        case 1:
          return "一";
        case 2:
          return "二";
        case 3:
          return "三";
      }
    },
    isStop(item){
      switch (item) {
        case 0:
          return "未点评";
        case 1:
          return "已点评";
      }
    },
    statusHtml(item) {
      switch (item) {
        case 0:
          return `<span style="color: rgb(252, 81, 12)">审核中</span>`;
        case 1:
          return `<span style="color: rgb(19, 139, 1)">已通过</span>`;
        case 2:
          return `<span style="color: rgb(252, 0, 6)">审核不通过</span>`;
        case 3:
          return `<span style="color: rgb(19, 139, 1)">已失效</span>`;
        case undefined:
          return `<span style="color: rgb(19, 139, 1)">----</span>`;
        default:
          return `<span>${item}</span>`;
      }
    }
  },
  async mounted() {
    await this.casedetail();
    this.caseFillUserList(1);
  },
  methods: {
    async userCanSubmitCount(num){
      let params = {
        caseCollectId: this.$route.query.caseCollectId,
        userId: this.$route.query.caseCollectId,
        num: num
      };
      const res = await http.post(api.allowNumSetNum, params);
      if (res.data.code === 0) {
        this.$message.success("保存成功");
        this.casedetail();
      } else {
        this.$message.error(res.data.message);
      }
    },
    async userSinglePerMonthCount(num){
      let params = {
        caseCollectId: this.$route.query.caseCollectId,
        userId: this.$route.query.caseCollectId,
        perMonthNum: num
      };
      const res = await http.post(api.allowNumSetPerMonthNum, params);
      if (res.data.code === 0) {
        this.$message.success("保存成功");
        this.casedetail();
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleSelectionChangeDialog(val) {
      this.multipleSelectionDialog = val;
      this.userIds = [];
      this.multipleSelectionDialog.map(item => {
        this.userIds.push(item.userId);
      });
      console.log(this.userIds);
    },
    
    handleSpecialCurrentChange(val) {
      this.currentSpecialPage = val;
      this.professorList(val);
    },
    
    headerClick() {
      this.$router.back();
    },
    change(val) {
      let vals = null;
      if (val === true) {
        vals = 1;
      } else {
        vals = 0;
      }
      this.caseSetshow(vals);
    },
    casedetail: async function() {
      const res = await http.get(api.caseProfessorInfo + this.$route.query.busId + '/' + this.$route.query.userId);
      if (res.data.code === 0) {
        this.userData = res.data.data
      } else {
        this.$message.error(res.data.message);
      }
    },
    caseFillUserList: async function(pageNum) {
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        params: {
          busId: this.$route.query.busId,
          userId: this.$route.query.userId
        }
      };
      const res = await http.post(api.professorRemarkLimitFindWithProfessor, params);
      if (res.data.code === 0) {
        this.tabData = res.data.data.data
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.caseFillUserList(val)
    },
    caseSetshow: async function(val) {
      let paraps = {
        id: this.id,
        isShow: val
      };
      const res = await http.post(api.caseSetshow, paraps);
      if (res.data.code === 0) {
      } else {
        this.$message.error(res.data.message);
      }
    },
    goPFill(url) {
      let urlList = url.split(".");
      let length = urlList.length;
      let fileName = urlList[length - 1];
      let office = "doc,xls,ppt,docx,xlsx,pptx";
      if (office.indexOf(fileName) >= 0) {
        window.open("https://view.officeapps.live.com/op/view.aspx?src=" + url);
      } else if (fileName.indexOf("pdf") >= 0) {
        this.pdfUrl = url;
        this.$router.push({
          path: "/activity/checkPdf",
          query: { url: url }
        });
      } else {
        this.dialogVisible = true;
        this.imgUrl = url;
      }
    },
    hideZipSee(item) {
      let urlList = item.fileUrl.split(".");
      let length = urlList.length;
      let fileName = urlList[length - 1];
      let compressedFiles = "zip,rar,7z,tar,bz,gz,apz,ar";
      if (compressedFiles.indexOf(fileName) >= 0) {
        item.goPFillShow = false;
      }
    },
    See(index, url) {
      let routes = this.$router.resolve({
        path: `/activity/caseprview/${this.id}/${this.caseCollectId}?name=${
          this.userData.name
        }&title=${this.fromName}`
      });
      window.open(routes.href, "_blank");
      // this.$router.push({
      //   path: '/activity/caseprview/' + this.id + '/' + this.caseCollectId
      // })
    },
    godetail(id) {
      this.$router.push({ path: "/activity/casedetails/" + id });
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.specialComment {
  font-size: 14px;
}
.specialComment li {
  margin: 20px 0;
  border-bottom: 1px solid #ececec;
}
.specialComment li div {
  margin-bottom: 20px;
}
.listBtn {
  cursor: pointer;
  margin-top: 20px;
  text-align: center;
  /*float: right;*/
  margin-left: 20px;
  display: inline-block;
  width: 78px;
  height: 22px;
  line-height: 22px;
  color: #ffffff;
  font-size: 12px;
  background: $c-theme !important;
}
.listBtn:hover{
  color:#fff !important;
}
.userBoxRightList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  // padding: 0 20px;
}
.userBoxRightList ul{
  list-style: none;
  padding: 0;
}
.userBoxRightList li:nth-last-child(1) {
  border-bottom: none;
}
.userBoxRightList li {
  color: #333333;
  font-size: 16px;
  height: 62px;
  width: 100%;
  line-height: 62px;
  border-bottom: 1px solid #ececec;
}
.casedetails .wrap {
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 20px;
}
.casedetails .wrap .titls {
  display: inline-block;
  width: 185px;
}
.casedetails .wrap .titls-long {
  display: inline-block;
  width: 500px;
}
.Isshow {
  width: 511px;
  height: auto;
}
.Isshow .bigbox {
  display: inline-block;
  margin-left: 143px;
  font-size: 14px;
  color: #999;
}
.caseForm .caseForm_content {
  min-height: 200px;
  max-height: auto;
  border: 1px solid #eeeeee;
}
.caseForm .caseForm_content .caseForm_title {
  min-height: 200px;
  max-height: auto;
}
.caseForm_title .lt {
  margin: 0 20px;
  overflow: hidden;
}
.active {
  color: red;
}
.actives {
  color: green;
}
.items {
  display: inline-block;
  width: 400px;
  height: 36px;
  line-height: 36px;
  background: #f2f2f2;
  border-radius: 4px;
  margin: 28px 0;
}
.items span {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.item {
  display: inline-block;
}
.descr {
  margin: 20px 0;
}
.descr .area {
  width: auto;
  min-height: 150px;
  max-height: auto;
  padding-top: 30px;
  margin: 10px 0;
}
.fn-lh {
  line-height: 1.5;
}

.ocr {
  display: inline-block;
  line-height: 1;
  transform: translateY(3px);
  margin-left: 10px;
  color: $c-theme;
  font-weight: bold;
  font-size: 16px;
}
.ocr em {
  font-style: normal;
  font-size: 16px;
}
.caseName {
  margin-left: 20px;
}
.module_content_box_num_ipt {
  margin: 0 10px;
  width: 130px;
}
</style>

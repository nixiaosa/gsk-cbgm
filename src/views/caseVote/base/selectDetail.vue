<template>
  <div class="casedetails">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>

    <!-- <div class="wrap">
      <span class="titls" style="width: 200px;position:relative;">编号:{{ this.voteCode }}</span>
    </div> -->

    <!-- 编号、头像、caseId 取崔洋/vote/option/detail接口 其他信息取张龙原先接口-->
    <div class="wrap">
      <span class="titls" style="width: 80px;position:relative;">编号:</span>
      <span class="votecode">
        {{ this.voteCode }}
      </span>
    </div>
    <div class="wrap" v-if="photoStatus == 1" style="position:relative; height: 100px" >
      <span class="titls" style="width: 80px;">头像:</span>
      <img
        :src="this.caseImg"
        alt
        width="100"
        height="100"
        style="position: absolute;top: 0px;"
      >
    </div>
    <div class="wrap">
      <span class="titls">
        姓名:
        <span>{{ userData.name }}</span>
      </span>
      <span class="titls">
        性别:
        <span>{{ userData.sex }}</span>
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
    <div class="caseName">
      <span>病例名称:</span>
      <span>{{ title }}</span>
    </div>
    <!-- <div class="wrap">
      <span class="titls">上传时间:</span>
      <span>{{commitTime | formatDate }}</span>
    </div>-->

    <!-- <div v-for="item in auditFlowStatesList" :key="item.id">
      <div class="wrap" v-if="hasTask === 1">
        <span class="titls">{{item.currentRank | number}}级审核状态:</span>
        <span v-html="$options.filters.statusHtml(item.approveStates)"></span>
      </div>
      <div class="wrap" v-if="hasTask === 1">
        <span class="titls">审核时间:</span>
        <span v-html="$options.filters.formatDate(item.approveTime)"></span>
      </div>
      <div class="wrap" v-if="hasTask === 1">
        <span class="titls">{{item.currentRank | number}}级审核人:</span>
        <span v-if="item.approveUserName">{{item.approveUserName}}</span>
        <span v-else style="color: rgb(19, 139, 1)">----</span>
      </div>
      <div class="wrap" v-if="auditTask.isRemark && hasTask === 1">
        <span class="titls">备注:</span>
        <span v-if="item.remark" class="fn-lh">{{item.remark}}</span>
        <span v-else style="color: rgb(19, 139, 1)">----</span>
      </div>
      <div class="wrap" v-if="auditTask.isComment">
        <span class="titls">专家点评:</span>
        <span v-if="item.comment" class="fn-lh">{{item.comment}}</span>
        <span v-else style="color: rgb(19, 139, 1)">----</span>
      </div>
      <div class="wrap" v-if="auditTask.isComment">
        <span class="titls">专家评分:</span>
        <span v-if="item.starScore && auditTask.commentType === 1">{{item.starScore}}星</span>
        <span v-else-if="item.starScore && auditTask.commentType === 0">{{item.starScore}}分</span>
        <span v-else style="color: rgb(19, 139, 1)">----</span>
      </div>
      <div class="wrap" v-if="item.approveStates === 2">
        <span class="titls">拒绝原因:</span>
        <span style="line-height: 30px;">{{ item.reason }}</span>
      </div>
    </div>-->
    <!-- <div class="wrap">
      <span class="titls">病例显示:</span>
      <el-switch
        v-model="isShow"
        on-color="#13ce66"
        off-color="#eee"
        @change="change"
        :disabled="isDisabled"
      ></el-switch>
      <span>不公开显示/公开显示</span>
    </div>-->
    <!-- <div class="Isshow">
      <span class="bigbox">
        请选择该病例是否在前台列表显示，供所有用户观看
        系统默认不显示
      </span>
    </div>-->
    <div class="caseForm">
      <div style="margin:15px 0;">病例表单:</div>
      <div class="userBoxRightList">
        <ul v-if="caseType === 0">
          <li>
            <span>{{fromName}}</span>
            <!--用户没有提交过表单 对应字段 fromTitle 填写过title-->
            <span @click="See(0)" class="listBtn">查看</span>
          </li>
        </ul>
        <ul v-if="caseType === 1">
          <li v-for="item in attachList">
            <span>{{item.fileName}}</span>
            <span @click="goPFill(item.fileUrl)" class="listBtn">查看</span>
            <a :href="item.fileUrl" class="listBtn">下载</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="descr">
      <span>病历简介:</span>
      <div class="area intro-content ql-editor" v-html="description"></div>
    </div>
    <el-dialog :lock-scroll="false" :show-close="false" :visible.sync="dialogVisible" width="50%">
      <div style="text-align: center">
        <img style="max-width: 100%" :src="imgUrl" alt>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
export default {
  // name: "casedetails",
  name: "selectDetail",
  components: {
    HeaderContent
  },
  data() {
    return {
      auditTask: {},
      auditFlowStatesList: [], // 审核级别当前信息
      dialogVisible: false,
      imgUrl: "",
      headerTitle: "病例投票管理-->投票选项-->详情",
      opertions: ["返回"],
      value1: true,
      id: this.$route.params.id,
      caseId: "",
      voteCode:"",
      caseImg:"",
      caseCollectId: "",
      userData: {
        innerText: ""
      },
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
      photoStatus: this.$route.query.photoStatus
    };
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return '<span style="color: rgb(19, 139, 1)">----</span>';
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
    await this.caseActivityDetail();
    this.casedetail();
  },
  methods: {
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

    caseActivityDetail: async function() {
      let params = {
        voteId: this.$route.query.voteId,
        optionId: this.$route.params.id
      };
      // const res = await http.get(api.caseActivityDetail + this.id);
      const res = await http.post(api.voteOptionDetail, params);
      if (res.data.code === 0) {
        this.caseId = res.data.data.voteOption.caseId;
        // console.log(this.caseId)
        this.voteCode = res.data.data.voteOption.voteCode;
        this.caseImg = res.data.data.voteOption.caseImg;
      } else {
        this.$message.error(res.data.message);
      }
    },

    casedetail: async function() {
      const res = await http.get(api.casedetail + this.caseId);
      // const res = await http.get(api.casedetail + "741340292770168832");
      if (res.data.code === 0) {
        this.auditTask = res.data.data.auditTask;
        this.auditFlowStatesList = res.data.data.auditFlowStatesList;
        this.caseCollectId = res.data.data.caseCollectId;
        if (res.data.data.userData.sex === "man") {
          res.data.data.userData.sex = "男";
        } else if (res.data.data.userData.sex === "woman") {
          res.data.data.userData.sex = "女";
        }
        this.userData = res.data.data.userData;
        this.states = res.data.data.states;
        this.approveTime = res.data.data.approveTime;
        this.commitTime = res.data.data.commitTime;
        this.title = res.data.data.title;
        this.num = res.data.data.isShow;
        this.fromName = res.data.data.fromName;
        this.description = res.data.data.description;
        this.noPassReason = res.data.data.noPassReason;
        this.caseType = res.data.data.caseType;
        if (res.data.data.attachList && res.data.data.attachList.length > 0) {
          this.attachList = res.data.data.attachList;
        }
        this.hasTask = res.data.data.hasTask;
        if (this.states === 1) {
          this.isActive = false;
          this.isActives = true;
        }
        if (this.num === 1) {
          this.isShow = true;
        } else if (this.num === 0) {
          this.isShow = false;
        }
        if (this.hasTask === 0) {
          this.isDisabled = false;
        } else if (
          this.hasTask === 1 &&
          (this.states === 0 || this.states === 2)
        ) {
          this.isDisabled = true;
        }
      } else {
        this.$message.error(res.data.message);
      }
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
    See(index, url) {
      let routes = this.$router.resolve({
        path: `/activity/caseprview/${this.caseId}/${this.caseCollectId}?name=${
          this.userData.name
        }&title=${this.fromName}`
      });
      window.open(routes.href, "_blank");
      // this.$router.push({
      //   path: '/activity/caseprview/' + this.id + '/' + this.caseCollectId
      // })
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
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
  background: $c-theme;
}
.userBoxRightList {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 0 20px;
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
.votecode{
  font-size: 18px;
  font-weight: bold;
}
</style>

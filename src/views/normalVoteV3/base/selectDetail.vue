<template>
  <div class="casedetails">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="wrap">
      <span class="titls" style="width: 80px;position:relative;">编号:</span>
      <span class="votecode">{{ this.tableData.no }}</span>
    </div>
    <div class="wrap" style="position:relative; height: 100px">
      <span class="titls" style="width: 80px;">头像:</span>
      <img :src="this.tableData.backImg" alt width="100" height="100" style="position: absolute;top: 0px;">
    </div>
    <div class="wrap">
      <span>
        选项名称:
        <span>{{ this.tableData.optionName }}</span>
      </span>
    </div>

    <div class="caseForm">
      <div style="margin:50px 0 20px 0;">附件:</div>
      <div class="userBoxRightList">
        <ul>
          <li v-for="item in attachList">
            <span>{{ item.split('/')[item.split('/').length -1] }}</span>
            <span @click="goPFill(item)" class="listBtn">查看</span>
          </li>
        </ul>
      </div>
      <div class="userBoxRightList">
        <ul>
          <li v-for="item in attachList2">
            <a :href="item" target="_blank">{{ item.split('/')[item.split('/').length -1] }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="descr">
      <span>投票描述:</span>
      <div class="area intro-content ql-editor" v-html="tableData.optionContent"></div>
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
      headImg: "",
      imgUrl: "",
      optionName: "",
      headerTitle: "投票管理-->投票选项-->详情",
      opertions: ["返回"],
      value1: true,
      id: this.$route.params.id,
      caseId: "",
      voteCode: "",
      caseImg: "",
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
      attachList2: [],
      description: "",
      caseType: null,
      photoStatus: this.$route.query.photoStatus,
      tableData: {}
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
      const res = await http.get(api.voteQueryOptionsDetail + this.$route.query.voteId + '/' + this.$route.query.optionId);
      if (res.data.code === 0) {
        this.tableData = res.data.data
        let fileUrlArr = res.data.data.accessoryUrls;
        let fileUrlArr2 = res.data.data.videoUrls;
        if (fileUrlArr && fileUrlArr.length > 0) {
          this.attachList = fileUrlArr;
        }
        if (fileUrlArr2 && fileUrlArr2.length > 0) {
          this.attachList2 = fileUrlArr2;
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
  /* margin-left: 20px; */
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
.votecode {
  font-size: 18px;
  font-weight: bold;
}
</style>

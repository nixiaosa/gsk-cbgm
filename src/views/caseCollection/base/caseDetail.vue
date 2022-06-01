<template>
  <div class="caseDetail">
    <div class="wrap">
      <span class="titles">开始时间:</span>
      <span>{{ beginTime | formatDate }}</span>
    </div>
    <div v-if="endTime" class="wrap">
      <span class="titles">结束时间:</span>
      <span>{{ endTime | formatDate }}</span>
    </div>
    <div class="wrap">
      <span class="titles">采集病例数:</span>
      <span style="margin-right: 5px;">{{ total }}份</span>
      <span>剩余{{ surplus }}份</span>
    </div>
    <div class="wrap">
      <span class="titles">每人上传总数:</span>
      <span style="margin-right: 5px;">{{ singleTotal }}份</span>
    </div>
    <div class="wrap">
      <span class="titles">上传总数规则:</span>
      <span style="margin-right: 5px;">{{ submitRule | submitRule }}</span>
    </div>
    <div class="wrap">
      <span class="titles">显示病例数:</span>
      <span style="margin-right: 5px;">{{ whetherShowCount | isTrue }}</span>
    </div>
    <div class="wrap">
      <span class="titles">自动审核:</span>
      <span style="margin-right: 5px;">{{ isAutoAudit | isTrue }}</span>
    </div>
    <div class="wrap">
      <span class="titles">OCR识别服务:</span>
      <span style="margin-right: 5px;">{{ isOcr | isTrue }}</span>
    </div>
    <div class="wrap" v-if="introduce">
      <span class="titles">活动简介:</span>
      <div class="area intro-content ql-editor" v-html="introduce"></div>
    </div>
    <div class="wrap">
      <span class="titles">病例表单:</span>
      <div class="userBoxRightList">
        <!-- <ul v-if="type === 0">
          <li v-for="item in caseFormListArr" :key="item.id">
            <span>{{item.title}}</span>
            <span @click="See(item.id)" class="listBtn">查看</span>
          </li>
        </ul> -->
        <ul v-if="type === 0"> <!-- 表单类型-->
          <li v-for="item in caseFormListArr" :key="item.id">
            <div v-if="item.type === 'normal'"> <!-- 普通表单类型-->
              <span>{{item.title}}</span>
              <span @click="See(item.id)" class="listBtn">查看</span>
            </div>
            <div v-else> <!-- 多阶段表单类型-->
              <!-- <div v-if="!item.multisRank">
                <div class="multistage-title">{{item.title}}</div>
                <div class="multistage" v-for="itemChilds in item.childs" :key="itemChilds.id">
                  <span>{{itemChilds.title}}</span>
                  <span @click="See(itemChilds.id)" class="listBtn">查看</span>
                </div>
              </div> -->
              <div>
                <div class="multistage-title">{{item.title}}</div>
                <div class="multistage" v-for="(itemChilds,index) in item.childs">
                  {{ itemChilds.rank | getRank }}
                  <div v-for="a in itemChilds.list" style="margin-left:30px">
                    <span>{{ a.title }}</span>
                    <span @click="See(a.id)" class="listBtn">查看</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>

        <ul v-if="type === 1"> <!-- 附件类型-->
          <li v-for="item in attachs">
            <span>{{item.fileName}}</span>
            <span v-if="item.goPFillShow" @click="goPFill(item.fileUrl)" class="listBtn">查看</span>
            <a :href="item.fileUrl" class="listBtn">下载</a>
          </li>
        </ul>
        <ul v-if="type === 3" > <!-- 多阶段关联表单-->
          <li v-for="item in caseFormListArr">
            <span>{{item.title}}</span>
            <span @click="goseeCaseMany(item.caseCollectId, item.childs[0].list[0].id)" class="listBtn">查看</span>
          </li>
        </ul>
      </div>
    </div>
    <a href></a>
    <div class="wrap">
      <span class="titles">活动状态:</span>
      <span>{{ states | getState }}</span>
    </div>
    <!--预览图片-->
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
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import pdf from "@/views/base/check-pdf.vue";
export default {
  name: "caseDetail",
  props: {
    id: {
      type: String
    }
  },
  watch: {
    id() {
      this.caseActivityDetail();
    }
  },
  filters: {
    getRank(val) {
      switch (val) {
        case 1:
          return '一级表单'
        case 2:
          return '二级表单'
        case 3:
          return '三级表单'
        case 4:
          return '四级表单'
        case 5:
          return '五级表单'
      }
    },
    submitRule(item) {
      switch (item) {
        case 0:
          return "按提交次数计算总份数";
        case 1:
          return "按审核通过数计算总份数";
      }
    },
    isTrue(item) {
      switch (item) {
        case 0:
          return "否";
        case 1:
          return "是";
        default:
          return "未设置";
      }
    },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    getState(state) {
      if (state === 0) {
        return "未发布";
      } else if (state === 1) {
        return "未开始";
      } else if (state === 2) {
        return "进行中";
      } else if (state === 3) {
        return "已结束";
      } else if (state === 4) {
        return "已过期";
      } else if (state === -1) {
        return "未发布";
      }
    }
  },
  data() {
    return {
      pdfUrl: "",
      imgUrl: "",
      dialogVisible: false,
      beginTime: "",
      endTime: "",
      states: "",
      whetherShowCount: "", // 是否显示病例数 0否 1是
      isAutoAudit: 3, // 是否自动审核 0 否 1 是
      isOcr: 0, // 是否自动审核 0 否 1 是
      introduce: "",
      total: "",
      surplus: "",
      formName: "",
      type: "",
      attachs: [],
      caseFormListArr: [],
      formId: null,
      formIdArr: [],
      singleTotal: "",
      submitRule: "",
      // goPFillShow: true
    };
  },
  mounted() {
    this.caseActivityDetail();
    // this.caseFormList();
    // this.seeCaseForm()  
  },
  components: {
    pdf
  },
  methods: {
    caseFormList: async function() {
      const res = await http.get(api.caseFormList + this.id);
      if (res.data.code === 0) {
        // this.formId = res.data.data[0].id;
        // console.log(this.formId)
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
        item.goPFillShow = false
      }
    },
    caseActivityDetail: async function() {
      const res = await http.get(api.caseActivityDetail + this.id);
      if (res.data.code === 0) {
        this.beginTime = res.data.data.beginTime;
        this.endTime = res.data.data.endTime;
        this.states = res.data.data.states;
        this.introduce = res.data.data.introduce;
        this.total = res.data.data.total;
        this.surplus = res.data.data.surplus;
        // this.formName = res.data.data.formName;
         this.formName = res.data.data.name;
        this.type = res.data.data.type;
        this.whetherShowCount = res.data.data.whetherShowCount; // 是否显示病例数
        this.isAutoAudit = res.data.data.isAutoAudit;
        this.isOcr = res.data.data.isOcr;
        this.submitRule = res.data.data.submitRule;
        this.singleTotal = res.data.data.singleTotal;
        if (res.data.data.attachs && res.data.data.attachs.length > 0) {
          this.attachs = res.data.data.attachs;
          this.attachs.map(item => {
            item.goPFillShow = true
            this.hideZipSee(item)
          });
        }
        if (res.data.data.caseForms && res.data.data.caseForms.length > 0) {
          this.caseFormListArr = res.data.data.caseForms;
        }
      } else {
        this.$message.error(res.data.message);
      }
      this.busId = res.data.data.busId;
    },

    See(formId) {
      // this.$router.push({
      //   path: "/activity/caseprview/" + this.id + '/' + formId,
      // });

      let routes = this.$router.resolve({
        path: "/activity/caseprview/" + this.id + '/' + formId,
      });
      window.open(routes.href, "_blank");
    },
    // 多阶段关联表单预览
    goseeCaseMany(caseCollectId, id) {
      let routes = this.$router.resolve({
        path: "/activity/caseprview/" + caseCollectId+ '/' + id,
      });
      window.sessionStorage.setItem('caseAll', JSON.stringify('0'))
      window.open(routes.href, "_blank");
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.caseDetail .wrap {
  margin-left: 20px;
  margin-top: 20px;
}
.caseDetail .wrap .titles {
  display: inline-block;
  width: 130px;
  margin-right: 20px;
}
.caseDetail .area {
  width: 800px;
  min-height: 150px;
  max-height: auto;
  padding-top: 30px;
}
.formName {
  display: inline-block;
  width: 400px;
  height: 40px;
  background: #cccccc;
  line-height: 40px;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  overflow: hidden;
  margin-bottom: -14px;
}
.formNames {
  height: auto;
  position: relative;
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
  // height: 62px;
  width: 100%;
  line-height: 62px;
  border-bottom: 1px solid #ececec;
  padding-bottom: 10px;
}
.form-rt {
  width: 400px;
  height: 40px;
  margin: 20px 0;
  background: #cccccc;
  line-height: 40px;
  border-radius: 4px;
  font-size: 14px;
  color: black;
  overflow: hidden;
  margin-bottom: -14px;
}
.btns {
  position: absolute;
  left: 430px;
  top: 5px;
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
  background: $c-theme;
}
.multistage-title{
  clear: both;
  line-height: 1;
}
.multistage{
  clear: both;
  margin: 20px 20px 0 20px;
  line-height: 1;
}
</style>

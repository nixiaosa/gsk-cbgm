<template>
  <div class="casedetails">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="wrap">
      <div class="box-title">用户信息</div>
      <div class="box-img-top">
        <img v-if="userData.photo" :src="userData.photo" alt>
        <img v-else src="https://yibaiserver-1252497236.file.myqcloud.com/yibai/default_user_avatar.png" alt>
        <span class="name">姓名:{{ userData.name }}</span>
      </div>
    </div>
    <div class="wrap">
      <span class="titls">
        手机:<span>{{ userData.phone }}</span>
      </span>
      <span class="titls">
        性别:<span>{{ userData.sex }}</span>
      </span>
    </div>
    <div class="wrap">
      <span class="titls">
        省份:<span>{{ userData.province }}</span>
      </span>
      <span class="titls">
        城市:<span>{{ userData.city }}</span>
      </span>
      <span class="titls">
        区县:<span>{{ userData.county }}</span>
      </span>
    </div>
    <div class="wrap">
      <span class="titls">
        医院:<span>{{ userData.hospital }}</span>
      </span>
      <span class="titls">
        职称:<span>{{ userData.title }}</span>
      </span>
      <span class="titls">
        科室:<span>{{ userData.office }}</span>
      </span>
    </div>
    <div class="fg-line"></div>
    <div class="wrap">
      <div class="box-title">表单信息</div>
    </div>
    <div class="wrap">
      <span class="titls">
        活动名称:<span>{{ title }}</span>
      </span>
      <!-- <span class="titls">
        活动状态:<span>{{ this.states | getState }}</span>
      </span> -->
      <span v-if="caseFormType !== 'normal'" class="titls">
        表单类型:<span>多阶段表单</span>
      </span>
       <span v-else class="titls">
        表单类型:<span>普通表单</span>
      </span>
    </div>
    <div class="wrap" v-if="caseType !== 3">
      <span v-if="caseFormType !== 'normal'" class="titls">
        表单阶段级别:<span>{{ this.rank | getRank }}</span>
      </span>
      <span v-if="caseFormType !== 'normal'" class="titls">
        表单阶段:<span>{{ this.caseFormStageName }}</span>
      </span>
    </div>
    <div class="fg-line"></div>
    <div class="wrap">
      <div class="box-title">病例信息</div>
    </div>
    <div class="wrap">
      <span class="titls">
        病例活动:<span>{{ caseCollectName }}</span>
      </span>
      <span class="titls">
        病例名称:<span>{{ title }}</span>
      </span>
    </div>
    <div class="wrap" v-if="caseType === 0 || caseType === 3">
      <span class="titls" style="width:100%">
        表单名称:<span>{{fromName}}</span>
        <span @click="See(0)" class="listBtn">查看</span>
      </span>
      
    </div>
    <div class="wrap userBoxRightList">
      <span class="titls" style="width:100%" v-if="caseType === 0" >
        识别次数:
        <span class="ocr" v-if="caseType === 0 && isOcr ==1">OCR识别成功数：<em>{{ocrSuccess}}</em>次</span>
        <span class="ocr" v-if="caseType === 0 && isOcr ==1">OCR识别失败数：<em>{{ocrFail}}</em>次</span>
        <!-- <span @click="See(0)" class="listBtn">查看</span> -->
      </span>
      <ul v-if="caseType === 1" class="titls" style="width:100%">
        <li v-for="(item,index) in attachList" :key="index">
          <span style="margin-right:10px">{{item.fileName}}</span>
          <span
            v-if="item.goPFillShow"
            @click="goPFill(item.fileUrl)"
            class="listBtn"
          >查看</span>
          <a :href="item.fileUrl" class="listBtn">下载</a>
        </li>
      </ul>
    </div>
    <div class="wrap">
      <span class="titls" style="width:350px">
        是否作为优秀病例展示:
        <el-switch
        v-model="isShow"
        on-color="#13ce66"
        off-color="#eee"
        @change="change"
        :disabled="isDisabled"
      ></el-switch>
      <span>不公开显示/公开显示</span>  
      </span>
      <span class="titls">
        上传时间:<span>{{commitTime | formatDate }}</span>
      </span>      
    </div>
    <div class="wrap descr" v-if="description">
      <div class="titls" style="width:100%">
        病历简介:<div class="area intro-content ql-editor" v-html="description"></div>
      </div>
    </div>
    <div class="fg-line"></div>
    <div class="wrap" v-if="hasTask === 1">
     <div class="box-title">审核信息</div>
    </div>
      <div v-if="caseType!==3">
        <div  v-for="(item,index) in wrapauditFlowStatesList" :key="index">
      <div class="box-title-sec">第{{ index+1 }}次提交</div>
      <ul v-for="item in auditFlowStatesList[index]" :key="item.id" class="audit-ul">
        <li v-if="hasTask === 1" class="first">{{item.currentRank | number}}级审核状态: 
          <span v-html="$options.filters.statusHtml(item.approveStates)"></span>
        </li>
        <li v-if="hasTask === 1">审核人: {{item.approveUserName}}</li>
        <li v-if="auditTask.isComment">
          审核评分: 
          <span v-if="item.starScore && auditTask.commentType === 1">{{item.starScore}}星</span>
          <span v-else-if="item.starScore && auditTask.commentType === 0">{{item.starScore}}分</span>
          <span v-else>一一</span>
        </li>
        <li v-if="auditTask.isComment">
          审核人点评：
          <span v-if="item.comment" class="fn-lh">{{item.comment}}</span>
          <span v-else>一一</span>
        </li>
        <li v-if="hasTask === 1">
          审核时间: 
          <span v-html="$options.filters.formatDate(item.approveTime)"></span>
        </li>
        <li v-if="auditTask.isRemark && hasTask === 1" class="last">
          审核备注: 
          <span v-if="item.remark" class="fn-lh">{{item.remark}}</span>
          <span v-else>一一</span>
        </li>
        <li v-if="item.approveStates === 2" class="last">
          拒绝原因:
          <span>{{ item.reason }}</span>
        </li>
      </ul>
    </div>
      </div>

    <div v-if="caseType===3 && childFills!== undefined && childFills!== null && childFills.length>0">
      <case-many-stage @fatherComment="assignSpecialComment" :professorRemark="professorRemark" :firstData="childFills" :auditTask="auditTask" :hasTask="hasTask" :states="states"></case-many-stage>
    </div>

    <div class="fg-line"></div>
    <div class="wrap">
     <div v-if="professorRemark && caseType !==3 " class="box-title">专家点评 <el-button  type="info" size="small" @click="assignSpecialComment">分配专家点评</el-button></div>
    </div>
    <el-table v-if="caseType!==3" :data="professorRemarks" border>
        <el-table-column label="序号" width="70">
            <template slot-scope="scope">
              <span>{{ scope.$index+1 }}</span>
            </template>
          </el-table-column>
        <el-table-column label="专家">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科室">
          <template slot-scope="scope">
            <span>{{ scope.row.office }}</span>
          </template>
        </el-table-column>
        <el-table-column label="医院">
          <template slot-scope="scope">
            <span>{{ scope.row.hospital }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专家评分">
          <template slot-scope="scope">
            <span>{{ scope.row.scoreStr }}</span>
          </template>
        </el-table-column>
        <el-table-column label="专家点评">
          <template slot-scope="scope">
            <span>{{ scope.row.content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="点评时间">
          <template slot-scope="scope">
            <span>{{ scope.row.remarkTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
      </el-table>
    
    <el-dialog :lock-scroll="false" :show-close="false" :visible.sync="dialogVisible" width="50%">
      <div style="text-align: center">
        <img style="max-width: 100%" :src="imgUrl" alt>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配专家点评" :visible.sync="specialComment">
      <el-form :inline="true" :model="formSpecialUpload" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formSpecialUpload.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" size="small" @click="specialSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tabDataSpecial" @selection-change="handleSelectionChangeDialog" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="医生姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
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
        <el-table-column label="医院名称">
          <template slot-scope="scope">
            <span>{{ scope.row.hospital }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科室">
          <template slot-scope="scope">
            <span>{{ scope.row.office }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:20px"></div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page.sync="currentSpecialPage"
        @current-change="handleSpecialCurrentChange"
        :total="totalSpecial"
      ></el-pagination>
      <el-form :model="formMessage" style="width:100%; margin-top:20px">
        <el-form-item label="发送短信通知：" prop="keyword">
          <el-radio v-model="formMessage.radio" label="1">发送</el-radio>
          <el-radio v-model="formMessage.radio" label="0">不发送</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specialComment = false">取 消</el-button>
        <el-button type="primary" @click="onCopy()">分享点评链接</el-button>
        <el-button type="primary" @click="remarkLimitSave()">保存当前页设置</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import caseManyStage from "./case-many-stage.vue"
export default {
  name: "casedetails",
  components: {
    HeaderContent, caseManyStage
  },
  data() {
    return {
      auditTask: {},
      auditFlowStatesList: [], // 审核级别当前信息
      wrapauditFlowStatesList: [],  
      dialogVisible: false,
      imgUrl: "",
      headerTitle: "病例征集管理-->活动详情-->病例详情",
      opertions: ["返回"],
      value1: true,
      id: this.$route.params.id,
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
      isOcr: null,
      formId: null,
      ocrSuccess: null,
      ocrFail: null,
      caseCollectName: "",
      // goPFillShow: true
      caseFormType: "",
      caseFormStageName: "",
      rank:"",
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
      childFills: []
    };
  },
  filters: {
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
        case 4:
          return `<span>已撤回</span>`;
        case undefined:
          return `<span>一一</span>`;
        default:
          return `<span>${item}</span>`;
      }
    },
    getState(state) {
        switch (state) {
          case 0:
            return '未发布'
          case 1:
            return '未开始'
          case 2:
            return '进行中'
          case 3:
            return '已结束'
          case 4:
            return '已过期'
          case -1:
            return '未发布'
        }
      },
    getRank(val) {
        switch (val) {
          case 1:
            return '一级别'
          case 2:
            return '二级别'
          case 3:
            return '三级别'
          case 4:
            return '四级别'
          case 5:
            return '五级别'
        }
      }
  },
  async mounted() {
    await this.casedetail();
    // this.getOcr();
  },
  methods: {
    specialSearch() {
      this.professorList(1);
      this.currentSpecialPage = 1;
    },
    remarkLimitSave: async function(pageNum) {
      // 保存专家点评当前页设置
      let params = {};
      params = {
        busId: this.busId,
        notifySms: this.formMessage.radio,
        caseFillIds: this.caseFillIds ,
        userIds: this.userIds
      };
      const res = await http.post(api.remarkLimitSave, params);
      if (res.data.code === 0) {
        this.$message.success("保存成功");
        this.specialComment = false;
        this.caseFillIds ;
        this.userIds = [];
      } else {
        this.$message.error(res.data.message);
      }
    },
    assignSpecialComment(caseid) {
      // console.log(id)
      this.specialComment = true;
      this.formMessage.radio = "0";
      this.caseFillIds = [caseid]
      this.currentSpecialPage = 1;
      this.professorList(1);
    },
    professorList: async function(pageNum,) {
      // 专家点评列表
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        params: {
          busId: this.busId,
          name: this.formSpecialUpload.name
        }
      };
      const res = await http.post(api.professorList, params);
      if (res.data.code === 0) {
        this.tabDataSpecial = res.data.data.data;
        this.totalSpecial = res.data.data.total;
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
    },
    onCopy(e) {
      let url = "https://" + window.location.host + "/#/my/myCaseRemark";
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
      oInput.remove();
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
      const res = await http.get(api.casedetail + this.id);
      if (res.data.code === 0) {
        this.auditTask = res.data.data.auditTask;
        if(res.data.data.auditFlowStatesList){
          this.wrapauditFlowStatesList = res.data.data.auditFlowStatesList;
          this.wrapauditFlowStatesList.map((item,index) => {
            this.auditFlowStatesList.push(item);
          })
        }
        
        this.caseCollectId = res.data.data.caseCollectId;
        this.professorRemark = res.data.data.professorRemark;
        this.professorRemarks = res.data.data.professorRemarks;
        this.busId = res.data.data.busId;
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
        this.isOcr = res.data.data.isOcr;
        this.caseCollectName = res.data.data.caseCollectName;
        this.ocrSuccess = res.data.data.ocrSuccessCount;
        this.ocrFail = res.data.data.ocrFailCount;
        this.caseFormType = res.data.data.caseFormType;
        this.caseFormStageName = res.data.data.caseFormStageName;
        this.rank = res.data.data.rank;
        this.childFills = res.data.data.childFills
        if (res.data.data.formId) {
          this.formId = res.data.data.formId;
        }
        if (res.data.data.attachList && res.data.data.attachList.length > 0) {
          this.attachList = res.data.data.attachList;
          // console.log(this.attachList)
          this.attachList.map(item => {
            item.goPFillShow = true;
            this.hideZipSee(item);
            // console.log(item)
          });
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
      window.sessionStorage.setItem('caseAll', JSON.stringify('1'))
      let routes = this.$router.resolve({
        path: `/activity/caseprview/${this.id}/${this.caseCollectId}?name=${
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
  // margin-top: 20px;
  text-align: center;
  /*float: right;*/
  margin-left: 10px;
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
  // margin-left: 20px;
}
.casedetails .wrap p{
  margin: 0;
  padding: 0;
  line-height: 1;
}
.casedetails .wrap .titls {
  display: inline-block;
  min-width: 200px;
  font-size: 14px;
}
.casedetails .wrap .titls span{
  margin: 0 5px;
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
  // min-height: 150px;
  min-height: 50px;
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
  // transform: translateY(3px);
  margin-left: 10px;
  color: $c-theme;
  font-weight: bold;
  font-size: 14px;
}
.ocr em {
  font-style: normal;
  font-size: 16px;
}
.caseName {
  margin-left: 20px;
}

.audit-ul{
  // width: 1200px;
  width: 100%;
  clear: both;
  list-style: none;
  padding: 0;
  overflow: hidden;
  border: 1px solid #F5F5F5;
  li{
    float: left;
    padding: 14px 10px;
    width: 20%;
    font-size: 14px;
  }
  .first{
    background: #F5F5F5;
  }
  .last{
    clear: both;
    width: 100%;
  }
}
.box-title{
  clear: both;
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 10px;
}
.box-title-sec{
  position: relative;
  clear: both;
  font-size: 14px;
  color: #333333;
  font-weight: bold;
  line-height: 1;
  margin: 20px 0 10px 10px;
}
.box-title-sec::before{
  content: ".";
  position: absolute;
  left: -10px;
  top:-4px;
  color: #333333;
}
.box-img-top{
  width: 188px;
  clear: both;
  border-radius: 5px;
  border: 1px solid #F5F5F5;
  padding: 10px;
  box-sizing: border-box;
  img{
    width: 50px;
    height: 50px;
    margin-right: 20px;
    border-radius: 50%; 
  }
  .name{
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    margin-top: 18px;
  }
}
.fg-line{
  clear: both;
  height: 10px;
  background: #F5F5F5;
}
</style>

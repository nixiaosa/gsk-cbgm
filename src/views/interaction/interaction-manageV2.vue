<!-- 视频评论 -->
<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-form class="demo-form-inline">
      <el-form-item label="评论设置：" v-if="activeName === 'comment'">
        <el-radio-group v-model="auditStatus" @change="getExamineValue()">
          <el-radio :label="1">需要审核评论内容才能发布</el-radio>
          <el-radio :label="0">不需要审核评论内容直接发布</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-form ref="form" :inline="true" label-width="80px">
      <el-form-item>
        <el-button type="primary" @click="batchShield">批量屏蔽</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="exportList">导出</el-button>
      </el-form-item>
    </el-form>
    <el-tabs v-model="activeName" @tab-click="tabChange">
      <el-tab-pane label="评论管理" name="comment">
        <div v-show="comment.forbiddenHidden" class="forbiddenBox">
          <span>评论功能：</span>
          <el-button
            size="small"
            :type="comment.isForbidden ? 'primary' : 'danger'"
            @click="forbidden"
          >{{forbiddenTitle}}</el-button>
        </div>
        <div class="identity-tab">
          <el-button
            v-for="(item,index) in identityArr"
            :key="item.identity"
            @click="identityClick(item,index)"
            type="cancel"
            size="small"
            :class="{'identityActive':identityActive==index}"
          >{{ item.titlename }}</el-button>
        </div>
        <InteractionTable
          v-if="identity === 1"
          :data="comment.tableData"
          :tableConfig="commentDoctorConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 2"
          :data="comment.tableData"
          :tableConfig="commentDrugStoreConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 3"
          :data="comment.tableData"
          :tableConfig="commentCompanyConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 4"
          :data="comment.tableData"
          :tableConfig="commentPatientConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 5"
          :data="comment.tableData"
          :tableConfig="commentVisitorConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 6"
          :data="comment.tableData"
          :tableConfig="commentNurseConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 7"
          :data="comment.tableData"
          :tableConfig="commentPharmacistConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 8"
          :data="comment.tableData"
          :tableConfig="commentTechnicianConfig"
          :isIM="0"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
        ></InteractionTable>
      </el-tab-pane>
      <el-tab-pane label="聊天管理" name="im">
        <div v-show="im.forbiddenHidden" class="forbiddenBox">
          <span>聊天功能：</span>
          <el-button
            size="small"
            :type="im.isForbidden ? 'primary' : 'danger'"
            @click="forbidden"
          >{{forbiddenTitle}}</el-button>
        </div>

        <!-- <div class="identity-tab">
          <el-button
            v-for="(item,index) in identityArr"
            :key="item.identity"
            @click="identityClick(item,index)"
            type="cancel"
            size="small"
            :class="{'identityActive':identityActive==index}"
          >{{ item.titlename }}</el-button>
        </div> -->
        <InteractionTable
          v-if="identity === 1"
          :data="im.tableData"
          :tableConfig="imDoctorConfig"
          :isIM="1"
          ref="im"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 2"
          :data="im.tableData"
          :tableConfig="imDrugStoreConfig"
          :isIM="1"
          ref="im"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 3"
          :data="im.tableData"
          :tableConfig="imCompanyConfig"
          :isIM="1"
          ref="im"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 4"
          :data="im.tableData"
          :tableConfig="imPatientConfig"
          :isIM="1"
          ref="im"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
        ></InteractionTable>
        <InteractionTable
          v-if="identity === 5"
          :data="im.tableData"
          :tableConfig="imVisitorConfig"
          :isIM="1"
          ref="im"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
        ></InteractionTable>
      </el-tab-pane>
    </el-tabs>
    <el-pagination
      layout="prev, pager, next"
      :current-page="pageIndex"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";
import HeaderContent from "@/components/header-content";
import InteractionTable from "./InteractionTable";
// import config from "./interaction_manage.json";
import config from "./interaction_identity.json";
// import IdentityTable from "@/views/business/class/base/identityTable";
export default {
  name: "modelist",
  computed: {
    ...mapGetters(["userAuths"]),
    headerTitle() {
      return this.activeName == "im" ? "聊天管理" : "评论管理";
    },
    forbiddenTitle() {
      if (this.activeName === "im") {
        return this.im.isForbidden ? "启用" : "停用";
      } else {
        return this.comment.isForbidden ? "启用" : "停用";
      }
    }
  },
  data() {
    return {
      activeName: "comment",
      id: "",
      commentId: "",
      auditStatus: 1, // 1=需要审核评论内容才能发布;0=不需要审核评论内容直接发布
      haveStatus: 0,
      stopStatus: 1, // 1=无;0=有
      args: {
        groupId: 0,
        commentId: this.$route.params.commentId
      },
      im: {
        isForbidden: false,
        forbiddenHidden: true,
        config: config.im,
        tableData: [],
        selection: [],
        api: {
          getList: api.iMList,
          changeShieldStatus: api.iMShieldChange,
          getGroupId: api.iMGetGroupId,
          forbidden: api.imForbidden,
          forbiddenStatus: api.imForbiddenStatus
        }
      },
      comment: {
        isForbidden: false,
        forbiddenHidden: true,
        config: config.comment,
        tableData: [],
        selection: [],
        api: {
          getList: api.djbCommentList,
          changeShieldStatus: api.commentShieldChange,
          setTopStatus: api.commentSetTop,
          // forbidden: api.commentForbidden,
          forbidden: api.djbCommentForbidden,
          // forbidden: api.commentForbiddenStatus,
          forbiddenStatus: api.commentForbiddenStatus
        }
      },
      pageIndex: 1,
      total: 1,

      identityActive: 0,
      identityArr: [],
      identity: 1,
      fieldsTitleArr: [],
      fieldsValueArr: [],
      identityTableData: [],
      arrIndex: "",
      commentDoctorConfig: config.comment.doctorConfig, //医生身份
      commentCompanyConfig: config.comment.companyConfig, //企业身份
      commentDrugStoreConfig: config.comment.drugStoreConfig, //药店身份
      commentPatientConfig: config.comment.patientConfig, //患者身份
      commentVisitorConfig: config.comment.visitorConfig, //游客身份
      commentNurseConfig: config.comment.nurseConfig, //护士身份
      commentPharmacistConfig: config.comment.pharmacistConfig, //药师身份
      commentTechnicianConfig: config.comment.technicianConfig, //技师身份

      imDoctorConfig: config.im.doctorConfig, //医生身份
      imCompanyConfig: config.im.companyConfig, //企业身份
      imDrugStoreConfig: config.im.drugStoreConfig, //药店身份
      imPatientConfig: config.im.patientConfig, //患者身份
      imVisitorConfig: config.im.visitorConfig //游客身份
    };
  },
  async mounted() {
    // this.getPageStatus();
    // this.getList(1, this.activeName);
    await this.getIdentityList();
    this.forbiddenStatus();

  },
  methods: {
    identityClick(item, index) {
      this.identity = item.titleId;
      this.identityActive = index;
      this.handleCurrentChange(1);
    },
    getIdentityList: async function() {
      //获取身份列表
      var params = {};
      var res = await http.post(api.getQaIdentityList, params);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this.identity = this.identityArr[0].titleId;
        // console.log(this.identity)
        // console.log(this.identityArr)
      } else {
        this.$message.error(res.data.message);
      }
    },
    getExamineValue: async function() {
      // 评论是否需要审核
      let params = {
        id: this.id,
        commentId: this.commentId,
        auditStatus: this.auditStatus,
        haveStatus: null
      };
      let res = await this.$http.post(this.$api.djbCommentSet, params);
    },

    // 评论 启用停用状态 合并getPageStatus获取页面状态方法
    forbiddenStatus: async function() {
      if (this.activeName == "comment") {
        this.getPageStatus();
      } else if (this.activeName == "im") {
        let params = {
          busId: this.$route.params.commentId
        };
        let res = await this.$http.post(this.$api.imForbiddenStatus, params);
        let { code, data, message } = res.data;

        this.id = res.data.data.id;
        this.commentId = res.data.data.commentId;
        this.auditStatus = res.data.data.auditStatus;
        this.getList(this.pageIndex, this.activeName);
        this.im.isForbidden = !data.chatStatus;
        this.comment.isForbidden = !data.commentStatus;
        this.im.forbiddenHidden = data.chat;
        this.comment.forbiddenHidden = data.comment;
      }
    },

    forbidden: async function() {
      if (this.activeName == "comment") {
        let params = {
          id: this.id,
          stopStatus: this.stopStatus ? 0 : 1
        };
        let res = await this.$http.post(this.$api.djbCommentForbidden, params);
        let { code, message } = res.data;
        this.messageTips(code, message);
      } else if (this.activeName == "im") {
        let params = {
          busId: this.$route.params.commentId,
          commentStatus: this.comment.isForbidden ? 1 : 0,
          chatStatus: this.im.isForbidden ? 1 : 0
        };
        let res = await this.$http.post(this.$api.imForbidden, params);
        let { code, message } = res.data;
        this.messageTips(code, message);
      }
    },

    messageTips(code, message) {
      if (code === 0) {
        this[this.activeName].isForbidden = !this[this.activeName].isForbidden;
        this.stopStatus = this.stopStatus ? 0 : 1;
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },

    tabChange() {
      this.$refs.im.$refs.table.clearSelection();
      this.$refs.comment.$refs.table.clearSelection();
      this.pageIndex = 1;
      this.total = 0;

      this.identity = this.identityArr[0].titleId;
      this.identityActive = 0;

      this.forbiddenStatus();

    },
    selectionChange(rows) {
      this[this.activeName].selection = rows;
    },
    handleCurrentChange(val) {
      this.getList(val, this.activeName);
    },
    // 单条点击屏蔽状态切换
    shieldItemClick(item) {
      let { id, isShield } = item;
      this.changeShieldStatus([id], !isShield);
    },
    passClick: async function(item) {
      //审核通过
      let params = {
        id: item.id,
        auditStatus: 0
      };
      let res = await this.$http.post(this.$api.djbCommentAudit, params);
      this.getList(this.pageIndex, this.activeName);
    },

    refuseClick: async function(item) {
      //审核拒绝
      let params = {
        id: item.id,
        auditStatus: 2
      };
      let res = await this.$http.post(this.$api.djbCommentAudit, params);
      this.getList(this.pageIndex, this.activeName);
    },
    // 批量屏蔽
    batchShield() {
      if (this[this.activeName].selection.length < 1) {
        this.$message.error("请勾选需要屏蔽的消息");
        return;
      }
      let ids = this[this.activeName].selection.map(c => c.id);
      this.changeShieldStatus(ids, true);
    },
    // 屏蔽状态切换
    changeShieldStatus: async function(ids = [], isDeleted) {
      let params = {
        ids,
        // 评论管理API需要的 isdelete
        isdelete: isDeleted ? 1 : 0,
        // // 聊天管理API需要的 isDeleted
        isDeleted: isDeleted ? 1 : 0
      };

      let changeShieldStatusApi = this[this.activeName].api.changeShieldStatus;
      let res = await http.post(changeShieldStatusApi, params);
      if (res.data.code === 0) {
        this.getList(this.pageIndex, this.activeName);
      }
    },
    // 通过状态切换
    changePassStatus: async function(ids = [], isDeleted) {
      let params = {
        ids,
        // 评论管理API需要的 isdelete
        isdelete: isDeleted ? 1 : 0,
        // 聊天管理API需要的 isDeleted
        isDeleted: isDeleted ? 1 : 0
      };
      let changeShieldStatusApi = this[this.activeName].api.changeShieldStatus;
      let res = await http.post(changeShieldStatusApi, params);
      if (res.data.code === 0) {
        this.getCommentList(this.pageIndex);
      }
    },
    // 切换置顶状态
    async changeTopStatus(item) {
      let { id, isTop } = item;
      let params = {
        id
      };
      // 如果已存在置顶，添加参数取消置顶
      if (isTop) {
        params.operateType = "unTop";
      }
      let changeTopStatusApi = this[this.activeName].api.setTopStatus;
      let res = await http.post(changeTopStatusApi, params);
      if (res.data.code === 0) {
        this.getList(this.pageIndex, this.activeName);
      } else {
        this.$message.error(res.data.message);
      }
    },

    // 导出列表
    async exportList() {
      let getListApi = this[this.activeName].api.getList;
      let params = {
        operateType: "export",
        commentId: this.commentId,
        identityType: 1 // 身份导出，不传走老导出
      };

      if (this.activeName == "im") {
        let groupId = await this.getGroupId();
        // console.log("--------");
        // console.log(await this.getGroupId());
        if (groupId === 0) return; // 如果没有房间ID不需要提示错误信息  列表数据为空即可
        params.groupId = groupId;
      }

      let res = await http.post(getListApi, params);
      let { code, data } = res.data;
      if (code !== undefined && code === 0) {
        window.location.href = data;
      } else {
        this.$message.error(res.data.message);
      }
    },

    async getGroupId() {
      let id = this.args.groupId;
      // 聊天管理列表获取，需要使用busId获取groupId
      if (this.args.groupId === 0) {
        let busId = this.$route.params.commentId;
        let getGroupIdApi = this[this.activeName].api.getGroupId;
        let res = await http.post(getGroupIdApi, { busId });
        console.log(res);
        let { data, code } = res.data;
        if (code !== undefined && code == 0 && data) {
          id = data;
        } else {
          this.$message.error(res.data.message);
        }
      }
      return id;
    },
    // 获取列表所需参数
    getListArgs(pageIndex, pageSize = 10) {
      let params = {};
      if (pageIndex) {
        params = {
          pageNum: pageIndex,
          pageSize
        };
      }
      if (this.args.groupId && this.activeName == "im") {
        params.groupId = this.args.groupId;
      }
      if (this.args.commentId && this.activeName == "comment") {
        params.commentId = this.args.commentId;
      }
      return params;
    },

    getPageStatus: async function() {
      let params = {
        businessId: this.$route.params.businessId,
        sourceId: this.$route.params.id,
        busId: this.$route.params.commentId
      };
      if (this.args.groupId && this.activeName == "im") {
        params.groupId = this.args.groupId;
      }
      let res = await this.$http.post(this.$api.djbCommentBtn, params);
      this.id = res.data.data.id;
      this.commentId = res.data.data.commentId;
      this.auditStatus = res.data.data.auditStatus;

      this.stopStatus = res.data.data.stopStatus;
      this.comment.isForbidden = this.stopStatus;
      this.getList(this.pageIndex, this.activeName);
    },
    // 根据当前activeName发起请求，获取列表数据
    getList: async function(pageIndex, activeName) {
      if (activeName == "im") {
        let groupId = await this.getGroupId();
        if (groupId === 0) return; // 如果没有房间ID不需要提示错误信息  列表数据为空即可
        this.args.groupId = groupId;
      }
      let params = {
        pageSize: 10,
        pageNum: pageIndex,
        identity: this.identity
      };
      if (this.activeName == "im") {
        params.groupId = this.args.groupId;
      } else if (this.activeName == "comment") {
        params.commentId = this.commentId;
      }
      let getListApi = this[activeName].api.getList;
      let res = await http.post(getListApi, params);
      let { code, data } = res.data;
      if (code !== undefined && code === 0 && data != undefined) {
        this[activeName].tableData = data.list || [];
        // 统一后端N个API返回字段
        this[activeName].tableData = this[activeName].tableData.map(item => {
          item.isTop = 0;
          item.isShield = 0;
          if (item.isdelete !== undefined) {
            item.isShield = item.isdelete;
          }
          if (item.isDeleted !== undefined) {
            item.isShield = item.isDeleted;
          }
          if (item.top !== undefined) {
            item.isTop = item.top;
          }
          return item;
        });
        this.total = data.total;
        this.pageIndex = pageIndex;
      }
    }
  },
  components: {
    HeaderContent,
    InteractionTable
    // IdentityTable
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.forbiddenBox {
  padding-bottom: 20px;
  padding-top: 10px;
}
.forbiddenBox span {
  font-size: 14px;
}
::v-deep .el-form-item__label {
  width: 82px;
}
.forbidden-info {
  font-size: 14px;
  padding-left: 20px;
  color: #666;
}

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

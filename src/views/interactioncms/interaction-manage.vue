<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <el-form class="demo-form-inline">
      <el-form-item label="评论：" class="comment">
        <el-radio-group v-model="haveStatus" @change="getCommentValue()">
          <el-radio :label="0">有</el-radio>
          <el-radio :label="1">无</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="评论设置：">
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
    <el-tabs v-model="activeName">
      <el-tab-pane label="评论管理" name="comment">
        <div v-show="comment.forbiddenHidden" class="forbiddenBox">
          <span>评论功能：</span>
          <el-button
            size="small"
            :type="comment.isForbidden ? 'primary' : 'danger'"
            @click="forbidden"
          >{{forbiddenTitle}}</el-button>
          <span class="forbidden-info">点击后，所有人不能进行评论</span>
        </div>
        <InteractionTable
          :data="comment.tableData"
          :tableConfig="comment.config"
          ref="comment"
          @selectionChange="selectionChange"
          @shieldItemClick="shieldItemClick"
          @changeTopStatus="changeTopStatus"
          @passClick="passClick"
          @refuseClick="refuseClick"
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
import config from "./interaction_manage.json";
export default {
  name: "modelist",
  computed: {
    ...mapGetters(["userAuths"]),
    headerTitle() {
      return this.activeName == "im" ? "聊天管理" : "评论管理";
    },
    forbiddenTitle() {
      //   console.log(this.activeName);
      // return this.comment.isForbidden ? "启用" : "停用";
      return this.stopStatus == 1 ? "启用" : "停用";
    }
  },
  data() {
    return {
      activeName: "comment",
      id: "",
      commentId: "",
      auditStatus: 1, // 1=需要审核评论内容才能发布;0=不需要审核评论内容直接发布
      haveStatus: 0, // 1=无;0=有
      stopStatus: 1,
      args: {
        groupId: 0,
        commentId: this.$route.params.commentId
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
          forbidden: api.commentForbidden,
          forbiddenStatus: api.commentForbiddenStatus
        }
      },
      pageIndex: 1,
      total: 1
    };
  },
  async mounted() {
    this.getPageStatus();
    // this.getCommentList();
    // this.getList(1, this.activeName);
    // this.forbiddenStatus();
  },
  methods: {
    getCommentValue: async function() {
      // 评论有无
      let params = {
        id: this.id,
        commentId: this.commentId,
        auditStatus: this.auditStatus,
        haveStatus: this.haveStatus
      };
      // console.log(this.haveStatus)
      let res = await this.$http.post(this.$api.djbCommentSet, params);
    },

    getExamineValue: async function() {
      // 评论是否需要审核
      let params = {
        id: this.id,
        commentId: this.commentId,
        auditStatus: this.auditStatus,
        haveStatus: this.haveStatus
      };
      let res = await this.$http.post(this.$api.djbCommentSet, params);
    },

    // 评论 启用停用状态
    forbiddenStatus: async function() {
      let params = {
        businessId: 1000,
        sourceId: this.$route.query.sourceId
      };
      let res = await this.$http.post(this.$api.djbCommentBtn, params);

      this.stopStatus = res.data.data.stopStatus;

      this.comment.isForbidden = this.stopStatus;
      // this.comment.forbiddenHidden = this.stopStatus;

      this.getCommentList();
    },

    // 评论 启用停用
    forbidden: async function() {
      let params = {
        id: this.id,
        stopStatus: this.stopStatus ? 0 : 1
      };
      let res = await this.$http.post(this.$api.djbCommentForbidden, params);
      // let forbiddenApi = this[this.activeName].api.forbidden;
      let { code, message } = res.data;
      if (code === 0) {
        this[this.activeName].isForbidden = !this[this.activeName].isForbidden;
        this.stopStatus = this.stopStatus ? 0 : 1;
        this.$message.success(message);
      } else {
        this.$message.error(message);
      }
    },

    selectionChange(rows) {
      this[this.activeName].selection = rows;
    },
    handleCurrentChange(val) {
      this.getCommentList(val);
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
      this.getCommentList(this.pageIndex);
    },

    refuseClick: async function(item) {
      //审核拒绝
      let params = {
        id: item.id,
        auditStatus: 2
      };
      let res = await this.$http.post(this.$api.djbCommentAudit, params);
      this.getCommentList(this.pageIndex);
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
        isdelete: isDeleted ? 1 : 0
        // // 聊天管理API需要的 isDeleted
        // isDeleted: isDeleted ? 1 : 0
      };

      let changeShieldStatusApi = this[this.activeName].api.changeShieldStatus;
      let res = await http.post(changeShieldStatusApi, params);
      if (res.data.code === 0) {
        this.getCommentList(this.pageIndex);
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
        this.getCommentList(this.pageIndex);
      } else {
        this.$message.error(res.data.message);
      }
    },
    // 导出列表
    async exportList() {
      let getListApi = this[this.activeName].api.getList;
      let params = {
        operateType: "export",
        commentId: this.commentId
      };

      let res = await http.post(getListApi, params);
      let { code, data } = res.data;
      if (code !== undefined && code === 0) {
        // window.location.href = data.message;
        window.location.href = data;
      } else {
        this.$message.error(res.data.message)
      }
    },
    async getGroupId() {
      let id = this.args.groupId;
      // 聊天管理列表获取，需要使用busId获取groupId
      if (this.args.groupId === 0) {
        let busId = this.$route.params.id;
        let getGroupIdApi = this[this.activeName].api.getGroupId;
        let res = await http.post(getGroupIdApi, { busId });
        let { data, code } = res.data;
        if (code !== undefined && code == 0 && data) {
          id = data;
        } else {
          this.$message.error(res.data.message)
        }
      }
      return id;
    },

    getPageStatus: async function() {
      let params = {
        businessId: 1000,
        sourceId: this.$route.query.sourceId
      };
      let res = await this.$http.post(this.$api.djbCommentBtn, params);
      this.id = res.data.data.id;
      this.commentId = res.data.data.commentId;
      this.auditStatus = res.data.data.auditStatus;
      this.haveStatus = res.data.data.haveStatus;
      this.stopStatus = res.data.data.stopStatus;
      // this.getCommentList();
      this.comment.isForbidden = this.stopStatus;
      this.getCommentList();
    },

    getCommentList: async function(pageIndex) {
      //获取评论列表
      let params = {
        pageSize: 10,
        pageNum: pageIndex,
        commentId: this.commentId
      };
      let res = await this.$http.post(this.$api.djbCommentList, params);
      let { code, data } = res.data;
      if (code !== undefined && code === 0 && data != undefined) {
        this.comment.tableData = res.data.data.list || [];
        this.comment.tableData = this.comment.tableData.map(item => {
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
  }
};
</script>
<style lang="scss" scoped>
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
</style>

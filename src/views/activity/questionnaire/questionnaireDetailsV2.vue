<template>
  <div>
    <header-content @change="back" :opertions="['返回']" :title="headerTitle"/>
    <el-tabs v-model="activeName" @tab-click="tabsChange" type="border-card">
      <el-tab-pane label="问卷详情" name="detail">
        <questionnaire-detail :data="questionnaireData" v-if="activeName === 'detail'"/>
      </el-tab-pane>
      <el-tab-pane label="问题统计" name="topic">
        <questionnaire-topic :data="qaListData" v-if="activeName === 'topic'"/>
      </el-tab-pane>
      <el-tab-pane label="用户列表" name="userList">
        <questionnaire-user-list-v2
          :data="questionnaireData"
          :titleId="titleId"
          @change="userListChange"
          @identityClick="identityClick"
          v-if="activeName === 'userList'"
        />
      </el-tab-pane>
      <el-tab-pane label="统计分析" name="exportList">
        <questionnaire-export
          v-if="activeName === 'exportList' && exportList.data"
          :data="exportList.data"
          @change="exportChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import HeaderContent from "@/components/header-content";
import QuestionnaireUserListV2 from "./components/QuestionnaireUserListV2";
import QuestionnaireDetail from "./components/QuestionnaireDetail";
import QuestionnaireTopic from "./components/QuestionnaireTopic";
import QuestionnaireExport from "@/views/activity/questionnaire/components/QuestionnaireExport";


export default {
  name: "QuestionnaireDetails",
  components: {
    HeaderContent,
    QuestionnaireDetail,
    QuestionnaireTopic,
    QuestionnaireUserListV2,
    QuestionnaireExport
  },
  data() {
    return {
      activeName: "detail",
      headerTitle: "调研问卷管理-->问卷详情",
      questionnaireData: {},
      qaListData: [],
      detail: {
        api: {
          first: this.$api.questionnaireEdit + this.$route.params.id
        }
      },
      topic: {
        api: {
          first: this.$api.questionnaireItem + this.$route.params.id
        }
      },
      userList: {
        api: {
          first: this.$api.questionnaireUserList,
          params: {
            questionId: this.$route.params.id,
            phone: null,
            pageSize: 10,
            pageNum: 1,
            identity: 1
          }
        }
      },
      exportList: {
        data: null,
        api: {
          first: this.$api.questionnaireExportList + this.$route.params.id,
          params: {
            pageSize: 10,
            pageNum: 1
          }
        }
      },
      titleId: 1
    };
  },
  
  mounted() {
    this.getQuestionnaireEdit();
    // this.getIdentityList();
  },
  methods: {
    identityClick(item, index) {
      // console.log(item)
      // console.log(index)
      this.userList.api.params.identity = item.titleId;
      this.titleId = item.titleId;
      // this.questionnaireUserList()
    },
    exportChange(item) {
      if (item.type && item.type === "EXPORT") {
        // 导出用户列表
        this.questionnaireUserExport();
      } else {
        this[this.activeName].api.params = item;
        this.questionnaireExportList();
      }
    },
    userListChange(item) {
      // 用户列表触发
      // 分页切换 及 搜索
      this.userList.api.params.pageNum = item.num;
      this.userList.api.params.phone = item.phone;
      this.questionnaireUserList();
    },
    tabsChange() {
      // tab切换触发
      switch (this.activeName) {
        case "userList":
          this.questionnaireUserList();
          break;
        case "exportList":
          this.questionnaireExportList();
          break;
        default:
          this.getQuestionnaireEdit();
      }
    },
    questionnaireUserExport() {
      // 用户列表导出
      http
        .post(this.$api.questionnaireUserExport, {
          questionId: this.$route.params.id,
          identityType: 1 // 身份导出，不传走老导出
        })
        .then(res => {
          let { code, data, message } = res.data;
          if (code === 0) {
            this.$message.success("申请成功");
            this.questionnaireExportList();
          } else {
            this.$message.error(message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getQuestionnaireEdit() {
      // 获取问卷详情
      let api = this[this.activeName].api.first;
      let apiHost = this.$http.post;
      apiHost(api).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          if (this.activeName === "topic") {
            this.qaListData = data;
          } else {
            this.questionnaireData = data;
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    questionnaireUserList() {
      // 获取用户列表
      let api = this[this.activeName].api.first;
      let params = this[this.activeName].api.params;
      http.post(api, params).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          this.questionnaireData = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    questionnaireExportList() {
      // 获取申请导出用户列表
      let api = this[this.activeName].api.first;
      let params = this[this.activeName].api.params;
      http.post(api, params).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          data.list.map(item => {
            if (item.status === 1) {
              item.DOWNLOAD = true;
            } else {
              item.WAIT = true;
            }
          });
          this[this.activeName].data = data;
        } else {
          this.$message.error(message);
        }
      });
    },
    back() {
      this.$router.push({ path: "/activity/questionnaireManage" });
    }
  }
};
</script>

<style scoped>
</style>

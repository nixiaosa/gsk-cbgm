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
        <questionnaire-user-list
          :data="questionnaireData"
          @change="userListChange"
          v-if="activeName === 'userList' && identity === 0"
        />
        <questionnaire-user-list-v2
          :data="questionnaireData"
          :titleId="titleId"
          :identityArr="identityArr"
          @change="userListChange"
          @identityClick="identityClick"
          v-if="activeName === 'userList' && identity === 1"
        />
      </el-tab-pane>
      <el-tab-pane label="统计分析" name="exportList">
        <questionnaire-export
          v-if="activeName === 'exportList' && exportList.data"
          :data="exportList.data"
          @change="exportChange"
          @selectChange="selectChange"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import HeaderContent from "@/components/header-content";
import QuestionnaireUserList from "./components/QuestionnaireUserList";
import QuestionnaireUserListV2 from "./components/QuestionnaireUserListV2";
import QuestionnaireDetail from "./components/QuestionnaireDetail";
import QuestionnaireTopic from "./components/QuestionnaireTopic";
import QuestionnaireExport from "@/views/activity/questionnaire/components/QuestionnaireExport";
import { mapGetters } from "vuex";

export default {
  name: "QuestionnaireDetails",
  components: {
    HeaderContent,
    QuestionnaireDetail,
    QuestionnaireTopic,
    QuestionnaireUserList,
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
            // identityArr: [],
            identity: null,
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
      titleId: 1,
      identityArr: [],
      statesType: 0
    };
  },
  computed: {
    ...mapGetters(["identity"])
  },
  async mounted() {
    this.getQuestionnaireEdit();
    if(this.$route.query.active === "exportList"){
      this.activeName = "exportList"
      this.questionnaireExportList();
    }
  },
  methods: {
    identityClick(item, index) {
      // console.log(item)
      // console.log(index)
      this.userList.api.params.identity = item.titleId;
      this.titleId = item.titleId;
      // this.questionnaireUserList()
    },
    getIdentityList: async function() {
      //获取身份列表
      var params = {};
      var res = await http.post(api.getQaIdentityList,params);
      if (res.data.code === 0) {
        this.identityArr = res.data.data;
        this[this.activeName].api.params.identity = this.identityArr[0].titleId;
        // console.log(this[this.activeName].api.params.identity)
        this.questionnaireUserList();
      } else {
        this.$message.error(res.data.message);
      }
    },
    selectChange(item){
      // console.log(item)
      this.statesType = item
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
          if(this.identity === 0){
            this.questionnaireUserList();
          }else if(this.identity === 1){
            this.getIdentityList();
          } 
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
      if(this.identity === 0){
        http
        .post(this.$api.questionnaireUserExportWithoutId, {
          questionId: this.$route.params.id,
          finishType: this.statesType
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
      }else if(this.identity === 1){
         http
        .post(this.$api.questionnaireUserExport, {
          questionId: this.$route.params.id,
          finishType: this.statesType,
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
      }



      
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

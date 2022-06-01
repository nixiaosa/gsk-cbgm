<template>
  <div>
    <el-table :data="data" ref="table" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column v-if="data.length>0 && hasSelect" type="selection" fixed="left"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableConfig"
        :key="index"
        :label="item.label"
        :min-width="item.minWidth"
      >
        <template slot-scope="scope">
          <span v-if="item.type && item.type === 'compeleteTime'">{{scope.row[item.prop]|formatDate}}</span>
          <span v-else-if="item.type && item.type === 'applyStatus'">{{scope.row[item.prop]|applyStatus}}</span>
          <span v-else-if="item.type && item.type === 'auditSt'">{{scope.row[item.prop]|auditSt}}</span>
          <span v-else-if="item.type && item.type === 'createTime'">{{scope.row[item.prop]|formatDate}}</span>
          <span v-else-if="item.type && item.type === 'lastTime'">{{scope.row[item.prop]|formatDate}}</span>
          <span v-else-if="item.type && item.type === 'isdelete'">{{scope.row[item.prop]|isdelete}}</span>
          <span v-else-if="item.type && item.type === 'viewTime'">{{scope.row[item.prop]|tomin}}</span>
          <span v-else-if="item.type && item.type === 'viewTime2'">{{scope.row[item.prop]|tomin3}}</span>
          <span v-else-if="item.type && item.type === 'sex'">{{scope.row[item.prop]|sex}}</span>
          <span v-else-if="item.type && item.type === 'identity'">{{scope.row[item.prop]|identity}}</span>
          <span v-else-if="item.type && item.type === 'verifyCode'">{{scope.row[item.prop]|verifyCode}}</span>
          <span v-else-if="item.type && item.type === 'drawTime'">{{scope.row[item.prop]|formatDate2}}</span>
          <span v-else-if="item.type && item.type === 'useTime'">{{scope.row[item.prop]|tomin2}}</span>
          <span v-else-if="item.type && item.type === 'numRank'">{{((currentData - 1)*10) + scope.$index + 1}}</span>
          <div v-else-if="item.type && item.type === 'action'">
            <el-button
              size="mini"
              type="info"
              @click="handleEdit(scope.row)"
              v-if="scope.row.isdelete === 0"
            >编辑</el-button>
            <el-button
              size="mini"
              type="info"
              @click="payCheck(scope.row)"
              v-if="scope.row.isdelete === 0"
            >充值</el-button>
            <el-button
              size="mini"
              type="info"
              @click="payPoint(scope.row)"
              v-if="scope.row.isdelete === 0"
            >充医币</el-button>
            <el-button
              size="mini"
              type="info"
              @click="payPoint2(scope.row)"
              v-if="scope.row.isdelete === 0"
            >充积分</el-button>
            <el-button
              size="mini"
              type="danger"
              @click="isResetPassword(scope.row.userId)"
              v-if="scope.row.isdelete === 0"
            >重置密码</el-button>
            <el-button
              size="mini"
              type="danger"
              :loading="isLoding"
              @click="handleDelete(scope.row.id)"
            >启停</el-button>
          </div>

          <div v-else-if="item.type && item.type === 'lotteryAction'">
            <el-button
              type="primary"
              size="mini"
              @click="pass(scope.row)"
              :disabled="scope.row.verifyCode === 2 || scope.row.verifyCode === 1 || scope.row.verifyCode === 0"
            >通过</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="refuse(scope.row)"
              :disabled="scope.row.verifyCode === 2 || scope.row.verifyCode === 1 || scope.row.verifyCode === 0"
              v-if="scope.row.verifyCode !== 2"
            >拒绝</el-button>
            <el-button
              type="primary"
              size="mini"
              @click="reason(scope.row)"
              v-if="scope.row.verifyCode === 2"
            >拒绝原因</el-button>
          </div>

          <div v-else-if="item.type && item.type === 'applyAction'"><!-- 视频申请管理操作列-->
            <div v-if="scope.row.last2 !== undefined || scope.row.last2 != null">
                <el-button
                type="primary"
                size="mini"
                @click="applyPass(scope.row)"
                v-if="scope.row.last2 === 1 && isAutoAudit === 0"
              >通过</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="applyRefuse(scope.row)"
                v-if="scope.row.last2 === 1 && isAutoAudit === 0"
              >拒绝</el-button>
              <span v-if="scope.row.last2 !== 1">一一</span>
            </div>
            <div v-else>
                <el-button
                type="primary"
                size="mini"
                @click="applyPass(scope.row)"
                v-if="scope.row.status === 1 && isAutoAudit === 0"
              >通过</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="applyRefuse(scope.row)"
                v-if="scope.row.status === 1 && isAutoAudit === 0"
              >拒绝</el-button>
              <span v-if="scope.row.status !== 1">一一</span>
            </div>
          </div>
          <div v-else-if="item.type && item.type === 'applyActionActivity'"><!-- 活动申请管理操作列-->
            <div>
                <el-button
                type="primary"
                size="mini"
                @click="applyPass(scope.row)"
                v-if="scope.row.auditSt == 0 && isAutoAudit === 0"
              >通过</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="applyRefuse(scope.row)"
                v-if="scope.row.auditSt == 0 && isAutoAudit === 0"
              >拒绝</el-button>
              <span v-if="scope.row.auditSt != 0">一一</span>
            </div>
          </div>
          <div v-else-if="item.type && item.type === 'applyActionVote'"><!-- 活动申请管理操作列-->
            <div>
                <el-button
                type="primary"
                size="mini"
                @click="applyPass(scope.row)"
                v-if="scope.row.status == 0 && isAutoAudit === 0"
              >通过</el-button>
              <el-button
                type="danger"
                size="mini"
                @click="applyRefuse(scope.row)"
                v-if="scope.row.status == 0 && isAutoAudit === 0"
              >拒绝</el-button>
              <span v-if="scope.row.status != 0">一一</span>
            </div>
          </div>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { formatDate } from "@/common/data";
export default {
  name: "IdentityTable",
  props: {
    // data: {},
    data: {
      type: Array,
      default: () => []
    },
    tableConfig: {
      type: Array,
      default: () => ([])
    },
    lodingHidden: Number,
    hasSelect: Boolean,
    currentData: Number,
    isAutoAudit: Number
  },
  data() {
    return {
      isLoding: false
    }
  },
  watch: {
    lodingHidden() {
      this.isLoding = false
    }
  },
  methods: {
    handleSelectionChange(rows) {
      this.$emit("handleSelectionChange", rows);
      // this.multipleSelection = val;
      console.log(this.isAutoAudit)
    },
    applyPass(rows){
      this.$emit("applyPass", rows);
    },
    applyRefuse(rows){
      this.$emit("applyRefuse", rows);
    },
    reason(rows){
      this.$emit("reason", rows);
    },
    refuse(rows){
      this.$emit("refuse", rows);
    },
    pass(rows){
      this.$emit("pass", rows);
    },
    handleEdit(rows){
      this.$emit("handleEdit", rows);
    },
    payCheck(rows){
      this.$emit("payCheck", rows);
    },
    payPoint(rows){
      this.$emit("payPoint", rows);
    },
    payPoint2(rows){
      this.$emit("payPoint2", rows);
    },
    isResetPassword(rows){
      this.$emit("isResetPassword", rows);
    },
    handleDelete(rows){
      this.isLoding = true
      this.$emit("handleDelete", rows);
    },

    /*
     * 把消息转换成 HTML
     * */
    convertMsgtoHtml(msg) {
      var html = "";
      var elems, elem, type, content;
      if (msg) {
        elems = JSON.parse(msg);
      } else {
        elems = msg.elems; // 获取消息包含的元素数组
      }
      for (var i in elems) {
        elem = elems[i];
        if (msg) {
          type = elem.msgType;
          content = elem.msgContent;
        } else {
          type = elem.type; // 获取元素类型
          content = elem.content; // 获取元素对象
        }
        switch (type) {
          case "TIMTextElem":
            html += content.text;
            break;
          case "TIMFaceElem":
            html += this.convertFaceMsgToHtml(content);
            break;
          case "TIMCustomElem":
            return;
          default:
            console.log("未知消息元素类型: elemType=" + type);
            break;
        }
      }
      return html;
    },
    convertFaceMsgToHtml(content) {
      let _index = content.index - 0 + 1;
      let url = `http://yibaifiles-1252497236.file.myqcloud.com/emoji2/${_index}.png`;
      return `<img width='24' height='24' style='vertical-align:middle' src='${url}'/>`;
    }
  },
  mounted() {},
  filters: {
    isdelete(val){
      switch (val) {
        case 0:
          return "正常";
        case 1:
          return "停用";
        default:
          return "";
      }
    },
    verifyCode(val){
      switch (val) {
        case 0:
          return "不需审核";
        case -1:
          return "未审核";
        case 1:
          return "通过";
        case 2:
          return "拒绝";
        default:
          return "";
      }
    },
    identity(val){
      switch (val) {
        case 1:
          return "医生";
        case 2:
          return "药店人员";
        case 3:
          return "企业人员";
        case 4:
          return "患者";
        case 5:
          return "游客";
        case 6:
          return "护士";
        case 7:
          return "药师";
        case 8:
          return "技师";
        default:
          return "";
      }
    },
    sex(val) {
      switch (val) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return "";
      }
    },
    applyStatus(v) {
      switch (v) {
        case 1:
          return "未审核";
        case 2:
          return "审核未通过";
        case 3:
          return "审核通过";
        case 4:
          return "已失效";
      }
    },
    auditSt(v){
      switch (v) {
        case 0:
          return "未审核";
        case 1:
          return "审核通过";
        case 2:
          return "审核拒绝";
      }
    },
    formatDate(time) {
      if (!time) return time;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    formatDate2(time) {
      if (!time) return time;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm:ss");
    },
    tomin(value) {
      let result = parseInt(value / 60);
      if (value % 60 > 0) result += 1;
      return result;
    },
    tomin2(value) {
      var theTime = parseInt(value)// 秒
      var theTime1 = 0// 分
      var theTime2 = 0// 小时
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      var result = '' + parseInt(theTime) + '秒'
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      return result;
    },
    tomin3(value) {
      let result = (value / 60).toFixed(1);
      return result;
    },
    nameornick(nickname, name) {
      if (name) {
        return name;
      } else if (nickname) {
        return nickname;
      } else {
        return "";
      }
    },
    isping(num) {
      if (!num) {
        return "显示";
      } else {
        return "屏蔽";
      }
    },
    isTop(num) {
      if (num) {
        return "置顶";
      }
      return "取消置顶";
    },
  }
};
</script>
<style scoped>
</style>

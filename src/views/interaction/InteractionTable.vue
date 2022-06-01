<template>
  <div>
    <el-table :data="data" ref="table" style="width: 100%" @selection-change="selectionChange">
      <el-table-column v-if="data.length>0" type="selection" fixed="left"></el-table-column>
      <el-table-column
        v-for="(item, index) in tableConfig"
        :key="index"
        :label="item.label"
        :fixed="data.length > 0 && item.type==='action'?'right': false"
        :min-width="item.minWidth"
      >
        <template slot-scope="scope">
          <div v-if="item.type && item.type === 'action'">
            <el-button
              v-if="$listeners.passClick && scope.row.auditStatus === 1"
              @click="passClick(scope.row)"
              type="primary"
              size="small"
            >通过</el-button>
            <el-button
              v-if="$listeners.refuseClick && scope.row.auditStatus === 1"
              @click="refuseClick(scope.row)"
              type="danger"
              size="small"
            >拒绝</el-button>
            <el-button
              v-if="$listeners.refuseClick && scope.row.auditStatus === 2"
              @click="refuseClick(scope.row)"
              type="warning"
              disabled
              size="small"
            >已拒绝</el-button>
            <el-button
              v-if="$listeners.shieldItemClick && scope.row.auditStatus === 0 || isIM === 1"
              @click="shieldItemClick(scope.row)"
              :type="scope.row.isShield ? 'primary': 'danger' "
              size="small"
            >{{!scope.row.isShield|isping}}</el-button>

            <el-button
              v-if="$listeners.changeTopStatus && scope.row.auditStatus === 0 && scope.row.parentId === '0'"
              @click="changeTopStatus(scope.row)"
              :type="scope.row.isTop ? 'danger': 'primary'"
              size="small"
            >{{(!scope.row.isTop)|isTop}}</el-button>
          </div>
          <span v-else-if="item.type && item.type === 'deleted'">{{scope.row.isShield|isping}}</span>
          <span
            v-else-if="item.type && item.type === 'dateTime'"
          >{{scope.row[item.prop]|formatDate}}</span>
          <span v-else-if="item.type==='message'" v-html="convertMsgtoHtml(scope.row[item.prop])"></span>
          <span v-else>{{scope.row[item.prop]}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { formatDate } from "@/common/data";
export default {
  name: "InteractionTable",
  props: {
    data: {},
    tableConfig: {
      type: Array,
      default: []
    },
    isIM: Number// 1:聊天 2: 评论
  },
  methods: {
    selectionChange(rows) {
      this.$emit("selectionChange", rows);
    },
    shieldItemClick(rows) {
      this.$emit("shieldItemClick", rows);
    },
    changeTopStatus(rows) {
      this.$emit("changeTopStatus", rows);
    },
    passClick(rows) {
      this.$emit("passClick", rows);
    },
    refuseClick(rows) {
      this.$emit("refuseClick", rows);
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
    formatDate(time) {
      if (!time) return time;
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
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
    }
  }
};
</script>
<style scoped>
</style>

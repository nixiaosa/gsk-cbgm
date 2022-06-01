<!--
 * @Author: Chance Lau
 * @Date: 2022-03-09 12:54:09
 * @LastEditors: Chance Lau
 * @LastEditTime: 2022-03-09 13:31:24
 * @Description: file content
-->
<template>
    <el-dialog
        class="import-result-dialog"
        title="导入结果"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="closeDialog"
        :close-on-click-modal="false"
        :modal-append-to-body="false"
        :lock-scroll="false">
      <div class="info-container">
        <p>导入成功：<span>{{ importInfo.successCount }}</span>条数据；导入失败：<span>{{ importInfo.failCount }}</span>条数据；导入跳过：<span>{{ importInfo.jumpCount }}</span>条数据</p>
        <p v-if="importInfo.failCount > 0">导入失败原因：<span>数据格式错误</span></p>
        <p v-if="importInfo.jumpCount > 0">导入跳过原因：<span>用户已有权限参与会议或活动</span></p>
        <div v-if="importInfo.failCount > 0">
          <p>导入失败手机号码：</p>
          <p v-for="failPhone in importInfo.failList"><span>{{ failPhone }}</span></p>
        </div>
        <div v-if="importInfo.jumpCount > 0">
          <p>导入跳过手机号码：</p>
          <p v-for="jumpPhone in importInfo.jumpList"><span>{{ jumpPhone }}</span></p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="closeDialog">确 定</el-button>
      </span>
    </el-dialog>
</template>

<script>
export default {
  name: "ImportResultDialog",
  data() {
    return {
      dialogVisible: false,
      importInfo: {}
    }
  },
  methods: {
    getInfo(val) {
      this.dialogVisible = true
      this.importInfo = val
    },
    closeDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

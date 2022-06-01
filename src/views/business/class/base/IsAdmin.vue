<template>
  <div>
    <el-dialog
        title="你想要做什么操作？"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-input placeholder="请输入" v-model="password" show-password @keypress.native.enter="check"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
  </span>
    </el-dialog>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  props: {
    correctionMenu: Boolean
  },
  data() {
    return {
      correctionMd5: '4d62f8b5fd1df43c593ac6f151a35deb',
      password: '',
      dialogVisible: false
    }
  },
  created: function () {
    if (this.$route.query.admin === null) {
      this.dialogVisible = true
    }
  },
  methods: {
    check() {
      let params = {
        isCorrection: false
      }
      if (md5(this.password) === this.correctionMd5) {
        // 先校验租户是否有此功能
        if (this.correctionMenu) {
          this.$message.success('已打开，做你想做的吧。')
          params.isCorrection = true
          this.dialogVisible = false
        } else {
          this.$message.error('租户没有添加此菜单')
        }
      }
      this.$emit('change', params)
    }
  }
}
</script>

<template>
  <div>
    <el-dialog
      title="修改编号"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label="合约编号">
          <el-input clearable v-model="contractId" placeholder="请输合约编号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="updateCode">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: 'ContractUpdateCode',
    props: {
      id: {
        type: Number,
        default: 0
      },
      code: {
        type: String,
        delault: ''
      },
      codeList: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        contractId: this.code,
        dialogVisible: true
      }
    },
    methods: {
      updateCode() {
        if (this.contractId === '') {
          this.$message.error('请输入编号')
          return
        }
        // 更新编号
        let params = {
          contractId: this.contractId,
          id: this.id
        }
        http.post(api.modifyContractCode, params).then(res => {
          let {code, message} = res.data
          if (code === 0) {
            this.$message.success('修改成功')
            this.$emit('change', true)
          } else {
            this.$message.error(message)
            this.$emit('change', false)
          }
        })
      },
      handleClose() {
        this.$emit('change', false)
      }
    }
  }
</script>

<style scoped>
.dialog-footer {
  text-align: center;
}
</style>

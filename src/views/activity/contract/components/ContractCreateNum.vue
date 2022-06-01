<template>
  <div>
    <el-dialog
      :title="dialog"
      :visible.sync="dialogVisible"
      size="tiny"
      :before-close="handleClose">
      <!--编号列表-->
      <el-table
        v-show="!isCreate"
        :data="tableNumDatas"
        border
      >
        <el-table-column label="合约编号名称">
          <template slot-scope="scope">
            <span>{{ scope.row.code }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人">
          <template slot-scope="scope">
            <span>{{ scope.row.createBy }}</span>
          </template>
        </el-table-column>
      </el-table>
      <!--输入编号-->
      <el-form v-show="isCreate" :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input style="width: 400px" v-model="form.code" placeholder="请输入编号名称"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createCode(false)">取 消</el-button>
        <el-button type="primary" @click="createCode(true)">创建编号</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: 'ContractCreateNum',
    props: {
      tableNumDatas: {
        type: Array,
        default: () => []
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
    },
    data() {
      return {
        dialog: '编号管理',
        isCreate: false,
        form: {
          code: ''
        },
        tabList: this.tableNumDatas,
        dialogVisible: true
      }
    },
    mounted() {
    },
    methods: {
      createCode(v) {
        if (v) {
          if (this.isCreate) {
            this.addContractCode(v)
          } else {
            this.isCreate = true
            this.dialog = '创建编号'
          }
        } else {
          this.$emit('change', v)
        }

      },
      addContractCode(v) {
        // 添加合同编号
        http.post(api.addContractCode, {code: this.form.code}).then(res => {
          let {code, message} = res.data
          if (code === 0) {
            this.$message.success('添加成功')
            this.isCreate = false
            this.$emit('change', v)
          } else {
            this.$message.error(message)
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

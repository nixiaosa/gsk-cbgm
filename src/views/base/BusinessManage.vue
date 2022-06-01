<template>
  <div>
    <header-component title="业务列表"/>
    <table-list :data="listData" name="BusinessManage" @change="edit"/>
<!--    编辑对话框-->
    <div>
      <el-dialog width="30%" title="编辑" :show-close="false" :close-on-click-modal="false" :visible.sync="editVisible">
        <el-form :model="editForm">
          <el-form-item label="活动名称：" label-width="100px">
            <span style="font-size: 14px; font-weight: bold">{{editForm.name}}</span>
          </el-form-item>
          <el-form-item label="业务别名：" label-width="100px">
            <el-input :maxlength="6" v-model="editForm.alias" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editHidden">取 消</el-button>
          <el-button type="primary" @click="upload">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
    import HeaderComponent from "@/components/header-content/HeaderComponent";
    import TableList from "@/components/table-content/TableList";
    export default {
      name: 'BusinessManage',
      components: {TableList, HeaderComponent},
      data() {
        return {
          editForm: {
            name: '',
            alias: '', // 别名
            id: '',
          },
          editVisible: false,
          listData: null
        }
      },
      mounted() {
        this.getList()
      },
      methods: {
        editHidden() {
          // 隐藏编辑对话框
          this.editVisible = false
          this.editForm.assign = ''
        },
        edit(item) {
          // 编辑按钮触发
          let { name, alias, id } = item
          this.editForm = {
            name,
            alias,
            id,
          }
            this.editVisible = true
        },
        upload() {
          // 编辑别名
          this.$http.post(this.$api.businessList.update, this.editForm).then(res => {
            let {code, message} = res.data
            if (code === 0) {
              this.$message.success('编辑成功')
              this.getList()
              this.editVisible = false
            } else {
              this.$message.error(message)
            }
          })
        },
        getList() {
          // 获取业务列表
          this.$http.get(this.$api.businessList.list).then(res => {
            let {code, data, message} = res.data
            if (code === 0) {
              this.listData = data
            } else {
              this.$message.error(message)
            }
          })
        }
      }
    }
</script>

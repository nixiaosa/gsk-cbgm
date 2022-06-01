<template>
  <div class="service-control">
    <header-content :title="headerTitle"></header-content>
    <div class="role-container">
      <div>
        <div class="add-role" style="width:400px" v-if="userAuths.back_auth_add">
          <div class="role-input">
            <el-input placeholder="输入权限名称" v-model="authname">
              <template slot="prepend">添加权限</template>
            </el-input>
          </div>
          <div class="add">
            <el-button type="info" @click.native.prevent="createauth()">立即添加</el-button>
          </div>
        </div>
        <div class="role-create">
          <el-table
            :data="options"
            stripe
            border
            class="role-table">
              <el-table-column
                label="序号"
                type="index"
                width="100">
              </el-table-column>
              <el-table-column
                label="权限名称"
                style="text-align:center">
                <template slot-scope="scope">
                  <span>{{ scope.row.label }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="249">
              <template slot-scope="scope">
                <el-button
                  v-if="scope.row.label!=='管理员权限' && userAuths.front_user_update"
                  type="info"
                  size="small"
                  @click="openEditAuth(scope.row)">编辑</el-button>
                <el-button
                  v-if="scope.row.label!=='管理员权限' && userAuths.back_auth_authorize"
                  type="info"
                  size="small"
                  @click="handleEdit(scope.row)">资源授权</el-button>
                <el-button
                  v-if="scope.row.label!=='管理员权限' && userAuths.back_auth_delete"
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 编辑权限 -->
    <el-dialog
        title="编辑权限"
        :visible.sync="dialogVisible"
        :show-close="false"
        size="tiny">
        <el-form :model="authForm" label-width="100px" ref="columnForm">
          <el-form-item label="权限名称">
            <el-input v-model="authForm.name" placeholder="输入权限名称"></el-input>
            <!-- <div>*名称长度不超过6个字</div> -->
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editAuth()">保 存</el-button>
        </span>
      </el-dialog>
  </div>
</template>
<script>
  import http from '@/utils/fetch'
  import userapi from '@/api/tenantInfoSave'
  import { mapGetters } from 'vuex'
  import HeaderContent from '@/components/header-content'
export default {
    components:{
      HeaderContent
    },
    computed: {
      ...mapGetters([
        'userAuths'
      ])
    },
    data() {
      return {
        data2: [],
        headerTitle: '后台权限管理',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        authname: '',
        form: {
          name: '',
          url: '',
          id: ''
        },
        show: false,
        go: { index: -1 },
        checkNum: [],
        options: [],
        value: '',
        dialogVisible: false,
        authForm: {
          name: '',
          id: ''
        }
      }
    },
    methods: {
      openEditAuth(row) {
        this.authForm = {
          name: row.label,
          id: row.id
        }
        this.dialogVisible = true
      },
      async editAuth() {
        if (this.authForm.name) {
          var params = {
            label: this.authForm.name,
            id: this.authForm.id
          }
          const res = await http.post(userapi.updateAuth, params)
          if (res.data.code === 0) {
            this.$alert('更新权限成功', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.getAuthList()
                this.dialogVisible = false
              }
            })
          } else {
            this.$message.error(res.data.message)
          }
        } else {
          this.$alert('请先输入权限名称', '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      handleEdit(row) {
        console.log(row)
        this.$router.push({ path: `authvsmenu/${row.label}/${row.id}` })
      },
      cancecreate() {
        this.authname = ''
      },
      deleteAuth: async function(id) {
        var params = {
          id: id
        }
        const res = await http.post(userapi.delAuth, params)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getAuthList()
        }
      },
      handleDelete: async function(row) {
        this.$confirm('此操作将永久删除权限——' + row.label + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteAuth(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      createauth: async function() {
        if (this.authname) {
          var params = {
            label: this.authname
          }
          const res = await http.post(userapi.addAuth, params)
          if (res.data.code === 0) {
            this.$alert('添加权限成功', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.authname = ''
                this.getAuthList()
              }
            })
          } else {
            this.$message.error(res.data.message)
          }
        } else {
          this.$alert('请先输入权限名称', '提示', {
            confirmButtonText: '确定'
          })
        }
      },
      getAuthList: async function() {
        var params = {
        }
        const res = await http.post(userapi.getAuthListtwo, params)
        if (res.data.code === 0) {
          var array = res.data.data
          var optionsarr = []
          for (var i = 0; i < array.length; i++) {
            var obj = {}
            obj.id = array[i].id
            obj.label = array[i].label
            optionsarr.push(obj)
          }
          this.options = optionsarr
        }
      }
    },
    mounted() {
      this.getAuthList()
    }
  }
</script>
<style>
.service-control{
  margin-left:50px;
  margin-top:20px;
}
.edit-item{
  width:300px;
  border:1px solid red;
}
.role-table td{
  text-align: center;
}
.role-table th{
  text-align: center;
}
.role-container-header {
  width:600px;
  height: 50px;
  line-height: 50px;
  display: flex;
  justify-content: space-between;
}
.add-role{
  margin-bottom:20px;
  display:flex;
}
.add-role .role-input{
  flex:1;
  position: relative;
}
.role-input .el-input{
  width: 100% !important;
}
.add-role .add,.add-role .cance{
  margin-left:10px
}
</style>

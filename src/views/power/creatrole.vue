<template>
  <div class="service-control">
    <header-content :title="headerTitle"></header-content>
    <p class="red-tips" v-if="userAuths.back_role_add">请在输入框内填写角色名称并添加，添加成功点击“角色授权”按钮勾选角色权限</p>
    <div class="role-container">
      <div>
        <div class="add-role" style="width:400px" v-if="userAuths.back_role_add">
          <div class="role-input">
            <el-input placeholder="输入角色名称" v-model="rolename">
              <template slot="prepend">添加角色</template>
            </el-input>
          </div>
          <div class="add">
            <el-button type="info" @click.native.prevent="createrole()">立即添加</el-button>
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
                  v-if="scope.row.label!=='平台管理员' && userAuths.back_role_update"
                  size="small"
                  type="info"
                  @click="openEditRole(scope.row)">编辑</el-button>
                <el-button
                  v-if="scope.row.label!=='平台管理员' && userAuths.back_role_authorize"
                  size="small"
                  type="info"
                  @click="handleEdit(scope.row)">角色授权</el-button>
                <el-button
                  v-if="scope.row.label!=='平台管理员' && userAuths.back_role_delete"
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div style="color:red;font-size: 12px;margin-top: 10px;">*注意:删除角色时,如果角色下存在关联用户，无法删除！</div>
        </div>
      </div>
    </div>

    <!-- 编辑权限 -->
    <el-dialog
      title="编辑角色"
      :visible.sync="dialogVisible"
      :show-close="false"
      size="tiny">
      <el-form :model="roleForm" label-width="100px" ref="columnForm">
        <el-form-item label="权限名称">
          <el-input v-model="roleForm.name" placeholder="输入权限名称"></el-input>
          <!-- <div>*名称长度不超过6个字</div> -->
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRole()">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 角色关联权限 -->
    <el-dialog
      title="角色授权"
      :visible.sync="dialogVisible1"
      :show-close="false"
      size="tiny">
      <el-form :model="authForm" label-width="100px" ref="columnForm">
        <el-form-item label="角色名称">
          <el-input v-model="authForm.name" placeholder="输入角色名称" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="权限选择">
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in authList" :label="item.id" :key="item.id">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
        <el-button type="primary" @click="roleAndAuth()">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import http from '@/utils/fetch'
  import userapi from '@/api/tenantInfoSave'
  import HeaderContent from '@/components/header-content'
  import { mapGetters } from 'vuex'
export default {
    components: {
      HeaderContent
    },
    computed: {
      ...mapGetters([
        'userAuths'
      ])
    },
    data() {
      return {
        headerTitle: '后台角色管理',
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        rolename: '',
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
        dialogVisible1: false,
        roleForm: {
          name: '',
          id: ''
        },
        authForm: {
          name: '',
          id: ''
        },
        authList: [],
        checkList: []
      }
    },
    methods: {
      openEditRole(row) {
        this.roleForm = {
          name: row.label,
          id: row.id
        }
        this.dialogVisible = true
      },
      async editRole() {
        if (this.roleForm.name) {
          var params = {
            label: this.roleForm.name,
            id: this.roleForm.id
          }
          const res = await http.post(userapi.updateRole, params)
          if (res.data.code === 0) {
            this.$alert('更新角色成功', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.getRoleList()
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
        this.checkList = []
        this.authForm.name = row.label
        this.authForm.id = row.id
        this.authOfRole(row.id)
        this.dialogVisible1 = true
      },
      async authOfRole(id) {
        var params = {
          id: id
        }
        const res = await http.post(userapi.authOfRole, params)
        console.log(res.data.data)
        if (res.data.code === 0) {
          this.checkList = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      cancecreate() {
        this.rolename = ''
      },
      deleterole: async function(id) {
        var params = {
          id: id
        }
        const res = await http.post(userapi.delrole, params)
        if (res.data.code === 0) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getRoleList()
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleDelete: async function(row) {
        this.$confirm('此操作将永久删除角色——' + row.label + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleterole(row.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      },
      createrole: async function() {
        if (this.rolename) {
          var params = {
            label: this.rolename
          }
          const res = await http.post(userapi.addrole, params)
          if (res.data.code === 0) {
            this.$alert('添加角色成功', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.rolename = ''
                this.getRoleList()
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
      getRoleList: async function() {
        var params = {
        }
        const res = await http.post(userapi.getRoleList, params)
        if (res.data.code === 0) {
          var array = res.data.data.list
          var optionsarr = []
          for (var i = 0; i < array.length; i++) {
            var obj = {}
            obj.id = array[i].id
            obj.label = array[i].label
            optionsarr.push(obj)
          }
          this.options = optionsarr
        }
      },
      getAuthList: async function() {
        var params = {
        }
        const res = await http.post(userapi.getAuthListtwo, params)
        if (res.data.code === 0) {
          this.authList = res.data.data
        }
      },
      async roleAndAuth() {
        console.log(this.checkList.length)
        if (this.checkList.length === 0) {
          this.$alert('请先选择需要关联的权限', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              return false
            }
          })
        } else {
          var params = {
            roleId: this.authForm.id,
            authIdList: this.checkList
          }
          const res = await http.post(userapi.roleAndAuth, params)
          if (res.data.code === 0) {
            this.$alert('角色授权成功', '提示', {
              confirmButtonText: '确定',
              callback: () => {
                this.dialogVisible1 = false
              }
            })
          } else {
            this.$message.error(res.data.message)
          }
        }
      }
    },
    mounted() {
      this.getRoleList()
      this.getAuthList()
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
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
  display: flex;
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

.red-tips {
  color: red;
  font-size: 12px;
  background-color: $c-theme3 !important;
  padding: 14px 24px;
} 
</style>

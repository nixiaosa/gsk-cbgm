<template>
  <div class="tenementList">
    <header-content :title="headerTitle"></header-content>
    <div class="tenementBox">
      <el-tree
        :data="data2"
        :props="defaultProps"
        empty-text="暂无身份组织"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
        :render-content="renderContent">
      </el-tree>
    </div>
    <!--添加栏目弹框-->
      <el-dialog
        :title="dialogName"
        :close-on-click-modal="false"
        :visible.sync="dialogVisible"
        :show-close="false"
        size="tiny">
        <el-form :model="form" label-width="100px" ref="columnForm">
          <el-form-item :label="addContent">
            <el-input v-model="form.name" :placeholder="addPlaceholder"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="identityAdd()" v-show="!form.id">保 存</el-button>
          <el-button type="primary" @click="identityUpdate()" v-show="form.id">保 存</el-button>
        </span>
      </el-dialog>
      <!--添加栏目弹框结束-->
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import userapi from '@/api/tenantInfoSave'
  import { mapGetters } from 'vuex'
  import HeaderContent from '@/components/header-content'
  let id = 1000

  export default {
    components: {
      HeaderContent
    },
    computed: {
      ...mapGetters([
        'userAuths',
        'plattitle'
      ])
    },
    data() {
      return {
        headerTitle: '身份组织架构图',
        dialogVisible: false,
        addContent: '身份组织名称',
        addPlaceholder: '输入身份组织名称',
        data2: [
          {
            id: '',
            recommend: 1,
            name: this.plattitle,
            company: true,
            order: 1,
            isdelete: 0,
            childRole: []
          }],
        dialogName: '编辑身份组织',
        defaultProps: {
          children: 'childRole',
          label: 'name'
        },
        form: {
          id: '',
          name: '',
          level: 1,
          parentId: 0,
          sort: 0
        }
      }
    },
    mounted() {
      this.getIdentityTree()
    },
    methods: {
      append(store, data) {
        store.append({ id: id++, label: 'testtest', children: [] }, data)
      },

      remove(store, data) {
        store.remove(data)
      },
      getIdentityTree: async function() {
        var res = await http.post(userapi.identityTree)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.data2[0].name = this.plattitle
          this.data2[0].childRole = res.data.data
        }
      },
      addChildOne() {
        this.form = {
          id: '',
          name: '',
          level: 1,
          parentId: 0,
          sort: 0
        }
        this.dialogVisible = true
      },
      addChildTwo(data) {
        this.form = {
          id: '',
          name: '',
          level: data.level + 1,
          parentId: data.id,
          sort: 0
        }
        this.dialogVisible = true
      },
      editChild(data) {
        this.form = {
          id: data.id,
          name: data.name,
          level: data.level,
          parentId: data.parentId,
          sort: 0
        }
        this.dialogVisible = true
      },
      recommend: async function(id, state) {
        var params = {
          id: id,
          recommend: state === 0 ? 1 : 0
        }
        var res = await http.post(this.$api.columnUpdate, params)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.$message.success('设置成功')
          this.columnList() // 获取栏目列表
          this.dialogVisible = false
        }
      },
      stopColumn: async function(id, state) {
        var params = {
          id: id,
          isdelete: state === 0 ? 1 : 0
        }
        var res = await http.post(this.$api.columnUpdate, params)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.$message.success('设置成功')
          this.columnList() // 获取栏目列表
          this.dialogVisible = false
        }
      },
      renderContent(h, { node, data }) {
        var auth = this.userAuths.front_identity_add
        var editAuth = this.userAuths.front_identity_update
        var delAuth = this.userAuths.front_identity_delete
        var icon = data.company ? (<icon-svg icon-class='company'></icon-svg>) : (<icon-svg icon-class='member'></icon-svg>)
        if (node.level === 1) {
          return (
          <span class='el-tree-node-span'>
            <span>
              {icon}
              <span style='margin-left:10px'>{data.name}</span>
            </span>
            { auth ? <span style='float: feft; margin-left: 40px'>
                <el-button size='mini' type='primary' on-click={ () => this.addChildOne() }>新增组织</el-button>
              </span>
            : ''}
          </span>)
        } else {
          return (
          <span class='el-tree-node-span'>
            <span>
              {icon}
              <span style='margin-left:10px'>{data.name}</span>
            </span>
            <span style='float: feft; margin-left: 40px'>
            { editAuth ? <el-button size='mini' on-click={ () => this.editChild(data) }>编辑</el-button>
            : '' }
            { auth ? <el-button size='mini' type='primary' on-click={ () => this.addChildTwo(data) }>新增组织</el-button>
            : '' }
            { delAuth ? <el-button size='mini' type='danger' on-click={ () => this.deteleChild(data) }>删除组织</el-button>
            : '' }
            </span>

          </span>)
        }
      },
      deteleChild(data) {
        this.$confirm('此操作将删除身份组织' + data.name + ', 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deteleChildTwo(data.id)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除身份'
          })
        })
      },
      deteleChildTwo: async function(id) {
        var params = {
          id: id
        }
        var res = await http.post(userapi.identityDelete, params)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.$message.success('删除成功')
          this.getIdentityTree() // 获取栏目列表
        }
      },
      identityUpdate() {
        if (this.form.name === '') {
          this.$message.error('请填写身份组织名称')
          return false
        }
        // this.columnSave()
        this.identityUpdateOne()
      },
      identityAdd() {
        if (this.form.name === '') {
          this.$message.error('请填写身份组织名称')
          return false
        }
        this.identityAddOne()
      },
      identityUpdateOne: async function() {
        var res = await http.post(userapi.identityUpdate, this.form)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.$message.success('更新成功')
          this.getIdentityTree() // 获取栏目列表
          this.dialogVisible = false
        }
      },
      identityAddOne: async function() {
        var res = await http.post(userapi.identityAdd, this.form)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.$message.success('添加成功')
          this.getIdentityTree() // 获取栏目列表
          this.dialogVisible = false
        }
      }
    }
  }
</script>
<style>
  .tenementList .el-tree-node__content {
    margin-bottom: 16px;
  }
  .el-tree-node-span {
    line-height: 28px;
  }
</style>
<style rel="stylesheet/scss" lang="scss">
  .header {
    width: 95%;
    margin: 0 20px 20px 0;
    padding: 20px 0 10px 0;
    border-bottom: 1px solid #ccc;
    text-align: right;
  }
  .header button {
    margin-right: 40px;
  }

</style>

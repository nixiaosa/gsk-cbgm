<template>
  <div class="tenementList---a">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick" v-if="userAuths.column_add"></header-content>
    <div class="tenementBox">
      <el-tree :data="data2" :props="defaultProps" empty-text="暂无栏目" node-key="id" default-expand-all :expand-on-click-node="false" :render-content="renderContent">
      </el-tree>
    </div>
    <!--添加栏目弹框-->
    <el-dialog :title="dialogName" :visible.sync="dialogVisible" :show-close="false" size="tiny">
      <el-form :model="form" label-width="100px" ref="columnForm">
        <el-form-item :label="addContent">
          <el-input v-model="form.columnName" :placeholder="addPlaceholder" style="width: 300px;"></el-input>
          <div v-if="addContent==='栏目名称'">*名称长度不超过4个字</div>
        </el-form-item>
        <el-form-item label="排序:">
          <el-input v-model="form.order" min="0" type="number" style="width:80px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addColumn()" v-show="columnId ===''">保 存</el-button>
        <el-button type="primary" @click="updateColumn()" v-show="columnId!==''">保 存</el-button>
      </span>
    </el-dialog>
    <!--添加栏目弹框结束-->
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { mapGetters } from 'vuex'
import HeaderContent from '@/components/header-content'
let id = 1000
export default {
  components: {
    HeaderContent
  },
  computed: {
    ...mapGetters(['userAuths'])
  },
  data() {
    return {
      dialogVisible: false,
      addContent: '栏目名称:',
      addPlaceholder: '输入栏目名称',
      columnName: '',
      headerTitle: '栏目管理',
      opertions: ['添加栏目'],
      data2: [],
      dialogName: '编辑栏目',
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      parentId: '',
      form: {
        columnName: '',
        order: 0
      },
      columnId: ''
    }
  },
  mounted() {
    this.columnList() // 获取栏目列表
  },
  methods: {
    append(store, data) {
      store.append({ id: id++, label: 'testtest', children: [] }, data)
    },
    headerClick() {
      this.dialogVisible = true
      this.addParent()
    },
    remove(store, data) {
      store.remove(data)
    },
    columnList: async function() {
      var res = await http.get(api.columnList)
      if (res.data.code !== 0) {
        this.$message.error(res.data.message)
      } else {
        var array = res.data.data
        this.data2 = []
        if (array.length > 0) {
          for (var i = 0; i < array.length; i++) {
            var obj = {}
            obj.id = array[i].parent.id
            obj.recommend = array[i].parent.recommend
            obj.label = array[i].parent.name
            obj.order = array[i].parent.sort
            obj.isdelete = array[i].parent.isdelete
            obj.children = []
            if (array[i].child.length > 0) {
              var array3 = array[i].child
              for (var j = 0; j < array3.length; j++) {
                var obj1 = {}
                obj1.id = array3[j].id
                obj1.label = array3[j].name
                obj1.recommend = array3[j].recommend
                obj1.children = []
                obj1.pOrder = array[i].parent.sort
                obj1.order = array3[j].sort
                obj1.isdelete = array3[j].isdelete
                obj.children.push(obj1)
              }
            }
            this.data2.push(obj)
          }
        }
      }
    },
    addParent() {
      this.addContent = '栏目名称'
      this.addPlaceholder = '输入栏目名称'
      this.parentId = ''
      this.form.order = 0
      this.form.columnName = ''
      this.columnId = ''
      this.dialogVisible = true
    },
    addChild(id) {
      this.addContent = '子栏目名称'
      this.addPlaceholder = '输入子栏目名称'
      this.parentId = id
      this.form.order = 0
      this.form.columnName = ''
      this.columnId = ''
      this.dialogVisible = true
    },
    editParent(id, order, name) {
      this.addContent = '栏目名称'
      this.addPlaceholder = '输入栏目名称'
      this.parentId = ''
      this.form.order = order
      this.form.columnName = name
      this.columnId = id
      this.dialogVisible = true
    },
    editChild(id, order, name) {
      this.addContent = '子栏目名称'
      this.addPlaceholder = '输入子栏目名称'
      this.parentId = ''
      this.form.order = order
      this.form.columnName = name
      this.columnId = id
      this.dialogVisible = true
    },
    recommend: async function(id, state) {
      var params = {
        id: id,
        recommend: state === 0 ? 1 : 0
      }
      var res = await http.post(api.columnUpdate, params)
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
      var res = await http.post(api.columnUpdate, params)
      if (res.data.code !== 0) {
        this.$message.error(res.data.message)
      } else {
        this.$message.success('设置成功')
        this.columnList() // 获取栏目列表
        this.dialogVisible = false
      }
    },
    renderContent(h, { node, data, store }) {
      var rr = '未推荐'
      var ss = '已启用'
      if (data.recommend === 1) {
        rr = '已推荐'
      }
      if (data.isdelete === 1) {
        ss = '已停用'
      }
      var auth = this.userAuths.article_list_action
      if (node.level === 1) {
        return (
          <span class='expanded---span'>
            <span>
              <span style="display: inline-block;min-width:120px;margin-left:10px">{data.label}</span>
              <el-button size="mini" style="margin-left:10px">
                {rr}
              </el-button>
              <el-button size="mini" style="margin-left:10px">
               {ss}
              </el-button>
              <el-button size="mini" style="margin-left:10px">
                {data.order}
              </el-button>
            </span>
            {auth ? (
              <span style="float: feft; margin-left: 80px">
                <el-button
                  type='info'
                  size="mini"
                  on-click={() =>
                    this.editParent(data.id, data.order, data.label)
                  }
                >
                  编辑
                </el-button>
                <el-button
                  type='info'
                  size="mini"
                  on-click={() => this.recommend(data.id, data.recommend)}
                >
                  设置/停止推荐
                </el-button>
                <el-button type='info' size="mini" on-click={() => this.addChild(data.id)}>
                  新增子栏目
                </el-button>
                <el-button
                  type='danger'
                  size="mini"
                  on-click={() => this.stopColumn(data.id, data.isdelete)}
                >
                  启用/停用栏目
                </el-button>
              </span>
            ) : (
              ''
            )}
          </span>
        )
      } else {
        return (
          <span class='expanded---span'>
            <span>
              <span style="display: inline-block;min-width:120px;margin-left:10px">{data.label}</span>
              <el-button size="mini" style="margin-left:10px">
                {rr}
              </el-button>
              <el-button size="mini" style="margin-left:10px">
               {ss}
              </el-button>
              <el-button size="mini" style="margin-left:10px">
                {data.pOrder}-{data.order}
              </el-button>
            </span>
            {auth ? (
              <span style="float: feft; margin-left: 80px">
                <el-button
                  type='info'
                  size="mini"
                  on-click={() =>
                    this.editChild(data.id, data.order, data.label)
                  }
                >
                  编辑
                </el-button>
                <el-button
                  size="mini"
                  type='info'
                  on-click={() => this.recommend(data.id, data.recommend)}
                >
                  设置/停止推荐
                </el-button>
                <el-button
                  size="mini"
                  type='danger'
                  on-click={() => this.stopColumn(data.id, data.isdelete)}
                >
                  启用/停用子栏目
                </el-button>
              </span>
            ) : (
              ''
            )}
          </span>
        )
      }
    },
    updateColumn() {
      if (this.form.columnName === '') {
        if (this.addContent === '栏目名称') {
          this.$message.error('填写栏目名称')
        } else {
          this.$message.error('填写子栏目名称')
        }
        return false
      }
      if (this.addContent === '栏目名称' && this.form.columnName.length > 4) {
        this.$message.error('栏目名称不能大于4个字')
        return false
      }
      this.columnUpdate()
    },
    addColumn() {
      if (this.form.columnName === '') {
        if (!this.parentId) {
          this.$message.error('填写栏目名称')
        } else {
          this.$message.error('填写子栏目名称')
        }
        return false
      }
      if (!this.parentId && this.form.columnName.length > 4) {
        this.$message.error('栏目名称不能大于4个字')
        return false
      }
      this.columnSave()
    },
    columnUpdate: async function() {
      if (this.form.order === '' || this.form.order === null) {
        this.form.order = 0
      }
      if (!isNaN(this.form.order)) {
      } else {
        this.form.order = 0
      }
      var params = {
        id: this.columnId,
        name: this.form.columnName,
        sort: this.form.order
      }
      var res = await http.post(api.columnUpdate, params)
      if (res.data.code !== 0) {
        this.$message.error(res.data.message)
      } else {
        this.$message.success('更新成功')
        this.columnList() // 获取栏目列表
        this.dialogVisible = false
      }
    },
    columnSave: async function() {
      if (this.form.order === '' || this.form.order === null) {
        this.form.order = 0
      }
      if (!isNaN(this.form.order)) {
        console.log(this.form.order)
      } else {
        this.form.order = 0
      }
      var params = {
        name: this.form.columnName,
        parent: this.parentId,
        sort: this.form.order
      }
      var res = await http.post(api.columnSave, params)
      if (res.data.code !== 0) {
        this.$message.error(res.data.message)
      } else {
        this.$message.success('添加成功')
        this.columnList() // 获取栏目列表
        this.dialogVisible = false
      }
    },
    cls() {
      this.parentId = ''
      this.columnId = ''
      this.form.columnName = ''
      this.form.order = 0
    }
  }
}
</script>
<style>
  .tenementList---a .el-tree-node__content {
    margin-bottom: 10px;
  }
  .tenementList---a .el-tree-node__content {
    height: 28px;
  }
  .tenementList---a .expanded---span span {
    /*line-height: 28px;*/
  }
</style>

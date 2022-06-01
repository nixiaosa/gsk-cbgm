<template>
  <div class="service-control">
    <div class="tree">
      <el-tree 
        :data="data2" 
        :props="defaultProps" 
        show-checkbox="" 
        node-key="id" 
        ref="tree" 
        default-expand-all 
        :expand-on-click-node="false" 
        :default-checked-keys="checkNum"
        :render-content="renderContent">
      </el-tree>
      <el-button type="primary" @click.native.prevent="addnewroot">添加一级目录</el-button>
    </div>
    <div class="edit-item" v-show="show">
      <h3>修改权限</h3>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="权限名">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="权限url">
          <el-input v-model="form.url"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click.native.prevent="addSubmit">确定</el-button>
          <el-button @click.native.prevent="canceSubmit">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-radio class="radio" v-model="radio" :label="item.id" v-for="(item, index) in arrayradio" :key="item.id">{{index}} {{item.label}}</el-radio>
    <el-input type="text" v-model="auth"></el-input>
    <el-button type="primary" @click.native.prevent="link()">建立关联</el-button>
  </div>
</template>
<script>
  let id = 1000
  import http from '@/utils/fetch'
  import userapi from '@/api/quan'
export default {
    data() {
      return {
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        form: {
          name: '',
          url: '',
          id: ''
        },
        show: false,
        go: { index: -1 },
        checkNum: [],
        auth: '',
        radio: '1',
        arrayradio: []
      }
    },
    methods: {
      append(store, data) {
        store.append({ id: id++, label: 'testtest', children: [] }, data)
      },
      canceSubmit() {
        this.show = false
        this.form = {
          name: '',
          url: '',
          id: ''
        }
      },
      link: async function() {
        var array = []
        array.push(this.$refs.tree.getCheckedKeys()[0])
        var params = {
          authId: this.radio,
          menuAdminIdList: array
        }
        const res = await http.post(userapi.createLink, params)
        if (res.data.code === 0) {
          alert('成功')
        }
      },
      openItem: async function(node) {
        var num = Math.floor(Math.random() * 100000)
        var auth = 'ADMIN_' + num
        var label = node.label
        var params = {
          auth: auth,
          label: label
        }
        const res = await http.post(userapi.addAuth, params)
        if (res.data.code === 0) { alert('成功') }
      },
      remove: async function(store, data) {
        store.remove(data)
        var params = {
          id: data.id
        }
        const res = await http.post(userapi.deleteMenuAdmin, params)
        if (res.data.code === 0) {
          alert('删除成功')
        }
      },
      addnewroot() {
        var obj = {
          id: id++,
          label: 'new',
          children: []
        }
        this.data2.push(obj)
      },
      renderContent(h, { node, data, store }) {
        if (node.level === 1) {
          return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style='float: right; margin-right: 20px'>
              <el-button size='mini' on-click={ () => this.append(store, data) }>新增</el-button>
              <el-button size='mini' on-click={ () => this.remove(store, data) }>删除</el-button>
              <el-button size='mini' on-click={ () => this.openItem(node) }>建立权限</el-button>
            </span>
          </span>)
        } else {
          return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style='float: right; margin-right: 20px'>
              <el-button size='mini' on-click={ () => this.remove(store, data) }>删除</el-button>
              <el-button size='mini' on-click={ () => this.openItem(node) }>建立权限</el-button>
            </span>
          </span>)
        }
      },
      getMenuAdmin: async function() {
        var params = {}
        const res = await http.post(userapi.getMenuAdmin, params)
        if (res.data.code === 0) {
          // this.data2 = JSON.stringify(res.data.data)
          var obj = JSON.parse(JSON.stringify(res.data.data))
          var obj1 = []
          for (var i = 0; i < obj.length; i++) {
            obj1[i] = {}
            obj1[i].id = obj[i].id
            obj1[i].label = obj[i].label
            obj1[i].children = obj[i].childs
          }
          this.data2 = obj1
        }
      },
      addSubmit: async function() {
        var params = {}
        if (this.form.id) {
          params = {
            menuAdmin: {
              label: this.form.name,
              parentId: this.form.id,
              path: this.form.url
            },
            resource: {
              label: 'qq',
              path: 'qq'
            }
          }
        } else {
          params = {
            menuAdmin: {
              label: this.form.name,
              parentId: 0
            }
          }
        }
        const res = await http.post(userapi.addMenuAdmin, params)
        if (res.data.code === 0) {
          for (var i = 0; i < this.data2.length; i++) {
            if (this.data2[i].id === this.go.index) {
              this.data2[i].label = this.form.name
            }
            for (var j = 0; j < this.data2[i].children.length; j++) {
              if (this.data2[i].children[j].id === this.go.index) {
                this.data2[i].children[j].label = this.form.name
              }
            }
          }
          this.form = {
            name: '',
            url: '',
            id: ''
          }
          this.show = false
        } else {
          alert('失败')
          this.form = {
            name: '',
            url: '',
            id: ''
          }
          this.go = ''
          this.show = false
        }
      },
      getAuthList: async function() {
        var params = {
        }
        const res = await http.post(userapi.getAuthList, params)
        if (res.data.code === 0) {
          var data = res.data.data
          var array = []
          for (var i = 0; i < data.length; i++) {
            for (var j = 0; j < data[i].auths.length; j++) {
              array.push(data[i].auths[j])
            }
          }
          this.arrayradio = array
        }
      }
    },
    mounted() {
      this.getMenuAdmin()
      this.getAuthList()
    }
  }
</script>
<style>
.service-control{
  width:100%;
}
.tree{
  width:50%;
  margin-left:auto;
  margin-right:auto;
}
.edit-item{
  width:300px;
  border:1px solid red;
}
</style>

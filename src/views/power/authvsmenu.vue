<template>
  <div class="service-control">
    <div class="role-container">
      <div>
        <div style="margin-bottom:10px">
          <el-select disabled v-model="value" placeholder="请选择角色" style="margin-top:30px">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </div>
        <div style="text-align: right">
          <el-button type="primary" @click.native.prevent="authVsMenu()" style="margin-top:30px">保存</el-button>
          <el-button style="margin-top:30px" @click.native.prevent="getback()">返回</el-button>
        </div>
        <el-button type="primary" @click="checkAll()" style="margin-bottom:10px;">全选</el-button>
        <el-button type="primary" @click="clean()" style="margin-bottom:10px;">清空</el-button>
        <div class="role-container">
          <div>
            <div class="tree">
              <el-tree
                  ref="tree"
                  :data="data2"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :props="defaultProps"
                  :default-checked-keys='checkNum'
              >
              </el-tree>
            </div>
            <el-button type="primary" @click.native.prevent="authVsMenu()" style="margin-top:30px">保存</el-button>
            <el-button style="margin-top:30px" @click.native.prevent="getback()">返回</el-button>
            <div style="margin-bottom: 30px;"></div>
          </div>
        </div>
        <div style="margin-bottom: 30px;"></div>
      </div>
    </div>
  </div>
</template>
<script>
  import http from '@/utils/fetch'
  import userapi from '@/api/tenantInfoSave'
export default {
    data() {
      return {
        isSave: false,
        menuAll: null,
        checkStrictly: true,
        data2: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        checkNum: [],
        options: [],
        value: '',
        authForm: {
          name: '',
          id: ''
        }
      }
    },
    methods: {
      getback() {
        this.$router.go(-1)
      },
      clean() {
        this.$refs.tree.setCheckedKeys([])
      },
      checkAll() {
        this.$refs.tree.setCheckedKeys(this.check_all)
      },
      // 保存
      authVsMenu: async function() {
        var array = this.$refs.tree.getCheckedKeys()
        var menuIdArr = []
        var btnsIdArr = []
        for (var i = 0; i < array.length; i++) {
          if (typeof array[i] === 'number') {
            menuIdArr.push(array[i])
          } else if (array[i].indexOf('-') >= 0) {
            var arr = array[i].split('-')
            menuIdArr.push(Number(arr[0]))
            menuIdArr.push(Number(arr[1]))
          } else if (array[i].indexOf('*') >= 0) {
            var arr2 = array[i].split('*')
            menuIdArr.push(Number(arr2[0]))
            menuIdArr.push(Number(arr2[1]))
          }
          menuIdArr = Array.from(new Set(menuIdArr))
        }
        for (var j = 0; j < array.length; j++) {
          if (typeof array[j] !== 'number') {
            if (array[j].indexOf('*') >= 0) {
              var arr1 = array[j].split('*')
              btnsIdArr.push(Number(arr1[2]))
            }
          }
        }
        menuIdArr = Array.from(new Set(menuIdArr))
        var params = {
          authId: this.$route.params.id,
          menuIds: menuIdArr,
          resourceIds: btnsIdArr
        }
        const res = await http.post(userapi.authVsMenu, params)
        if (res.data.code === 0) {
          this.$alert('租户菜单权限配置成功', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              // this.getback()
              this.getAuthMenuList()
            }
          })
        } else {
          this.$message.error(res.data.message)
        }
      },
      // 获取已经勾选的
      getAuthMenuList: async function() {
        if (this.value) {
          var params = {
            id: this.$route.params.id
          }
          const res = await http.post(userapi.getAuthMenuList, params)
          if (res.data.code === 0) {
            var menuIdArr = []
            var array = res.data.data
            var obj1 = []
            for (var i = 0; i < array.length; i++) {
              obj1[i] = {}
              obj1[i].label = array[i].label
              obj1[i].id = array[i].id
              obj1[i].children = []
              for (var j = 0; j < array[i].childs.length; j++) {
                if (array[i].childs[j].buttons) {
                  var buttons = array[i].childs[j].buttons
                  for (var k = 0; k < buttons.length; k++) {
                    menuIdArr.push(array[i].id + '*' + buttons[k].menuId + '*' + buttons[k].id)
                  }
                } else {
                  menuIdArr.push(array[i].childs[j].menu.parentId + '-' + array[i].childs[j].menu.id)
                }
              }
            }
            this.checkNum = menuIdArr
            this.getMenuAndBtns()
          } else {
            this.$message.error(res.data.message)
          }
        }
      },
      renderContent(h, { node }) {
        if (node.level === 1) {
          return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
          </span>)
        } else {
          return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
          </span>)
        }
      },
      // 获取全部列表
      getMenuAndBtns: async function() {
        var params = {}
        const res = await http.post(userapi.getMenuAndBtns, params)
        if (res.data.code === 0) {
          var array = res.data.data
          var obj1 = []
          var check_all = []
          for (var i = 0; i < array.length; i++) {
            obj1[i] = {}
            obj1[i].label = array[i].label
            obj1[i].id = array[i].id
            obj1[i].children = []
            check_all.push(array[i].id)
            for (var j = 0; j < array[i].childs.length; j++) {
              obj1[i].children[j] = {}
              obj1[i].children[j].id = array[i].childs[j].menu.parentId + '-' + array[i].childs[j].menu.id
              check_all.push(array[i].childs[j].menu.parentId + '-' + array[i].childs[j].menu.id)
              obj1[i].children[j].label = array[i].childs[j].menu.label
              obj1[i].children[j].children = []
              if (array[i].childs[j].buttons) {
                var buttons = array[i].childs[j].buttons
                for (var k = 0; k < buttons.length; k++) {
                  obj1[i].children[j].children[k] = {}
                  obj1[i].children[j].children[k].id = array[i].id + '*' + buttons[k].menuId + '*' + buttons[k].id
                  check_all.push(array[i].id + '*' + buttons[k].menuId + '*' + buttons[k].id)
                  obj1[i].children[j].children[k].label = buttons[k].label
                  obj1[i].children[j].children[k].children = []
                }
              }
            }
          }
          this.check_all = check_all
          this.data2 = obj1
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    mounted() {
      this.options = [{ label: this.$route.params.name, value: this.$route.params.id }]
      this.value = this.$route.params.id
      this.getAuthMenuList()
    }
  }
</script>
<style>
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
  flex:1
}
.add-role .add,.add-role .cance{
  margin-left:10px
}
</style>

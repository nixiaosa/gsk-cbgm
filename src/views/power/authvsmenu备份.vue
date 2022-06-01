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
<!--        <div class="tree">-->
<!--          <el-button type="primary" @click.native.prevent="addAll()" style="margin-top:30px">全选</el-button>-->
<!--          <el-button v-if="!isSave" type="primary" @click.native.prevent="authVsMenu()" style="margin-top:30px">保存</el-button>-->
<!--          <el-tree-->
<!--            :data="data2"-->
<!--            show-checkbox-->
<!--            node-key="id"-->
<!--            ref="tree2"-->
<!--            :default-checked-keys="checkNum"-->
<!--            highlight-current-->
<!--            :props="defaultProps">-->
<!--          </el-tree>-->
<!--        </div>-->
        <el-button v-if="!isSave" type="primary" @click.native.prevent="authVsMenu()" style="margin-top:30px">保存</el-button>

        <div class="tree">
          <el-button type="primary" @click.native.prevent="addAll()" style="margin-top:30px">全选</el-button>
          <div style="height: 10px"></div>
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            ref="tree"
            default-expand-all
            :default-checked-keys="checkNum"
            :render-content="renderContent"
            :props="defaultProps">
          </el-tree>
        </div>
        <el-button v-if="!isSave" type="primary" @click.native.prevent="authVsMenu()" style="margin-top:30px">保存</el-button>
        <el-button v-if="isSave" type="primary" style="margin-top:30px">保存中</el-button>
        <el-button style="margin-top:30px" @click.native.prevent="getback()">返回</el-button>
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
      addAll() {
        var menuIdArr = []
        var array = this.menuAll
        var obj1 = []
        for (var i = 0; i < array.length; i++) {
          obj1[i] = {}
          obj1[i].label = array[i].label
          obj1[i].id = array[i].id
          obj1[i].children = []
          menuIdArr.push(array[i].id)
          for (var j = 0; j < array[i].childs.length; j++) {
            menuIdArr.push(array[i].childs[j].menu.parentId + '-' + array[i].childs[j].menu.id)
            if (array[i].childs[j].buttons) {
              var buttons = array[i].childs[j].buttons
              for (var k = 0; k < buttons.length; k++) {
                menuIdArr.push(array[i].id + '*' + buttons[k].menuId + '*' + buttons[k].id)
              }
            }
          }
        }
        this.checkNum = menuIdArr
        this.getMenuAndBtns()
      },
      // 保存
      authVsMenu: async function() {
        // var array = this.$refs.tree2.getCheckedKeys()
        // return false
        var array = this.$refs.tree.getCheckedKeys()
        var menuIdArr = []
        var btnsIdArr = []
        var menuIdArr1 = []
        var menuIdArr2 = []
        for (var i = 0; i < array.length; i++) {
          if (typeof array[i] === 'number') {
            menuIdArr1.push(array[i])
            menuIdArr.push(array[i])
          } else if (array[i].indexOf('-') >= 0) {
            var arr = array[i].split('-')
            menuIdArr.push(Number(arr[1]))
            menuIdArr2.push(Number(arr[0]))
            menuIdArr2.push(Number(arr[1]))
          }
        }
        for (var k = 0; k < menuIdArr1.length; k++) {
          if (!menuIdArr2.includes(menuIdArr1[k])) {
            this.$message.error('已选中的一级权限必须增加子级权限！')
            return false
          }
        }
        for (var j = 0; j < array.length; j++) {
          if (typeof array[j] !== 'number' && array[j].indexOf('*') >= 0) {
            var arr1 = array[j].split('*')
            // if (!menuIdArr.includes(Number(arr1[0])) || !menuIdArr.includes(Number(arr1[1]))) {
            //   menuIdArr.push(Number(arr1[0]))
            //   menuIdArr.push(Number(arr1[1]))
            // }
            console.log(menuIdArr);
            console.log(arr1);
            if (!menuIdArr.includes(Number(arr1[0])) || !menuIdArr.includes(Number(arr1[1]))) {
              this.$message.error('选中子权限的父级权限需要确保选中！')
              return false
            }
            // return
            btnsIdArr.push(Number(arr1[2]))
          }
        }
        menuIdArr = Array.from(new Set(menuIdArr))
        this.isSave = true
        var params = {
          authId: this.$route.params.id,
          menuIds: menuIdArr,
          resourceIds: btnsIdArr
        }
        const res = await http.post(userapi.authVsMenu, params)
        if (res.data.code === 0) {
          this.isSave = false
          this.$alert('权限资源授权成功', '提示', {
            confirmButtonText: '确定',
            callback: () => {
              this.getback()
            }
          })
        } else {
          this.isSave = false
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
              menuIdArr.push(array[i].id)
              for (var j = 0; j < array[i].childs.length; j++) {
                menuIdArr.push(array[i].childs[j].menu.parentId + '-' + array[i].childs[j].menu.id)
                if (array[i].childs[j].buttons) {
                  var buttons = array[i].childs[j].buttons
                  for (var k = 0; k < buttons.length; k++) {
                    menuIdArr.push(array[i].id + '*' + buttons[k].menuId + '*' + buttons[k].id)
                  }
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
          this.menuAll = array
          var obj1 = []
          for (var i = 0; i < array.length; i++) {
            obj1[i] = {}
            obj1[i].label = array[i].label
            obj1[i].id = array[i].id
            obj1[i].children = []
            for (var j = 0; j < array[i].childs.length; j++) {
              obj1[i].children[j] = {}
              obj1[i].children[j].id = array[i].childs[j].menu.parentId + '-' + array[i].childs[j].menu.id
              obj1[i].children[j].label = array[i].childs[j].menu.label
              obj1[i].children[j].children = []
              if (array[i].childs[j].buttons) {
                var buttons = array[i].childs[j].buttons
                for (var k = 0; k < buttons.length; k++) {
                  obj1[i].children[j].children[k] = {}
                  obj1[i].children[j].children[k].id = array[i].id + '*' + buttons[k].menuId + '*' + buttons[k].id
                  obj1[i].children[j].children[k].label = buttons[k].label
                  obj1[i].children[j].children[k].children = []
                }
              }
            }
          }
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

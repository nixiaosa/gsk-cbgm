<template>
  <div class="modelist">
    <header-content title="菜单管理"></header-content>
    <p>菜单说明:</p>
    <p>1、自定义菜单最多包括3个一级菜单，每个一级菜单最多包含5个二级菜单。</p>
    <p>2、一级菜单最多4个汉字，二级菜单最多7个汉字，多出来的部分将会以“...”代替。</p>
    <p>3、创建自定义菜单后，由于微信客户端缓存，需要5分钟微信客户端才会展现出来。测试时可以尝试取消关注公众账号后再次关注，则可以看到创建后的效果。</p>
    <el-input
      style="width:200px;margin-bottom:15px;margin-right: 20px;"
      placeholder="菜单名称搜索"
      icon="search"
      v-model="searchVal"
      :on-icon-click="searchClick">
    </el-input>
    <el-button @click="openMenuDia('A')">添加菜单</el-button>
    <el-button @click="publishWXMenu">确认发布</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        label="级别"
        width="100px"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="所属菜单">
        <template slot-scope="scope">
          <span>{{ scope.row.parentName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="菜单名称">
        <template slot-scope="scope">
          <span>{{ scope.row.menuName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="配置页面链接">
        <template slot-scope="scope">
          <span>{{ scope.row.menuEditUrl }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="菜单描述">
        <template slot-scope="scope">
          <span>{{ scope.row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime | formatDate(scope.row.updateTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="100">
        <template slot-scope="scope">
          <el-button @click="openMenuDia('B',scope.$index)"
                     type="text" size="small">编辑
          </el-button>
          <el-button @click="delMenuDia(scope.row.id)"
                     type="text" size="small">删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--谈框-->
    <menu-dialog :formAddMenu="formAddMenu" :dialogVisible="dialogVisible" @save="save"
                 @close="menuDiaClose"></menu-dialog>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import MenuDialog from './base/menu-dialog'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'

  export default {
    name: 'modelist',
    components: { HeaderContent, MenuDialog },
    computed: {
      ...mapGetters([
        'userAuths','companyid'
      ])
    },
    data() {
      return {
        formAddMenu: {
          level: 1,
          parentLevel: '',
          menuName: '',
          menuEditUrl: '',
          description: '',
          title: '新增菜单',
          id: ''
        },
        dialogVisible: false,
        searchVal: '',
        tableData: [],
        total: 1
      }
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {
      this.getPointList(1)
    },
    methods: {
      searchClick() {
        this.getPointList(1)
      },
      getPointList: async function(page) {
        let params = {
          pageNum: page,
          pageSize: 10,
          params: {
            companyId: this.companyid
          }
        }
        if (this.searchVal.trim() !== '') {
          params.params.menuName = this.searchVal
        }
        var res = await http.post(api.getWXMenuList, params)
        if (res.data.code === 0) {
          this.tableData = this.addParentName(res.data.data.list)
          this.total = res.data.data.total
        }
      },
      addParentName(list) {
        list.forEach(item => {
          list.forEach(item2 => {
            if (item2.id === item.parentLevel) {
              item.parentName = item2.menuName
              return
            }
          })
        })
        return list
      },
      save() {
        this.getPointList(1)
      },
      menuDiaClose() {
        this.dialogVisible = false
      },
      openMenuDia(type, ind) {
        if (type == 'A') {
          this.formAddMenu.title = '新增菜单'
          this.formAddMenu.id = ''
        } else {
          this.formAddMenu = JSON.parse(JSON.stringify(this.tableData[ind]))
          this.formAddMenu.title = '编辑菜单'
        }
        this.dialogVisible = true
      },
      delMenuDia(id) {
        this.$confirm('是否确定删除当前菜单！', '提示消息', {
          type: 'warning'
        }).then(() => {
          let params = { id: id, isDeleted: 1 }
          http.post(api.removeWXMenu, params)
            .then(res => {
              if (res.data.code === 0) {
                this.$message('删除成功')
                this.getPointList(1)
              } else {
                this.$message.error(res.data.message)
              }
            })
        })
      },
      publishWXMenu() {
        this.$confirm('是否确定发布当前所有菜单！', '提示消息', {
          type: 'warning'
        }).then(() => {
          let params = { companyId: this.companyid }
          http.post(api.publishWXMenu, params)
            .then(res => {
              if (res.data.code === 0) {
                this.$message('发布成功')
              } else {
                this.$message.error(res.data.message)
              }
            })
        })
      }
    }

  }
</script>
<style>
  .weixin .el-dialog--small {
    width: 320px;
  }
</style>
<style scoped>
  .inputWidth {
    width: 196px;
  }

  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }

  .piont-flex {
    display: flex;
    justify-content: space-between;
    height: 36px;
    margin-bottom: 15px;
  }

  .piont-flex .point-title {
    height: 36px;
    line-height: 36px;
  }
</style>

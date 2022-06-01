<template>
  <div class="modelist">
    <header-content title="微信消息管理"></header-content>
    <el-form :inline="true" label-position="left">
      <el-form-item label="消息类型" >
        <el-select v-model="messageType" placeholder="请选择" >
          <el-option  label="全部" value='-1'></el-option>
          <el-option  label="首次关注消息" value='0'></el-option>
          <el-option  label="关键字消息" value='1'></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="消息名称" >
        <el-input
          style="width:200px;margin-bottom:15px;"
          placeholder="消息名称"
          v-model="messageName">
        </el-input>
      </el-form-item>
      <el-button type="primary" @click="searchBtn">搜索</el-button>
      <el-button type="primary" @click="openMenuDia('A')">添加消息</el-button>
    </el-form>
    <el-table
      :data="tableData"
      border
      style="width: 95%;margin-top: -20px">
      <el-table-column
        label="消息名称">
        <template slot-scope="scope">
          <span>{{ scope.row.messageName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消息类型">
        <template slot-scope="scope">
          <span>{{ scope.row.messageType === 1 ? '关键字消息' : '首次关注消息' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="关键字">
        <template slot-scope="scope">
          <span>{{ scope.row.keyword }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="消息内容">
        <template slot-scope="scope">
          <span>{{ scope.row.messageContent }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.mark ? scope.row.mark : '--' }}</span>
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
          <el-button @click="openMenuDia('B',scope.$index)" type="text" size="small">编辑</el-button>
          <el-button @click="delte(scope.row.id)" type="text" size="small">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--谈框-->
    <message-dialog :formAddObj="formAddObj" :dialogVisible="dialogVisible" @save="save"  @close="menuDiaClose"></message-dialog>
    <el-dialog
      title="提示"
      :visible.sync="ends"
      >
      <span style="color: red;">是否确认删除消息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="isDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import MessageDialog from './base/message-dialog'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  export default {
    name: 'modelist',
    components: {
      HeaderContent,
      MessageDialog
    },
    computed: {
      ...mapGetters([
        'userAuths', 'companyid'
      ])
    },
    data() {
      return {
        id: '',
        ends: false,
        formAddObj: {
          title: '新增消息',
          messageName: '',
          messageType: 1,
          messageContent:'',
          mark:'',
          keyword:'',
          id: ''
        },
        dialogVisible: false,
        messageType:'-1',
        messageName:'',
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
      searchBtn() {
        this.getPointList(1)
      },
      delte(id) {
        this.id = id
        this.ends = true
      },
      isDelete() {
        this.deleteWXmessage(this.id)
      },
      deleteWXmessage: async function(id) {
        var params = {
          id: id
        }
        const res = await http.post(api.deleteWXmessage,params)
        if (res.data.code === 0) {
          this.getPointList(1)
        } else {
          this.$message.error(res.data.message)
        }
        this.ends = false
      },
      getPointList: async function(page) {
        let params = {
          pageNum: page,
          pageSize: 10,
          params: {
            companyId: this.companyid
          }
        }
        if (this.messageType >= 0) {
          params.params.messageType = this.messageType
        }
        if (this.messageName.trim() !=='' ) {
          params.params.messageName = this.messageName
        }
        var res = await http.post(api.getWXmessageList, params)
        if (res.data.code === 0) {
          this.tableData = res.data.data.list
          this.total = res.data.data.total
        }
      },
      save() {
        this.getPointList(1)
      },
      menuDiaClose() {
        this.dialogVisible = false
        this.formAddObj = {
          title: '新增消息',
          messageName: '',
          messageType: 1,
          messageContent:'',
          mark:'',
          keyword:'',
          id: ''
        }
      },
      openMenuDia(type, ind) {
        if (type === 'A') {
          this.formAddObj.title = '新增消息'
          this.formAddObj.id = ''
        } else {
          let obj = JSON.parse(JSON.stringify(this.tableData[ind]))
          this.formAddObj.messageName = obj.messageName
          this.formAddObj.messageType = obj.messageType
          this.formAddObj.messageContent = obj.messageContent
          this.formAddObj.mark = obj.mark
          // this.formAddObj.messageType = obj.messageType
          this.formAddObj.keyword = obj.keyword
          this.formAddObj.id = obj.id
          this.formAddObj.title = '编辑消息'
        }
        this.dialogVisible = true
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
  .piont-flex{
    display: flex;
    justify-content: space-between;
    height:36px;
    margin-bottom: 15px;
  }
  .piont-flex .point-title{
    height: 36px;
    line-height: 36px;
  }
</style>

<template>
  <div class="modelist">
    <el-button type="primary" :disabled="true" style="margin-top: 20px;margin-bottom: 20px;">添加角色</el-button>
    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        label="角色名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.label }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="描述">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.label }}</span>
        </template>
      </el-table-column> -->
     <!--  <el-table-column label="操作" width="140">
          <template slot-scope="scope">
            <el-button size="small" type="info" @click="handleEdit(scope.row.id,scope.row.label)">编辑</el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column> -->
    </el-table>
    <el-dialog title="权限设置" :visible.sync="dialogFormAddPower">
      <el-form :model="form">
        <el-form-item label="角色名称：" style="margin-bottom:5px;">{{rolename}}
        </el-form-item>
        <!-- <el-form-item label="描述：">
          <el-input type="textarea" class="input400" v-model="form.description"></el-input>
        </el-form-item> -->
        <el-form-item label="关联权限：" style="margin-bottom:5px;">
        </el-form-item>
        <!-- <div class="radio-role" v-for="(value,key) in labs">
          <span class="role-title">{{value}}</span>
          <el-radio-group v-model="form['item'+ key]">
            <el-radio :label="0" style="margin-right:20px;">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div> -->
        <div class="radio-role">
          <span class="role-title">创建直播</span>
          <el-radio-group v-model="form.createlive">
            <el-radio :label="0" style="margin-right:20px;">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="radio-role">
          <span class="role-title">发起直播</span>
          <el-radio-group v-model="form.sendlive">
            <el-radio :label="0" style="margin-right:20px;">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="radio-role">
          <span class="role-title">上传视频</span>
          <el-radio-group v-model="form.upvideo">
            <el-radio :label="0" style="margin-right:20px;">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="radio-role">
          <span class="role-title">创建问卷</span>
          <el-radio-group v-model="form.createquire">
            <el-radio :label="0" style="margin-right:20px;">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
        <div class="radio-role">
          <span class="role-title">创建百福袋</span>
          <el-radio-group v-model="form.createbai">
            <el-radio :label="0" style="margin-right:20px;">否</el-radio>
            <el-radio :label="1">是</el-radio>
          </el-radio-group>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddPower = false">取 消</el-button>
        <el-button type="primary" @click="rolepowerlink()">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加角色" :visible.sync="dialogFormAddrole">
      <el-form :model="form1">
        <el-form-item label="角色名称：" style="margin-bottom:5px;">
          <el-input type="text" class="input400" v-model="form1.name"></el-input>
        </el-form-item>
        <!-- <el-form-item label="描述：">
          <el-input type="textarea" class="input400" v-model="form.description"></el-input>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormAddrole = false">取 消</el-button>
        <el-button type="primary" @click="saverole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: 'modelist',
  components: {},
  data() {
    return {
      businessId: localStorage.getItem('businessId'),
      tableData: [],
      labs: [],
      form: {
        createlive: 0,
        sendlive: 0,
        upvideo: 0,
        createbai: 0,
        createquire: 0
      },
      dialogFormAddPower: false,
      rolename: '',
      form1: {
        name: ''
      },
      dialogFormAddrole: false,
      id: ''
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  mounted() {
    this.frontrolelist()
    this.powerlist()
  },
  methods: {
    handleDelete: async function(id) {
      var params = {
        businessId: this.businessId,
        id: id
      }
      var res = await http.post(api.deleterole, params)
      if (res.data.code === 0) {
        this.success('角色删除成功')
        this.frontrolelist()
      } else {
        this.$message.error(res.data.message)
      }
    },
    success(val) {
      this.$message({
        message: val,
        type: 'success'
      })
    },
    saverole: async function() {
      if (!this.form1.name) {
        alert('请输入角色名')
        return false
      }
      var params = {
        businessId: this.businessId,
        label: this.form1.name
      }
      var res = await http.post(api.saverole, params)
      if (res.data.code === 0) {
        alert('角色创建成功')
        this.frontrolelist()
        this.dialogFormAddrole = false
      } else {
        this.$message.error(res.data.message)
      }
    },
    frontrolelist: async function() {
      var params = {
        businessId: this.businessId
      }
      var res = await http.post(api.frontrolelist, params)
      if (res.data.code === 0) {
        this.tableData = res.data.data
      }
    },
    powerlist: async function() {
      var params = {
      }
      var res = await http.post(api.powerlist, params)
      if (res.data.code === 0) {
        this.labs = res.data.data
        var array = res.data.data
        for (var i = 0; i < array.length; i++) {
          var item = 'item' + i
          this.form[item] = '0'
        }
      }
    },
    handleEdit(id, label) {
      this.rolename = label
      this.id = id
      this.rolepowerlist()
      this.dialogFormAddPower = true
    },
    rolepowerlink: async function() {
      var array = []
      if (this.form.createlive === 1) {
        array.push('创建直播')
      }
      if (this.form.sendlive === 1) {
        array.push('发起直播')
      }
      if (this.form.upvideo === 1) {
        array.push('上传视频')
      }
      if (this.form.createbai === 1) {
        array.push('发起百福袋')
      }
      if (this.form.createquire === 1) {
        array.push('发起调查问卷')
      }
      var params = {
        roleId: this.id,
        authList: array
      }
      var res = await http.post(api.rolepowerlink, params)
      if (res.data.code === 0) {
        alert('角色权限关联成功')
        this.dialogFormAddPower = false
      } else {
        alert(res.data.message)
        this.dialogFormAddPower = false
      }
    },
    rolepowerlist: async function() {
      var params = {
        businessId: this.businessId,
        id: this.id,
        label: this.rolename
      }
      var res = await http.post(api.rolepowerlist, params)
      var array = eval('(' + res.data.data + ')')
      this.form = {
        createlive: 0,
        sendlive: 0,
        upvideo: 0,
        createbai: 0,
        createquire: 0
      }
      if (array) {
        for (var i = 0; i < array.length; i++) {
          if (array[i] === '创建直播') {
            this.form.createlive = 1
          }
          if (array[i] === '发起直播') {
            this.form.sendlive = 1
          }
          if (array[i] === '上传视频') {
            this.form.upvideo = 1
          }
          if (array[i] === '发起百福袋') {
            this.form.createbai = 1
          }
          if (array[i] === '发起调查问卷') {
            this.form.createquire = 1
          }
        }
      } else {
        this.form = {
          createlive: 0,
          sendlive: 0,
          upvideo: 0,
          createbai: 0,
          createquire: 0
        }
      }
    },
    handleCurrentChange(val) {
    }
  }
}
</script>
<style>
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
.radio-role{
  margin-left:80px;
  margin-bottom:10px;
}
.role-title{
 display:inline-block;
 margin-right:30px;
 width:80px;
}
</style>

<template>
  <div class="tenementList">
    <div class="header">
      <!--<div class="search" style="width: 160px;float: left">-->
        <!--<el-input-->
          <!--placeholder="搜索"-->
          <!--icon="search"-->
          <!--v-model="searchVal"-->
          <!--:on-icon-click="handleIconClick">-->
        <!--</el-input>-->
      <!--</div>-->
      <el-button type="primary" @click="dialogVisible = true;cls()">添加栏目</el-button>
    </div>
    <div class="tenementBox">
      <!--栏目列表-->
      <template>
        <el-table
          :data="dataColumnList"
          border
          class="columnList"
          style="width: 100%;">
          <el-table-column
            label="栏目名称"
            width="180">
            <template slot-scope="scope">
              <span style="margin-left: 10px">{{scope.row.parent.name}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="子栏目">
            <template slot-scope="scope">
              <el-tag style="margin-right: 10px" :key="child.name" v-for="(child,index4) in scope.row.child" v-if="scopeNull === 0" type="gray">{{child.name}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="210">
            <template slot-scope="scope">
              <el-button
                v-if="scopeNull === 0"
                size="small"
                @click="handleEdit(scope.row.parent.id)">添加子栏目</el-button>
              <el-button
                v-if="scope.row.child.length < 1"
                size="small"
                type="danger"
                @click="oneId=scope.row.parent.id,deleteOne=true">删除栏目</el-button>
              <el-button
                v-if="scope.row.child.length >= 1"
                size="small"
                type="danger"
                @click="deleteVisible=true, handleDeleteList(scope.row)">删除子栏目</el-button>
            </template>

          </el-table-column>
        </el-table>
      </template>
      <!--添加栏目弹框-->
      <el-dialog
        :title="dialogName"
        :visible.sync="dialogVisible"
        :show-close="false"
        size="tiny"
        :before-close="handleClose">
        <el-input v-model="columnName" :placeholder="dialogName"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addColumn()">保 存</el-button>
        </span>
      </el-dialog>
      <!--删除子栏目-->
      <el-dialog
        title="删除子栏目"
        :visible.sync="deleteVisible"
        :show-close="false"
        size="small"
        :before-close="handleClose">
        <h4>栏目名称：{{dataDelete.parent.name}}</h4>
        <span>选择要删除的子栏目：</span>
        <div style="height: 20px;"></div>
        <el-checkbox-group v-model="checkList" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="(data,index2) in dataDelete.child" :key="data.id" :label="data.id">{{data.name}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteMore=true">删 除</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="deleteOne"
        size="tiny">
        <span>是否确认删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteOne = false">取 消</el-button>
          <el-button type="primary" @click="columnDelete()">保 存</el-button>
        </span>
      </el-dialog>
      <el-dialog
        title="提示"
        :visible.sync="deleteMore"
        size="tiny">
        <span>是否确认删除？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteMore = false">取 消</el-button>
          <el-button type="primary" @click="columnDeleteAll()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  export default {
    http,
    api,
    formatDate,
    name: 'tenementList',
    components: {},
    data() {
      return {
        searchVal: '',
        dataColumnList: [{ 'child': [], 'parent': { 'id': '暂无栏目', 'name': '暂无栏目', 'parent': '' }}],
        tableData: [{
          name: '1'
        }],
        dialogName: '添加栏目',
        dynamicTags: [],
        deleteAll: [],
        inputVisible: false,
        inputValue: '',
        inputVisible: false,
        inputValue: '',
        dataDeleteTges: [],
        checkList: [],
        dataDelete: {
          parent: {
            name: ''
          }
        },
        scopeNull: 1,
        parentId: '',
        columnName: '',
        businessId: localStorage.getItem('businessId'),
        deleteVisible: false,
        dialogVisible: false,
        deleteOne: false,
        oneId: '',
        deleteMore: false
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
      this.columnList() // 获取栏目列表
    },
    methods: {
      handleIconClick(event) {
      },
      addColumn() {
        if (this.columnName === '') {
          this.$message.error('填写栏目名称')
          return false
        }
        this.columnSave()
      },
      handleEdit(row) {
        this.dialogVisible = true
        this.parentId = row
        this.dialogName = '添加子栏目'
      },
      handleDelete(row) {
        this.columnDelete(row)
      },
      handleDeleteList(row) {
        this.dataDelete = row
      },
      handleClose(tag) {
        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
      },
      handleCheckedCitiesChange(val) {
        this.deleteAll = val
      },
      showInput(id) {
        this.inputVisible = true
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus()
        })
      },

      handleInputConfirm() {
        const inputValue = this.inputValue
        if (inputValue) {
          this.dynamicTags.push(inputValue)
        }
        this.inputVisible = false
        this.inputValue = ''
      },
      cls() {
        this.parentId = ''
        this.dialogName = '添加栏目'
      },
//      添加栏目
      columnSave: async function() {
        var params = {
          name: this.columnName,
          parent: this.parentId
        }
        var res = await http.post(api.columnSave, params)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.$message.success('添加成功')
          this.columnList() // 获取栏目列表
          this.dialogVisible = false
          this.columnName = ''
        }
      },
//      删除栏目
      columnDelete: async function() {
        var res = await http.post(api.columnDelete, { id: this.oneId })
        if (res.data.code === 0) {
          this.$message.success('删除成功')
          this.deleteOne = false
          this.oneId = ''
          this.columnList()
        } else {
          this.$message.error(res.data.message)
        }
      },
//      批量删除栏目
      columnDeleteAll: async function() {
        var res = await http.post(api.columnDeleteAll, this.deleteAll)
        if (res.data.code === 0) {
          this.$message.success('删除成功')
          this.deleteMore = false
          this.deleteVisible = false
          this.columnList()
        } else {
          this.$message.error(res.data.message)
        }
      },
//      获取栏目列表
      columnList: async function() {
        var res = await http.get(api.columnList)
        if (res.data.code !== 0) {
          this.$message.error(res.data.message)
        } else {
          this.dataColumnList = res.data.data
          if (res.data.data.length >= 1) {
            this.scopeNull = 0
          }
        }
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  .columnList{
    line-height: 36px;
  }
  .tenementList {
    box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
    padding-top: 0;
  }
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
  .page {
    margin-top: 20px;
  }

  .background {
    display: block;
    width: 100%;
    height: 100%;
  }
  .input400 {
    width: 400px;
  }

  .input600 {
    width: 600px;
  }

  .input800 {
    width: 800px;
  }

  .input200 {
    width: 100px;
  }
</style>

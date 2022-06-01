<template>
  <div class="modelist">

    <div class="header">
      <el-button type="primary" @click="toggleSelection()">新 建</el-button>
    </div>

    <el-table
      :data="tableData"
      border
      style="width: 95%">
      <el-table-column
        label="名称"
        width="180">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="日期"
        width="280">
        <template slot-scope="scope">
          <el-icon name="time"></el-icon>
          <span style="margin-left: 10px">{{ scope.row.startTime}}-{{ scope.row.endTime}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="描述">
        <template slot-scope="scope">
          <span>{{ scope.row.createUser }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="发起人">
        <template slot-scope="scope">
          <span>{{ scope.row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button
            size="small"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      layout="prev, pager, next"
      :total="1">
    </el-pagination>

  </div>
</template>
<script>
  import { formatDate } from '../../common/data'
  export default {
    name: 'modelist',
    components: {},
    data() {
      return {
        tableData: [
          {
            title: '111111',
            desc: 'fffffff',
            startTime: '1922-12-12',
            endTime: '1923-12-12',
            createUser: 'fdaf'
          },
          {
            title: '111111',
            desc: 'fffffff',
            startTime: '1922-12-12',
            endTime: '1923-12-12',
            createUser: 'fdaf'
          }, {
            title: '111111',
            desc: 'fffffff',
            startTime: '1922-12-12',
            endTime: '1923-12-12',
            createUser: 'fdaf'
          }, {
            title: '111111',
            desc: 'fffffff',
            startTime: '1922-12-12',
            endTime: '1923-12-12',
            createUser: 'fdaf'
          }
        ]
      }
    },
    computed: {},
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    },
    mounted() {},
    methods: {
      toggleSelection() {
        this.$router.push({ path: `/survey/toAddEditSurvey` })
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
  .header{
    margin: 20px 0px;
    padding-bottom: 10px;
    width: 100%;
    text-align: right;
    border-bottom:1px solid #cccccc;
  }
</style>

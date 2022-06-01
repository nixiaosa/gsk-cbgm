<template>
    <div>
      <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
        <el-form-item label="文章标题">
          <el-input v-model="searchInfo.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="栏目">
          <el-cascader
            :clearable="true"
            :options="selected"
            v-model="searchInfo.columnId">
          </el-cascader>
        </el-form-item>
<!--        <el-form-item label="创建日期：">-->
<!--          <el-date-picker-->
<!--            style="width: 250px"-->
<!--            @change="pickerChange"-->
<!--            v-model="searchTime"-->
<!--            type="daterange"-->
<!--            align="right"-->
<!--            placeholder="选择日期范围"-->
<!--            :picker-options="pickerOptions">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
</template>

<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: 'ListSearch',
    data() {
      return {
        selected: [],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              let end = new Date()
              let start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        searchTime: '', // 时间范围
        searchInfo: {
          columnId: [],
          title: ''
        }
      }
    },
    created() {
      this.columnList()
    },
    methods: {
      columnList: async function() {
        // 获取栏目
        var res = await http.get(api.columnList)
        if (res.data.code === 0) {
          let data = res.data.data
          data.forEach(item => {
            let {id, name} = item.parent
            let stairList = {value: id, label: name}
            let secondLevel = item.child.map(({id, name}) => ({value: id,label: name}))
            stairList.children = secondLevel
            this.selected.push(stairList)
          })
        }
      },
      pickerChange(v) {
        // 选择时间范围
        if (!v || v === '') {
          this.searchTime = []
        }
      },
      onSubmit() {
        this.$emit('change', this.searchInfo)
      }
    }
  }
</script>

<style scoped>

</style>

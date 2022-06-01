<template>
  <div class="ListSearch">
<!--    index的第二版-->
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <div class="formBox" v-for="(item, index) in config[name]" :key="index">
        <el-form-item v-if="item.type === 'select'" :label="item.label">
          <el-select v-model="searchInfo.status">
            <el-option
              v-for="item in item.options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="item.type === 'daterange'" :label="item.label">
          <el-date-picker
            style="width: 250px"
            @change="pickerChange"
            v-model="timeDaterange"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item v-if="item.type === 'input'" :label="item.label">
          <el-input v-model="searchInfo[item.model]" placeholder="请输入" clearable></el-input>
        </el-form-item>

        <el-form-item v-if="item.type === 'action'">
          <el-button :loading="loading" v-for="(btn, index) in item.label" :key="index + 'btn'" type="primary" @click="onSubmit(btn.prop)">{{btn.value}}</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import config from './search-data/data.json'
  export default {
    name: 'ListSearch',
    props: {
      loading: {
        type: Boolean,
        default: false
      },
      name: {
        type: String,
        default: ''
      }
    },
    watch: {
      loading(val) {
        console.log(val);
        this.loading = val
      }
    },
    data() {
      return {
        timeDaterange: [],
        config: config,
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
        searchInfo: {
          prop: '',
          status: null,
          startTime: '',
          endTime: ''
        }
      }
    },
    methods: {
      pickerChange(v) {
        // 时间查询解析
        if (!v || v === '') {
          this.timeDaterange = []
        }
        let daterange = this.timeDaterange
        if (daterange.length > 0) {
          let start = daterange[0].toLocaleDateString()
          let end = daterange[1].toLocaleDateString()
          this.searchInfo.startTime = new Date(start).getTime()
          this.searchInfo.endTime = new Date(end).getTime()
        } else {
          this.searchInfo.startTime = ''
          this.searchInfo.endTime = ''
        }
      },
      onSubmit(item) {
        this.searchInfo.prop = item
        this.$emit('change', this.searchInfo)
      }
    }
  }
</script>

<style scoped>
  .ListSearch {
    float: left;
    min-width: 100%;
  }
.formBox {
  float: left;
}
</style>

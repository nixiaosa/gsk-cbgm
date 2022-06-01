<template>
  <div class="smsSetting">
    <el-table
    :data="tableData"
    border
    style="width: 95%">
    <el-table-column
      label="举办日期">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.bai }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="举办地点">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.diao }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="打赏设置">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.da }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="打赏金额范围">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.fanwei }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="充值金额范围">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.cong }}</span>
      </template>
    </el-table-column>
  </el-table>
  </div>
</template>
<script>
export default {
  name: 'smsSetting',
  components: {
  },
  data() {
    return {
      tableData: [{
        bai: '2017.10.16',
        diao: '北京',
        da: '允许',
        fanwei: '1~200',
        cong: '1~10000'
      }]

    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style rel="stylesheet/scss" lang="scss">
.smsSetting{
  padding-top: 50px,
}
.smsBox{
  margin-top: 60px;
}
.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input200 {
  width: 100px
}
</style>

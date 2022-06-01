<template>
  <div class="smsSetting">
    <el-table
    :data="tableData"
    border
    style="width: 95%">
    <el-table-column
      label="百福袋设置">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.bai }}</span>
      </template>
    </el-table-column>
    <el-table-column
      label="调查问卷设置">
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
    <el-table-column label="操作" width="140">
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
        bai: '红包',
        diao: '线上奖励',
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
   box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
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

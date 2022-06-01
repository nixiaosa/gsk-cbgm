<template>
  <div class="smsTemplate">
    <div class="templateBox">
      <el-table :data="tableData" border style="width: 95%">
        <el-table-column prop="date" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="name" label="短信模板名称" width="180">
        </el-table-column>
        <el-table-column prop="address" label="模板内容">
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template>
            <el-button @click="goCompile()" size="small">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
export default {
  name: 'smsTemplate',
  components: {
  },
  data() {
    return {
      tableData: [{
        date: '1',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '3',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '4',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }]
    }
  },
  computed: {
  },
  mounted() {
  },
  methods: {
    goCompile() {
      this.$router.push({ path: 'smsCompile' })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.templateBox {
  margin-top: 60px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 0 20px;
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

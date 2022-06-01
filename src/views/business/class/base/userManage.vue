<template>
  <div>
    <header-component title="人员管理" :props="['返回']" @change="back"/>
    <div>
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            label="职称"
            width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.photo }}</span>
          </template>
        </el-table-column>

        <el-table-column
            label="姓名"
            width="180">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="outRoom(scope.row.id, scope.row.roomid)">移除房间</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import HeaderComponent from "@/components/header-content/HeaderComponent";
import TableList from "@/components/table-content/TableList";
export default {
  name: "userManage",
  components: {TableList, HeaderComponent},
  data() {
    return {
      tableData: []
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      let params = {
        roomid: this.$route.params.id
      }
      this.$http.post(this.$api.room.datailList, params).then(res => {
        this.tableData = res.data.data
      })
    },
    outRoom(id, roomid) {
      // 移除房间
      let params = {
        id: id,
        roomid: roomid
      }
      this.$http.post(this.$api.room.out, params).then(res => {
        let {code} = res.data
        if (code === 0) {
          this.getList()
          this.$message.success('移除成功')
        }
      })
    },
    back() {
      this.$router.back()
    }
  }
}
</script>

<style scoped>

</style>

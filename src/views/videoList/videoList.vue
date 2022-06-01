<template>
  <div class="videoList">
    <el-table
    :data="tableData"
    border
    style="width: 95%"
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="45">
    </el-table-column>
    <el-table-column
      label="点播名称"
      width="180">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.name }}</span>
      </template>
    </el-table-column>
    <!-- <el-table-column label="描述" width="200">
      <template slot-scope="scope">
        <span>{{scope.row.description}}</span>
      </template>
    </el-table-column> -->
    <el-table-column label="开始时间">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.startTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="结束时间">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.endTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="观看人数">
      <template>
        <span style="margin-left: 10px"></span>
      </template>
    </el-table-column>
    <el-table-column label="创建人">
      <template slot-scope="scope">
        <span v-if="scope.row.userInfo" style="margin-left: 10px">{{ scope.row.userInfo.nickname | nameornick(scope.row.userInfo.name)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="创建时间">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{ scope.row.createTime }}</span>
      </template>
    </el-table-column>
    <el-table-column label="状态">
      <template slot-scope="scope">
        <span style="margin-left: 10px">{{getStatus(scope.row.status)}}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作"  width="100">
      <template slot-scope="scope">
        <el-button
          size="small"
          @click="handleEdit(scope.row.id)">查看详情</el-button>
      </template>
    </el-table-column>
  </el-table>
  <div class="foot">
    <el-pagination
    @current-change="handleCurrentChange"
    layout="prev, pager, next"
    :total="this.total">
  </el-pagination>
  </div>
  <el-dialog title="视频详情" :visible.sync="dialogFormVisible">
  <el-form :model="form">
    <el-form-item label="标题：" :label-width="formLabelWidth">
      <span>{{form.name}}</span>
    </el-form-item>
    <el-form-item label="描述：" :label-width="formLabelWidth">
      <span>{{form.description}}</span>
    </el-form-item>
    <el-form-item label="封面：" :label-width="formLabelWidth">
      <img class="cover" :src="form.coverUrl" alt="">
    </el-form-item>
    <el-form-item label="标签：" :label-width="formLabelWidth">
      <span>{{form.tags}}</span>
    </el-form-item>
    <el-form-item label="DRM：" :label-width="formLabelWidth">
      <span>{{isDRM(form.isDRM)}}</span>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
  </div>
</el-dialog>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: 'videoList',
  data() {
    return {
      form: {},
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      total: 100,
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {},
  mounted() {
    this.programQuery(1)
  },
  filters: {
    nameornick(nickname, name) {
      if (name) {
        return name
      } else if (nickname) {
        return nickname
      } else {
        return ''
      }
    }
  },
  methods: {
    getStatus(val) {
      switch (val) {
        case 0:
          return '初始化'
        case 1:
          return '上传中'
        case 2:
          return '上传失败'
        case 3:
          return '正在转码'
        case 4:
          return '转码失败'
        case 5:
          return '未发布'
        case 6:
          return '已发布'
        case 7:
          return '已失效'
        case -1:
          return '取消上传'
      }
    },
    back() {
      this.$router.back(-1)
    },
    programQuery: async function(pageNum) {
      var params = {
        pageNum: pageNum,
        pageSize: 10
      }
      var res = await http.post(api.programQuery, params)
      this.tableData = res.data.data.data
      this.total = Number(res.data.data.total)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleEdit: async function(row) {
      this.dialogFormVisible = true
      var res = await http.get(api.programGet + row)
      this.form = res.data.data
    },
    handleCurrentChange(val) {
      this.programQuery(val)
    },
    isDRM(val) {
      return val === 0 ? '无' : '有'
    },
    messageTost(val) {
      // 成功提示
      this.$message({
        showClose: true,
        message: val,
        type: 'success'
      })
    },
    errorTost(val) {
      // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.foot {
  margin-top: 20px;
}
.videoList {
  margin-top: 30px;
  margin-left: 20px;
}
.cover{
  width: 100px;
  height: 100px;
}
.input400 {
  width: 400px;
}

.input600 {
  width: 600px;
}

.input200 {
  width: 200px;
}
</style>

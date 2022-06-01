<template>
  <div class="dialogs">
    <el-dialog title="内容范围" :visible.sync="isShow" v-model="isShow" :before-close="handleClose" custom-class="activity-dialog" >
      <div class="point-title">
        <el-select v-model="bidValue" placeholder="请选择业务类型">
          <el-option v-for="item in bidOptions" :key="item.id" :label="item.label" :value="item.id" style="padding: 10px;">
          </el-option>
        </el-select>
        <el-select v-model="value" placeholder="请选择培训分类" style="width:200px;height:100%;" v-if="isOld === 0">
          <el-option v-for="item in listData" :key="item.value" :label="item.label" :value="item.value" style="padding: 10px;">
          </el-option>
        </el-select>
      </div>
      <el-table ref="multipleTable" :data="tableData" border @selection-change="handleSelectionChange" height="500">
        <el-table-column type="selection" width="60">
        </el-table-column>
        <el-table-column label="名称" width="170" height="50">
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column prop="name" label="类型" width="80">
          <template slot-scope="scope">{{ scope.row.type === 1 ?'直播':'点播' }}</template>
        </el-table-column>
        <el-table-column prop="address" label="封面图" width="200">
          <template slot-scope="scope"><img :src="scope.row.coverUrl" style="height:163px;"></template>
        </el-table-column>
        <el-table-column label="时间" width="240">
          <template slot-scope="scope">
            <span v-if="scope.row.type === 1">{{ getRightDate(scope.row.startTime,scope.row.endTime) }}</span>
            <span v-if="scope.row.type === 2">{{ changetime(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="状态" width="160">
          <template slot-scope="scope">{{ scope.row.status | sureType }}</template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { getRightDate, changetime } from '@/common/data'
import { mapGetters } from 'vuex'
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    addoptions: {
      type: Object
    }
  },
  data() {
    return {
      isOld: null, // 0为老版 1为新版
      flag: true,
      bidOptions: [],
      bidValue: '',
      value: '全部分类',
      optionObj: {},
      listData: [],
      tableData: [],
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters([
      'service',
      'serviceType',
      'businessTrain',
      'businessClass',
      'businessJbktWh',
      'businessOnlineOpenClass',
      'businessAcademicConFerence',
      'businessInteractionOpenClass',
      'userAuths'
    ])
  },
  filters: {
    sureType(v) {
      switch (v) {
        case -1:
          return '已失效'
        case 0:
          return '预告'
        case 1:
          return '直播'
        case 2:
          return '暂停'
        case 3:
          return '结束'
        case 4:
          return '稍后继续'
        case 5:
          return '正在转码'
        case 6:
          return '转码失败'
        case 7:
          return '未发布'
        case 8:
          return '已发布'
        case 9:
          return '直播回放'
      }
    }
  },
  watch: {
    bidValue(val) {
      this.value = this.listData ? this.listData[0].value : null
      this.listData = this.optionObj[this.bidValue]
      if (val === '1') {
        this.serviceName = '店员培训'
      } else if (val === '2') {
        this.serviceName = '空中课堂'
      } else if (val === '3') {
        this.serviceName = '互动公开课'
      } else if (val === '4') {
        this.serviceName = '线上公开课'
      } else if (val === '5') {
        this.serviceName = '学术会议'
      } else if (val === '9') {
        this.serviceName = '互动课堂'
      }
      this.getVideoList(1)
    },
    value() {
      this.getVideoList(1)
    }
  },
  mounted() {
    this.getVersion();
    var arr = []
    if (this.businessTrain) {
      arr.push({ label: '店员培训', id: '1' })
    }
    if (this.businessClass) {
      arr.push({ label: '空中课堂', id: '2' })
    }
    if (this.businessInteractionOpenClass) {
      arr.push({ label: '互动公开课', id: '3' })
    }
    if (this.businessOnlineOpenClass) {
      arr.push({ label: '线上公开课', id: '4' })
    }
    if (this.businessAcademicConFerence) {
      arr.push({ label: '学术会议', id: '5' })
    }
    if (this.businessJbktWh) {
      arr.push({ label: '互动课堂', id: '9' })
    }
    this.bidOptions = arr
    this.getMenuList()
  },
  methods: {
    getVersion: async function() {
      var res = await http.post(api.getVersion);
      if (res.data.code === 0) {
        this.isOld = res.data.data.webversion;
      } else {
        this.$message.error(res.data.message);
      }
    },
    changetime,
    getRightDate,
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleClose() {
      this.$emit('shows', 'hiden')
    },
    // 获取视频列表
    getVideoList: async function(page) {
      let obj1 = {}
      if (this.value !== 0) {
        obj1 = {
          navigationId: this.value
        }
      }
      let params = {
        pageNum: page,
        pageSize: 100,
        params: {
          businessId: this.bidValue,
          dataSource: obj1
        }
      }
      var res1 = await http.post(api.videoList, params)
      if (res1.data.code === 0) {
        this.tableData = res1.data.data.data
      }
    },
    getMenuList: async function() {
      var params = {
        pageNum: 1,
        pageSize: 9999
      }
      var res = await http.post(api.getMenuList, params)
      if (res.data.code === 0) {
        var array = res.data.data.data
        var obj = {}
        for (var i = 0; i < array.length; i++) {
          var str = String(array[i].businessId)
          if (!obj[str]) {
            obj[str] = []
            obj[str].push({ label: '全部分类', value: 0 })
            obj[str].push({ label: array[i].name, value: array[i].id })
          } else {
            obj[str].push({ label: array[i].name, value: array[i].id })
          }
        }
        this.optionObj = obj
        if (this.businessTrain) {
          this.bidValue = '1'
        } else if (this.businessClass) {
          this.bidValue = '2'
        } else if (this.businessInteractionOpenClass) {
          this.bidValue = '3'
        } else if (this.businessOnlineOpenClass) {
          this.bidValue = '4'
        } else if (this.businessAcademicConFerence) {
          this.bidValue = '5'
        }
        this.listData = obj[this.bidValue]
        this.value = 0
      }
    },
    determine() {
      for (var i = 0; i < this.multipleSelection.length; i++) {
        this.addoptions.businesses.push({
          busId: this.multipleSelection[i].busId,
          busName: this.multipleSelection[i].name,
          businessId: this.multipleSelection[i].businessId
        })
      }
      let obj = {}
      this.addoptions.businesses = this.addoptions.businesses.reduce(function(
        item,
        next
      ) {
        obj[next.busId] ? '' : (obj[next.busId] = true && item.push(next))
        return item
      },
      [])
      this.$refs.multipleTable.clearSelection()
      this.handleClose()
    }
  }
}
</script>
<style scoped>
.dialogBtn {
  position: absolute;
  bottom: 29px;
  left: 145px;
}
.dialogs .point-title {
  margin: 10px 0;
}
</style>



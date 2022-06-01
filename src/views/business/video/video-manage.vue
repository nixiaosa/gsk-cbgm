<template>
  <div class="modelist">
    <header-content title="视频管理 > 视频库" :opertions="['返回']" @header-btn-click="headerClick()"></header-content>
    <div style="display: flex;justify-content: flex-end;padding-bottom: 15px;">
      <upload-video ref="upViddeo" @VideoUrl="getVideoUrl"></upload-video>
    </div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        label="序号">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.$index+1 }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="封面">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.type === 1">转码中</span>
          <img class="videoManageImgCover" :src="scope.row.coverUrl" alt="" v-else-if="scope.row.coverUrl">
        </template>
      </el-table-column>
      <el-table-column
        label="名称">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.type | videoType}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="时长">
        <template slot-scope="scope">
          <span style="margin-left: 10px" v-if="scope.row.type === 1">转码中</span>
          <span style="margin-left: 10px" v-else>{{ scope.row.duration | formatTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
              width="400px"
        label="操作">
        <template slot-scope="scope" >
          <span style="margin-left: 10px" v-if="scope.row.type === 1">转码中</span>
          <div v-else>
            <el-button @click="openEdit(scope.row)" type="info" size="small">编辑</el-button>
            <el-button @click="openDel(scope.row)" type="danger" size="small">删除</el-button>
            <el-button @click="openSort(scope.row)" type="info" size="small">排序</el-button>
            <el-button @click="openSst(scope.row)" :type="scope.row.status === 0 ? 'danger' : 'success'" size="small">{{scope.row.status === 0 ? '停用' : '启用'}}</el-button>
          </div>
        </template>
      </el-table-column>
      >
    </el-table>
    <el-dialog title="排序" :visible.sync="dialogSort">
      <el-form label-width="80px" size="mini">
        <el-form-item label="视频排序:">
          <el-input type="number" style="width:80px;" v-model="numSort" min="1" :max="maxSort"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogSort = false">取 消</el-button>
        <el-button type="primary" @click="updateSort">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content';
import UploadVideo from '@/components/upload/uploadVideo'
export default {
  name: 'video-manage',
  components: {},
  data() {
    return {
      tmpId: '',
      maxSort: 0,
      dialogSort: false,
      numSort: '',
      headerTitle: '视频管理',
      id: this.$route.params.id,
      tableData: []
    }
  },
  created() {
    this.getList()
  },
  computed: {},
  filters: {
    videoType(val) {
      var date = val === 1 ? '上传视频' : val === 2 ? '视频回放' : '---'
      return date
    },
    formatTime(val) {
      if (val < 60) {
        return val + '秒'
      } else if (val >= 60 && val < 60 * 60) {
        return parseInt(val / 60) + '分' + parseInt(val % 60) + '秒'
      } else {
        var T = val / 3600
        var y = val % 3600
        return parseInt(T) + '时' + parseInt(y / 60) + '分' + parseInt(y % 60) + '秒'
      }
    }
  },
  mounted() {},
  methods: {
    headerClick() {
      this.$router.back()
    },
    getList(e) {
      http.get(api.videoManage.list + this.id).then(res =>{
        if (res.data.code === 0) {
          this.tableData = res.data.data
          this.maxSort = this.tableData.length
        } else {
          this.errorTost(res.data.message)
        }
      }).catch(err=>{
        this.errorTost(err.message)
      })
    },
    getVideoUrl(e) {
      this.$refs.upViddeo.closeFunction()
      if (e.fileId) {
        this.add(e)
      }
    },
    openEdit(data) {
      this.$prompt('编辑视频名称', '操作', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValue: data.name,
        inputValidator(val) {
          return val.length > 50 ? false : true
        },
        inputErrorMessage: '最多50个字符'
      }).then(({ value }) => {
        if (value.trim().length === 0 || value.trim().length > 20) {
          this.errorTost('请输入0-20个字数')
        } else {
          this.edit(data.id, value)
        }
      }).catch(() => {
      });
    },
    openSort(data) {
      this.numSort = data.sortNum
      this.tmpId = data.id
      this.dialogSort = true
    },
    openDel(data) {
      this.$confirm('确认删除此视频么?', '提示', {
        type: 'warning'
      }).then(() => {
        this.del(data.id)
      }).catch(() => {
      })
    },
    openSst(data) {
      let str = data.status === 0 ? '停用' : '启用'
      this.$confirm('确认'+ str +'此视频么?', '提示', {
        type: 'warning'
      }).then(() => {
        this.sst(data.id, str)
      }).catch(() => {
      })
    },
    add(e) {
      http.post(api.videoManage.save, {'extId':e.fileId,'videoId':this.id,'name':e.videoName}).then(res =>{
        if (res.data.code === 0) {
          this.getList()
        } else {
          this.errorTost(res.data.message)
        }
      }).catch(err=>{
        this.errorTost(err.message)
      })
    },
    edit(id, name) {
      http.post(api.videoManage.save, {'id':id,'name':name}).then(res =>{
        if (res.data.code === 0) {
          this.getList()
        } else {
          this.errorTost(res.data.message)
        }
      })
    },
    updateSort() {
      if (this.numSort === '' || this.numSort === null || this.numSort === undefined) {
        this.dialogSort = false
        return
      }
      if (this.numSort > this.tableData.length) {
        this.errorTost('你输入的数字超出最大序号！')
        return
      }
      http.get(`${api.videoManage.sort}${this.tmpId}/${this.numSort}`).then(res =>{
        if (res.data.code === 0) {
          this.getList()
          this.dialogSort = false
        } else {
          this.errorTost(res.data.message)
        }
      })
    },
    del(id) {
      http.get(`${api.videoManage.delete}${id}`).then(res =>{
        if (res.data.code === 0) {
          this.getList()
        } else {
          this.errorTost(res.data.message)
        }
      })
    },
    sst(id, str) {
      let _sst = str === '停用' ? 1 : 0
      console.log(_sst)
      http.get(`${api.videoManage.sst}${id}/${_sst}`).then(res =>{
        if (res.data.code === 0) {
          this.getList()
        } else {
          this.errorTost(res.data.message)
        }
      })
    },
    errorTost(val) { // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: 'error'
      })
    }
  },
  components: {
    HeaderContent, UploadVideo
  }
}
</script>
<style scoped>
  .videoManageImgCover {
    width: 145px;
    height: 80px;
    margin-top: 10px;
  }
.modelist {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  padding: 20px;
}
</style>

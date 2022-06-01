<template>
  <div>
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input v-model="formInline.name" placeholder="请输入姓名" clearable></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="请输入手机号" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" @click="download" style="margin-left:10px">下载黑名单模板</el-button>
        <el-upload
          class="upload-demo"
          :accept="accept"
          :multiple="false"
          :show-file-list="false"
          ref="exeUpload"
          action=""
          :on-change="handlePreview"
          :file-list="fileList"
          :auto-upload="false">
        <el-row style="width: 100px">
          <el-progress v-if="showUpload" :text-inside="true" :stroke-width="16" :percentage="this.percentageNum"></el-progress>
        </el-row>
          <el-button v-if="!showUpload" slot="trigger" type="info" size="small">上传黑名单</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <el-table :data="tableData" border>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
     
      <el-table-column fixed="right" label="操作" width="400">
        <template slot-scope="scope">
          <div class="active-box">
            <el-row>
              <el-button @click="remove(scope.row.id)" type="info" size="small"
              >移除黑名单
              </el-button>
            </el-row>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import { async } from 'q';
import $cos from "yb-cos";
import UploadFile from "@/views/business/foreuser/UploadFile";

export default {
  name: "blackList",
  components: {
    HeaderContent,UploadFile
  },
  props: {
  },
  data() {
    return {
      headerTitle: '会议黑名单',
      opertions: ['返回'],
      tableData: [],
      currentPage: 1,
      total: 1,
      batchstopDia: false,
      sstBatch: "0",
      accept: '.xls,.xlsx', // 支持上传的附件后缀
      fileList: [],
      fileData: '',
      showUpload: false,
      batchUploadDia: false,
      fileName: '',
      formInline:{
        name: null,
        phone: null
      }
    }
  },
  filters: {
  },
  mounted() {
    this.getBlackList(1)
  },
  methods: {
    download(){
      window.open("https://poster-1253412830.cos.ap-beijing.myqcloud.com/NoBusId/上传黑名单(3365).xlsx")
    },
    handlePreview(file) {
      this.showUpload = true
      let params = {
        domain: api.getSig,
        name: file.name,
        body: file.raw,
        onProgress: progress => {
          if (progress.percent < 1) {
            this.percentageNum = parseInt(progress.percent * 100)
          }
        }
      }
      $cos.putObject(params, item => {
        this.handleExeSuccess(item)
      })
    },
    handleExeSuccess(response) {
      if (response.code === 0) {
        let transferName = ''
        this.showUpload = false
        this.fileData = decodeURIComponent(response.data.Location)
        transferName = this.fileData.substring(this.fileData.lastIndexOf("\/") + 1,this.fileData.length)
        this.fileName = transferName.substring(0,transferName.indexOf("."))
        this.batchAdd(this.fileData,this.fileName)
      } else {
        this.$message.error(response.message)
      }
    },
    batchAdd: async function(fileUrl,name) {
      var params = {
        sourceId: this.$route.params.id,
        fileUrl: fileUrl
      };
      const res = await http.post(api.blackListSet,params);
      if (res.data.code === 0) {
        if(res.data.data != null){
          window.open(res.data.data)
        }
        this.getBlackList(1)
        this.$message.success("上传成功");
      }else{
        this.$message.error(res.data.message);
      }
    },
    remove: async function(id) {
      var res = await http.get(api.blackListRemove + id);
      if (res.data.code === 0) {
        this.getBlackList(1)
      } else {
        this.$message.error(res.data.message);
      }
    },
    getBlackList: async function(pageNum){
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        params: {
          ...this.formInline,
          sourceId: this.$route.params.id
        }
      };
      const res = await http.post(api.blackList, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message);
      }
    },
    onSubmit(){
      this.getBlackList(1)
    },
    headerClick() {
      this.$router.back()
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBlackList(val)
    }
  }
}
</script>

<style scoped>
/deep/ .el-button {
  margin-left: 0;
}

/deep/ .el-row:nth-child(odd) {
  margin-left: 0 !important;
}

/deep/ .el-row:nth-child(even) {
  margin-right: 5px !important;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:nth-child(odd) {
  margin-left: 5px;
  margin-right: 5px;
}

.active-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
.upload-demo{
  display: inline-block;
  margin: 0 10px;
}
</style>

<template>
  <div>
    <header-content :title="headerTitle"/>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="form.introduceImg" :src="form.introduceImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
     <el-table :data="tableData" border>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="userId">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="userId">
        <template slot-scope="scope">
          <span>{{ scope.row.userId }}</span>
        </template>
      </el-table-column>
     <el-table-column label="openId">
        <template slot-scope="scope">
          <span>{{ scope.row.openId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="unionId">
        <template slot-scope="scope">
          <span>{{ scope.row.unionId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="提交时间">
        <template slot-scope="scope">
          <span>{{ scope.row.commitTime }}</span>
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
import http from '@/utils/tenant'
import HeaderContent from '@/components/header-content'
import api from "@/api/tenantInfoSave";

export default {
  name: 'questionnaireConfidence',
  components: {
    HeaderContent,
  },
  filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      formatDates(time) {
        var date = new Date(time)
        if(time){
          return formatDate(date,'yyyy-MM-dd hh:mm')
        } else {
          ""
        }
      },
  },
  data() {
    return {
      tableData: [],
      currentPage: 1,
      total: 1,
      headerTitle: '开业信心指数',
      formInline:{},
      fileList: [],
      upimgurl: this.$api.gskUploadImg,
      token: { Authorization: localStorage.getItem('yibai_token_s'), 'Remote-Host': window.localStorage.getItem('locationHost')},
    }
  },
  mounted() {
    this.getList(1)
  },
  methods: {
    handleAvatarSuccess(res, file) {
        // this.form.introduceImg = res.data
    },
    beforeAvatarUpload(file) {
        let passType =
        "doc、docx、ppt、pptx、xls、xlsx、pdf、zip、rar、txt、jpg、jpeg、png";
          let fileType = file.name.split(".");
          fileType = fileType[fileType.length - 1];
          const isPassType = passType.indexOf(fileType) !== -1;
          const isLt2M = file.size / 1024 / 1024 < 20;
          if (!isPassType) {
            this.$message.error("暂不支持该格式上传");
          }
          if (!isLt2M) {
            this.$message.error("文件大小不能超过 20MB!");
          }
          return isPassType && isLt2M;
      },
   getList: async function(pageNum){
      let params = {
        pageNum: pageNum,
        pageSize: 10,
        params: {
          ...this.formInline,
          sourceId: this.$route.params.id
        }
      };
      const res = await http.post(api.gskConfidenceList, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBlackList(val)
    },
    
  }
}
</script>

<style scoped>

</style>

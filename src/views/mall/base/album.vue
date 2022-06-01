<template>
  <div class="album">
    <el-table
      :data="tableData"
      border
    >
    <el-table-column label="商品图片">
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.goodsImgUrl" alt="" width="200" height="200">
          </span>
        </template>
    </el-table-column>
    <el-table-column label="选择排序">
        <template slot-scope="scope">
           <el-tag type="primary">{{ scope.row.goodsImgOrder }}</el-tag>
        </template>
    </el-table-column>
    <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" @click="deleted(scope.row.id)" :disabled="isdisabled">删除</el-button>
          <el-button type="info" @click="rank(scope.row.id,scope.row.goodsImgOrder)" :disabled="isdisabled">排序</el-button>
        </template>
    </el-table-column>
    </el-table>
    <el-dialog title="排序" :visible.sync="rankVisible">
      <el-form :model="forml" label-width="100px" ref="columnForm">
        <el-form-item label="排序:">
          <el-input v-model="forml.order" min="0" type="number" style="width:80px"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rankVisible = false">取 消</el-button>
        <el-button type="primary" @click="rankArticle()">保 存</el-button>
      </span>
    </el-dialog>

    
    <el-upload class="avatar-uploader" id="contentimg1" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <!-- <img v-if="form.pic" :src="form.pic" class="avatar"> -->
      <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
      <i class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia" v-if="this.$route.query.type !== 0"></i>
    </el-upload>



    <el-button type="success" class="btns" @click="step3" v-if="this.$route.query.type !== 0">上一步</el-button>
    <el-button type="success" class="btn1" @click="save3" v-if="this.$route.query.type !== 0">下一步</el-button>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
export default {
  name: "album",
  data() {
    return {
       tableData: [],
        selectTab: 'describe',
        save: 'stock',
        upimgurl: api.uploadImg,
        rankVisible: false,
        isdisabled: false,
        id: '',
        forml: {
          order: ''
        },
        form:{
          goodsImgUrl: ''
        },
       token: { Authorization: localStorage.getItem('yibai_token_c'),'Remote-Host': window.localStorage.getItem('locationHost') },
    }
  },
  props:{
    commodityId: ""
  },
  mounted() {
    var self = this
    self.AlbumList(1)
    if (self.$route.query.type == 0) {
      this.isdisabled = true
    }
  },
  methods:{
     AlbumList: async function () {
       let id = null
       if (this.commodityId && this.commodityId !== '') {
         id = this.commodityId
       } else {
          id = this.$route.query.id
       }
      var params1 = {
        pageNum: 1,
        pageSize: 10,
        params: {
          goodsId: id
        }
      }
      var res = await http.post(api.AlbumList, params1)
      if (res.data.code === 0) {
        this.tableData = res.data.data
      } else {
        this.$message.error(res.data.message)
      }
    },
    step3() {
      this.$emit("selectTab3",this.selectTab)
    },
    handleAvatarSuccess(res) {
      this.form.goodsImgUrl = res.data
      if (res.data && res.data!== '') {
        this.Albumadd()
      }
    },
    deleted: async function(id){
      var params = {
        id: id
      }
      const res = await http.post(api.Albumdelete,params)
      if (res.data.code === 0) {
        this.AlbumList(1)
      }
    },
     beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      let isJPG = /\/(gif|jpg|jpeg|png)$/.test(file.type)
      if (!isJPG) {
        this.$message.error('图片类型必须是.gif,jpg,png中的一种')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    save3() {
       if (this.tableData.length < 1) {
        this.$message.error("最少添加1张图片")
        return
      }
       this.$emit("save",this.save)
    },
     rank(id,sort) {
      this.forml.order = sort
      this.id = id
      this.rankVisible = true
    },
    rankArticle: async function() {
      if (this.forml.order === '' || this.forml.order === null) {
        this.forml.order = 0
      }
      if (!isNaN(this.forml.order)) {
        console.log(this.forml.order)
      } else {
        this.forml.order = 0
      }
      var params = {
        id: this.id,
        goodsImgOrder: this.forml.order
      }
      var res = await http.post(api.goodsImgupdate, params)
      if (res.data.code !== 0) {
        this.$message.error(res.data.message)
      } else {
        this.$message.success('操作成功')
        this.AlbumList(1)
        this.rankVisible = false
      }
    },
    Albumadd: async function() {
      if (this.tableData.length >= 5) {
        this.$message.error("最多可添加5张图片")
        return
      }
      let id = null
      if (this.$route.query.type) {
        id = this.$route.query.id
      } else {
        id = this.commodityId
      }
      var params = {
        goodsImgUrl: this.form.goodsImgUrl,
        goodsImgOrder: 0,
        goodsId: id
      }
      var res = await http.post(api.Albumadd,params)
      if (res.data.code === 0) {
        this.AlbumList(1)
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style>
  .album .el-upload {
    border: none;
  }
</style>

<style scoped>

</style>



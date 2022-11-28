<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :model="form" ref="ruleForm" label-position="left" label-width="120px">
      <el-form-item label="设置:" prop="coverUrl">
          <span class="title">轮播图:</span>
          <div v-for="(item,index) in form.carousel" :key="index">
            <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="(file, data) => handleAvatarSuccess(file, data, index)" :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB，建议尺寸为3:1</p>
            <div>
            <span class="title">排序:</span>
            <el-input type="number" v-model="item.seqNumber" min="0" style="width:80px;"></el-input> 
            <el-input type="" v-model="item.linkUrl" placeholder="请输入链接地址" clearable></el-input>  
            </div>
          </div>
          <span class="title">Banner:</span>
          <div v-for="(item,index) in form.banner" :key="index">
            <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="(file, data) => handleAvatarSuccess2(file, data, index)" :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB，建议尺寸为3:1</p>
            <div>
            <span class="title">排序:</span>
            <el-input type="number" v-model="item.seqNumber" min="0" style="width:80px;"></el-input> 
            <el-input type="" v-model="item.linkUrl" placeholder="请输入链接地址" clearable></el-input>  
            </div>
          </div>
          <div>
            <el-button type="primary" @click="toNext(3)">下一步</el-button>
            <el-button @click="addSelect" :disabled="addDisabled" type="primary">添加广告图</el-button>
            <el-button @click="reduceSelect" :disabled="reduceDisabled" type="primary">删除广告图</el-button>
          </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  import { mapGetters } from "vuex";
  export default {
    name: "matchSet",
    components: {
      HeaderContent
    },
    computed: {},
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
        activeName: 'first',
        headerTitle: '创建',
        id: '',
        voteId: '',
        articleId: '',
        articleOptions: [],
        voteOptions: [],
        allowSubmit: '',
        addDisabled: false,
        reduceDisabled: false,
        editForm: {
          id: null,
          type: '1',
          title: '',
          content: '',
          effectiveDate: null,
          sourceId: null,
        },
        fileList: [],
        form: {
          carousel: [
            {
              type: 1, // 1轮播2banner
              imgUrl: '',
              linkUrl: '',
              seqNumber: 1,
              isDel: 0,
            }
          ],
          banner: [
            {
              type: 2, // 1轮播2banner
              imgUrl: '',
              linkUrl: '',
              seqNumber: 1,
              isDel: 0,
            }
          ],
        },
        upimgurl: this.$api.gskUploadImg,
        token: { Authorization: localStorage.getItem('yibai_token_s'), 'Remote-Host': window.localStorage.getItem('locationHost')},
      }
    },
    async mounted() {
      await this.getMenuList();
      await this.gskVoteList();
      await this.onEdit();
      if (this.form.banners.length < 2) {
        this.reduceDisabled = true;
      }
    },
    created() {},
    methods: {
      toNext(step){
        if(step == 2){
          this.activeName = 'second'
        } else if (step == 3) {
          this.activeName = 'third'
        }
      },
      selectArticle(val,index){
        this.form.banners[index].columnId = val;
      },
      selectVote(val){
        this.form.voteId = val;
      },
      handleAvatarSuccess(res, file) {
        this.form.carousel[index].imgUrl = res.data;        
      },
      handleAvatarSuccess2(res, file, index) {
        this.form.banner[index].imgUrl = res.data;
      },
      // handleAvatarSuccess3(res, file) {
      //   this.form.contactImg = res.data
      // },
      beforeAvatarUpload(file) {
        const isJPG =
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif'
        const isLt5M = file.size / 1024 / 1024 < 5
        if (!isJPG) {
          this.$message.error('上传图片只能是jpg、png、gif格式!')
        }
        if (!isLt5M) {
          this.$message.error('上传图片大小不能超过 5MB!')
        }
        return isJPG && isLt5M
      },
      getMenuList: async function() {
        let params = {}
        const res = await http.post(api.getMenuList,params)
        if (res.data.code === 0) {
          this.articleOptions = res.data.data[0].navigationList;
        } else {
          this.$message.error(res.data.message)
        }
      },
      gskVoteList: async function() {
        let params = {
          pageSize:1000,
          pageNum:1,
          type:"0",
          voteName:null
        }
        const res = await http.post(api.gskVoteList,params)
        if (res.data.code === 0) {
          this.voteOptions = res.data.data.list;
        } else {
          this.$message.error(res.data.message)
        }
      },
      onSubmit: async function() {
        if(!this.form.introduceImg){
            this.$message.error("请上传大赛介绍图片");
            return false;
        }
        if(!this.form.voteId){
            this.$message.error("请选择投票");
            return false;
        }
        if(!this.form.contactImg){
            this.$message.error("请上传联系我们图片");
            return false;
        }

        this.form.banners.map(item=>{
          if( item.bannerUrl == '' || item.columnId == '' ){
            this.$message.error("大赛背景图或栏目不能为空");
            this.allowSubmit = 0;
          } else {
            this.allowSubmit = 1;
          }
        });
        
        if(this.allowSubmit == 1){
          let params = {
            ...this.form
          }
          const res = await http.post(api.matchSetting,params)
          if (res.data.code === 0) {
            this.$message.success("操作成功")
          } else {
            this.$message.error(res.data.message)
          }
        }
        
      },
      onEdit: async function() {
        const res = await http.get(api.matchGetSetting)
        if (res.data.code === 0) {
          if(res.data.data.id != null){
            this.form = res.data.data;
            this.form.banners = JSON.parse(res.data.data.banners);
            this.voteId = res.data.data.voteId;
          }
        } else {
          this.$message.error(res.data.message)
        }
      },
      addSelect() {
        if (this.form.banners.length >= 7) {
            this.addDisabled = true;
        }
        if (this.form.banners.length <= 2) {
            this.reduceDisabled = false;
        }
        this.form.banners.push({
          bannerUrl: '',
          columnName: '',
          columnId: ''
        });
      },
      reduceSelect() {
          if (this.form.banners.length <= 2) {
              this.reduceDisabled = true;
          }
          if (this.form.banners.length <= 8) {
              this.addDisabled = false;
          }
          this.form.banners.splice(this.form.banners.length - 1);
      },
    }
  }
</script>

<style scoped>
.upload-info{
  color: #999;
  font-size: 14px;
}
.title{
  display: inline-block;
  vertical-align: top;
  margin-right: 20px;
  margin-bottom: 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #ccc;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .ql-editor{
    min-height:500px;
  }
</style>

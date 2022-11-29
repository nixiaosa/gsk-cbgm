<template>
  <div class="case">
    <header-content v-if="!$route.query.id" :title="headerTitle" :opertions="opertionsFirst" @header-btn-click="headerClick"></header-content>
    <header-content v-if="$route.query.id" :title="headerTitle2" :opertions="opertionsFirst" @header-btn-click="headerClick"></header-content>
    <el-form :model="form" ref="ruleForm" label-position="left" label-width="120px">
      <el-form-item label="轮播图设置:" prop="coverUrl">
          <div>
            <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="(file, data) => handleAvatarSuccess(file, data, index)" :before-upload="beforeAvatarUpload">
                <img v-if="form.imgUrl" :src="form.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB</p>
            <div v-if="$route.query.type != 2">
            <span class="title">排序:</span>
            <el-input type="number" v-model="form.seqNumber" min="1" style="width:80px;"></el-input> 
            <div>&nbsp;</div>
            <span class="title">链接地址:</span>                      
            <el-input type="" v-model="form.linkUrl" placeholder="请输入链接地址" style="width:300px;" clearable></el-input>  
            </div>
          </div>
          <!-- <span class="title">Banner设置:</span>
          <div v-for="(item,index) in form.banner" :key="index">
            <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="(file, data) => handleAvatarSuccess2(file, data, index)" :before-upload="beforeAvatarUpload">
                <img v-if="item.imgUrl" :src="item.imgUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB，建议尺寸为3:1</p>
            <div>
            <span class="title">排序:</span>
            <el-input type="number" v-model="item.seqNumber" min="0" style="width:80px;"></el-input> 
            <div>&nbsp;</div>
            <span class="title">链接地址:</span>          
            <el-input type="" v-model="item.linkUrl" placeholder="请输入链接地址" style="width:300px;" clearable></el-input>  
            </div>
          </div> -->
          <div>
            <el-button @click="save"  type="primary">保存</el-button>
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
        headerTitle2: '编辑',
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
        form2: {
          carousel: [
            {
              type: 1, // 1轮播2banner
              imgUrl: '',
              linkUrl: '',
              seqNumber: 1,
              isDel: 0,
              proUuid: null
            }
          ],
          banner: [
            {
              type: 2, // 1轮播2banner
              imgUrl: '',
            }
          ],
        },
        form: {
          type: this.$route.query.type ? this.$route.query.type : 1, // 1轮播2banner
          imgUrl: '',
          linkUrl: '',
          seqNumber: 1,
          isDel: 0,
          proUuid: this.$route.query.proUuid ? this.$route.query.proUuid : null
        },
        opertionsFirst: ["返回"],
        upimgurl: this.$api.gskUploadImg,
        token: { Authorization: localStorage.getItem('yibai_token_s'), 'Remote-Host': window.localStorage.getItem('locationHost')},
      }
    },
    async mounted() {
      if (this.$route.query.id) {
        this.getEdit(); //回显
      }

      // await this.getMenuList();
      // await this.gskVoteList();
      // await this.onEdit();
      // if (this.form.banners.length < 2) {
      //   this.reduceDisabled = true;
      // }
    },
    created() {},
    methods: {
      headerClick() {
        this.$router.push({
          path: "/basedata/gsk/indexManage"
        });
      },
      getEdit: async function() {
        const res = await http.get(api.homePageConfigManageEdit + this.$route.query.id)
        if (res.data.code === 0) {
          this.form = res.data.data;
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleAvatarSuccess(res, file) {
        this.form.imgUrl = res.data;
      },
      handleAvatarSuccess2(res, file, index) {
        this.form.banner[index].imgUrl = res.data;
      },
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
      save: async function() {
        let params = {
          ...this.form
        }
        if (this.$route.query.id) {
          this.form.id = this.$route.query.id
          this.form.isDel =undefined
        }
        const res = await http.post(api.homePageConfigManageSet,params)
        if (res.data.code === 0) {
          this.$message.success("操作成功")
          window.scrollTo(0, 0)
          $("html,body",window.parent.document).animate({scrollTop:0},1000)
          this.$router.push('/basedata/gsk/indexManage')
        } else {
          this.$message.error(res.data.message)
          window.scrollTo(0, 0)
          $("html,body",window.parent.document).animate({scrollTop:0},1000)
        }
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
  .fenge-line{
    border-top: 1px solid #ccc;
    width: 100%;
    margin: 50px 0;
  }
</style>

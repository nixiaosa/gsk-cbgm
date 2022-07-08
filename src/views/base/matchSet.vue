<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="大赛介绍" name="first"></el-tab-pane>
      <el-tab-pane label="大赛直播" name="second"></el-tab-pane>
      <el-tab-pane label="联系我们" name="third"></el-tab-pane>
    </el-tabs>

    <el-form :model="form" ref="ruleForm" label-position="left" label-width="120px">
      <el-form-item v-if="activeName == 'first'" label="大赛介绍宣传图:" prop="coverUrl">
          <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                <img v-if="form.introduceImg" :src="form.introduceImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB，建议尺寸为750*1334</p>
          <el-button type="primary" @click="toNext(2)">下一步</el-button>
      </el-form-item>
      <el-form-item v-if="activeName == 'second'" label="大赛直播背景图:" prop="coverUrl">
          <div v-for="(item,index) in form.banners" :key="index">
            <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="(file, data) => handleAvatarSuccess2(file, data, index)" :before-upload="beforeAvatarUpload">
                <img v-if="item.bannerUrl" :src="item.bannerUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
            <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB，建议尺寸为3:1</p>
            <div>
            <span class="title">选择栏目:</span>
              <el-select
                v-model="item.columnId"
                placeholder="请选择"
                class="searchStyle"
                style="width:220px;height:100%;"
                @change="selectArticle(item.columnId,index)"
                filterable
              >
                <el-option
                  v-for="(item,index) in articleOptions"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div style="border-top:1px solid #ccc; padding-top:20px">
            <span class="title">选择投票:</span>
            <el-select
              v-model="voteId"
              placeholder="请选择"
              class="searchStyle"
              style="width:220px;height:100%;"
              @change="selectVote"
              filterable
            >
              <el-option
                v-for="(item,index) in voteOptions"
                :key="index"
                :label="item.voteName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div>
            <el-button type="primary" @click="toNext(3)">下一步</el-button>
            <el-button @click="addSelect" :disabled="addDisabled" type="primary">添加广告图</el-button>
            <el-button @click="reduceSelect" :disabled="reduceDisabled" type="primary">删除广告图</el-button>
          </div>
      </el-form-item>
      <el-form-item v-if="activeName == 'third'" label="联系我们:" prop="coverUrl">
          <el-upload class="avatar-uploader" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess3" :before-upload="beforeAvatarUpload">
                <img v-if="form.contactImg" :src="form.contactImg" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p class="upload-info">图片格式为jpg、jpeg、gif、png，大小限制为5MB，建议尺寸为750*1334</p>
          <el-button type="primary" @click="onSubmit()">保存</el-button>
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
        headerTitle: '大赛设置',
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
          id:null,
          voteId: '',
          introduceImg: '',
          contactImg: '',
          banners: [
            {
              bannerUrl: '',
              columnName: '',
              columnId: ''
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
        this.form.introduceImg = res.data
      },
      handleAvatarSuccess2(res, file, index) {
        this.form.banners[index].bannerUrl = res.data;
      },
      handleAvatarSuccess3(res, file) {
        this.form.contactImg = res.data
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
  vertical-align: top;
  margin-right: 20px;
}
</style>

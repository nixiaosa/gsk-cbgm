<template>
  <div class="commoditydetail">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick" v-if="type == 0"></header-content>
    <header-content :title="headerTitle1" :opertions="opertions" @header-btn-click="headerClick" v-if="type == 1"></header-content>
    <header-content :title="headerTitle2" :opertions="opertions" @header-btn-click="headerClick" v-if="type !== 0 && type !== 1"></header-content>
    <el-tabs type="border-card" @tab-click="handleClicks" v-model="selectTab">
      <el-tab-pane label="基本信息" name="base" :disabled="isDisabled">
        <Basic :form="form" v-on:selectTab1="getTab"  :id="id" :type="type" v-on:goodsId="goods" v-if="Isbase" :commodityId="commodityId"></Basic>
      </el-tab-pane>
      <el-tab-pane label="商品描述" name="describe" :disabled="isDisabled">
        <input id="uploadVideoNow-file" type="file" ref="upload" style="display:none"/>
        <el-form v-show="type == 0">
          <el-form-item label="商品详情:">
            <div class="test-area intro-content ql-editor test-area-editor" v-html="form.content">
            </div>
          </el-form-item>
        </el-form>
        <div class="desc" v-show="type !== 0">
            <div style="width:100px;height:40px;">商品详情:</div>
             <el-upload id="contentimg" v-show="false" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
              <img :src="contentImg" class="avatar">
            </el-upload>
            <div>
              <div class="quill-editor-example">
                <quill-editor v-model="form.content"
                              ref="myTextEditor"
                              :options="editorOption">
                </quill-editor>
              </div>
            </div>
        </div>
        <el-button type="success" class="btns" @click="step" v-if="this.$route.query.type!== 0">上一步</el-button>
        <el-button type="success" class="btn1" @click="save2" v-if="this.$route.query.type!== 0">保存并下一步</el-button>
      </el-tab-pane>
      <el-tab-pane label="商品相册" name="album" :disabled="isDisabled">
        <Album v-on:selectTab3="getTab3" v-on:save="getsave" :commodityId="commodityId" v-if="IsAlbum"></Album>
      </el-tab-pane>
      <el-tab-pane label="库存" name="stock" :disabled="isDisabled">
        <Stock  v-on:steps="getstep4" :formInline="formInline" :commodityId="commodityId" v-if="Isstock"></Stock>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import liveapi from '@/api/liveapi'
import { Quill } from 'vue-quill-editor'
import { ImageDrop } from 'quill-image-drop-module'
import imageResize from 'quill-image-resize-module'
import Basic from './base/basic'
import Album from './base/album'
import Stock from './base/stock'
Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', imageResize)
import $ from 'jquery'
export default {
  name: "commoditydetail",
  components:{
    HeaderContent,
    Basic,
    Album,
    Stock
  },
  data(){
    return {
      headerTitle: '查看商品',
      opertions: ['返回'],
      headerTitle1: '编辑商品',
      headerTitle2: '添加商品',
      upimgurl: api.uploadImg,
      contentImg: '',
      isDisabled: true, // 不允许点击
      Isbase: true,
      selectTab: 'base',
      Isdescribe: false,
      IsAlbum: false,
      Isstock: false,
      id: Number(this.$route.query.id),
      type: Number(this.$route.query.type),
      token: { Authorization: localStorage.getItem('yibai_token_c'),'Remote-Host': window.localStorage.getItem('locationHost') },
      commodityId: '',
      commodityIds: '',
      form: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          content: ``,
          delivery: false,
          type: [],
          resource: '',
          resources: '',
          imageUrl: '',
          isOfflineDelivery: '',
          isCard: '',
          desc: '',
          point: '',
          categoryName: ''
        },
         options: [
          {
            label: '全部'
          },
          {
            status: 1,
            label: '未开始'
          },
          {
            status: 0,
            label: '未发布'
          },
          {
            status: 2,
            label: '进行中'
          },
          {
            status: 3,
            label: '已结束'
          }
        ],
      editorOption: {
          placeholder: '请输入内容',
          modules: {
            toolbar: [
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              [{ 'direction': 'rtl' }],
              ['link', 'image']
            ],
            history: {
              delay: 1000,
              maxStack: 50,
              userOnly: false
            },
            imageDrop: true,
            imageResize: true
          }
        },
        formInline: {
          user: '',
          password: ''
        },
        tableData: [{
            date: '2016-05-02',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1518 弄'
          }, {
            date: '2016-05-04',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1517 弄'
          }, {
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1519 弄'
          }, {
            date: '2016-05-03',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1516 弄'
          }]
    }
  },
  mounted() {
     var vm = this
      var imgHandler = async function(image) {
        vm.addImgRange = vm.$refs.myTextEditor.quill.getSelection()
        if (image) {
          var fileInput = document.getElementById('contentimg') // 隐藏的file文本ID
          var fileUpimg = fileInput.getElementsByClassName('el-upload')[0]
          fileUpimg.click() // 加一个触发事件
        }
      }
      vm.$refs.myTextEditor.quill.getModule('toolbar').addHandler('image', imgHandler)
      if (this.$route.query.id) {
        this.categorydetail()
      }
      if (this.selectTab === 'base') {
        this.Isbase = true
      }
     if (this.$route.query.type === 0) {
       this.isDisabled = false
     }
  },
  methods:{
    onSubmit() {
    },
    headerClick() {
      this.$router.push({
        path: '/mall/commodity',
        query:{
          page: this.$route.query.page
        }
      })
    },
    getTab(val) {
      this.selectTab = val
      this.Isbase = false
      this.Isdescribe = true
      this.IsAlbum = false
      this.Isstock = false
    },
    getTab3(val) {
      this.selectTab = val
      this.Isbase = false
      this.Isdescribe = true
      this.IsAlbum = false
      this.Isstock = false
    },
    getsave(val) {
      this.selectTab = val
      this.Isbase = false
      this.Isdescribe = false
      this.IsAlbum = false
      this.Isstock = true
    },
    getstep4(val) {
      this.selectTab = val
      this.Isbase = false
      this.Isdescribe = false
      this.IsAlbum = true
      this.Isstock = false
    },
    handleAvatarSuccess(res, file) {
        this.form.imageUrl = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      goods(val) {
        console.log('Gaiwei' + val)
        this.commodityId = val
      },
      save() {
        this.selectTab = 'describe'
        console.log("2222222222",215)
      },
      step() {
        this.selectTab = 'base'
        this.Isbase = true
        this.Isdescribe = false
        this.IsAlbum = false
        this.Isstock = false
      },
      save2() {
        this.categorydescribe()
      },
      categorydescribe: async function() {
        if (this.form.content === '' || this.form.content === null) {
          this.$message.error("请填写内容")
          return false
        }
        let id = ''
        if (this.$route.query.id) {
          id = this.$route.query.id
        } else {
          id = this.commodityId
        }
         var params = {
          id: id,
          goodsDetailMsg: this.form.content
        }
        var res = await http.post(api.commodityupdate,params)
        if (res.data.code === 0) {
          this.$message.success("保存成功")
          this.selectTab = 'album'
          this.Isbase = false
          this.Isdescribe = false
          this.IsAlbum = true
          this.Isstock = false
        } else {
          this.$message.error(res.data.mnessage)
        }
      },
      categorydetail: async function() {
        var params = {
          id: this.$route.query.id
        }
        var res = await http.post(api.commoditydetail,params)
        if (res.data.code === 0) {
          this.form.content = res.data.data.goodsDetailMsg
        } else {
          this.$message.error(res.data.message)
        }
      },
      step3() {
        this.selectTab = 'describe'
      },
      save3() {
        this.selectTab = 'stock'
      },
      step4() {
        this.selectTab = 'album'
      },
      save4() {

      },
      shelf() {

      },
      handleAvatarSuccess1(response) {
        var vm = this
        vm.$refs.myTextEditor.quill.insertEmbed(vm.addImgRange !== null ? vm.addImgRange.index : 0, 'image', response.data, Quill.sources.USER)
      },
      handleClicks(tab) {
        let tabName = tab.name
        this.selectTab = tabName
        if (this.$route.query.type === 0) {
          if (this.selectTab == 'base') {
            this.IsAlbum = false
            this.Isbase = true
            this.Isdescribe = false
            this.Isstock = false
          }
          if (this.selectTab == 'describe') {
            this.IsAlbum = false
            this.Isbase = false
            this.Isdescribe = true
            this.Isstock = false
          }
          if (this.selectTab == 'album') {
            this.IsAlbum = true
            this.Isbase = false
            this.Isdescribe = false
            this.Isstock = false
          }
          if (this.selectTab == 'stock') {
            this.IsAlbum = false
            this.Isbase = false
            this.Isdescribe = false
            this.Isstock = true
          }

        }
      },
    }
}
</script>
<style>
.test-area-editor img{
  max-width: 100%;
}
</style>
<style scoped>
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
  }
  .test-area {
  width: 400px;
  min-height: 150px;
  max-height: auto;
  background-attachment: #f7f7f7;
  border: 1px solid #e5e5e5;
  padding: 5px;
  padding-top: 20px;
  outline: none;
  /* resize: none; */
}
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .quill-editor{
  min-height:500px;
}
</style>

<style scoped>
test-area {
  width: 400px;
  min-height: 150px;
  max-height: auto;
  background-attachment: #f7f7f7;
  border: 1px solid #e5e5e5;
  padding: 5px;
  padding-top: 20px;
  outline: none;
  /* resize: none; */
}
.desc{
  display: flex;
  min-height: 500px;
  justify-content: flex-start;
}
/* .quill-editor-example{
  min-height: 500px;
} */
.cropper-content .cropper{
  width: auto;
  height: 300px;
  }
  .ql-container {
    height: 500px;
  }
  .ql-editor{
  min-height:500px;
}
  /* .stock{
    height: 50px;
    overflow: hidden;
  }
  .stock div{
    float: left;
    width:100px;
    height:30px;
   line-height: 30px;
  }
  .stock div:nth-child(2) {
    border:1px solid #ECECEC;
  } */
  .el-tabs__content{
    position: relative;
  }
  .btnsl{
    position: absolute;
    right: 0;
  }
  .btn1{
    margin: 20px;
  }
</style>



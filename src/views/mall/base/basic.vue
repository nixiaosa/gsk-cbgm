<template>
  <div class="basics">
     <el-form ref="form" :model="form" label-width="110px">
          <el-form-item label="商品品类:">
              <el-select v-model="form.categoryName" placeholder="请选择商品类型" :disabled="isdisabled">
              <el-option  v-for="item in options" :key="item.id" :label="item.categoryName" :value="item.categoryName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品名称:">
            <el-input v-model="form.name" style="width: 200px;" :readonly="isreadonly"></el-input>
          </el-form-item>
          <el-form-item label="商品封面:">
            <el-upload class="avatar-uploader" id="contentimg1" :action="upimgurl" :headers="token" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" width="200" height="200">
              <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
              <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
              <div class="el-upload__tip" slot="tip" style="margin-left:70px">格式：图片格式 jpg, gif, png 最小尺寸：450X800</div>
            </el-upload>
          </el-form-item>
          <el-form-item label="兑换所需积分:">
            <el-input v-model="form.point" style="width: 200px;" :readonly="isreadonly"></el-input>
          </el-form-item>
          <!-- <el-form-item label="是否线下发货:">
            <el-radio-group v-model="form.isOfflineDelivery" :disabled="isdisabled">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item> -->
       <el-form-item label="每人兑换数量:">
         <el-input v-model="form.convertibleNum" style="width: 200px;" :readonly="isreadonly"></el-input>
       </el-form-item>
           <el-form-item label="是否卡券:">
            <el-radio-group v-model="form.isCard" :disabled="isdisabled">
              <el-radio :label="1">是,线上发货</el-radio>
              <el-radio :label="0">否,线下发货</el-radio>
            </el-radio-group>
          </el-form-item>
      </el-form>
       <el-button type="success" class="btn1" @click="save" v-if="type!==0">保存并下一步</el-button>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { isnumber } from '@/utils/validate'
import userapi from '@/api/login1'
export default {
  name: 'basic',
  data() {
    return {
      upimgurl: api.uploadImg,
      token: { Authorization: localStorage.getItem('yibai_token_c'),'Remote-Host': window.localStorage.getItem('locationHost') },
      selectTab: 'describe',
      options: [],
      isreadonly: false,
      isdisabled: false,
      nickname: '',
      basicId: '',
      goods: {
        name: ''
      }
    }
  },
  props: {
    form: {
      type: Object
    },
    commodityId: '',
    id:{
      type: Number
    },
    type:{
      type: Number
    }
  },
  mounted() {
    this.categoryList()
    if (this.$route.query.type == 0 || this.$route.query.type == 1) {
      this.commoditydetail()
    }
    this.getUser()
    if (this.$route.query.type == 0) {
        this.isreadonly = true
        this.isdisabled = true
      }
    if (this.$route.query) {
      if (this.$route.query.type == 1) {
        this.isdisabled = true
      }
    }
  },
  methods:{
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = res.data
    },
    categoryList: async function() { // 获取列表
      var params1 = {
        pageNum: 1,
        pageSize: 1000,
        params: {
          isDeleted: 0
        }
      }
      var res = await http.post(api.categoryList,params1)
      if (res.data.code === 0) {
        this.options = res.data.data.list

      } else {
        this.$message.error(res.data.message)
      }
    },
     getUser: async function() {
        http.get(userapi.getuserinfo, {}).then(res => {
          if (res.data.code === 0) {
            this.nickname = res.data.data.nickname
          }
        })
          .catch(err => {
            this.$message.error(err.data.message)
          })
    },
    commoditydetail: async function () { // 查看详情
     let id = this.id
      var params = {
        id: id
      }
      var res = await http.post(api.commoditydetail,params)
      if (res.data.code === 0) {
        if (res.data.data) {
        this.form.name = res.data.data.goodsName
        this.form.imageUrl = res.data.data.goodsImgCover
        this.form.point = res.data.data.integral
        this.form.isOfflineDelivery = res.data.data.isOfflineDelivery
        this.form.isCard = res.data.data.isCard
          this.form.convertibleNum = res.data.data.convertibleNum
        this.form.categoryName = res.data.data.goodsCategoryName
        }
      } else {
        this.$message.error(res.data.message)
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
    save() {
      if (this.form.status === '' || this.form.status === null) {
        this.$message.error("请选择商品类型")
        return false
      }
      if (this.form.name === '' || this.form.name === null) {
        this.$message.error("商品名称不能为空")
        return false
      }
      if (this.form.imageUrl === '' || this.form.imageUrl === null) {
        this.$message.error("商品封面不能为空")
        return false
      }
      if (this.form.point === '' || this.form.point === null) {
        this.$message.error("兑换所需积分不能为空")
        return false
      }
      if (this.form.convertibleNum === '' || this.form.convertibleNum === null) {
        this.$message.error("每人兑换数量不能为空" )
        return false
      }
      if (!isnumber(this.form.point)) {
        this.$message.error("兑换所需积分请输入纯数字")
        return false
      }
      // if (this.form.isOfflineDelivery === '' || this.form.isOfflineDelivery === null) {
      //   this.$message.error("请选择是否线下发货")
      //   return false
      // }
      if (this.form.isCard === '' || this.isCard === null) {
        this.$message.error("请选择是否卡券")
        return false
      }
      if (this.$route.query.type == 1) {
        this.commodityupdate()
      } else {
        if (this.commodityId && this.commodityId !== '') {
          this.commodityupdate()
        } else {
          this.commodityadd()
        }
      }
    },
    commodityupdate: async function() {
      let id = ''
      if (this.commodityId) {
        id = this.commodityId
      } else {
        id = this.id
      }
        var params = {
        id: id,
        isCard: this.form.isCard,
        goodsImgCover: this.form.imageUrl,
        goodsName: this.form.name,
        integral: this.form.point,
        goodsCategoryName: this.form.categoryName,
        goodsCategoryId: '',
        convertibleNum: this.form.convertibleNum,
        updatedBy: this.nickname
      }
      this.options.forEach(element => {
        if (element.categoryName == this.form.categoryName) {
          params.goodsCategoryId = element.id
        }
      })
       if (this.form.isCard == 1) {
        params.isOfflineDelivery = 0
      } else if (this.form.isCard == 0) {
        params.isOfflineDelivery = 1
      }
      var res = await http.post(api.commodityupdate,params)
       if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.basicId = res.data.data
        this.$emit('selectTab1', this.selectTab)
      } else {
        this.$message.error(res.data.message)
      }
    },
    commodityadd: async function() {
      var params = {
        isCard: this.form.isCard,
        goodsImgCover: this.form.imageUrl,
        goodsName: this.form.name,
        integral: this.form.point,
        goodsCategoryName: this.form.categoryName,
        goodsCategoryId: '',
        createdBy: this.nickname,
        updatedBy: this.nickname,
        convertibleNum: this.form.convertibleNum
      }
      this.options.forEach(element => {
        if (element.categoryName == this.form.categoryName) {
          params.goodsCategoryId = element.id
        }
      })
      if (this.form.isCard == 1) {
        params.isOfflineDelivery = 0
      } else if (this.form.isCard == 0) {
        params.isOfflineDelivery = 1
      }
      var res = await http.post(api.commodityadd,params)
      if (res.data.code === 0) {
        this.$message.success(res.data.message)
        this.basicId = res.data.data
        this.$emit('goodsId',this.basicId)
        this.$emit('selectTab1', this.selectTab)
      } else {
        this.$message.error(res.data.message)
      }
    }
  }
}
</script>
<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>



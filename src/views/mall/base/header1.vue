<template>
  <div class="commoditys">
    <el-form label-width="110px" :label-position="labelPosition">
      <el-form-item v-for="(item,index) in itemDatas" :label="item.label" :key="index" prom="name" style="float:left;">
        <el-select v-model="form.goodsCategoryId" placeholder="请选择" v-if="item.label=='商品品类:'" style="margin-left:-41px;">
          <el-option v-for="(item,index1) in option" :key="index1" :label="item.categoryName" :value="item.id">
          </el-option>
        </el-select>
          <el-select v-model="form.status" placeholder="请选择" v-if="item.label=='商品状态:'" style="margin-left:-41px;">
          <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status">
          </el-option>
        </el-select>
         <el-input :placeholder="item.placeholder" v-if="item.label=='商品名称:'" v-model="form.goodsName" style="margin-left:-41px;width:180px;"></el-input>
         <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd" v-if="item.label=='添加时间:'" v-model="form.startTime" @change="startTimes" style="margin-left:-41px;">
        </el-date-picker>
         <span v-if="item.label=='添加时间:'" style="color: #fff">-</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd" v-if="item.label=='添加时间:'" v-model="form.endTime" @change="endTimes">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content'
export default {
  components: {
    HeaderContent
  },
  data() {
    return {
      labelPosition: 'left'
    }
  },
  props: {
    itemDatas: {
      type: Array
    },
    options: {
      type: Array
    },
    option: {
      type: Array
    },
    form: {
      type: Object
    },
  },
  methods: {
    endTimes() {
      if (this.form.endTime.getFullYear) {
        let Year = this.form.endTime.getFullYear()
        let Month = this.form.endTime.getMonth() + 1
        let getDate = this.form.endTime.getDate()
        this.form.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime()
      }
    },
    startTimes() {
      this.form.startTime = Date.parse(this.form.startTime)
    }
  }
}
</script>
<style>
.commoditys .el-form{
  height: 90px;
  overflow: hidden;
  position: relative;
}
.commoditys .el-form .el-form-item:nth-child(4){
  position: absolute;
  top: 50px;
  left: 0;
}
.commoditys .el-form .el-form-item{
  margin-right: 30px;
}
</style>

<style scoped>
.commoditys {
  height: 90px;
  overflow: hidden;
}
.commoditys .to {
  margin: 0 5px;
  float: left;
}
</style>



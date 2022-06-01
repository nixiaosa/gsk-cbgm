<template>
  <div id="bigbox">
    <el-form  class="demo-form-inline" :inline="true">
      <el-form-item v-for="(item,index) in itemDatas" :label="item.label" :key="index" prom="name" style="margin-right:30px;">
        <!--名称-->
        <el-input v-show="item.type == 'title'" :placeholder="item.placeholder" v-model="form.title" style="width: 180px;"></el-input>
        <!--创建者-->
        <el-input v-show="item.type == 'createUser'" :placeholder="item.placeholder" v-model="form.nickname" style="width: 180px;"></el-input>
        <!-- 时间周期 -->
        <el-date-picker type="date" v-show="item.type == 'timeScope'" placeholder="选择开始时间" format="yyyy-MM-dd" v-model="form.startTime" @change="startTimes" style="width: 180px;">
        </el-date-picker>
        <span class="to" v-show="item.type == 'timeScope'">至</span>
        <el-date-picker v-show="item.type == 'timeScope'" type="date" placeholder="选择结束时间" format="yyyy-MM-dd" v-model="form.endTime" @change="endTimes" style="width: 180px;">
        </el-date-picker>
        <!--状态选择-->
        <el-select v-show="item.type == 'status'" v-model="form.status" placeholder="请选择" style="width: 180px;">
          <el-option v-for="item in options" :key="item.status" :label="item.label" :value="item.status">
          </el-option>
        </el-select>
      </el-form-item>
      <el-button @click="searchBtn" type="info" class="querys">查询</el-button>
    </el-form>
  </div>
</template>
<script>
  export default {
    props: {
      itemDatas: {
        type: Array
      }
    },
    data() {
      return {
        form: {
          title: '',
          nickname: '',
          startTime: '',
          endTime: '',
          status: ''
        },
        options: [
          {
            status: '',
            label: '全部'
          },
          {
            status: -1,
            label: '未发布'
          },
          {
            status: 0,
            label: '未开始'
          },
          {
            status: 1,
            label: '进行中'
          },
          {
            status: 2,
            label: '已结束'
          }
        ]
      }
    },
    methods: {
      searchBtn() {
        this.$emit('change', this.form)
      },
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
        if (this.form.startTime.getFullYear) {
          let Year = this.form.startTime.getFullYear()
          let Month = this.form.startTime.getMonth() + 1
          let getDate = this.form.startTime.getDate()
          this.form.startTime = new Date(
            `${Year}/${Month}/${getDate} 23:59:59`
          ).getTime()
        }
      }
    }
  }
</script>
<style scoped>
  .querys {
    /*position: absolute;*/
    /*top: 140px;*/
    /*right: 20px;*/
  }
  #bigbox {
    margin-bottom: 20px;
  }
  #bigbox .to {
    color: #ffffff;
    margin: 0 5px;
  }
</style>



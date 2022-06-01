<template>
  <div class="modelist">
    <header-content title="推送管理"></header-content>
    <div class="wrap-box">
      <div class="top-message">
        <p>第一步：在微信公众平台，申请开通【模板消息】。提交申请信息，等待微信平台审核。</p>
        <p>第二步：审核通过后，方可使用以下模板消息。</p>
      </div>
      <el-form :inline="true" :model="form" class="demo-form-inline">
        <el-form-item label="推送模板:">
          <el-select v-model="form.type" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item  label="会议名称:">
          <el-input style="width:300px" v-model="form.name" placeholder="请输入会议名称" clearable></el-input>
        </el-form-item>
        <el-form-item  label="会议时间:">
          <el-date-picker
            v-model="startTime"
            format="yyyy-MM-dd HH:mm"
            value-format="timestamp"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            >
        </el-date-picker>
        </el-form-item>
        <el-form-item  label="备注:">
          <el-input style="width:300px" v-model="form.remark" placeholder="请输入备注" clearable></el-input>
        </el-form-item>
        <el-form-item  label="详情链接url地址:">
          <el-input style="width:300px" v-model="form.detailUrl" placeholder="请输入详情链接url地址" clearable></el-input>
        </el-form-item>
      </el-form>
      <div class="example-title">样例</div>
      <div class="example-box">
        <div>会议提醒</div>
        <div class="example-info">精彩直播已经开始！</div>
        <div class="example-cont fn-clear">
          <span>会议名称：</span>
          <p>湖南省医学会心血管病学专业委员会心脏重症学组2021年年会暨湖南省心脏重症病例大赛</p>
        </div>
        <div class="example-cont fn-clear">
          <span>会议时间：</span>
          <p>2021-12-26 08:30至2021-12-26 12:30</p>
        </div>
        <div class="example-cont fn-clear">
          <span>备注：</span>
          <p style="color:#f00">观看直播，请点击进入！</p>
        </div>
        <div class="godetail">查看详情<i class="el-icon-arrow-right"></i></div>
      </div>
    </div>
    
    <el-button type="primary" :disabled="saveDisabled" @click="onSubmit">发送</el-button>
    <!-- <el-button style="margin-left:10px">取消</el-button> -->
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { mapGetters } from "vuex";
import { setTimeout } from 'timers';
export default {
  data() {
    return {
      saveDisabled: false,
      startTime: '',
      endTime: '',
      options: [{
          value: 1,
          label: '会议提醒'
        }],
      form: {
        name: '',
        type: 1,
        remark:'',
        detailUrl:''
      }
    };
  },
  mounted() {
    this.templateChange();
  },
  methods: {
    onSubmit: async function(){
      this.saveDisabled = true
      if(!this.form.name){
        this.$message.error("请填写会议名称");
        return false
      }
      if(!this.startTime){
        this.$message.error("请填写会议时间");
        return false
      }
      if(!this.form.remark){
        this.$message.error("请填写备注");
        return false
      }
      if(!this.form.detailUrl){
        this.$message.error("请填写详情链接url地址");
        return false
      }
      let params = {}
        params = {
          companyId: this.companyid,
          type: 1,
          name: this.form.name,
          startTime: this.startTime[0],
          endTime: this.startTime[1],
          params1: '精彩直播即将开始',
          detailUrl: this.form.detailUrl,
          remark: this.form.remark
        };
        const res = await http.post(api.templateMessageSend,params);
        if (res.data.code === 0) {
          this.$message.success("设置成功");
        } else {
          this.$message.error(res.data.message);
          this.saveDisabled = false
        }
    },
    templateChange(){
      this.startTime = ''
      this.form.name = ''
      this.form.remark = ''
      this.form.detailUrl = ''
    }
  },
  computed: {
    ...mapGetters(["companyid"])
  },
  components: {
    HeaderContent
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.wrap-box{
  position: relative;
  clear: both;
  padding: 0 0 250px 0;
}
.el-form--inline .el-form-item {
  display: block;
}
::v-deep .el-form--inline .el-form-item__label {
    width: 200px;
}
.fn-clear:after {
  visibility: hidden;
  display: block;
  font-size: 0;
  content: " ";
  clear: both;
  height: 0;
}
.fn-clear {
  zoom: 1; /* for IE6 IE7 */
}
.example-title{
  position: absolute;
  width: 300px;
  right: 240px;
  top:120px;
  text-align: center;
}
.example-box{
  border: 1px solid #ccc;
  position: absolute;
  width: 300px;
  right: 240px;
  top:150px;
  padding: 20px 20px 0 20px;
  font-size: 14px;
  .example-info{
    margin-top: 20px;
    color: #666666;
  }
  .example-cont{
    clear: both;
    margin-top: 20px;
    overflow: hidden;
    span{
      display: block;
      width: 75px;
      float: left;
      color: #666666;
      line-height: 1.5;
    }
    p{
      width: 180px;
      float: right;
      line-height: 1.5;
      margin: 0;
      padding: 0;
    }
  }
  .godetail{
    border-top: 1px solid #ccc;
    margin: 20px -20px 0;
    padding: 15px 20px;
    i{
      color: #666666;
      float: right
     }
  }
}
.top-message{
  border-bottom: 1px solid #ccc;
  margin-bottom: 20px;
  p{
    font-size: 14px;
    margin-bottom: 30px;
    line-height: 1;
  }
}
</style>

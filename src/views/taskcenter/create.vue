<template>
  <div id="list">
    <header-content :title="headerTitle"></header-content>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <div id="top">
        <el-form-item label="任务类型" required>
        <div class="test">实名注册任务</div>
        <div class="tishi" style="height:20px;color:#ccc;">
            提示：新用户自注册完成，符合平台身份用户将获得设置的积分奖励
        </div>
      </el-form-item>
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入内容,最多可输入100字符" style="width:430px;"></el-input>
      </el-form-item>
      <el-form-item label="任务周期" required>
        <div class="infor-content" style="">
          <el-form-item prop="date1">
          <el-date-picker
            v-model="startTime"
            type="date"
            placeholder="选择开始时间">
          </el-date-picker>
          </el-form-item>
        </div>
        <span  style="float:left;margin:0 20px;color: #fff">-</span>
        <div class="infor-content">
          <el-form-item prop="date2">
          <el-date-picker
          v-model="endTime"
          type="date"
          placeholder="选择结束时间">
          </el-date-picker>
        </el-form-item>
        </div>
      </el-form-item>
      </div>
      <div class="content" style="height:400px;">
        <el-form-item label="关联对象" prop="name"  label-width="130px" style="margin:30px 0;">
          <el-button style="margin-left:60px;" type="info" @click="add()">添加领取条件</el-button>
        </el-form-item>
        <div class="wraper">
          <el-form-item label="选择任务" prop="name" style="float:left;margin-top:30px;">
            <el-select v-model="value8" filterable placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="业务内容"  style="display:block;position:absolute;top:120px;left:0;" prop="Everyone">
            <el-button type="info" size="small" @click="business()">选择业务内容</el-button>
          </el-form-item>
        </div>
      </div>
      <div class="content" style="height:400px;">
        <el-form-item label="注册者领取条件" prop="name"  label-width="130px" style="margin:30px 0;">
          <el-button style="margin-left:60px;" type="info">添加领取条件</el-button>
        </el-form-item>
         <div class="wraper">
          <el-form-item label="领取身份" prop="name" style="float:left;margin-top:30px;">
            <el-select v-model="value8" filterable placeholder="请选择">
              <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <!--<el-form-item label="领取人数" prop="num" style="float:left;margin:30px 0 0 150px;">-->
            <!--<el-input v-model="ruleForm.num" placeholder="请输入内容,最多可输入100字符" style="width:430px;"></el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="每人领取"  style="display:block;position:absolute;top:120px;left:0;" prop="Everyone">
            <el-input  placeholder="请输入内积分" style="width:430px;" v-model="ruleForm.Everyone"></el-input>
          </el-form-item>
        </div>
      </div>
      <div id="bottom">
        <el-form-item label="简介信息:" >
          <textarea class="test-area" placeholder="请输入任务简介信息，最多可输入100字符"></textarea>
        </el-form-item>
        <el-form-item label="发放总积分" prop="name">
        <div class="test" style="margin-left:60px;">0积分</div>
        <div id="clos">积分不足,请联系管理员充值</div>
        <div class="tishi" style="height:20px;color:#ccc;margin-left:60px;">
          当前账户余额：1200分
        </div>
    </el-form-item>
    </div>
    </el-form>
    <div id="btns">
      <el-button type="info" style="width:150px;">保存</el-button>
      <el-button type="info" style="width:150px;">发布</el-button>
      <el-button type="danger" style="width:150px;">取消</el-button>
    </div>
    <!--选择业务内容详情-->
    <el-dialog
      :visible.sync="details"
      width="30%"
      center>
      <!--<el-form :label-position="labelPosition" label-width="100px" >-->
        <!--<el-form-item label="标题：">-->
          <!--<span>djjjdsjjds</span>-->
        <!--</el-form-item>-->
      <!--</el-form>-->
      <!--<span slot="footer" class="dialog-footer">-->
        <!--<el-button @click="details = false">关 闭</el-button>-->
        <!--&lt;!&ndash; <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button> &ndash;&gt;-->
      <!--</span>-->
      业务内容详情页
    </el-dialog>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  export default {
    components: {
     HeaderContent
    },
    data() {
      return {
        headerTitle: '任务中心->分享任务列表->创建任务',
        ruleForm: {
          name: '',
          region: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          desc: ''
        },
        labelPosition: 'right',
        details: false,
        startTime: '',
        startTimeValue: '',
        endTime: '',
        endTimeValue: '',
         options: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }, {
          value: '选项3',
          label: '蚵仔煎'
        }, {
          value: '选项4',
          label: '龙须面'
        }, {
          value: '选项5',
          label: '北京烤鸭'
        }],
        value8: '',
        rules: {
          name: [
            { required: true, message: '请输入任务名称', trigger: 'blur' },
            { max: 100, message: '请输入内容,最多可输入100字符', trigger: 'blur' }
          ],
          num:[
             { required: true, message: '领取人数不能为空', trigger: 'blur' },
          ],
          Everyone:[
              { required: true, message: '请输入内容', trigger: 'blur' },
          ],
          region: [
            { required: true, message: '请选择活动区域', trigger: 'change' }
          ],
          // date1: [
          //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
          // ],
          // date2: [
          //   { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
          // ],
          type: [
            { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
          ],
          resource: [
            { required: true, message: '请选择活动资源', trigger: 'change' }
          ],
          desc: [
            { required: true, message: '请填写活动形式', trigger: 'blur' }
          ]
        },
      };
    },
    methods: {
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      business() {
        this.details = true
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  }
</script>

<style scoped>
  .infor-content{
    float: left;
  }
  #top{
    border-bottom: 1px solid #ccc;
  }
  .content{
    border-bottom: 1px solid #ccc;
  }
  .wraper{
    height: 220px;
    border:1px solid #ccc;
    margin-left: 20px;
    overflow: hidden;
    position: relative;
  }
  #bottom{
    height:500px;
    position: relative;
  }
  .test-area{
    width: 100%;
    height: 300px;
    background: #f7f7f7;
    border:1px solid #e5e5e5;
    padding:5px;
    padding-top:20px;
    outline:none;
    margin: 60px 0 0 -70px;
  }
  #ts{
    display:inline-block;
  }
  #clos{
    position:absolute;
    top:0;left:200px;
    color:red;
  }
  #btns{
    width:600px;
    height: 200px;
    margin:80px 0 0 30px;
  }
</style>

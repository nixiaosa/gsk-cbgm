<template>
  <div id="list">
    <header-content :title="headerTitle"></header-content>
    <el-form  label-width="100px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <div id="top">
        <div id="tishi" style="height:20px;color:#ccc;margin: 20px;">
          提示：平台设定“分享”任务；对 “ 直播/点播/文章/ ”设定积分发放条件；用户本身给其他用户分享内容，被成功观看后，并且用户本身达到设定条件即可领取积分。
        </div>
        <el-form-item label="任务类型:">
          <div id="test">实名注册任务</div>
        </el-form-item>
        <el-form-item label="任务名称:">
          <span>分享任务</span>
        </el-form-item>
        <el-form-item label="任务周期:">
          <span>2018 12：30 到 2018 2:30</span>
        </el-form-item>
      </div>
      <div class="content" style="height:280px;">
        <el-form-item label="关联对象:" prop="name"  label-width="130px" style="margin:30px 0;">
        </el-form-item>
        <div class="wraper">
          <el-form-item label="选择业务:" prop="name" style="float:left;margin-top:30px;">
            <span>学术会议</span>
          </el-form-item>
          <el-form-item label="业务内容:"  style="display:block;position:absolute;top:120px;left:0;" prop="Everyone">
            <div>《心血管大会-1》</div>
            <div>《心血管大会-1》</div>
          </el-form-item>
        </div>
      </div>
      <div class="content" style="height:400px;border-bottom: none;">
        <el-form-item label="分享者条件:" prop="name"  label-width="130px" style="margin:30px 0;">
        </el-form-item>
        <div class="wraper">
          <el-form-item label="领取条件1:"></el-form-item>
          <el-form-item label="领取身份:">
            <span>30积分</span>
          </el-form-item>
          <el-form-item label="领取人数:">
            <span>30积分</span>
          </el-form-item>
          <el-form-item label="每人领取:">
            <span>30积分</span>
          </el-form-item>
        </div>
        <el-form-item label="发放总积分:" prop="name">
         <span style="color:orange;">2000积分</span>
        </el-form-item>
        <el-form-item label="活动状态:" prop="name">
          <span style="color:forestgreen;">进行中</span>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  export default {
    name: 'details',
    components: {
      HeaderContent
    },
    data() {
      return {
        headerTitle: '任务中心->分享任务列表->查看详情',
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
  #top{
    border-bottom: 1px solid #ccc;
  }
  .wraper{
    width: 90%;
    height: 220px;
    border: 1px solid #ccc;
    margin-left: 20px;
    overflow: hidden;
    position: relative;
  }
</style>

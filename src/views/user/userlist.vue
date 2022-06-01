<template>
  <div class="user-container">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick" v-if="userAuths.back_user_add"></header-content>
    <header-content :title="headerTitle" v-if="!userAuths.back_user_add"></header-content>
    <p class="red-tips">提示：添加用户完成后，请点击“角色设置”为用户匹配对应角色&nbsp;&nbsp;&nbsp;</p>
    <!-- 弹出层1  -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :label-position="labelPosition" label-width="100px" :model="form" ref="form1" :rules="rules1">
        <div class="itemname">平台登录账号</div>
        <el-form-item label="用户名：" prop="userName">
          <el-input v-model="form.userName" @keyup.native="trimLR" placeholder="请输入管理员的用户名，用户名不能小于5位，只能英文与数字"></el-input>
        </el-form-item>
        <!-- <el-form-item label="密码：" prop="password">
          <el-input v-model="form.password" placeholder="密码不能小于6位  示例：123456" type="password"></el-input>
        </el-form-item> -->
        <div class="itemname itemname2">用户信息</div>
        <el-form-item label="上传头像：" width='100'>
          <el-upload
                  class="avatar-uploader"
                  :action="upimgurl"
                  :headers="token"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
            <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
          </el-upload>
          <span style="color: #999">请上传头像尺寸为：400*400图片，效果最佳</span>
        </el-form-item>
        <el-form-item label="手机号：" prop="phone">
          <el-input :maxlength="11" placeholder="请输入管理员的手机号码" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name" placeholder="请输入管理员的姓名"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio class="radio" v-model="form.radio" label="1">男</el-radio>
          <el-radio class="radio" v-model="form.radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email" placeholder="请输入管理员的邮箱"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="adduser()">保 存</el-button>
      </div>
    </el-dialog>
    <!---->
    <!-- 弹出层2  -->
    <el-dialog title="角色设置" :visible.sync="dialoglink">
      <el-form :model="form">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="name" auto-complete="off" :disabled="true"></el-input>
        </el-form-item>
        <el-checkbox-group v-model="checkList">
          <el-checkbox :label="item.id" v-for="item in checkListData" :key="item.id">{{item.label}}</el-checkbox>
        </el-checkbox-group>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialoglink = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="changeUserRole()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 弹出层3 修改用户信息  -->
    <el-dialog title="修改信息" :visible.sync="userAccountInfo">
      <el-form :label-position="labelPosition" label-width="100px" :model="form" :rules="rules3" ref="form3">
        <el-form-item label="上传头像：" width='100'>
          <el-upload
                  class="avatar-uploader"
                  :action="upimgurl"
                  :headers="token"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
            <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar">
            <!-- <i v-else class="el-icon-plus avatar-uploader-icon"></i> -->
            <i v-else class="el-icon-plus avatar-uploader-icon iconfont icon-zengjia"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="性别：">
          <el-radio class="radio" v-model="form.radio" label="1">男</el-radio>
          <el-radio class="radio" v-model="form.radio" label="2">女</el-radio>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="userAccountInfo = false">取 消</el-button>
        <el-button type="primary" @click.native.prevent="update()">保 存</el-button>
      </div>
    </el-dialog>
    <!---->
    <el-table
            :data="tableData"
            border
            @selection-change="handleSelectionChange">
      <el-table-column
              label="账户名">
        <template  slot-scope="scope">
          <span>{{ scope.row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="姓名" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="性别"
              width="70">
        <template slot-scope="scope">
          <span>{{ scope.row.sex === 'man' ? '男' : '女' }}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="手机号"
              width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="邮箱"
              width="240">
        <template slot-scope="scope">
          <span>{{ scope.row.email }}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="角色">
        <template slot-scope="scope">
          <span>{{scope.row.roleList | roletostring}}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="创建日期"
              width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column
              label="状态"
              width="80">
        <template slot-scope="scope">
          <span>{{scope.row.isdelete === 0 ? '正常' : '停用'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="250" fixed="right">
        <template slot-scope="scope">
          <el-button
                  size="small"
                  v-if="userAuths.back_user_update"
                  @click="handleEdit(scope.row.id)">编辑</el-button>
          <el-button
                  size="small"
                  @click="editrole(scope.$index, scope.row)" v-if="scope.row.username!=='admin' && userAuths.back_user_role_set">角色设置</el-button>
          <el-button
                  size="small"
                  type="danger"
                  @click="handleDelete(scope.row.id)" v-if="scope.row.username!=='admin' && userAuths.back_user_stop_start">启停</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="height:20px"></div>
    <el-pagination
            background
            @current-change="handleCurrentChange"
            layout="total, prev, pager, next"
            :total="listTotal">
    </el-pagination>
  </div>
</template>

<script>
  import http from '@/utils/tenant'
  import userapi from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  // import md5 from 'js-md5'
  import api from '@/api/tenantInfoSave'
  import { mapGetters } from 'vuex'
  import HeaderContent from '@/components/header-content'
  import { enoughLength, checkPhone, checkEmail, validatName, egandnum } from '@/utils/validate'
  export default {
    components: {
      HeaderContent
    },
    data() {
      const validateUsername = (rule, value, callback) => {
        /* if (!isvalidUsername(value)) {
          callback(new Error('请输入正确的用户名'))
        } else  */
        if (!enoughLength(value, 5)) {
          callback(new Error('用户名不能小于5位'))
        } else if (!egandnum(value)) {
          callback(new Error('用户名只能出现英文与数字'))
        } else {
          callback()
        }
      }
      // const validatePass = (rule, value, callback) => {
      //   if (!enoughLength(value, 6)) {
      //     callback(new Error('密码不能小于6位'))
      //   } else {
      //     callback()
      //   }
      // }
      const validatePhone = (rule, value, callback) => {
        if (!checkPhone(value)) {
          callback(new Error('手机号码格式有误'))
        } else {
          callback()
        }
      }
      const validateEmail = (rule, value, callback) => {
        if (!checkEmail(value)) {
          callback(new Error('邮箱格式有误'))
        } else {
          callback()
        }
      }
      const validateRealName = (rule, value, callback) => {
        if (!validatName(value)) {
          callback(new Error('姓名只能包括汉字和英文'))
        } else if (!enoughLength(value, 2)) {
          callback(new Error('姓名位数不能小于2位'))
        } else {
          callback()
        }
      }
      return {
        headerTitle: '用户列表',
        opertions: ['添加用户'],
        multipleSelection: [],
        upimgurl: api.uploadImg,
        token: { Authorization: localStorage.getItem('yibai_token_s'), 'Remote-Host': window.localStorage.getItem('locationHost') },
        labelPosition: 'right',
        tableData: [],
        listTotal: 10,
        searchVal: '',
        userAccountInfo: false,
        dialogFormVisible: false,
        userId: '',
        pageNum: 1,
        form: {
          userName: '',
          radio: '1',
          phone: '',
          name: '',
          sex: '',
          email: '',
          // password: '',
          imageUrl: ''
        },
        formLabelWidth: '70px',
        dialoglink: false,
        name: '',
        checkList: [],
        checkListData: [],
        id: '',
        rules1: {
          userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
          // password: [{ required: true, trigger: 'blur', validator: validatePass }],
          phone: [{ required: true, trigger: 'blur', validator: validatePhone }],
          email: [{ required: true, trigger: 'blur', validator: validateEmail }],
          name: [{ required: true, trigger: 'blur', validator: validateRealName }]
        },
        rules3: {
          email: [{ required: true, trigger: 'blur', validator: validateEmail }],
          name: [{ required: true, trigger: 'blur', validator: validateRealName }]
        }
      }
    },
    methods: {
      trimLR() {
        this.form.userName = this.form.userName.replace(/\ +/g, "")
      },
      headerClick() {
        this.dialogFormVisible = true
        this.emptyForm()
      },
      handleIconClick(val) {
      },
      handleEdit(id) {
        this.userinfo(id)
      },
      handleDelete(row) {
        this.deleteAdmin(row)
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      deleteAdmin: async function(row) {
        var params = {
          id: row
        }
        const res = await http.post(userapi.deleteAdmin, params)
        if (res.data.code === 0) {
          this.getuserlist(this.pageNum)
        }
      },
      getuserlist: async function(pageNum) { // 获取用户列表
        var params = {
          pageNum: pageNum,
          pageSize: 10
        }
        const res = await http.post(userapi.getuserlist, params)
        if (res.data.code === 0) {
          this.listTotal = res.data.data.total
          this.tableData = res.data.data.list
        }
      },
      changeUserRole: async function() {
        var params = {
          roleidList: this.checkList,
          userId: this.id
        }
        const res = await http.post(userapi.userVsRole, params)
        if (res.data.code === 0) {
          this.getuserlist(this.pageNum)
          alert('用户角色关联成功')
          this.id = ''
          this.dialoglink = false
        } else {
          this.getuserlist(this.pageNum)
          alert('用户角色关联失败')
          this.dialoglink = false
        }
      },
      editrole: async function(index, row) {
        this.checkList = []
        this.id = row.userId
        this.dialoglink = true
        this.name = row.username
        var params = {
          userId: row.userId
        }
        const res = await http.post(userapi.getUserRole, params)
        if (res.data.code === 0) {
          var array = res.data.data
          var arrayrole = []
          for (var i = 0; i < array.length; i++) {
            if (array[i].role !== '总权限') {
              arrayrole.push(array[i])
            }
          }
          this.checkList = arrayrole
        }
      },
      /**
       * 修改 获取账号信息
       */
      userinfo: async function(id) {
        this.userId = id
        this.userAccountInfo = true
        var params = {
          id: id
        }
        const res = await http.post(userapi.userinfo, params)
        if (res.data.code === 0) {
          var data = res.data.data
          this.form.imageUrl = data.photo
          this.form.name = data.nickname
          this.form.email = data.email
          this.form.radio = data.sex === 'man' ? '1' : '2'
        } else {
          this.error(res.data.message)
        }
      },
      /**
       * 保存修改信息
       */
      updateinfo: async function() {
        var paramsSex = this.form.radio === '1' ? 'man' : 'woman'
        var params = {
          email: this.form.email,
          id: this.userId,
          nickname: this.form.name,
          photo: this.form.imageUrl,
          sex: paramsSex
        }
        const res = await http.post(userapi.update, params)
        if (res.data.code === 0) {
          this.userAccountInfo = false
          this.getuserlist(this.pageNum)
          this.success('修改成功')
        } else {
          this.error(res.data.message)
        }
      },
      update: async function(id) {
        this.$refs.form3.validate(valid => {
          if (valid) {
            this.updateinfo(id)
          }
        })
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getuserlist(val)
      },
      adduserone: async function() {
        var paramsSex = this.form.radio === '1' ? 'man' : 'woman'
        var params = {
          companyUser: {
            phone: this.form.phone,
            username: this.form.userName
          },
          companyUserInfo: {
            email: this.form.email,
            nickname: this.form.name,
            phone: this.form.phone,
            photo: this.form.imageUrl,
            sex: paramsSex
          }
        }
        const res = await http.post(userapi.adduser, params)
        if (res.data.code === 0) {
          this.success('添加用户成功')
          this.dialogFormVisible = false
          this.getuserlist(this.pageNum)
          this.emptyForm()
        } else {
          this.error(res.data.message)
        }
      },
      adduser() {
        this.$refs.form1.validate(valid => {
          if (valid) {
            this.adduserone()
          }
        })
      },
      // 获取图片地址
      handleAvatarSuccess(res) {
        this.form.imageUrl = res.data
      },
      beforeAvatarUpload(file) {
        const isJPG =
                file.type === 'image/jpeg' ||
                file.type === 'image/png' ||
                file.type === 'image/gif'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像只能是jpg、png、gif格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      // 清空表单
      emptyForm() {
        this.form.userName = ''
        this.form.radio = '1'
        this.form.phone = ''
        this.form.name = ''
        this.form.sex = ''
        this.form.email = ''
        this.form.imageUrl = ''
      },
      success(val) {
        this.$message({
          message: val,
          type: 'success'
        })
      },

      warning(val) {
        this.$message({
          message: val,
          type: 'warning'
        })
      },
      error(val) {
        this.$message.error(val)
      },
      getRoleList: async function() {
        var params = {}
        const res = await http.post(userapi.getRoleList, params)
        if (res.data.code === 0) {
          var array = res.data.data.list
          var arrayrole = []
          for (var i = 0; i < array.length; i++) {
            if (array[i].role !== '总权限') {
              arrayrole.push(array[i])
            }
          }
          this.checkListData = arrayrole
        }
      }
    },
    computed: {
      ...mapGetters([
        'userAuths'
      ])
    },
    mounted() {
      this.getuserlist(1)
      this.getRoleList()
    },
    filters: {
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      addAt(nickname) {
        return '@' + nickname + ' '
      },
      roletostring(array) {
        if (array.length === 0) {
          return ''
        } else {
          return array.join(',')
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
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<style scoped>
  .el-input{
    position: absolute;
    top: 0;
    left: 0;
    width:65%;
  }
  .input400 {
    width: 400px;
  }

  .input600 {
    width: 600px;
  }

  .input800 {
    width: 800px;
  }
  .input300 {
    width: 300px;
  }
  .input200 {
    width: 100px;
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
  .user-container-header {
    height: 50px;
    line-height: 50px;
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }
  .el-checkbox-group {
    line-height: 30px;
    overflow: hidden;
  }
  .el-checkbox {
    float: left;
    width: 25%;
    margin: 0;
    padding: 0;
  }
  .itemname{
    font-size:16px;
    color:#000;
    margin-left:14px;
    margin-bottom:15px;
  }
  .itemname2{
    margin-top:35px;
  }
  .red-tips {
    color: red;
    font-size: 14px;
    background-color: $c-theme3 !important;
    padding: 14px 24px;
  }
</style>

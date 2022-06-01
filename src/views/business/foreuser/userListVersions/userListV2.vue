<template>
  <div class="tenementList">
    <!-- <div id="btns">
      <el-button v-for="(list, index) in historyList" type="primary" :key="index">
        <a :href="list.url">导出{{list.businessName}}所有用户</a>
      </el-button>
    </div>-->
    <div>
      <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
        <div>
          <div>{{ errorLists }}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="btnsl">
      <el-row :gutter="20">
        <el-col :span="4">
          <upload-file @change="url => getFile('add_admin', 1, url)" title="批量充值积分"/>
        </el-col>
        <el-col :span="4">
          <upload-file @change="url => getFile('subtract_admin', 1, url)" title="批量消耗积分"/>
        </el-col>
        <el-col :span="4">
          <upload-file @change="url => getFile('add_admin', 0, url)" title="批量充值医币"/>
        </el-col>
        <el-col :span="4">
          <upload-file @change="url => getFile('subtract_admin', 0, url)" title="批量消耗医币"/>
        </el-col>
        <el-col :span="4">
          <el-button
            style="margin-right: 4px"
            size="small"
            @click="windowOpen(0)"
            type="primary"
          >充值模版下载</el-button>
        </el-col>
        <el-col :span="4">
          <el-button @click="windowOpen(1)" size="small" type="primary">消耗模版下载</el-button>
        </el-col>
      </el-row>
      <el-button class="upload-demo-download" @click="downLoad" size="small" type="primary">培训管理者模版下载</el-button>
      <el-upload
            class="upload-demo"
            :accept="accept"
            :multiple="false"
            :show-file-list="false"
            ref="exeUpload"
            action=""
            :on-change="handlePreview"
            :file-list="fileList"
            :auto-upload="false">
          <el-row style="width: 100px">
            <!--              进度条-->
            <el-progress v-if="showUpload" :text-inside="true" :stroke-width="16" :percentage="this.percentageNum"></el-progress>
          </el-row>
           <el-button v-if="!showUpload" slot="trigger" size="small" type="primary">批量添加培训管理者</el-button>
           </el-upload>
    </div>
    <header-content
      :opertions="opertions"
      :title="headerTitle"
      @header-btn-click="headerClick"
      v-if="userAuths.front_user_add"
    ></header-content>
    <div class="tenementBox">
      <el-form :inline="true" :model="anchor">
        <el-form-item label="身份">
          <el-select v-model="anchor.states" @change="selectIdentityList" placeholder="请选择身份">
            <el-option
              v-for="(item,index) in statusList"
              :key="index"
              :label="item.titlename"
              :value="item.titleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="姓名">
          <el-input placeholder="请输入姓名" icon="search" v-model="anchor.nickname" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input
            placeholder="请输入手机号码"
            icon="search"
            v-model="anchor.phone"
            @keyup.enter.native="handlePhoneClick()"
            :on-icon-click="handlePhoneClick"
            auto-complete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="创建时间">
          <el-date-picker
            style="width: 250px"
            @change="pickerChange"
            v-model="searchTime"
            type="daterange"
            align="right"
            placeholder="选择日期范围"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item class="searchStyle">
          <el-button type="primary" @click="search">查询</el-button>
        </el-form-item>
      </el-form>
      <IdentityTable
        v-if="anchor.states === 1"
        :data="tableData"
        :tableConfig="doctorConfig"
        :loding-hidden="isLoding"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
      <IdentityTable
        v-if="anchor.states === 2"
        :data="tableData"
        :tableConfig="drugStoreConfig"
        :loding-hidden="isLoding"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
      <IdentityTable
        v-if="anchor.states === 3"
        :data="tableData"
        :tableConfig="companyConfig"
        :loding-hidden="isLoding"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
      <IdentityTable
        v-if="anchor.states === 4"
        :data="tableData"
        :tableConfig="patientConfig"
        :loding-hidden="isLoding"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
      <IdentityTable
        v-if="anchor.states === 5"
        :data="tableData"
        :loding-hidden="isLoding"
        :tableConfig="visitorConfig"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
       <IdentityTable
        v-if="anchor.states === 6"
        :data="tableData"
        :loding-hidden="isLoding"
        :tableConfig="nurseConfig"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
      <IdentityTable
        v-if="anchor.states === 7"
        :data="tableData"
        :loding-hidden="isLoding"
        :tableConfig="pharmacistConfig"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>
      <IdentityTable
        v-if="anchor.states === 8"
        :data="tableData"
        :loding-hidden="isLoding"
        :tableConfig="technicianConfig"
        :hasSelect="false"
        ref="comment"
        @handleEdit="handleEdit"
        @payCheck="payCheck"
        @payPoint="payPoint"
        @payPoint2="payPoint2"
        @isResetPassword="isResetPassword"
        @handleDelete="handleDelete"
      ></IdentityTable>

      <el-pagination
        background
        class="page"
        layout="total, prev, pager, next"
        :total="this.pageTotal"
        @current-change="handleCurrentChange"
      ></el-pagination>
      <el-dialog title="添加用户" :visible.sync="dialogFormVisible2">
        <el-form :model="form" ref="form1" :rules="rules1">
          <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
            <el-input class="input400" v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-radio-group v-model="radio" @change="sexChange">
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
            <el-input class="input400" v-model="form.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="email">
            <el-input class="input400" v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="身份：" :label-width="formLabelWidth" prop="identity">
            <el-select v-model="form.identity" placeholder="请选择身份">
              <el-option
                v-for="(item,index) in statusList"
                :key="index"
                :label="item.titlename"
                :value="item.titleId"
              ></el-option>
            </el-select>
          </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="regist()">保 存</el-button>
        </div>
      </el-dialog>
      <el-dialog title="修改信息" :visible.sync="dialogFormVisible3">
        <el-form :model="form" :rules="rules2" ref="form3">
          <el-form-item label="姓名：" :label-width="formLabelWidth" prop="name">
            <el-input class="input400" v-model="form.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="性别：" :label-width="formLabelWidth">
            <el-radio class="radio" v-model="form.radio" label="1">男</el-radio>
            <el-radio class="radio" v-model="form.radio" label="2">女</el-radio>
          </el-form-item>
          <el-form-item label="手机号：" :label-width="formLabelWidth" prop="phone">
            <el-input class="input400" :disabled="true" v-model="form.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="邮箱：" :label-width="formLabelWidth" prop="email">
            <el-input class="input400" v-model="form.email" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色：" :label-width="formLabelWidth">
            <el-checkbox-group v-model="checkedRoles">
              <el-checkbox v-for="role in allRoles" :label="role.id" :key="role.id">{{ role.label }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="身份：" :label-width="formLabelWidth">
            <el-select v-model="form.editIdentity" placeholder="请选择身份">
              <el-option
                v-for="(item,index) in statusList"
                :key="index"
                :label="item.titlename"
                :value="item.titleId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="isUpData()">保 存</el-button>
        </div>
      </el-dialog>

      <el-dialog title="用户充值" :visible.sync="dialogFormPay" size="tiny">
        <div style="padding:10px;">用户姓名：{{ accountName }}</div>
        <div style="padding:10px;">用户余额：{{ userMoney }}元</div>
        <div style="padding:10px;">企业余额：{{ accountMoney }}元</div>
        <div style="padding:10px;">
          <el-form :model="form1">
            <el-form-item label="充值金额：">
              <!-- <el-input type="number" style="width:120px;" :change="checkMoney(form1.payMoney)" v-model="form1.payMoney" auto-complete="off" min="0" placeholder="输入充值金额"></el-input> 元 -->
              <input
                class="self-input"
                type="text"
                placeholder="输入充值金额"
                ref="moneyInput"
                onkeyup="var p1 = parseFloat(value).toFixed(3);var p2 = p1.substring(0,p1.toString().length - 1);value = p2>=0?(/\.0?$/.test(value)?value:p2.replace(/0$/,'').replace(/\.0$/,'')):''"
                onblur="value = value.replace(/\.0*$/,'')"
              > 元 (最多支持两位小数)
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormPay = false">取 消</el-button>
          <el-button type="primary" @click="addAccount()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog :title="'充值' + integralSort | Sort" :visible.sync="dialogFormPoint" size="tiny">
        <div style="padding:10px;">用户姓名：{{ accountName }}</div>
        <div style="padding:10px;">用户{{ integralSort | Sort }}：{{ userPoint }}</div>
        <div
          v-show="integralSort===1"
          style="padding:10px;"
        >您的{{ integralSort | Sort }}：{{ accountPoint }}</div>
        <div style="padding:10px;">
          <el-form :model="form1">
            <el-form-item label="充入值：">
              <el-input
                type="number"
                style="width:200px;"
                v-model="form2.payPoint"
                auto-complete="off"
                min="1"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormPoint = false">取 消</el-button>
          <el-button type="primary" @click="addPoint()">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog title="用户身份组织选择" :visible.sync="dialogIdentity">
        <div style="margin-left:10px;">
          <icon-svg icon-class="company"></icon-svg>
          {{ plattitle }}
        </div>
        <div style="margin-top:15px;">
          <el-radio-group v-model="radio2" @change="radioChange">
            <el-radio
              :label="item.id + '@&@' + item.name"
              v-for="(item,index) in identityData"
              :key="index"
              class="element-radio"
              v-bind:style="{ marginLeft: item.level * 20 + 'px' }"
            >
              <icon-svg icon-class="member"></icon-svg>
              {{ item.name }}
            </el-radio>
          </el-radio-group>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogIdentity = false">取 消</el-button>
          <el-button type="primary" @click="identityAns()">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import $cos from "yb-cos";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { Loading } from "element-ui";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
import md5 from "js-md5";
import {
  enoughLength,
  checkPhone,
  checkEmail,
  validatName
} from "@/utils/validate";
import HeaderContent from "@/components/header-content";
import UploadFile from "@/views/business/foreuser/UploadFile";
import IdentityTable from "@/views/business/class/base/identityTable";
import identityConfig from "@/views/business/foreuser/identity.json";
// import chengshi from "@/components/select/area";

export default {
  http,
  api,
  formatDate,
  name: "tenementList",
  components: {
    UploadFile,
    HeaderContent,
    IdentityTable
    // chengshi
  },
  computed: {
    ...mapGetters(["userAuths", "plattitle", "companyid"])
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!checkPhone(value)) {
        callback(new Error("手机号码格式有误"));
      } else {
        callback();
      }
    };
    const validateEmail = (rule, value, callback) => {
      if (!checkEmail(value)) {
        callback(new Error("邮箱格式有误"));
      } else {
        callback();
      }
    };
    const validateRealName = (rule, value, callback) => {
      if (!validatName(value)) {
        callback(new Error("姓名只能包括汉字和英文"));
      } else if (!enoughLength(value, 2)) {
        callback(new Error("姓名位数不能小于2位"));
      } else {
        callback();
      }
    };
    return {
      isLoding: 0,
      doctorConfig: identityConfig.doctorConfig, //医生身份
      companyConfig: identityConfig.companyConfig, //企业身份
      drugStoreConfig: identityConfig.drugStoreConfig, //药店身份
      patientConfig: identityConfig.patientConfig, //患者身份
      visitorConfig: identityConfig.visitorConfig, //游客身份
      nurseConfig: identityConfig.nurseConfig, //护士身份
      pharmacistConfig: identityConfig.pharmacistConfig, //药师
      technicianConfig: identityConfig.technicianConfig, //技师
      searchTime: "",
      percentageNum: 0,
      fileList: [],
      fileData: '',
      showUpload: false,
      accept: '.xls,.xlsx', // 支持上传的附件后缀
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              let end = new Date();
              let start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      roleNameList: [
        { label: "全部" },
        { label: "培训管理者", states: 5 },
        { label: "普通", states: 1 }
      ],
      officeList: [
        { label: "全部" },
        { label: "心内科", states: 5 },
        { label: "外科", states: 1 },
        { label: "消化科", states: 2 },
        { label: "耳鼻喉科", states: 3 },
        { label: "眼科", states: 4 }
      ],
      statusList: [
        // { label: "医生", states: 5 },
        // { label: "药店人员", states: 1 },
        // { label: "企业人员", states: 2 },
        // { label: "患者", states: 3 },
        // { label: "游客", states: 4 }
      ],
      anchor: {
        nickname: null,
        name: "",
        sex: "man",
        photo: "",
        phone: null,
        province: "",
        city: "",
        county: "",
        hospital: "",
        office: "",
        title: "",
        states: null,
        roleName: ""
      },
      integralSort: "", // 积分列别 区分医币或者积分
      adminId: "",
      phoneSeach: "",
      opertions: ["添加培训管理者"],
      headerTitle: "前台用户管理",
      checkedRoles: [],
      dialogVisible: false,
      errorLists: "",
      token: {
        Authorization: localStorage.getItem("yibai_token_c"),
        "Remote-Host": window.localStorage.getItem("locationHost")
      },
      historyList: [],
      upimgurl: api.uploadImg,
      urls: "",
      multipleSelection: [],
      businessId: localStorage.getItem("businessId"),
      updataId: "",
      searchVal: "",
      pageNum: "",
      radio: "1",
      form: {
        role: [],
        radio: "1",
        name: "",
        email: "",
        password: "",
        phone: "",
        identity: "",
        editIdentity: ""
      },
      dialogTableVisible: false,
      dialogFormVisible2: false,
      dialogFormVisible3: false,
      formLabelWidth: "120px",
      backgroundSpan: {
        background: "red"
      },
      dataList: [],
      pageTotal: 10,
      allRoles: [],
      userId: "",
      dialogFormPay: false,
      form1: {
        payMoney: ""
      },
      dialogFormPoint: false,
      accountName: "",
      accountMoney: "",
      userMoney: "",
      userPoint: "",
      accountPoint: "",
      form2: {
        payPoint: ""
      },
      rules1: {
        // password: [{ required: true, trigger: 'blur', validator: validatePass }],
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        name: [{ required: true, trigger: "blur", validator: validateRealName }]
      },
      rules2: {
        // password: [{ required: true, trigger: 'blur', validator: validatePass }],
        phone: [{ required: true, trigger: "blur", validator: validatePhone }],
        name: [{ required: true, trigger: "blur", validator: validateRealName }]
      },
      dialogIdentity: false,
      identityObj: {},
      radio2: "",
      identityData: [],
      tableData: []
    };
  },
  filters: {
    sex(val) {
      switch (val) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return "";
      }
    },
    Sort(item) {
      switch (item) {
        case 1:
          return "医币";
        case 2:
          return "积分";
        case "充值1":
          return "充值医币";
        case "充值2":
          return "充值积分";
      }
    },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    roleAdmin(rolename) {
      if (!rolename) {
        return "";
      } else {
        if (rolename === "总运营权限") {
          return "培训管理者";
        } else {
          return "";
        }
      }
    }
  },
  mounted() {
    this.getIdentity();
    // this.userinfoList(1);
    this.frontrolelist();
    this.getUserList();
    this.getIdentityTree();
  },
  methods: {
    handlePreview(file) {
      this.showUpload = true
      let params = {
        domain: api.getSig,
        name: file.name,
        body: file.raw,
        onProgress: progress => {
          if (progress.percent < 1) {
            this.percentageNum = parseInt(progress.percent * 100)
          }
        }
      }
      $cos.putObject(params, item => {
        this.handleExeSuccess(item)
      })
    },
    handleExeSuccess(response) {
      if (response.code === 0) {
        this.showUpload = false
        this.fileData = response.data.Location
        console.log(this.fileData)
        this.batchAdd(this.fileData)
        // this.$emit('change', response.data.Location)
      } else {
        this.$message.error(response.message)
      }
    },
    batchAdd: async function(fileUrl) {
      var params = {
        fileUrl: fileUrl
      };
      const res = await http.post(api.batchAdd,params);
      if (res.data.code === 0) {
        this.$message.success(res.data.message);
      }else{
        this.$message.error(res.data.message);
      }
    },
    selectIdentityList() {
      this.userinfoList(1);
    },
    getIdentity() {
      // 获取所有身份
      this.$http
        .get(this.$api.identity.get)
        .then(res => {
          let { code, data, message } = res.data;
          if (code === 0) {
            this.statusList = data.filter(item => item.type === true);
            this.anchor.states = this.statusList[0].titleId;
            this.userinfoList(1);
          } else {
            this.$message.error(message);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    search() {
      this.userinfoList(1);
    },
    pickerChange(v) {
      // 选择时间范围
      if (!v || v === "") {
        this.searchTime = [];
      }
    },
    /*
     * 城市
     * */
    getInnerText(innerText) {
      this.anchor.province = innerText.pro.name;
      this.anchor.city = innerText.city.name;
      this.anchor.county = innerText.county.name;
    },
    getFile(pointEnum, pointType, url) {
      // "pointType":"积分类型<0医币1平台积分>
      // pointEnum 删除  添加
      const options = {
        background: "rgba(0, 0, 0, 0.3)",
        text: "请稍等..."
      };
      let loadingInstance = Loading.service(options);
      var params = {
        pointEnum: pointEnum,
        pointType: pointType,
        uploadFileUrl: url
      };
      http
        .post(this.$api.recharge, params)
        .then(res => {
          this.$nextTick(() => {
            // 以服务的方式调用的 Loading 需要异步关闭
            loadingInstance.close();
          });
          if (res.data.code === 0) {
            this.$message.success(res.data.message);
          } else {
            this.dialogVisible = true;
            this.errorLists = res.data.message;
          }
        })
        .catch(err => {
          this.$message.error(res.data.message);
        });
    },
    clearSeach() {
      if (this.phoneSeach.length < 1) {
        this.userinfoList(1);
      }
    },
    identityAns() {
      if (!this.radio2) {
        this.$message.error("请选择身份");
        return false;
      }
      var array = this.radio2.split("@&@");
      this.identityObj = {
        name: array[1],
        id: Number(array[0])
      };
      this.dialogIdentity = false;
    },
    getIdentityTree: async function() {
      this.identityData = [];
      var res = await http.post(api.identityTree);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.treeIdentityToList(res.data.data);
      }
    },
    treeIdentityToList(data) {
      for (var i = 0; i < data.length; i++) {
        var obj = {
          name: data[i].name,
          id: data[i].id,
          level: data[i].level
        };
        this.identityData.push(obj);
        this.treeIdentityToList(data[i].childRole);
      }
    },
    // handlePreview(file) {
    //   console.log(file);
    // },
    sexChange(val) {},
    radioChange(val) {},
    isResetPassword(userId) {
      this.$confirm("此操作将重置该用户密码为Aa123456, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.resetPassword(userId);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消重置密码"
          });
        });
    },
    headerClick(name) {
      this.dialogFormVisible2 = true;
      this.cls();
    },
    async resetPassword(userId) {
      var params = {
        userId: userId,
        password: md5("Aa123456"),
        passwordSha: this.$sha256AndBase64('Aa123456')
      };
      const res = await http.post(api.resetPassword, params);
      if (res.data.code === 0) {
        this.$message({
          showClose: true,
          message: "重置密码成功",
          type: "success"
        });
      }
    },
    checkMoney(val) {
      var a = Number(val);
      if (isNaN(a)) {
        alert("输入有误");
        return false;
      } else if (val === 0) {
        return false;
      } else {
        this.form1.payMoney = Number(
          val.toString().match(/^\d+(?:\.\d{0,2})?/)
        );
      }
    },
    regist() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.postRegist();
        }
      });
    },
    handlePhoneClick() {
      if (!checkPhone(this.anchor.phone)) {
        this.$message.error("手机号码格式有误");
      } else {
        this.userinfoList(1);
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    addAccount: async function() {
      var a = Number(this.$refs.moneyInput.value);
      if (isNaN(a)) {
        this.$message.error("输入金额有误");
        return false;
      }
      if (!this.$refs.moneyInput.value) {
        this.$message.error("请输入充值金额");
        return false;
      }
      if (this.$refs.moneyInput.value < 1) {
        this.$message.error("充值金额不能小于1元");
        return false;
      }
      if (this.$refs.moneyInput.value > this.accountMoney) {
        this.$message.error("充值金额不能大于您账户的余额");
        return false;
      }
      var params = {
        userId: this.userId,
        amount: this.$refs.moneyInput.value
      };
      const res = await http.post(api.addAccount, params);
      if (res.data.code === 0) {
        this.$message({
          showClose: true,
          message: "充值成功",
          type: "success"
        });
        this.dialogFormPay = false;
        this.$refs.moneyInput.value = "";
      }
    },
    addPoint: async function() {
      if (!this.form2.payPoint) {
        this.$message.error("请输入充入数值");
        return false;
      }
      if (this.form2.payPoint < 1) {
        this.$message.error("充入数值不能小于1");
        return false;
      }
      if (String(this.form2.payPoint).substring(0, 1) === "0") {
        this.$message.error("输入数字格式有误");
        return false;
      }
      if (this.integralSort === 1) {
        if (this.form2.payPoint > this.accountPoint) {
          this.$message.error("充入数值不能大于您账户的数值");
          return false;
        }
      }
      var params = {
        pointEnum: "admin",
        pointType: 0,
        toId: this.userId,
        point: this.form2.payPoint
      };
      // integralSort 1 = 充值医币 2=充值积分
      if (this.integralSort === 2) {
        params.pointType = 1;
      }
      const res = await http.post(this.$api.payUserPoint, params);
      if (res.data.code === 0) {
        this.$message({
          showClose: true,
          message: "充入成功",
          type: "success"
        });
        this.dialogFormPoint = false;
      }
    },
    getUserList: async function() {
      const res = await http.post(api.getUserHistory);
      if (res.data.code === 0) {
        this.historyList = res.data.data;
        //        window.location.href = res.data.data[0].url
      }
    },
    // 增加删除积分批量
    windowOpen(data) {
      let url = "";
      data === 0
        ? (url =
            "https://yibaifiles-1252497236.cos.ap-chengdu.myqcloud.com/CBGM/%E5%85%85%E5%80%BC%E7%A7%AF%E5%88%86%7C%E5%8C%BB%E5%B8%81(%E6%A8%A1%E6%9D%BF).xlsx")
        : (url =
            "https://yibaifiles-1252497236.cos.ap-chengdu.myqcloud.com/CBGM/%E6%B6%88%E8%80%97%E7%A7%AF%E5%88%86%7C%E5%8C%BB%E5%B8%81(%E6%A8%A1%E7%89%88).xlsx");
      window.location.href = url;
    },
    downLoad() {
      window.location.href = "https://yibaifiles-1252497236.cos.ap-chengdu.myqcloud.com/webPc/%E8%A1%A8%E6%A0%BC/%E5%BA%97%E5%91%98%E5%9F%B9%E8%AE%AD/3/%E5%9F%B9%E8%AE%AD%E7%AE%A1%E7%90%86%E8%80%85%E6%A8%A1%E7%89%88.xlsx";
    },
    payCheck: async function(row) {
      this.userId = "";
      this.accountName = "";
      this.form1.payMoney = "";
      this.accountName = row.name;
      this.userMoney = "";
      this.accountMoney = "";
      this.userId = row.userId;
      if (this.$refs.moneyInput) {
        this.$refs.moneyInput.value = "";
      }
      var params = {
        // userId: row.id
        userId: row.userId
      };
      const res = await http.post(api.getUserAccount, params);
      if (res.data.code === 0) {
        this.userMoney = res.data.data.amount;
      }
      const res1 = await http.post(api.getAccount, {});
      if (res1.data.code === 0) {
        this.accountMoney = res1.data.data.amount;
      }
      this.dialogFormPay = true;
    },
    payPoint: async function(row) {
      this.integralSort = 1;
      this.userId = "";
      this.accountName = "";
      this.form2.payPoint = "";
      this.accountName = row.name;
      this.userPoint = "";
      this.accountPoint = "";
      this.userId = row.userId;
      var params = {
        // userId: row.id
        userId: row.userId
      };

      const res = await http.post(api.getUserPoint, params);
      if (res.data.code === 0) {
        this.userPoint = res.data.data.point;
      }
      const res1 = await http.post(api.getAccountPoint, {});
      if (res1.data.code === 0) {
        this.accountPoint = res1.data.data.surplus;
      }

      this.dialogFormPoint = true;
    },
    payPoint2: async function(row) {
      this.integralSort = 2;
      this.userId = "";
      this.accountName = "";
      this.form2.payPoint = "";
      this.accountName = row.name;
      this.userPoint = "";
      this.accountPoint = "";
      this.userId = row.userId;
      var params = {
        // userId: row.id
        userId: row.userId
      };
      const res = await http.get(api.getMyAccount + row.userId);
      if (res.data.code === 0) {
        this.userPoint = res.data.data.point;
      }
      this.dialogFormPoint = true;
    },
    userinfoList: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        params: {
          businessId: this.businessId,
          identity: this.anchor.states,
          phone: this.$praseStrNull(this.anchor.phone),
          nickname: this.$praseStrNull(this.anchor.nickname)
        }
      };
      var res = await http.post(api.userIdentityList, params);
      this.isLoding += 1
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        // this.dataList = res.data.data.list;
        this.pageTotal = res.data.data.total;
      } else {
        this.errorTost(res.data.message);
      }
    },
    postRegist: async function() {
      var params = {
        username: this.form.phone,
        name: this.form.name,
        sex: this.radio === "1" ? "man" : "woman",
        email: this.form.email
        // identity: this.form.identity
      };
      var res = await http.post(api.postRegist, params);
      if (res.data.code === 0) {
        this.success("创建成功");
        this.cls();
        this.dialogFormVisible2 = false;
        this.userinfoList(this.pageNum);
      } else {
        this.errorTost(res.data.message);
      }
    },
    /**
     * 清空提交数据表
     */
    cls() {
      this.form.phone = "";
      this.form.password = "";
      this.form.name = "";
      this.form.radio = 1;
      this.form.email = "";
      this.form.editIdentity = "";
    },
    /**
     * 修改用户信息
     */
    isUpData() {
      this.$refs.form3.validate(valid => {
        if (valid) {
          this.updata();
        }
      });
    },
    updata: async function(id) {
      var params = {
        userId: this.userId,
        id: this.updataId,
        sex: this.form.radio === "1" ? "man" : "woman",
        nickname: this.form.name,
        email: this.form.email,
        identity: this.form.editIdentity
      };
      // var res = await http.post(api.updated, params);
      var res = await http.post(api.userIdentityUpdate, params);
      if (res.data.code === 0) {
        this.success("修改成功");
        if (this.userAuths.front_user_set_identity) {
          this.identityObj.id ? this.userAddIdentity() : this.userDeleteIdentity();
        }
        if (this.checkedRoles.includes(this.adminId)) {
          this.userIdRoleId();
        } else if (this.checkedRoles.length === 0) {
          this.userIdRoleDelete();
        }
      } else {
        this.errorTost(res.data.message);
      }
    },
    userIdRoleDelete: async function() {
      var params = {
        userId: this.userId
      };
      var res = await http.post(api.userIdRoleDelete, params);
      if (res.data.code === 0) {
        this.userinfoList(this.pageNum);
        this.dialogFormVisible3 = false;
      }
    },
    userIdRoleId: async function() {
      var params = {
        roleId: this.adminId,
        userId: this.userId
      };
      var res = await http.post(api.userIdRoleId, params);
      if (res.data.code === 0) {
        this.userinfoList(this.pageNum);
        this.dialogFormVisible3 = false;
      } else {
        this.errorTost(res.data.message);
      }
    },
    userAddIdentity: async function() {
      var params = {
        userId: this.userId,
        roleId: this.identityObj.id ? this.identityObj.id : ""
      };
      var res = await http.post(api.userAddIdentity, params);
      if (res.data.code === 0) {
        this.userinfoList(this.pageNum);
        this.dialogFormVisible3 = false;
      } else {
        this.identityObj = {};
        this.getIdentityTree();
        this.errorTost(res.data.message);
      }
    },
    userDeleteIdentity: async function() {
      var params = {
        userId: this.userId
      };
      var res = await http.post(api.userDeleteIdentity, params);
      if (res.data.code === 0) {
        this.userinfoList(this.pageNum);
        this.dialogFormVisible3 = false;
      } else {
        this.errorTost(res.data.message);
      }
    },
    createUser() {},
    getcolor(string) {},
    handleCurrentChange(val) {
      this.pageNum = val;
      this.userinfoList(val);
    },
    // handleEdit(id, userId, roleId, email, rid, frontName, identity) {
    //   this.getInfo(id);
    //   this.userId = userId;
    //   console.log(email);
    //   this.updataId = id;
    //   if (roleId) {
    //     this.checkedRoles = [roleId];
    //   }
    //   if (frontName) {
    //     this.identityObj = {
    //       name: frontName,
    //       id: rid
    //     };
    //     this.radio2 = rid + "@&@" + frontName;
    //   } else {
    //     this.identityObj = {};
    //     this.radio2 = "";
    //   }
    //   this.form.email = email;
    //   this.dialogFormVisible3 = true;
    // },
    handleEdit(row) {
      // this.getInfo(row.id);
      this.getInfo(row.userId);
      this.userId = row.userId;

      this.updataId = row.id;
      if (row.roleId) {
        this.checkedRoles = [row.roleId];
      }else{
        this.checkedRoles = [];
      }
      if (row.frontName) {
        this.identityObj = {
          name: row.frontName,
          id: row.rid
        };
        this.radio2 = row.rid + "@&@" + row.frontName;
      } else {
        this.identityObj = {};
        this.radio2 = "";
      }
      this.form.email = row.email;
      this.dialogFormVisible3 = true;
    },
    getInfo: async function(id) {
      // var params = {
      //   id: id
      // };
      // var res = await http.post(api.getInfo, params);
      var res = await http.get(api.userIdentityUserInfo + "/" + id);
      this.form.radio = res.data.data.sex === "man" ? "1" : "2";
      this.form.name = res.data.data.nickname;
      this.form.phone = res.data.data.phone;
      this.form.email = res.data.data.email;
      this.form.editIdentity = res.data.data.identity;
      // this.form.editIdentity = res.data.data
    },
    handleDelete: async function(id) {
      var params = {
        id: id
      };
      var res = await http.post(api.delete, params);
      if (res.data.code === 0) {
        // this.success('删除成功')
        this.userinfoList(this.pageNum);
      } else {
        this.errorTost(res.data.message);
      }
    },
    frontrolelist: async function() {
      var params = {
        businessId: this.businessId
      };
      var res = await http.post(api.frontrolelist, params);
      console.log(res.data);
      if (res.data.code === 0) {
        for (var i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].label === "总运营权限") {
            this.adminId = res.data.data[i].id;
            this.allRoles.push(res.data.data[i]);
          }
        }
      }
    },
    emptyForm() {
      this.region = "";
      this.radio = "1";
      this.name = "";
      this.phone = "";
    },
    success(val) {
      this.$message({
        message: val,
        type: "success"
      });
    },
    errorTost(val) {
      // 错误提示
      this.$message({
        showClose: true,
        message: val,
        type: "error"
      });
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.tenementList {
  position: relative;
}

.page {
  margin-top: 20px;
}

.background {
  display: block;
  width: 100%;
  height: 100%;
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

.input200 {
  width: 100px;
}

.self-input {
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid $c-theme;
  box-sizing: border-box;
  color: rgb(31, 45, 61);
  display: inline-block;
  font-size: inherit;
  width: 120px;
  height: 36px;
  line-height: 1;
  outline: none;
  padding: 3px 10px;
}

.element-radio {
  display: block;
  height: 30px;
}

.btnsl {
  position: absolute;
  right: 132px;
  top: 31px;
  display: flex;
}

#btns {
  position: absolute;
  right: 546px;
  top: 30px;
}

.upload-demo-download{
  margin-left: 20px;
}
.upload-demo{
  margin-left: 20px;
}

.btnsl{
  .el-button--primary{
    background-color: #fff !important;
    border: 1px solid $c-theme !important;
    color: $c-theme !important;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss">
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.btnsl{
   .el-button--primary{
    background-color: #fff !important;
    border: 1px solid $c-theme !important;
    color: $c-theme !important;

    padding: 9px 10px !important;
  }
  .el-button--primary:hover{
    background-color: $c-theme2 !important;
    border: 1px solid $c-theme !important;
    color: $c-theme !important;
  }
}
</style>



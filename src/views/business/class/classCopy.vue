<template>
  <div class="modelist">
    <header-content :title="headerTitle"></header-content>
    <div class="piont-flex--" style="border:none;">
      <div class="point-title">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="栏目：">
            <el-select
                v-model="value"
                placeholder="请选择培训分类"
                class="searchStyle"
                style="width:200px;height:100%;"
            >
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="状态：">
            <el-select v-model="formInline.status" placeholder="请选择类型">
              <el-option
                  v-for="(item, index) in videoStatus"
                  :key="index"
                  :label="item.title"
                  :value="item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="bidValue==='9'" label="会议类型：">
            <el-select v-model="formInline.videoType" placeholder="请选择类型">
              <el-option
                  v-for="(item, index) in videoType"
                  :key="index"
                  :label="item.title"
                  :value="item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直播开始时间：" v-if="this.activeName==='live'">
            <el-date-picker
                style="width: 250px"
                @change="pickerChange"
                v-model="searchTime"
                type="daterange"
                align="right"
                placeholder="选择日期范围"
                :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="创建日期：" v-if="this.activeName==='video'">
            <el-date-picker
                style="width: 250px"
                @change="pickerChange"
                v-model="searchTime"
                type="daterange"
                align="right"
                placeholder="选择日期范围"
                :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>

          <el-form-item label="名称:" class="searchStyle">
            <el-input clearable v-model="formInline.name" placeholder="请输入名称"></el-input>
          </el-form-item>

          <el-form-item v-if="bidValue==='9' && isShow" label="互动会议号:" class="searchStyle">
            <el-input clearable v-model="formInline.zoomMettingNumber" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item class="searchStyle">
            <el-button type="primary" @click="search">查询</el-button>
          </el-form-item>
          <el-form-item class="searchStyle">
            <el-button type="primary" :loading="exportLoding" @click="exportList">导出</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div></div>
    </div>
    <div style="width:100%;height:5px;"></div>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane label="直  播" name="live">
          <live-list
              v-if="activeName === 'live' && uploadDom"
              :user-auths="userAuths"
              :table-data="tableData"
              :business-id="bidValue"
              @change="tabActiveChange"
          />
        </el-tab-pane>
        <el-tab-pane label="点  播" name="video">
          <video-list
              v-if="activeName === 'video' && uploadDom"
              :user-auths="userAuths"
              :table-data="tableData"
              :business-id="bidValue"
              @change="tabActiveChange"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="提示" :visible.sync="ends">
      <span style="color: red;">是否确认结束当前课程，确认后直播强制自动结束，不能再次开启直播</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="endsVideo">确 定</el-button>
      </span>
    </el-dialog>
    <div style="margin: 20px"></div>
    <el-pagination
        background
        :current-page="newpage"
        layout="total, prev, pager, next"
        @current-change="handleCurrent"
        :total="total"
        :page-size="20"
    ></el-pagination>
    <!-- 打开详情 -->
    <el-dialog title="详情" :visible.sync="centerDialogVisible" height="auto" center>
      <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
        <el-form-item label="业务类型：">
          <span>{{ formLabelAlign.businessId | businessName }}</span>
        </el-form-item>
        <el-form-item label="栏目：">
          <span>{{ navigationName }}</span>
        </el-form-item>
        <el-form-item label="形式:">
          <span>{{ isShow === true ? '直播' : '点播' }}</span>
        </el-form-item>
        <el-form-item label="标题：">
          <span>{{ formLabelAlign.name }}</span>
        </el-form-item>
        <el-form-item label="封面图：">
          <img :src="formLabelAlign.coverUrl" style="width:200px;height:200px" alt>
        </el-form-item>
        <el-form-item
            label="产品："
            v-if="bidValue!=='5' && bidValue!=='9' && formLabelAlign.dataSource && formLabelAlign.dataSource.tags !== ''"
        >
          <span v-if="formLabelAlign.dataSource">{{ formLabelAlign.dataSource.tags }}</span>
        </el-form-item>
        <el-form-item v-show="!isShow" label="展示时间：">
          <el-date-picker v-model="formLabelAlign.showTime" type="datetime" placeholder="选择日期时间"></el-date-picker>
          <el-button type="primary" @click="updateShowTime(formLabelAlign.showTime)">修改时间</el-button>
        </el-form-item>
        <el-form-item v-show="isShow" label="开始时间：">
          <span>{{ formLabelAlign.startTime | formatDate }}</span>
        </el-form-item>
        <el-form-item v-show="isShow" label="结束时间：">
          <span>{{ formLabelAlign.endTime | formatDate }}</span>
        </el-form-item>
        <el-form-item label="讲师：" v-if="bidValue!=='5' && bidValue!=='9' && isShow">
          <p style="margin:0">
            <span>{{ formLabelAlign.launchName }}</span>
          </p>
        </el-form-item>
        <el-form-item label="主播:" v-if="bidValue==='5' && isShow">
          <p style="margin:0">
            <span>{{ formLabelAlign.launchListName }}</span>
          </p>
        </el-form-item>
        <el-form-item label="主持人:" v-if="bidValue==='9'">
          <p style="margin:0">
            <span v-for="item in formLabelAlign.launchList" :key="item.id">{{ item.name }}</span>
          </p>
        </el-form-item>
        <el-form-item label="会议号:" v-if="bidValue==='9' && isShow">
          <p style="margin:0">
            <span>{{ formLabelAlign.zoomMettingNumber }}</span>
          </p>
        </el-form-item>
        <el-form-item
            v-if="bidValue==='3' && formLabelAlign.viceLaunchList && formLabelAlign.viceLaunchList.length !== 0 && isShow"
            label="嘉宾:"
        >
          <p style="margin:0">
            <span
                v-for="(item, index) in formLabelAlign.viceLaunchList"
                :key="index"
            >{{ item.name }}&nbsp;&nbsp;</span>
          </p>
        </el-form-item>
        <el-form-item
            v-if="bidValue==='5' && formLabelAlign.guestList &&  formLabelAlign.guestList.length !== 0 && isShow"
            label="嘉宾:"
        >
          <p style="margin:0">
            <span
                v-for="(item, index) in formLabelAlign.guestListName"
                :key="index"
            >{{ item.name }}&nbsp;&nbsp;</span>
          </p>
        </el-form-item>
        <div class="info-block block3" v-if="bidValue==='5'">
          <span
              class="info-self"
              v-if="formLabelAlign.schedulepc.length !== 0 || formLabelAlign.schedulemobile.length !== 0"
          >日程：</span>
          <div class="info-selfs" v-if="formLabelAlign.schedulepc.length !== 0">
            网站展示日程:
            <div class="info-contents">
              <img
                  v-for="(item,index) in formLabelAlign.schedulepc"
                  :key="index"
                  :src="item.url"
                  alt
              >
            </div>
          </div>
          <div class="info-selfs" v-if="formLabelAlign.schedulemobile.length !==0">
            移动端展示日程:
            <div class="info-contents">
              <img
                  v-for="(item, index) in formLabelAlign.schedulemobile"
                  :key="index"
                  :src="item.url"
                  alt
              >
            </div>
          </div>
        </div>
        <el-form-item v-if="bidValue==='5' && formLabelAlign.hostAddress !== ''" label="举办地址：">
          <p style="margin:0">
            <span>{{ formLabelAlign.hostAddress }}</span>
          </p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5' && formLabelAlign.master !== ''" label="主办方：">
          <p style="margin:0">
            <span>{{ formLabelAlign.master }}</span>
          </p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5' && formLabelAlign.assist !== ''" label="协办方：">
          <p style="margin:0">
            <span>{{ formLabelAlign.assist }}</span>
          </p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5' && formLabelAlign.cibtractor !== ''" label="承办方：">
          <p style="margin:0">
            <span>{{ formLabelAlign.cibtractor }}</span>
          </p>
        </el-form-item>
        <el-form-item
            v-if="bidValue==='5' && formLabelAlign.dataSource && formLabelAlign.dataSource.tags !== ''"
            label="标签输入："
        >
          <p style="margin:0">
            <span v-if="formLabelAlign.dataSource">{{ formLabelAlign.dataSource.tags }}</span>
          </p>
        </el-form-item>
        <el-form-item
            v-if="bidValue==='5' && Object.keys(formLabelAlign.dataListurl).length !== 0"
            label="会议资料:"
        >
          <p style="margin:0">
            <span
                v-for="(item, index) in formLabelAlign.dataListurl"
                :key="index"
                style="cursor: pointer"
                @click="open(item.url)"
            >{{ item.name }}</span>
          </p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'" label="是否发放福袋:">
          <p style="margin:0">
            <span>{{ formLabelAlign.awardSwitch === 1 ? '是' : '否' }}</span>
          </p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'" label="是否发放问卷:">
          <p style="margin:0">
            <span>{{ formLabelAlign.answerSwitch === 1 ? '是' : '否' }}</span>
          </p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'" label="是否完善信息:">
          <p style="margin:0">
            <span>{{ formLabelAlign.perfect === 213 ? '是' : '不需要' }}</span>
          </p>
        </el-form-item>
        <el-form-item label="简介:" v-if="formLabelAlign.description !== ''">
          <div
              class="test-area intro-content ql-editor test-area-editor"
              v-html="formLabelAlign.description"
          ></div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <!--下载详情-->
    <el-dialog title="下载详情" :visible.sync="details" center>
      <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
        <el-form-item label="标题：">
          <span>{{ formLabelAlign.name }}</span>
        </el-form-item>
        <el-form-item label="下载地址:" v-for="(item,key) in urls" :key="key">
          <div v-if="item.playbackUrl && downloadType === 1">
            <span class="big">{{ item.playbackUrl }}</span>
            <el-button type="info" @click="opens(item.playbackUrl)">下载</el-button>
          </div>
        </el-form-item>

        <el-form-item
            label="下载地址:"
            v-for="(item,key) in urls"
            :key="key"
            v-show="item.playbackUrl && downloadType === 2 && key === 0"
        >
          <span class="big">{{ item.playbackUrl }}</span>
          <el-button type="info" @click="opens(item.playbackUrl)">下载</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="details = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button> ee-->
      </span>
    </el-dialog>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import {formatDate} from "@/common/data";
import {mapGetters} from "vuex";
import HeaderContent from "@/components/header-content";
import LiveList from "./base/LiveList";
import VideoList from "./base/VideoList";

export default {
  name: "modelist",
  components: {
    VideoList,
    LiveList,
    HeaderContent
  },
  data() {
    return {
      activeName: "live",
      exportLoding: false,
      searchTime: "",
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
      downloadType: 0,
      formInline: {
        zoomMettingNumber: null,
        status: "",
        name: "",
        start: "",
        end: "",
        // videoType: ""
        videoType: ""
      },
      navigationName: "",
      headerTitle: this.$route.name,
      searchVal: "",
      tableData: [],
      ends: false,
      formLabelAlign: {
        name: "",
        tags: "",
        launchListName: "",
        guestListName: "",
        schedulepc: "",
        schedulemobile: "",
        dataListurl: "",
        hostAddress: "",
        master: "",
        assist: "",
        cibtractor: "",
        awardSwitch: "",
        answerSwitch: "",
        perfect: ""
      },
      audience: [],
      labelPosition: "right",
      centerDialogVisible: false,
      details: false,
      isShow: true,
      showTime: "",
      total: 1,
      num1: 1,
      options: [],
      value: "全部分类",
      label: "",
      input2: "",
      vals: null,
      newpage: 1,
      bidValue: this.$route.matched[0].meta.businessId.toString(),
      optionObj: {},
      serviceName: "店员培训",
      urls: "",
      busId: "",
      busIds: "",
      classPlay: false,
      classStatic: false,
      classStop: false,
      uploadDom: true,
      videoStatus: [
        {
          status: "",
          title: "全部"
        },
        {
          status: -1,
          title: "已失效"
        },
        {
          status: 0,
          title: "预告"
        },
        {
          status: 1,
          title: "直播中"
        },
        {
          status: 2,
          title: "暂停中"
        },
        {
          status: 3,
          title: "已结束"
        },
        {
          status: 4,
          title: "稍后继续"
        },
        {
          status: 5,
          title: "正在转码"
        },
        {
          status: 6,
          title: "转码失败"
        },
        {
          status: 7,
          title: "未发布"
        },
        {
          status: 8,
          title: "已发布"
        },
        {
          status: 9,
          title: "回放"
        }
      ],
      videoType: [
        {
          status: "",
          title: "全部"
        },
        {
          status: 1,
          title: "正式"
        },
        {
          status: 0,
          title: "测试"
        }
      ]
    };
  },
  watch: {
    $route(to, form) {
      /*
       * 解决keepAlive同页面不通路由 不更新问题
       * */
      this.headerTitle = this.$route.name;
      if (this.$route.matched[0].meta.businessId) {
        let toBusinessId = this.$route.matched[0].meta.businessId.toString();
        if (this.bidValue !== toBusinessId) {
          this.uploadDom = false
          setTimeout(() => {
            this.uploadDom = true
            this.updateForm();
          }, 0)
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      "service",
      "serviceType",
      "businessTrain",
      "businessClass",
      "businessOnlineOpenClass",
      "businessAcademicConFerence",
      "businessInteractionOpenClass",
      "userAuths"
    ])
  },
  filters: {
    businessName(item) {
      switch (item) {
        case 1:
          return "店员培训";
        case 2:
          return "空中课堂";
        case 3:
          return "互动公开课";
        case 4:
          return "线上公开课";
        case 5:
          return "学术会议";
        case 9:
          return "互动课堂";
      }
    },
    definition(item) {
      switch (item) {
        case 10:
          return "标清";
        case 20:
          return "高清";
        case 30:
          return "超清";
        case 210:
          return "标清";
        case 220:
          return "高清";
        case 230:
          return "超清";
        default:
          return "原画";
      }
    },

    formatDate(time) {
      if (!time) {
        return "";
      }
      time = Number(time);
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },

    longToShort(str) {
      if (str.length > 20) {
        return str.substring(0, 20) + "...";
      } else {
        return str;
      }
    }
  },
  mounted() {
    this.getMenuList();
    this.getVideoList(this.newpage);
  },
  methods: {
    updateForm() {
      this.bidValue = this.$route.matched[0].meta.businessId.toString();
      this.activeName = "live";
      this.tableData = [];
      this.formInline.name = "";
      this.formInline.status = "";
      this.formInline.end = "";
      this.formInline.start = "";
      this.value = "";
      this.searchTime = "";
      this.newpage = 1;
      this.getMenuList();
      this.getVideoList(this.newpage);
    },
    tabActiveChange(item) {
      let params = item.params;
      switch (item.affair) {
        case "examine":
          this.examine(params.busId, params.type);
          break;
        case "stopVideo":
          this.stopVideo(params.id);
          break;
        case "goInteraction":
          this.goInteraction(params.businessId, params.id, params.busId);
          break;
        case "enableVideo":
          this.enableVideo(params.id);
          break;
        case "end":
          this.end(params.busId);
          break;
        case "handleClick":
          this.handleClick(params.busId, params.type, params.businessId);
          break;
        case "playClick":
          this.playClick(params.busId, params.type, params.status, params.id);
          break;
        case "downLoad":
          this.downLoad(params.name, params.id, params.type, params.busId);
          break;
        case "govideoManage":
          this.govideoManage(params.businessId, params.busId, params.id);
          break;
        case "query": // 查看导入数据
          this.query(params.busId);
          break;
        case "getInteractData": // 互动数据
          this.getInteractData(params.id);
          break;
        case "userManage": // 人员管理
          this.$router.push({path: 'userManage/' + params.avRoomId})
          break
      }
      // 列表功能按钮触发
    },
    getInteractData(id) {
      // 跳转互动数据
      this.$router.push({path: "interactData/" + id});
    },
    tabClick() {
      this.tableData = [];
      this.newpage = 1;
      this.getVideoList(1);
    },
    search() {
      this.newpage = 1;
      this.getVideoList(1);
    },
    pickerChange(v) {
      // 选择时间范围
      if (!v || v === "") {
        this.searchTime = [];
      }
    },
    // 导出视频列表
    exportList() {
      this.exportLoding = true;
      let businessId = this.$route.matched[0].meta.businessId;
      let type = this.activeName === "live" ? 1 : 2;
      http.get(api.videoExport + `/${businessId}/${type}`).then(res => {
        let {code, data, message} = res.data;
        this.exportLoding = false;
        if (code === 0) {
          window.location.href = data;
          this.$message.success("导出成功");
        } else {
          this.$message.error(message);
        }
      });
    },
    goInteraction(businessId, busId, commentId) {
      this.$router.push({
        path: `interaction/${businessId}/${busId}/${commentId}`
      });
    },
    govideoManage(businessId, busId, id) {
      this.$router.push({path: `videoManage/${businessId}/${busId}/${id}`});
    },
    async updateShowTime(date) {
      const time1 = new Date(date);
      const params = {
        busId: this.busId,
        showTime: time1.getTime()
      };
      const res = await http.post(api.updateVideo, params);
      if (res.data.code === 0) {
        alert("修改成功");
      }
    },
    query(id) {
      let path = this.$route.matched[0].path;
      this.$router.push({path: path + "/detailed/" + id});
    },
    // 结束功能
    end(busId) {
      console.log(busId);
      this.busIds = busId;
      this.ends = true;
    },
    endsVideo: async function () {
      let busId = this.busIds;
      let pushType = 3;
      let apiUrl = api.endVideolist;
      if (this.bidValue === "9") {
        apiUrl = api.adminLivePush;
      }
      const res = await http.get(apiUrl + pushType + "/" + busId);
      if (res.data.code === 0) {
        this.getVideoList(this.newpage);
        this.$message("结束成功");
      } else {
        this.$message.error(res.data.message);
      }
      this.ends = false;
    },
    Audience(tags) {
      if (!tags) {
        this.audience = [];
      } else {
        var jsonTags = JSON.parse(tags);
        var array = jsonTags[3];
        var array1 = [];
        for (var i = 0; i < array.length; i++) {
          array1.push(array[i][0]);
        }
        this.audience = array1;
      }
    },
    // 回放下载
    downLoad: async function (name, id, type, busId) {
      this.formLabelAlign.name = name;
      if (type === 1) {
        var params = {
          pageNum: 1,
          pageSize: 100,
          params: {
            liveId: id
          }
        };
        const res = await http.post(api.playBckVideoList, params);
        if (res.data.code === 0) {
          this.downloadType = 1;
          this.details = true;
          this.urls = res.data.data.data;
        }
      }
      if (type === 2) {
        http.get(api.videoAddress + `${busId}/${id}`).then(res => {
          this.downloadType = 2;
          this.details = true;
          this.urls = res.data.data;
        });
      }
    },
    opens(url) {
      window.open(url);
    },
    open(url) {
      window.open(url);
    },
    searchClick() {
    },
    // 列表分页切换数据
    handleCurrent(val) {
      this.newpage = val;
      this.getVideoList(val);
    },
    // 获取列表详情
    examine: async function (id, type) {
      this.busId = id;
      let apiurl = api.videoBusId;
      if (this.bidValue === "9") {
        apiurl = api.adminVideoDetail;
      }
      if (type === 1) {
        this.isShow = true;
        const res = await http.get(apiurl + id);
        for (var item of this.options) {
          if (item.value === res.data.data.dataSource.navigationId)
            this.navigationName = item.label;
        }
        this.formLabelAlign = res.data.data;
        this.Audience(this.formLabelAlign.tags);
        if (this.bidValue === "5") {
          this.formLabelAlign.launchListName = res.data.data.launchName;
          this.formLabelAlign.schedulepc = this.formLabelAlign.dataSource.schedule.pc;
          this.formLabelAlign.schedulemobile = this.formLabelAlign.dataSource.schedule.mobile;
          this.formLabelAlign.dataListurl = this.formLabelAlign.dataSource.dataList;
          this.formLabelAlign.hostAddress = this.formLabelAlign.dataSource.contractors.hostAddress;
          this.formLabelAlign.master = this.formLabelAlign.dataSource.contractors.master;
          this.formLabelAlign.assist = this.formLabelAlign.dataSource.contractors.assist;
          this.formLabelAlign.cibtractor = this.formLabelAlign.dataSource.contractors.cibtractor;
          this.formLabelAlign.awardSwitch = this.formLabelAlign.dataSource.awardSwitch;
          this.formLabelAlign.answerSwitch = this.formLabelAlign.dataSource.answerSwitch;
          this.formLabelAlign.guestListName = this.formLabelAlign.guestList;
          this.formLabelAlign.perfect = res.data.data.code;
        }
        this.centerDialogVisible = true;
      } else if (type === 2) {
        this.isShow = false;
        const res = await http.get(apiurl + id);
        for (var optionsItem of this.options) {
          if (optionsItem.value === res.data.data.dataSource.navigationId)
            this.navigationName = optionsItem.label;
        }
        this.formLabelAlign = res.data.data;
        if (this.bidValue === "5") {
          this.formLabelAlign.launchListName = res.data.data.launchName;
          this.formLabelAlign.schedulepc = this.formLabelAlign.dataSource.schedule.pc;
          this.formLabelAlign.schedulemobile = this.formLabelAlign.dataSource.schedule.mobile;
          this.formLabelAlign.dataListurl = this.formLabelAlign.dataSource.dataList;
          this.formLabelAlign.hostAddress = this.formLabelAlign.dataSource.contractors.hostAddress;
          this.formLabelAlign.master = this.formLabelAlign.dataSource.contractors.master;
          this.formLabelAlign.assist = this.formLabelAlign.dataSource.contractors.assist;
          this.formLabelAlign.cibtractor = this.formLabelAlign.dataSource.contractors.cibtractor;
          this.formLabelAlign.awardSwitch = this.formLabelAlign.dataSource.awardSwitch;
          this.formLabelAlign.answerSwitch = this.formLabelAlign.dataSource.answerSwitch;
          this.formLabelAlign.guestListName = this.formLabelAlign.guestList;
          this.formLabelAlign.perfect = res.data.data.code;
        }
        this.Audience(this.formLabelAlign.tags);
        this.centerDialogVisible = true;
      }
    },
    // 停用功能
    stopVideo: async function (id) {
      let params = {
        id: id,
        isDeleted: 1
      };
      const res = await http.post(api.videoSst, params);
      if (res.data.code === 0) {
        this.getVideoList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    // 启用功能
    enableVideo: async function (id) {
      let params = {
        id: id,
        isDeleted: 0
      };
      const res = await http.post(api.videoSst, params);
      if (res.data.code === 0) {
        this.getVideoList(this.newpage);
      } else {
        this.$message.error(res.data.message);
      }
    },
    getMenuList: async function () {
      var params = {
        pageNum: 1,
        pageSize: 9999
      };
      var res = await http.post(api.getMenuList, params);
      if (res.data.code === 0) {
        var array = res.data.data.data;
        var obj = {};
        for (var i = 0; i < array.length; i++) {
          var str = String(array[i].businessId);
          if (!obj[str]) {
            obj[str] = [];
            obj[str].push({label: "全部分类", value: 0});
            obj[str].push({label: array[i].name, value: array[i].id});
          } else {
            obj[str].push({label: array[i].name, value: array[i].id});
          }
        }
        this.optionObj = obj;
        this.bidValue = this.$route.matched[0].meta.businessId.toString();
        this.options = obj[this.bidValue];
        this.value = 0;
      }
    },
    // 统计信息按钮点击事件
    handleClick(id, type, type1) {
      //      上面注释是原版  下面按占河要求修改
      let page = this.newpage;
      if (type1 === 9) {
        this.$router.push({
          path:
              "classdata/" +
              id +
              "/" +
              page +
              "?type=" +
              3 +
              "&service=" +
              this.bidValue
        });
      } else if (type === 1) {
        this.$router.push({
          path:
              "classdata/" +
              id +
              "/" +
              page +
              "?type=" +
              1 +
              "&service=" +
              this.bidValue
        });
      } else if (type === 2) {
        this.$router.push({
          path:
              "classdata/" +
              id +
              "/" +
              page +
              "?type=" +
              2 +
              "&service=" +
              this.bidValue
        });
      }
    },
    playClick(id, type, type1, videoId) {
      //      上面注释是原版  下面按占河要求修改
      let page = this.newpage;
      if (type1 === 9) {
        this.$router.push({
          path: "classVideo/" + id + "/" + videoId + "/" + page + "?type=" + 0
        });
      } else if (type === 1) {
        this.$router.push({
          path: "classVideo/" + id + "/" + videoId + "/" + page + "?type=" + 0
        });
      } else if (type === 2) {
        this.$router.push({
          path: "classVideo/" + id + "/" + videoId + "/" + page + "?type=" + 1
        });
      }
    },
    // 获取列表
    getVideoList: async function () {
      let obj1 = {};
      if (this.value !== 0) {
        if (this.value === "全部分类" || this.value === "") {
          obj1 = {
            navigationId: null
          }
        } else {
          obj1 = {
            navigationId: this.value
          }
        }
      }
      // if( this.bidValue === '9'){
      //   obj1.isOfficial = this.formInline.videoType;
      // }
      if (this.bidValue === '9' && this.formInline.videoType === '') {
        obj1.isOfficial = null;
      } else if (this.bidValue === '9' && this.formInline.videoType !== '') {
        obj1.isOfficial = this.formInline.videoType;
      }

      // 时间查询解析
      if (this.searchTime && this.searchTime.length > 0) {
        let start = this.searchTime[0].toLocaleDateString();
        let end = this.searchTime[1].toLocaleDateString();
        this.formInline.start = new Date(start).getTime();
        this.formInline.end = new Date(end).getTime();
      } else {
        this.formInline.start = "";
        this.formInline.end = "";
      }
      let params = {
        pageNum: this.newpage,
        pageSize: 20,
        params: {
          type: this.activeName === "live" ? "1" : "2",
          ...this.formInline,
          businessId: this.bidValue,
          dataSource: obj1
        }
      };
      let apiUrl = api.adminVideoList;
      var res1 = await http.post(apiUrl, params);
      if (res1.data.code === 0) {
        this.tableData = res1.data.data.list;
        this.total = res1.data.data.total;
      }
    },
    // 删除banner
    deleteBanner: async function (id) {
      var params = {
        id: id
      };
      var res = await http.post(api.deleteBanner, params);
      if (res.data.code === 0) {
        alert("删除成功");
        this.bannerList(1);
      }
    }
  }
};
</script>
<style>
.test-area-editor img {
  max-width: 100%;
}
</style>

<style scoped>
.test-area {
  width: 400px;
  min-height: 150px;
  background: #f7f7f7;
  border: 1px solid #e5e5e5;
  padding: 5px;
  padding-top: 20px;
  outline: none;
}

.big {
  display: block;
  word-break: break-all;
}

.piont-flex-- .point-title {
  line-height: 36px;
}

.info-block .info-self {
  display: inline-block;
  width: 113px;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: right;
  margin-right: 30px;
}

.info-block .info-selfs {
  width: 300px;
  padding-top: 15px;
  padding-bottom: 15px;
  text-align: left;
  margin-left: 111px;
}

.info-block .info-selfs:nth-of-type(1) {
  margin-top: -18px;
}

.info-contents {
  margin-right: 70px;
  float: left;
  width: 735px;
}

.info-contents img {
  width: 200px;
  height: 200px;
  margin: 10px 8px 8px 0;
}

.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100px;
  height: 80px;
}

.searchStyle {
  margin-right: 20px;
}
</style>

<template>
  <div class="modeList">
    <header-content :title="headerTitle"></header-content>
    <div class="piont-flex--" style="border:none;">
      <div class="point-title">
        <el-form
            :inline="true"
            :model="formInline"
            class="demo-form-inline"
        >
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
            <el-select
                v-model="formInline.status"
                placeholder="请选择类型"
            >
              <el-option
                  v-for="(item, index) in videoStatus"
                  :key="index"
                  :label="item.title"
                  :value="item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="bidValue === '9'" label="会议类型：">
            <el-select
                v-model="formInline.videoType"
                placeholder="请选择类型"
            >
              <el-option
                  v-for="(item, index) in videoType"
                  :key="index"
                  :label="item.title"
                  :value="item.status"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
              label="预设开始时间："
              v-if="this.activeName === 'live'"
          >
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
          <el-form-item
              label="直播开始时间："
              v-if="this.activeName === 'live'"
          >
            <el-date-picker
                style="width: 250px"
                @change="pickerChange2"
                v-model="searchTime2"
                type="daterange"
                align="right"
                placeholder="选择日期范围"
                :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
              label="创建日期："
              v-if="this.activeName === 'video'"
          >
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
            <el-input
                clearable
                v-model="formInline.name"
                placeholder="请输入名称"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="创建人:"
          >
            <el-input clearable v-model="formInline.createUserName" placeholder="请输入创建人"></el-input>
          </el-form-item>

           <el-form-item
            label="讲师:"
             v-if="bidValue !== '9'"
          >
            <el-input clearable v-model="formInline.launchName" placeholder="请输入讲师"></el-input>
          </el-form-item>

          <el-form-item
            v-if="bidValue === '9' && isShow"
            label="主持人:"
          >
            <el-input clearable v-model="formInline.launchName" placeholder="请输入主持人"></el-input>
          </el-form-item>

          <el-form-item
              v-if="bidValue === '9' && isShow"
              label="互动会议号:"
              class="searchStyle"
          >
            <el-input
                clearable
                v-model="formInline.zoomMettingNumber"
                placeholder="请输入名称"
            ></el-input>
          </el-form-item>
          <el-form-item class="searchStyle">
            <el-button type="primary" @click="search"
            >查询
            </el-button
            >
          </el-form-item>
          <el-form-item class="searchStyle">
            <el-button
                type="primary"
                :loading="exportLoding"
                @click="exportList"
            >导出
            </el-button
            >
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
              :videoAudit="videoAudit"
              :user-auths="userAuths"
              :table-data="tableData"
              :business-id="bidValue"
              @change="tabActiveChange"
          />
        </el-tab-pane>
        <el-tab-pane label="点  播" name="video">
          <video-list
              v-if="activeName === 'video' && uploadDom"
              :videoAudit="videoAudit"
              :user-auths="userAuths"
              :table-data="tableData"
              :business-id="bidValue"
              @change="tabActiveChange"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="提示" :visible.sync="ends">
			<span style="color: red;"
      >是否确认结束当前课程，确认后直播强制自动结束，不能再次开启直播</span
      >
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
    <el-dialog
        title="详情"
        :visible.sync="centerDialogVisible"
        height="auto"
        center
    >
      <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
          v-if="formLabelAlign.dataSource"
      >
        <el-form-item label="业务类型：">
          <span>{{ formLabelAlign.businessId | businessName }}</span>
        </el-form-item>
        <el-form-item label="栏目：">
          <span>{{ navigationName }}</span>
        </el-form-item>
        <el-form-item label="形式:">
          <span>{{ isShow === true ? '直播' : '点播' }}</span>
        </el-form-item>
        <el-form-item label="媒体:">
          <span>{{ formLabelAlign.programType ? '音频' : '视频' }}</span>
        </el-form-item>
        <el-form-item label="标题：">
          <span>{{ formLabelAlign.name }}</span>
        </el-form-item>
        <el-form-item label="封面图：">
          <img
              :src="formLabelAlign.coverUrl"
              style="width:200px;height:200px"
              alt
          />
        </el-form-item>
        <el-form-item
            :label="'产品：' + formLabelAlign.dataSource.tags"
            v-if="
						bidValue !== '5' &&
							bidValue !== '9' &&
							formLabelAlign.dataSource.tags
					"
        >
					<span v-if="formLabelAlign.dataSource">
						{{ formLabelAlign.dataSource.tags }}
					</span>
        </el-form-item>
        <el-form-item v-show="!isShow" label="展示时间：">
          <el-date-picker
              v-model="formLabelAlign.showTime"
              type="datetime"
              placeholder="选择日期时间"
          ></el-date-picker>
          <br/>
          <el-button
              type="primary"
              @click="updateShowTime(formLabelAlign.showTime)"
          >修改时间
          </el-button>
        </el-form-item>
        <el-form-item v-show="isShow" label="开始时间：">
          <span>{{ formLabelAlign.startTime | formatDate }}</span>
        </el-form-item>
        <el-form-item v-show="isShow" label="结束时间：">
          <span>{{ formLabelAlign.endTime | formatDate }}</span>
        </el-form-item>
        <!--讲师嘉宾-->
        <el-form-item :label="$options.filters.launchName(formLabelAlign.businessId)">
          <p style="margin:0">
						<span
                v-for="item in formLabelAlign.launchList"
                :key="item.id"
            >{{ item.name }}</span
            >
          </p>
        </el-form-item>
        <el-form-item label="会议号:" v-if="bidValue === '9' && isShow">
          <p style="margin:0">
            <span>{{ formLabelAlign.zoomMettingNumber }}</span>
          </p>
        </el-form-item>
        <el-form-item
            v-if="
						bidValue === '3' &&
							formLabelAlign.viceLaunchList &&
							formLabelAlign.viceLaunchList.length !== 0 &&
							isShow
					"
            label="嘉宾:"
        >
          <p style="margin:0">
						<span
                v-for="(item,
							index) in formLabelAlign.viceLaunchList"
                :key="index"
            >{{ item.name }}&nbsp;&nbsp;</span
            >
          </p>
        </el-form-item>
        <div v-if="false">
          <el-form-item
              v-if="
							bidValue === '5' &&
								formLabelAlign.guestList &&
								formLabelAlign.guestList.length !== 0 &&
								isShow
						"
              label="嘉宾:"
          >
            <p style="margin:0">
							<span
                  v-for="(item,
								index) in formLabelAlign.guestListName"
                  :key="index"
              >{{ item.name }}&nbsp;&nbsp;</span
              >
            </p>
          </el-form-item>
          <!-- <div class="info-block block3" v-if="bidValue === '5'">
						<span
                class="info-self"
                v-if="
								formLabelAlign.schedulepc.length !== 0 ||
									formLabelAlign.schedulemobile.length !== 0
							"
            >日程：</span
            >
            <div
                class="info-selfs"
                v-if="formLabelAlign.schedulepc.length !== 0"
            >
              网站展示日程:
              <div class="info-contents">
                <img
                    v-for="(item,
									index) in formLabelAlign.schedulepc"
                    :key="index"
                    :src="item.url"
                    alt
                />
              </div>
            </div>
            <div
                class="info-selfs"
                v-if="formLabelAlign.schedulemobile.length !== 0"
            >
              移动端展示日程:
              <div class="info-contents">
                <img
                    v-for="(item,
									index) in formLabelAlign.schedulemobile"
                    :key="index"
                    :src="item.url"
                    alt
                />
              </div>
            </div>
          </div> -->
          <div class="info-block block3" v-if="bidValue==='5'">
          <span
              class="info-self"
              v-if="formLabelAlign.dataSource.schedule.pc.length !== 0  || formLabelAlign.dataSource.schedule.mobile.length !== 0"
          >日程：</span>
            <div class="info-selfs" v-if="formLabelAlign.dataSource.schedule.pc.length !== 0">
              网站展示日程:
              <div class="info-contents">
                <img
                    v-for="(item,index) in formLabelAlign.dataSource.schedule.pc"
                    :key="index"
                    :src="item.url"
                    alt
                >
              </div>
            </div>
            <div class="info-selfs" v-if="formLabelAlign.dataSource.schedule.mobile.length !== 0">
              移动端展示日程:
              <div class="info-contents">
                <img
                    v-for="(item, index) in formLabelAlign.dataSource.schedule.mobile"
                    :key="index"
                    :src="item.url"
                    alt
                >
              </div>
            </div>
          </div>
          <el-form-item
              v-if="
							bidValue === '5' &&
								formLabelAlign.hostAddress !== ''
						"
              label="举办地址："
          >
            <p style="margin:0">
              <span>{{ formLabelAlign.hostAddress }}</span>
            </p>
          </el-form-item>
          <el-form-item
              v-if="bidValue === '5' && formLabelAlign.master !== ''"
              label="主办方："
          >
            <p style="margin:0">
              <span>{{ formLabelAlign.master }}</span>
            </p>
          </el-form-item>
          <el-form-item
              v-if="bidValue === '5' && formLabelAlign.assist !== ''"
              label="协办方："
          >
            <p style="margin:0">
              <span>{{ formLabelAlign.assist }}</span>
            </p>
          </el-form-item>
          <el-form-item
              v-if="
							bidValue === '5' && formLabelAlign.cibtractor !== ''
						"
              label="承办方："
          >
            <p style="margin:0">
              <span>{{ formLabelAlign.cibtractor }}</span>
            </p>
          </el-form-item>
          <el-form-item
              v-if="
							bidValue === '5' &&
								formLabelAlign.dataSource && formLabelAlign.dataSource.tags &&
								formLabelAlign.dataSource.tags !== ''
						"
              label="标签输入："
          >
            <p style="margin:0">
							<span v-if="formLabelAlign.dataSource">{{
                  formLabelAlign.dataSource.tags
                }}</span>
            </p>
          </el-form-item>
          <el-form-item
              v-if="bidValue==='5' && formLabelAlign.dataSource.dataList.length !== 0"
              label="会议资料:"
          >
            <p style="margin:0">
            <span
                v-for="(item, index) in formLabelAlign.dataSource.dataList"
                :key="index"
                style="cursor: pointer"
                @click="open(item.url)"
            >{{ item.name }}</span>
            </p>
          </el-form-item>
          <el-form-item v-if="bidValue === '5'" label="是否发放福袋:">
            <p style="margin:0">
							<span>{{
                  formLabelAlign.awardSwitch === 1 ? '是' : '否'
                }}</span>
            </p>
          </el-form-item>
          <el-form-item v-if="bidValue === '5'" label="是否发放问卷:">
            <p style="margin:0">
							<span>{{
                  formLabelAlign.answerSwitch === 1 ? '是' : '否'
                }}</span>
            </p>
          </el-form-item>
          <el-form-item v-if="bidValue === '5'" label="是否完善信息:">
            <p style="margin:0">
							<span>{{
                  formLabelAlign.perfect === 213 ? '是' : '不需要'
                }}</span>
            </p>
          </el-form-item>
        </div>
        <el-form-item
            label="简介:"
            v-if="formLabelAlign.description !== ''"
        >
          <div
              class="test-area intro-content ql-editor test-area-editor"
              v-html="formLabelAlign.description"
          ></div>
        </el-form-item>
        <el-form-item
            label="视频审核:"
            v-if="videoAudit"
        >
          <!-- <el-button type="info" @click="approve(formLabelAlign.busId,0)">合格</el-button> -->
          <!-- <el-button type="danger" @click="approve(formLabelAlign.busId,1)">不合格</el-button> -->
          <el-radio v-model="auditObj.approveState" label="0">合格</el-radio>
          <el-radio v-model="auditObj.approveState" label="1">不合格</el-radio>
        </el-form-item>
        <el-form-item
            label="拒绝原因:"
            v-if="videoAudit && auditObj.approveState === '1'"
        >
          <el-select v-model="reasonOptionsValue" @change="reasonChange" placeholder="请选择拒绝原因">
            <el-option
              v-for="item in reasonOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              >
            </el-option>
          </el-select>
          <el-input
            v-show="reasonOptionsValue === '其它' || textAreaShow === 1"
            class="textarea"
            type="textarea"
            maxlength="1000"
            placeholder="请输入拒绝原因"
            v-model="auditObj.reason">
          </el-input>
        </el-form-item>
        <!-- <el-form-item  label="增加观看人次:">
           <el-input-number v-model="formLabelAlign.viewCountAdd" :min="0" :max="99999"></el-input-number>
           <el-link class="marging_left" :underline="false" @click="getCountadd">确定</el-link>
        </el-form-item> -->
        <el-form-item  label="推流地址:">
           <span v-if="formLabelAlign.pushUrl">{{ formLabelAlign.pushUrl }}</span>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <!-- <el-button type="primary" @click="save">保 存</el-button> -->
				<el-button @click="centerDialogVisible = false"
        >关 闭</el-button
        >
			</span>
    </el-dialog>
    <!--下载详情-->
    <el-dialog title="下载详情" :visible.sync="details" center>
      <el-form
          :label-position="labelPosition"
          label-width="100px"
          :model="formLabelAlign"
      >
        <el-form-item label="标题：">
          <span>{{ formLabelAlign.name }}</span>
        </el-form-item>
        <el-form-item
            label="下载地址:"
        >
          <div v-if="urls.playbackUrl && downloadType === 1">
            <span class="big">{{ urls.playbackUrl }}</span>
            <el-button type="info" @click="opens(urls.playbackUrl)"
            >下载
            </el-button
            >
          </div>
        </el-form-item>

        <el-form-item
            label="下载地址:"
            v-show="urls.playbackUrl && downloadType === 2 && key === 0"
        >
          <span class="big">{{ urls.playbackUrl }}</span>
          <el-button type="info" @click="opens(urls.playbackUrl)"
          >下载
          </el-button
          >
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
import LiveList from "../base/LiveList";
import VideoList from "../base/VideoList";

export default {
  name: "modeList",
  components: {
    VideoList,
    LiveList,
    HeaderContent
  },
  data() {
    return {
      textAreaShow: 0,
      reasonOptionsValue: '',
      reasonOptions:[{
          value: '时长不足',
          label: '时长不足'
        }, {
          value: '非指定ppt模版',
          label: '非指定ppt模版'
        }, {
          value: '无PPT/ppt被遮挡',
          label: '无PPT/ppt被遮挡'
        }, {
          value: '声音异常&ppt异常',
          label: '声音异常&ppt异常'
        }, {
          value: '声音异常&视频异常',
          label: '声音异常&视频异常'
      },{
          value: '视频异常&ppt异常',
          label: '视频异常&ppt异常'
      },{
          value: '声音异常/无声音',
          label: '声音异常/无声音'
      },{
          value: '视频异常/无视频',
          label: '视频异常/无视频'
      },{
          value: '其它',
          label: '其它'
      }],
      activeName: "live",
      exportLoding: false,
      searchTime: "",
      searchTime2: "",
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
        lecturerName: "",
        start: "",
        end: "",
        // videoType: ""
        videoType: "",
        realStart: "",
        realEnd: "",
        createUserName: "",
        launchName: ""
      },
      navigationName: "",
      headerTitle: this.$route.name,
      searchVal: "",
      tableData: [],
      ends: false,
      auditObj: {
        approveState: "0",
        reason:""
      },
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
        perfect: "",
        formLabelAlign: 0,
        pushUrl: ""
      },
      audience: [],
      identityExist: "",
      identityPublic: "",
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
    $route() {
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
      "userAuths",
      "identity",
      "videoAudit"
    ])
  },
  filters: {
    launchName(businessId) {
      if (businessId !== 5 && businessId !== 9) {
        return '讲师'
      } else if (businessId === 5) {
        return '主播'
      } else if (businessId === 9) {
        return '主持人'
      } else {
        return '讲师'
      }
    },
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
      let date = new Date(time);
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
    reasonChange(){
      if(this.reasonOptionsValue !== '其它'){
        this.auditObj.reason = this.reasonOptionsValue
        this.textAreaShow = 0
      } else {
        this.auditObj.reason = ''
      }
    },
    async save(){
      const params = {
        busId: this.formLabelAlign.busId,
        approveState: Number(this.auditObj.approveState),
        reason: this.auditObj.reason
      };
      if(this.auditObj.approveState == 0 || this.auditObj.approveState == 1){
        const res = await http.post(api.dataSourceApprove, params);
        if (res.data.code === 0) {
          this.centerDialogVisible = false
          this.getVideoList(this.newpage)
        }
      } else{
          this.centerDialogVisible = false
      }
    },
    // async approve(busId,approveState){
    //   const params = {
    //     busId: busId,
    //     approveState: approveState
    //   };
    //   const res = await http.post(api.dataSourceApprove, params);
    //   if (res.data.code === 0) {
    //     this.centerDialogVisible = false
    //     this.getVideoList(this.newpage)
    //   }
    // },
    getIdentityVideoVersion: async function (busId) {
      this.identityExist = false;
      this.identityPublic = true;
      // var res = await http.get(api.getIdentityVideoVersion + busId);
      // if (res.data.code === 0) {
      //   this.identityExist = res.data.data.exist;
      //   this.identityPublic = res.data.data.isPublic;
      // } else {
      //   this.$message.error(res.data.message);
      // }
    },
    updateForm() {
      this.bidValue = this.$route.matched[0].meta.businessId.toString();
      this.activeName = "live";
      this.tableData = [];
      this.formInline.name = "";
      this.formInline.status = "";
      this.formInline.end = "";
      this.formInline.start = "";
      this.formInline.realEnd = "";
      this.formInline.realStart = "";
      this.formInline.createUserName = "";
      this.formInline.launchName = "";
      this.value = "";
      this.searchTime = "";
      this.searchTime2 = "";
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
        case "pause":
          this.pauseVideo(params.busId);
          break;
        case "handleClick":
          this.handleClick(params.busId, params.type, params.businessId, params.dataSource.signInSwitch, params.dataSource.signUpSwitch, params.isOld);
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
        case "liveStatusCorrection": // 状态修正
          this.setStatusCorrection(params.id)
          break
        case "credentialsExport": // 导出证件照
          this.credentialsExport(params.busId)
          break
        case "blackList": // 会议黑名单
          this.goBlackList(params.busId)
          break
        case "applyList": // 申请管理
          this.goApplyList(params.busId, params.dataSource.isAutoAudit)
          break
      }
      // 列表功能按钮触发
    },
    credentialsExport(busId) {
      // 导出证件照
      this.$http.get(this.$api.video.credentialsExport + busId).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          window.location.href = data
        } else {
          this.$message.error(message)
        }
      })
    },
    setStatusCorrection(id) {
      // 状态修正
      this.$http.get(this.$api.video.statusCorrection + id).then(res => {
        let {code, message} = res.data
        if (code === 0) {
          this.getVideoList(this.newpage);
          this.$message.success('状态修正成功')
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
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
      console.log(this.formInline)
    },
    pickerChange2(v) {
      // 选择时间范围
      if (!v || v === "") {
        this.searchTime2 = [];
      }
    },
    // 导出视频列表
    // exportList() {
    //   this.exportLoding = true;
    //   let businessId = this.$route.matched[0].meta.businessId;
    //   let type = this.activeName === "live" ? 1 : 2;
    //   http.get(api.videoExport + `/${businessId}/${type}`).then(res => {
    //     let {code, data, message} = res.data;
    //     this.exportLoding = false;
    //     if (code === 0) {
    //       window.location.href = data;
    //       this.$message.success("导出成功");
    //     } else {
    //       this.$message.error(message);
    //     }
    //   });
    // },
    exportList: async function () {
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

      if (this.searchTime2 && this.searchTime2.length > 0) {
        let realStart = this.searchTime2[0].toLocaleDateString();
        let realEnd = this.searchTime2[1].toLocaleDateString();
        this.formInline.realStart = new Date(realStart).getTime();
        this.formInline.realEnd = new Date(realEnd).getTime();
      } else {
        this.formInline.realStart = "";
        this.formInline.realEnd = "";
      }

      this.exportLoding = true;
      let params = {
        type: this.activeName === "live" ? "1" : "2",
        ...this.formInline,
        businessId: this.bidValue,
        dataSource: obj1
      };
      let res = await http.post(api.videoExport, params);
      let {code, data, message} = res.data;
      if (code === 0) {
        this.exportLoding = false;
        if (code === 0) {
          window.location.href = data;
          this.$message.success("导出成功");
        } else {
          this.$message.error(message);
        }
      }
    },
    goInteraction(businessId, busId, commentId) {

      if (this.identity === 0) {  // 0未开启身份开关
        this.$router.push({
          path: `interaction/${businessId}/${busId}/${commentId}`
        });
      } else if (this.identity === 1) { // 1开启身份开关
        this.$router.push({
          path: `interactionV2/${businessId}/${busId}/${commentId}`
        });
      }

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
        this.editByContentIdAndBusinessId(time1.getTime())
        this.$message.success('修改成功')
      }
    },
    editByContentIdAndBusinessId(time) {
      // 同步时间给小强
      let params = {
        contentId: this.formLabelAlign.id,
        showTimeStart: time,
        businessId: this.bidValue
      }
      http.post(this.$api.navigation.editByContentIdAndBusinessId, params)
    },
    // query(id) {
    //   let path = this.$route.matched[0].path;
    //   this.$router.push({path: path + "/detailed/" + id});
    // },
    query: async function (id) {
      await this.getIdentityVideoVersion(id);
      if (this.identityPublic === false && this.identityExist === true) {
        let path = this.$route.matched[0].path;
        this.$router.push({path: path + "/detailed2/" + id});
      } else {
        let path = this.$route.matched[0].path;
        this.$router.push({path: path + "/detailed/" + id});
      }

      // let path = this.$route.matched[0].path;
      // this.$router.push({ path: path + "/detailed/" + id });
    },
    // 结束功能
    end(busId) {
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
        await this.getVideoList(this.newpage);
        this.$message("结束成功");
      } else {
        this.$message.error(res.data.message);
      }
      this.ends = false;
    },
    pauseVideo: async function (busId) {
      this.$confirm('是否确认暂停当前课程', '提示', {
        confirmButtonText: '确定',
        showCancelButton: '取消',
        type: 'warning'
      }).then(async () => {
        const res = await http.get(api.adminLivePause + busId);
        if (res.data.code === 0) {
          await this.getVideoList(this.newpage);
          this.$message("暂停成功");
        } else {
          this.$message.error(res.data.message);
        }
      }).catch(() => {
      })
    },
    Audience(tags) {
      if (!tags) {
        this.audience = [];
      } else {
        let jsonTags = JSON.parse(tags);
        let array = jsonTags[3];
        let array1 = [];
        for (let i = 0; i < array.length; i++) {
          array1.push(array[i][0]);
        }
        this.audience = array1;
      }
    },
    // 回放下载
    downLoad: async function (name, id, type, busId) {
      this.formLabelAlign.name = name;
      if (type === 1) {
        let params = {
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
          // this.urls = res.data.data.data[0];
           setTimeout(() => {
            this.urls = res.data.data.data[0];
           }, 300)
        }
      }
      if (type === 2) {
        http.get(api.videoAddress + `${busId}/${id}`).then(res => {
          this.downloadType = 2;
          this.details = true;
          // this.urls = res.data.data[0];
           setTimeout(() => {
            this.urls = res.data.data.data[0];
           }, 300)
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
    getReasonType(item) {
      switch (item) {
        case '时长不足':
          return 1;
        case '非指定ppt模版':
          return 2;
        case '无PPT/ppt被遮挡':
          return 3;
        case '声音异常&ppt异常':
          return 4;
        case '声音异常&视频异常':
          return 5;
        case '视频异常&ppt异常':
          return 6;
        case '声音异常/无声音':
          return 7;
        case '视频异常/无视频':
          return 8;
        default:
          return 9;
      }
    },
    // 获取列表详情
    examine: async function (id, type) {
      this.busId = id;
      let apiurl = api.adminVideoDetail
      if (type === 1) {
        this.isShow = true;
        const res = await http.get(apiurl + id);
        for (let item of this.options) {
          if (item.value === res.data.data.dataSource.navigationId)
            this.navigationName = item.label;
        }
        this.formLabelAlign = res.data.data;
        if(res.data.data.dataSource){
          this.auditObj.approveState = String(res.data.data.dataSource.approveState)
          this.auditObj.reason = res.data.data.dataSource.reason

          this.reasonOptionsValue = res.data.data.dataSource.reason
          if(this.getReasonType(this.reasonOptionsValue) === 9){

            if(this.auditObj.reason == null ){
              this.textAreaShow = 0
              this.reasonOptionsValue = '时长不足'
            }else{
              this.textAreaShow = 1
              this.reasonOptionsValue = '其它'
            }

          } else {
            this.textAreaShow = 0
          }
        }
        this.Audience(this.formLabelAlign.tags);
        this.centerDialogVisible = true;
      } else if (type === 2) {
        this.isShow = false;
        const res = await http.get(apiurl + id);
        for (let optionsItem of this.options) {
          if (optionsItem.value === res.data.data.dataSource.navigationId)
            this.navigationName = optionsItem.label;
        }
        this.formLabelAlign = res.data.data;
        if(res.data.data.dataSource){
          this.auditObj.approveState = String(res.data.data.dataSource.approveState)
          this.auditObj.reason = res.data.data.dataSource.reason

          this.reasonOptionsValue = res.data.data.dataSource.reason
          if(this.getReasonType(this.reasonOptionsValue) === 9){
            this.textAreaShow = 1
            this.reasonOptionsValue = '其它'
          } else {
            this.textAreaShow = 0
          }
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
        await this.getVideoList(this.newpage);
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
      let params = {
        pageNum: 1,
        pageSize: 9999
      };
      let res = await http.post(api.getMenuList, params);
      if (res.data.code === 0) {
        let array = res.data.data.data;
        let obj = {};
        for (let i = 0; i < array.length; i++) {
          let str = String(array[i].businessId);
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
    goBlackList(busId) {
      this.$router.push({path: "blacklist/" + busId});
    },
    goApplyList(busId, isAutoAudit) {
      this.$router.push({
        path: "applylist/" + busId,
        query: {
          isAutoAudit: isAutoAudit
        }
      });
    },
    // 统计信息按钮点击事件
    handleClick: async function (id, type, type1, signInswitch, signUpswitch, isOld) {
      //      上面注释是原版  下面按占河要求修改
      await this.getIdentityVideoVersion(id);

      let page = this.newpage;
      if (this.identityPublic === false && this.identityExist === true) { //有身份
        if (type1 === 9 && type === 1) {
          this.$router.push({
            path:
                "classdata2/" +
                id +
                "/" +
                page +
                "?type=" +
                3 +
                "&service=" +
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
          });
        } else if (type1 === 9 && type === 2) {
          this.$router.push({
            path:
                "classdata2/" +
                id +
                "/" +
                page +
                "?type=" +
                2 +
                "&service=" +
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
          });
        } else if (type === 1) {
          this.$router.push({
            path:
                "classdata2/" +
                id +
                "/" +
                page +
                "?type=" +
                1 +
                "&service=" +
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
          });
        } else if (type === 2) {
          this.$router.push({
            path:
                "classdata2/" +
                id +
                "/" +
                page +
                "?type=" +
                2 +
                "&service=" +
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
          });
        }
      } else { // 无身份
        if (type1 === 9 && type === 1) {
          this.$router.push({
            path:
                "classdata/" +
                id +
                "/" +
                page +
                "?type=" +
                3 +
                "&service=" +
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
          });
        } else if (type1 === 9 && type === 2) {
          this.$router.push({
            path:
                "classdata/" +
                id +
                "/" +
                page +
                "?type=" +
                2 +
                "&service=" +
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
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
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
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
                this.bidValue +
                "&activeName=" +
                this.activeName +
                "&signInswitch=" +
                signInswitch +
                "&signUpswitch=" +
                signUpswitch +
                "&isOld=" +
                isOld
          });
        }
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
    // 增加票数
    async getCountadd () {
       let params = {
        busId: this.formLabelAlign.busId,
        viewCountAdd: this.formLabelAlign.viewCountAdd
      };
      let res = await http.post(api.videoManage.countadd, params);
      if (res.data.code === 0) {
        this.$message.success('观看人次添加成功')
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

      if (this.searchTime2 && this.searchTime2.length > 0) {
        let realStart = this.searchTime2[0].toLocaleDateString();
        let realEnd = this.searchTime2[1].toLocaleDateString();
        this.formInline.realStart = new Date(realStart).getTime();
        this.formInline.realEnd = new Date(realEnd).getTime();
      } else {
        this.formInline.realStart = "";
        this.formInline.realEnd = "";
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
      let res1 = await http.post(apiUrl, params);
      if (res1.data.code === 0) {
        this.tableData = res1.data.data.list;
        this.total = res1.data.data.total;
      }
    },
    // 删除banner
    deleteBanner: async function (id) {
      let params = {
        id: id
      };
      let res = await http.post(api.deleteBanner, params);
      if (res.data.code === 0) {
        alert("删除成功");
        await this.bannerList(1);
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
  padding: 20px 5px 5px;
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
.marging_left {
  margin-left: 20px;
}
</style>

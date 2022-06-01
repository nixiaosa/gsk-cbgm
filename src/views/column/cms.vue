<template>
  <div class="statis-area">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="日期">
        <el-date-picker
          style="width: 250px"
          @change="pickerChange"
          v-model="timeDaterange"
          type="daterange"
          align="right"
          placeholder="选择日期范围"
          :default-time="['00:00:00', '23:59:59']"
          :picker-options="pickerOptions"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" @click="exportList">导出</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="20">
      <el-col :span="4">
        <div class="grid-content bg-purple">
          浏览人数（UV）
          <p>{{ uv }}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          浏览次数（PV）
          <p>{{ pv }}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          IP数
          <p>{{ ip }}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          总时长（分钟）
          <p>{{ durationCount }}</p>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content bg-purple">
          平均浏览时长（分钟）
          <p>{{ durationAvg }}</p>
        </div>
      </el-col>
    </el-row>
    <el-select v-show="echartShow" v-model="value" placeholder="请选择" style="width: 180px; height: 20px" @change="getData(value)">
      <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
    </el-select>
    <div id="myChart" v-show="echartShow"></div>
    <div class="look-arr" v-show="echartShow">
      <div>
        <div class="drop"></div>
        {{ this.dataMapName }}
      </div>
    </div>
    <el-table :data="tableListData" style="width: 100%">
      <el-table-column label="日期">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.time | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="浏览次数（PV）">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.pvCounts }}</span>
        </template>
      </el-table-column>

      <el-table-column label="访客数(UV)">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.uvCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP数">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.ipCounts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="总时长（分钟）">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.durationCounts | millisToMinutesAndSeconds }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平均浏览时长（分钟）">
        <template slot-scope="scope">
          <span style="margin-left: 10px">{{ scope.row.avgDurationCounts | millisToMinutesAndSeconds}}</span>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import http from "@/utils/tenant";
import { Api } from "@/api/api";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import HeaderContent from "@/components/header-content";
import echarts from "echarts";

export default {
  name: "cms",
  components: {
    HeaderContent
  },
  data() {
    return {
      formInline: {
        currentUri: "https://" + window.location.host + "/#/column/article/*",
        mobileCurrentUri: "https://" + window.location.host + "/mobile/#/column/article/*",
        // currentUri: "http://" + "localhost:8090" + "/#/column/article/*",
        element: "article",
        intervalType: "DAY",
        loginStatus: "ALL",
      },
      currentPage: 1,
      total: 1,
      searchInfo: {
        prop: "",
        status: null,
        startTime: "",
        endTime: ""
      },
      timeDaterange: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近7天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近30天",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      headerTitle: "CMS统计",
      tableListData: [],
      echartShow: true,
      uv: "—",
      pv: "—",
      ip: "—",
      durationCount: "—",
      durationAvg: "—",
      xAxis: [],
      dataMap: [],
      dataMapName: "浏览次数(PV)",
      options: [
        {
          value: "UV",
          label: "浏览人数(UV)"
        },
        {
          value: "PV",
          label: "浏览次数(PV)"
        },
        {
          value: "IP",
          label: "IP数"
        },
        {
          value: "sumDate",
          label: "总时长"
        },
        {
          value: "aveDate",
          label: "平均时长"
        }
      ],
      value: "UV",
    };
  },
  computed: {},
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    millisToMinutesAndSeconds(millis) {
      var minutes = (millis / 60000).toFixed(2);
      return minutes;
    }
  },
  mounted() {
    this.setTimeFn();
    this.dataList(1);
    this.getUv();
    this.getPv();
    this.getIp();
    this.getDurationCount();
    this.getAvg();
  
    // this.getData(this.value);
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val;
      this.dataList(val);
      this.getData(this.value);
    },
    exportList() {
      // 导出列表
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      this.$http.post(api.statisticsExcelcms, params).then(res => {
        this.exportLoading = false
        let {code, data, message} = res.data
        if (code === 0) {
          window.location.href = data
        } else {
          this.$message.error(message)
        }
      })
    },
    setTimeFn() {
      //当前设定的日期时间
      let d = new Date();
      let year1, month1, day1;
      [year1, month1, day1] = [d.getFullYear(), d.getMonth(), d.getDate()];
      let date1 = new Date(year1, month1, day1, 6);
      this.timeDaterange.push(date1);
      //前 7天设定的日期时间
      let year2, month2, day2;
      d.setTime(d.getTime() - 24 * 60 * 60 * 1000 * 6);
      [year2, month2, day2] = [d.getFullYear(), d.getMonth(), d.getDate()];
      let date2 = new Date(year2, month2, day2, 7);
      this.timeDaterange.unshift(date2);
      let daterange = this.timeDaterange;
      if (daterange.length > 0) {
        let start = daterange[0].toLocaleDateString();
        let end = daterange[1].toLocaleDateString();
        this.searchInfo.startTime = new Date(start).getTime();
        this.searchInfo.endTime = new Date(end).getTime() + 24 * 60 * 60 * 1000 - 1;
      } else {
        this.searchInfo.startTime = "";
        this.searchInfo.endTime = "";
      }
    },
    pickerChange(v) {
      // 时间查询解析
      if (!v || v === "") {
        this.timeDaterange = [];
      }
      let daterange = this.timeDaterange;
      if (daterange.length > 0) {
        let start = daterange[0].toLocaleDateString();
        let end = daterange[1].toLocaleDateString();
        this.searchInfo.startTime = new Date(start).getTime();
        this.searchInfo.endTime = new Date(end).getTime() + 24 * 60 * 60 * 1000 - 1;
      } else {
        this.searchInfo.startTime = "";
        this.searchInfo.endTime = "";
      }
    },

    dataList: async function(pageNum) {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      params.pageNum = pageNum;
      params.pageSize = 10;
      let res = await http.post(api.statisticsList, params);
      this.tableListData = res.data.data.data;
      this.total = res.data.data.total;
      // this.xAxis = [];
      // this.tableListData.map(item=>{
      //   this.xAxis.push(formatDate(new Date(item.time), "yyyy-MM-dd"))
      //   this.drawLine()
      // })
    },
    
    millisToMinutesAndSeconds(millis) {
      var minutes = (millis / 60000).toFixed(2);
      return minutes;
    },
    onSubmit() {
      this.dataList(1);
      
      this.getUv();
      this.getPv();
      this.getIp();
      this.getDurationCount();
      this.getAvg();
      this.getData(this.value);
      // console.log(this.value)
    },
    
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById("myChart"));

      // 绘制图表
      myChart.setOption({
        title: { text: "" },
        tooltip: {},
        legend: {
	        data: this.dataMapName,
	        right: 'top'
        },
        // color: ["#66B1FF"],
        color: ["#00B070"],
        shadowColor: "rgba(0, 0, 0, 0.5)",
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: this.xAxis
        },
        yAxis: {
          type: "value",
          name: this.dataMapName,
        },
        series: [
          {
            name: this.dataMapName,
            type: "line",
            areaStyle: {},
            data: this.dataMap,
          }
        ]
      });
    },
    getData: async function(value) {
      // console.log(this.value)
      switch (value) {
        case "UV":
          this.getUvChart();
          break;
        case "PV":
          this.getPvChart()
          break;
        case "IP":
          this.getIpChart()
          break;
        case "sumDate":
          this.getDurationCountChart();
          break;
        case "aveDate":
          this.getAvgChart();
          break;
        default:
      }
    },
    getPv: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetPv, params);
      this.pv = res.data.data.docCount;
    },
    getPvChart: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetPv, params);
      this.dataMapName = "浏览次数(PV)";
      this.dataMap = []
      this.xAxis = []
      // res.data.data.buckets.map((item,index)=>{
      //   this.dataMap[index] = res.data.data.buckets[index].docCount;
      //   this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
      //   this.drawLine();
      // })

      if(res.data.data.buckets.length > 0){
        this.echartShow = true;
        res.data.data.buckets.map((item,index)=>{
        this.dataMap[index] = res.data.data.buckets[index].docCount;
        this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
        this.drawLine();
        })
      }else{
        this.echartShow = false;
      }
    },
    getUv: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetUv, params);
      this.uv = res.data.data.docCount;

      //此处首次加载时展示“浏览人数(UV)”，不重复调用 UV接口 故写在 getUv()内而不写在 getUvChart()方法里
      this.dataMapName = "浏览人数(UV)";
      this.dataMap = []
      this.xAxis = []
      
      // res.data.data.buckets.map((item,index)=>{
      //   this.dataMap[index] = res.data.data.buckets[index].docCount;
      //   this.drawLine();
      // })
      if(res.data.data.buckets.length > 0){
        this.echartShow = true;
        res.data.data.buckets.map((item,index)=>{
        this.dataMap[index] = res.data.data.buckets[index].docCount;
        this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
        this.drawLine();
        })
      }else{
        this.echartShow = false;
      }



    },
    getUvChart: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetUv, params);
      this.dataMapName = "浏览人数(UV)";
      this.dataMap = []
      this.xAxis = []
      
      if(res.data.data.buckets.length > 0){
        this.echartShow = true;
        res.data.data.buckets.map((item,index)=>{
        this.dataMap[index] = res.data.data.buckets[index].docCount;
        this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
        this.drawLine();
        })
      }else{
        this.echartShow = false;
      }
      
    },
    getIp: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetIp, params);
      this.ip = res.data.data.docCount;
    },
    getIpChart: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetIp, params);
      this.ip = res.data.data.docCount;
      this.dataMapName = "IP数";
      this.dataMap = []
      this.xAxis = []
      // res.data.data.buckets.map((item,index)=>{
      //   this.dataMap[index] = res.data.data.buckets[index].docCount;
      //   this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
      //   this.drawLine();
      // })
      if(res.data.data.buckets.length > 0){
        this.echartShow = true;
        res.data.data.buckets.map((item,index)=>{
        this.dataMap[index] = res.data.data.buckets[index].docCount;
        this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
        this.drawLine();
        })
      }else{
        this.echartShow = false;
      }
    },
    getAvg: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetDurationAvg, params);
      this.durationAvg = this.millisToMinutesAndSeconds(res.data.data.value);
    },
    getAvgChart: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetDurationAvg, params);
      this.durationAvg = this.millisToMinutesAndSeconds(res.data.data.value);
      this.dataMapName = "平均时长(分钟)";
      this.dataMap = []
      this.xAxis = []
      // res.data.data.buckets.map((item,index)=>{
      //   this.dataMap[index] = this.millisToMinutesAndSeconds(res.data.data.buckets[index].value);
      //   this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
      //   this.drawLine();
      // })
      if(res.data.data.buckets.length > 0){
        this.echartShow = true;
        res.data.data.buckets.map((item,index)=>{
        this.dataMap[index] = this.millisToMinutesAndSeconds(res.data.data.buckets[index].value);
        this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
        this.drawLine();
        })
      }else{
        this.echartShow = false;
      }
    },
    getDurationCount: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetDurationCount, params);
      this.durationCount = this.millisToMinutesAndSeconds(res.data.data.value);
    },
    getDurationCountChart: async function() {
      const params = this.formInline;
      params.endDate = this.searchInfo.endTime;
      params.startDate = this.searchInfo.startTime;
      let res = await http.post(api.statisticsGetDurationCount, params);
      this.durationCount = this.millisToMinutesAndSeconds(res.data.data.value);
      this.dataMapName = "总时长(分钟)";
      this.dataMap = []
      this.xAxis = []
      // res.data.data.buckets.map((item,index)=>{
      //   this.dataMap[index] = this.millisToMinutesAndSeconds(res.data.data.buckets[index].value);
      //   this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
      //   this.drawLine();
      // })
      if(res.data.data.buckets.length > 0){
        this.echartShow = true;
        res.data.data.buckets.map((item,index)=>{
        this.dataMap[index] = this.millisToMinutesAndSeconds(res.data.data.buckets[index].value);
        this.xAxis.push(formatDate(new Date(item.key), "yyyy-MM-dd"))
        this.drawLine();
        })
      }else{
        this.echartShow = false;
      }
    },
    
  }
};
</script>
<<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.date-picker-btn {
  width: 100px;
}
.el-date-editor--daterange.el-input {
  width: 280px;
}
.el-row {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.el-col {
  border-radius: 4px;
  text-align: center;
  margin-top: 40px;
}
.el-col p {
  color: #66b1ff;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  /* background: #d3dce6; */
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
#myChart {
  width: 100%;
  height: 350px;
  z-index: 1;
}
.el-select {
  z-index: 2;
}
.look-arr {
  text-align: center;
  margin: -20px 0 30px 0;
}
.look-arr p {
  margin-left: -40px;
  margin-top: -17px;
}
.drop {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  /* background-color: skyblue; */
  /* background-color: #00B070; */
  background-color: $c-theme;
}

.date-picker {
  margin-top: 10px;
  margin-bottom: 10px;
}
.date-picker-btn {
  width: 70px;
}
.el-date-editor--daterange.el-input {
  width: 280px;
}
.margin-left {
  margin-left: 20px;
}
</style>

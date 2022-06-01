<template>
  <div class="jhg">
    <header-content :title="headerTitle"></header-content>
    <Headers :itemDatas="itemDatas" :options="options" :form="form"></Headers>
    <el-button type="primary" class="btnsl" @click="Inquire">查询</el-button>
    <div style="margin:20px;"></div>
    <el-table :data="tableData" border>
      <el-table-column width="240" label="活动名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="130" label="活动模版">
        <template slot-scope="scope">
          <span>{{ scope.row.type | activityType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200" label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="290" label="游戏周期">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime | formatDate }}</span>
          -
          <span>{{ scope.row.endTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column width="144" label="活动状态">
        <template slot-scope="scope">
          <span>{{ scope.row.activityState | getState}}</span>
        </template>
      </el-table-column>
      <el-table-column width="180" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      
      <!-- <el-table-column label="状态">
        <template slot-scope="scope">
          <span>{{ scope.row.status | getStatus }}</span>
        </template>
      </el-table-column> -->
      <el-table-column  width="700" label="操作" fixed="right">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            @click="goDetail(scope.row.lotteryId,true)"
          >查看详情</el-button>
          <el-button
            type="info"
            size="small"
            @click="goUserList(scope.row.lotteryId)"
          >用户列表</el-button>
          <el-button
            type="info"
            size="small"
            @click="goLuckyList(scope.row.id,scope.row.lotteryId,scope.row.verifyCode)"
          >中奖名单</el-button>
          <el-button
            type="info"
            size="small"
            @click="goStatistics(scope.row.lotteryId)"
          >抽奖统计</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.lotteryId,2)"
            v-if="scope.row.activityState == 1 || scope.row.activityState == -4 || scope.row.activityState == -2"
          >暂停</el-button>
          <el-button
            type="success"
            size="small"
            @click="forbidden(scope.row.lotteryId,-2)"
            v-if="scope.row.activityState == 2"
          >取消暂停</el-button>
          <el-button
            type="success"
            size="small"
            @click="forbidden(scope.row.lotteryId,-4)"
            v-if="scope.row.activityState == 4"
          >启用</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.lotteryId,4)"
            v-if="scope.row.activityState == 1 || scope.row.activityState == -4 || scope.row.activityState == -2 || scope.row.activityState == 2"
          >停用</el-button>
          <el-button
            type="danger"
            size="small"
            @click="forbidden(scope.row.lotteryId,3)"
            v-if="scope.row.activityState !== 0 && scope.row.activityState !== 3" 
          >结束</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:20px"></div>
    <el-dialog
      title="详情"
      :visible.sync="ends"
    >
      <ul class="detail-dia-ul">
        <li><span>活动模版：</span><em>{{ this.detailForm.type | activityType }}</em></li>
        <li><span>活动标题：</span><em>{{ this.detailForm.name }}</em></li>
        <li><span>活动时间：</span><em>{{this.detailForm.beginTime }} ~ {{ this.detailForm.endTime }}</em></li>
        <li class="activityDetail"><span>活动介绍：</span><em v-html="detailForm.activityDetail"></em></li>
        <li>
          <span>主要奖品：</span>
          <div v-for="(item,index) in prizeForm" :key="index">{{ item.name}}：{{ item.description}}</div>  
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="goDetail(false)">取 消</el-button>
        <el-button type="primary" @click="goDetail(false)">确 定</el-button>
      </span>
    </el-dialog>
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
import HeaderContent from "@/components/header-content";
import Headers from "../base/header1";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
export default {
  name: "lotterylist",
  components: {
    HeaderContent,
    Headers
  },
  data() {
    return {
      tableData: [],
      headerTitle: "抽奖游戏管理",
      form: {
        title: "",
        startTime: "",
        endTime: "",
        status: ""
      },
      detailForm: {
        name: "",
        beginTime: "",
        endTime: "",
        type: 1,
        activityDetail: ""
      },
      prizeForm: {

      },
      ends: false,
      total: 0,
      currentPage: 1,
      labelPosition: "left",
      itemDatas: [
        {
          label: "活动状态",
          placeholder: "请选择"
        },
        {
          label: "活动周期"
        },
        {
          label: "活动名称",
          placeholder: "请输入活动名称"
        }
      ],
      options: [
        {
          label: "全部"
        },
        {
          status: 0,
          label: "未开始"
        },
        {
          status: 1,
          label: "进行中"
        },
        {
          status: 2,
          label: "已暂停"
        },
        {
          status: 4,
          label: "已停用"
        },
        {
          status: 3,
          label: "已结束"
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userAuths"])
  },
  filters: {
    activityType(type){
      if (type === 1) {
        return "大转盘";
      } else {
        return "九宫格";
      }
    },
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    getState(state) {
      if (state === 0) {
        return "未开始";
      } else if (state === 1) {
        return "进行中";
      } else if (state === 2) {
        return "已暂停";
      } else if (state === -2) {
        // return "取消暂停";
        return "进行中";
      } else if (state === 3) {
        return "已结束";
      } else if (state === 4) {
        return "已停用";
      } else if (state === -4) {
        // return "启用";
        return "进行中";
      }
    },
    getStatus(status) {
      if (status === 0) {
        return "停用";
      } else if (status === 1) {
        return "启用";
      }
    }
  },
  created() {
    if (this.$route.query.page) {
      this.currentPage = Number(this.$route.query.page);
    }
  },
  async mounted() {
    this.luckyGamelist(1);
  },
  methods: {
    goLuckyList(id,lotteryId,verifyCode) { // 中奖名单
      this.$router.push({ path: "lottery/luckyList/"+ id + "/" + lotteryId });
    },
    goUserList(lotteryId) { // 用户列表
      this.$router.push({ path: "lottery/userlist/" + lotteryId });
    },
    goStatistics(lotteryId) { // 抽奖统计
      this.$router.push({ path: "lottery/statistics/" + lotteryId });
    },
    forbidden: async function(lotteryId, status) {
      var params = {
        lotteryId: lotteryId,
        operationType: status,
      };
      var res = await http.post(api.lotteryForbidden, params);
      if (res.data.code === 200) {
        this.luckyGamelist(this.currentPage);
        this.$message.success("操作成功");
      } else {
        this.$message.error(res.data.msg);
      }
    },
    
    goDetail: async function (id,type) { // 详情弹窗
      this.ends = type
      if(id){
        var res = await http.get(api.getActivityDetail + id);
        if (res.data.code === 200) {
          this.detailForm = res.data.data.lottery;
          this.prizeForm = res.data.data.prizesVO.prizes;
        } else {
          this.$message.error(res.data.msg);
        }
      }
    },

    luckyGamelist: async function() {
      var params1 = {
        pageSize: 10,
        pageNum: this.currentPage,
      };
      if (
        this.form.status !== "" ||
        this.form.startTime !== "" ||
        this.form.endTime !== "" ||
        this.form.title !== ""
      ) {
        params1 = {
          pageSize: 10,
          pageNum: this.currentPage,
          activityState: this.form.status,
          beginTime: this.form.startTime,
          endTime: this.form.endTime,
          name: this.form.title
        };
      }
      if (this.form.startTime !== "" && this.form.endTime !== "") {
        if (this.form.startTime > this.form.endTime) {
          this.$message.error("开始时间不能大于结束时间");
          return false;
        }
      }
      var res = await http.post(api.lotteryGamelist, params1);
      // console.log(res);
      if (res.data.code === 200) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.msg);
      }
    },
    Inquire: async function() {
      this.luckyGamelist(this.currentPage);
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.luckyGamelist(val);
    }
  }
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.btnsl {
  /* width: 130px; */
  position: absolute;
  top: 140px;
  right:20px;
}
.detail-dia-ul{
  list-style: none;
  li{
    position: relative;
    margin-bottom: 30px;
    span{
      position: absolute;
      left: 0;
      top: 3px;
      font-weight: bold;
    }
    em{
      display: inline-block;
      max-width:500px; 
      font-style: normal;
      line-height: 1.5;
      margin-left: 80px;
    }
    div{
      line-height: 1.5;
      margin: 0 0 20px 80px;
    }
  }
  .activityDetail{
    em{
      display: inline-block;
      margin-top: -14px 
    }
  }
}
</style>



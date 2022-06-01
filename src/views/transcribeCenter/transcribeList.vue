<template>
  <div class="auditList">
    <header-content :title="headerTitle"></header-content>
    <div>
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane
          v-for="(item, index) in editableTabs"
          :key="item.id"
          :label="item.name"
          :name="item.businessId"
        >
          <el-form :inline="true" :model="formInline" class="form-choose">
            <el-form-item label="录制时间：">
              <el-date-picker
                type="date"
                placeholder="选择开始时间"
                format="yyyy-MM-dd"
                v-model="formInline.startTime"
                @change="startTimes"
              ></el-date-picker>
              <span style="color: #ffffff">-</span>
              <el-date-picker
                type="date"
                placeholder="选择结束时间"
                format="yyyy-MM-dd"
                v-model="formInline.endTime"
                @change="endTimes"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="名称：">
              <el-input v-model="formInline.videoName" placeholder="请输入任务名称"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="info" @click="Search">查询</el-button>
              <el-button type="info" @click="exportContract">导出</el-button>
            </el-form-item>
          </el-form>
          <TransList :table-data="tableData" :business-id="activeName"/>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
      style="margin-top:20px"
    ></el-pagination>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import { formatDate } from "@/common/data";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import TransList from "./base/transList";
import { setTimeout } from "timers";
export default {
  name: "transcribeList",
  components: {
    HeaderContent,
    TransList
  },
  data() {
    return {
      headerTitle: "录制记录",
      businessId: "",
      activeName: "",
      currentPage: 1,
      total: 1,
      createTime: "",
      editableTabs: [],
      tableData: [],
      formInline: {
        videoName: null,
        startTime: null,
        endTime: null
      }
    };
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  activated() {
    // this.getList();
  },
  async created() {
    await this.getBusinessId();
    await this.getList();
  },
  methods: {
    handleCurrentChange(val) {
      this.getList(val);
      this.currentPage = val;
    },
    tabClick(tab, event) {
      this.businessId = this.activeName;
      this.formInline.videoName = null;
      this.formInline.startTime = null;
      this.formInline.endTime = null;
      this.getList(1);
      this.currentPage = 1;
    },
    Search: async function() {
      this.getList();
    },
    exportContract() {
      // 导出
      // let params = {
      //   businessId: this.businessId
      //   // operate: "export"
      // };
      let params = {
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        videoName: this.formInline.videoName,
        businessId: this.businessId
      };
      http.post(api.videoRecExportExcel, params).then(res => {
        let { code, data, message, URL } = res.data;
        if (code === 0) {
          window.location.href = URL;
          this.$message.success("导出成功");
        } else {
          this.$message.error(message);
        }
      });
    },
    //    获取业务类型
    getBusinessId: async function() {
      var res = await http.post(api.getBusinessId);
      if (res.data.code === 0) {
        var arr = [];
        arr = res.data.data;

        for (var i = 0; i < arr.length; i++) {
          if (
            arr[i].businessId == 6 ||
            arr[i].businessId == 7 ||
            arr[i].businessId == 8
          ) {
            continue;
          } else {
            this.editableTabs.push(arr[i]);
            this.activeName = this.editableTabs[0].businessId;
            this.businessId = this.editableTabs[0].businessId;
          }
        }
      } else {
        this.$message.error(res.data.message);
      }
    },

    getList: async function(pageNum) {
      let params = {
        startTime: this.formInline.startTime,
        endTime: this.formInline.endTime,
        videoName: this.formInline.videoName,
        businessId: this.businessId,
        pageNum: pageNum,
        pageSize: 10
      };
      const res = await http.post(api.videoRecListSearch, params);
      if (res.data.code === 0) {
        this.tableData = res.data.data.list;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
        this.tableData = [];
      }
    },
    startTimes() {
      this.formInline.startTime = Date.parse(this.formInline.startTime);
    },
    endTimes() {
      if (this.formInline.endTime.getFullYear) {
        let Year = this.formInline.endTime.getFullYear();
        let Month = this.formInline.endTime.getMonth() + 1;
        let getDate = this.formInline.endTime.getDate();
        this.formInline.endTime = new Date(
          `${Year}/${Month}/${getDate} 23:59:59`
        ).getTime();
      }
    }
  }
};
</script>

<style scoped>
.form-choose {
  margin-top: 10px;
}
</style>

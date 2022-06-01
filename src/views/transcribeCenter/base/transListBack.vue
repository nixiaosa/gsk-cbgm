<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.videoName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传人">
        <template slot-scope="scope">
          <span>{{ scope.row.uploader }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.sex }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号码" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span class="time">{{ scope.row.county }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId == 1" label="药店名称">
        <template slot-scope="scope">
          <span>{{ scope.row.drugStore }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId != 1" label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId != 1" label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.office }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId == 1" label="职务">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId != 1" label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>

      <el-table-column label="上传时间" width="160">
        <template slot-scope="scope">
          <span>{{ scope.row.uploadTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button type="info" @click="downLoad(scope.row)">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { formatDate } from "@/common/data";

export default {
  name: "TransListBack",
  props: {
    businessId: {
      type: String,
      default: ""
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  },
  filters: {
    formatDate(time) {
      if (!time) {
        return "";
      }
      time = Number(time);
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
  mounted() {},
  methods: {
    downLoad(row) {
      window.location.href = row.videoUrl;
    },
    inform(affair, props) {
      let params = {
        affair: affair,
        params: props
      };
      this.$emit("change", params);
    }
  }
};
</script>

<style scoped>
/deep/ .el-button {
  margin-left: 0;
}
/deep/.el-row:nth-child(odd) {
  margin-left: 0 !important;
}
/deep/.el-row:nth-child(even) {
  margin-right: 5px !important;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:nth-child(odd) {
  margin-left: 5px;
  margin-right: 5px;
}

.active-box {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: center;
}
</style>

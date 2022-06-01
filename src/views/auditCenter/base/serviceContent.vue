<template>
  <div class="serviceContent">
    <el-dialog title="选择内容" :before-close="close" :visible.sync="visibleShow">
      <div class="box">
        <!--                <div class="headers">-->
        <!--                    <span style="float: left;margin-left: 10px">选择内容</span>-->
        <!--                    <span style="float: right;margin-right: 10px" class="headrt" @click="close">x</span>-->
        <!--                </div>-->
        <div style="height: 4px"></div>
        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick" v-if="isOld === 0">
          <el-tab-pane
            v-for="(item,index) in optionData"
            :key="item.id"
            :value="item.id"
            :label="item.name"
            :name="index.toString()"
          ></el-tab-pane>
        </el-tabs>
        <el-table
          ref="singleTable"
          height="450"
          :data="contentData"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column>
            <template slot-scope="scope">
              <el-radio class="radio" v-model="radio" :label="scope.$index">&nbsp;</el-radio>
              <span>{{ name }}</span>
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <img :src="scope.row.backgroundPic" alt width="150" height="150">
            </template>
          </el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <ul>
                <li>{{scope.row.name}}</li>
                <li>
                  <span>开始时间:</span>
                  <span>{{ scope.row.beginTime | formatDate}}</span>
                </li>
                <li v-if="scope.row.endTime">
                  <span>结束时间:</span>
                  <span>{{ scope.row.endTime | formatDate }}</span>
                </li>
                <li>
                  <span>活动状态:</span>
                  <span v-if="scope.row.states === 0">未发布</span>
                  <span v-if="scope.row.states === 1">未开始</span>
                  <span v-if="scope.row.states === 2">进行中</span>
                  <span v-if="scope.row.states === 3">已结束</span>
                </li>
              </ul>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin:10px 0;">
          <el-pagination
            layout="prev, pager, next"
            :current-page.sync="currentPage"
            @current-change="handleCurrentChanges"
            :total="total"
          ></el-pagination>
          <el-button @click="sure" type="primary" class="sure">确定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";

export default {
  name: "serviceContent",
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    }
  },
  data() {
    return {
      isOld: null, // 0为老版 1为新版
      visibleShow: true,
      activeName2: "0",
      radio: "",
      send_radio: "",
      optionData: [],
      contentData: [],
      cloumId: "",
      name: "单选",
      currentRow: null,
      currentPage: 1,
      total: 1,
      arrRadio: [],
      options: []
    };
  },
  mounted() {
    this.getVersion();
    this.auditcloum();
  },
  methods: {
    getVersion: async function() {
      var res = await http.post(api.getVersion);
      if (res.data.code === 0) {
        this.isOld = res.data.data.webversion;
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleClick(tab, val) {
      this.cloum(tab.$attrs.value);
    },
    cloum(id) {
      this.cloumId = id;
      this.auditservice(id);
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    auditcloum: async function() {
      const res = await http.get(api.auditcloum + "/" + 8);
      if (res.data.code === 0) {
        this.optionData = res.data.data;
        console.log(res.data, 'dddd');
        this.cloumId = res.data.data[0] ? res.data.data[0].id : null;
        this.auditservice(res.data.data[0] ? res.data.data[0].id : null);
      } else {
        this.$message.error(res.data.message);
      }
    },
    auditservice: async function(id) {
      let params
      if(this.isOld === 0){
        params = {
        pageSize: 10,
        pageNum: this.currentPage,
        businessId: 8,
        params: {
          navigationId: id
          }
        };
      }else{
        params = {
        pageSize: 10,
        pageNum: this.currentPage,
        businessId: 8,
        // params: {  // 新版导航不传navigationId
        //   navigationId: id
        //   }
        };
      }


      // let params = {
      //   pageSize: 10,
      //   pageNum: this.currentPage,
      //   businessId: 8,
      //   params: {
      //     navigationId: id
      //   }
      // };
      const res = await http.post(api.auditservice, params);
      if (res.data.code === 0) {
        this.contentData = res.data.data.data;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleCurrentChange(val) {
      this.currentRow = val;
      this.send_radio = val.address;
    },
    handleCurrentChanges(val) {
      this.currentPage = val;
      this.auditservice(this.cloumId);
    },
    sure() {
      this.$emit("shows", false);
      this.$emit("currentRow", this.currentRow);
    },
    close() {
      this.$emit("shows", false);
    }
    // showRow(row){
    //   // console.log(row)
    //   this.radio = this.tableData.indexOf(row)
    //   // this.send_radio = row.address
    //   // console.log(this.send_radio)
    // },
  }
};
</script>
<style scoped>
.serviceContent .box {
  border: 1px solid #eeeeee;
}

.box .headers {
  height: 50px;
  line-height: 50px;
  background: #199ed8;
  color: #fff;
  overflow: hidden;
}

.headrt {
  color: black;
  font-size: 40px;
  cursor: pointer;
}

.serviceContent ul li {
  list-style: none;
}

.cloums {
  height: 50px;
  overflow: hidden;
  line-height: 50px;
  margin: 0;
  padding: 0;
}

.cloums li {
  float: left;
  cursor: pointer;
  margin-left: 20px;
  height: 100%;
}

.sure {
  margin-left: 45%;
}
</style>

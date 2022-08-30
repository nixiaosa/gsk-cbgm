<template>
  <div class="analysis">
    <div class="wrap box">
      <span class="titls box">申请下载统计表格查看更多信息:</span>
      <el-select v-model="states" @change="selectChange" placeholder="请选择活动状态" style="margin-right:10px">
        <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.states"></el-option>
      </el-select>
      <el-button @click="getExl" type="info">申请导出数据</el-button>
    </div>
    <p class="titls titlsMessage">注意：</p>
    <p class="titls titlsMessage">1. 发送申请后，我们会在20分钟内处理您要导出的数据，系统处理完后，请手动“刷新”当前页面。您可以在申请列表中，下载您申请的数据文件；若出现即可下载；若未出现，需继续等待</p>
    <p class="titls titlsMessage">2. 若导出时出现异常提示，请联系相关人员解决</p>
    <div style="margin: 20px"></div>
    <table-list name="QuestionnaireExport" v-if="data.list" :data="data.list" @change="downLoad"/>
    <pagination :page-num="page.pageNumber" :total="data.total" @change="paginationChange"/>
  </div>
</template>

<script>
import TableList from "@/components/table-content/TableList";
import Pagination from "@/components/pagination/Pagination";

export default {
  name: "statisticalAnalysis",
  components: {TableList, Pagination},
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    id: {
      type: String
    }
  },
  data() {
    return {
      page: {
        pageSize: 10,
        pageNumber: 1,
      },
      tableListTotal: 10,
      tableData: [],
      list: [],
      states: '',
      statusList: [
          { label: '已完成用户', states: 0 },
          // { label: '未完成用户', states: 1 },
        ],
    }
  },
  mounted() {
    console.log(this.data);
    this.states = 0
  },
  methods: {
    selectChange(){
      this.$emit('selectChange', this.states)
    },
    paginationChange(value) {
      // 切换分页
      this.page = value
      this.$emit('change', value)
    },
    downLoad(value) {
      // 表格回调
      if (value.DOWNLOAD) window.location.href = value.fsUrl
    },
    getExl() {
      this.$emit('change', {type: 'EXPORT'})
    }
  }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.titlsMessage {
  color: #999999;
}

.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 20px;
}

.message span, .message p {
  color: $c-theme;
}

.box {
  display: flex;
  align-items: center;
}

/*.analysis .wrap {*/
/*  margin-top: 20px;*/
/*  margin-left: 20px;*/
/*  position: relative;*/
/*}*/
.analysis .wrap .titls {
  margin-right: 20px;
}

.analysis .wrap:nth-of-type(2) .titls {
  width: 240px;
}

.tabs {
  border: 1px solid #ccc;
  border-bottom: none;
}

ul, li {
  list-style: none;
}

.tabs ul li {
  float: left;
  height: 40px;
  line-height: 40px;
}

.tabs ul {
  height: 40px;
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: flex-start;
}

.hang {
  display: flex;
  justify-content: flex-start;
  border-bottom: 1px solid #ccc;
}

.lie {
  flex: 1;
  padding: 0 10px;
  border-right: 1px solid #ccc;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
}

.tabs ul li {
  list-style: none;
  flex: 1;
}

.tabs ul:nth-child(1) {
  border-bottom: 1px solid #ccc;
  background: #EEF1F6;
}

.tabs ul li {
  margin: 0;
  height: 40px;
  text-align: left;
  border-right: 1px solid #ccc;
  padding: 0 10px;
  font-size: 14px;
}

.download-link {
  display: inline-block;
  width: 80px;
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  font-size: 12px;
  color: #ffffff;
  background: #20a0ff;
  border-radius: 4px;
  overflow: hidden;
}
</style>

<template>
  <div class="case">
    <header-content :title="headerTitle" :opertions="['新建签到']" @change="headerChange"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="内容类型">
        <el-select v-model="formInline.type" placeholder="请选择内容类型">
          <el-option v-for="(item,index) in statusList" :key="index" :label="item.label" :value="item.states"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="标题名称">
        <el-input v-model="formInline.title" placeholder="请输入活动名称"></el-input>
      </el-form-item>
      <el-form-item label="起止时间">
        <el-date-picker type="date" placeholder="选择开始时间" format="yyyy-MM-dd"  v-model="formInline.start" @change="startTimes" >
        </el-date-picker>
        <span style="color: #ffffff">-</span>
        <el-date-picker type="date" placeholder="选择结束时间" format="yyyy-MM-dd"  v-model="formInline.end" @change="endTimes">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="onSubmit">搜索</el-button>
        <el-button type="info" size="small" @click="exportList">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableDatas"
      border
    >
      <el-table-column label="内容类型" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.type | getState }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题名称" width="280px">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效时间">
        <template slot-scope="scope">
          <span>{{ scope.row.effectiveDate | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="edit(scope.row.id)">编辑</el-button>
          <el-button type="info" size="small" @click="godetail(scope.row.id,1)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="新建签到"
      :visible.sync="ends"
    >
      <el-form label-width="100px" :model="editForm">
          <el-form-item label="有效日期:">
            <el-date-picker
              type="date"
              placeholder="选择有效时间"
              @change="times"
              format="yyyy-MM-dd"
              v-model="editForm.effectiveDate"
              :disabled="isDis"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="内容类型：" >
            <el-radio class="radio" v-model="editForm.type" label="1" :disabled="isDis">文章</el-radio>
            <el-radio class="radio" v-model="editForm.type" label="2" :disabled="isDis">小知识</el-radio>
            <!-- <el-radio class="radio" v-model="editForm.type" label="3" :disabled="isDis">直播回看</el-radio> -->
          </el-form-item>
          <el-form-item label="关联文章:" v-if="editForm.type == 1">
            <el-select
              v-model="articleId"
              placeholder="请选择"
              class="searchStyle"
              style="width:220px;height:100%;"
              @change="selectArticle"
              :disabled="isDis"
              filterable
            >
              <el-option
                v-for="(item,index) in articleOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="直播回看:" v-if="editForm.type == 3">
            <el-select
              v-model="videoId"
              placeholder="请选择"
              class="searchStyle"
              style="width:220px;height:100%;"
              @change="selectVideo"
              :disabled="isDis"
              filterable
            >
              <el-option
                v-for="(item,index) in videoOptions"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="editForm.type == 2" label="文案标题：" prop="name" style="width:550px;">
            <el-input
              type="textarea"
              :rows="2"
              maxlength="50"
              show-word-limit
              placeholder="请输入文案标题"
              :disabled="isDis"
              v-model="editForm.title">
            </el-input>
          </el-form-item>
          <el-form-item v-if="editForm.type == 2" label="文案内容：" prop="name" style="width:550px;">
            <el-input
              type="textarea"
              :rows="5"
              maxlength="500"
              show-word-limit
              placeholder="请输入文案内容"
              :disabled="isDis"
              v-model="editForm.content">
            </el-input>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" v-if="!isDis" @click="gskSignSave()">保 存</el-button>
        <el-button type="primary" v-if="isDis" @click="ends = false">确 定</el-button>
      </span>
    </el-dialog>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  import { mapGetters } from "vuex";
  export default {
    name: "signManage",
    components: {
      HeaderContent
    },
    computed: {
      ...mapGetters(["companyid"])
    },
    filters:{
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      formatDates(time) {
        var date = new Date(time)
        if(time){
          return formatDate(date,'yyyy-MM-dd hh:mm')
        } else {
          ""
        }
      },
      getState(state) {
        switch (state) {
          case 1:
            return '文章'
          case 2:
            return '小知识'
          case 3:
            return '直播回看'
        }
      }
    },
    data() {
      return {
        isDis: false,
        headerTitle: '签到管理',
        currentPage: 1,
        total: 1,
        ends: false,
        id: '2',
        articleId: '',
        videoId: '',
        endId: '',
        tableDatas: [],
        articleOptions: [],
        videoOptions: [],
        statusList: [
          { label: '全部' },
          { label: '小知识', states: 2 },
          { label: '文章', states: 1 },
          // { label: '直播回看', states: 3 }
        ],
        formInline: {
          type: null,
          start: null,
          end: null,
          title: null,
        },
        editForm: {
          id: null,
          type: '1',
          title: '',
          content: '',
          effectiveDate: null,
          sourceId: null,
        }
      }
    },
    mounted() {
      this.getSignList(this.currentPage);
      this.getArticleList();
      this.getGskVideoList();
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      edit: async function(id,isDetail) {
        if(isDetail == 1) {
          this.isDis = true;
        } else {
          this.isDis = false;
        }
        var res = await http.get(api.gskSignEdit + '/' + id);
        if (res.data.code === 0) {
            this.ends = true;
            this.editForm.id = res.data.data.id;
            this.editForm.type = String(res.data.data.type);
            this.editForm.effectiveDate = res.data.data.effectiveDate;
            this.editForm.sourceId = res.data.data.sourceId;
            if(this.editForm.type == 1) {
              this.articleId = res.data.data.sourceId;
            } else if(this.editForm.type == 3) {
              this.videoId = res.data.data.sourceId;
            } else {
              this.editForm.title = res.data.data.title;
              this.editForm.content = res.data.data.content;
            }
        } else {
          this.$message.error(res.data.message);
        }
      },
      godetail: async function(id,isDetail) {
        this.edit(id,1);
      },
      gskSignSave: async function() {
        let params = {}
        params = {
            ...this.editForm
        }
        if(this.editForm.type == 2){
          if(!this.editForm.title){
            this.$message.error("文案标题不能为空");
          }
          if(!this.editForm.content){
            this.$message.error("文案内容不能为空");
          } 
        }
        var res = await http.post(api.gskSignSave,params);
        if (res.data.code === 0) {
          this.$message.success("操作成功");
          this.getSignList(1);
          this.ends = false;          
        } else {
          this.$message.error(res.data.message);
        }
      },
      selectArticle(){
        this.editForm.sourceId = this.articleId
      },
      selectVideo(){
        // console.log(this.videoId)
        this.editForm.sourceId = this.videoId
      },
      times() {
        this.editForm.effectiveDate = Date.parse(this.editForm.effectiveDate);
      },
      exportList: async function() {
        const res = await http.get(api.gskSignExport)
        if (res.data.code === 0) {
          window.location.href = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      getSignList: async function(pageNum) {
        if (this.formInline.start > this.formInline.end) {
          this.$message.error("开始时间不能大于结束时间")
          return false
        }
        let params = {}
        params = {
            pageNum: pageNum,
            pageSize: 10,
            params: this.formInline
        }
        const res = await http.post(api.getSignList,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      getArticleList: async function(pageNum) {
        const res = await http.get(api.getArticleList)
        if (res.data.code === 0) {
          this.articleOptions = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      getGskVideoList: async function(pageNum) {
        const res = await http.get(api.getGskVideoList)
        if (res.data.code === 0) {
          this.videoOptions = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleCurrentChange(val) {
        this.getSignList(val)
        this.currentPage = val
      },
      endcase(id) {
        this.endId = id
        this.ends = true
      },
      startTimes() {
        this.formInline.start = Date.parse(this.formInline.start)
      },
      endTimes() {
        if (this.formInline.endTime.getFullYear) {
          let Year = this.formInline.endTime.getFullYear()
          let Month = this.formInline.endTime.getMonth() + 1
          let getDate = this.formInline.endTime.getDate()
          this.formInline.endTime = new Date(
            `${Year}/${Month}/${getDate} 23:59:59`
          ).getTime()
        }
      },
      onSubmit() {
        this.getSignList(this.currentPage)
      },
      headerChange() {
        this.isDis = false;
        this.ends = true
        this.editForm.id = null;
        this.editForm.type = '1';
        this.editForm.title = '';
        this.editForm.content = '';
        this.editForm.effectiveDate = null;
        this.editForm.sourceId = null;
        this.videoId = '';
        this.articleId = '';
      },
    }
  }
</script>

<style scoped>

</style>

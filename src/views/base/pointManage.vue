<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-table
      :data="tableDatas"
      border
    >
      <el-table-column label="积分类型">
        <template slot-scope="scope">
          <span>{{ scope.row.pointType | pointType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分规则">
        <template slot-scope="scope">
          <span>{{ scope.row.rule }}</span>
        </template>
      </el-table-column>
      <el-table-column label="积分数量">
        <template slot-scope="scope">
          <span>{{ scope.row.point }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="openPointDia(scope.row)">积分设置</el-button>
        </template>
      </el-table-column>
    </el-table>

     <el-dialog
      title="积分设置"
      :visible.sync="ends"
    >
      <el-form label-width="100px" :model="form">
          
          <el-form-item label="积分类型：" >
            <span> {{  form.pointTypeName }} </span>
          </el-form-item>
          <el-form-item label="积分规则：" >
            <span> {{ form.rule }} </span>
          </el-form-item>
          <el-form-item label="积分数量：">
            <el-input-number v-model="form.point" :min="0" label="请输入积分"></el-input-number>
          </el-form-item>
        </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ends = false">取 消</el-button>
        <el-button type="primary" @click="pointSet()">保 存</el-button>
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
  export default {
    name: "signManage",
    components: {
      HeaderContent
    },
    computed: {},
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
      pointType(type) {
        switch (type) {
          case 'sign':
            return '签到'
          case 'read':
            return '阅读文章'
          case 'classs':
            return '观看课程'
          case 'share':
            return '分享文章'
          case 'activity':
            return '参与互动活动'
          case 'verify':
            return '趣认证通过'
          case 'exchange':
            return '积分兑换'
          case 'live':
            return '观看直播'
          case 'comment':
            return '直播评论'
          case 'thumbs':
            return '直播点赞'
          case 'manuscript':
            return '稿件征集'
          case 'qa':
            return '参与调研问卷'
          case 'question':
            return '参与在线答题'
          case 'competition':
            return '参与知识竞赛'
          case 'vote':
            return '参与投票活动'
        }
      }
    },
    data() {
      return {
        isDis: false,
        headerTitle: '积分规则',
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
        form: {
          id: '',
          point: 0,
          pointTypeName: '',
          rule: ''
        },
      }
    },
    mounted() {
      this.getPointList(this.currentPage);
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      openPointDia: async function(row) {
        this.ends = true;
        this.getPointDetail(row.id)
      },
      getPointDetail: async function(id) {
         var res = await http.get(api.getGskPointDetail + '/' + id);
         if (res.data.code === 0) {
           this.form.id = res.data.data.id;
           this.form.point = res.data.data.point;
           this.form.rule = res.data.data.rule;
           this.form.pointTypeName = res.data.data.pointTypeName;
         }
      },
      pointSet: async function() {
        let params = {}
        params = {
            ...this.form
        }
        var res = await http.post(api.gskPointUpdate,params);
        if (res.data.code === 0) {
          this.$message.success("操作成功");
          this.getPointList(1);
          this.ends = false;          
        } else {
          this.$message.error(res.data.message);
        }
      },
      getPointList: async function(pageNum) {
       let params = {
            pageNum: pageNum,
            pageSize: 10,
        }
        const res = await http.post(api.getGskPointList,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      handleCurrentChange(val) {
        this.getPointList(val)
        this.currentPage = val
      },
    }
  }
</script>

<style scoped>

</style>

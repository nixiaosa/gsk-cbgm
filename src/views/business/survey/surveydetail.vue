<template>
  <div class="modelist">
    <div class="piont-flex">
      <div class="point-title">调查问卷  <span style="margin-left:20px;color:green">{{data1.title}}</span></div>
      <div>
        <el-button type="primary" @click="goback()">返回</el-button>
      </div>
    </div>
    <el-tabs type="border-card">
      <el-tab-pane label="基本信息">
        <div class="xinxi-item">
          <span class="item-title">问题标题：</span>
          <span>{{data1.title}}</span>
        </div>
        <div class="xinxi-item">
          <span class="item-title">封面图：</span>
          <span></span>
          <img :src="data1.coverUrl" style="width:200px;height:200px;border:1px solid #ccc" alt="">
        </div>
        <div class="xinxi-item">
          <span class="item-title">答题设置：</span>
          <span>{{data1.answersNum | repeat}}</span>
        </div>
        <div class="xinxi-item">
          <span class="item-title">问卷数量：</span>
          <span>{{data1.answersTotal}}</span>
        </div>
        <div class="xinxi-item">
          <span class="item-title">问卷时间：</span>
          <span>{{data1.startTime | formatDate}} 到 {{data1.endTime | formatDate}}</span>
        </div>
      </el-tab-pane>
      <el-tab-pane label="调查问卷管理">
        <div class="center-item" v-show="data2.length===0">
          <div class="center">
            未设置调查问卷
          </div>
        </div>
        <div class="dan" v-for="(index,item) in data2" :key="index.title">
          <div style="margin-bottom:10px;" >{{item+1}}.{{index.title}}<span style="margin-left:10px;color:green;">{{index.type | allType}}&nbsp;({{index.score}}分)</span></div>
          <div style="margin-bottom:10px;" v-for="(index1,item1) in index.options" :key="index1.id">
            <el-radio v-if="index.type==='0'" disabled class="radio" v-model="index.radioAnswer" :label="item1.toString()">{{index1}}</el-radio>
          </div>
          <el-checkbox-group v-model="index.checkboxAnswer" v-if="index.type==='1'">
            <div style="margin-bottom:10px;" v-for="(index1,item1) in index.options" :key="index1.id">
              <el-checkbox disabled :label="item1.toString()">
                {{index1}}
              </el-checkbox>
            </div>
          </el-checkbox-group>
          <div v-if="index.type==='2'">
            <div style="margin-bottom:10px;" v-for="(index1,item1) in index.options" :key="index1.id">
              <div disabled :label="item1.toString()">
                {{index1}}
              </div>
            </div>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane label="奖励管理">
        <div class="center-item" v-if="data1.awardType === 'awardLess'">
          <div class="center">
            无奖励
          </div>
        </div>
        <div class="center-item" v-if="data1.awardType === null">
          <div class="center">
            未设置奖励
          </div>
        </div>
        <div v-if="data1.awardType === 'bribery'">
          <div class="xinxi-item">
            <span class="item-title">奖励方案：</span>
            <span>红包</span>
          </div>
          <div class="xinxi-item">
            <span class="item-title">个数：</span>
            <span v-if="data1 && data1.award !== null">{{data1.award.num}}个</span>
          </div>
          <div class="xinxi-item">
            <span class="item-title">发放方式：</span>
            <span v-if="data1 && data1.award !== null  && data1.award.equal===0">{{data1.award.equal | sendtype}}</span>
            <span v-if="data1 && data1.award !== null  && data1.award.equal===1">{{data1.award.equal | sendtype}}</span>
          </div>
          <div class="xinxi-item" v-if="data1 && data1.award !==null && data1.award.equal===0">
            <span class="item-title">随机范围：</span>
            <span>{{data1.award.min}}-{{data1.award.max}}元</span>
          </div>
          <div class="xinxi-item">
            <span class="item-title">总金额：</span>
            <span v-if="data1 && data1.award !== null">{{data1.award.money}}元</span>
          </div>
          <div class="xinxi-item">
            <span class="item-title">领取标准：</span>
            <span>{{data1.awardReceiveScore | ssss}}</span>
          </div>
        </div>
        <div v-if="data1.awardType === 'awardEntity'">
           <div class="xinxi-item">
            <span class="item-title">奖励方案：</span>
            <span>物品</span>
          </div>
          <div class="xinxi-item">
            <span class="item-title">奖励物品：</span>
            <span>{{data1.awardEntityMessage}}</span>
          </div>
         </div>
      </el-tab-pane>
      <el-tab-pane label="问卷结果">
        <div class="xinxi-item">
          <span class="item-title">参与调查人数：</span>
          <span>{{joinNumber}}</span>
        </div>
        <div class="xinxi-item">
          <span class="item-title">调查问卷数：</span>
          <span>{{answersTotal}}</span>
        </div>
        <div class="xinxi-item" v-if="data1.awardType === 'bribery'">
          <span class="item-title">奖励总人数：</span>
          <span v-if="data1 && data1.award !== null">{{data1.award.num}}</span>
        </div>
        <div class="xinxi-item" v-if="data1.awardType === 'awardEntity'">
          <span class="item-title">奖励总人数：</span>
          <span>{{awardNumber}}</span>
        </div>
        <div class="content">
        <el-button type="info" class="down" @click="downData" :disabled="isDisabled">导出</el-button>
        </div>
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="400px">
          <span>是否导出数据？</span>
          <span slot="footer" class="dialog-footer">
            <el-button v-show="!loading" type="primary" @click="downLoadData">是</el-button>
            <el-button v-show="!loading" @click="dialogVisible = false">否</el-button>
            <el-button v-show="loading" type="primary" :loading="true">正在导出</el-button>
          </span>
        </el-dialog>
        <el-table
          :data="tableData"
          border
          style="width: 100%;margin-top:20px;"
          @selection-change="handleSelectionChange">
          <el-table-column
            label="姓名" width="150">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别" width="70">
            <template slot-scope="scope">
              <span>{{ scope.row.sex | sex}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="手机" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.phone }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="省区" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.province }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="城市" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.city }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="区县" width="130">
            <template slot-scope="scope">
              <span>{{ scope.row.county }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="businessId===1"
            label="药店">
            <template slot-scope="scope">
              <span>{{ scope.row.drugStore }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="businessId!==1"
            label="医院">
            <template slot-scope="scope">
              <span>{{ scope.row.hospital }}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="businessId!==1"
            label="科室">
            <template slot-scope="scope">
              <span>{{ scope.row.office}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="职称" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.title }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="奖励方式" width="100">
            <template slot-scope="scope">
              <span>{{scope.row.awardType | changeType}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="awardTypel === 'bribery'"
            label="领取金额" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.outMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column
            v-if="awardTypel === 'awardEntity'"
            label="物品" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.awardEntityMessage }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="得分" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.score }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="提交时间"
            width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.pullTime | formatDate }}</span>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 20px"></div>
        <el-pagination
          background
          layout="total, prev, pager, next"
          @current-change="handleCurrentChange"
          :current-page="newpage"
          :total="total">
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { formatDate } from '@/common/data'
export default {
  name: 'modelist',
  components: {},
  data() {
    return {
      businessId: this.$route.matched[0].meta.businessId,
      loading: false,
      radio: '1',
      total: 0,
      joinNumber: 0,
      answersTotal: 0,
      awardNumber: 0,
      dialogVisible: false,
      isDisabled: false,
      id: this.$route.params.id,
      newpage: 1,
      xlsUrl: '',
      totalNum: 10,
      multipleSelection: [],
      tableData: [
      ],
      arrays: [],
      awardTypel: '',
      data1: {
        title: '',
        coverUrl: '',
        answerNum: '',
        answersTotal: '',
        startTime: '',
        endTime: '',
        awardType: 'awardLess',
        awardLessMessage: '',
        award: {
          awardType: 'awardLess',
          equal: '',
          min: '',
          max: '',
          money: '',
          inCondition: '',
          num: ''
        }
      },
      data2: [],
      data3: [],
      checkList: ['复选框 B', '复选框 A']
    }
  },
  computed: {},
  filters: {
    formatDate(time) {
      if (time === null) {
        return ''
      }
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    ssss(str) {
      var min = Number(str)
      if (min === 0) {
        return '无'
      } else {
        return '得分需在' + min + '分以上'
      }
    },
    allType(type) {
      if (type === '0') {
        return '单选题'
      } else if (type === '1') {
        return '多选题'
      } else if (type === '2') {
        return '开放题'
      }
    },
    changeType(type) {
      if (type === 'awardEntity') {
        return '物品'
      } else if (type === 'bribery') {
        return '红包'
      } else if (type === 'awardLess') {
        return '无奖励'
      }
    },
    sendtype(num) {
      if (num === 0) {
        return '随机分配'
      } else {
        return '平均分配'
      }
    },
    nameornick(nickname, name) {
      if (name) {
        return name
      } else if (nickname) {
        return nickname
      } else {
        return ''
      }
    },
    repeat(num) {
      if (num === 0) {
        return '可重复答题'
      } else {
        return '仅可答题一次'
      }
    },
    sex(str) {
      if (str === 'man') {
        return '男'
      }
      if (str === 'woman') {
        return '女'
      }
    }
  },
  mounted() {
    console.log(this.$route)
    this.naireBasic()
    this.naireResult(this.newpage)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    goback() {
      this.$router.push({
        path: '../survey',
        query: {
          page: this.$route.query.page
        }
      })
    },
    handleCurrentChange(val) {
      this.newpage = val
      this.naireResult(val)
    },
    naireBasic: async function() {
      var res = await http.get(api.naireBasic + this.$route.params.id)
      if (res.data.code === 0) {
        this.data1 = res.data.data
        this.joinNumber = this.data1.joinNumber
        this.answersTotal = this.data1.answersTotal
        this.awardNumber = this.data1.awardNumber
        if (res.data.data.questionList) {
          var paperData = []
          if (res.data.data.questionList.length > 0) {
            paperData = res.data.data.questionList.map((item) => {
              var ary = {}
              ary.title = item.title
              ary.score = item.score
              ary.options = JSON.parse(item.options)
              ary.type = item.type.toString()
              if (ary.type === '0') {
                ary.radioAnswer = item.answers
              } else if (ary.type === '1') {
                ary.checkboxAnswer = JSON.parse(item.answers)
              }
              return ary
            })
          }
          this.data2 = paperData
        }
      }
    },
    naireResult: async function(page) {
      var params = {
        pageNum: page,
        pageSize: 10,
        params: {
          id: this.$route.params.id
        }
      }
      var res = await http.post(api.naireResult, params)
      if (res.data.code === 0) {
        var data = res.data.data
        this.tableData = data.data
        this.arrays = data.data
        for (var i = 0; i < this.arrays.length;i ++) {
          console.log(data.data[i].createTime)
          this.awardTypel = this.arrays[i].awardType
        }
        if (this.tableData.length > 0) {
          this.isDisabled = false
        } else {
          this.isDisabled = true
        }
        this.total = Number(data.total)
      }
    },
    downData() {
      this.dialogVisible = true
    },
    getXls: async function() {
      var params = {
        pageSize: 10,
        pageNum: this.newpage,
        params: {
          id: this.id
        }
      }
      const res = await http.post(api.questionnairesult,params)
      if (res.data.code === 0) {
        this.dialogVisible = false
        window.open(res.data.message)
        this.loading = false
      } else {
        this.loading = false
        this.$message.error(res.data.message)
      }
    },
    downLoadData() {
      this.loading = true
      this.getXls()
    }
  }
}
</script>
<style scoped>
.modelist {
  padding: 20px;
}
.piont-flex{
  display: flex;
  justify-content: space-between;
  height:36px;
  margin-bottom: 15px;
  padding-bottom:45px;
  border-bottom:1px solid gray;
}
.piont-flex .point-title{
  height: 36px;
  line-height: 36px;
}
.xinxi-item{
  margin-left:20px;
  margin-top:20px;
}
.xinxi-item .item-title{
  display:inline-block;
  width:120px;
  margin-right:20px;
}
.center-item{
  width:100%;
  height:200px;
}
.center-item .center{
  width:100px;
  height: 200px;
  line-height: 200px;
  margin:auto;
}
.dan{
  margin-left:15px;
  padding:15px;
  border:1px solid #eee;
}
.content{
  overflow: hidden;
  border-bottom: 1px solid #eee;
  margin:10px 0;
}
.down{
  float: right;
  margin: 10px 0;
}
</style>

<template>
  <div>
    <header-content :opertions="opertions" @header-btn-click="headerClick" :title="headerTitle"></header-content>
    <div class="createBox">
      <el-form label-width="80px" :model="addoptions">
        <el-form-item label="任务类型:">
          <span>答题奖励</span>
        </el-form-item>
        <el-form-item label="任务名称:">
          <el-input placeholder="请输入内容最多可输入20字" v-model="addoptions.title" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="任务周期:">
          <el-date-picker
            placeholder="请选择任务周期"
            @change="timeChange"
            v-model="timeScope"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="积分类型:">
          <span>平台积分</span>
        </el-form-item>

        <el-form-item label="关联内容:">
          <el-tag
            v-for="tag in addoptions.businesses"
            :key="tag.id"
            :closable="false"
            type="success"
            @close="handleClose(tag)"
          >
            {{tag.examPageName?tag.examPageName:tag.busName }}
          </el-tag>
          <el-button @click="showRelecance" type="info">选择内容</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="border_1px"></div>
    <div class="module_box">
      <span style="font-size: 16px">任务领取条件：</span>
      <div class="module_content_box">
        <li>
          <span>大于等于</span>
          <el-input-number v-model="addoptions.conditions[0].pro.pointLimit" :min="1" style="width: 160px"></el-input-number>
          <span>分领取积分</span>
        </li>
        <li>
          <span>积分份数</span>
          <el-input-number v-model="addoptions.conditions[0].numMax" :min="1" style="width: 160px"></el-input-number>
          <span>份</span>
        </li>
        <li>
          <span>每人领取</span>
          <el-input-number v-model="addoptions.conditions[0].pointEvery" :min="1" style="width: 160px"></el-input-number>
          <span>积分</span>
        </li>
        <li>
          <span>发放总积分：{{addoptions.conditions[0].numMax*addoptions.conditions[0].pointEvery}}</span>
        </li>
      </div>
    </div>
    <div class="border_1px"></div>
    <div>
      <el-form label-width="80px" :model="addoptions">
        <el-form-item label="信息简介:">
          <textarea v-model="addoptions.description" :rows="12" class="test-area"></textarea>
        </el-form-item>
      </el-form>
    </div>
    <el-button @click="$router.back()">取消</el-button>
    <el-button @click="taskSave(-1)" type="primary">保存</el-button>
    <el-button @click="taskSave(0)" type="primary">发布</el-button>
    <!-- 关联内容的对话框 -->
    <el-dialog
      title="关联内容"
      :visible.sync="dialogVisible">
      <el-table
        ref="multipleTable"
        :data="findExamManageList.list"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column
          label="名称">
          <template slot-scope="scope">{{ scope.row.examPaperName }}</template>
        </el-table-column>
        <el-table-column
          label="时间">
          <template slot-scope="scope">{{ scope.row.startTime | formatDates }}-{{ scope.row.endTime | formatDates }}</template>
        </el-table-column>
        <el-table-column
          label="状态">
          <template slot-scope="scope">{{ scope.row.status | getState }}</template>
        </el-table-column>
      </el-table>
      <div style="height: 20px"></div>
      <el-pagination
        @current-change="currentChange"
        layout="prev, pager, next"
        :total="findExamManageTotal">
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="relevanceBtn(0)">取 消</el-button>
        <el-button type="primary" @click="relevanceBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import { formatDate } from '@/common/data'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
      props: {
      },
      filters: {
        formatDates(time) {
          var date = new Date(time)
          return formatDate(date,'yyyy-MM-dd hh:mm')
        },
        getState(state) {
          switch (state) {
            case 0:
              return '未发布'
            case 1:
              return '未开始'
            case 2:
              return '进行中'
            case 3:
              return '已结束'
            case 4:
              return '已失效'
          }
        }
      },
      data() {
        return {
          dataInfo: '',
          taskId: this.$route.params.id,
          addoptions: {
            status: '', // 保存-1 创建0
            title: '', // 任务名称
            startTime: '', // 开始时间
            endTime: '', // 结束时间
            businesses: [], // 关联内容
            conditions: [{
              identity: -1, // 无身份情况下 默认传-1
              numMax: '', // 每人最多领取份数
              pointEvery: '', // 每人领取积分
              pointType: 1,
              pro: {
                pointLimit: '' // 大于多少积分领取
              }
            }], // 发放总积分
            description: '', // 简介
            event: 'question', // 任务表识 question答题
            pointType: 1 // 积分类型 1平台 0医百
          },
          num: 1,
          findExamManageList: '',
          findExamManageTotal: 0,
          pageNum: 1,
          dialogVisible: false,
          pickerOptions: {
            shortcuts: [{
              text: '设为一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [end, start]);
              }
            }, {
              text: '设为一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [end, start]);
              }
            }, {
              text: '设为三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [end, start]);
              }
            }]
          },
          timeScope: [],
          formLabelAlign: {},
          headerTitle: '创建答题奖励',
          opertions: ['返回']
        }
      },
      mounted() {
        if (this.taskId) {
          this.getDataInfo()
        }
      },
      methods: {
        getDataInfo() {
          http.get(api.answerDetail + this.taskId).then(res => {
            if (res.data.code === 0) {
              let data = res.data.data
              this.timeScope.push(data.startTime)
              this.timeScope.push(data.endTime)
              this.addoptions = res.data.data
            } else {
              this.$message.error(res.data.message)
            }

          })
          // answerUpdate
        },
        handleClose(tag) {
          this.addoptions.businesses.splice(this.addoptions.businesses.indexOf(tag), 1);
        },
        /*
        * 打开关联内容
        * */
        showRelecance() {
          this.dialogVisible=true
          this.getDateList(1)
        },
        timeChange() {
          this.addoptions.startTime = this.timeScope[0].getTime()
          this.addoptions.endTime = this.timeScope[1].getTime()
          if (this.timeScope[0].getTime() === this.timeScope[1].getTime()) {
            this.addoptions.endTime = this.timeScope[1].getTime() + 3600 * 1000 * 24 - 1000
          }
        },
        /*
        * 验证填写的内容
        * */
        verifyForm() {

        },
        /* 保存创建 */
        taskSave(status) {
          if (this.addoptions.title === '') {
            this.$message.error('请填写任务名称')
            return false
          }
          if (this.addoptions.startTime === '') {
            this.$message.error('请选择任务周期')
            return false
          }
          if (this.addoptions.endTime === '') {
            this.$message.error('请选择任务周期')
            return false
          }
          if (this.addoptions.businesses.length < 1) {
            this.$message.error('请选择关联内容')
            return false
          }

          this.addoptions.status = status
          var apiurl = api.answerCreate
          if (this.taskId) {
            apiurl = api.answerUpdate
          }
          http.post(apiurl, this.addoptions).then(res => {
            if (res.data.code === 0) {
              this.$router.back()
            } else {
              this.$message.error(res.data.message)
            }
          })

        },
        currentChange(item) {
          this.getDateList(item)
        },
        /* 选择内容多选时的监听 */
        handleSelectionChange(item) {
          for (var i of item) {
            i.businessId = 100
            i.id = null
            if(i.examPaperName) {
              i.busName = i.examPaperName
            }
          }
          this.addoptions.businesses = item
        },

        getDateList(pageNum) {
          let params = {
            pageNum: pageNum,
            pageSize: 10
          }
          http.post(api.findExamManageLis,params).then(res => {
            this.findExamManageList = res.data.data
            this.findExamManageTotal = res.data.data.total
          })
        },
        relevanceBtn(item) {
          if (item === 0) {
            this.addoptions.businesses = []
          }
          this.dialogVisible = false
        },
        headerClick() {
          this.$router.back()
        }
      },
      components: {
        HeaderContent
      }
    }
</script>
<style scoped lang="scss">
  .test-area {
    width: 600px;
  }
  .border_1px {
    width: 100%;
    border-top: 1px solid #999999;
    margin-bottom: 40px;
  }
  .module_content_box {
    width: 600px;
    padding-left: 60px;
    margin-top: 20px;
    margin-bottom: 20px;
    li {
      margin-bottom: 20px;
    }
  }
  .module_box {
    font-size: 14px;
    color: rgb(72, 87, 106);
  }
  .createBox {
    width: 600px;
  }
</style>

<template>
  <el-dialog
    class="point-detail"
    :title="title"
    :visible.sync="dialogPointDetailVisible"
    :before-close="handleClose">
    <!-- 浏览详情 -->
    <div class="content" v-if="dialogTitle === 'look'">
      <p class="title">{{lookActionName}}《{{ pointDetailData.busName }}》</p>
      <div class="main">
        <div class="point-info">
          <p>积分：<span class="color-orange">+ {{ pointDetailData.point }}</span></p>
          <p>积分类型：{{ pointType }}</p>
        </div>
        <p>时间：{{ pointDetailData.createtime | formatDate }}</p>
      </div>
    </div>
    <!-- 线上答题详情 -->
    <div class="content" v-if="dialogTitle === 'question' || dialogTitle === 'competition' || dialogTitle === 'qa_question'">
      <p class="title">{{ pointDetailData.busName }}</p>
      <div class="main">
        <div class="point-info">
          <p>积分<span class="color-orange">{{pointDetailData.point | getorsend}}</span></p>
          <p>积分类型：{{ pointType | formatPointType }}</p>
        </div>
        <p>时间：{{pointDetailData.createtime | formatDate}}</p>
      </div>
    </div>
    <!-- 浏览详情 -->
    <div class="content" v-if="dialogTitle === 'question'">
      <p class="title">{{ pointDetailData.busName }}</p>
      <div class="main">
        <div class="point-info">
          <p>积分：<span class="color-orange">+ {{ pointDetailData.point }}</span></p>
          <p>积分类型：{{ pointType }}</p>
        </div>
        <p>时间：{{ pointDetailData.createtime | formatDate }}</p>
      </div>
    </div>
    <!-- 消费详情 -->
    <div class="content" v-if="dialogTitle === 'shop'">
      <div class="shop-info">
        <div class="recordsItem">
          <div class="recordsItem_l">订单号：</div>
          <div class="recordsItem_r">{{pointDetailData.orderId}}</div>
        </div>
        <div class="recordsItem">
          <div class="recordsItem_l">兑换商品：</div>
          <div class="recordsItem_r">{{pointDetailData.goodsSkuName}}</div>
        </div>
        <div class="recordsItem">
          <div class="recordsItem_l">兑换数量：</div>
          <div class="recordsItem_r">{{pointDetailData.buyNum}}</div>
        </div>
        <div class="recordsItem">
          <div class="recordsItem_l">消费积分：</div>
          <div class="recordsItem_r color-orange">- {{pointDetailData.expenseIntegral}}</div>
        </div>
        <div class="recordsItem">
          <div class="recordsItem_l">兑换时间：</div>
          <div class="recordsItem_r">{{pointDetailData.createTime | formatDate}}</div>
        </div>
        <div class="recordsItem">
          <div class="recordsItem_l">订单状态：</div>
          <div class="recordsItem_r">{{pointDetailData.status | formatStatus}}</div>
        </div>
        <div class="recordsItem">
          <div class="recordsItem_l">备注：</div>
          <div class="recordsItem_r">{{pointDetailData.auditMark || '--'}}</div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import { formatDate } from '@/common/data'
  export default {
    props: {
      dialogTitle: {
        type: String,
        default: ''
      },
      dialogPointDetailVisible: {
        type: Boolean,
        default: false
      },
      pointDetailData: {
        type: Object,
        default: {}
      }
    },
    watch: {
      dialogTitle(now) {
        switch (now) {
          case 'look':
            this.title = '视频浏览'
            this.lookActionName = '观看'
            break
          case 'lookcms':
            this.title = '文章浏览'
            this.lookActionName = '阅读'
            break
          case 'shop':
            this.type === '0' ? this.title = '积分消费' : this.title = '医币消费'
            break
          case 'question':
            this.title = '线上答题'
            break
          case 'competition':
            this.title = '线上答题竞赛'
            break
          case 'qa_question':
            this.title = '调研问卷'
            break
          default:
            break
        }
      }
    },
    data() {
      return {
        lookActionName: '',
        title: '', // 弹窗类型
        pointType: '平台积分',
        type: this.$route.params.type, // 类型（0平台，1医百）
        dataObj: {} // 消费数据
      }
    },
    methods: {
      /* 关闭窗口 */
      handleClose () {
        this.$emit('closeDialogPointDetail')
      },
      /* 返回任务列表 */
      goTaskList() {
        this.$emit('showTaskList')
      },
      typechange(str) {
        switch (str) {
          case 'enroll':
            return '邀请注册'
          case 'look':
            return '浏览'
          case 'question':
            return '线上答题'
        }
      }
    },
    filters: {
      formatPointType(type) {
        if (type === '0') {
          return '平台积分'
        } else if (type === '1') {
          return '医百医币'
        } else {
          return '平台积分'
        }
      },
      getorsend(num) {
        if (num > 0) {
          return '-' + num
        } else {
          return '+' + (0 - num)
        }
      },
      formatStatus(val) {
        let txt
        switch (val) {
          case 0:
            txt = '待审核'
            break
          case 1:
            txt = '审核通过'
            break
          case 2:
            txt = '审核未通过'
            break
        }
        return txt
      },
      formatDate(time) {
        time = Number(time)
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      }
    }
  }
</script>
<style lang="stylus">
    /* 饿了么dialog样式重置 */
  .point-detail .el-dialog {
    width: 500px;
    border-radius: 8px;
  }
  .point-detail .el-dialog__body {
    padding: 0 30px 40px;
  }
  .point-detail .el-dialog__headerbtn {
    top: 12px;
  }
  .point-detail .el-dialog__headerbtn .el-dialog__close {
    font-size: 38px;
    color: #5b5b5b;
  }
</style>
<style scoped>
  .point-detail .content .title {
    margin-top: 36px;
    font-size: 16px;
  }
  .main {
    margin-top: 30px;
  }
 .point-info {
    margin-bottom: 20px;
    display:  -webkit-flex;
    display: flex;
    justify-content: space-between;
 }
  .color-orange {
    color: #FDB603;
  }
  .shop-info{
    padding-top: 20px;
  }
  .recordsItem{
    margin-top: 10px;
    display:  -webkit-flex;
    display: flex;
    justify-content: flex-start;
  }

</style>

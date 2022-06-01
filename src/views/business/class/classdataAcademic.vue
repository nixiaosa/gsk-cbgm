<template>
  <div class="modelist">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div>
      <el-tabs type="border-card" v-model="topActiveName">
        <el-tab-pane label="报名统计" name="signUp">
          <div v-if="topActiveName === 'signUp'">
            <sign-up/>
          </div>
        </el-tab-pane>
        <el-tab-pane label="签到统计" name="signIn">
          <div v-if="topActiveName === 'signIn'">
            <sign-in/>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { formatDate } from '@/common/data'
import HeaderContent from '@/components/header-content'
import SignUp from "@/views/business/class/dataStatistics/SignUp";
import SignIn from "@/views/business/class/dataStatistics/SignIn";
export default {
  components: {SignIn, SignUp, HeaderContent },
  data() {
    return {
      businessId: this.$route.query.service,
      // topActiveName: this.$route.query.service !== '5' ? 'new' : 'signUp',
      topActiveName: 'signUp',
      type: Number(this.$route.query.type),
      activeName: this.$route.query.type,
      opertions: ['返回'],
      headerTitle: '观看统计',
      page: this.$route.params.page
    }
  },
  created() {
    // if (this.type === 3) {
      this.activeName = '1'
      // alert(this.topActiveName)
    // }
  },
  computed: {
  },
  filters: {
    formatDate(time) {
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    },
    tomin(value) {
      var theTime = parseInt(value)// 秒
      var theTime1 = 0// 分
      var theTime2 = 0// 小时
// alert(theTime);
      if (theTime > 60) {
        theTime1 = parseInt(theTime / 60)
        theTime = parseInt(theTime % 60)
// alert(theTime1+"-"+theTime);
        if (theTime1 > 60) {
          theTime2 = parseInt(theTime1 / 60)
          theTime1 = parseInt(theTime1 % 60)
        }
      }
      var result = '' + parseInt(theTime) + '秒'
      if (theTime1 > 0) {
        result = '' + parseInt(theTime1) + '分' + result
      }
      if (theTime2 > 0) {
        result = '' + parseInt(theTime2) + '小时' + result
      }
      return result
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
  },
  watch: {
    type() {
      if (this.type === 1) {
        this.activeName = '1'
      } else if (this.type === 2){
        this.activeName = '2'
      } else if (this.type === 3) {
        this.activeName = '3'
      }
    }
  },
  methods: {
    initialPage() {
      if (this.type === 2) {
        this.activeName = '2'
        this.$refs.video1.initialPage()
      } else if (this.type === 1) {
        this.activeName = '1'
        this.$refs.live1.initialPage()
        this.$refs.watch1.initialPage()
      }
    },
    headerClick() {
      this.$router.push({
          path: '/conference/academic',
          query: {
            page: this.$route.params.page
          }
        })
    },
    handleClick(tab, event) {
    },
    showid() {
    },
    changeOrder() {
    },
  }
}
</script>
<style scoped>
/*.piont-flex{*/
/*display: flex;*/
/*justify-content: space-between;*/
/*height:36px;*/
/*margin-bottom:15px;*/
/*}*/
/*.piont-flex .point-title{*/
/*height: 36px;*/
/*line-height: 36px;*/
/*}*/
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  width: 100px;
  height: 80px;
}
</style>

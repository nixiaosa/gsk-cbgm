<template>
  <div id="lists">
    <header-content :opertions="opertions" :title="headerTitle" v-if="!this.$route.query.id" @header-btn-click="headerClick"></header-content>
    <header-content :opertions="opertions" :title="headerTitles" v-if="this.$route.query.id" @header-btn-click="headerClick"></header-content>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="135px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <div id="top">
        <Headers :itemDatas="itemDatas" :addoptions="addoptions" :points="points" :id="id" :itemData="itemData"></Headers>
      </div>
      <div class="box">
        <el-form-item label="关联业务内容" prop="name">
        </el-form-item>
        <div class="boxlist">
          <el-button type="info" class="btns" @click="goToFatherDetail">选择业务内容</el-button>
          <ul>
            <li v-if="addoptions.businesses.length > 0 " v-for="(item,index) in addoptions.businesses" class="names">
              {{ item.busName}}
              <span class="deletes" @click="deletes(item,index)" v-if="!id">x</span>
              <span class="deletes" @click="deletesl(item,index)" v-if="id">x</span>
            </li>
          </ul>
        </div>
      </div>
      <Dialogs :isShow="isShow" v-on:shows="shows" :addoptions="addoptions"></Dialogs>
      <div id="content" style="height:auto;">
        <el-form-item label="领取条件:" label-width="130px" style="margin:30px 0;" prop="name">
          <el-radio-group v-model="ruleForm.identity" @change="inviteechanges">
            <el-radio label="0" flag="flag" v-if="limitIdentity">限制身份</el-radio>
            <el-radio label="-1" flag="!flag" v-if="noLimitIdentity">不限制身份</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="height:50px;">
          <img src="../../images/add.png" alt="" style="width: 50px;height: 50px;cursor: pointer;float: left;margin-top: -9px;" @click="add()" v-if="ruleForm.identity==='0'">
          <span style="float: left;margin-left:10px;" v-if="ruleForm.identity==='0'">添加领取条件</span>
        </div>
        <Receive :options="options" :itemData="itemData" :addoptions="addoptions" :addoptionsDel="addoptionsDel" v-on:totals="setTotals"></Receive>
      </div>
      <div id="bottom">
        <el-form-item label="简介信息:">
          <textarea class="test-area" v-model="ruleForm.description"></textarea>
        </el-form-item>
        <el-form-item label="发放总积分" prop="name" v-if="addoptions.pointType !== 0">
          <div class="test" style="margin-left:60px;">{{addoptions.conditions | pointTotal}}
            <span style="margin-left: 5px;">积分</span>
          </div>
        </el-form-item>
        <el-form-item label="发放总医币" prop="name" v-if="addoptions.pointType == 0">
          <div id="test" style="margin-left:60px;">{{addoptions.conditions | pointTotal}}
            <span style="margin-left: 5px;">医币</span>
          </div>
          <div id="clos" style="margin-left: 100px;" v-if="accountPoint < totals">医币不足请联系管理员充值 </div>
          <div id="tishi" style="height:20px;color:#ccc;margin-left:200px;">
            当前账户余额：{{ accountPoint }}医币
          </div>
        </el-form-item>
      </div>
    </el-form>
    <div id="btnsl">
      <el-button type="info" style="width:150px;float: left;" @click="createlook" v-if="!id">保存</el-button>
      <el-button type="info" style="width:150px;float: left;" @click="lookUpdate" v-if="id">保存</el-button>
      <el-button type="info" style="width:150px;float: left;" @click="release" v-if="!id">发布</el-button>
      <el-button type="info" style="width:150px;float: left;" @click="releases" v-if="id">发布</el-button>
      <div class="cance" style="width:150px;" @click="cancel" v-if="id">取消</div>
      <div class="cance" style="width:150px;" @click="cancel" v-if="!id">取消</div>
    </div>
  </div>
</template>

<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { isnumber } from '@/utils/validate'
import SelectTree from './base/tree'
import { formatDate } from '@/common/data'
import { mapGetters } from 'vuex'
import { getRightDate, changetime } from '@/common/data'
import Headers from './base/header'
import Receive from './base/Receive'
import Dialogs from './base/dialog'
export default {
  components: {
    HeaderContent,
    SelectTree,
    Headers,
    Receive,
    Dialogs
  },
  data: function() {
    const isLengthOut = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(''))
      } else {
        callback()
      }
    }
    return {
      createType: this.$route.params.type,
      opertions: ['返回'],
      limitIdentity: true,
      noLimitIdentity: true,
      conditions: [],
      tittle: 'dasdada',
      isShow: false,
      points: [{
          value: 1,
          label: '平台积分'
        },
        {
          value: 0,
          label: '医百医币'
        }],
      defaultProps: {
        children: 'childRole',
        label: 'name',
        value: 'id'
      },
      itemDatas: [
        {
          label: '任务类型'
        },
        {
          label: '任务名称',
          placeholder: '请输入内容最多可输入20字'
        },
        {
          label: '任务周期'
        },
        {
          label: '发放积分类型'
        }
      ],
      itemData: [
        {
          label: '领取身份',
          placeholder: '请选择'
        },
        {
          label: '积分份数',
          placeholder: '请设置积分份数'
        },
        {
          label: '每人领取',
          placeholder: '请输入领取积分'
        },
        {
          label: '每人最多领取份数',
          placeholder: '请设置每人最多领取份数'
        },
        {
          label: '观看时长',
          placeholder: '请选择'
        }
      ],
      flag: true,
      flags: false,
      companyId: '',
      checkedCities: [],
      tableData: [],
      cityOptions: [],
      isIndeterminate: true,
      checkAll: false,
      serviceName: '店员培训',
      bidOptions: [],
      bidValue: '',
      value: '全部分类',
      optionObj: {},
      listData: [],
      isSuccer: false,
      dialogVisible: false,
      activityId: '',
      message: '发布成功',
      dialogList: [],
      serviceId: '0',
      pointNumTotal: '',
      accountPoint: 0,
      id: this.$route.query.id,
      edit: {
        id: '',
        identity: '',
        taskid: '',
        dayMax: '',
        numMaxEvery: '',
        pointEvery: '',
        event: '',
        startTime: '',
        endTime: '',
        title: '',
        status: ''
      },
      totals: '',
      multipleSelection: [],
      headerTitle: '创建任务',
      headerTitles: '编辑任务',
      ruleForm: {
        identity: '0',
        name: '',
        region: '',
        description: '',
        browseTime: '',
        title: '',
        event: 'look' // look浏览观看任务 enroll 邀请任务
      },
      repeat: [],
      pointTotal: 0,
      addoptions: {
        title: '',
        startTime: '',
        endTime: '',
        pointType: null,
        businesses: [],
        conditions: [
          {
            identity: '',
            pointEvery: '',
            numMaxEvery: '',
            numMax: '',
            pointMax: 0,
            pointType: null,
            pro: {
              browseTime: ''
            }
          }
        ]
      },
      addoptionsl: {
        businesses: [],
        conditions: [
          {
            identity: '',
            pointEvery: '',
            numMaxEvery: '',
            numMax: '',
            pointMax: 0,
            pro: {
              browseTime: ''
            }
          }
        ]
      },
      addoptionsDel: {
        conditions: [],
        businesses: []
      }, // 已删除的
      options: [],
      invitee: [],
      rules: {
        name: [{ required: true, trigger: 'blue', validator: isLengthOut }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'service',
      'serviceType',
      'businessTrain',
      'businessClass',
      'businessOnlineOpenClass',
      'businessAcademicConFerence',
      'businessInteractionOpenClass',
      'userAuths'
    ])
  },
  mounted() {
    this.getIdentityTree()
    if (this.$route.query.id) {
      this.lookdetails()
    }
    this.payPoint()
  },
  filters: {
    pointTotal(array) {
      var total = 0
      if (array.length !== 0) {
        for (var i = 0; i < array.length; i++) {
          if (array[i].pointMax) {
            total += array[i].pointMax
          }
        }
      }
      return total
    },
    formatDate(time) {
      time = Number(time)
      var date = new Date(time)
      return formatDate(date, 'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    changetime,
    getRightDate,
    headerClick(item) {
      if (item === '返回') {
        this.$router.back()
      }
    },
    goToFatherDetail() {
      this.isShow = true
    },
    handleSelectionChange(val) {
      this.multipleSelection = Array.from(new Set(val))
    },
    shows(val) {
      if (val === 'hiden') {
        this.isShow = false
      }
    },
    setTotals(val) {
      this.totals = val
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    deletes(item, index) {
      this.addoptions.businesses.splice(index, 1)
    },
    deletesl(item, index) {
      if (this.id) {
        this.addoptions.businesses[index].isdelete = true
        this.addoptionsDel.businesses.push(this.addoptions.businesses[index])
        this.addoptions.businesses.splice(index, 1)
      }
    },
    payPoint: async function() {
      let res1 = await http.post(api.getAccountPoint, {})
      if (res1.data.code === 0) {
        this.accountPoint = res1.data.data.surplus
      }
    },
    filter: function(data1) {
      const optionsfilter = data1.filter(data => {
        if (data.id) {
          data.id = data.id.toString()
        }
        if (data.childRole && data.childRole.length) {
          data.childRole = this.filter(data.childRole)
        }
        return true
      })
      return optionsfilter
    },
    /* 获取身份 */
    getIdentityTree: async function() {
      var res = await http.post(api.identityTree)
      if (res.data.code !== 0) {
        this.$message.error(res.data.message)
      } else {
        this.options = this.filter(res.data.data)
        this.companyId = this.options.companyId
        this.invitee = this.filter(res.data.data)
      }
    },
    inviteechanges: function(val) {
      this.ruleForm.identity = val.toString()
      if (this.flag) {
        if (this.ruleForm.identity == '0' && this.id) {
          this.lookdetails()
        } else if (this.ruleForm.identity == '-1' && this.id) {
          this.addoptions.conditions = this.addoptionsl.conditions
          this.addoptions.conditions[0].identity = '-1'
        }
      }
      if (!this.flag) {
        if (this.ruleForm.identity == '-1' && this.id) {
          this.lookdetails()
        } else if (this.ruleForm.identity == '0' && this.id) {
          this.addoptions.conditions = this.addoptionsl.conditions
        }
      }
      if (this.ruleForm.identity == '-1') {
        this.options = [
          {
            childRole: [],
            id: '-1',
            name: '不限制身份',
            live: 1,
            companyId: this.companyId,
            parentId: 0,
            sort: 0
          }
        ]
        if (!this.id) {
          this.addoptions.conditions[0].identity = '-1'
          this.addoptions.conditions[0].numMax = ''
          this.addoptions.conditions[0].pointEvery = ''
          this.addoptions.conditions[0].numMaxEvery = ''
          this.addoptions.conditions[0].pro.browseTime = ''
          this.addoptions.conditions[0].pointMax = 0
        }

        this.addoptions.conditions.length = 1
      } else {
        this.options = this.invitee
        if (!this.id) {
          this.addoptions.conditions[0].identity = ''
          this.addoptions.conditions[0].numMax = ''
          this.addoptions.conditions[0].pointEvery = ''
          this.addoptions.conditions[0].numMaxEvery = ''
          this.addoptions.conditions[0].pro.browseTime = ''
          this.addoptions.conditions[0].pointMax = 0
        }
      }
    },
    /*编辑任务*/
    lookUpdate: async function() {
      this.addoptions.status = -1
      this.addoptions.id = this.edit.id
      this.addoptions.event = this.ruleForm.event
      this.addoptions.description = this.ruleForm.description
      if (this.accountPoint < this.totals) {
        this.$message.error('租户积分不足')
        return false
      }
      if (this.addoptions.businesses.length < 1) {
        this.$message.error('请选择业务内容')
        return false
      }
      if (this.addoptionsDel.businesses.length > 0) {
        this.addoptions.businesses = this.addoptions.businesses.concat(
          this.addoptionsDel.businesses
        )
      }
      if (this.addoptionsDel.conditions.length > 0) {
        this.addoptions.conditions = this.addoptions.conditions.concat(
          this.addoptionsDel.conditions
        )
      }
      this.rulesinvite(this.addoptions, api.lookUpdate)
    },
    /*携带id发布任务*/
    releases: async function() {
      this.addoptions.status = 0
      this.addoptions.id = this.edit.id
      this.addoptions.event = this.ruleForm.event
      this.addoptions.description = this.ruleForm.description
      if (this.accountPoint < this.totals) {
        this.$message.error('租户积分不足')
        return false
      }
      if (this.addoptions.businesses.length < 1) {
        this.$message.error('请选择业务内容')
        return false
      }
      if (this.addoptionsDel.businesses.length > 0) {
        this.addoptions.businesses = this.addoptions.businesses.concat(
          this.addoptionsDel.businesses
        )
      }
      if (this.addoptionsDel.conditions.length > 0) {
        this.addoptions.conditions = this.addoptions.conditions.concat(
          this.addoptionsDel.conditions
        )
      }
      this.rulesinvite(this.addoptions, api.lookUpdate)
    },
    /*任务详情*/
    lookdetails: async function() {
      var res = await http.get(api.lookdetails + this.id)
      if (res.data.code === 0) {
        this.addoptions.title = res.data.data.title
        this.addoptions.startTime = new Date(res.data.data.startTime)
        this.addoptions.endTime = res.data.data.endTime
        this.addoptions.pointType = res.data.data.pointType
        this.addoptions.businesses = res.data.data.businesses
        this.ruleForm.description = res.data.data.description
        this.addoptions.conditions = res.data.data.conditions
        this.edit.id = res.data.data.id
        this.edit.status = res.data.data.status
        for (var i = 0; i < res.data.data.conditions.length; i++) {
          if (res.data.data.conditions[i].identity) {
            res.data.data.conditions[i].identity = res.data.data.conditions[
              i
            ].identity.toString()
          }
          var num = i
          if (res.data.data.conditions[num].identity === '-1') {
            this.ruleForm.identity = '-1'
            this.noLimitIdentity = true
            this.limitIdentity = false
            this.flag = false
            this.options = [
              {
                childRole: [],
                id: '-1',
                name: '不限制身份',
                live: 1,
                companyId: this.companyId,
                parentId: 0,
                sort: 0
              }
            ]
          } else {
            this.noLimitIdentity = false
            this.limitIdentity = true
          }
          this.addoptions.conditions[num].id = res.data.data.conditions[num].id
          this.addoptions.conditions[num].pro.browseTime =
            res.data.data.conditions[num].pro.browseTime
        }
      }
    },
    add() {
      // 添加信息
      if (this.ruleForm.identity === '-1') {
        return false
      }
      this.addoptions.conditions.push({
        identity: '',
        pointEvery: '',
        numMaxEvery: '',
        numMax: '',
        pointMax: 0,
        pro: {
          browseTime: ''
        }
      })
    },
    /* 表单验证判断方法 */
    rulesinvite: async function(obj, params) {
      var that = this
      obj.event = that.ruleForm.event
      obj.description = that.ruleForm.description
      that.repeat = obj.conditions
      if (obj.title.trim() === '' || obj.title.trim() === null) {
        that.$message.error('任务名称不能为空')
        return false
      }
      if (obj.title.trim().length > 20) {
        that.$message.error('任务名称不能超过20字')
        return false
      }
      if (obj.startTime === '' || obj.startTime === null) {
        that.$message.warning('请选择开始时间')
        return false
      }
      if (obj.endTime === '' || obj.endTime === null) {
        that.$message.warning('请选择结束时间')
        return false
      }
      if (obj.pointType === '' || obj.pointType === null) {
        this.$message.error("请选择积分发放类型")
      }
      if (obj.startTime > obj.endTime) {
        that.$message.error('开始时间不能大于结束时间')
        return false
      }
      if (obj.businesses.length < 1) {
        that.$message.error('请选择业务内容')
        return false
      }
      for (let i = 0; i < obj.conditions.length; i++) {
        let num = i
          obj.conditions[num].pointType = obj.pointType
        if (
          obj.conditions[num].identity === '' ||
          obj.conditions[num].identity == '0'
        ) {
          that.$message.error('请选择领取身份')
          return false
        }
        if (
          obj.conditions[num].numMax === '' ||
          obj.conditions[num].numMax === null
        ) {
          if (that.addoptions.pointType !== 0) {
            that.$message.error('请输入积分份数')
            return false
          } else if (that.addoptions.pointType == 0) {
             that.$message.error('请输入医币份数')
            return false
          }
        }
        if (!isnumber(obj.conditions[num].numMax)) {
          that.$message.error('积分份数请输入纯数字')
          return false
        }
        if (obj.conditions[num].numMax == 0) {
          that.$message.error('积分份数不能输入0')
          return false
        }
        if (obj.conditions[num].numMax.length > 9) {
          that.$message.error('积分份数不能超过9位')
          return false
        }
        if (
          obj.conditions[num].pointEvery === '' ||
          obj.conditions[num].pointEvery === null
        ) {
          that.$message.error('请输入每人领取')
          return false
        }
        if (!isnumber(obj.conditions[num].pointEvery)) {
          that.$message.error('每人领取请输入纯数字')
          return false
        }
        if (obj.conditions[num].pointEvery == 0) {
          that.$message.error('每人领取不能输入0')
          return false
        }
        if (obj.conditions[num].pointEvery.length > 9) {
          that.$message.error('每人领取不能超过9位')
          return false
        }
        if (
          obj.conditions[num].numMaxEvery === '' ||
          obj.conditions[num].numMaxEvery === null
        ) {
          that.$message.error('请输入每人最多领取份数')
          return false
        }
        if (!isnumber(obj.conditions[num].numMaxEvery)) {
          that.$message.error('每人最多领取份数请输入纯数字')
          return false
        }
        if (obj.conditions[num].numMaxEvery == 0) {
          that.$message.error('每人最多领取份数不能输入0')
          return false
        }
        if (obj.conditions[num].numMaxEvery.length > 9) {
          that.$message.error('每人最多领取份数不能超过9位')
          return false
        }
        if (
          Number(obj.conditions[num].numMax) <
          Number(obj.conditions[num].numMaxEvery)
        ) {
          if (that.addoptions.pointType !== 0) {
             that.$message.error('积分份数不能小于每人最多领取份数')
             return false
          } else if (that.addoptions.pointType == 0) {
            that.$message.error("医币份数不能小于每人最多领取份数")
            return false
          }
        }
        if (obj.conditions[num].pro.browseTime == '') {
          this.$message.error('请选择观看时长')
          return false
        }
        if (that.ruleForm.identity === '-1') {
          obj.conditions[num].identity == -1
        }
        for (var j = i + 1; j < this.repeat.length; j++) {
          if (obj.conditions[num].identity == this.repeat[j].identity) {
            this.$message.error('身份重复,请重新选择')
            return false
          }
        }
      }
      if (obj.description.length > 100) {
        this.$message.error('简介信息最多输入100字符')
        return false
      }
      let res = await http.post(params, obj)
      if (obj.status == -1 && !this.id) {
        if (res.data.code === 0) {
          this.$message.success('保存成功')
          this.$router.push({ path: '/taskcenter/browse' })
        } else {
          this.$message.error(res.data.message)
        }
      }
      if (obj.status == 0 && !this.id) {
        if (res.data.code === 0) {
          this.$message.success('发布成功')
          this.$router.push({ path: '/taskcenter/browse' })
        } else {
          this.$message.error(res.data.message)
        }
      }
      if (this.id && obj.status == -1) {
        if (res.data.code === 0) {
          this.$message.success('保存成功')
          this.$router.push({ path: '/taskcenter/browse' })
        } else {
          this.$message.error(res.data.message)
        }
      }
      if (this.id && obj.status == 0) {
        if (res.data.code === 0) {
          this.$message.success('发布成功')
          this.$router.push({ path: '/taskcenter/browse' })
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    /*
        创建任务
        */
    createlook: async function() {
      this.addoptions.status = -1
      this.rulesinvite(this.addoptions, api.lookCreate)
    },
    /*发布任务*/
    release: async function() {
      this.addoptions.status = 0
      this.rulesinvite(this.addoptions, api.lookCreate)
    },
    /* 取消 */
    cancel() {
      this.$router.push({ path: '/taskcenter/browse' })
    }
  }
}
</script>
<style>
.el-table {
  overflow: auto;
}
</style>
<style scoped>
#infor-content {
  float: left;
}
.point-title {
  margin: 20px;
}
#top {
  border-bottom: 1px solid #ccc;
}
#content {
  border-bottom: 1px solid #ccc;
}
#wrapers {
  min-height: 320px;
  border: 1px solid #ccc;
  margin: 0 20px 20px 20px;
  position: relative;
  overflow: hidden;
}
#wrapers .close {
  position: absolute;
  right: 5px;
  width: 30px;
  font-size: 30px;
  height: 30px;
  font-weight: 400;
  color: #bbbbbb;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
#wrapers .closes {
  position: absolute;
  right: 5px;
  width: 30px;
  font-size: 30px;
  height: 30px;
  font-weight: 400;
  color: #bbbbbb;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
#wraper {
  height: 220px;
  border: 1px solid #ccc;
  margin: 0 0 20px 20px;
  position: relative;
}
#bottom {
  height: 500px;
  position: relative;
}
.test-area {
  width: 100%;
  height: 300px;
  background: #f7f7f7;
  border: 1px solid #e5e5e5;
  padding: 5px;
  padding-top: 20px;
  outline: none;
  margin: 60px 0 0 -70px;
}
.points {
  position: absolute;
  right: 80px;
  bottom: 20px;
  color: red;
  font-size: 16px;
}
#clos {
  position: absolute;
  top: 0;
  left: 400px;
  color: red;
}
.cance {
  height: 38px;
  border-radius: 5px;
  text-align: center;
  line-height: 40px;
  background: #f7f7f7;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  cursor: pointer;
  float: left;
  margin: 0 0 0 10px;
}
#tishi {
  position: absolute;
  top: 0;
  left: 100px;
  color: red;
}
.btns {
  margin: 20px 0 0 20px;
}
#btnsl {
  width: 600px;
  height: 200px;
  margin: 80px 0 0 30px;
}
.boxlist {
  border: 1px solid #ccc;
  min-height: 320px;
  margin: 0 20px 20px 20px;
}
.active {
  color: #289de9 !important;
}
.dialogBtn {
  text-align: center;
  margin-top: 30px;
  margin-bottom: 40px;
}
.listInfo h1 {
  font-size: 16px;
  color: #333333;
  margin-bottom: 14px;
}
.listInfo h2,
.listInfo h3 {
  font-size: 12px;
  color: #a6a6a6;
  margin-bottom: 14px;
}
.dialog-img {
  float: left;
  width: 160px;
  margin-right: 20px;
  height: 90px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
}
img {
  display: inline-block;
  width: 100%;
  height: 100%;
}
.tab-list {
  width: 100%;
  background: #f5f5f5;
  height: 50px;
  margin-top: 1px;
  border-top: 1px solid #e5e5e5;
}
span {
  cursor: pointer;
  display: inline-block;
  line-height: 40px;
  font-size: 14px;
  color: #656565;
  /*margin-left: 40px;*/
}
.deletes {
  position: absolute;
  right: -40px;
  top: 0;
  width: 40px;
  font-size: 35px;
  height: 40px;
  font-weight: 200;
  color: #888888;
  text-align: center;
  line-height: 40px;
}
.boxlist ul,
li {
  list-style: none;
  padding: 0;
  position: relative;
}
.names {
  width: 400px;
  background: #cccccc;
  color: #000;
  font-size: 14px;
  line-height: 40px;
  text-align: center;
  margin: 10px 18px;
  border-radius: 5px;
}
</style>

<template>
  <div id="lists">
    <header-content :title="headerTitle" v-if="!this.$route.query.id" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <header-content :title="headerTitles" v-if="this.$route.query.id" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="135px" class="demo-ruleForm">
      <div id="top">
        <Headers :itemDatas="itemDatas" :addoptions="addoptions" :points="points" :vocational="vocational"   :id="id" :itemData="itemData"></Headers>
      </div>
    </el-form>
  </div>
</template>

<script>
import HeaderContent from '@/components/header-content'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import { isnumber } from '@/utils/validate'
import SelectTree from './base/tree'
import { formatDate } from '@/common/data'
import Headers from './base/header'
import Receive from './base/Receive'
export default {
  components: {
    HeaderContent,
    SelectTree,
    Headers,
    Receive
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
      opertions: ['返回'],
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
        },
        {
          label: '关联业务内容'
        }
      ],
      points: [{
          value: 1,
          label: '平台积分'
        },
        {
          value: 0,
          label: '医百医币'
        }],
      vocational: [{
          value: 1,
          label: '业务内容1'
        },
        {
          value: 0,
          label: '业务内容2'
        }],
      itemData: [
        {
          label: '积分份数',
          placeholder: '请设置积分份数'
        },
        {
          label: '每人领取',
          placeholder: '请输入领取积分'
        }
      ],
      limitIdentity: true,
      noLimitIdentity: true,
      conditions: [],
      defaultProps: {
        children: 'childRole',
        label: 'name',
        value: 'id'
      },
      flag: true,
      flags: false,
      companyId: '',
      pointNumTotal: '',
      accountPoint: 0,
      dialogVisible: false,
      id: this.$route.query.id,
      edit: {
        id: '',
        identity: '',
        taskid: '',
        dayMax: '',
        numMaxEvery: '',
        pointEvery: '',
        identityRelation: '',
        event: '',
        startTime: '',
        endTime: '',
        title: '',
        status: ''
      },
      totals: '',
      identitys: 1,
      headerTitle: '调研问卷任务列表-->创建任务',
      headerTitles: '调研问卷任务列表-->编辑任务',
      ruleForm: {
        identity: '0',
        name: '',
        region: '',
        description: '',
        title: '',
        event: 'enroll' // look浏览观看任务 enroll 邀请任务
      },
      repeat: [],
      pointTotal: 0,
      addoptions: {
        title: '',
        startTime: '',
        endTime: '',
        pointType: null,
        conditions: [
          {
            identity: '',
            pointEvery: '',
            numMaxEvery: '',
            numMax: '',
            pointType: '',
            pointMax: 0,
            pro: {
              identityRelation: ''
            }
          }
        ]
      },
      addoptionsl: {
        conditions: [
          {
            identity: '',
            pointEvery: '',
            numMaxEvery: '',
            numMax: '',
            pointMax: 0,
            pro: {
              identityRelation: ''
            }
          }
        ]
      },
      addoptionsDel: {
        conditions: []
      }, // 已删除的
      options: [],
      invitee: [],
      rules: {
        name: [{ required: true, trigger: 'blue', validator: isLengthOut }]
      }
    }
  },
  mounted() {
    this.getIdentityTree()
    if (this.id) {
      this.invitedetails()
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
      return formatDate(date, 'yyyy-MM-dd')
    }
  },
  methods: {
    payPoint: async function() {
      let res1 = await http.post(api.getAccountPoint, {})
      if (res1.data.code === 0) {
        this.accountPoint = res1.data.data.surplus
      }
    },
    setTotal(val) {
      this.totals = val
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
    // /* 获取身份 */
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
          this.invitedetails()
        } else if (this.ruleForm.identity == '-1' && this.id) {
          this.addoptions.conditions = this.addoptionsl.conditions
          this.addoptions.conditions[0].identity = '-1'
          this.addoptions.conditions[0].pro.identityRelation = '-1'
        }
      }
      if (!this.flag) {
        if (this.ruleForm.identity == '-1' && this.id) {
          this.invitedetails()
        } else if (this.ruleForm.identity == '0' && this.id) {
          this.addoptions.conditions = this.addoptionsl.conditions
        }
      }
      if (this.ruleForm.identity === '-1') {
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
          this.addoptions.conditions[0].pro.identityRelation = '-1'
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
          this.addoptions.conditions[0].pro.identityRelation = ''
          this.addoptions.conditions[0].pointMax = 0
        }
      }
    },
    /*编辑任务*/
    inviteUpdate: async function() {
      this.addoptions.status = -1
      this.addoptions.id = this.edit.id
      this.addoptions.event = this.ruleForm.event
      this.addoptions.description = this.ruleForm.description
      if (this.accountPoint < this.totals) {
        this.$message.error('租户积分不足')
        return false
      }
      if (this.addoptionsDel.conditions.length > 0) {
        this.addoptions.conditions = this.addoptions.conditions.concat(
          this.addoptionsDel.conditions
        )
      }
      this.rulesinvite(this.addoptions, api.inviteUpdate)
    },
    /*携带id发布任务*/
    releases: async function() {
      this.addoptions.event = this.ruleForm.event
      this.addoptions.description = this.ruleForm.description
      this.addoptions.id = this.edit.id
      this.addoptions.status = 0
      if (this.accountPoint < this.totals) {
        this.$message.error('租户积分不足')
        return false
      }
      if (this.addoptionsDel.conditions.length > 0) {
        this.addoptions.conditions = this.addoptions.conditions.concat(
          this.addoptionsDel.conditions
        )
      }
      this.rulesinvite(this.addoptions, api.inviteUpdate)
    },
    /*任务详情*/
    invitedetails: async function() {
      var res = await http.get(api.invitedetails + this.id)
      if (res.data.code === 0) {
        this.addoptions.title = res.data.data.title
        this.addoptions.startTime = new Date(res.data.data.startTime)
        this.addoptions.endTime = res.data.data.endTime
        this.addoptions.pointType = res.data.data.pointType
        this.addoptions.conditions = res.data.data.conditions
        this.ruleForm.description = res.data.data.description 
        this.edit.id = res.data.data.id
        this.edit.status = res.data.data.status
        for (let i = 0; i < res.data.data.conditions.length; i++) {
          let num = i
          if (res.data.data.conditions[num].identity) {
            res.data.data.conditions[num].identity = res.data.data.conditions[
              num
            ].identity.toString()
          }
          if (res.data.data.conditions[num].pro.identityRelation) {
            res.data.data.conditions[
              num
            ].pro.identityRelation = res.data.data.conditions[
              num
            ].pro.identityRelation.toString()
          }
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
          this.addoptions.conditions[num].pro.id =
            res.data.data.conditions[num].pro.id
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
          identityRelation: ''
        }
      })
    },

    /* 表单提交判断方法 */

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
      if (obj.startTime > obj.endTime) {
        that.$message.error('开始时间不能大于结束时间')
        return false
      }
      if (obj.pointType === '' || obj.pointType === null) {
        that.$message.error("请选择积分发放类型")
        return false
      }
      for (let i = 0; i < obj.conditions.length; i++) {
        let num = i
        obj.conditions[num].pointType = obj.pointType
        if (
          obj.conditions[num].identity === '' ||
          obj.conditions[num].identity === null ||
          obj.conditions[num].identity == '0'
        ) {
          that.$message.error('请选择邀请者身份')
          return false
        }
        if (
          obj.conditions[num].numMax === '' ||
          obj.conditions[num].numMax === null
        ) {
          if (this.addoptions.pointType !== 0) {
            that.$message.error('请输入积分份数')
            return false
          } else if (this.addoptions.pointType == 0) {
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
             that.$message.error('医币份数不能小于每人最多领取份数')
             return false
          }
        }
        if (
          obj.conditions[num].pro.identityRelation === '' ||
          obj.conditions[num].pro.identityRelation === null ||
          obj.conditions[num].pro.identityRelation == '0'
        ) {
          that.$message.error('请选择受邀者者身份')
          return false
        }
        if (that.ruleForm.identity === '-1') {
          obj.conditions[num].identity == -1
          obj.conditions[num].pro.identityRelation == -1
        }
        for (let j = i + 1; j < that.repeat.length; j++) {
          if (obj.conditions[num].identity == that.repeat[j].identity) {
            that.$message.error('身份重复,请重新选择')
            return false
          }
        }
      }
      if (obj.description.length > 100) {
        this.$message.error('简介信息最多输入100字符')
        return false
      }
      let res = await http.post(params, this.addoptions)
      if (this.addoptions.status == -1 && !this.id) {
        if (res.data.code === 0) {
          this.$message.success('保存成功')
          this.$router.push({ path: '/taskcenter/invite' })
        } else {
          this.$message.error(res.data.message)
        }
      }
      if (this.addoptions.status == 0 && !this.id) {
        if (res.data.code === 0) {
          this.$message.success('发布成功')
          this.$router.push({ path: '/taskcenter/invite' })
        } else {
          this.$message.error(res.data.message)
        }
      }
      if (this.id && this.addoptions.status == -1) {
        if (res.data.code === 0) {
          this.$message.success('保存成功')
          this.$router.push({ path: '/taskcenter/invite' })
        } else {
          this.$message.error(res.data.message)
        }
      }
      if (this.id && this.addoptions.status == 0) {
        if (res.data.code === 0) {
          this.$message.success('保存成功')
          this.$router.push({ path: '/taskcenter/invite' })
        } else {
          this.$message.error(res.data.message)
        }
      }
    },
    /* 创建任务*/
    createinvite: async function() {
      this.addoptions.status = -1
      this.rulesinvite(this.addoptions, api.inviteCreate)
    },
    /*发布任务*/
    release: async function() {
      this.addoptions.status = 0
      this.rulesinvite(this.addoptions, api.inviteCreate)
    },
    /* 取消 */
    cancel() {
      this.$router.push({ path: '/taskcenter/invite' })
    },
    headerClick() {
      this.$router.push({
        path: '/taskcenter/questionnaire' ,
        query:{
          page: this.$route.params.page
        }
      })
    }
  }
}
</script>

<style scoped>
#infor-content {
  float: left;
}
#top {
  /* border-bottom: 1px solid #ccc; */
}
#content {
  /* border-bottom: 1px solid #ccc; */
}
#wrapers {
  min-height: 320px;
  /* border: 1px solid #ccc; */
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
  /* border: 1px solid #ccc; */
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
  background-: #f7f7f7;
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
#btnsl {
  width: 600px;
  height: 200px;
  margin: 80px 0 0 30px;
}
</style>

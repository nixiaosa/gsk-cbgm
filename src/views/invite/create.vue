<template>
  <div id="lists">
    <header-content :title="headerTitle" v-if="!this.$route.query.id"></header-content>
    <header-content :title="headerTitles" v-if="this.$route.query.id"></header-content>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="135px" class="demo-ruleForm" style="border: 1px solid #ccc">
      <div id="top">
        <Headers :itemDatas="itemDatas" :addoptions="addoptions" :points="points" :id="id" :itemData="itemData"></Headers>
      </div>
      <div id="content" style="height:auto;">
        <el-form-item label="邀请者领取条件:" label-width="130px" style="margin:30px 0;" prop="name">
          <el-radio-group v-model="ruleForm.identity" @change="inviteechanges">
            <el-radio label="0" flag="flag" v-if="limitIdentity">限制身份</el-radio>
            <el-radio label="-1" flag="!flag" v-if="noLimitIdentity">不限制身份</el-radio>
          </el-radio-group>
        </el-form-item>
        <div style="height:50px;" id="adds">
          <img src="../../images/add.png" alt="" style="width: 50px;height: 50px;cursor: pointer;float: left;margin-top: -9px;" @click="add()" v-if="ruleForm.identity==='0'">
          <span style="float: left;margin-left:10px;" v-if="ruleForm.identity==='0'">添加领取条件</span>
        </div>
        <Receive :options="options" :itemData="itemData" :addoptions="addoptions" :addoptionsDel="addoptionsDel" v-on:totals="setTotal"></Receive>
      </div>
      <div id="bottom">
        <el-form-item label="简介信息:">
          <textarea class="test-area" v-model="ruleForm.description"></textarea>
        </el-form-item>
        <el-form-item label="发放总积分" prop="name" v-if="addoptions.pointType !== 0">
          <div style="margin-left:60px;">{{addoptions.conditions | pointTotal}}
            <span style="margin-left: 5px;">积分</span>
          </div>
        </el-form-item>
          <el-form-item label="发放总医币" prop="name" v-if="addoptions.pointType == 0">
          <div style="margin-left:60px;">{{addoptions.conditions | pointTotal}}
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
      <el-button type="info" style="width:150px;float: left;" @click="createinvite" v-if="!id">保存</el-button>
      <el-button type="info" style="width:150px;float: left;" @click="inviteUpdate" v-if="id">保存</el-button>
      <el-button type="info" style="width:150px;float: left;" @click="release" v-if="!id">发布</el-button>
      <el-button type="info" style="width:150px;float: left;" @click="releases" v-if="id">发布</el-button>
      <el-dialog title="提示" :visible.sync="dialogVisible" width="400px">
        <span>该时间段内已有此类型任务，请更换任务周期!</span>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary">是</el-button>
          <el-button @click="dialogVisible = false">否</el-button>
        </span>
      </el-dialog>
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
      points: [{
          value: 1,
          label: '平台积分'
        },
        {
          value: 0,
          label: '医百医币'
        }],
      itemData: [
        {
          label: '邀请者身份',
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
          label: '受邀者身份',
          placeholder: '请选择'
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
      headerTitle: '邀请注册任务列表-->创建任务',
      headerTitles: '邀请注册任务列表-->编辑任务',
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
    }
  }
}
</script>

<style scoped>
#infor-content {
  float: left;
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

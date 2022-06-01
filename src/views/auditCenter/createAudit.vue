<template>
  <div class="createAudit">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <div class="audit">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="135px" class="demo-ruleForm" style="border: 1px solid #ccc">
        <div class="audit_top">
          <el-form-item label="标题名称:" prop="name">
            <el-input :disabled="isEdit || auditCheck" :maxlength="100" v-model="ruleForm.title" placeholder="请输入标题名称，最多可输入100字" style="width: 240px;"></el-input>
          </el-form-item>
        </div>
        <div class="box">
          <el-form-item label="关联审核对象:" prop="name" class="bigbox"></el-form-item>
          <relationAudit :isEdit="isEdit" :isCheck="auditCheck" :distributeType="distributeType" @auditInfo="getData" :auditDetails="auditDetails" :auditId="auditTaskId"></relationAudit>
        </div>
      </el-form>
        <el-button v-show="!auditCheck && !isEdit" type="primary" class="saves" @click="save(0)">保存</el-button>
        <el-button v-show="!auditCheck" type="primary" class="saves" @click="save(1)">发布</el-button>
        <el-button v-show="!auditCheck" class="cance" @click="cance">取消</el-button>
        <el-button v-show="!auditCheck" v-if="auditDetails.states === 0" type="danger" class="saves" @click="auditDelete()">删除</el-button>
        <el-button v-show="auditCheck" type="primary" class="saves" @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>

<script>
  import HeaderContent from '@/components/header-content'
  import relationAudit from './base/relationAudit'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  export default {
    name: "createAudit",
    components:{
      HeaderContent,
      relationAudit
    },
    data(){
      const isLengthOut = (rule, value, callback) => {
        if (!value.trim()) {
          callback(new Error(''))
        } else {
          callback()
        }
      }
      return {
        isEdit: false,
        opertions: ['返回'],
        auditCheck: this.$route.params.type ? true : false,
        auditDetails: {},
        auditTaskId: '',
        headerTitle: '审核中心-->审核列表-->创建审核任务',
        ruleForm: {
          title: ''
        },
        rules: {
          name: [{ required: true, trigger: 'blue', validator: isLengthOut }]
        },
        auditInfo: {},
        options: [{
          value: '8',
          label: '病例征集'
        }],
        service: '',
        distributeType: 0
      }
    },
    created() {
      this.getInfo()
    },
    methods: {
      headerClick() {
        this.$router.push({path: '/audit/auditList'})
      },
      getData(val) {
        this.auditInfo = val
      },
      /*
      * 删除审核任务
      * */
      auditDelete() {
        http.get(api.audittaskdelete + this.$route.params.id).then(res => {
          if (res.data.code === 0) {
            this.successMessage('删除成功')
            this.$router.back()
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      /*
      * 获取详情信息
      * */
      getInfo() {
        http.get(api.audittaskDetails + this.$route.params.id).then(res => {
          if (res.data.code === 0) {
            let data = res.data.data
            // this.headerTitle = '审核中心-->审核列表-->编辑审核任务'
            if (data.states > 0) {
              this.isEdit = true
              this.headerTitle = '审核中心-->审核列表-->编辑审核任务'
            }
            this.ruleForm.title = data.name
            this.auditDetails = data
            this.auditInfo = data
            this.distributeType = data.distributeType
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      cance() {
        this.$confirm('确认取消吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          http.get(api.audittaskcancel + this.$route.params.id).then(res => {
            if (res.data.code === 0) {
              this.successMessage('取消成功')
              this.$router.push({path: '/audit/auditList'})
            } else {
              this.errorMessage(res.data.message)
            }
          })
        }).catch(() => {
        })
      },
      save(states) {
        if (!this.ruleForm.title || this.ruleForm.title === '') {
          this.errorMessage('请填写标题名称')
          return false
        }
        if (!this.auditInfo.busId) {
          this.errorMessage('请选择业务内容')
          return false
        }
        if (!this.auditInfo.rank) {
          this.errorMessage("请选择审核级别")
          return false
        }
        if (states === 0) {
          this.audittasksave(states)
        } else {
          this.$confirm('确认发布吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.audittasksave(states)
          })
        }
      },
      audittasksave(states) {
        let params = {
          id: this.$route.params.id,
          name: this.ruleForm.title,
          businessId: 8,
          ...this.auditInfo,
          states: states, // 0保存,1发布
        }
        http.post(api.audittasksave, params).then(res => {
          if (res.data.code === 0) {
            if (states === 0) {
              console.log(this.isEdit);
              if (this.isEdit) {
                this.successMessage('编辑成功')
              } else {
                this.successMessage('创建成功')
              }
              this.$router.push({path: '/audit/auditList'})
            } else {
              this.successMessage('发布成功')
              this.$router.push({path: '/audit/auditList'})
            }
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      /*
      * 错误消息提示
      * */
      errorMessage(val) {
        this.$message({
          showClose: true,
          message: val,
          type: 'error'
        })
      },
      /*
      * 成功消息提示
      * */
      successMessage(val) {
        this.$message({
          showClose: true,
          message: val,
          type: 'success'
        })
      },
      Release() {},
    }
  }
</script>

<style scoped>
.audit_top{
  height: 80px;
  padding: 20px 0;
  border-bottom: 1px solid #eeeeee;
}
.box{
  padding: 20px 20px 0 0;
}
.cance {
  height: 38px;
  width: 150px;
  background: #cccccc;
  font-size: 14px;
  border: 1px solid #e5e5e5;
  color: #ffffff;
  margin: 20px;
}
.saves{
  width: 150px;
  margin: 20px;
}
</style>

<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="合约发送时间">
        <el-date-picker clearable type="date" placeholder="选择开始时间" format="yyyy-MM-dd"  v-model="formInline.sendStartTime" @change="startTimes" >
        </el-date-picker>
        <span>-</span>
        <el-date-picker clearable type="date" placeholder="选择结束时间" format="yyyy-MM-dd"  v-model="formInline.sendEndTime" @change="endTimes">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="签约名称">
        <el-input clearable v-model="formInline.contractName" placeholder="请输入签约名称"></el-input>
      </el-form-item>
      <el-form-item label="创建者">
        <el-input clearable v-model="formInline.createBy" placeholder="请输入创建者"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input clearable v-model="formInline.mark" placeholder="请输入备注"></el-input>
      </el-form-item>
      <el-form-item label="合约编号">
        <el-input clearable v-model="formInline.contractId" placeholder="请输合约编号"></el-input>
        <!--        <el-select v-model="formInline.contractId" placeholder="请选择合约编号">-->
<!--          <el-option v-for="(item,index) in statusList" :key="index" :label="item.code" :value="item.code"></el-option>-->
<!--        </el-select>-->
      </el-form-item>
      <el-form-item style="">
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
<!--      <el-form-item style="">-->
<!--        <el-button type="info" size="small" @click="numManage">编号管理</el-button>-->
<!--      </el-form-item>-->
      <el-form-item>
        <el-select style="width: 120px" v-model="singStatus" placeholder="请选择">
          <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="">
        <el-button type="info" size="small" @click="exportSing">导出</el-button>
      </el-form-item>

    </el-form>
    <el-table
      :data="tableDatas"
      ref="multipleTable"
      tooltip-effect="dark"
      @selection-change="handleSelectionChange"
      border
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column label="合约名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.contractName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约编号" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.contractId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合约发送时间" width="280px">
        <template slot-scope="scope">
          <span>
            {{ scope.row.updateTime | formatDates }}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="总签收">
        <template slot-scope="scope">
          <span>{{ scope.row.signCount.signTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已签收">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.signCount.signYes }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未签收">
        <template slot-scope="scope">
          <span style="color: rgb(204,0,153)">{{ scope.row.signCount.signNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建者">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用/停用">
        <template slot-scope="scope">
          <span>{{ scope.row.stop | getState}}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          <span>{{ scope.row.mark ? scope.row.mark : "——" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="430">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="godetail(scope.row.templateId, scope.row.id, scope.row.contractType)">查看</el-button>
          <el-button type="info" size="small" @click="endcase(scope.row.id, scope.row.contractId)">修改编号</el-button>
          <el-button v-if="scope.row.stop" type="info" size="small" @click="forbidden(scope.row.id,0)">启用</el-button>
          <el-button v-if="!scope.row.stop" type="danger" size="small" @click="forbidden(scope.row.id,1)">停用</el-button>
          <el-button type="info" size="small" @click="goBlackList(scope.row.id)">黑名单</el-button>
          <el-button v-show="scope.row.isCredentials" type="info" size="small" @click="photoExport(scope.row.id)">导出证件信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
    <!--创建编号-->
    <contract-create-num v-if="createCodeShow" :table-num-datas="tableNumData" @change="createChange" />
    <!--修改合同编号-->
    <contract-update-code v-if="updateCodeShow" :code="listRowCode" :id="endId" :code-list="tableNumData" @change="updateChange" />
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import HeaderContent from '@/components/header-content'
  import ContractCreateNum from './components/ContractCreateNum'
  import ContractUpdateCode from './components/ContractUpdateCode'
  export default {
    name: "findExamManageLis",
    components: {
      HeaderContent,
      ContractCreateNum,
      ContractUpdateCode
    },
    filters:{
      getState(v) {
        switch (v) {
          case 0:
            return '启用中'
          case 1:
            return '停用中'
        }
      },
      formatDate(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd')
      },
      gethasTask(v) {
        switch (v) {
          case 0:
            return '否'
          case 1:
            return '是'
        }
      },
      formatDates(time) {
        var date = new Date(time)
        return formatDate(date,'yyyy-MM-dd hh:mm')
      },
    },
    data() {
      return {
        singStatus: 0,
        createCodeShow: false,
        updateCodeShow: false,
        listRowCode: '',
        tableNumData: [],
        statusList: [],
        headerTitle: '线上签约管理',
        currentPage: 1,
        total: 1,
        id: '2',
        endId: 0,
        tableDatas: [],
        exportIds: [], // 需要批量导出的数据
        options: [
          {
            label: '已签约数据',
            value: 1,
          },
          {
            label: '未签约数据',
            value: 0
          }
        ],
        formInline: {
          createBy: null,
          sendStartTime: null,
          sendEndTime: null,
          contractName: null,
          contractId: null,
          mark: null
        }
      }
    },
    mounted() {
      this.findExamManageLis(this.currentPage)
      // this.getContractCodeList()
    },
    created() {
      if (this.$route.query.page) {
        let page = Number(this.$route.query.page)
        this.currentPage = page
      }
    },
    methods: {
      // 导出证件照
      async photoExport(id) {
        var res = await http.post(api.contractBlackCredentialsExport + id)
        if (res.data.code === 0) {
          this.$message.success(res.data.message)
          this.xlsUrls = res.data.data
          window.open(this.xlsUrls)
        } else {
          this.$message.error(res.data.message)
        }
      },
      goBlackList(id) {
        this.$router.push({path: "contract/blacklist/" + id});
      },
      forbidden: async function(id, stop) {
        var params = {
          id: id,
          stop: stop
        };
        var res = await http.post(api.contractForbidden, params);
        if (res.data.code === 0) {
          this.$message.success("操作成功");
          this.findExamManageLis(this.currentPage);
        } else {
          this.$message.error(res.data.message);
        }
      },
      exportSing() {
        // 批量导出
        if (this.exportIds.length < 1) {
          this.$message.error('请勾选需要导出的合约！')
          return
        }
        let ids = []
        this.exportIds.forEach(item => {
          ids.push(item.id)
        })
        let params = {
          ids: ids,
          status: this.singStatus
        }
        this.$http.post(this.$api.contractManageExport, params).then(res => {
          console.log(res);
          let {code, data} = res.data
          if (code === 0) {
            this.$message.success('导出成功，正在下载文件')
            window.location.href = data

          }
        })
      },
      handleSelectionChange(val) {
        // 勾选
        this.exportIds = val
      },
      updateChange(v) {
        // 更新合同编号回调
        this.updateCodeShow = false
        if (v) {
          this.findExamManageLis(this.currentPage)
        }
      },
      createChange(val) {
          // 添加合约编号回调  添加成功后刷新 合同编号数据
        if (val) {
          this.getContractCodeList()
        } else {
          this.createCodeShow = false
        }
      },
      numManage() {
        // 编号管理
        this.createCodeShow = true
      },
      // 获取合同编号列表
      getContractCodeList() {
        http.post(api.contractCodeList).then(res => {
          let {code, data, message} = res.data
          if (code === 0) {
            let all = {code: '全部', id: null}
            let dataList = JSON.stringify(data)
            this.tableNumData = JSON.parse(dataList)
            data.unshift(all)
            this.statusList = data
          } else {
            this.$messgae.error(message)
          }
        })
      },
      findExamManageLis: async function(pageNum) {
        if (this.formInline.beginTime > this.formInline.endTime) {
          this.$message.error("开始时间不能大于结束时间")
          return false
        }
        let params = {}
        let from = this.formInline
        params = {
          pageNum: pageNum,
          pageSize: 10,
          createUserName: from.createUserName === '' ? null : from.createUserName,
          sendStartTime: from.sendStartTime === '' ? null : from.sendStartTime,
          sendEndTime: from.sendEndTime === '' ? null : from.sendEndTime,
          contractName: from.contractName === '' ? null : from.contractName,
          contractId: from.contractId === '' ? null : from.contractId,
          mark: from.mark === '' ? null : from.mark,
          createBy: from.createBy === '' ? null : from.createBy,
        }
        const res = await http.post(api.contractManageList,params)
        if (res.data.code === 0) {
          this.tableDatas = res.data.data.list
          this.total = res.data.data.total
        } else {
          this.$message.error(res.data.message)
        }
      },
      godetail(templateId, id, contractType) {
        this.$router.push({
          path: '/activity/contractDetail/' + `${templateId}/${id}`,
          query: {
            page: this.currentPage,
            contractType: contractType // 0:点击签收；1:手写签收
          }
        })
      },
      handleCurrentChange(val) {
        this.findExamManageLis(val)
        this.currentPage = val
      },
      endcase(id, code) {
        this.endId = id
        this.listRowCode = code
        this.updateCodeShow = true
      },
      startTimes() {
        this.formInline.sendStartTime = Date.parse(this.formInline.sendStartTime)
      },
      endTimes() {
        if (this.formInline.sendEndTime.getFullYear) {
          let Year = this.formInline.sendEndTime.getFullYear()
          let Month = this.formInline.sendEndTime.getMonth() + 1
          let getDate = this.formInline.sendEndTime.getDate()
          this.formInline.sendEndTime = new Date(
            `${Year}/${Month}/${getDate} 23:59:59`
          ).getTime()
        }
      },
      onSubmit() {
        this.findExamManageLis(this.currentPage)
      }
    }
  }
</script>

<style scoped>

</style>

<template>
  <div class="identiy">
    <el-dialog title="添加审核者"  :visible.sync="isShow" v-model="isShow" :before-close="close" custom-class="activity-dialog">
      <div class="tenementBox">
        <div v-if="bNum < 2" style="margin-bottom: 20px">
          <el-input clearable :maxlength="11" style="width: 240px;margin-right: 20px" placeholder="请输入内容" v-model="searchPhone">
            <template slot="prepend">手机号</template>
          </el-input>
          <el-input :clearable="true" style="width: 240px;margin-right: 20px" placeholder="请输入内容" v-model="searchName">
            <template slot="prepend">姓名</template>
          </el-input>
          <el-button @click="distributeUser" type="info">搜索</el-button>
        </div>
        <el-table
          height="450"
          :data="tableData"
          border
          tooltip-effect="dark"
          style="width: 100%"
          >
          <el-table-column
            label="姓名"
            width="120">
            <template slot-scope="scope">{{ scope.row.nickname }}</template>
          </el-table-column>
          <el-table-column
            label="性别"
            width="120">
            <template slot-scope="scope">{{ scope.row.sex === 'man' ? '男' : '女' }}</template>
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="roleName"
            label="身份"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <!--创建身份-->
              <div v-if="bNum === 1">
                <el-button
                  width="100"
                  disabled
                  v-if="scope.row.rank && scope.row.rank !== num"
                  size="mini"
                  @click="saveidentify(scope.row.userId)">{{scope.row.rank}}级审核者</el-button>
                <el-button
                  width="100"
                  v-if="!scope.row.select && scope.row.rank !== num"
                  size="mini"
                  :loading="loading"
                  @click="saveidentify(scope.row.userId)">添加</el-button>
                <el-button
                  v-if="scope.row.select && scope.row.rank === num && scope.row.deleteable"
                  size="mini"
                  type="danger"
                  :loading="loading"
                  @click="handleDelete(scope.row.id)">取消添加</el-button>
              </div>
              <!--二级关联一级-->
              <div v-if="bNum === 2">
                <el-button
                  width="100"
                  v-if="!scope.row.select"
                  size="mini"
                  :loading="loading"
                  @click="saveidentify_2ji(scope.row.id)">关联</el-button>
                <el-button
                  v-if="scope.row.select && bNum < 2 && scope.row.deleteable"
                  size="mini"
                  type="danger"
                  :loading="loading"
                  @click="deletecondition(scope.row.id)">取消关联</el-button>
                <el-button
                  v-if="scope.row.select && bNum > 1 && scope.row.deleteable"
                  size="mini"
                  type="danger"
                  :loading="loading"
                  @click="deletecondition(scope.row.relateId)">取消关联</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

      </div>
      <div style="margin: 20px;"></div>
      <div>
        <el-pagination
          background
          @current-change="currentChange"
          :page-size="50"
          layout="total, prev, pager, next"
          :total="total">
        </el-pagination>
      </div>
      <div style="margin: 20px;"></div>
      <div class="btns">
        <el-button type="primary" style="width:100px;" @click="save">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import userapi from '@/api/tenantInfoSave'
  import api from '@/api/tenantInfoSave'
  import { mapGetters } from 'vuex'
  import HeaderContent from '@/components/header-content'
  import {Navbar} from "../../layout";

  export default {
    name: 'identity',
    components: {
    },
    props: {
      distributeType: {
        // 审核地域分配方式<0省份，1城市>
        type: Number,
        default: 0
      },
      // auditId: {
      //   type: String,
      //   default: ''
      // },
      regionId: {
        type: String,
        default: '0'
      },
      isShow: {
        type: Boolean,
        default: false
      },
      num: {
        type: Number
      },
      bNum: {
        type: Number,
        default: 1
      }
    },
    computed: {
      ...mapGetters([
        'userAuths',
        'plattitle'
      ])
    },
    watch: {
      // auditId() {
      //   this.distributeUser()
      // }
    },
    data() {
      return {
        loading: false,
        searchPhone: '',
        searchName: '',
        pageNum: 1,
        total: 10,
        tableData: [],
        dialogVisible: false,
        idArr: [],
        checkArr: [],
        checkArr1: [],
        checkArr2: [],
        trees: [],
        checked: null,
        id: '',
        datas: {},
        isDisabled: false,
        data2: [
          {
            id: '',
            recommend: 1,
            name: this.plattitle,
            company: true,
            disabled: false,
            order: 1,
            isdelete: 0,
            childRole: []
          }]
      }
    },
    mounted() {
      switch (this.bNum) {
        case 1:
          this.distributeUser()
          break
        case 2:
          this.getSuperlist()
          break
        case 3:
          this.getSuperlist()
          break
      }
      // this.distributeUser()
      // this.getIdentityTree()
      // this.auditidentify()
    },
    methods: {
      currentChange(val) {
        this.pageNum = val
        this.distributeUser()
      },
      distributeUser: async function() {
        let params = {
          pageSize: 50,
          pageNum: this.pageNum,
          params: {
            auditTaskId: this.$route.params.id,
            phone: this.searchPhone,
            nickname: this.searchName
          }
        }
        const res = await http.post(api.distributeUser, params)
        if (res.data.code === 0) {
          this.loading = false
          this.total = res.data.data.total
          this.tableData = res.data.data.data
        } else {
          this.loading = false
          this.$message.error(res.data.message)
        }
      },
      getSuperlist() {
        http.get(api.getSuperlist + this.$route.params.id + '/' + this.num + '/' + this.regionId).then(res => {
          if (res.data.code === 0) {
            this.loading = false
            this.tableData = res.data.data
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      disabledFn(data,node) {
        if (this.num == 1) {
          if (node.checked == true) {
            return true
          } else {
            return false
          }
        }
      },
      close() {
        this.$emit('isShows',this.num) //  关闭身份弹框
      },
      /*
      * 删除关联关系
      * */
      deletecondition(id) {
        http.get(api.deletecondition + this.$route.params.id + '/' + this.regionId + '/' + this.num + '/' + id + '/' + this.distributeType).then(res => {
          if (res.data.code === 0) {
            this.getSuperlist()
          } else {
            this.errorMessage(res.data.message)
          }
        })
      },
      /*
      * 取消添加审核人
      * */
      handleDelete(id) {
        this.loading = true
        http.get(api.deleteIdentify + this.$route.params.id + '/' + this.num + '/' + id + '/' + this.distributeType).then(res => {
          if (res.data.code === 0) {
            switch (this.bNum) {
              case 1:
                this.distributeUser()
                break
              case 2:
                this.getSuperlist()
              case 3:
                this.getSuperlist()
            }
          } else {
            this.loading = false
            this.errorMessage(res.data.message)
          }
        })
      },
      saveidentify_2ji(id) {
        let parmas = {
          auditTaskId: this.$route.params.id,
          conditionId: this.regionId,
          rank: this.num,
          relateConditionIds: [id],
          distributeType: this.distributeType
        }
        http.post(api.relationSave, parmas).then(res => {
          if (res.data.code === 0) {
            this.getSuperlist()
          } else {
            this.loading = false
            this.errorMessage(res.data.message)
          }
        })
      },
      saveidentify(userId) {
        this.loading = true
        let params = {
          auditTaskId: this.$route.params.id,
          rank: this.num,
          userId: userId,
          distributeType: this.distributeType
        }
        http.post(api.saveidentify, params).then(res => {
          if (res.data.code === 0) {
            this.distributeUser()
          } else {
            this.loading = false
            this.errorMessage(res.data.message)
          }
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
      save() {
        this.$emit('isShows',this.num) //  关闭身份弹框
      },
      cancel() {
        this.$emit('isShows',this.num) //  关闭身份弹框
      }
    }
  }
</script>
<style scoped>
  .Box_title{
    height: 50px;
    width: 100%;
    background: #199ED8;
    line-height: 50px;
  }
  .Box_title span{
    height: 100%;
  }
  .btns{
    width: 110px;
    line-height: 36px;
    height: 50px;
    margin: 0 auto;
  }
  .close{
    float: right;
    cursor: pointer;
    color:#000;
    width: 30px;
    height: 30px;
    font-size: 40px;
  }

</style>

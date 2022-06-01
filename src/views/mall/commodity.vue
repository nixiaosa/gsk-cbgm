<template>
  <div class="commodity">
    <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
    <Headers :itemDatas="itemDatas" :options="options" :form="form" :option="option"></Headers>
     <el-button type="primary" class="btnsl" @click="Inquire">查询</el-button>
     <div style="margin: 20px;"></div>
     <el-table
      :data="tableDatas"
      border
     >
      <el-table-column label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.skuId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片">
        <template slot-scope="scope">
          <span>
            <img :src="scope.row.goodsImgCover" alt="" width="130" height="130">
          </span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称">
       <template slot-scope="scope">
         <span>{{ scope.row.goodsName }}</span>
       </template>
      </el-table-column>
       <el-table-column label="商品品类">
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCategoryName }}</span>
        </template>
      </el-table-column>
       <el-table-column label="所需积分">
       <template slot-scope="scope">
         <span>{{ scope.row.integral }}</span>
       </template>
      </el-table-column>
       <el-table-column label="库存数量">
       <template slot-scope="scope">
         <span>{{ scope.row.stockNum }}</span>
       </template>
      </el-table-column>
       <el-table-column label="状态">
       <template slot-scope="scope">
         <span>{{ scope.row.status | status}}</span>
       </template>
      </el-table-column>
       <el-table-column label="操作者">
       <template slot-scope="scope">
         <span>{{ scope.row.createdBy }}</span>
       </template>
      </el-table-column>
       <el-table-column label="添加时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
       <el-table-column label="操作" width="260">
        <template slot-scope="scope">
          <el-button type="info" size="small" @click="godetail(scope.row.id)">查看</el-button>
          <el-button type="info" size="small" @click="update(scope.row.id)">编辑</el-button>
          <el-button type="warning" size="small" @click="Lower(scope.row.id)" v-if="scope.row.status == 1">下架</el-button>
          <el-button type="info" size="small" @click="Upper(scope.row.id)" v-if="scope.row.status == 0 || scope.row.status == 2">上架</el-button>
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
  </div>
</template>
<script>
  import HeaderContent from '@/components/header-content'
  import Headers from './base/header1'
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  export default {
    name: "commodity",
    components:{
       HeaderContent,
       Headers
    },
    data() {
      return {
        headerTitle: '商品管理',
        opertions: ['添加商品'],
        isdisabled: true,
        type: 0,
        types:1,
        form: {
          goodsName: null,
          startTime: null,
          endTime: null,
          goodsCategoryId: null,
          status: null
        },
        tableDatas: [],
        currentPage: 1,
        total: 1,
        itemDatas: [
          {
            label: '商品品类:',
            placeholder: '请选择'
          },
          {
            label: '商品名称:',
            placeholder: '请输入商品名称'
          },
          {
            label: '商品状态:',
            placeholder: '请输入游戏名称'
          },
          {
            label: '添加时间:'
          }
        ],
        option: [],
        options: [
          {
            label: '全部'
          },
          {
            status: 0,
            label: '未上架'
          },
          {
            status: 1,
            label: '已上架'
          },
          {
            status: 2,
            label: '已下架'
          },
        ]
      }
    },
    filters:{
      formatDate(time) {
      time = Number(time)
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
      },
      status(v) {
        switch (v) {
          case 0:
            return '未上架'
          case 1:
            return '已上架'
          case 2:
            return '已下架'
        }
      }
    },
    mounted() {
      this.commodity(this.currentPage)
      this.categoryList()
    },
    created() {
    if (this.$route.query.page) {
      let page = Number(this.$route.query.page)
      this.currentPage = page
    } else {
      this.currentPage = this.currentPage
    }
  },
    methods:{
      headerClick() {
        this.$router.push({
          path: '/mall/commoditydetail',
          query: {
            page: this.currentPage
          }
        })
      },
      categoryList: async function() { // 获取商品品类列表
        var params1 = {
          pageNum: 1,
          pageSize: 1000,
          params: {
            isDeleted: 0
          }
        }
        var res = await http.post(api.categoryList,params1)
        if (res.data.code === 0) {
           res.data.data.list.unshift({
          categoryName: "全部"
        })
          this.option = res.data.data.list
        } else {
          this.$message.error(res.data.message)
        }
    },
      commodity:async function (page) {
        if (this.form.startTime > this.form.endTime) {
          this.$message.error("结束时间不能小于开始束时间")
          return false
        }
        let params = {}
        if (this.form.goodsName === null && this.form.startTime === null &&
          this.form.endTime === null && this.form.goodsCategoryId === null
          && this.form.status === null) {
          params = {
            pageSize: 10,
            pageNum: page,
          }
        } else {
          this.form.goodsCategoryId === '' ? this.form.goodsCategoryId = null : this.form.goodsCategoryId
          this.form.goodsName === '' ? this.form.goodsName = null : this.form.goodsName
          params = {
            pageSize: 10,
            pageNum: page,
            params: this.form
          }
        }
       await http.post(api.commodityList,params).then(res => {
          if (res.data.code === 0) {
            this.tableDatas = res.data.data.list
            this.total = res.data.data.total
          }
        })
        .catch(err =>  {
          this.$message.error(err.data.message)
        })
      },
      godetail(id) {
        this.$router.push({
         path: '/mall/commoditydetail',
         query:{
           id: id,
           type: this.type,
           page: this.currentPage
         }
        })
      },
      Lower: async function(id) {
        var params = {
          id: id,
          status: 2
        }
        http.post(api.commodityupdate,params).then(res => {
          this.commodity(this.currentPage)
        })
          .catch(err => {
            this.$message.error(err.data.message)
          })
      },
      Upper: async function(id) {
           var params = {
          id: id,
          status: 1
        }
        http.post(api.commodityupdate,params).then(res => {
          this.commodity(this.currentPage)
        })
          .catch(err => {
            this.$message.error(err.data.message)
          })
      },
      update(id) {
         this.$router.push({
         path: '/mall/commoditydetail',
         query:{
           id: id,
           type: this.types,
           page: this.currentPage
         }
        })
      },
      Inquire() {
        this.commodity(this.currentPage)
      },
      handleCurrentChange(val) {
        this.currentPage = val
        this.commodity(val)
      }
    }
  }
</script>
<style scoped>
    .commodity {
        position: relative;
    }
.btnsl {
  width: 130px;
  position: absolute;
  top: 140px;
  left: 520px;
}
</style>



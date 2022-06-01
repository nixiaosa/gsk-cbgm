<template>
    <div id="list">
        <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
        <ul class="wraper">
            <li v-if="pointType !== 0">
                <span>发放总积分</span>
                <span class="total">{{ pointTotal }}积分</span>
            </li>
            <li v-if="pointType == 0">
                <span>发放总医币</span>
                <span class="total">{{ pointTotal }}医币</span>
            </li>
            <li v-if="pointType !== 0">
                <span>领取总积分</span>
                <span class="total">{{pointOut}}积分</span>
            </li>
            <li v-if="pointType == 0">
                <span>领取总医币</span>
                <span class="total">{{pointOut}}医币</span>
            </li>
            <li>
                <span>发放总份数</span>
                <span class="total">{{numMax}}份</span>
            </li>
            <li>
                <span>领取总份数</span>
                <span class="total">{{numOut}}份</span>
            </li>
        </ul>
        <div style="width: 100%;height: 20px"></div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="积分领取统计" name="list">
                <search-form v-if="activeName==='list'" :loading="searchLoading" :name="event + 'Task'" @change="searchChange"/>
                <table-list :name="event + 'Task'" :data="tableData"/>
            </el-tab-pane>
            <el-tab-pane label="积分领取总排行" name="statistics" v-if="taskType !== 'lookcms'">
                <search-form v-if="activeName==='statistics'" :loading="searchLoading" :name="event + 'Task'" @change="searchChange"/>
                <el-tag effect="plain" style="margin-bottom: 10px">总人数：{{userTotal}}人</el-tag>
                <table-list :name="event + 'TaskStatistics'" :data="taskLogStatisticsList"/>
            </el-tab-pane>
        </el-tabs>
        <div style="margin: 20px"></div>
        <!--        分页器-->
        <pagination :pageNum="page.pageNum" :total="total" @change="paginationChange"/>
        <div>
            <el-dialog
                    title="提示"
                    :before-close="exportOff"
                    :visible.sync="dialogVisible">
                <span>是否导出数据？</span>
                <span slot="footer" class="dialog-footer">
                  <el-button type="primary" :loading="isLoading" @click="downLoadData">是</el-button>
                  <el-button @click="exportOff">否</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import HeaderContent from '@/components/header-content'
    import TableList from "../../../components/table-content/TableList";
    import Pagination from "../../../components/pagination/Pagination";
    import SearchForm from "../../../components/search/SearchForm";
    import http from '@/utils/tenant'
    import {formatDate} from '@/common/data'

    export default {
        components: {
            HeaderContent,
            TableList,
            Pagination,
            SearchForm
        },
        filters: {
            userSex(val) {
                switch (val) {
                    case 'man':
                        return '男'
                    case 'woman':
                        return '女'
                    default:
                        return val
                }
            },
            formatDate(time) {
                time = Number(time)
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            }
        },
        name: "receive",
        data() {
            return {
                searchLoading: false,
                exportName: '导出领取结果',
                page: {
                    pageNum: 1,
                    pageSize: 10
                },
                searchForm: {
                    nickName: null,
                    phone: null
                },
                list: {
                    api: {
                        export: this.$api.taskLogExport
                    }
                },
                statistics: {
                    api: {
                        export: this.$api.taskStatisticsExport
                    }
                },
                userTotal: 0,
                activeName: 'list',
                event: this.$route.meta.event,
                isLoading: false,
                taskType: this.$route.params.type,
                total: 0,
                tableData: [],
                taskLogStatisticsList: [],
                opertions: ['返回'],
                pointType: null,
                headerTitle: '任务领取详情',
                taskId: this.$route.params.id,
                pointTotal: '', // 发放总积分
                pointOut: '', // 领取总积分
                numOut: '', // 领取总份数
                numMax: '', // 发放总份数
                dialogVisible: false, // 确认导出数据弹窗是否显示
            }
        },
        created() {
          if (this.$route.params.type === 'lookcms') {
            this.$route.meta.event = 'lookcms'
            this.event = 'lookcms'
          }
        },
        mounted() {
            // question 答题奖励任务
            // competition 答题竞赛任务
            this.lookReceive()
            this.lookdetails(this.taskId)
        },
        methods: {
            exportOff() {
                // 导出取消
                this.dialogVisible = false
                this.searchLoading = false
            },
            searchChange(item) {
                // 搜索
                if (item.prop === 'EXPORT') {
                    this.dialogVisible = true
                } else if (item.prop === 'SEARCH') {
                    this.searchForm = {
                        phone: item.phone,
                        nickname: item.name
                    }
                    switch (this.activeName) {
                        case "list":
                            this.lookReceive()
                            break
                        case "statistics":
                            this.getTaskLogStatistics()
                            break
                    }
                }
                this.searchLoading = true
            },
            paginationChange(item) {
                // 分页器触发
                this.page = item
                this.lookReceive()
            },
            handleClick() {
                // tab切换
                // 初始化分页器
                this.page = {
                    pageNum: 1,
                    pageSize: 10
                }
                // 初始化搜索内容
                this.searchForm = {
                    nickName: null,
                    phone: null
                }
                switch (this.activeName) {
                    case "list":
                        this.lookReceive()
                        this.exportName = '导出领取结果'
                        break
                    case "statistics":
                        this.getTaskLogStatistics()
                        this.getTaskLogJoincount() // 获取总人数
                        this.exportName = '导出排行结果'
                        break
                }
            },
            headerClick() {
                if (this.event === 'question') {
                    this.$router.push({
                        path: '/taskcenter/answer',
                        query: {
                            page: this.$route.params.page
                        }
                    })
                } else {
                    this.$router.back()
                }
            },
            getTaskLogStatistics() {
                // 获取积分领取排名
                let params = {
                    ...this.page,
                    params: {
                        id: this.taskId,
                        event: this.event,
                        ...this.searchForm
                    }
                }
                this.$http.post(this.$api.taskLogStatistics, params).then(res => {
                    this.searchLoading = false
                    let {code, data, message} = res.data
                    if (code === 0) {
                        this.taskLogStatisticsList = data.list
                        this.total = res.data.data.total
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            getTaskLogJoincount() {
              // 排行榜总人数
              this.$http.get(this.$api.taskLogJoincount + this.taskId).then(res => {
                  let {code, data, message} = res.data
                  if (code === 0) {
                      this.userTotal = data
                  } else {
                      this.$message.error(message)
                  }
              })
            },
            downLoadData() {
                // 导出
                this.searchLoading = true
                this.dialogVisible = false
                let params = {
                    id: this.taskId,
                    event: this.event
                }
                http.post(this[this.activeName].api.export, params).then(res => {
                    let data = res.data
                    this.searchLoading = false
                    if (data.code === 0) {
                        this.isLoading = false
                        window.location.href = res.data.data
                    } else {
                        this.$message.error(data.message)
                        this.isLoading = false
                    }
                })
            },
            lookReceive: async function () {
                var params = {
                    ...this.page,
                    params: {
                        ...this.searchForm,
                        id: this.taskId,
                        event: this.event
                    }
                }
                this.$http.post(this.$api.taskLogList, params).then(res => {
                    this.searchLoading = false
                    let {code, data, message} = res.data
                    if (code === 0) {
                        this.tableData = data.list
                        this.total = data.total
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            lookdetails: async function (id) {
                var res = await http.get(this.$api.taskGet + id)
                if (res.data.code === 0) {
                    this.pointTotal = res.data.data.pointTotal
                    this.pointOut = res.data.data.pointOut
                    this.numOut = res.data.data.numOut
                    this.numMax = res.data.data.numMax
                    this.pointType = res.data.data.pointType
                }
            },
            handleCurrentChange(val) {
            },
        }
    }
</script>

<style scoped>
    ul, li {
        list-style: none;
    }

    #list .wraper {
        height: 120px;
        display: flex;
        flex-wrap: wrap;
        position: relative;
    }

    #list .wraper li {
        position: relative;
        width: 24%;
        border: 1px solid #ccc;
        margin: 10px 10px 0 0;
        text-align: center;
        line-height: 100px;
    }

    #list .wraper li .total {
        position: absolute;
        top: 30px;
        left: 45%;
    }

    #list #right {
        position: absolute;
        right: 30px;
        top: 300px;
    }
</style>

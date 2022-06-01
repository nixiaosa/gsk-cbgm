<template>
    <div class="winner">
        <header-content :title="headerTitle" :opertions="opertions" @header-btn-click="headerClick"></header-content>
        <div class="winner-one" v-for="(item,index) in obj" :key="index">
            <div class="winner-list">
                <span>{{  item.module }}</span>
                <span>{{ gameType }}</span>
            </div>
            <div class="winner-list">
                <span>{{ item.business }}</span>
                <span>{{ businessName }}</span>
            </div>
            <div class="winner-list">
                <span>{{  item.curriculum }}</span>
                <span>{{ courseName }}</span>
            </div>
        </div>
        <div class="winners" v-if="satisfactUserCount !==''" style="margin:20px 0;">
            <span>总人数:</span>
            <span>{{ satisfactUserCount }}</span>
        </div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="发放状态">
                <el-select v-model="formInline.status" placeholder="请选择">
                    <el-option
                            v-for="(item,index) in options"
                            :key="index"
                            :label="item.label"
                            :value="item.status"
                    >
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
            </el-form-item>
            <el-form-item label="奖品名称">
                <el-input v-model="formInline.prizeName" placeholder="请输入奖品名称"></el-input>
            </el-form-item>
            <el-button type="primary" style="float:right;" @click="submit">导出数据</el-button>
            <el-button type="primary" @click="Inquire" style="float:right;margin-right:50px;width:88px;">查询</el-button>
            <el-dialog
                    title="提示"
                    :visible.sync="dialogVisible"
                    width="400px">
                <span>是否导出数据？</span>
                <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="downLoadData">是</el-button>
          <el-button @click="dialogVisible = false">否</el-button>
        </span>
            </el-dialog>
        </el-form>
        <el-table
                :data="tableData"
                border
        >
            <el-table-column
                    width="240"
                    label="姓名">
                <template slot-scope="scope">
                    <span>{{ scope.row.userName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="110"
                    label="性别">
                <template slot-scope="scope">
                    <span>{{  scope.row.sex }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="160"
                    label="手机号">
                <template slot-scope="scope">
                    <span>{{ scope.row.phone }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="100"
                    label="省份">
                <template slot-scope="scope">
                    <span>{{ scope.row.province }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="150"
                    label="城市">
                <template slot-scope="scope">
                    <span>{{ scope.row.city }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="150"
                    label="区县">
                <template slot-scope="scope">
                    <span>{{ scope.row.country }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="200"
                    label="医院">
                <template slot-scope="scope">
                    <span>{{ scope.row.hospitalName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="150"
                    label="职称">
                <template slot-scope="scope">
                    <span>{{ scope.row.title }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="150"
                    label="科室">
                <template slot-scope="scope">
                    <span>{{ scope.row.office }}</span>
                </template>
            </el-table-column>

            <el-table-column
                    width="200"
                    label="奖品名称">
                <template slot-scope="scope">
                    <span>{{ scope.row.prizeName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="260"
                    label="中奖时间">
                <template slot-scope="scope">
                    <span>{{ scope.row.winTime | formatDate }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    v-if="gameType!=='单人抽奖'"
                    width="100"
                    label="观看时长">
                <template slot-scope="scope">
                    <span>{{ scope.row.watchTime | tomin}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="160"
                    label="发奖状态">
                <template slot-scope="scope">
                    <span>{{ scope.row.sendStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="360"
                    label="邮寄地址">
                <template slot-scope="scope">
                    <span v-if="scope.row.address">{{ scope.row.address }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="360"
                    label="收货人姓名">
                <template slot-scope="scope">
                    <span v-if="scope.row.receiverName">{{ scope.row.receiverName }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    width="360"
                    label="收货人手机号">
                <template slot-scope="scope">
                    <span v-if="scope.row.receiverPhone">{{ scope.row.receiverPhone }}</span>
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
    import http from '@/utils/tenant'
    import api from '@/api/tenantInfoSave'
    import {formatDate} from '@/common/data'

    export default {
        components: {
            HeaderContent
        },
        data() {
            return {
                gameType: '',
                xlsUrl: '',
                flag: true,
                dialogVisible: false,
                businessName: '',
                satisfactUserCount: '',
                tableData: [],
                address: '',
                courseName: '',
                total: 0,
                currentPage: 1,
                gameId: this.$route.params.gameId,
                vals: 1,
                formInline: {
                    prizeName: null,
                    phone: null,
                    status: null
                },
                options: [
                    {
                        label: '全部'
                    },
                    {
                        status: 1,
                        label: '已发放'
                    },
                    {
                        status: 0,
                        label: '未发放'
                    },
                    {
                        status: 2,
                        label: '审核未通过'
                    },
                    {
                        status: 3,
                        label: '已失效'
                    }
                ],
                id: this.$route.params.id,
                headerTitle: '抽奖活动管理--》关联业务--》中奖人列表',
                opertions: ['返回'],
                obj: [{
                    module: '模式:',
                    business: '关联业务:',
                    curriculum: '关联课程:'
                }]
            }
        },
        filters: {
            formatDate(time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            },
            // getState(state) {
            //   if (state === 0) {
            //     return '未发放'
            //   } else if (state === 1) {
            //     return '已发放'
            //   } else if (state === 2) {
            //     return '审核未通过'
            //   } else if (state === 3) {
            //     return '已发放'
            //   }
            // },
            tomin(value) {
                var theTime = parseInt(value)// 秒
                var theTime1 = 0// 分
                var theTime2 = 0// 小时
                if (theTime > 60) {
                    theTime1 = parseInt(theTime / 60)
                    theTime = parseInt(theTime % 60)
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
            }
        },
        mounted() {
            this.GPersonWin(1)
            this.GRelateBusin()
        },
        methods: {
            headerClick() {
                this.$router.go(-1)
            },
            GPersonWin: async function (page) {
                var params1 = {
                    pageSize: 10,
                    pageNum: page,
                    params: {
                        gameId: this.$route.params.gameId,
                        videoType: 0
                    }
                }
                if (this.formInline.phone !== null || this.formInline.status !== null || this.formInline.prizeName !== null) {
                    params1 = {
                        pageSize: 10,
                        pageNum: page,
                        params: {
                            gameId: this.$route.params.gameId,
                            sendStatus: this.formInline.status,
                            phone: this.formInline.phone,
                            prizeName: this.formInline.prizeName,
                            videoType: 0
                        }
                    }
                }
                let reg = /^(0|86|17951)?(13[0-9]|16[567]|15[0-9]|17[0-9]|18[0-9]|19[0-9]|14[5-9])[0-9]{8}$/
                if (this.formInline.phone && this.formInline.phone !== null) {
                    if (!reg.test(this.formInline.phone)) {
                        this.$message.error("请请填写正确的手机号码")
                        return false
                    }
                }
                var res = await http.post(api.GPersonWin, params1)
                if (res.data.code === 0) {
                    this.tableData = res.data.data.data
                    this.total = res.data.data.total
                } else {
                    this.$message.error(res.data.message)
                }
            },
            submit: async function () {
                this.postXls()
                this.dialogVisible = true
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.GPersonWin(val)
                this.vals = val
            },
            downLoadData() {
                this.dialogVisible = false
                window.open(this.xlsUrl)
            },
            postXls: async function () {
                var params = {
                    pageNum: this.vals,
                    pageSize: 10,
                    params: {
                        gameId: this.$route.params.gameId,
                        videoType: 0
                    }
                }
                if (this.formInline.phone !== null || this.formInline.status !== null || this.formInline.prizeName !== null) {
                    params = {
                        pageSize: 10,
                        pageNum: this.vals,
                        params: {
                            gameId: this.$route.params.gameId,
                            sendStatus: this.formInline.status,
                            phone: this.formInline.phone,
                            prizeName: this.formInline.prizeName,
                            videoType: 0
                        }
                    }
                }
                let reg = /^(0|86|17951)?(13[0-9]|16[567]|15[0-9]|17[0-9]|18[0-9]|19[0-9]|14[5-9])[0-9]{8}$/
                if (this.formInline.phone && this.formInline.phone !== null) {
                    if (!reg.test(this.formInline.phone)) {
                        this.$message.error("请请填写正确的手机号码")
                        return false
                    }
                }
                var res = await http.post(api.GeneralexportXls, params)
                if (res.data.code === 0) {
                    this.xlsUrl = res.data.data
                } else {
                    this.$message.error(res.data.message)
                }
            },
            Inquire: async function () {
                this.GPersonWin(this.vals)
            },
            GRelateBusin: async function () {
                var res = await http.get(api.GRelateBusin + "/" + this.gameId)
                if (res.data.code === 0) {
                    this.gameType = res.data.data.gameType
                    this.businessName = res.data.data.businessName
                    this.courseName = res.data.data.courseName
                    this.courseName = res.data.data.courseName
                    if (res.data.data.satisfactUserCount) {
                        this.satisfactUserCount = res.data.data.satisfactUserCount
                    }
                } else {
                    this.$message.error(res.data.message)
                }
            }

        }
    }
</script>
<style scoped>
    .infos-block {
        display: flex;
    }

    .infos-block .infos-self {
        display: inline-block;
        width: 100px;
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: left;
        /* margin-right: 30px; */
    }

    .infos-block .infos-content {
        display: inline-block;
        padding-top: 15px;
        padding-bottom: 15px;
        text-align: left;
        margin-right: 30px;
    }

    .winner-one {
        overflow: hidden;
        padding: 20px 0;
    }

    .winner-one .winner-list:nth-child(1) {
        width: 150px;
    }

    .winner-one .winner-list:nth-child(2) {
        width: 180px;
    }

    winner-one .winner-list:nth-child(3) {
        width: 400px;
    }

    .winner-list {
        float: left;
        margin: 0 20px 0 0;
    }

    .winners {
        width: 200px;
    }

    .demo-form-inline {
        height: 55px;
        overflow: hidden;
    }
</style>



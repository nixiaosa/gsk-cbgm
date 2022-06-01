<template>
    <div class="caseMain main">
        <header-content v-show="!activeId" :title="headerTitle" :opertions="opertions"
                        @header-btn-click="headerClick"></header-content>
        <div style="height: 40px"></div>
        <div v-show="activeId">
            <div class="from_1">
                <div class="from_1_title">
                    <span style="margin-left: 20px">姓名：{{userData.name}}</span>
                </div>
            </div>
            <div class="from_1">
                <div class="from_1_title">
                    <span style="margin-left: 20px">病历名称：{{title}}</span>
                </div>
            </div>
            <div class="from_1">
                <div class="from_1_title">
                    <span style="margin-left: 20px">病历简介</span>
                </div>
                <div class="from_1_text" v-html="description">
                </div>
            </div>
        </div>
        <div class="from_1">
            <div class="from_1_title">
                <span style="margin-left: 20px">病例征集表单填写</span>
            </div>
            <div class="from_1_text" v-html="dataInfo.caseDescri">
            </div>
        </div>
        <div class="from_1">
            <div class="from_1_title">
                <span style="margin-left: 20px">请填写以下信息</span>
            </div>
            <div v-for="(item, index) in dataInfo.groupList" :key="index" class="from_1_text">
                <div class="from_2">
                    <span style="margin-left: 20px">{{item.name}}</span>
                </div>
                <div class="from_3">
                    <ul class="from_3_ul">
                        <li v-for="(xfields, index) in item.xfields" :key="index">
                            <div class="container">
                                <!--                <div>[{{xfields.fieldType | fieldNmae}}]</div>-->
                                <div style="margin-right: 20px;margin-left:10px;">{{xfields.fieldName}}：
                                </div>
                                <div>
                                    <div v-if="xfields.fieldType === 'textdescribe'" v-html="xfields.description"></div>
                                    <span v-if="xfields.fieldType !== 'file' && xfields.fieldType !== 'matrixtable' && xfields.fieldType !== 'textdescribe'&& xfields.fieldType !== 'video'">
                    {{xfields.value === '其他_other' ? xfields.otherField.value : xfields.value}}
                  </span>
                                    <div v-if="xfields.fieldType === 'file' && xfields.value">
                                        <div v-for="(fileList, index) in xfields.value.attaches" :key="index"
                                             style="margin: 0 0 6px 6px">
                                            <img
                                                    style="width:320px;height:180px"
                                                    :src="fileList.fileUrl"/>
                                        </div>
                                    </div>
                                    <div v-if="xfields.fieldType === 'video' && xfields.value">

                                        <el-button v-if="xfields.value.attaches.length > 0" @click="goVidoList(xfields.value.caseFormFillContentId)" size="mini">查看上传视频</el-button>
                                        <span v-else>暂无上传视频</span>
                                    </div>
                                    <div class="formItemBody" v-else-if="xfields.fieldType === 'matrixtable'"
                                         style="overflow-x: auto">
                                        <table class="tableCase">
                                            <thead>
                                            <td v-for="theadItem in xfields.tableElems[0]">{{theadItem.fieldName}}</td>
                                            </thead>
                                            <tbody>
                                            <template v-for="(tbodyItem, tbodyInd) in xfields.tableElems">
                                                <tr v-if="tbodyInd > 0">
                                                    <template v-for="(trItem, trInd) in tbodyItem">
                                                        <td v-if="trInd === 0">{{trItem.fieldName}}</td>
                                                        <td v-else :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                            :id="'ele_' + trItem.fieldNameEn">{{trItem.value}}
                                                        </td>
                                                    </template>
                                                </tr>
                                            </template>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <!--                关联二级-->
                            <div v-if="xfields.options" v-for="(xchildsOptions, index) in xfields.options"
                                 :key="index + 'options'" style="width: 100%">
                                <div v-if="xchildsOptions.relateField && xchildsOptions.name === xfields.value" class="container">
                                    <div v-if="xchildsOptions.relateField" style="margin-right: 20px;margin-left:10px;">
                                        {{xchildsOptions.relateField.fieldName}}：
                                    </div>
<!--                                    关联二级 选项-->
                                    <div>
                                        <div v-if="xchildsOptions.relateField.fieldType === 'textdescribe'"
                                             v-html="xchildsOptions.relateField.description"></div>
                                        <span v-if="xchildsOptions.relateField.fieldType !== 'file' && xchildsOptions.relateField.fieldType !== 'matrixtable' && xchildsOptions.relateField.fieldType !== 'textdescribe'&& xchildsOptions.relateField.fieldType !== 'video'">
                    {{xchildsOptions.relateField.value === '其他_other' ? xchildsOptions.relateField.otherField.value : xchildsOptions.relateField.value}}
                  </span>
                                        <div v-if="xchildsOptions.relateField.fieldType === 'file' && xchildsOptions.relateField.value">
                                            <div v-for="(fileList, index) in xchildsOptions.relateField.value.attaches" :key="index"
                                                 style="margin: 0 0 6px 6px">
                                                <img
                                                        style="width:320px;height:180px"
                                                        :src="fileList.fileUrl"/>
                                            </div>
                                        </div>
                                        <div v-if="xchildsOptions.relateField.fieldType === 'video' && xchildsOptions.relateField.value">

                                            <el-button v-if="xchildsOptions.relateField.value.attaches.length > 0" @click="goVidoList(xchildsOptions.relateField.value.caseFormFillContentId)" size="mini">查看上传视频</el-button>
                                            <span v-else>暂无上传视频</span>
                                        </div>
                                        <div class="formItemBody" v-else-if="xchildsOptions.relateField.fieldType === 'matrixtable'"
                                             style="overflow-x: auto">
                                            <table class="tableCase">
                                                <thead>
                                                <td v-for="theadItem in xchildsOptions.relateField.tableElems[0]">{{theadItem.fieldName}}
                                                </td>
                                                </thead>
                                                <tbody>
                                                <template v-for="(tbodyItem, tbodyInd) in xchildsOptions.relateField.tableElems">
                                                    <tr v-if="tbodyInd > 0">
                                                        <template v-for="(trItem, trInd) in tbodyItem">
                                                            <td v-if="trInd === 0">{{trItem.fieldName}}</td>
                                                            <td v-else
                                                                :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                :id="'ele_' + trItem.fieldNameEn">{{trItem.value}}
                                                            </td>
                                                        </template>
                                                    </tr>
                                                </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--二级选项-->
                            <div v-for="(xchilds, index) in xfields.xchilds" :key="index" style="width: 100%">
                                <div class="container">
                                    <!--                  <div>[{{xchilds.fieldType | fieldNmae}}]</div>-->
                                    <div style="margin-right: 20px;margin-left:10px;">
                                        {{xchilds.fieldName}}：
                                    </div>
                                    <div>
                                        <div v-if="xchilds.fieldType === 'textdescribe'"
                                             v-html="xchilds.description"></div>
                                        <span v-if="xchilds.fieldType !== 'file' && xchilds.fieldType !== 'matrixtable' && xchilds.fieldType !== 'textdescribe'&& xchilds.fieldType !== 'video'">
                    {{xchilds.value === '其他_other' ? xchilds.otherField.value : xchilds.value}}
                  </span>
                                        <div v-if="xchilds.fieldType === 'file' && xchilds.value">
                                            <div v-for="(fileList, index) in xchilds.value.attaches" :key="index"
                                                 style="margin: 0 0 6px 6px">
                                                <img
                                                        style="width:320px;height:180px"
                                                        :src="fileList.fileUrl"/>
                                            </div>
                                        </div>
                                        <div v-if="xchilds.fieldType === 'video' && xchilds.value">

                                            <el-button v-if="xchilds.value.attaches.length > 0" @click="goVidoList(xchilds.value.caseFormFillContentId)" size="mini">查看上传视频</el-button>
                                            <span v-else>暂无上传视频</span>
                                        </div>
                                        <div class="formItemBody" v-else-if="xchilds.fieldType === 'matrixtable'"
                                             style="overflow-x: auto">
                                            <table class="tableCase">
                                                <thead>
                                                <td v-for="theadItem in xchilds.tableElems[0]">{{theadItem.fieldName}}
                                                </td>
                                                </thead>
                                                <tbody>
                                                <template v-for="(tbodyItem, tbodyInd) in xchilds.tableElems">
                                                    <tr v-if="tbodyInd > 0">
                                                        <template v-for="(trItem, trInd) in tbodyItem">
                                                            <td v-if="trInd === 0">{{trItem.fieldName}}</td>
                                                            <td v-else
                                                                :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                :id="'ele_' + trItem.fieldNameEn">{{trItem.value}}
                                                            </td>
                                                        </template>
                                                    </tr>
                                                </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div v-show="pagesShow">
            <el-button @click="paging(1)">上一页</el-button>
            <span style="margin: 0 10px">{{this.pageNum}}/{{this.pages}}</span>
            <el-button @click="paging(2)">下一页</el-button>
        </div>
    </div>
</template>

<script>
    // import caseHeader from './base/caseHeader'
    import http from '@/utils/tenant'
    import api from '@/api/tenantInfoSave'
    import HeaderContent from '@/components/header-content'

    export default {
        props: {},
        data() {
            return {
                headerTitle: '病例预览',
                opertions: ['返回'],
                userData: '',
                title: '',
                dataEn: {},
                description: '',
                pageNum: 1,
                pages: 1,
                pagesShow: true,
                id: this.$route.params.id,
                activeId: this.$route.params.activeId,
                fileImg: [],
                dataInfo: {},
            }
        },
        filters: {
            fieldNmae(item) {
                switch (item) {
                    case 'text':
                        return '单行输入'
                    case 'textarea':
                        return '多行输入'
                    case 'radio':
                        return '单选题'
                    case 'checkbox':
                        return '多选题'
                    case 'file':
                        return '上传图片'
                    case 'select':
                        return '下拉选择题'
                    case 'time':
                        return '时间'
                    case 'matrixtable':
                        return '矩阵表格'
                    case 'textdescribe':
                        return '字段描述'
                }
            },
            fileList(val) {
                let list = []
                for (let item of val) {
                    list.push(item.fileUrl)
                }
                return list
            }
        },
        created: function () {
            if (this.$route.query.name) {
                document.title = this.$route.query.name + '-' + this.$route.query.title
            }
        },
        methods: {
            goVidoList(id) {
              // 查看视频文件
                let url = window.location.origin + '/#/casevideo/' + id
                if (window.location.origin.indexOf('localhost') > 0) {
                    url = 'http://shahai.test.100doc.com.cn/#/casevideo/' + id
                    window.open(url)
                }
                window.open(url)
            },
            headerClick() {
                this.$router.back()
            },
            casedetail() {
                http.get(api.casedetail + this.id).then(res => {
                    if (res.data.code === 0) {
                        this.userData = res.data.data.userData
                        this.title = res.data.data.title
                        this.description = res.data.data.description
                    }
                })
            },
            paging(type) {
                if (type === 2) {
                    if (this.pageNum === this.pages) return
                    this.pageNum++
                } else if (type === 1) {
                    if (this.pageNum === 1) return
                    this.pageNum--
                }
                if (this.$route.params.activeId) {
                    this.casePreview()
                } else {
                    this.seeCaseForm()
                }
            },
            seeCaseForm: async function () {
                const res = await http.get(api.seeCaseForm + this.id + '/' + this.pageNum)
                if (res.data.code === 0) {
                    this.dataInfo = res.data.data
                    this.pagesShow = res.data.data.pages
                    this.pages = res.data.data.pages ? res.data.data.pages : 1
                    this.dataInfo.caseDescri = this.dataInfo.caseDescri.replace(/(\r\n|\n|\r)/gm, '<br/>')
                } else {
                    this.$message.error(res.data.message)
                }
            },
            casePreview: async function () {
                const res = await http.get(api.casePreview + this.activeId + '/' + this.id + '/' + this.pageNum + '/' + 1)
                if (res.data.code === 0) {
                    this.dataInfo = res.data.data
                    this.pagesShow = res.data.data.pages
                    this.pages = res.data.data.pages ? res.data.data.pages : 1
                    this.dataInfo.caseDescri = this.dataInfo.caseDescri.replace(/(\r\n|\n|\r)/gm, '<br/>')
                } else {
                    this.$message.error(res.data.message)
                }
            }
        },
        mounted() {
            this.casedetail()
            if (this.$route.params.activeId) {
                this.casePreview()
            } else {
                this.seeCaseForm()
            }
        },
        components: {
            HeaderContent
            // caseHeader
        }
    }
</script>
<style scoped>
    .container {
        width: 100%;
    }

    .from_3_ul div {
        font-size: 14px;
        overflow: hidden;
        float: left;
    }

    .caseMain ul, li {
        list-style: none;
    }

    .from_3_ul li {
        width: 100%;
        float: left;
        margin-top: 20px;
    }

    .from_3 {
        overflow: hidden;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding-bottom: 40px;
    }

    .from_2 {
        width: 100%;
        line-height: 36px;
        background: #F7F7F7;
        font-size: 16px;
        color: #333333;
    }

    .from_1 {
        width: 100%;
        border-radius: 4px;
        background: #ffffff;
    }

    .from_1_title {
        font-size: 18px;
        color: #333333;
        line-height: 58px;
        border-bottom: 1px solid #ECECEC;
    }

    .from_1_text {
        line-height: 28px;
        font-size: 14px;
        color: #333333;
        margin-left: 20px;
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        padding: 20px;
    }

    .main {
        margin: 5px 0;
    }

    .formItemBody {
        max-width: 900px;
        overflow: scroll;
        margin-left: 26px;
        margin-top: 10px;
        position: relative;
    }

    .tableCase {
        width: 100%;
        border-collapse: collapse;
        margin: 0 auto;
        text-align: center;
        color: #333333;
        font-size: 16px
    }

    .tableCase span {
        display: inline-block;
        width: 10px;
        height: 10px;
        margin-right: 8px;
        background: url("http://yibaifiles-1252497236.file.myqcloud.com/mobile/caseActivity/mustFill.png") no-repeat;
        background-size: 100% 100%
    }

    .tableCase input {
        display: block;
        height: 100%;
        min-height: 48px;
        padding: 0 20px;
        box-sizing: border-box;
        width: 100%
    }

    .tableCase td {
        border: 1px solid #D8D8D8;
        color: #666;
        min-width: 150px
    }

    .tableCase thead td {
        padding: 15px 15px;
        background-color: rgba(21, 159, 232, 0.04)
    }

    .tableCase tbody td:first-child {
        padding: 15px 15px;
        background-color: rgba(21, 159, 232, 0.04)
    }
</style>

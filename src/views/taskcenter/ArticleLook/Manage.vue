<template>
    <div class="answerCompetitionManage">
        <header-component :title="headerTitle" :props="headerProps" @change="headerChange"/>
        <search-form :loading="searchLoading" @change="searchChange" name="AnswerCompetitionManage"/>
        <table-list :data="tabelList.data" @change="tabelListChange" name="LookcmsCompetitionManage"/>
        <pagination :pageNum="paginationData.pageNum" :total="tabelList.total" @change="paginationChange"/>
    </div>
</template>

<script>
    import HeaderComponent from "../../../components/header-content/HeaderComponent";
    import SearchForm from "../../../components/search/SearchForm";
    import TableList from "../../../components/table-content/TableList";
    import Pagination from "../../../components/pagination/Pagination";

    export default {
        name: "answerCompetitionManage",
        components: {TableList, HeaderComponent, Pagination, SearchForm},
        data() {
            return {
                headerProps: ['创建任务'],
                headerTitle: '文章浏览任务列表',
                searchLoading: false,
                paginationData: {
                    pageNum: 1,
                    pageSize: 10
                },
                tabelList: {
                    data: null,
                    total: null
                },
                searchData: null
            }
        },
        activated() {
            this.getquestionTaskList()
        },
        deactivated() {
        },
        mounted() {
            this.getquestionTaskList()
        },
        methods: {
            tabelListChange(item) {
                // 列表按钮触发
                let actionName = item.btnName.prop
                let id = item.id
                switch (actionName) {
                    case 'CHECK':
                        this.checkDetail(id)
                        break
                    case 'DETAIL':
                        this.getTaskDetail(id)
                        break
                    case 'END':
                        this.endTask(id)
                        break
                    case 'EDIT':
                        this.editTask(id)
                        break
                }

            },
            checkDetail(id) {
                this.$router.push({path: `lookcmsCompetitionCreate/${id}/CHECK`})
            },
            getTaskDetail(id) {
              // 领取详情
                this.$router.push({path: 'taskGetDetails/' + id + '/lookcms'})
            },
            editTask(id) {
                this.$router.push({path: `lookcmsCompetitionCreate/${id}/EDIT`})
            },
            endTask(id) {
              // 结束任务
                this.$http.get(this.$api.taskFinish + id).then(res => {
                    let {code, message} = res.data
                    if (code === 0) {
                        this.$message.success('结束成功')
                        this.getquestionTaskList()
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            searchChange(item) {
                this.paginationData.pageNum = 1
                console.log(item);
                this.searchData = item
                this.searchLoading = true
                this.getquestionTaskList()
            },
            getquestionTaskList() {
                let params = {
                    pageNum: this.paginationData.pageNum,
                    pageSize: this.paginationData.pageSize,
                    params: {
                        ...this.searchData,
                        event: this.$route.meta.event // 任务类型
                    }
                }
                this.$http.post(this.$api.taskList, params).then(res => {
                    this.searchLoading = false
                    let {code, data, message} = res.data
                    if (code === 0) {
                        let {list, total} = data
                        list.map(item => {
                            // 解析是否可编辑 领取详情 结束
                            item.CHECK = true
                            if (item.status === -1) {
                                item.EDIT = true
                            }
                            if (item.status !== -1) {
                                item.DETAIL = true
                            }
                            if (item.status !== -1 && item.status < 2) {
                                item.END = true
                            }
                        })
                        this.tabelList.data = list
                        this.tabelList.total = total
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            headerChange() {
                // header按钮触发
                this.$router.push({path: 'lookcmsCompetitionCreate'})
            },
            paginationChange(item) {
                // 分页器触发
                this.paginationData.pageNum = item.pageNum
                this.paginationData.pageSize = item.pageSize
                this.getquestionTaskList()
            }
        }
    }
</script>

<style scoped>

</style>

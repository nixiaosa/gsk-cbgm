<template>
    <div>
        <header-component title="互动数据" @change="headerChange" :props="headerBtn"/>
        <div class="header-box">
            <span>互动会议号：{{interact.data.id}}</span>
            <span>参会人数：{{interact.data.participants ? interact.data.participants.length : 0}}</span>
            <span>互动开始时间：{{interact.data.start_time | formatDate}}</span>
            <span>互动结束时间：{{interact.data.end_time | formatDate}}</span>
            <span>互动时长：{{interact.data.duration}}</span>
        </div>
        <div style="float: right">
            <el-button :loading="isLoading" type="info" @click="exportData">导出数据</el-button>
        </div>
        <table-list name="InteractData" :data="interact.data.participants"/>
    </div>
</template>

<script>
    import HeaderComponent from "../../../../components/header-content/HeaderComponent";
    import TableList from "../../../../components/table-content/TableList";
    import { formatDate } from '@/common/data'
    export default {
        name: "InteractData",
        components: {TableList, HeaderComponent},
        data() {
            return {
                isLoading: false,
                interact: {
                    data: {}
                },
                headerBtn: ['返回']
            }
        },
        filters: {
            formatDate(time) {
                if (!time) {
                    return ''
                }
                time = Number(time)
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            },
        },
        mounted() {
            this.get()
        },
        methods: {
            exportData() {
                this.isLoading = true
                let id = this.$route.params.id
                this.$http.get(this.$api.interact.export + id).then(res => {
                    this.isLoading = false
                    let {code, data, message} = res.data
                    if (code === 0) {
                        window.location.href = data
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            get() {
                let id = this.$route.params.id
                this.$http.get(this.$api.interact.getInteractData + id).then(res => {
                    let {code, data, message} = res.data
                    if (code === 0) {
                        data.duration = this.formatTime(data.duration)
                        data.participants.map(item => {
                            item.duration = this.formatTime(item.duration)
                        })
                        this.interact.data = data
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            formatTime(val) {
                if (val < 60) {
                    return val + '分'
                } else if (val >= 60 && val < 60 * 60) {
                    return parseInt(val / 60) + '时' + parseInt(val % 60) + '分'
                }
            },
            headerChange() {
                let path = this.$route.matched[0].redirect
                this.$router.push({path: path})
            }
        }
    }
</script>

<style scoped>
.header-box span {
    line-height: 60px;
    color: #666666;
    margin-right: 40px;
}
</style>

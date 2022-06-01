<template>
    <div class="pagination">
        <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, prev, pager, next, sizes, jumper"
                :page-sizes="[10, 20, 30, 40]"
                :current-page="pageInfo.pageNum"
                :total="total">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {
            pageNum: {
                type: Number,
                default: 1,
            },
            total: {
                type: Number,
                default: 100
            }
        },
        watch: {
            pageNum() {
                this.pageInfo.pageNum = this.pageNum
            }
        },
        data() {
            return {
                pageInfo: {
                    pageSize: 10,
                    pageNum: this.pageNum
                }
            }
        },
        methods: {
            handleCurrentChange(num) {
                // 页码发生变化时
                this.pageInfo.pageNum = num
                this.changeUp()
            },
            handleSizeChange(size) {
                // 每页数量发生变化时
                this.pageInfo.pageSize = size
                this.pageInfo.pageNum = 1
                this.changeUp()
            },
            changeUp() {
                // 通知上级
                this.$emit('change', this.pageInfo)
            }
        }
    }
</script>

<style scoped>
    .pagination {
        margin-top: 20px;
    }
</style>

<template>
    <div>
        <!-- 关联内容的对话框 -->
        <el-dialog
                title="关联内容"
                :before-close="modalClose"
                :visible.sync="visible">
            <el-table
                    ref="multipleTable"
                    :data="cmsList.list"
                    border
                    tooltip-effect="dark"
                    style="width: 100%"
                    highlight-current-row
                    @selection-change="handleSelectionChange">
                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>
                <el-table-column
                        label="名称">
                    <template slot-scope="scope">{{ scope.row.title }}</template>
                </el-table-column>
              <el-table-column
                  label="封面">
                <template slot-scope="scope"><img style="width: 120px;height: 80px;" :src="scope.row.imageUrl" alt=""></template>
              </el-table-column>
                <el-table-column
                        label="显示时间">
                    <template slot-scope="scope">
                        {{ scope.row.showTime | formatDates }}
                    </template>
                </el-table-column>
              <el-table-column
                        label="创建时间">
                    <template slot-scope="scope">
                        {{ scope.row.createtime | formatDates }}
                    </template>
                </el-table-column>
            </el-table>
            <div style="height: 20px"></div>
            <el-pagination
                    background
                    @current-change="currentChange"
                    layout="total, prev, pager, next"
                    :total="cmsList.total">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="modalClose()">取 消</el-button>
                <el-button type="primary" @click="relevanceBtn">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from '@/common/data'

    export default {
        name: "relevance",
        props: {
            visible: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
              cmsList: []
            }
        },
        filters: {
            formatDates(time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            }
        },
        created() {
          this.getCMSList(1)
        },
        methods: {
            currentChange(val) {
              this.getCMSList(val)
            },
            modalClose() {
              this.$emit('update:visible', false);
            },
            handleSelectionChange(val) {
                // 列表多选
                if (val.length > 1) {
                    this.$message.warning('当前版本只能关联一个内容')
                } else if (val.length === 1) {
                    this.$refs.multipleTable.clearSelection()
                    this.$emit('change', {relateId: val[0].id, busName: val[0].title})
                    this.modalClose()
                }
            },
            getCMSList(pageNum) {
                // 获取文章浏览竞赛关联内容
                let params = {
                    pageSize: 10,
                    pageNum: pageNum
                }
                this.$http.post(this.$api.cmsListTask, params).then(res => {
                    let {code, data, message} = res.data
                    if (code === 0) {
                        this.cmsList = data
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            relevanceBtn() {
                this.$message.warning('请选择内容')
            }
        }
    }
</script>

<style scoped>
.elTag--- {
    margin-right: 10px;
}
</style>

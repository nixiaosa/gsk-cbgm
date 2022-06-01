<template>
    <div>
        <el-form-item label="关联业务内容">
            <el-tag
                    v-for="tag in haveList"
                    :key="tag.busName"
                    :closable="!isEdit"
                    class="elTag---"
                    @close="handleClose(tag)">
                {{tag.busName}}
            </el-tag>
            <el-button :disabled="haveList.length > 0" @click="dialogVisible=true" size="small"
                       style="margin-left: 10px">选择业务内容
            </el-button>
        </el-form-item>

        <!-- 关联内容的对话框 -->
        <el-dialog
                title="关联内容"
                :visible.sync="dialogVisible">
            <el-table
                    ref="multipleTable"
                    :data="data.list"
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
                    <template slot-scope="scope">{{ scope.row.examPaperName }}</template>
                </el-table-column>
                <el-table-column
                        label="时间">
                    <template slot-scope="scope">
                        {{ scope.row.startTime | formatDates }}
                        <span v-show="scope.row.endTime">-{{ scope.row.endTime | formatDates }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="状态">
                    <template slot-scope="scope">{{ scope.row.status | getState }}</template>
                </el-table-column>
            </el-table>
            <div style="height: 20px"></div>
            <el-pagination
                    background
                    @current-change="currentChange"
                    layout="total, prev, pager, next"
                    :total="data.total">
            </el-pagination>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="relevanceBtn">确 定</el-button>
              </span>
        </el-dialog>
    </div>
</template>

<script>
    import {formatDate} from '@/common/data'

    export default {
        name: "relevanceContent",
        props: {
            data: {
                type: Object,
                default: []
            },
            haveList: {
                type: Array,
                default: () => []
            },
            isEdit: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                dialogVisible: false, // 弹框显示
            }
        },
        filters: {
            formatDates(time) {
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            },
            getState(state) {
                switch (state) {
                    case 0:
                        return '未发布'
                    case 1:
                        return '未开始'
                    case 2:
                        return '进行中'
                    case 3:
                        return '已结束'
                    case 4:
                        return '已失效'
                }
            }
        },
        methods: {
            handleClose(tag) {
                this.haveList.splice(this.haveList.indexOf(tag), 1);
                this.$refs.multipleTable.clearSelection();
            },
            handleSelectionChange(val) {
                // 列表多选
                if (val.length > 1) {
                    this.$message.warning('当前版本只能关联一个内容')
                } else if (val.length === 1) {
                    this.haveList = val.map(res => {
                        let obj = {}
                        obj.busId = res.busId
                        obj.busName = res.examPaperName
                        return obj
                    })
                    this.$emit('change', val)
                    this.dialogVisible = false
                }
            },
            currentChange(val) {
                // 分页触发
                this.$emit('change', {pageNum: val})
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

<template>
	<div>
		<div v-for="(itemOne, indexs) in firstData" :key="itemOne.formId">
			<span :class="itemOne.caseShow ? 'margin_class margin_top color_class' : 'margin_class margin_top'"
				@click="btnCase(indexs)"><span
					:class="itemOne.caseShow ? 'el-icon-arrow-down' : 'el-icon-arrow-right'"></span>{{ itemOne.formName}}</span>

			<div v-show="itemOne.caseShow">
				<div v-for="(item, index) in itemOne.auditFlowStatesList" :key="index">
					<span class="margin_class" v-if="index === 0">首次提交</span>
					<span class="margin_class" v-else>第{{ index + 1 | number }}次提交</span>
					<el-table :data="item" style="width: 100%" :label="`${index + 1}次提交`">
						<!-- <div v-for="(citem) in item " :key="citem.id"> -->
						<el-table-column label="" width="70">
							<template slot-scope="scope">
								<span>{{ scope.row.name }}</span>
							</template>
						</el-table-column>
						<el-table-column width="100" type="index" :index="indexMethod" v-if="hasTask === 1">
						</el-table-column>
						<el-table-column label="审核状态">
							<template slot-scope="scope">
								<span v-html="$options.filters.statusHtml(scope.row.approveStates)"></span>
							</template>
						</el-table-column>
						<el-table-column label="审核人">
							<template slot-scope="scope">
								<span>{{ scope.row.approveUserName }}</span>
							</template>
						</el-table-column>
						<el-table-column v-if="auditTask.isComment" label="审核人点评">
							<template slot-scope="scope">
								<span v-if="scope.row.comment" class="fn-lh">{{ scope.row.comment }}</span>
								<span v-else>一一</span>
							</template>
						</el-table-column>
						<el-table-column label="审核时间" v-if="hasTask === 1">
							<template slot-scope="scope">
								<span>{{ scope.row.approveTime | formatDate }}</span>
							</template>
						</el-table-column>
						<el-table-column v-if="auditTask.isRemark && hasTask === 1" label="审核备注">
							<template slot-scope="scope">
								<!-- <span>{{ scope.row.name }}</s	pan> -->
								<span v-if="scope.row.remark">{{ scope.row.remark }}</span>
								<span v-else>一一</span>
							</template>
						</el-table-column>
						<el-table-column label="审核评分">
							<template v-if="auditTask.isComment" slot-scope="scope">
								<span
									v-if="scope.row.starScore && auditTask.commentType === 1">{{ scope.row.starScore }}星</span>
								<span
									v-else-if="scope.row.starScore && auditTask.commentType === 0">{{ scope.row.starScore }}分</span>
								<span v-else>一一</span>
							</template>
						</el-table-column>
						<el-table-column label="拒绝原因">
							<template v-if="scope.row.approveStates" slot-scope="scope">
								<span>{{ scope.row.reason }}</span>
							</template>
						</el-table-column>
						<!-- </div> -->
					</el-table>
				</div>
				<div data-v-9e9b31aa="" class="fg-line"></div>
				<span class="margin_class"></span>
		<span v-if="professorRemark" class="margin_class">专家点评<el-button v-if="states == 1" type="info" size="small" @click="btnComment(itemOne.childFillId)">分配专家点评</el-button></span>
		<el-table  label="专家点评" :data="itemOne.professorRemarks" border>
			<el-table-column label="序号" width="70">
				<template slot-scope="scope">
					<span>{{ scope.$index + 1 }}</span>
				</template>
			</el-table-column>
			<el-table-column label="专家">
				<template slot-scope="scope">
					<span>{{ scope.row.name }}</span>
				</template>
			</el-table-column>
			<el-table-column label="科室">
				<template slot-scope="scope">
					<span>{{ scope.row.office }}</span>
				</template>
			</el-table-column>
			<el-table-column label="医院">
				<template slot-scope="scope">
					<span>{{ scope.row.hospital }}</span>
				</template>
			</el-table-column>
			<el-table-column label="专家评分">
				<template slot-scope="scope">
					<span>{{ scope.row.scoreStr }}</span>
				</template>
			</el-table-column>
			<el-table-column label="专家点评">
				<template slot-scope="scope">
					<span>{{ scope.row.content }}</span>
				</template>
			</el-table-column>
			<el-table-column label="点评时间">
				<template slot-scope="scope">
					<span>{{ scope.row.remarkTime | formatDate }}</span>
				</template>
			</el-table-column>
			<el-table-column label="职称">
				<template slot-scope="scope">
					<span>{{ scope.row.title }}</span>
				</template>
			</el-table-column>
		</el-table>
		<div data-v-9e9b31aa="" class="fg-line"></div>
			</div>
		</div>
	</div>
</template>
<script>
import { formatDate } from "@/common/data";
export default {
	props: {
		firstData: {
			type: Array,
			default: () => []
		},
		auditTask: {
			type: Object,
			default: {}
		},
		hasTask: {
			type: Number,
			default: null
		},
		professorRemark: {
			type: Number,
			default: 0
		},
		states: {
			type: Number,
			default: null
		}
	},
	data() {
		return {
			caseShow: true,
		}
	},
	created() {
		// console.log(this.firstData)
		// this.firstData.forEach((item, index) => {
		// 	index === 0 ? item.caseShow = false : item.caseShow = false
		// })
	},
	methods: {
		btnCase(indexs) {
			this.firstData[indexs].caseShow = !this.firstData[indexs].caseShow
			// this.$set(this.firstData[indexs],'caseShow',!this.firstData[indexs].caseShow)
			this.$forceUpdate()
		},
		btnComment(id) {
			this.$emit('fatherComment',id);
		},
		indexMethod(index) {
			let indexs = index + 1
        	switch (indexs) {
				case 1:
					return "一级审核";
				case 2:
					return "二级审核";
				case 3:
					return "三级审核";
				case 4:
					return "四级审核";
				case 5:
					return "五级审核";
				case 6:
					return "六级审核";
				case 7:
					return "七级审核";
				case 8:
					return "八级审核";
				case 9:
					return "九级审核";
				case 10:
					return "十级审核";
			}
      }
	},
	filters: {
		formatDate(time) {
			if (!time) {
				return '一一';
			}
			var date = new Date(time);
			return formatDate(date, "yyyy-MM-dd hh:mm");
		},
		number(item) {
			switch (item) {
				case 1:
					return "一";
				case 2:
					return "二";
				case 3:
					return "三";
				case 4:
					return "四";
				case 5:
					return "五";
				case 6:
					return "六";
				case 7:
					return "七";
				case 8:
					return "八";
				case 9:
					return "九";
				case 10:
					return "十";
			}
		},
		statusHtml(item) {
			switch (item) {
				case 0:
					return `<span style="color: rgb(252, 81, 12)">待审核</span>`;
				case 1:
					return `<span style="color: rgb(19, 139, 1)">已通过</span>`;
				case 2:
					return `<span style="color: rgb(252, 0, 6)">审核未通过</span>`;
				case 3:
					return `<span style="color: rgb(19, 139, 1)">已失效</span>`;
				case 4:
					return `<span>已撤回</span>`;
				case undefined:
					return `<span>一一</span>`;
				default:
					return `<span>${item}</span>`;
			}
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
					return '已过期'
				case -1:
					return '未发布'
			}
		},
		getRank(val) {
			switch (val) {
				case 1:
					return '一级别'
				case 2:
					return '二级别'
				case 3:
					return '三级别'
				case 4:
					return '四级别'
				case 5:
					return '五级别'
			}
		}
	},
}
</script>
<style  rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);
$c-theme2:var(--reset2);
$c-theme3:var(--reset3);

.margin_class {
	display: block;
	margin: 20px 0;

}

.margin_top {
	border-top: 2px solid #F5F5F5;
	// border-left: 1px solid #ccc;
	padding-top: 20px;
}

.color_class {
	color: $c-theme;
}
.fg-line {
    clear: both;
    height: 10px;
    background: #F5F5F5;
}
</style>
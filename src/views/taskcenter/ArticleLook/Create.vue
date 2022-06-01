<template>
    <div class="answerCompetitionCreate">
        <header-component :title="headerTitle" :props="headerProps" @change="headerChange"/>
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="活动类型">
                <span>文章浏览</span>
            </el-form-item>

            <el-form-item label="任务名称" prop="title">
                <el-input :disabled="isCheck" maxlength="20" show-word-limit v-model="form.title"
                          placeholder="请输入内容最多可输入20字"
                          class="inputW"></el-input>
            </el-form-item>

            <el-form-item label="任务周期:">
                <el-date-picker
                        class="dataW"
                        :disabled="isCheck"
                        placeholder="请选择任务周期"
                        @change="timeChange"
                        v-model="timeScope"
                        type="daterange"
                        align="right"
                        unlink-panels
                        value-format="timestamp"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="发放积分类型">
                <span>平台积分</span>
            </el-form-item>

            <!--            选择业务内容-->
            <el-form-item label="关联业务内容">
              <el-tag
                  v-for="tag in form.businesses"
                  :key="tag.relateId"
                  :closable="!isCheck"
                  class="elTag---"
                  @close="handleClose(tag)">
                {{tag.busName}}
              </el-tag>
              <el-button :disabled="form.businesses.length > 0" @click="relevanceDialogVisible=true" size="small"
                         style="margin-left: 10px">选择业务内容
              </el-button>
            </el-form-item>
            <relevance :visible.sync="relevanceDialogVisible" @change="changeRelevance"/>

          <el-form-item label="任务领取条件">
            <div class="module_content_box">
              <li>
                <span>浏览时长</span>
                <el-select v-model="form.conditions[0].pro.browseTime" :disabled="isCheck" class="module_content_box_num_ipt">
                  <el-option
                      v-for="item in browseTimeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                  </el-option>
                </el-select>
              </li>
              <li>
                <span>积分份数</span>
                <el-input-number :disabled="isCheck" v-model="form.conditions[0].numMax" :min="1" class="module_content_box_num_ipt"></el-input-number>
                <span>份</span>
              </li>
              <li>
                <span>每人领取</span>
                <el-input-number :disabled="isCheck" v-model="form.conditions[0].pointEvery" :min="1" class="module_content_box_num_ipt"></el-input-number>
                <span>积分</span>
              </li>
              <li>
                <span>发放总积分：{{form.conditions[0].numMax*form.conditions[0].pointEvery}}</span>
              </li>
            </div>
          </el-form-item>


            <el-form-item label="信息简介">
                <el-input
                        :disabled="isCheck"
                        class="inputW5"
                        type="textarea"
                        rows="5"
                        placeholder="请输入简介"
                        v-model="form.description"
                        maxlength="500"
                        show-word-limit
                >
                </el-input>
            </el-form-item>

            <el-form-item label="活动状态">
                <span class="isCheck">{{form.status | status}}</span>
            </el-form-item>

            <el-form-item v-show="!isCheck">
                <el-button type="info" @click="onSubmit(-1)">保存</el-button>
                <el-button type="info" @click="onSubmit(0)">发布</el-button>
                <el-button @click="back">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import HeaderComponent from "../../../components/header-content/HeaderComponent";
    import Relevance from "./Relevance";

    export default {
        name: "articleCompetitionCreate",
        components: {Relevance, HeaderComponent},
        filters: {
            status(val) {
                switch (val) {
                    case -1:
                        return '未发布'
                    case 0:
                        return "未开始"
                    case 1:
                        return '已开始'
                    case 2:
                        return '已结束'
                    default:
                        return '未知状态'
                }
            }
        },
        data() {
            return {
                pointEvery: 1,
                headerTitle: '创建文章浏览任务',
                headerProps: ['返回'],
                isCheck: false,
                relevanceDialogVisible: false,
                findTaskCompetitionList: {},
                browseTimeArr: [
                  {label: '1分钟',value:60},
                  {label: '3分钟',value:180},
                  {label: '5分钟',value:300},
                  {label: '10分钟',value:600},
                  {label: '15分钟',value:900},
                  {label: '30分钟',value:1800},
                  {label: '40分钟',value:2400},
                  {label: '45分钟',value:2700},
                  {label: '50分钟',value:3000},
                  {label: '60分钟',value:3660}
                ],
                form: {
                    event: this.$route.meta.event,
                    title: '',
                    startTime: null,
                    endTime: null,
                    businesses: [],
                    conditions: [
                        {
                            identity: -1,
                            pointEvery: 1, // 答完获得多少积分
                            numMax: 1 , // 积分份数
                            pro: {browseTime: '60'}
                        }
                    ],
                    pointType: 1,
                    status: null,
                    description: ''
                },
                timeScope: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '设为一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() + 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [end, start]);
                        }
                    }, {
                        text: '设为一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() + 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [end, start]);
                        }
                    }, {
                        text: '设为三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() + 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [end, start]);
                        }
                    }]
                },
            }
        },
        created() {
        },
        mounted() {
            if (this.$route.params.type === 'CHECK') {
                this.$route.meta.title = '查看文章浏览任务'
                this.headerTitle = '查看文章浏览任务'
                this.getTaskDetail()
                this.isCheck = true
            } else if (this.$route.params.type === 'EDIT') {
                this.getTaskDetail()
                this.headerTitle = '编辑文章浏览任务'
                this.$route.meta.title = '编辑文章浏览任务'
            }
        },
        methods: {
            handleClose(val) {
              this.form.businesses = []
            },
            changeRelevance(val) {
              this.form.businesses = [val]
            },
            timeChange() {
                this.form.startTime = this.timeScope[0]
                this.form.endTime = this.timeScope[1]
                if (this.timeScope[0] === this.timeScope[1]) {
                    this.form.endTime = this.timeScope[1] + 3600 * 1000 * 24 - 1000
                }
            },
            taskSave(status) {
                // 创建任务
                let params = {
                    ...this.form,
                    id: this.$route.params.id,
                    status: status, // 是否发布 -1保存 0发布
                }
                this.$http.post(this.$api.taskSave, params).then(res => {
                    let {code, message} = res.data
                    if (code === 0) {
                        this.$message.success('创建成功')
                        this.$router.back()
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            getTaskDetail() {
                // h获取详情
                let event = this.$route.meta.event
                let id = this.$route.params.id
                this.$http.get(this.$api.taskDetail + `${event}/${id}`).then(res => {
                    let {code, data, message} = res.data
                    if (code === 0) {
                        Object.keys(this.form).map(key => {
                            this.form[key] = data[key]
                        })
                        this.form.conditions[0].pro = {browseTime: data.conditions[0].taskConditionPro.browseTime}
                        this.timeScope.push(data.startTime, data.endTime)
                        this.form.businesses = data.businesses
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            headerChange() {
                this.back()
            },
            back() {
                if (this.$route.meta.event === 'lookcms') {
                    this.$router.push({path: '/taskcenter/lookcmsCompetition'})
                }
            },
            onSubmit(status) {
                if (this.form.title === '') {
                    this.$message.error('请填写任务名称')
                } else if (!this.form.startTime) {
                    this.$message.error('请选择任务周期')
                } else if (!this.form.businesses[0] || !this.form.businesses[0].relateId) {
                    this.$message.error('请关联内容')
                } else {
                    this.taskSave(status)
                }
            }
        }
    }
</script>

<style scoped>
    .inputW {
        width: 240px;
    }

    .inputW5 {
        width: 500px;
    }

    .dataW {
        width: 400px;
    }
  .module_content_box {
    padding-top: 30px;
    color: #606266;
  }
  .module_content_box li{
    margin-top: 10px;
    display: flex;
    align-items: center;
  }
  .module_content_box_num_ipt {
    margin: 0 10px;
    width: 180px;
  }
</style>

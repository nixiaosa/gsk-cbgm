<template>
  <div>
    <el-table :data="tableData" border>
      <el-table-column label="名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="媒体">
        <template slot-scope="scope">
          <span>{{ scope.row.programType ? '音频' : '视频' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId==='9'" label="视频类型">
        <template slot-scope="scope">
          <span>{{ scope.row.dataSource.isOfficial === 1 ? "正式" : "测试" }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.userInfo">{{ scope.row.userInfo.nickname }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column v-if="businessId !== '9'" label="讲师" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.launchName ? scope.row.launchName : '' }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="businessId === '9'" label="主持人" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.launchName ? scope.row.launchName : '' }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status | sureType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" class="wraper">
        <template slot-scope="scope">
          <span class="time">{{ scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用/停用" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted===0" style="color:#13ce66">启用中</span>
          <span v-if="scope.row.isDeleted===1" style="color:#ff4949">停用中</span>
        </template>
      </el-table-column>
      <el-table-column v-if="videoAudit" label="审核状态" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.dataSource.approveState===0" style="color:#13ce66">合格</span>
          <span v-if="scope.row.dataSource.approveState===1" style="color:#ff4949">不合格</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="400">
        <template slot-scope="scope">
          <div class="active-box">
            <el-row v-if="classDetail">
              <el-button @click="inform('examine', scope.row)" type="info" size="small"
              >查看详情
              </el-button>
            </el-row>

            <el-row v-if="scope.row.isDeleted===0 && classStop">
              <el-button type="danger" size="small" @click="inform('stopVideo', scope.row)"
              >
                停用
              </el-button>
            </el-row>

            <el-row v-if="scope.row.isDeleted===1 && classStop">
              <el-button type="success" size="small" @click="inform('enableVideo', scope.row)"
              >
                启用
              </el-button>
            </el-row>

            <el-row v-if="businessId==='1'||businessId==='2'||businessId==='9'">
              <el-button type="info" size="small"
                         @click="inform('query', scope.row)">
                查看导入数据
              </el-button>
            </el-row>

            <el-row>
              <el-button type="info" size="small"
                         @click="inform('goInteraction', scope.row)">
                互动管理
              </el-button>
            </el-row>

            <el-row v-if="scope.row.status===3 || scope.row.status===9">
              <el-button
                  @click="inform('getInteractData', scope.row)" type="info" size="small">
                互动数据
              </el-button>
            </el-row>

            <el-row v-if="classStatic">
              <el-button @click="inform('handleClick', scope.row)" type="info" size="small"
              >统计信息
              </el-button>
            </el-row>

            <!-- <el-row
                v-if="scope.row.status !== -1 && scope.row.status !== 0 && scope.row.status !== 2 && scope.row.status !== 1 && scope.row.status !== 3 && scope.row.isDeleted !== 1">
              <el-button
                  @click="inform('playClick', scope.row)" type="info" size="small">播放
              </el-button>
            </el-row> -->

            <el-row v-if="(scope.row.type === 2 || scope.row.status === 9)">
              <el-button type="info" size="small"
                         @click="inform('downLoad', scope.row)">下载
              </el-button>
            </el-row>

            <el-row v-if="scope.row.status === 9">
              <el-button type="info" size="small"
                         @click="inform('govideoManage', scope.row)">
                视频管理
              </el-button>
            </el-row>

            <!-- <el-row v-if="scope.row.businessId===3">
              <el-button type="info" size="small"
                         @click="inform('userManage', scope.row)">
                人员管理
              </el-button>
            </el-row> -->

            <!-- <el-row v-if="scope.row.dataSource.isUploadIdentification">
              <el-button type="info" size="small" @click="inform('credentialsExport', scope.row)"
              >导出证件照
              </el-button>
            </el-row> -->

            <!-- <el-row v-show="!scope.row.isOld">
              <el-button @click="inform('blackList', scope.row)" type="info" size="small"
              >会议黑名单
              </el-button>
            </el-row> -->

            <!-- <el-row v-show="!scope.row.isPublic">
              <el-button @click="inform('applyList', scope.row)" type="info" size="small"
              >申请管理
              </el-button>
            </el-row> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {formatDate} from '@/common/data'

export default {
  name: "videoList",
  props: {
    videoAudit: {
      //是否开通审核
      type: Number,
      default: 0
    },
    userAuths: {
      // 按钮权限
      type: Object,
      default: () => ({})
    },
    businessId: {
      type: String,
      default: ''
    },
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      classDetail: false,
      classStatic: false,
      classStop: false,
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
    jsonTags(tags) {
      tags = JSON.parse(tags)
      return tags[0][0]
    },
    sureType(v) {
      switch (v) {
        case -1:
          return '已失效'
        case 0:
          return '预告'
        case 1:
          return '直播'
        case 2:
          return '暂停'
        case 3:
          return '结束'
        case 4:
          return '稍后继续'
        case 5:
          return '正在转码'
        case 6:
          return '转码失败'
        case 7:
          return '未发布'
        case 8:
          return '已发布'
        case 9:
          return '直播回放'
      }
    },
    tags(tags, num) {
      console.log(tags);
      // var jsonTags = JSON.parse(tags)
      // var tagsOne = jsonTags[0]
      // var tagsTwo = jsonTags[1]
      // if (num === 0) {
      //     return tagsOne[0]
      // } else {
      //     return tagsTwo.join(',')
      // }
    },
  },
  mounted() {
    setTimeout(() => {
      this.auths()
    })
  },
  methods: {
    auths() {
      switch (this.businessId) {
        case '1':
          if (this.userAuths.train_detail) this.classDetail = true
          if (this.userAuths.train_statistics) this.classStatic = true
          if (this.userAuths.train_stop_start) this.classStop = true
          break
        case '2':
          if (this.userAuths.classroom_detail) this.classDetail = true
          if (this.userAuths.classroom_statistics) this.classStatic = true
          if (this.userAuths.classroom_stop_start) this.classStop = true
          break
        case '3':
          if (this.userAuths.interact_class_detail) this.classDetail = true
          if (this.userAuths.interact_class_statistics) this.classStatic = true
          if (this.userAuths.interact_class_stop_start) this.classStop = true
          break
        case '4':
          if (this.userAuths.online_class_detail) this.classDetail = true
          if (this.userAuths.online_class_statistics) this.classStatic = true
          if (this.userAuths.online_class_stop_start) this.classStop = true
          break
        case '5':
          if (this.userAuths.academic_conference_detail) this.classDetail = true
          if (this.userAuths.academic_conference_statistics) this.classStatic = true
          if (this.userAuths.academic_conference_stop_start) this.classStop = true
          break
        default:
          this.classDetail = true
          this.classStatic = true
          this.classStop = true
          break
      }
    },
    inform(affair, props) {
      let params = {
        affair: affair,
        params: props
      }
      this.$emit('change', params)
    },
  }
}
</script>

<style scoped>
/deep/ .el-button {
  margin-left: 0;
}

/deep/ .el-row:nth-child(odd) {
  margin-left: 0 !important;
}

/deep/ .el-row:nth-child(even) {
  margin-right: 5px !important;
}

.el-row {
  margin-bottom: 10px;
}

.el-row:nth-child(odd) {
  margin-left: 5px;
  margin-right: 5px;
}

.active-box {
  font-size: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: left;
  align-items: center;
}
</style>

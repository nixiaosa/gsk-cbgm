<template>
  <div class="modelist">
    <div class="piont-flex" style="border:none">
      <div class="point-title">
        <el-select v-model="bidValue" placeholder="请选择业务类型">
          <el-option
            v-for="item in bidOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="value" placeholder="请选择培训分类">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <!--<el-input-->
        <!--style="width:200px;margin-bottom:15px;"-->
        <!--placeholder="搜索"-->
        <!--icon="search"-->
        <!--v-model="searchVal"-->
        <!--:on-icon-click="searchClick">-->
        <!--</el-input>-->
      </div>
      <div>
      </div>
    </div>
    <div style="width:100%;height:5px;"></div>
    <el-table
      :data="tableData"
      border
      style="width: 95%"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="45">
      </el-table-column>
      <el-table-column
        label="名称" width="200">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column
        label="描述"
        width="300">
        <template slot-scope="scope">
          <span :title="scope.row.description">{{ scope.row.description | longToShort }}</span>
        </template>
      </el-table-column> -->
      <el-table-column
        label="创建人"
        width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.userInfo">{{ scope.row.userInfo.nickname }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="讲师"
        width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.launchName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="类型"
        width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.type === 1 ?'直播':'点播' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="状态" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.status | sureType }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="service===1"
        label="培训分类" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.tags | tagsChange(1) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="service===2"
        label="课程分类" width="100">
        <template slot-scope="scope">
          <span>{{ scope.row.tags | jsonTags }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        width="160" class="wraper">
        <template slot-scope="scope">
          <span class="time">{{ scope.row.showTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.videoType!==2">{{ scope.row.startTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-show="isShow"
        label="结束时间"
        width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.videoType!==2">{{ scope.row.endTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-show="isShow"
        label="启用/停用"
        width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted===0" style="color:#13ce66">启用中</span>
          <span v-if="scope.row.isDeleted===1" style="color:#ff4949">停用中</span>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="390">
        <template slot-scope="scope">
          <el-button  @click="examine(scope.row.busId,scope.row.type,scope.row.status)" type="info" size="small">查看详情</el-button>
          <el-button @click="handleClick(scope.row.busId,scope.row.type,scope.row.status)"  type="info" size="small" v-if="scope.row.status!==0">统计信息</el-button>
          <el-button v-if="scope.row.status !== -1 && scope.row.status !== 0 && scope.row.status !== 2 && scope.row.status !== 1" @click="playClick(scope.row.busId,scope.row.type,scope.row.status,scope.row.id)" type="info" size="small">播放</el-button>
          <el-button v-if="scope.row.status === -1 || scope.row.status === 0 || scope.row.status === 2 || scope.row.status === 1" type="info" disabled size="small">播放</el-button>
          <el-button type="danger" size="small" @click="stopVideo(scope.row.id)" v-if="scope.row.isDeleted===0">停用</el-button>
          <el-button type="success" size="small" @click="enableVideo(scope.row.id)"  v-if="scope.row.isDeleted===1">启用</el-button>
          <el-button v-if="scope.row.status === 9 && (bidValue==='3'||bidValue==='4'||bidValue==='5')"   type="info" size="small" @click="downLoad(scope.row.name,scope.row.id)" style="position: absolute">下载</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      :current-page="newpage"
      layout="prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total">
    </el-pagination>
    <!-- 打开详情 -->
    <el-dialog
      title="详情"
      :visible.sync="centerDialogVisible"
      center>
      <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
        <el-form-item label="业务类型：">
          <span>{{ serviceName }}</span>
        </el-form-item>
        <el-form-item label="栏目：">
          <span>{{ serviceName }}</span>
        </el-form-item>
        <el-form-item label="形式:"  >
          <span>{{isShow === true ? '直播' : '点播'}}</span>
        </el-form-item>
        <el-form-item label="标题：">
          <span>{{formLabelAlign.name}}</span>
        </el-form-item>
        <el-form-item label="封面图：">
          <img :src="formLabelAlign.coverUrl" style="width:200px;height:200px" alt="">
        </el-form-item>
        <el-form-item label="产品：">
          <span v-if="formLabelAlign.dataSource">{{ formLabelAlign.dataSource.tags}}</span>
        </el-form-item>
        <el-form-item v-show="!isShow" label="展示时间：">
          <el-date-picker
            v-model="formLabelAlign.showTime"
            type="datetime"
            placeholder="选择日期时间">
          </el-date-picker>
          <el-button type="primary" @click="updateShowTime(formLabelAlign.showTime)">修改时间</el-button>
        </el-form-item>
        <el-form-item v-show="isShow" label="开始时间：">
          <span>{{formLabelAlign.startTime | formatDate}}</span>
        </el-form-item>
        <el-form-item v-show="isShow" label="结束时间：">
          <span>{{formLabelAlign.endTime | formatDate}}</span>
        </el-form-item>
        <el-form-item v-show="isShow" label="讲师：" v-if="bidValue!=='5'">
          <p style="margin:0"><span>{{formLabelAlign.launchName}}</span></p>
        </el-form-item>
        <el-form-item label="主播:" v-if="bidValue==='5'" v-show="isShow">
          <p style="margin:0"><span>{{formLabelAlign.launchListName}}</span></p>
        </el-form-item>
        <el-form-item  v-if="bidValue==='5'" label="嘉宾:" v-show="isShow">
          <p style="margin:0"><span v-for="item in formLabelAlign.guestListName">{{item.name}}&nbsp;&nbsp;</span></p>
        </el-form-item>
        <div class="info-block block3">
          <span class="info-self">日程：</span>
          <div class="info-selfs">
            网站展示日程:
            <div class="info-contents">
              <img  v-for='item in formLabelAlign.schedulepc' :src="item.url" alt="">
            </div>
          </div>
          <div class="info-selfs">
            移动端展示日程:
            <div class="info-contents">
              <img v-for='item in formLabelAlign.schedulemobile' :src="item.url" alt="">
            </div>
          </div>
        </div>
        <el-form-item v-if="bidValue==='5'"  label="举办地址：">
          <p style="margin:0"><span >{{formLabelAlign.hostAddress}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"  label="主办方：">
          <p style="margin:0"><span >{{formLabelAlign.master}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"  label="协办方：">
          <p style="margin:0"><span >{{formLabelAlign.assist}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"  label="承办方：">
          <p style="margin:0"><span >{{formLabelAlign.cibtractor}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"   label="标签输入：">
          <p style="margin:0"><span >{{formLabelAlign.tags}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"  label="会议资料：">
          <p style="margin:0"><span v-for="item in formLabelAlign.dataListurl" style="cursor: pointer">{{item.name}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"  label="是否发放福袋:">
          <p style="margin:0"><span>{{formLabelAlign.awardSwitch === 1 ? '是' : '否'}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'"  label="是否发放问卷:">
          <p style="margin:0"><span>{{formLabelAlign.answerSwitch === 1 ? '是' : '否'}}</span></p>
        </el-form-item>
        <el-form-item v-if="bidValue==='5'" label="是否完善信息:">
          <p style="margin:0"><span>{{formLabelAlign.perfect === 213 ? '是' : '不需要'}}</span></p>
        </el-form-item>
        <!--<el-form-item label="邀请用户：" v-if="bidValue==='1'||bidValue==='2'">-->
        <!--<div v-for="one in audience"><span>{{one}}</span><br></div>-->
        <!--</el-form-item>-->
        <el-form-item label="简介：">
          <textarea class="test-area" readonly>{{formLabelAlign.description}}</textarea>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
    <!--下载详情-->
    <el-dialog
      title="下载详情"
      :visible.sync="details"
      center>
      <el-form :label-position="labelPosition" label-width="100px" :model="formLabelAlign">
        <el-form-item label="标题：">
          <span>{{formLabelAlign.name}}</span>
        </el-form-item>
        <el-form-item label="下载地址:" v-for="(item,key) in urls" :key="key">
          <span class="big">{{item.playbackUrl}}</span>
          <el-button @click="opens(item.playbackUrl)" style="margin-left: 10px">下载</el-button>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="details = false">关 闭</el-button>
        <!-- <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button> -->
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { formatDate } from '@/common/data'
  import { mapGetters } from 'vuex'
  export default {
    name: 'modelist',
    components: {},
    data() {
      return {
        searchVal: '',
        tableData: [],
        formLabelAlign: {
          name: '',
          tags: '',
          launchListName: '',
          guestListName: '',
          schedulepc: '',
          schedulemobile: '',
          dataListurl: '',
          hostAddress: '',
          master: '',
          assist: '',
          cibtractor: '',
          awardSwitch: '',
          answerSwitch: '',
          perfect: ''
        },
        audience: [],
        labelPosition: 'right',
        centerDialogVisible: false,
        details: false,
        multipleSelection: [],
        isShow: true,
        showTime: '',
        total: 1,
        num1: 1,
        options: [],
        value: '全部分类',
        label: '',
        input2: '',
        newpage: 1,
        bidValue: '',
        bidOptions: [],
        optionObj: {},
        serviceName: '店员培训',
        urls: '',
        busId: ''
      }
    },
    watch: {
      bidValue(val) {
        this.value = this.options[0].value
        this.options = this.optionObj[this.bidValue]
        if (val === '1') {
          this.serviceName = '店员培训'
        } else if (val === '2') {
          this.serviceName = '空中课堂'
        } else if (val === '3') {
          this.serviceName = '互动公开课'
        } else if (val === '4') {
          this.serviceName = '线上公开课'
        } else if (val === '5') {
          this.serviceName = '学术会议'
        }
        this.getVideoList(1)
      },
      value() {
        this.getVideoList(1)
      }
    },
    computed: {
      ...mapGetters([
        'service',
        'serviceType',
        'businessTrain',
        'businessClass',
        'businessOnlineOpenClass',
        'businessAcademicConFerence',
        'businessInteractionOpenClass'
      ])
    },
    filters: {
      jsonTags(tags) {
        tags = JSON.parse(tags)
        return tags[0][0]
      },
      formatDate(time) {
        if (!time) {
          return ''
        }
        time = Number(time)
        var date = new Date(time)
        return formatDate(date, 'yyyy-MM-dd hh:mm')
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
      tagsChange(tags, num) {
        // var arrTags = tags.split('"],["')
        // var str = arrTags[1].replace(/[\"\]]/g, '')
        var jsonTags = JSON.parse(tags)
        var tagsOne = jsonTags[0]
        var tagsTwo = jsonTags[1]
        if (num === 0) {
          return tagsOne[0]
        } else {
          return tagsTwo.join(',')
        }
      },
      longToShort(str) {
        if (str.length > 20) {
          return str.substring(0, 20) + '...'
        } else {
          return str
        }
      }
    },
    mounted() {
      var arr = []
      if (this.businessTrain) {
        arr.push({ label: '店员培训', id: '1' })
      }
      if (this.businessClass) {
        arr.push({ label: '空中课堂', id: '2' })
      }
      if (this.businessInteractionOpenClass) {
        arr.push({ label: '互动公开课', id: '3' })
      }
      if (this.businessOnlineOpenClass) {
        arr.push({ label: '线上公开课', id: '4' })
      }
      if (this.businessAcademicConFerence) {
        arr.push({ label: '学术会议', id: '5' })
      }
      this.bidOptions = arr
      this.getMenuList()
      this.downLoad()
    },
    methods: {
      async updateShowTime(date) {
        const time1 = new Date(date)
        const params = {
          busId: this.busId,
          showTime: time1.getTime()
        }
        const res = await http.post(api.updateVideo, params)
        if (res.data.code === 0) {
          alert('修改成功')
        }
      },
      changeAudience(tags) {
        if (!tags) {
          this.audience = []
        } else {
          var jsonTags = JSON.parse(tags)
          var array = jsonTags[3]
          var array1 = []
          for (var i = 0; i < array.length; i++) {
            array1.push(array[i][0])
          }
          this.audience = array1
        }
      },
      // 回放下载
      downLoad: async function(name, id) {
        this.formLabelAlign.name = name
        var params = {
          pageNum: 1,
          pageSize: 100,
          params: {
            liveId: id
          }
        }
        const res = await http.post(api.playBckVideoList, params)
        if (res.data.code === 0) {
          this.details = true
          this.urls = res.data.data.data
        }
      },
      opens(url) {
        window.open(url)
      },
      searchClick() {
      },
      // 列表分页切换数据
      handleCurrentChange(val) {
        this.newpage = val
        this.getVideoList(val)
      },
      handleIconClick() {
        this.getVideoList(this.newpage)
        this.newpage = 1
      },
      // 获取列表详情
      examine: async function(id, type) {
        this.busId = id
        if (type === 1) {
          this.isShow = true
          const res = await http.get(api.videoBusId + id)
          this.formLabelAlign = res.data.data
          this.changeAudience(this.formLabelAlign.tags)
          if (this.bidValue === '5') {
            this.formLabelAlign.launchListName = res.data.data.launchName
            this.formLabelAlign.schedulepc = this.formLabelAlign.dataSource.schedule.pc
            this.formLabelAlign.schedulemobile = this.formLabelAlign.dataSource.schedule.mobile
            this.formLabelAlign.dataListurl = this.formLabelAlign.dataSource.dataList
            this.formLabelAlign.hostAddress = this.formLabelAlign.dataSource.contractors.hostAddress
            this.formLabelAlign.master = this.formLabelAlign.dataSource.contractors.master
            this.formLabelAlign.assist = this.formLabelAlign.dataSource.contractors.assist
            this.formLabelAlign.cibtractor = this.formLabelAlign.dataSource.contractors.cibtractor
            this.formLabelAlign.awardSwitch = this.formLabelAlign.dataSource.awardSwitch
            this.formLabelAlign.answerSwitch = this.formLabelAlign.dataSource.answerSwitch
            this.formLabelAlign.guestListName = this.formLabelAlign.guestList
            this.formLabelAlign.perfect = res.data.data.code
          }
          this.centerDialogVisible = true
        } else if (type === 2) {
          this.isShow = false
          const res = await http.get(api.videoBusId + id)
          this.formLabelAlign = res.data.data
          if (this.bidValue === '5') {
            this.formLabelAlign.launchListName = res.data.data.launchName
            this.formLabelAlign.schedulepc = this.formLabelAlign.dataSource.schedule.pc
            this.formLabelAlign.schedulemobile = this.formLabelAlign.dataSource.schedule.mobile
            this.formLabelAlign.dataListurl = this.formLabelAlign.dataSource.dataList
            this.formLabelAlign.hostAddress = this.formLabelAlign.dataSource.contractors.hostAddress
            this.formLabelAlign.master = this.formLabelAlign.dataSource.contractors.master
            this.formLabelAlign.assist = this.formLabelAlign.dataSource.contractors.assist
            this.formLabelAlign.cibtractor = this.formLabelAlign.dataSource.contractors.cibtractor
            this.formLabelAlign.awardSwitch = this.formLabelAlign.dataSource.awardSwitch
            this.formLabelAlign.answerSwitch = this.formLabelAlign.dataSource.answerSwitch
            this.formLabelAlign.guestListName = this.formLabelAlign.guestList
            this.formLabelAlign.perfect = res.data.data.code
          }
          this.changeAudience(this.formLabelAlign.tags)
          this.centerDialogVisible = true
        }
        // if (this.bidValue === '5') {
        //   this.$router.push({ path: 'classdetail/' + id })
        // }
      },
      // 停用功能
      stopVideo: async function(id) {
        let params = {
          id: id,
          isDeleted: 1
        };
        const res = await http.post(api.videoSst, params);
        if (res.data.code === 0) {
          this.getVideoList(this.newpage);
        } else {
          this.$message.error(res.data.message);
        }
      },
      // 启用功能
      enableVideo: async function(id) {
        let params = {
          id: id,
          isDeleted: 1
        };
        const res = await http.post(api.videoSst, params);
        if (res.data.code === 0) {
          this.getVideoList(this.newpage);
        } else {
          this.$message.error(res.data.message);
        }
      },
      getMenuList: async function() {
        var params = {
          pageNum: 1,
          pageSize: 9999
        }
        var res = await http.post(api.getMenuList, params)
        if (res.data.code === 0) {
          var array = res.data.data.data
          var obj = {}
          for (var i = 0; i < array.length; i++) {
            var str = String(array[i].businessId)
            if (!obj[str]) {
              obj[str] = []
              obj[str].push({ 'label': '全部分类', 'value': 0 })
              obj[str].push({ 'label': array[i].name, 'value': array[i].id })
            } else {
              obj[str].push({ 'label': array[i].name, 'value': array[i].id })
            }
          }
          this.optionObj = obj
          if (this.businessTrain) {
            this.bidValue = '1'
          } else if (this.businessClass) {
            this.bidValue = '2'
          } else if (this.businessInteractionOpenClass) {
            this.bidValue = '3'
          } else if (this.businessOnlineOpenClass) {
            this.bidValue = '4'
          } else if (this.businessAcademicConFerence) {
            this.bidValue = '5'
          }
          this.options = obj[this.bidValue]
          this.value = 0
        }
      },
      // 统计信息按钮点击事件
      handleClick(id, type, type1) {
//      if (type1 === 9) {
//        this.$router.push({ path: 'classdata/' + id + '?type=' + 3 })
//      } else if (type === 1) {
//        this.$router.push({ path: 'classdata/' + id + '?type=' + 1 })
//      } else if (type === 2) {
//        this.$router.push({ path: 'classdata/' + id + '?type=' + 2 })
//      }

//      上面注释是原版  下面按占河要求修改
        if (type1 === 9) {
          this.$router.push({ path: 'classdata/' + id + '?type=' + 3 + '&service=' + this.bidValue })
        } else if (type === 1 ) {
          this.$router.push({ path: 'classdata/' + id + '?type=' + 1 + '&service=' + this.bidValue })
        } else if (type === 2) {
          this.$router.push({ path: 'classdata/' + id + '?type=' + 2 + '&service=' + this.bidValue })
        }
      },
      playClick(id, type, type1,videoId) {
//      上面注释是原版  下面按占河要求修改
        if (type1 === 9) {
          this.$router.push({ path: 'classVideo/' + id + '/' + videoId + '/' + '?type=' + 0})
        } else if (type === 1) {
          this.$router.push({ path: 'classVideo/' + id + '/' + videoId + '/' + '?type=' + 0})
        } else if (type === 2) {
          this.$router.push({ path: 'classVideo/' + id + '/' + videoId + '/' + '?type=' + 1})
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
      },
      changeOrder() {
      },
      // 获取列表
      getVideoList: async function(page) {
        let obj1 = {}
        if (this.value !== 0) {
          obj1 = {
            navigationId: this.value
          }
        }
        let params = {
          pageNum: page,
          pageSize: 10,
          params: {
            businessId: this.bidValue,
            dataSource: obj1
          }
        }
        var res1 = await http.post(api.videoList, params)
        if (res1.data.code === 0) {
          this.tableData = res1.data.data.data
          this.total = res1.data.data.total
        }
      },
      // 删除banner
      deleteBanner: async function(id) {
        var params = {
          id: id
        }
        var res = await http.post(api.deleteBanner, params)
        if (res.data.code === 0) {
          alert('删除成功')
          this.bannerList(1)
        }
      }
    }
  }
</script>
<style scoped>
  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }
  .test-area{
    width:400px;
    height: 150px;
    background-attachment: #f7f7f7;
    border:1px solid #e5e5e5;
    padding:5px;
    padding-top:20px;
    outline:none;
    resize:none;
  }
  .big{
    display: block;
    white-space: nowrap;
    text-overflow:ellipsis;
    overflow: hidden;
  }
  .piont-flex{
    display: flex;
    justify-content: space-between;
    height:36px;
    margin-bottom: 15px;
    padding-bottom:35px;
  }
  .piont-flex .point-title{
    height: 36px;
    line-height: 36px;
  }
  .info-block .info-self{
    display:inline-block;
    width:113px;
    padding-top:15px;
    padding-bottom:15px;
    text-align: right;
    margin-right: 30px;
  }
  .info-block .info-selfs{
    width:300px;
    padding-top:15px;
    padding-bottom:15px;
    text-align: left;
    margin-left: 130px;
  }
  .info-block .info-selfs:nth-of-type(1){
    margin-top: -48px;
  }
  .info-contents{
    margin-right:70px;
    float: left;
    width:938px;
  }
  .info-contents img{
    width:200px;
    height:200px;
    margin:10px 8px 8px 0;
  }
  .background {
    margin-left:auto;
    margin-right:auto;
    display: block;
    width: 100px;
    height: 80px;
  }
</style>

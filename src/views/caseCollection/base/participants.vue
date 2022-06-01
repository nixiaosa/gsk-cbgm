<template>
  <div class="participants">
    <div class="message">
      <span>收集病例情况：{{totalCount}}份</span>
      <span
        style="margin-left:20px"
        v-if="caseType == 0 && grabKeywords ==1"
      >抓取病例关键字：{{taskstatistics.auditTask.keywords}}</span>
      <div class="charts-box" v-if="taskStatisticsShow">
        <div class="charts-witdh">
          <task-statistics
            v-if="taskstatistics.auditTask.rank >= 1 && taskstatisticsOne"
            title="一级审核"
            :data="taskstatisticsOne"
          />
        </div>
        <div class="charts-witdh">
          <task-statistics
            v-if="taskstatistics.auditTask.rank >= 2 && taskstatisticsTwo"
            title="二级审核"
            :data="taskstatisticsTwo"
          />
        </div>
        <div class="charts-witdh">
          <task-statistics
            v-if="taskstatistics.auditTask.rank >= 3 && taskstatisticsThree"
            title="三级审核"
            :data="taskstatisticsThree"
          />
        </div>
      </div>
    </div>

    <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if="caseType == 0 || caseType == 3">
       <el-form-item style="display:block">
         <div class="title">请选择活动表单<span class="info">切换病例表单，查询收集情况</span></div>
         <div>
          <span class="ocr">
          已收集：
          <em>{{ocrTotal}}</em>份
        </span>
        <span class="ocr" v-if="caseType == 0 && isOcr ==1 || caseType == 3">
          OCR识别成功数：
          <em>{{ocrSuccess}}</em>次
        </span>
        <span class="ocr" v-if="caseType == 0 && isOcr ==1 || caseType == 3">
          OCR识别失败数：
          <em>{{ocrFail}}</em>次
        </span>
        <span class="ocr" v-if="caseType == 0 && grabKeywords ==1 || caseType == 3">
          有效病例：
          <em>{{effectiveCount}}</em>份
        </span>
        <span class="ocr" v-if="caseType == 0 && grabKeywords ==1 || caseType == 3">
          无效病例：
          <em>{{unEffectiveCount}}</em>份
        </span>
        <span class="ocr" v-if="caseType == 0 && grabKeywords ==1 || caseType == 3">
          抓取病例：
          <em>{{effectiveCount}}</em>份
        </span>
        <span class="info2" v-if="caseType == 0 && grabKeywords ==1 || caseType == 3">注：抓取病例是从有效病例中提取出的数据，与收集病例总份数无关</span>
        </div>
       </el-form-item>
       <el-form-item label="表单名称" v-if="caseType == 0 || caseType == 3">
        <el-select v-model="formInline2.formId" placeholder="请选择" @change="getOcr">
          <el-option
            v-for="item in caseFormListArr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单阶段级别" v-if="caseType == 0">
        <el-select v-model="formInline2.rankStates" placeholder="全部" :disabled="formDisable" @change="rankChange">
          <el-option
            v-for="item in rankOptionsStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单阶段" v-if="caseType == 0">
        <el-select v-model="formInline2.formIdChild" placeholder="请选择" :disabled="formDisable" @change="getChildFormId">
          <el-option
            v-for="item in caseFormListChildArr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 多阶段关联表单置灰 -->
      <el-form-item label="表单阶段级别" v-if="caseType == 3">
        <el-select v-model="formInline2.rankStates" placeholder="全部" disabled @change="rankChange">
          <el-option
            v-for="item in rankOptionsStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="表单阶段" v-if=" caseType == 3">
        <el-select v-model="formInline2.formIdChild" placeholder="请选择" disabled @change="getChildFormId">
          <el-option
            v-for="item in caseFormListChildArr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <!-- 多阶段关联表单置灰 -->
    </el-form>

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item style="display:block">
        <div class="title">筛选条件</div>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formInline.nickname" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.phone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="医院">
        <el-input v-model="formInline.hospital" placeholder="请输入医院"></el-input>
      </el-form-item>
      <el-form-item label="病例名称">
        <el-input v-model="formInline.title" placeholder="请输入病例名称"></el-input>
      </el-form-item>
      <el-form-item label="病例状态" v-show="caseType === 3 && taskstatistics.auditTask">
        <el-select v-model="formInline.states" placeholder="请选择">
          <el-option
            v-for="item in optionsStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="病例状态" v-show="taskstatistics.auditTask && caseType !== 3">
        <el-select v-model="formInline.states" placeholder="请选择">
          <el-option
            v-for="item in optionsStates"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="省份">
        <el-input v-model="formInline.province" placeholder="请输入省份名称"></el-input>
      </el-form-item>
      <el-form-item label="城市">
        <el-input v-model="formInline.city" placeholder="请输入城市名称"></el-input>
      </el-form-item>
      <el-form-item label="病例编号">
        <el-input v-model="formInline.id" placeholder="请输入病例编号" maxlength="18" oninput="value=value.replace(/[^0-9]/g,'')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="assignSpecialComment" v-if="professorRemark && ListActiveName == 'first'">分配专家点评</el-button>
        <!-- <el-button type="info" size="small" @click="setPersonUploadTotal('0')">设置每人上传总数</el-button> -->
        <!-- <el-button type="info" size="small" @click="setPersonUploadTotal('1')">设置每人每月上传总数</el-button> -->
        <el-button type="info" size="small" @click="caseExport(ListActiveName)">导出</el-button>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
        <el-button type="info" size="small" @click="batchSearch">批量查询</el-button>
      </el-form-item>
    </el-form>

    <el-tabs v-model="ListActiveName" type="card" @tab-click="handleClick">
      <el-tab-pane label="收集病例列表" name="first"></el-tab-pane>
      <el-tab-pane label="有效病例" name="second" v-if="caseType == 0 && grabKeywords ==1"></el-tab-pane>
      <el-tab-pane label="无效病例" name="third" v-if="caseType == 0 && grabKeywords ==1"></el-tab-pane>
      <el-tab-pane label="抓取病例关键字" name="fourth" v-if="caseType == 0 && grabKeywords ==1"></el-tab-pane>
    </el-tabs>

    <el-table :data="tabData" @selection-change="handleSelectionChangeList" border>
      <el-table-column type="selection" width="55" v-if="ListActiveName == 'first'"></el-table-column>
      <el-table-column label="病例编号" width="170">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.sex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.province }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.county }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.hospital }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.userData.office}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="病例名称">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="专家分配状态" v-show="professorRemark">
        <template slot-scope="scope">
          <span>{{ scope.row.hasProfessor | hasProfessor }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单类型" v-if="caseType == 0">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFormType | caseFormType }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单阶段级别" v-if="caseType == 0">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFormRank }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单阶段" v-if="caseType == 0">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFormStageName }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column width="140px" label="OCR识别成功数" v-if="caseType == 0 && isOcr ==1">
        <template slot-scope="scope">
          <span>{{ scope.row.ocrSuccessCount }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="OCR识别失败数" v-if="caseType == 0 && isOcr ==1">
        <template slot-scope="scope">
          <span>{{ scope.row.ocrFailCount }}</span>
        </template>
      </el-table-column> -->
      <el-table-column width="140px" label="提交时间">
        <template slot-scope="scope">
          <span v-if="scope.row.commitTime">{{ scope.row.commitTime | formatDate }}</span>
        </template>
      </el-table-column>

      <el-table-column v-if="taskstatistics.auditTask && caseType !== 3" width="110px" label="一级审核状态">
        <template slot-scope="scope">
          <span v-html="$options.filters.statusHtml(scope.row.rankOneApproveStates)"></span>
        </template>
      </el-table-column>
      <el-table-column width="140px" v-if="taskstatistics.auditTask && caseType !== 3" label="审核时间">
        <template slot-scope="scope">
          <!-- <span v-html="$options.filters.formatDate(scope.row.rankOneApproveTime)"></span> -->
          <span>{{ scope.row.rankOneApproveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=1 && caseType !== 3"
        width="110px"
        label="一级审核人"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankOneApproveUserName"
            class="taskMessage"
          >{{scope.row.rankOneApproveUserName}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask.isRemark && taskstatistics.auditTask && taskstatistics.auditTask.rank >=1 && caseType !== 3"
        width="110px"
        label="备注"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankOneRemark" class="taskMessage">{{scope.row.rankOneRemark}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=1 && taskstatistics.auditTask.isComment && caseType !==3"
        width="110px"
        label="审核人评分"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankOneStarScore" class="taskMessage">{{scope.row.rankOneStarScore}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <!-- 新加审核意见 -->
      <el-table-column
        width="140px"
        label="审核意见"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.states == 2" class="taskMessage">{{scope.row.noPassReason}}</span>
          <span v-else>——</span>
        </template>
      </el-table-column>
       <!-- 新加审核意见 -->
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=1 && taskstatistics.auditTask.isComment && caseType !==3"
        width="440px"
        label="审核人点评"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankOneComment" class="taskMessage">{{scope.row.rankOneComment}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && caseType !== 3"
        width="110px"
        label="二级审核状态"
      >
        <template slot-scope="scope">
          <span v-html="$options.filters.statusHtml(scope.row.rankTwoApproveStates)"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="140px"
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && caseType !== 3"
        label="审核时间"
      >
        <template slot-scope="scope">
          <!-- <span v-html="$options.filters.formatDate(scope.row.rankTwoApproveTime)"></span> -->
          <span>{{ scope.row.rankTwoApproveTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && caseType !== 3"
        width="110px"
        label="二级审核人"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankTwoApproveUserName"
            class="taskMessage"
          >{{scope.row.rankTwoApproveUserName}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask.isRemark && taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && caseType !== 3"
        width="110px"
        label="备注"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankTwoRemark" class="taskMessage">{{scope.row.rankTwoRemark}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && taskstatistics.auditTask.isComment"
        width="110px"
        label="审核人评分"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankTwoStarScore" class="taskMessage">{{scope.row.rankTwoStarScore}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank >=2 && taskstatistics.auditTask.isComment"
        width="440px"
        label="审核人点评"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankTwoComment" class="taskMessage">{{scope.row.rankTwoComment}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3"
        width="110px"
        label="三级审核状态"
      >
        <template slot-scope="scope">
          <span v-html="$options.filters.statusHtml(scope.row.rankThreeApproveStates)"></span>
        </template>
      </el-table-column>
      <el-table-column
        width="140px"
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3"
        label="审核时间"
      >
        <template slot-scope="scope">
          <!-- <span v-html="$options.filters.formatDate(scope.row.rankThreeApproveTime)"></span> -->
          <span>{{ scope.row.rankThreeApproveTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3"
        width="110px"
        label="三级级审核人"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankThreeApproveUserName"
            class="taskMessage"
          >{{scope.row.rankThreeApproveUserName}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask.isRemark && taskstatistics.auditTask && taskstatistics.auditTask.rank ==3"
        width="110px"
        label="备注"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankThreeRemark" class="taskMessage">{{scope.row.rankThreeRemark}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>

      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3 && taskstatistics.auditTask.isComment"
        width="110px"
        label="审核人评分"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.rankThreeStarScore"
            class="taskMessage"
          >{{scope.row.rankThreeStarScore}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="taskstatistics.auditTask && taskstatistics.auditTask.rank ==3 && taskstatistics.auditTask.isComment"
        width="440px"
        label="审核人点评"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.rankThreeComment" class="taskMessage">{{scope.row.rankThreeComment}}</span>
          <span v-else style="color: rgb(19, 139, 1)"></span>
        </template>
      </el-table-column>

      <el-table-column width="110px" label="状态">
        <template slot-scope="scope">
          <span class="taskMessage">{{scope.row.isStop ? '停用' : '启用'}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="300px">
        <template slot-scope="scope">
          <el-button
            type="info"
            size="small"
            v-if="ListActiveName != 'fourth'"
            @click="godetail(scope.row.id)"
          >查看</el-button>
          <el-button
            type="info"
            size="small"
            v-if="ListActiveName == 'fourth'"
            @click="godetailKeyword(scope.row.id,scope.row.caseCollectId,scope.row.userData.name)"
          >查看</el-button>
          <el-button
            v-show="scope.row.isStop && ListActiveName != 'fourth'"
            type="success"
            size="small"
            @click="stop(scope.row.id, 0)"
          >启用</el-button>
          <el-button
            v-show="!scope.row.isStop && ListActiveName != 'fourth'"
            type="danger"
            size="small"
            @click="stop(scope.row.id, 1)"
          >停用</el-button>
          <el-button
            v-show="professorRemark && scope.row.hasProfessor"
            :disabled="scope.row.hasProfessorRemark === 1"
            type="danger"
            size="small"
            @click="cancelAssignSpecialComment(scope.row.id)"
          >取消分配专家</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="titleText" :visible.sync="personUploadTotal">
      <el-form :inline="true" :model="formPersonUpload" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formPersonUpload.nickname" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="formPersonUpload.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" size="small" @click="PersonUploadSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tabDataPerson" border>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.nickname }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="医院">
          <template slot-scope="scope">
            <span>{{ scope.row.hospital }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科室">
          <template slot-scope="scope">
            <span>{{ scope.row.office }}</span>
          </template>
        </el-table-column>

        <el-table-column label="每人上传总数" fixed="right" width="180px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.num"
              :min="scope.row.minNum"
              size="small"
              class="module_content_box_num_ipt"
            ></el-input-number>
          </template>
        </el-table-column>
        <el-table-column label="每人每月上传总数" fixed="right" width="180px">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.perMonthNum"
              :min="1"
              :max="scope.row.num"
              size="small"
              class="module_content_box_num_ipt"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:20px"></div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page.sync="currentPersonPage"
        @current-change="handlePersonCurrentChange"
        :total="totalPerson"
      ></el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button @click="personUploadTotal = false">取 消</el-button>
        <el-button type="primary" @click="personUploadSave()">保存当前页设置</el-button>
      </span>
    </el-dialog>

    <el-dialog title="分配专家点评" :visible.sync="specialComment">
      <el-form :inline="true" :model="formSpecialUpload" class="demo-form-inline">
        <el-form-item label="姓名">
          <el-input v-model="formSpecialUpload.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="省份">
          <el-input v-model="formSpecialUpload.province" placeholder="请输入省份"></el-input>
        </el-form-item>
        <el-form-item label="城市">
          <el-input v-model="formSpecialUpload.city" placeholder="请输入城市"></el-input>
        </el-form-item>
        <el-form-item label="医院名称">
          <el-input v-model="formSpecialUpload.hospital" placeholder="请输入医院名称"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="info" size="small" @click="specialSearch">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tabDataSpecial" @selection-change="handleSelectionChangeDialog" border>
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="医生姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="省份">
          <template slot-scope="scope">
            <span>{{ scope.row.province }}</span>
          </template>
        </el-table-column>
        <el-table-column label="城市">
          <template slot-scope="scope">
            <span>{{ scope.row.city }}</span>
          </template>
        </el-table-column>
        <el-table-column label="区县">
          <template slot-scope="scope">
            <span>{{ scope.row.county }}</span>
          </template>
        </el-table-column>
        <el-table-column label="医院名称">
          <template slot-scope="scope">
            <span>{{ scope.row.hospital }}</span>
          </template>
        </el-table-column>
        <el-table-column label="职称">
          <template slot-scope="scope">
            <span>{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="科室">
          <template slot-scope="scope">
            <span>{{ scope.row.office }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin:20px"></div>
      <el-pagination
        background
        layout="total, prev, pager, next"
        :current-page.sync="currentSpecialPage"
        @current-change="handleSpecialCurrentChange"
        :total="totalSpecial"
      ></el-pagination>
      <el-form :model="formMessage" style="width:100%; margin-top:20px">
        <el-form-item label="发送短信通知：" prop="keyword">
          <el-radio v-model="formMessage.radio" label="1">发送</el-radio>
          <el-radio v-model="formMessage.radio" label="0">不发送</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="specialComment = false">取 消</el-button>
        <el-button type="primary" @click="onCopy()">分享点评链接</el-button>
        <el-button type="primary" @click="remarkLimitSave()">保存当前页设置</el-button>
      </span>
    </el-dialog>

    <el-dialog title="取消分配专家" :visible.sync="cancelSpecialComment">
      <el-table :data="tabDataSpecialCancel" @selection-change="cancelHandleSelectionChangeDialog" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
      <div>取消后，该专家将不能为该病例点评，是否确认此操作？</div>
      <div style="margin:20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelSpecialComment = false">取 消</el-button>
        <el-button type="primary" :disabled="!cancelUserIds.length" @click="cancelRemarkLimitSave()">确定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="批量查询病例" :visible.sync="batchSearchDia">
      <el-form :model="formInline">
        <el-form-item label="病例编号:">
          <el-input type="textarea" v-model="formInline.caseNumber"></el-input>
        </el-form-item>
      </el-form>
      <div class="dia-info">1.输入病例编号，请以英文逗号进行分隔；不得包含空格或其他特殊字符；例: YB0001,YB0002,YB0003</div>
      <div class="dia-info">2.一次最多可查询100个病例；</div>
      <div style="margin:20px"></div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchSearchDia = false">取 消</el-button>
        <el-button type="primary" @click="onSubmit()" :disabled=!formInline.caseNumber>确定</el-button>
      </span>
    </el-dialog>

    <div style="margin:20px"></div>
    <!-- <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination> -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      layout="total, sizes, prev, pager, next"
      :total="total">
    </el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";
import TaskStatistics from "./Echarts/TaskStatistics";
import TableList from "../../../components/table-content/TableList";
import { nextTick } from "q";
import { setTimeout } from "timers";

export default {
  name: "participants",
  components: { TableList, TaskStatistics },
  props: ["id", "page", "busId"],
  data() {
    return {
      listPageSize: 10,
      ListActiveName: "first",
      rankOptionsStates: [],
      optionsStates: [
        {
          value: "",
          label: "全部"
        },
        {
          value: 0,
          label: "待审核"
        },
        {
          value: 1,
          label: "已通过"
        },
        {
          value: 2,
          label: "审核未通过"
        },
        {
          value: 3,
          label: "已失效"
        }
      ],
      disableType: '',
      caseFormListArr: [],
      caseFormListChildArr: [
        {
          id: 0,
          title: "全部"
        }
      ],
      formDisable: false,
      // caseFormType: '',
      taskStatisticsShow: true,
      taskstatistics: {
        // 审核流程统计
        auditTask: {
          isRemark: 0, //有无备注
          isComment: 0, //有无评分点评
          rank: 1,
          keywords: ""
        },
        taskRank: 0, // 审核任务级别，根据实际需要显示几级审核(如果taskRank为0,表示当前病例征集活动未关联审核任务)
        rankOneApproveUnderWay: null, // 一级审核未审
        rankOneApproved: null, // 一级审核已审
        rankOneApprovedPass: null, // 一级审核通过
        rankOneApprovedNoPass: null, // 一级审核未通过
        rankOneEfficacy: null, // 一级审核已失效
        rankTwoApproveUnderWay: null, // 二级审核未审
        rankTwoApproved: null, //二级审核已审
        rankTwoApprovedPass: null, // 二级审核通过
        rankTwoApprovedNoPass: null, // 二级审核未通过
        rankTwoEfficacy: null, // 二级审核已失效
        rankThreeApproveUnderWay: null, // 三级审核未审
        rankThreeApproved: null, // 三级审核已审
        rankThreeApprovedPass: null, // 三级审核通过
        rankThreeApprovedNoPass: null, // 三级审核未通过
        rankThreeEfficacy: null // 三级审核已失效
      },
      taskstatisticsOne: null,
      taskstatisticsTwo: null,
      taskstatisticsThree: null,
      totalCount: 0, // 病例总数
      passCount: 0, // 已通过病例数量
      tabData: [],
      personList: [],
      currentPage: 1,
      currentPersonPage: 1,
      currentSpecialPage: 1,
      caseCollectId: "",
      total: 1,
      totalPerson: 1,
      totalSpecial: 1,
      formInline: {
        nickname: null,
        hospital: null,
        phone: null,
        title: null,
        states: null,
        province: null,
        caseCollectId: this.$route.params.id,
        // formId: 0,
        effective: null,
        // formIdChild: 0,
        id:'',
        caseNumber: null
      },
      formInline2: {
        rankStates: null,
        formIdChild: 0,
        formId: 0,
      },
      formPersonUpload: {
        busId: this.$route.query.busId,
        nickname: null,
        phone: null
      },
      ocrTotal: null,
      ocrSuccess: null,
      ocrFail: null,
      caseType: null,
      isOcr: null,
      grabKeywords: null,
      effectiveCount: null,
      unEffectiveCount: null,
      personUploadTotal: false,
      specialComment: false,
      cancelSpecialComment: false,
      tabDataPerson: [],
      copyUrl: window.location.host,
      formMessage: {
        radio: "0"
      },
      multipleSelectionList: [],
      multipleSelectionDialog: [],
      cancelMultipleSelectionDialog: [], //取消分配专家弹窗复选
      tabDataSpecial: [],
      tabDataSpecialCancel: [],
      caseFillIds: [],
      cancelCaseFillIds: '',
      userIds: [],
      cancelUserIds: [],
      batchSearchDia: false,
      professorRemark: "", // 有无专家点评(0否1是)
      formSpecialUpload:{
        name: null, // 专家名
      },
      titleText: '设置每人上传总数',
    };
  },
  watch: {
    id(item) {
      this.formInline.caseCollectId = item;
      this.id = item;
      if (this.$route.query.pages) {
        let page = Number(this.$route.query.pages);
        this.currentPage = page;
      } else {
        this.currentPage = this.currentPage;
      }
      this.formInline2.formId = 0;

      this.ListActiveName = "first";
      this.formInline2.formIdChild = 0;
      this.formInline.caseNumber = null;
      this.formInline.nickname = null;
      this.formInline.hospital = null;
      this.formInline.phone = null;
      this.formInline.title = null;
      this.formInline.states = null;
      this.formInline.province = null;
      this.formInline.id = null;
      this.handleClick();

      this.participants(this.currentPage);
      this.statisticsCount();
      this.taskstatisticsCount();
      this.formPersonUpload.busId = this.$route.query.busId;
      this.personUploadList(1);
    }
  },
  filters: {
    hasProfessor(v){
      switch (v) {
        case 0:
          return "未分配";
        case 1:
          return "已分配";
      }
    },
    caseFormType(item){
      switch (item) {
        case "normal":
          return "普通表单";
        case "child":
          return "多阶段表单";
        default:
          return " ";
      }
    },
    sex(item) {
      switch (item) {
        case "man":
          return "男";
        case "woman":
          return "女";
        default:
          return " ";
      }
    },
    statusHtml(item) {
      switch (item) {
        case "待审核":
          return `<span style="color: rgb(252, 81, 12)">${item}</span>`;
        case "审核中":
          return `<span style="color: rgb(252, 81, 12)">${item}</span>`;
        case "已通过":
          return `<span style="color: rgb(19, 139, 1)">${item}</span>`;
        case "审核未通过":
          return `<span style="color: rgb(252, 0, 6)">${item}</span>`;
        case "已失效":
          return `<span style="color: rgb(19, 139, 1)">${item}</span>`;
        case undefined:
          return `<span style="color: rgb(19, 139, 1)"></span>`;
        default:
          return `<span>${item}</span>`;
      }
    },
    formatDate(time) {
      if (!time) {
        return '<span style="color: rgb(19, 139, 1)"></span>';
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    states(v) {
      switch (v) {
        case 0:
          return "待审核";
        case 1:
          return "已通过";
        case 2:
          return "审核未通过";
        case 3:
          return "已失效";
      }
    }
  },
  created() {
    if (this.$route.query.pages) {
      let page = Number(this.$route.query.pages);
      this.currentPage = page;
    } else {
      this.currentPage = this.currentPage;
    }
  },
  async mounted() {
    // this.participants(this.currentPage);
    await this.statisticsCount();
    this.taskstatisticsCount();
    // this.getOcr();
  },
  methods: {
    handleSizeChange(val) {
      this.listPageSize = val;
      this.participants(1);
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
    },
    rankChange(){
      this.formInline2.formIdChild = 0;
      this.caseFormChilds()
      this.statisticsCount(1)
    },
    batchSearch(){
      this.formInline.caseNumber = '';
      this.batchSearchDia = true;
    },
    getChildFormId(val){
      if(val === 0){
        this.statisticsCount(1)
      }else{
        this.formInline2.formIdChild = val
        this.statisticsCount(1)
      }
    },
    caseFormChilds: async function(){
        let params = {};
        params = {
          id: this.formInline2.formId,
          rank: this.formInline2.rankStates
        };
        const item = {
          id: 0,
          title: "全部"
        }
        const res = await http.post(api.caseFormChilds,params);
        if (res.data.code === 0) {
          this.caseFormListChildArr = res.data.data
          this.caseFormListChildArr.unshift(item)
        } else {
          this.$message.error(res.data.message);
        }
    },
    specialSearch(){
      this.professorList(1);
      this.currentSpecialPage = 1;
    },
    remarkLimitSave: async function(pageNum) { // 保存专家点评当前页设置
      let params = {};
      params = {
        busId: this.$route.query.busId,
        notifySms: this.formMessage.radio,
        caseFillIds: this.caseFillIds,
        userIds: this.userIds
      };
      const res = await http.post(api.remarkLimitSave,params);
      if (res.data.code === 0) {
        this.$message.success("保存成功");
        this.specialComment = false;
        this.multipleSelectionList = [];
        this.caseFillIds = [];
        this.userIds = [];
        this.participants(1);
      } else {
        this.$message.error(res.data.message);
      }
    },
    cancelRemarkLimitSave: async function(pageNum) { // 保存专家点评当前页设置
      let params = {};
      params = {
        caseFillId: this.cancelCaseFillIds,
        userIds: this.cancelUserIds
      };
      const res = await http.post(api.professorRemarkLimitCancel,params);
      if (res.data.code === 0) {
        this.$message.success("保存成功");
        this.cancelSpecialComment = false;
        this.cancelMultipleSelectionList = [];
        this.cancelCaseFillIds = '';
        this.cancelUserIds = [];
        this.participants(1);
      } else {
        this.$message.error(res.data.message);
      }
    },
    assignSpecialComment() {
      if(!this.caseFillIds.length){
        this.$message.error("请先选择需要专家点评的病例");
        return false
      }
      this.specialComment = true;
      this.formMessage.radio = "0";
      this.currentSpecialPage = 1;
      this.professorList(1);
    },
    cancelAssignSpecialComment(id) { // 取消分配专家
      this.cancelSpecialComment = true;
      // this.currentSpecialPage = 1;
      this.professorRemarkLimitList(id);
    },
    professorRemarkLimitList: async function(id) { // 专家点评列表
      const res = await http.get(api.professorRemarkLimitList + id);
      if (res.data.code === 0) {
        this.tabDataSpecialCancel = res.data.data;
        this.cancelCaseFillIds = res.data.data[0].caseFillId;
        // console.log(this.cancelCaseFillIds)
      } else {
        this.$message.error(res.data.message);
      }
    },
    professorList: async function(pageNum) { // 专家点评列表
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        params:{
          busId: this.$route.query.busId,
          name: this.formSpecialUpload.name,
          province: this.formSpecialUpload.province,
          city: this.formSpecialUpload.city,
          hospital: this.formSpecialUpload.hospital
        }
      };
      const res = await http.post(api.professorList,params);
      if (res.data.code === 0) {
        this.tabDataSpecial = res.data.data.data;
        this.totalSpecial = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    handleSelectionChangeList(val) {  // 参与用户列表复选
      this.multipleSelectionList = val;
      this.caseFillIds = [];
      this.multipleSelectionList.map(item=>{
        this.caseFillIds.push(item.id)
      });
      // console.log(this.caseFillIds.length)
    },
    handleSelectionChangeDialog(val) { // 分配专家点评弹窗列表复选
      this.multipleSelectionDialog = val;
      this.userIds = [];
      this.multipleSelectionDialog.map(item=>{
        this.userIds.push(item.userId)
      });
    },
    cancelHandleSelectionChangeDialog(val) { // 取消分配专家点评弹窗列表复选
      this.cancelMultipleSelectionDialog = val;
      this.cancelUserIds = [];
      this.cancelMultipleSelectionDialog.map(item=>{
        this.cancelUserIds.push(item.userId)
      });
      console.log(this.cancelUserIds)
    },
    onCopy(e){
      let url = "https://" + window.location.host + "/#/my/myCaseRemark";
      let oInput = document.createElement("input");
      oInput.value = url;
      document.body.appendChild(oInput);
      oInput.select(); // 选择对象;
      console.log(oInput.value);
      document.execCommand("Copy"); // 执行浏览器复制命令
      this.$message({
        showClose: true,
        message: "复制成功",
        type: "success"
      });
      oInput.remove();
    },
    personUploadSave: async function() {
      let params = this.tabDataPerson;
      const res = await http.post(
        api.personUploadTotalSave + this.$route.query.busId,
        params
      );
      if (res.data.code === 0) {
        this.personUploadTotal = false;
        this.$message.success("保存成功");
        // console.log(this.tabDataPerson);
      } else {
        this.$message.error(res.data.message);
      }
    },
    personUploadList: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        params: this.formPersonUpload
      };
      const res = await http.post(api.personUploadTotalList, params);
      if (res.data.code === 0) {
        this.tabDataPerson = res.data.data.data;
        this.totalPerson = res.data.data.total;
        if (this.$route.query.states > 1) {
          this.tabDataPerson.map(item => {
            item.minNum = item.num;
          });
          // console.log(this.tabDataPerson);
        } else {
          this.tabDataPerson.map(item => {
            item.minNum = 1;
          });
          // console.log(this.tabDataPerson);
        }
      } else {
        this.$message.error(res.data.message);
      }
    },
    // inputNumberChange(num1,num2){
    //   console.log(num1,num2)
    //   if(this.$route.query.states > 1 && num1 < num2){
    //       console.log("活动已开始，不能减少")
    //   }
    // },
    PersonUploadSearch() {
      this.personUploadList(1);
    },
    setPersonUploadTotal(value) {
      console.log(value)
      if(value == '0') {
        this.titleText = "设置每人上传总数"
      } else if(value == '1') {
        this.titleText = "设置每人每月上传总数"
      }
      this.personUploadTotal = true;
      this.personUploadList(this.currentPersonPage);
      // this.currentPersonPage = 1;
    },
    ListExport(v) {
      switch (v) {
        case "first":
          return "WHOLE";
        case "second":
          return "EFFECTIVE";
        case "third":
          return "UN_EFFECTIVE";
        case "fourth":
          return "GRAB_KEYWORD";
      }
    },
    handleClick() {
      // 切换tab
      if (this.ListActiveName == "first") {
        this.formInline.effective = null;
        this.currentPage = 1;
        this.participants(1);
      } else if (this.ListActiveName == "second") {
        this.formInline.effective = 1;
        this.currentPage = 1;
        this.participants(1);
      } else if (this.ListActiveName == "third") {
        this.formInline.effective = 0;
        this.currentPage = 1;
        this.participants(1);
      } else if (this.ListActiveName == "fourth") {
        this.formInline.effective = 1;
        this.currentPage = 1;
        this.participants(1);
      }
    },
    getOcr: async function(val) {
      this.formInline2.formIdChild = 0;
      this.formInline2.rankStates = null;
      this.currentPage = 1;
      let caseFormId = ''
      if (this.caseType == 0 || this.caseType == 3) {
        if(this.formInline2.formIdChild !== 0){
          caseFormId = this.formInline2.formIdChild //选择子表单传子表单ID
        }else{
          caseFormId = this.formInline2.formId //子表单选择全部传父表单ID
        }

        let params = {};
        params = {
          id: caseFormId,
          rank: this.formInline2.rankStates
        };
       
        const res = await http.post(api.ocrCount,params);
        if (res.data.code === 0) {
          this.ocrTotal = res.data.data.totalCount
            ? res.data.data.totalCount
            : 0;
          this.ocrSuccess = res.data.data.ocrSuccessCount
            ? res.data.data.ocrSuccessCount
            : 0;
          this.ocrFail = res.data.data.ocrFailCount
            ? res.data.data.ocrFailCount
            : 0;
          this.effectiveCount = res.data.data.effectiveCount
            ? res.data.data.effectiveCount
            : 0;
          this.unEffectiveCount = res.data.data.unEffectiveCount
            ? res.data.data.unEffectiveCount
            : 0;
          this.participants(this.currentPage);
          // this.caseFormChilds();

          this.caseFormListArr.map(item=>{
            if( item.id == val ){
              this.disableType = item.type;
            }
          });

      
          if(this.disableType === 'multistage'){
            const res = await http.get(api.getCaseFormRanks + this.formInline2.formId)
            if (res.data.code === 0) {
                this.rankOptionsStates = []
                res.data.data.map((item,index) => {
                  let rankItem = this.getRank(item)
                  this.rankOptionsStates.push(
                    {
                      value: item,
                      label: `${rankItem}`
                    }
                  )
                })
                const itemAll = {
                        value: null,
                        label: "全部"
                      }
                this.rankOptionsStates.unshift(itemAll)
                this.formInline2.rankStates = this.rankOptionsStates[0].value
            } else {
                this.$message.error(res.data.message);
            }

            this.caseFormChilds();
            this.formDisable = false
          } else {
            this.formDisable = true
          }

        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    getOcrChild: async function(val) { //仅多阶段表单调用
      this.currentPage = 1;
      let caseFormId = ''
      if (this.caseType == 0 || this.caseType == 3) {
        if(this.formInline2.formIdChild !== 0){
          caseFormId = this.formInline2.formIdChild //选择子表单传子表单ID
        }else{
          caseFormId = this.formInline2.formId //子表单选择全部传父表单ID
        }
        let params = {};
        params = {
          id: caseFormId,
          rank: this.formInline2.rankStates
        };
       
        const res = await http.post(api.ocrCount,params);
        if (res.data.code === 0) {
          this.ocrTotal = res.data.data.totalCount
            ? res.data.data.totalCount
            : 0;
          this.ocrSuccess = res.data.data.ocrSuccessCount
            ? res.data.data.ocrSuccessCount
            : 0;
          this.ocrFail = res.data.data.ocrFailCount
            ? res.data.data.ocrFailCount
            : 0;
          this.effectiveCount = res.data.data.effectiveCount
            ? res.data.data.effectiveCount
            : 0;
          this.unEffectiveCount = res.data.data.unEffectiveCount
            ? res.data.data.unEffectiveCount
            : 0;
          this.participants(this.currentPage);
          this.caseFormChilds();

        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    caseFormList: async function(b) {
      if (this.caseType == 0 || this.caseType == 3) {
        const res = await http.get(api.caseFormList + this.id);
        if (res.data.code === 0) {
          this.caseFormListArr = res.data.data;
          if(!b){
            this.formInline2.formId = res.data.data[0].id;
          }
          this.getOcrChild();
          if(!b){ //b不存在则是首次进来，存在则是在调用多阶段表单时
            if(res.data.data[0].type === 'multistage' ){
              const res = await http.get(api.getCaseFormRanks + this.formInline2.formId)
              if (res.data.code === 0) {
                  this.rankOptionsStates = []
                  res.data.data.map((item,index) => {
                    let rankItem = this.getRank(item)
                    this.rankOptionsStates.push(
                      {
                        value: item,
                        label: `${rankItem}`
                      }
                    )
                  })
                  const itemAll = {
                          value: null,
                          label: "全部"
                        }
                  this.rankOptionsStates.unshift(itemAll)
                  this.formInline2.rankStates = this.rankOptionsStates[0].value
              } else {
                  this.$message.error(res.data.message);
              }

              this.caseFormChilds();
            
              this.formDisable = false
            } else {
              this.formDisable = true
            }
         }
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    stop(id, type) {
      // 停用   启用
      this.$http.get(this.$api.case.stop + `${id}/${type}`).then(res => {
        let { code, message } = res.data;
        if (code === 0) {
          this.participants(this.currentPage);
        } else {
          this.$message.error(message);
        }
      });
    },
    taskstatisticsCount() {
      // 获取审核流程
      http.get(api.taskstatisticsCount + this.id).then(res => {
        let { code, data, message } = res.data;
        if (code === 0) {
          this.taskstatistics = data;
          if (data.auditTask) {
            this.taskstatistics.auditTask = data.auditTask;
            // console.log(this.taskstatistics.auditTask)
            // this.taskstatistics.taskRank = data.auditTask.rank;
          } else {
            this.taskstatistics.auditTask = "";
          }
          this.taskstatisticsOne = [
            {
              name: "已通过",
              value: data.rankOneApprovedPass
            },
            {
              name: "未通过",
              value: data.rankOneApprovedNoPass
            },
            {
              name: "已失效",
              value: data.rankOneEfficacy
            },
            {
              name: "未审核",
              value: data.rankOneApproveUnderWay
            }
          ];
          this.taskstatisticsTwo = [
            {
              name: "已通过",
              value: data.rankTwoApprovedPass
            },
            {
              name: "未通过",
              value: data.rankTwoApprovedNoPass
            },
            {
              name: "已失效",
              value: data.rankTwoEfficacy
            },
            {
              name: "未审核",
              value: data.rankTwoApproveUnderWay
            }
          ];
          this.taskstatisticsThree = [
            {
              name: "已通过",
              value: data.rankThreeApprovedPass
            },
            {
              name: "未通过",
              value: data.rankThreeApprovedNoPass
            },
            {
              name: "已失效",
              value: data.rankThreeEfficacy
            },
            {
              name: "未审核",
              value: data.rankThreeApproveUnderWay
            }
          ];
          this.taskStatisticsShow = false;
          this.$nextTick(() => {
            this.taskStatisticsShow = true;
          });
        } else {
          this.$message.error(message);
        }
      });
    },
    async caseExport(type) {
      if (this.caseType == 0) {
        let types = this.ListExport(type);
        await http.get(api.caseFillExport + this.id + "/" + this.formInline2.formId + "/" + types)
          .then(res => {
            const data = res.data;
            if (data.code !== 0) {
              this.$message.error(data.message);
            } else {
              window.open(data.data);
            }
          });
      } else if(this.caseType == 3) {
        await http.get(api.caseFillExport + this.id + "/" + this.formInline2.formId  + "/" + "WHOLE").then(res => {
          const data = res.data;
          if (data.code !== 0) {
            this.$message.error(data.message);
          } else {
            window.open(data.data);
          }
        });
      } else {
        await http.get(api.caseFillExport + this.id + "/" + 0 + "/" + "WHOLE").then(res => {
          const data = res.data;
          if (data.code !== 0) {
            this.$message.error(data.message);
          } else {
            window.open(data.data);
          }
        });
      }
    },

    async statisticsCount(b) {
      await http
        .get(api.statisticsCount + this.id)
        .then(res => {
          const data = res.data;
          if (data.code !== 0) {
            this.$message.error(data.message);
          } else {
            this.passCount = res.data.data.passCount;
            this.totalCount = res.data.data.totalCount;

            this.caseType = res.data.data.caseType;
            this.grabKeywords = res.data.data.grabKeywords;
            this.professorRemark = res.data.data.professorRemark;
    
            if (data.data.caseType == 0 || data.data.caseType == 3) {
              this.caseFormList(b);
            } else {
              this.participants(this.currentPage);
            }

            this.isOcr = res.data.data.isOcr;
          }
        })
        .catch(error => {
          this.$message.error(res.data.message);
        });
    },
    onSubmit() {
      this.participants(this.currentPage);
      this.batchSearchDia = false
      this.formInline.caseNumber = null
    },
    godetail(id) {
      this.$router.push({ path: "/activity/casedetails/" + id });
    },
    godetailKeyword(id, caseCollectId, name) {
      this.See(id, caseCollectId, name);
    },
    See(id, caseCollectId, name) {
      // let routes = this.$router.resolve({
      //   path: `/activity/caseprviewkeyword/${this.id}/${this.caseCollectId}?name=${
      //     name
      //   }&title=${this.fromName}`
      // });
      let routes = this.$router.resolve({
        path: `/activity/caseprviewkeyword/${id}/${caseCollectId}?name=${name}`
      });
      window.open(routes.href, "_blank");
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.participants(val);
    },
    handlePersonCurrentChange(val) {
      this.currentPersonPage = val;
      this.personUploadList(val);
    },
    handleSpecialCurrentChange(val) {
      this.currentSpecialPage = val;
      this.professorList(val);
    },
    participants: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        // pageSize: 10,
        pageSize: this.listPageSize,
        params: JSON.parse(JSON.stringify(this.formInline))
      };
      if(this.formInline2.formIdChild !== 0){
        params.params.formId = this.formInline2.formIdChild
      } else {
        params.params.formId = this.formInline2.formId
      } 
      // params.params.formId = this.formInline2.formId
      params.params.rank = this.formInline2.rankStates
      if(this.formInline.caseNumber && this.formInline.caseNumber.length < 18){
        this.$message.error("请输入正确病例编号");
      }
      const res = await http.post(api.participants, params);
      if (res.data.code === 0) {
        // 收集病例列表
        this.tabData = res.data.data.data;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
.dia-info{
  margin-bottom: 10px;
}
.charts-box {
  display: flex;
  /*flex-wrap: wrap;*/
  overflow-x: auto;
  justify-content: space-between;
}

.charts-witdh {
  width: 400px;
}

.message {
  padding: 10px 20px;
  width: 100%;
  background: rgb(238, 241, 246);
  margin-bottom: 10px;
}

.message span,
.message p {
  color: $c-theme;
}

.message p {
  margin-left: 20px;
}

.message p span {
  margin-right: 20px;
}

.taskMessage {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}
.caseformlist {
  display: block;
}
.demo-form-inline .info {
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
  margin-left: 10px;
  color: #cccccc;
  font-size: 16px;
}
.demo-form-inline .info2 {
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
  margin-left: 10px;
  color: #cccccc;
  font-size: 14px;
}
.demo-form-inline .ocr {
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
  /* transform: translateY(-12px); */
  // margin-left: 10px;
  color: $c-theme;
  font-weight: bold;
  font-size: 16px;
  margin-right: 10px;
}
.demo-form-inline .ocr em {
  font-style: normal;
  font-size: 16px;
}
.module_content_box_num_ipt {
  margin: 0 10px;
  width: 130px;
}

.demo-form-inline{
  border: 1px solid #E4E7ED;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px 10px 0 10px;
  margin-bottom: 20px;
}
.demo-form-inline .info {
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
  /* transform: translateY(-12px); */
  margin-left: 10px;
  color: #cccccc;
  font-size: 14px;
}
.demo-form-inline .title{
  font-size: 16px;
  font-weight: bold;
}
</style>

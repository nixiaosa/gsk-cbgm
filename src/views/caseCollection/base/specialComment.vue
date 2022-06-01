<template>
  <div class="participants">
    <div class="message">
      <span>专家点评总数：{{remarkTotal}}条</span>
    </div>

    <el-form :inline="true" :model="formInline" class="demo-form-inline" v-if="caseType == 0">
       <el-form-item style="display:block">
         <div class="title">请选择活动表单<span class="info">切换病例表单，查询收集情况</span></div>
          <div>
          <span class="ocr">点评数：<em>{{remarkForm}}</em>条</span>
          </div>
       </el-form-item>
      <el-form-item label="表单名称" v-if="caseType == 0">
        <el-select v-model="formInline2.formId" placeholder="请选择" @change="professorRemarkTotal">
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
      <el-form-item label="表单阶段" v-if="caseType == 3">
        <el-select v-model="formInline2.formIdChild" placeholder="请选择" disabled @change="getChildFormId">
          <el-option
            v-for="item in caseFormListChildArr"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>

    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item style="display:block">
        <div class="title">筛选条件</div>
      </el-form-item>
       
      <el-form-item label="病例名称">
        <el-input v-model="formInline.caseFillTitle" placeholder="请输入病例名称"></el-input>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="formInline.professorName" placeholder="请输入姓名"></el-input>
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="formInline.professorPhone" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item label="医院">
        <el-input v-model="formInline.professorHospital" placeholder="请输入医院"></el-input>
      </el-form-item>
      <el-form-item label="省份">
        <el-input v-model="formInline.professorProvince" placeholder="请输入省份名称"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="info" size="small" @click="caseExport">导出</el-button>
        <el-button type="info" size="small" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>

    

    <el-table :data="tabData" border>
      <el-table-column v-if="caseType == 0" label="表单名称" width="140px">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFillTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单阶段级别" v-if="caseType == 0">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFormRank }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单阶段级别" v-if="caseType == 3">
        <template slot-scope="scope">
          <span>——</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单阶段" v-if="caseType == 0">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFormStageName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="表单阶段" v-if="caseType == 3">
        <template slot-scope="scope">
          <span>——</span>
        </template>
      </el-table-column>
      <el-table-column label="邀请点评专家" width="130px">
        <template slot-scope="scope">
          <span>{{ scope.row.professorName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="性别">
        <template slot-scope="scope">
          <span>{{ scope.row.professorSex | sex }}</span>
        </template>
      </el-table-column>
      <el-table-column width="120px" label="手机号">
        <template slot-scope="scope">
          <span>{{ scope.row.professorPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="省份">
        <template slot-scope="scope">
          <span>{{ scope.row.professorProvince }}</span>
        </template>
      </el-table-column>
      <el-table-column label="城市">
        <template slot-scope="scope">
          <span>{{ scope.row.professorCity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="区县">
        <template slot-scope="scope">
          <span>{{ scope.row.professorCounty }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="医院">
        <template slot-scope="scope">
          <span>{{ scope.row.professorHospital }}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="职称">
        <template slot-scope="scope">
          <span>{{ scope.row.professorTitle }}</span>
        </template>
      </el-table-column>
      <el-table-column label="科室">
        <template slot-scope="scope">
          <span>{{ scope.row.professorOffice}}</span>
        </template>
      </el-table-column>
     <el-table-column label="点评内容" :show-overflow-tooltip="true" width="400px">
        <template slot-scope="scope">
          <span>{{ scope.row.content}}</span>
        </template>
      </el-table-column>
      <el-table-column label="专家评分" :show-overflow-tooltip="true" width="400px">
        <template slot-scope="scope">
          <span v-if="scope.row.score">{{ scope.row.score }}分</span>
          <span v-else>一一</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="点评时间">
        <template slot-scope="scope">
          <span v-if="scope.row.remarkTime">{{ scope.row.remarkTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="被点评人姓名">
        <template slot-scope="scope">
          <span>{{ scope.row.nickname}}</span>
        </template>
      </el-table-column>
      <el-table-column width="140px" label="点评病例名称">
        <template slot-scope="scope">
          <span>{{ scope.row.caseFillTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" fixed="right" width="150px">
        <template slot-scope="scope">
          <el-button
            v-show="scope.row.hide == 1"
            type="success"
            size="small"
            @click="stop(scope.row.id, 0)"
            style="margin-left:10px"
          >启用</el-button>
          <el-button
            v-show="scope.row.hide == 0"
            type="danger"
            size="small"
            @click="stop(scope.row.id, 1)"
          >隐藏</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div style="margin:20px"></div>
    <el-pagination
      background
      layout="total, prev, pager, next"
      :current-page.sync="currentPage"
      @current-change="handleCurrentChange"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import { formatDate } from "@/common/data";

export default {
  name: "professorRemarkList",
  props: ["id", "page", "busId"],
  data() {
    return {
      ListActiveName: "first",
      rankOptionsStates: [],
      // rankOptionsStates: [
      //   {
      //     value: null,
      //     label: "全部"
      //   },
      //   {
      //     value: 1,
      //     label: "一级表单"
      //   },
      //   {
      //     value: 2,
      //     label: "二级表单"
      //   },
      //   {
      //     value: 3,
      //     label: "三级表单"
      //   },
      //   {
      //     value: 4,
      //     label: "四级表单"
      //   },
      //   {
      //     value: 5,
      //     label: "五级表单"
      //   }
      // ],
      caseFormListArr: [],
      disableType: '',
      caseFormListChildArr: [
        {
          id: 0,
          title: "全部"
        }
      ],
      formDisable: false,
      caseFormType: '',
      totalCount: 0, // 病例总数
      passCount: 0, // 已通过病例数量
      tabData: [],
      personList: [],
      currentPage: 1,
      currentPersonPage: 1,
      caseCollectId: "",
      total: 1,
      totalPerson: 1,
      formInline: {
        busId: this.$route.query.busId,
        // formId: null,
        caseFillTitle: null,
        professorName: null,
        professorPhone: null,
        professorHospital: null,
        professorProvince: null,
        // formIdChild: 0,
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
      tabDataPerson: [],
      caseType: null,
      remarkTotal: "",
      remarkForm: "",
      allForm: {
        id: 0,
        title: "全部"
      }
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
      // this.formInline2.formId = null;
      this.formInline.busId = this.$route.query.busId;
      this.ListActiveName = "first";

      this.formInline2.formIdChild = 0;

      this.professorRemarkList(this.currentPage);
      this.statisticsCount();
      this.professorRemarkTotal();
      // this.professorRemarkForm();
      this.formPersonUpload.busId = this.$route.query.busId;
      // this.personUploadList(1);
    }
  },
  filters: {
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
    formatDate(time) {
      if (!time) {
        return '<span style="color: rgb(19, 139, 1)"></span>';
      }
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
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
    await this.statisticsCount();
    await this.professorRemarkTotal();
    // await this.professorRemarkForm();
  },
  methods: {
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
     professorRemarkList: async function(pageNum) {
      let params = {};
      params = {
        pageNum: pageNum,
        pageSize: 10,
        // params: this.formInline
        params: JSON.parse(JSON.stringify(this.formInline))
      };
      if(this.formInline2.formIdChild !== 0){
        params.params.formId = this.formInline2.formIdChild
      } else {
        params.params.formId = this.formInline2.formId
      } 
      // params.params.formId = this.formInline2.formId
      params.params.rank = this.formInline2.rankStates
      const res = await http.post(api.professorRemarkList, params);
      if (res.data.code === 0) {
        this.tabData = res.data.data.data;
        this.total = res.data.data.total;
      } else {
        this.$message.error(res.data.message);
      }
    },
    professorRemarkTotal: async function(val) {
      this.formInline2.formIdChild = 0;
      this.formInline2.rankStates = null;
      let caseFormId = ''
      if(this.formInline2.formIdChild !== 0){  
          caseFormId = this.formInline2.formIdChild //选择子表单传子表单ID
        }else{                         
          caseFormId = this.formInline2.formId //子表单选择全部传父表单ID
      }

      let params = {};
      params = {
        busId: this.$route.query.busId,
        // formId: this.formInline2.formId,
        formId: caseFormId,
        rank: this.formInline2.rankStates
      };

      const res = await http.post(api.professorRemarkTotal,params);
      if (res.data.code === 0) {
        this.remarkTotal = res.data.data.totalCount
        this.remarkForm = res.data.data.formCount
        this.professorRemarkList(this.currentPage);
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
    },
    professorRemarkTotalChild: async function(val) {
      let caseFormId = ''
      if(this.formInline2.formIdChild !== 0){  
          caseFormId = this.formInline2.formIdChild //选择子表单传子表单ID
        }else{                         
          caseFormId = this.formInline2.formId //子表单选择全部传父表单ID
      }

      let params = {};
      params = {
        busId: this.$route.query.busId,
        // formId: this.formInline2.formId,
        formId: caseFormId,
        rank: this.formInline2.rankStates
      };

      const res = await http.post(api.professorRemarkTotal,params);
      if (res.data.code === 0) {
        this.remarkTotal = res.data.data.totalCount
        this.remarkForm = res.data.data.formCount
        this.professorRemarkList(this.currentPage);
        // this.caseFormListArr.map(item=>{
        //     if( item.id == val ){
        //       this.disableType = item.type;
        //     }
        //   });

          if(this.disableType === 'multistage'){
            this.caseFormChilds();
            this.formDisable = false
          } else {
            this.formDisable = true
          }

      } else {
        this.$message.error(res.data.message);
      }
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
            this.professorRemark = res.data.data.professorRemark;
            if (!data.data.caseType) {
              this.caseFormList(b);
            } else {
              this.professorRemarkList(this.currentPage);
            }
          }
        })
        .catch(error => {
          this.$message.error(res.data.message);
        });
    },
    caseFormList: async function(b) {
      if (this.caseType == 0) {
        const res = await http.get(api.caseFormList + this.id);
        if (res.data.code === 0) {
          this.caseFormListArr = res.data.data;
          this.caseFormListArr.unshift(this.allForm);

          if(!b){
            // this.formInline2.formId = res.data.data[0].id;
            this.formInline2.formId = 0;
          }
          this.professorRemarkTotalChild()
        } else {
          this.$message.error(res.data.message);
        }
      }
    },
    
    stop: async function(id, type) {
      // 停用   启用
      const res = await http.get(api.professorRemarkHide + `${id}/${type}`);
      if (res.data.code === 0) {
        this.professorRemarkList(this.currentPage);
      }else {
        this.$message.error(res.data.message);
      }
    },
    
    async caseExport() {
      await http
        .get(api.professorRemarkExport + this.$route.query.busId)
        .then(res => {
          const data = res.data;
          if (data.code !== 0) {
            this.$message.error(data.message);
          } else {
            window.open(data.data);
          }
        });
    },
    onSubmit() {
      this.professorRemarkList(this.currentPage);
    },
    
    handleCurrentChange(val) {
      this.currentPage = val;
      this.professorRemarkList(val);
    },
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);$c-theme2:var(--reset2);$c-theme3:var(--reset3);
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
.caseformlist .info {
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
  /* transform: translateY(-12px); */
  margin-left: 10px;
  color: #cccccc;
  font-size: 16px;
}
.caseformlist .ocr {
  display: inline-block;
  line-height: 40px;
  vertical-align: top;
  /* transform: translateY(-12px); */
  margin-left: 10px;
  color: $c-theme;
  font-weight: bold;
  font-size: 16px;
}
.caseformlist .ocr em {
  font-style: normal;
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

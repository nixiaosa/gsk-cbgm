<template>
  <div class="case">
    <header-content :title="headerTitle"></header-content>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="课件名称">
        <el-input v-model="formInline.coursewareName" placeholder="请输入课件名称"></el-input>
      </el-form-item>
      <el-form-item label="上传者">
        <el-input v-model="formInline.userName" placeholder="请输入上传者姓名"></el-input>
      </el-form-item>
      <el-form-item label="上传者手机号码">
        <el-input v-model="formInline.userPhone" placeholder="请输入上传者手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="info" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table :data="tableDatas" border>
      <el-table-column label="课件名称" width="300px">
        <template slot-scope="scope">
          <span>{{ scope.row.coursewareName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="一级栏目" v-if="companyConfig.webversion">
        <template slot-scope="scope">{{ scope.row.firstColumnName }}</template>
      </el-table-column>
      <el-table-column label="二级栏目" v-if="companyConfig.webversion">
        <template slot-scope="scope">
          <span>{{ scope.row.secondColumnName }}</span>
        </template>
      </el-table-column>
      <!-- ==================旧版1.0 一二级栏目直接展示====================== -->
      <el-table-column label="一级栏目" v-if="!companyConfig.webversion">
        <template slot-scope="scope">{{ scope.row.parentColumnName }}</template>
      </el-table-column>
      <el-table-column label="二级栏目" v-if="!companyConfig.webversion">
        <template slot-scope="scope">
          <span>{{ scope.row.childColumnName }}</span>
        </template>
      </el-table-column>
      <!-- ==================旧版1.0 一二级栏目直接展示====================== -->
      <el-table-column label="上传时间" width="200px">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatDates }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传者">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上传者手机号码" width="120px">
        <template slot-scope="scope">
          <span>{{ scope.row.userPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="启用状态">
        <template slot-scope="scope">
          <span>{{ scope.row | formatStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示状态">
        <template slot-scope="scope">
          <span>{{ scope.row.translateStatus | formatTranslateStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="450">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="info"
              @click="download(scope.row.fileUrl)"
          >课件下载
          </el-button>
          <el-button
              size="small"
              type="success"
              @click="checkInfo(scope.row)"
          >证件照信息
          </el-button>
          <el-button
              v-if="companyConfig.webversion && scope.row.translateStatus !== 2"
              size="small"
              type="info"
              @click="setContentColumns(scope.row)"
          >栏目设置
          </el-button>
          <el-button
              v-if="scope.row.translateStatus !== 2"
              v-show="!scope.row.isdelete"
              type="warning"
              size="small"
              @click="forbidden(scope.row, 1)"
          >停用
          </el-button>
          <el-button
              v-if="scope.row.translateStatus !== 2"
              v-show="scope.row.isdelete"
              type="success"
              size="small"
              @click="forbidden(scope.row, 0)"
          >启用
          </el-button>
          <el-button
              v-show="scope.row.translateStatus === 2"
              type="primary"
              size="small"
              :loading="loading3"
              @click="reTranslate(scope.row)"
          >重新展示
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :visible.sync="setContentColumn" title="栏目设置">
      <el-form ref="form3" :model="editForm" label-width="100px">
        <el-form-item label="选择一级栏目:">
          <el-select
              v-model="editForm.firstColumnId"
              class="searchStyle"
              placeholder="请选择一级栏目"
              style="width:200px;height:100%;"
              @change="selectOne"
          >
            <el-option v-for="item in firstNav" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择二级栏目:">
          <el-select
              v-model="editForm.secondColumnId"
              class="searchStyle"
              placeholder="请选择二级栏目"
              style="width:200px;height:100%;"
              @change="selectOne2"
          >
            <el-option v-for="item in secondNav" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setContentColumn = false">取 消</el-button>
        <el-button v-if="!editForm.firstColumnId2" type="primary" @click="columnSave(setList)">保存</el-button>
        <el-button v-if="editForm.firstColumnId2" type="primary" @click="columnEdit(setList)">修改</el-button>
      </span>
    </el-dialog>
    <div style="margin:20px"></div>
    <el-pagination
        :current-page.sync="currentPage"
        :total="total"
        background
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"
    ></el-pagination>
    <!--预览图片-->
    <el-dialog
        :lock-scroll="false"
        :modal-append-to-body="false"
        :visible.sync="dialogVisible"
        title="证件照信息"
        width="750px"
    >
      <div class="dialog-content">
        <p>证件照信息</p>
        <div class="photo-wrapper" :loading="loading1">
          <el-image
              v-for="item in idPhotoList"
              :key="item.index"
              style="width: 49%;"
              :src="item"
              :preview-src-list="[item]">
          </el-image>
        </div>
        <p>劳务合同</p>
        <div class="photo-wrapper" :loading="loading2">
          <el-image
              v-for="item in contractList"
              :key="item.index"
              style="width: 49%;"
              :src="item"
              :preview-src-list="[item]">
          </el-image>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script type="text/ecmascript-6">
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import {formatDate} from "@/common/data";
import HeaderContent from "@/components/header-content";
import {mapGetters} from "vuex";
export default {
  name: "materialList",
  computed: {
    ...mapGetters([
      'companyConfig',
      'companyid'
    ])
  },
  components: {
    HeaderContent
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd");
    },
    formatDates(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    },
    formatStatus(val) {
      let isdelete = val.isdelete
      if (val.translateStatus === 2) {
        isdelete = -999
      }
      switch (isdelete) {
        case -999:
          return "";
        case 0:
          return "已启用";
        case 1:
          return "已停用";
      }
    },
    formatTranslateStatus(state) {
      switch (state) {
        case 0:
          return "进行中";
        case 1:
          return "展示完成";
        case 2:
          return "展示失败";
      }
    }
  },
  data() {
    return {
      loading1: false,
      loading2: false,
      loading3: false,
      idPhotoList: [],
      contractList: [],
      dialogVisible: false,
      headerTitle: "课件管理",
      currentPage: 1,
      total: 1,
      tableDatas: [],
      tableData2: [],
      formInline: {
        coursewareName: null,
        userName: null,
        userPhone: null
      },
      firstNavName: "",
      secondNavName: "",
      firstNav: [],
      secondNav: [],
      secondNav2: [],
      contentType: 17, // 文章类型
      setContentColumn: false,
      contentIdArr: [],
      editForm: {
        id: "",
        contentTitle: null,
        contentType: null,
        contentBgUrl: "",
        showTimeEnd: "",
        firstColumnId: null,
        secondColumnId: "",
        firstColumnName: "",
        secondColumnName: "",
        imageUrl: "",
        createdTime: "",
        showTimeStart: ""
      },
      setList: {},
    };
  },
  async mounted() {
    await this.materialList();
    this.getParentList(this.currentPage);
    this.getChildList(this.currentPage);
  },
  created() {
    let page = Number(this.$route.query.page);
    if (this.$route.query.page) {
      this.currentPage = page;
    }
  },
  methods: {
    download(fileUrl) {
      window.open(fileUrl)
    },
    checkInfo(val) {
      this.getUserInfo(val.userId)
      this.getContract(val.id)
      this.dialogVisible = true
    },
    getUserInfo: async function (userId) {
      this.loading1 = true
      let res = await http.get(api.coursewareUserinfo + userId);
      if (res.data.code === 0) {
        this.loading1 = false
        let _credentials = res.data.data.credentials
        if (_credentials) {
          this.idPhotoList = _credentials.split(',')
        } else {
          this.idPhotoList = []
        }
      } else {
        this.loading1 = false
        this.$message.error(res.data.message);
      }
    },
    getContract: async function (id) {
      this.loading2 = true
      let res = await http.get(api.coursewareManageGetContract + id);
      if (res.data.code === 0) {
        this.loading2 = false
        this.contractList = res.data.data
      } else {
        this.loading2 = false
        this.$message.error(res.data.message);
      }
    },
    selectOne(val) {
      //change 触发事件
      //直接就拿到当前的这个对象了
      this.firstNavName = "";
      this.secondNavName = "";
      this.firstNav.map(item => {
        if (item.id == val) {
          this.firstNavName = item.name;
        }
      });


      this.secondNav = [];
      this.editForm.secondColumnId = "";
      this.secondNav2.filter(item => {
        if (item.parentId == this.editForm.firstColumnId && item.type == 4) {
          this.secondNav.push(item)
        }
      });

      this.firstNav.filter(item => {
        if (item.id == this.editForm.firstColumnId) {
          this.firstNav.type = item.type;
          // console.log(this.firstNav.type);
        }
      });
    },
    selectOne2(val) {
      //change 触发事件
      //直接就拿到当前的这个对象了
      this.secondNavName = "";
      this.secondNav.map(item => {
        if (item.id == val) {
          this.secondNavName = item.name;
        }
      });


      this.secondNav.filter(item => {
        if (item.id == this.editForm.secondColumnId) {
          this.secondNav.type = item.type;
        }
      });
    },
    columnSave: async function () {
      let params = {
        firstColumnId: this.editForm.firstColumnId,
        secondColumnId:
            this.editForm.secondColumnId == "" ? 0 : this.editForm.secondColumnId,
        columnType: this.secondNav.type
            ? this.secondNav.type
            : this.firstNav.type,
        firstColumnName: this.firstNavName,
        secondColumnName: this.secondNavName,
        ...this.setList
      };

      if (this.editForm.firstColumnId == "") {
        this.$message.error("一级栏目不能为空");
        return false;
      }
      if (!this.editForm.secondColumnId && this.firstNav.type === null) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      let res = await http.post(api.addContent, params);
      if (res.data.code === 0) {
        this.materialList();
        this.setContentColumn = false;
        this.$message.success("保存成功");
      } else {
        this.$message.error(res.data.message);
        this.setContentColumn = false;
      }
    },
    columnEdit: async function () {
      let params = {
        contentId: this.setList.contentId,
        contentType: this.contentType,
        firstColumnId: this.editForm.firstColumnId,
        // secondColumnId: this.editForm.secondColumnId
        secondColumnId:
            this.editForm.secondColumnId == "" ? 0 : this.editForm.secondColumnId,
        firstColumnName: this.firstNavName,
        secondColumnName: this.secondNavName,
        ...this.setList
      };
      if (!this.editForm.secondColumnId && this.firstNav.type === null) {
        this.$message.error("请选择正确的栏目类型");
        return false;
      }
      let res = await http.post(api.editReShowContent, params);
      if (res.data.code === 0) {
        this.materialList();
        this.setContentColumn = false;
        this.$message.success("编辑成功");
      } else {
        this.$message.error(res.data.message);
        this.setContentColumn = false;
      }
    },
    getParentList: async function () {
      //获取一级栏目
      let params = {
        pageSize: 1000,
        typeList: [4],
      };
      let res = await http.post(api.parentsList, params);
      if (res.data.code === 0) {
        this.firstNav = res.data.data.list
      } else {
        this.$message.error(res.data.message);
      }
    },
    getChildList: async function () {
      //获取二级栏目
      let params = {
        pageSize: 1000
      };
      let res = await http.post(api.childList, params);
      if (res.data.code === 0) {
        this.secondNav2 = res.data.data.list;
      } else {
        this.$message.error(res.data.message);
      }
    },
    setContentColumns: async function (obj) {
      this.setContentColumn = !this.setContentColumn
      this.setList.contentId = obj.newsId;
      this.setList.contentTitle = obj.coursewareName;
      this.setList.contentType = this.contentType;
      this.setList.showTimeStart = obj.createTime;
      this.setList.author = obj.userName;
      this.setList.contentBgUrl = obj.coverUrl;

      this.editForm.firstColumnId = "";
      this.editForm.secondColumnId = "";
      this.editForm.firstColumnId2 = "";
      const res = await http.get(api.editReShow + "/" + this.contentType + "/" + obj.newsId);
      if (res.data.code === 0 && res.data.data != null) {
        // this.editForm.firstColumnId = res.data.data.firstColumnId;
        this.editForm.firstColumnId = res.data.data.firstColumnId == 0 ? null : res.data.data.firstColumnId;
        this.editForm.secondColumnId = res.data.data.secondColumnId == 0 ? null : res.data.data.secondColumnId;
        this.editForm.firstColumnId2 = this.editForm.firstColumnId;
      }

      this.firstNavName = "";
      this.secondNavName = "";
      this.firstNav.map(item => {
        if (item.id == this.editForm.firstColumnId) {
          this.firstNavName = item.name;
        }
      });
      this.secondNav.map(item => {
        if (item.id == this.editForm.secondColumnId) {
          this.secondNavName = item.name;
        }
      });
      //过滤二级菜单
      this.secondNav = [];
      this.secondNav2.filter(item => {
        if (item.parentId == this.editForm.firstColumnId && item.type == 4) {
          this.secondNav.push(item)
        }
      });
    },
    getAllId: async function (obj) {
      let arrId = [];
      for (let item of obj) {
        arrId.push(item.newsId);
      }
      const res = await http.post(api.getContentColumnsByIds + "/" + this.contentType, arrId);
      let data = res.data
      if (data.code === 0) {
        this.contentIdArr = data.data;
        this.doFilter(this.contentIdArr, this.tableData2);
        this.tableDatas = this.tableData2;
      } else {
        this.$message.error(data.message);
      }
    },
    doFilter(products, conditions) {
      for (const index in products) {
        for (const key in conditions) {
          if (conditions[key].newsId == products[index].contentId) {
            conditions[key].firstColumnName = products[index].firstColumnName;
            conditions[key].secondColumnName = products[index].secondColumnName;
            conditions[key].firstColumnId = products[index].firstColumnId;
            conditions[key].secondColumnId = products[index].secondColumnId;
          } else {
            // console.log("无匹配");
          }
        }
      }
    },
    forbidden(obj, status) {
      let params = {
        id: obj.id,
        newsId: obj.newsId,
        isdelete: status
      };
      http.post(api.coursewareManageIsdelete, params).then(res => {
        if (res.data.code === 0) {
          this.materialList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    materialList: async function () {
      let params = {
        ...this.formInline,
        companyId: this.companyid,
        pageNum: this.currentPage,
        pageSize: 10
      };
      await http.post(api.coursewareManageList, params).then((res) => {
        let data = res.data
        if (data.code === 0) {
          this.total = data.data.total;
          this.tableData2 = data.data.list;
          this.getAllId(this.tableData2);
        }
      }).catch((res) => {
        this.$message.error(res.data.message);
      })
    },
    reTranslate: async function (obj) {
      this.loading3 = true
      let { id, fileUrl, suffix, companyId } = obj
      let params = { id, fileUrl, suffix, companyId };
      await http.post(api.coursewareManageReTranslate, params).then((res) => {
        let data = res.data
        if (data.code === 0) {
          this.loading3 = false
          // this.$message.success('解析请求已发送');
        }
      }).catch((res) => {
        this.loading3 = false
        this.$message.error(res.data.message);
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.materialList();
    },
    onSubmit() {
      this.currentPage = 1
      this.materialList();
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.dialog-content {
  height: 500px;
  overflow-y: scroll;
  text-align: left;
  font-weight bold

  .photo-wrapper {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    min-height: 50px;

    img {
      width: 48%;
      margin-bottom: 10px;
    }
  }
}
</style>
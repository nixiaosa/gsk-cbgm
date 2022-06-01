<template>
  <div class="modelist">
    <header-content
      :title="headerTitle"
      :opertions="opertions"
      @header-btn-click="headerClick"
      v-if="userAuths.article_add"
    ></header-content>
    <list-search @change="getSearchInfo"/>
    <el-table :data="tableData" border @selection-change="handleSelectionChange">
      <el-table-column label="标题">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="封面图">
        <template slot-scope="scope">
          <img :src="scope.row.imageUrl" v-if="scope.row.imageUrl" class="background" alt>
        </template>
      </el-table-column>
      <el-table-column label="栏目">
        <template slot-scope="scope">{{scope.row.columnParent}}</template>
      </el-table-column>
      <el-table-column label="子栏目">
        <template slot-scope="scope">
          <span>{{scope.row.columnSon}}</span>
        </template>
      </el-table-column>
      <el-table-column width="100" label="推荐">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.recommend===1">已推荐</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="100" label="启用/停用">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.isdelete===0">启用中</el-tag>
          <el-tag type="danger" v-if="scope.row.isdelete===1">停用中</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="显示时间" width="160" class="wraper">
        <template slot-scope="scope">
          <span class="time">{{scope.row.showTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160" class="wraper">
        <template slot-scope="scope">
          <span class="time">{{scope.row.createtime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="380">
        <template slot-scope="scope">
          <div>
            <el-button
              type="info"
              @click="handleClick(scope.row.id)"
              size="small"
              v-if="userAuths.article_edit"
            >详情&编辑</el-button>
            <el-button
              type="info"
              v-if="scope.row.recommend===0 && userAuths.article_list_action"
              @click="recommend(scope.row.id,scope.row.recommend)"
              size="small"
            >设置推荐</el-button>
            <el-button
              type="danger"
              v-if="scope.row.recommend===1 && userAuths.article_list_action"
              @click="recommend(scope.row.id,scope.row.recommend)"
              size="small"
            >取消推荐</el-button>
            <el-button
              :type="scope.row.top === 0 ? 'info' : 'danger'"
              @click="newsTop(scope.row.id, scope.row.top)"
              size="small"
              v-if="userAuths.article_list_action"
            >{{scope.row.top | isTop}}</el-button>
            <el-button
              type="info"
              v-if="scope.row.isdelete===1 && userAuths.article_list_action"
              @click="stopArticle(scope.row.id,scope.row.isdelete)"
              size="small"
            >启用</el-button>
            <el-button
              type="danger"
              v-if="scope.row.isdelete===0 && userAuths.article_list_action"
              @click="stopArticle(scope.row.id,scope.row.isdelete)"
              size="small"
            >停用</el-button>
            <!-- <el-button type="danger" @click="artId=scope.row.id,dialogVisible=true" size="small">删除</el-button> -->
          </div>
          <div style="margin-top: 6px">
            <el-button type="info" @click="checkManage(scope.row.id)" size="small">浏览设置</el-button>
            <el-button
              type="info"
              @click="goInteraction(scope.row.id)"
              size="small"
            >评论管理</el-button>
            <el-button
             v-if="cmsStatistic === 1"
              type="info"
              @click="browsingHistory(scope.row.id)"
              size="small"
            >浏览记录</el-button>
          </div>
          <div style="margin-top: 6px">
            <el-button @click="goGoodsSets(scope.row)" type="info" size="small">商品设置</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin: 20px"></div>
    <el-pagination
      background
      :current-page="newpage"
      layout="total, prev, pager, next"
      @current-change="handleCurrentChange"
      :total="total"
      :page-size="10"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" size="tiny">
      <span>是否确认删除？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteNews()">确 定</el-button>
      </span>
        </el-dialog>
        <div>
            <!--设置密码-->
            <el-dialog
                    :lock-scroll="false"
                    title="浏览设置"
                    :visible.sync="passwordShow"
                    width="30%"
                    :before-close="handleClose">
                <div>
                    <el-form class="demo-form-inline">
                        <el-form-item label="浏览权限设置：">
                            <el-radio-group v-model="isPassword">
                                <el-radio :label="1">设置密码</el-radio>
                                <el-radio :label="0">不设置密码</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item v-if="isPassword" label="浏览密码：">
                            <el-input style="width: 200px" v-model="password" placeholder="******"></el-input>
                        </el-form-item>
                        <span v-if="isPassword" style="color: #999999">密码不允许包含数字、英文以外的字符且长度为6-10位</span>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
    <el-button @click="cancle">取 消</el-button>
    <el-button type="primary" @click="paswwordSave">确 定</el-button>
  </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
import ListSearch from "../components/ListSearch";
import { formatDate } from "@/common/data";
import { mapGetters } from "vuex";
import { egandnum } from "@/utils/validate";
import md5 from "js-md5";
import HeaderContent from "@/components/header-content";

    export default {
        name: 'modelist',
        components: {
            HeaderContent,
            ListSearch
        },
        computed: {
            ...mapGetters(['userAuths', 'companyid', 'cmsStatistic'])
        },
        data() {
            return {
                newId: '',
                password: '',
                passwordShow: false,
                isPassword: null,
                searchInfo: {},
                headerTitle: '文章管理',
                opertions: ['新建文章'],
                searchVal: '',
                tableData: [],
                multipleSelection: [],
                array: [],
                total: 0,
                newpage: 1,
                artId: '',
                dialogVisible: false,
                form: {
                    order: 0
                },
                id: ''
            }
        },
        filters: {
            isTop(top) {
                if (top === 1) {
                    return '取消置顶'
                } else {
                    return '置顶'
                }
            },
            formatDate(time) {
                time = Number(time)
                var date = new Date(time)
                return formatDate(date, 'yyyy-MM-dd hh:mm')
            },
            sureType(v, h) {
                if (h) {
                    return '回放'
                }
                if (v === 1) {
                    return '直播'
                }
                if (v === 2) {
                    return '视频'
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
            this.getNewsList(this.newpage)
        },
        methods: {
            cancle() {
                this.passwordShow = false
                this.password = ''
            },
            checkManage(id) {
                // 回显浏览设置
                this.newId = id
                this.passwordShow = true
                let params = {
                    id: id
                }
                this.$http.post(this.$api.cmsPasswordGet, params).then(res => {
                    let {code, data, message} = res.data
                    if (code === 0) {
                        this.isPassword = data.viewSet
                    } else {
                        this.$message.error(message)
                    }
                })
            },
            paswwordSave() {
                // 设置浏览密码
                if (this.isPassword) {
                    if (this.password === '') {
                        this.$message.error('请输入密码')
                        return false
                    }
                    if (this.password.length < 6 || this.password.length > 10) {
                        this.$message.error('请设置6-10位密码')
                        return false
                    }
                    if (!egandnum(this.password)) {
                        this.$message.error('密码不允许包含数字、英文以外的字符')
                        return false
                    }
                } else {
                    this.password = null
                }

      let params = {
        id: this.newId,
        viewSet: this.isPassword,
        password: this.password ? md5(this.password) : null
      };
      this.$http.post(this.$api.cmsPasswordSave, params).then(res => {
        console.log(res);
        let { code } = res.data;
        if (code === 0) {
          this.passwordShow = false;
          this.password = "";
          this.$message.success("浏览密码设置成功");
        } else {
          this.$message.error(code);
        }
      });
    },
    handleClose() {
      this.passwordShow = false;
    },
    getSearchInfo(item) {
      // 获取搜索信息
      this.searchInfo.title = item.title;
      this.searchInfo.columnId = item.columnId[1] ? item.columnId[1] : "";
      this.getNewsList(this.newpage);
    },
    rank(id, sort) {
      this.id = id;
      this.form.order = sort;
    },
    headerClick() {
      this.$router.push({ path: "edit" });
    },
    stopArticle: async function(id, state) {
      var params = {
        id: id,
        isdelete: state === 0 ? 1 : 0
      };
      var res = await http.post(api.newsStop, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      }
    },
    recommend: async function(id, state) {
      var params = {
        id: id,
        recommend: state === 0 ? 1 : 0
      };
      var res = await http.post(api.newsStop, params);
      if (res.data.code !== 0) {
        this.$message.error(res.data.message);
      } else {
        this.$message.success("操作成功");
        this.getNewsList(this.newpage);
      }
    },
    handleCurrentChange(val) {
      this.newpage = val;
      this.getNewsList(val);
    },
    getNewsList: async function(page) {
      var params = {
        companyId: this.companyid,
        pageNum: page,
        pageSize: 10,
        ...this.searchInfo
      };
      var res = await http.post(api.getNewsList, params);
      if (res.data.code === 0) {
        this.total = res.data.data.total;
        this.tableData = res.data.data.list;
      } else {
        this.$message.error(res.data.message);
      }
    },
    newsTop: async function(id, top) {
      var params = {
        id: id,
        top: top === 0 ? 1 : 0
      };
      var res = await http.post(api.newsTop, params);
      if (res.data.code === 0) {
        let topMessage = top === 0 ? "置顶成功" : "取消置顶成功";
        this.success(topMessage);
        this.getNewsList(1);
        this.newpage = 1;
      }else{
        this.$message.error(res.data.message);
      }
    },
    deleteNews: async function(id) {
      var params = {
        id: this.artId
      };
      var res = await http.post(api.deleteNews, params);
      if (res.data.code === 0) {
        this.dialogVisible = false;
        this.artId = "";
        this.getNewsList(1);
        this.newpage = 1;
      }
    },
    handleClick(id) {
      this.$router.push({ path: "edit" + "?id=" + id });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    success(val) {
      this.$message({
        message: val,
        type: "success"
      });
    },
    goInteraction(commentId) {
      this.$router.push({
        path: "comment",
        query: {
          businessId: 1000,
          sourceId: commentId
        }
      });
    },
    goGoodsSets(rows) {
      this.$router.push({
        path: "goodsSets",
        query: {
          imageUrl: rows.imageUrl,
          id: rows.id,
          title: rows.title
        }
      })
    },
    browsingHistory (id) {
      this.$router.push({
        path: "oneSoltCms",
        query: {
          columnId: id
        }
      });
    },
    
  }
};
</script>
<style scoped>
.background {
  margin-left: auto;
  margin-right: auto;
  display: block;
  /*width: 160px;*/
  height: 120px;
}
</style>

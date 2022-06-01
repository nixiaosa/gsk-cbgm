<template>
  <div class="relationAudit">
    <identity
      v-if="isShow"
      :isShow="isShow"
      :regionId="regionId_2ji"
      :distributeType="dataInfo.distributeType"
      @isShows="isShows"
      :num="num"
      :bNum="bNum"
      @nums="nums"
    ></identity>
    <region
      v-if="isRegion"
      :isRegion="isRegion"
      :regionId="regionId"
      :distributeType="dataInfo.distributeType"
      :provinceId = "belongsProvincesSelect"
      :provinceName = "belongsProvincesName"
      @isRegions="isRegions"
      @checkName="checkName"
    ></region>
    <serviceContent v-if="shows" @currentRow="currentRow" class="shows" @shows="showsl"></serviceContent>
    <div class="relation">
      <el-form-item label="选择业务:">
        <el-select v-model="relation.service" :disabled="isCheck || isEdit" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="业务内容:">
        <el-button :disabled="contents !== ''" type="primary" @click="Choice">选择业务内容</el-button>
        <div style="color: #ccc;">选择需要审核的内容列表，支持选择数量 1 个</div>
        <div class v-if="contents && contents!== ''">
          <el-tag type="success" @close="closel" :closable="!isEdit">{{contents}}</el-tag>
        </div>
      </el-form-item>
      <el-form-item label="通知用户:">
        <el-radio-group
          :disabled="isCheck"
          @change="notifyUserChange"
          v-model="dataInfo.notifyUser"
        >
          <el-radio class="radio" :label="1">通知全部用户</el-radio>
          <el-radio class="radio" :label="2">只通知审核失败用户</el-radio>
          <el-radio class="radio" :label="0">不通知</el-radio>
        </el-radio-group>
        <div style="color: #ccc;">以短信形式通知用户</div>
      </el-form-item>

      <el-form-item label="病例修改规则:" class="star">
        <el-radio-group
          :disabled="isCheck"
          @change="notifyUserChange"
          v-model="dataInfo.caseModifyRule"
        >
          <el-radio class="radio" :label="1">审核中病例可修改</el-radio>
          <el-radio class="radio" :label="0" style="margin-left:150px">审核中病例不可修改</el-radio>
        </el-radio-group>
        <div style="color: #ccc;">
          <span>审核中病例，用户可继续编辑，二次提交系统</span>
          <span style="margin-left:35px">审核中病例不能修改</span>
        </div>
      </el-form-item>

      <el-form-item label="抓取病例关键字服务:" class="starcase label160">
        <el-radio-group
          :disabled="isCheck || isEdit"
          @change="notifyUserChange"
          v-model="dataInfo.grabKeywords"
        >
          <el-radio class="radio" :label="1">是</el-radio>
          <el-radio class="radio" :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <!-- <el-form-item label="关键字内容:" class="star">
        <div class="">
          <el-tag
            :key="tag"
            v-for="tag in dynamicTags"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)">
          >
            {{111}}
          </el-tag>
        </div>
        <div style="margin-top:10px">
          <el-input :maxlength="50"  placeholder="请输入关键字" style="width:140px"></el-input>
          <el-button type="primary" style="margin-left:10px">添加</el-button>
          <div style="color: #ccc;">
            <span>请设置需抓取病例关键字内容；可添加1~20个；每个关键字，可输入1~50个字</span>
          </div>
        </div>
      </el-form-item>-->

      <el-form-item label="关键字内容:" class="starkey" v-if="dataInfo.grabKeywords">
        <el-tag
          :key="index"
          v-for="(tag,index) in dynamicTags"
          :closable="!isEdit"
          :disable-transitions="false"
          @close="handleClose(tag)"
        >{{tag}}</el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          :maxlength="50"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        ></el-input>
        <el-button
          v-else
          :disabled="keywordShow"
          class="button-new-tag"
          size="small"
          @click="showInput"
        >+ 添加关键字</el-button>
        <div style="color: #ccc;">
          <span>请设置需抓取病例关键字内容；可添加1~20个；每个关键字，可输入1~50个字</span>
        </div>
      </el-form-item>

      <el-form-item label="抓取后审核条件:" class="starcase" v-if="dataInfo.grabKeywords">
        <el-radio-group
          :disabled="isCheck || isEdit"
          @change="notifyUserChange"
          v-model="dataInfo.grabCondition"
          class="keyword-erg"
        >
          <el-radio
            class="radio"
            :label="1"
          >按照您设定关键字数量，全部从病例中成功抓取后，系统自动通过一级审核，二级&三级审核还需人工手动操作；未被抓取或未全部抓取关键字的病例，系统视为病例审核未通过</el-radio>
          <el-radio class="radio" :label="0">只抓取已设置的关键字，审核病例需人工手动操作</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="填写备注:">
        <el-radio-group :disabled="isCheck" @change="notifyUserChange" v-model="dataInfo.isRemark">
          <el-radio class="radio" :label="1">是</el-radio>
          <el-radio class="radio" :label="0">否</el-radio>
        </el-radio-group>
        <div style="color: #ccc;">对提交系统病例填写备注</div>
      </el-form-item>

      <el-form-item label="评分点评:">
        <el-radio-group
          :disabled="isCheck || isEdit"
          @change="notifyUserChange"
          v-model="dataInfo.isComment"
        >
          <el-radio class="radio" :label="1">是</el-radio>
          <el-radio class="radio" :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-show="dataInfo.isComment === 1" label="评分类型:">
        <el-radio-group
          :disabled="isCheck || isEdit"
          @change="notifyUserChange"
          v-model="dataInfo.commentType"
        >
          <el-radio class="radio" :label="0">评分</el-radio>
          <el-radio class="radio" :label="1">评星</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="审核级别:">
        <el-select
          :disabled="isCheck || isEdit"
          v-model="relation.level"
          placeholder="请选择"
          @change="levels"
        >
          <el-option
            v-for="item in level"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="ts">
          <div>设置平台内容审核级别</div>
          <div>说明:</div>
          <div>1、一级审核，提交平台审核信息，审核一轮结束；二级审核，审核2轮结束；三级审核，审核3轮结束</div>
          <div>2、无论选择几级审核，中途出现审核未通过情况，则整个审核过程结束</div>
          <div>3、审核顺序：一级审核完毕-》进入二级审核（审核完毕）---》进入三级审核（审核完毕）---》结束</div>
        </div>
      </el-form-item>
      <el-form-item label="审核地域分配方式:">
        <el-radio-group
          @change="notifyUserChange"
          v-model="dataInfo.distributeType"
        >
          <el-radio class="radio" :label="0" :disabled="arrs.length > 0">按省份</el-radio>
          <el-radio class="radio" :label="1" :disabled="arrs.length > 0">按城市</el-radio>
        </el-radio-group>
        <div class="distributeTypeWrap">
            <el-select
            :disabled="!dataInfo.distributeType || arrs.length > 0"
            v-model="belongsProvincesSelect"
            placeholder="请选择城市归属省份"
            @focus="getBelongsProvinces"
            @change="getBelongsProvincesSelect"
          >
            <el-option
              v-for="item in belongsProvinces"
              :key="item.id"
              :value="item.id"
              :label="item.name"
              :disabled="item.select"
            ></el-option>
          </el-select>
          <span class="tips">按城市审核表单，用户创建表单时不可更改所属省份</span>
        </div>
      </el-form-item>
      <el-form-item v-if="relation.level >= 1" label="审核条件:" class="case_content">
        <div class="condition">
          <div class="level1">
            <span>一级审核：</span>
            <span>
              <el-button :disabled="isCheck" type="info" @click="add(1)">添加审核人</el-button>
            </span>
            <span style="color:#666;margin-left:10px">需审核的内容，将按照选择的地域，自动分配给对应审核人，支持添加1~100人</span>
          </div>
          <div style="height: 20px"></div>
          <div v-for="item in arrs" :key="item.id">
            <el-button
              @click="deleteAudit(1, item.id)"
              :disabled="isCheck || !item.deleteable"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="deleteBtn"
            />
            <span>姓名：{{ item.userName }}</span>
            <span style="margin-left: 10px">手机号：{{ item.phone }}</span>
            <el-button
              type="info"
              @click="Infernal(item.id)"
              :disabled="isCheck || !item.relateable"
              size="small"
              style="margin: 10px;"
            >分配审核地域</el-button>
            <el-tag
              v-if="item.xrelates && dataInfo.distributeType ===0"
              @close="deleteTag(1, v.id, item.id)"
              v-for="v in item.xrelates"
              :key="v.id"
              :closable="v.deleteable"
              type="success"
              style="margin-right: 10px"
            >{{v.provinceName}}</el-tag>

            <el-tag
              v-if="item.xrelates && dataInfo.distributeType ===1"
              @close="deleteTag(1, v.id, item.id)"
              v-for="v in item.xrelates"
              :key="v.id"
              :closable="v.deleteable"
              type="success"
              style="margin-right: 10px"
            >{{v.cityName}}</el-tag>
          </div>
        </div>
        <div class="condition" v-if="relation.level > 1">
          <div class="level1">
            <span>二级审核：</span>
            <span>
              <el-button type="info" @click="add(2)" :disabled="isCheck">添加审核身份</el-button>
            </span>
          </div>
          <div v-for="(item,index) in arr1" :key="index">
            <el-button
              @click="deleteAudit(2, item.id)"
              :disabled="isCheck || !item.deleteable"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="deleteBtn"
            />
            <span>姓名：{{ item.userName }}</span>
            <span style="margin-left: 10px">手机号：{{ item.phone }}</span>
            <el-button
              @click="add2_1(2, item.id)"
              :disabled="isCheck || !item.relateable"
              type="info"
              size="small"
              style="margin: 10px;"
            >关联一级审核身份</el-button>
            <el-tag
              @close="deleteTag(2, v.id, item.id)"
              v-if="item.xrelates"
              v-for="v in item.xrelates"
              :key="v.id"
              :closable="v.deleteable"
              type="success"
              style="margin-right: 10px"
            >{{v.relateConditions.userName}}</el-tag>
          </div>
        </div>
        <div class="condition" v-if="relation.level === 3">
          <div class="level1">
            <span>三级审核：</span>
            <span>
              <el-button :disabled="isCheck" type="info" @click="add(3)">添加审核身份</el-button>
            </span>
          </div>
          <div v-for="(item,index) in arr2" :key="index">
            <el-button
              :disabled="isCheck || !item.deleteable"
              @click="deleteAudit(3, item.id)"
              size="mini"
              type="danger"
              icon="el-icon-delete"
              class="deleteBtn"
            />
            <span>姓名：{{ item.userName }}</span>
            <span style="margin-left: 10px">手机号：{{ item.phone }}</span>
            <el-button
              :disabled="isCheck || !item.relateable"
              @click="add2_1(3, item.id)"
              type="info"
              size="small"
              style="margin: 10px;"
            >关联二级审核身份</el-button>
            <el-tag
              @close="deleteTag(3, v.id, item.id)"
              v-if="item.xrelates"
              v-for="v in item.xrelates"
              :key="v.id"
              :closable="v.deleteable"
              type="success"
              style="margin-right: 10px"
            >{{v.relateConditions.userName}}</el-tag>
          </div>
        </div>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import identity from "./identity";
import serviceContent from "./serviceContent";
import region from "./region";
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
export default {
  name: "relationAudit",
  components: {
    identity,
    serviceContent,
    region
  },
  props: {
    distributeType: {
      // 审核地域分配方式<0省份，1城市>
      type: Number,
      default: 0
    },
    isEdit: {
      // 是否是编辑
      type: Boolean,
      default: false
    },
    isCheck: {
      // 是否是查看状态
      type: Boolean,
      default: false
    },
    auditDetails: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // distributeType: '0',
      outGoingDepartment: [],
      departmentVal:[],
      // dynamicTags: ["标签一", "标签二", "标签三"],
      dynamicTags: [],
      dynamicTagsString: "",
      inputVisible: false,
      inputValue: "",
      keywordShow: false,

      bNum: 1, // bNum 2 代表 二级关联一级的判断条件
      regionId_2ji: "0", // 加载二级关联一级审核人 条件ID
      regionId: "", // 一级关联省份 条件id
      dataInfo: {
        isComment: 0, // 评分点评
        isRemark: 0, // 有无填写备注
        commentType: 0, // 评分类型
        notifyUser: 1,
        caseModifyRule: 0, //病例修改规则
        grabKeywords: 0, //抓取病例关键字
        grabCondition: 0, //抓取后审核条件
        keywords: "", //关键字
        distributeType: 0, //审核地域分配方式<0省份，1城市>
        belongsProvinces: this.belongsProvincesSelect
      },
      shows: false,
      levelsl: null,
      relation: {
        service: "",
        level: ""
      },
      cloumId: "",
      optionData: [],
      contentData: [],
      navigationId: "",
      obj: {},
      contents: "",
      num: null,
      val: null,
      isShow: false,
      checkNames: [],
      isRegion: false,
      arrs: [],
      arr1: [],
      arr2: [],
      levelShow: true,
      options: [
        {
          value: 8,
          label: "病例征集"
        }
      ],
      belongsProvinces: [],
      belongsProvincesSelect: '',
      belongsProvincesName: '',
      level: [
        {
          value: 1,
          label: "一级审核"
        },
        {
          value: 2,
          label: "二级审核"
        },
        {
          value: 3,
          label: "三级审核"
        }
      ],
      arr: [
        { names: "一级审核:", value: 1 },
        { names: "二级审核:", value: 2 },
        { names: "三级审核:", value: 3 }
      ]
    };
  },
  watch: {
    auditDetails(val) {
      if (val.rank) {
        this.dataInfo.rank = val.rank;
        this.showDetails();
      }
    }
  },
  mounted() {
    this.notifyUserChange();
    this.getBelongsProvinces();
    this.dataInfo.distributeType = this.distributeType;
  },
  methods: {
    getBelongsProvinces(){
      http
        .get(api.belongsProvinces + this.$route.params.id)
        .then(res => {
          if (res.data.code === 0) {
            this.belongsProvinces = res.data.data
          } else {
            this.errorMessage(res.data.message);
          }
        });
    },
    getBelongsProvincesSelect(val){
      this.belongsProvincesSelect = val;
      this.belongsProvinces.map(item => {
        if(item.id === this.belongsProvincesSelect){
          this.belongsProvincesName = item.name
        }
      })
      this.dataInfo.belongsProvinces = this.belongsProvincesSelect
      this.notifyUserChange();
    },
    unique(arr) {//数组去重
      return Array.from(new Set(arr));
    },
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
      if (this.dynamicTags.length > 19) {
        this.keywordShow = true;
      } else {
        this.keywordShow = false;
      }
    },
    showInput() {
      if (this.dynamicTags.length > 19) {
        this.errorMessage("最多添加20个关键字");
        this.keywordShow = true;
      } else {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      }
    },
    handleInputConfirm() {
      let inputValue = this.inputValue.replace(/,|，/g, ""); //取消字符串中出现的所有逗号
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      // this.dynamicTagsString = this.dynamicTags.join(";");
      this.dynamicTagsString = this.unique(this.dynamicTags).join(",");//关键字去重后用","拼接
      this.dataInfo.keywords = this.dynamicTagsString;

      this.inputVisible = false;
      this.inputValue = "";
    },

    notifyUserChange() {
      this.$emit("auditInfo", this.dataInfo);
    },
    /*
     * 删除审核人 关联信息
     * */
    deleteTag(type, i, d) {
      http
        .get(
          api.deletecondition + this.$route.params.id + "/" + d + "/" + type + "/" + i + "/" + this.dataInfo.distributeType
        )
        .then(res => {
          if (res.data.code === 0) {
            this.getConditions(type);
            this.successMessage("删除成功");
          } else {
            this.errorMessage(res.data.message);
          }
        });
    },
    /*
     * 删除审核人
     * */
    deleteAudit(type, id) {
      http
        .get(api.deleteIdentify + this.$route.params.id + "/" + type + "/" + id + '/' + this.dataInfo.distributeType)
        .then(res => {
          if (res.data.code === 0) {
            this.getConditions(type);
            this.successMessage("删除成功");
          } else {
            this.errorMessage(res.data.message);
          }
        });
    },
    showDetails() {
      let details = this.auditDetails;
      this.contents = details.sourceName;
      this.relation.level = details.rank;
      this.relation.service = details.businessId === 8 ? "病例征集" : "";
      this.dataInfo = details;
      this.belongsProvincesSelect = this.dataInfo.belongsProvinces;

      this.getBelongsProvincesSelect(this.belongsProvincesSelect);

      if (this.dataInfo.keywords) {
        this.dynamicTags = this.dataInfo.keywords.split(",")
      }


      for (let item of details.xrankVos) {
        switch (item.rank) {
          case 1:
            this.arrs = item.xconditions;
            break;
          case 2:
            this.arr1 = item.xconditions;
            break;
          case 3:
            this.arr2 = item.xconditions;
            break;
        }
      }
    },
    getConditions(rank) {
      http
        .get(api.getConditions + this.$route.params.id + "/" + rank + "/" + this.dataInfo.distributeType)
        .then(res => {
          if (res.data.code === 0) {
            switch (rank) {
              case 1:
                this.arrs = res.data.data;
                break;
              case 2:
                this.arr1 = res.data.data;
                break;
              case 3:
                this.arr2 = res.data.data;
                break;
            }
          } else {
            this.errorMessage(res.data.message);
          }
        });
    },
    add(index) {
      if(!this.belongsProvincesSelect && this.dataInfo.distributeType ===1){
        this.errorMessage("请选择归属省份");
        return false
      }
      this.num = index;
      this.bNum = 1;
      this.isShow = true; // 显示身份弹框
    },
    add2_1(index, id) {
      this.num = index;
      this.bNum = 2;
      this.regionId_2ji = id;
      this.isShow = true; // 显示身份弹框
    },
    isRegions(val) {
      this.isRegion = val;
      this.getConditions(1);
    },
    nums(val) {
      this.num = val;
    },
    isShows(val) {
      this.isShow = false;
      if (val !== false) {
        this.getConditions(val);
      }
    },
    levels(val) {
      this.dataInfo.rank = val;
      this.$emit("auditInfo", this.dataInfo);
      this.levelsl = val;
    },
    checkName(name) {
      this.checkNames = name;
    },
    showsl(val) {
      this.shows = val;
    },
    Choice() {
      if (this.relation.service !== "") {
        this.shows = true;
      } else {
        this.errorMessage("请选择业务");
      }
    },
    closel() {
      this.contents = "";
      this.dataInfo.busId = "";
      this.$emit("auditInfo", this.dataInfo);
    },
    currentRow(val) {
      this.dataInfo.busId = val.busId;
      this.$emit("auditInfo", this.dataInfo);
      this.contents = val.name;
    },
    /*
     * 错误消息提示
     * */
    errorMessage(val) {
      this.$message({
        showClose: true,
        message: val,
        type: "error"
      });
    },
    /*
     * 成功消息提示
     * */
    successMessage(val) {
      this.$message({
        showClose: true,
        message: val,
        type: "success"
      });
    },
    Infernal(val) {
      this.isRegion = true;
      this.regionId = val;
    }
  }
};
</script>

<style scoped>
/* ::v-deep .el-cascader__tags{
  display: none !important
} */
/* ::v-deep .el-cascader__tags .el-tag .el-icon-close{
  display: none;
} */
.tips{
  display: inline-block;
  color: #ccc;
  margin-left: 10px; 
  margin-top: 14px;
  line-height: 1;
  vertical-align: top;
  /* transform: translateY(-14px); */
}
::v-deep .el-cascader{
  line-height: 1
}
::v-deep .el-cascader__tags{
  max-height: 110px;
  overflow-y: auto;
}
.deleteBtn {
  margin-right: 10px;
}
.relationAudit {
  box-sizing: border-box;
}
.relation {
  min-height: 300px;
}
.condition {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  padding: 20px;
  min-height: 400px;
  background: #f2f2f2;
  margin: 20px 0;
  position: relative;
}
.contents {
  padding-left: 5px;
  line-height: 40px;
  width: 300px;
  background: #8391a5;
  border-radius: 5px;
  overflow: hidden;
}
.closel {
  float: right;
  color: #fff;
  cursor: pointer;
  font-size: 30px;
}
.shows {
  margin: 0 auto;
}
.ts {
  color: #666;
}
.das {
  height: 50px;
  margin: 10px 0;
}
.das div:nth-of-type(1) {
  position: absolute;
  top: 50px;
  left: 30px;
  margin: 10px 0;
}
.checkNames {
  display: inline-block;
  width: 120px;
  height: 37px;
  line-height: 37px;
  border-radius: 3px;
  background: #666;
  color: #ffffff;
  overflow: hidden;
}
.check {
  text-align: center;
  float: left;
}
.star {
  position: relative;
}
.star::before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  left: 25px;
  top: 10px;
}

.starkey {
  position: relative;
}
.starkey::before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  left: 40px;
  top: 10px;
}

.starcase {
  position: relative;
}
.starcase::before {
  content: "*";
  color: #f56c6c;
  position: absolute;
  left: 5px;
  top: 10px;
}
/deep/ .label160 .el-form-item__label {
  width: 160px !important;
}

.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
/deep/ .keyword-erg .el-radio {
  display: block;
  margin-top: 14px;
}
.distributeTypeWrap{
  display: inline-block;
  vertical-align: -webkit-baseline-middle;
  margin-left: 10px;
}
</style>

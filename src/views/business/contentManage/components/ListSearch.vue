<template>
  <div>
    <el-form :inline="true" :model="searchInfo" class="demo-form-inline">
      <el-form-item label="标题">
        <el-input v-model="searchInfo.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="栏目">
        <el-select
          v-model="searchInfo.firstNav"
          placeholder="请选择一级栏目"
          class="searchStyle"
          style="width:200px;height:100%;"
          @change="firstNavChange"
          clearable
        >
          <el-option
            v-for="item in firstNav"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <el-select
          v-model="searchInfo.secondNav"
          placeholder="请选择二级栏目"
          class="searchStyle"
          style="width:200px;height:100%;margin-left:10px"
          clearable
        >
          <el-option
            v-for="item in secondNav"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="内容类型">
        <el-select
          v-model="searchInfo.contentTypes"
          placeholder="请选择培训分类"
          class="searchStyle"
          style="width:200px;height:100%;"
        >
          <el-option
            v-for="item in contentTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from "@/utils/tenant";
import api from "@/api/tenantInfoSave";
export default {
  name: "ListSearch",
  data() {
    return {
      value: "",
      options: [],
      selected: [],
      firstNav: [],
      secondNav: [],
      contentTypes: [],
      searchInfo: {
        // columnId: [],
        title: null,
        firstNav: null,
        secondNav: null,
        contentTypes: null
      }
    };
  },
  created() {
    this.getParentList();
    // this.getChildList();
    this.getContentTypes();
  },
  methods: {
    firstNavChange: async function(parentId) {
      //获取二级栏目
      this.secondNav = []
      this.searchInfo.secondNav = null
      var res = await http.get(api.getChildByParentId + parentId);
      if (res.data.code === 0) {
        this.secondNav = res.data.data.filter(items => items.isdelete == 0)
      } else {
        // this.$message.error(message);
      }
    },
    getParentList: async function(page) {
      //获取一级栏目
      var params = {
        // pageNum: page,
        pageSize: 10000
      };
      var res = await http.post(api.getAllparents, params);
      if (res.data.code === 0) {
        this.firstNav = res.data.data.list.filter(items => items.isdelete == 0);
      } else {
        // this.$message.error(message);
      }
    },
    getChildList: async function(page) {
      //获取二级栏目
      var params = {
        // pageNum: page,
        // pageSize: 10
        pageSize: 10000
      };
      var res = await http.post(api.childList, params);
      if (res.data.code === 0) {
        this.secondNav = res.data.data.list.filter(items => items.isdelete == 0);
      } else {
        // this.$message.error(message);
      }
    },
    getContentTypes: async function(page) {
      //获取内容类型
      var res = await http.get(api.getContentTypes);
      if (res.data.code === 0) {
        this.contentTypes = res.data.data;
      } else {
        // this.$message.error(message);
      }
    },
  
    onSubmit() {
      this.$emit("change", this.searchInfo);
    }
  }
};
</script>

<style scoped>
</style>

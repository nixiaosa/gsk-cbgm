<template>
  <el-breadcrumb class="app-levelbar" separator-class="el-icon-arrow-left">
    <el-breadcrumb-item v-for="(item,index)  in levelList" :key="item.path">
      <span v-if='item.redirect==="noredirect"||index==levelList.length-1' class="no-redirect">{{item.name}}</span>
      <router-link v-else :to="item.redirect||item.path">{{item.name}}</router-link>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    if (this.$route.meta.title) {
      setTimeout(() => {
        this.getBreadcrumb()
      }, 100)
    } else {
      this.getBreadcrumb()
    }
  },
  data() {
    return {
      levelList: null
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => {
        if (item.meta.title) {
          return item.name = item.meta.title
        } else {
          return item.name
        }
      })
      const first = matched[0]
      if (first && (first.name !== '首页' || first.path !== '')) {
        matched = [{ name: '首页', path: '/' }].concat(matched)
      }
      this.levelList = matched
    }
  },
  watch: {
    $route() {
      if (this.$route.meta.title) {
        setTimeout(() => {
          this.getBreadcrumb()
        }, 100)
      } else {
        this.getBreadcrumb()
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.app-levelbar.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 50px;
  margin-left: 10px;
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
.router-link-active{
  cursor: default !important;
  pointer-events:none;
}
</style>

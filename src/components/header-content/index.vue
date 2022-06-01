<template>
  <div class="header-content">
      <div class="header-content-title">{{title}}</div>
      <div>
        <el-button size="small" @click="header_btn_click(name)" v-for="(name, index) in opertions" :key="index" type="primary">{{name}}</el-button>
      </div>
    </div>
</template>
<script>
  export default {
    props: {
      title: {
        type: String,
        default: ''
      },
      opertions: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    watch: {
    },
    data() {
      return {
      }
    },
    created: function() {
    },
    methods: {
      header_btn_click(name) {
        this.$emit('header-btn-click', name)
        this.$emit('change', name)
      }
    }
  }
</script>

<style scoped>
  .header-content {
    display: flex;
    justify-content: space-between;
    height: 70px;
    line-height: 90px;
    border-bottom: 1px solid #ccc;
    margin-bottom: 20px;
  }
</style>

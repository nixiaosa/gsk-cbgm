<template>
  <div>
    <header-content title="标题管理"/>
    <table-list name="NavigationTitleManage" :data="listData" @change="tabelListChange"/>
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content";
import TableList from "@/components/table-content/TableList";

export default {
  name: "navigationTitleManage",
  components: {TableList, HeaderContent},
  data() {
    return {
      listData: []
    }
  },
  mounted() {
    this.get()
  },
  methods: {
    get() {
      this.$http.get(this.$api.navigation.title.list).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          data.forEach(item => {
            switch (item.type) {
              case 1:
                item.type = '网站首页'
                break
            }
            item.templateName = '模板' + item.templateId
          })
          this.listData = data
        } else {
          this.$message.error(message)
        }
      })
    },
    tabelListChange(item) {
      console.log(item);
      this.$router.push({path: `navigationTitleCreate/${item.id}/${item.templateId}`})
    }
  }
}
</script>

<style scoped>

</style>

<template>
    <div>
      <el-table
        :data="tableDatas.data"
        border
      >
        <el-table-column v-for="(title, index) in tableDatas.title" :key="index" :label="title">
          <template slot-scope="scope">
            <span>{{ scope.row[index] }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
</template>

<script>
  export default {
    name: 'ContractDetailTabList',
    props: {
      tableDatas: {
        type: Object,
        default: function() {
        }
      }
    }
  }
</script>

<style scoped>

</style>

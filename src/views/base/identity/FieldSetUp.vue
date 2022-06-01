<template>
  <div>
    <el-dialog
        title="设置身份字段"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
      <el-form :model="form" label-width='100px'>
        <el-form-item label="身份名称:">
          <span>{{form.name}}</span>
        </el-form-item>
      </el-form>
      <el-form :model="form" label-width='30px'>
        <el-form-item>
          <el-checkbox-group v-model="checkList">
            <el-checkbox v-for="item in fieldData" :key="item.id" :label="item.id">{{item.value}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="handleClose">取 消</el-button>
    <el-button type="primary" @click="save">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "AddIdentity",
  props: {
    ids: {
      type: Array,
      default: () => []
    },
    fieldData: {
      type: Array,
      delete: () => []
    }
  },
  data() {
    return {
      dialogVisible: true,
      checkList: [],
      form: {},
    }
  },
  mounted() {
    this.checkList = this.ids
  },
  methods: {
    save() {
      if (this.checkList.length < 1) {
        this.$message.error('您还没有勾选身份')
      } else {
        this.$emit('change',{ids: this.checkList})
      }
    },
    handleClose() {
      this.$emit('on-hidden', {hidden: false})
    }
  }
}
</script>

<style scoped>

</style>

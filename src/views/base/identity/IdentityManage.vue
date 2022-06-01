<template>
  <div>
    <header-content title="用户身份管理"/>
    <div class="btn-list">
      <p>此模块是身份设置，您可以依据平台需要，设置平台用户有哪些身份。</p>
      <p>注意：1. 默认所有平台用户身份是医生，在使用中，可以根据需要，设置其他身份；</p>
      <p style="margin-left: 50px">2. 身份不能增加、修改和删除；</p>
      <p style="margin-left: 50px">3. 除【游客】身份外，平台至少保留1种身份。</p>
    </div>
    <div>
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="titleId"
            label="Id">
        </el-table-column>
        <el-table-column
            prop="titlename"
            label="用户身份">
        </el-table-column>

        <el-table-column
            prop="address"
            label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.type" size="mini" type="success" @click="save(scope.row.titleId)">使用该身份</el-button>
            <el-button v-if="scope.row.type" size="mini" type="danger" @click="cancel(scope.row.titleId)">不使用该身份</el-button>
<!--            <el-button v-if="scope.row.type" size="mini" @click="setting(scope.row)">字段设置</el-button>-->
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  设置身份字段  预留-->
<!--    <field-set-up v-if="showFieldSetUp" :ids="idsInIdentity" :field-data="fieldData" @change="fieldChange"-->
<!--                  @on-hidden="fieldSetUpHidden"/>-->
  </div>
</template>

<script>
import HeaderContent from "@/components/header-content/HeaderComponent";
// import FieldSetUp from "./FieldSetUp";
import {formatDate} from '@/common/data'

export default {
  name: "IdentityManage",
  components: {
    HeaderContent,
    // FieldSetUp,
  },
  data() {
    return {
      showFieldSetUp: false,
      tableData: [],
      fieldData: [], // 身份字段
      titleId: '', // 点击字段设置的 当前ID
      idsInIdentity: [], // 关联的id
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh : mm");
    }
  },
  mounted() {
    this.get()
    // this.getField() // 获取全部的关联字段
  },
  methods: {
    fieldChange(val) {
      // 关联身份字段 组件
      let params = {
        titleId: this.titleId,
        valueIds: val.ids
      }
      this.$http.post(this.$api.identity.importField, params).then(res => {
        let {code} = res.data
        if (code === 0) {
          this.showFieldSetUp = false
          this.$message.success('字段设置成功')
        }
      })
    },
    getField() {
      // 获取身份字段
      this.$http.get(this.$api.field.get).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          this.fieldData = data
        }
      })
    },
    getIdsInIdentity(id) {
      // 获取已关联的字段
      this.idsInIdentity = []
      this.$http.get(this.$api.identity.getImportField + id).then(res => {
        let {code, data} = res.data
        if (code === 0) {
          data.forEach(item => {
            this.idsInIdentity.push(item.valueId)
          })
        }
      })
    },
    setting(val) {
      this.getIdsInIdentity(val.id)
      this.titleId = val.id
      this.showFieldSetUp = true
      // 字段设置
    },
    cancel(id) {
      // 取消使用该身份
      let parmas = {
        titleId: id
      }
      this.$http.post(this.$api.identity.cancel, parmas).then(res => {
        let {code, message} = res.data
        if (code === 0) {
          this.$message.success('操作成功')
          this.get()
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    save(id) {
      // 使用该身份
      let parmas = {
        titleId: id
      }
      this.$http.post(this.$api.identity.save, parmas).then(res => {
        let {code, message} = res.data
        if (code === 0) {
          this.$message.success('操作成功')
          this.get()
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    get() {
      // 获取所有身份
      this.$http.get(this.$api.identity.get).then(res => {
        let {code, data, message} = res.data
        if (code === 0) {
          this.tableData = data
        } else {
          this.$message.error(message)
        }
      }).catch(err => {
        this.$message.error(err.message)
      })
    },
    fieldSetUpHidden(val) {
      this.showFieldSetUp = val.hidden
    },
  }
}
</script>
<style scoped lang="scss">
.btn-list {
  width: 100%;
  //display: flex;
  //justify-content: flex-end;
}
</style>

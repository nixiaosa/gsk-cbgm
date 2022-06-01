<template>
  <div class="weixin">
    <el-dialog :title="formAddObj.title" :visible.sync="dialog" @close="close" >

      <el-form label-position="left" label-width="80px" :model="formAddObj">

        <el-form-item label="消息名称">
          <el-input class="inputWidth" v-model="formAddObj.messageName"></el-input>
        </el-form-item>

        <el-form-item label="消息类型" v-show="formAddObj.title !== '编辑消息'">
          <el-select v-model="formAddObj.messageType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="关键字" v-show="formAddObj.messageType === 1">
          <el-input class="inputWidth" v-model="formAddObj.keyword"></el-input>
        </el-form-item>

        <el-form-item label="消息内容">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 1, maxRows: 2}" class="inputWidth" v-model="formAddObj.messageContent"></el-input>

        </el-form-item>

        <el-form-item label="备注">
          <el-input type="textarea" resize="none" :autosize="{ minRows: 1, maxRows: 2}" class="inputWidth" v-model="formAddObj.mark"></el-input>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="this.close">取 消</el-button>
          <el-button type="primary" @click="addOk">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { mapGetters } from 'vuex'

  export default {
    name: 'MessageDialog',
    computed: {
      ...mapGetters([
        'companyid'
      ])
    },
    props: {
      dialogVisible: {
        type: Boolean
      },
      formAddObj: {
        type: Object
      }
    },
    data() {
      return {
        title: '',
        dialog: false,
        options: [{
          value: 0,
          label: '首次关注消息'
        }, {
          value: 1,
          label: '关键字消息'
        }]
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      addOk() {
        let params = this.formAddObj
        let _path = api.addWXmessage
        let reqData = {
          messageName: params.messageName,
          messageType: params.messageType,
          keyword: params.keyword,
          messageContent: params.messageContent,
          mark: params.mark
        }
        reqData.messageType !== 1 ? delete reqData.keyword : ''

        reqData.companyId = this.companyid
        if (!this.yanzheng(reqData)) {
          return
        }

        if (params.id) {
          _path = api.updateWXmessage
          reqData.id = params.id
        }
        http.post(_path, reqData)
          .then(res => {
            if (res.data.code === 0) {
              this.dialog = false
              this.$message('保存成功')
              this.$emit('save')
            } else {
              this.$message.error(res.data.message)
            }
          })
      },
      yanzheng(reqData) {
        if (reqData.messageName.trim() === '') {
          this.$message.error('请填写消息名称')
          return false
        } else if (reqData.messageContent.trim() === '') {
          this.$message.error('请填消息内容')
          return false
        } else if (reqData.messageType === 1 && reqData.keyword.trim() === '') {
          this.$message.error('请填关键字')
          return false
        } else {
          return true
        }
      }
    },
    watch: {
      dialogVisible(newVal) {
        this.dialog = newVal
      }
    }
  }
</script>
<style>
  .weixin .el-dialog--small {
    width: 320px;
  }
</style>
<style scoped>
  .inputWidth {
    width: 196px;
  }

  .modelist {
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
    padding: 20px;
  }

  .piont-flex {
    display: flex;
    justify-content: space-between;
    height: 36px;
    margin-bottom: 15px;
  }

  .piont-flex .point-title {
    height: 36px;
    line-height: 36px;
  }
</style>

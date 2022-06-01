<template>
  <div class="weixin">
    <el-dialog
      :title="formAddMenu.title"
      :visible.sync="dialog"
      @close="close">
      <el-form label-position="left" label-width="80px" :model="formAddMenu">
        <el-form-item label="菜单级别" v-show="formAddMenu.title !== '编辑菜单'">
          <el-select @change="selectRank" v-model="formAddMenu.level" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="formAddMenu.level == 2" label="所属菜单">
          <el-select v-model="formAddMenu.parentLevel" placeholder="请选择">
            <el-option v-for="item in menuLevelOne" :key="item.id" :label="item.menuName" :value='item.id'></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input class="inputWidth" v-model="formAddMenu.menuName"></el-input>
        </el-form-item>
        <el-form-item label="页面链接">
          <el-input class="inputWidth" v-model="formAddMenu.menuEditUrl"></el-input>
        </el-form-item>
        <el-form-item label="菜单描述">
          <el-input  type="textarea" resize="none" :autosize="{ minRows: 1, maxRows: 2}" class="inputWidth" v-model="formAddMenu.description"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="this.close">取 消</el-button>
          <el-button type="primary" @click="addWXMenu">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
  import http from '@/utils/tenant'
  import api from '@/api/tenantInfoSave'
  import { mapGetters } from 'vuex'

  export default {
    name: 'MenuDialog',
    computed: {
      ...mapGetters([
        'companyid'
      ])
    },
    props: {
      menuDiaTitle: {
        type: String
      },
      dialogVisible: {
        type: Boolean
      },
      formAddMenu: {
        type: Object
      }
    },
    data() {
      return {
        title:'',
        dialog: false,
        options: [{
          value: 1,
          label: '一级'
        }, {
          value: 2,
          label: '二级'
        }],
        menuLevelOne: []
      }
    },
    methods: {
      close() {
        this.$emit('close')
      },
      selectRank(res) {
        if (res == 2) {
          this.getWXMenuOneList()
        }
      },
      getWXMenuOneList() {
        http.post(`${api.getWXMenuOneList}${this.companyid}`)
          .then(res => {
            if (res.data.code === 0) {
              this.menuLevelOne = res.data.data
            }
          })
      },
      addWXMenu() {
        let params = this.formAddMenu
        let _path = api.addWXMenu
        let reqData = {
          level: params.level,
          parentLevel: params.parentLevel,
          menuName: params.menuName,
          menuEditUrl: params.menuEditUrl,
          description: params.description
        }
        reqData.companyId = this.companyid
        if(!this.yanzheng(reqData)){
          return
        }
        reqData.level === 1 ? reqData.parentLevel = '' : ''
        if(params.id){
          _path = api.updateWXMenu
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
      yanzheng(reqData){
        console.log(reqData.menuEditUrl.length)
        if (reqData.menuName.trim() === '') {
          this.$message.error('请填写菜单名称')
          return false
        } else if (reqData.menuEditUrl.trim() === '') {
          this.$message.error('请填菜单连接')
          return false
        } else if (reqData.description.trim() === '') {
          this.$message.error('请填写菜单描述')
          return false
        } else if (reqData.level == 2 && reqData.parentLevel === '') {
          this.$message.error('请选择所属菜单')
          return false
        }else if(reqData.level == 1 && reqData.menuName.length>4){
          this.$message.error('一级菜单最多4个字')
          return false
        }else if(reqData.level == 2 && reqData.menuName.length>7){
          this.$message.error('二级菜单最多7个字')
          return false
        }else if(reqData.menuEditUrl.length>200){
          this.$message.error('连接字符最多200个')
          return false
        }else if(reqData.description.length>200){
          this.$message.error('菜单描述文字最多200个')
          return false
        }
        console.log(reqData.menuEditUrl.length)
        return true
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

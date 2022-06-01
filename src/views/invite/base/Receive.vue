<template>
  <div>
    <div v-for="(items,index) in addoptions.conditions" id="Receive" style="`height:{height}`">
      <div class="close" @click="close(items,index)" v-if="!id">x</div>
      <div class="close" @click="closes(items,index)" v-if="id">x</div>
      <el-form-item v-for="item in itemData" :key="item.id" :label="item.label" style="width: 50%;float:left;margin-top:30px;" prop="name">
        <select-tree width="430" :options="options" :props="defaultProps" @selecteds="selecteds(index,arguments)" v-if="item.label=='受邀者身份'" v-model="items.pro.identityRelation" />
        <select-tree width="430" :options="options" :props="defaultProps" @selected="selected(index,arguments)" v-if="item.label=='邀请者身份'" v-model="items.identity" />
        <el-input :placeholder="item.placeholder" style="width: 430px;float:left;" v-if="item.label == '积分份数'" v-model="items.numMax" @change="numMax($event,items)">
        </el-input>
        <el-input :placeholder="item.placeholder" style="width: 430px;float:left;" v-if="item.label == '医百医币份数'" v-model="items.numMax" @change="numMax($event,items)">
        </el-input>
        <span v-if="item.label == '积分份数'" class="integral">份</span>
         <span v-if="item.label == '医百医币份数'" class="integral">份</span>
        <el-input :placeholder="item.placeholder" style="width: 430px;float:left;" v-if="item.label=='每人领取'" v-model="items.pointEvery" @change="numMax($event,items)">
        </el-input>
        <span v-if="item.label=='每人领取'" class="integral">{{ addoptions.pointType == 0  ? '医币' : '积分' }}</span>
        <el-input :placeholder="item.placeholder" style="width: 430px;float:left;" v-if="item.label=='每人最多领取份数'" v-model="items.numMaxEvery" @change="numMaxEvery">
        </el-input>
        <span v-if="item.label=='每人最多领取份数'" class="integral">份</span>
      </el-form-item>
      <div id="totals" v-if="addoptions.pointType == 1">总积分:{{items.pointMax}}积分</div>
      <div id="totals" v-if="addoptions.pointType == 0">总医币:{{items.pointMax}}医币</div>
    </div>
  </div>
</template>
<script>
import SelectTree from './tree'
import { isnumber } from '@/utils/validate'
export default {
  components: {
    SelectTree
  },
  props: {
    addoptions: Object,
    addoptionsDel: Object,
    addoptions: {
      type: Object
    },
    conditions: {
      type: Array
    },
    formValue: {
      type: Object
    },
    options: {
      type: Array
    },
    itemData: {
      type: Array
    }
  },
  data() {
    const isLengthOut = (rule, value, callback) => {
      if (!value.trim()) {
        callback(new Error(''))
      } else {
        callback()
      }
    }
    return {
      defaultProps: {
        children: 'childRole',
        label: 'name',
        value: 'id'
      },
      id: this.$route.query.id,
      totals: '',
      rules: [{ required: true, trigger: 'blue', message: '' }]
    }
  },
  methods: {
    selected: function(index, valueModel) {
      // 获取邀请者 id
      this.addoptions.conditions[index].identity = valueModel[0]
    },
    selecteds: function(index, valueModel) {
      // 获取受邀者 id
      this.addoptions.conditions[index].pro.identityRelation = valueModel[0]
    },
    close(item, index) {
      if (!this.id) {
        if (this.addoptions.conditions.length > 1) {
          this.addoptions.conditions.splice(index, 1)
        } else if ((this.addoptions.conditions.length = 1)) {
          this.$message.error('添加条件最少为1个')
        }
      }
    },
    closes(item, index) {
      if (this.id) {
        if (this.addoptions.conditions.length > 1) {
          this.addoptions.conditions[index].isdelete = true
          this.addoptionsDel.conditions.push(this.addoptions.conditions[index])
          this.addoptions.conditions.splice(index, 1)
        } else if ((this.addoptions.conditions.length = 1)) {
          this.$message.error('添加条件最少为1个')
        }
      }
    },
    numMax(val, item) {
      if (item.numMax !== '') {
        if (!isnumber(item.numMax)) {
          this.$message.error('积分份数请输入纯数字')
          return false
        }
        if (item.numMax == 0) {
          this.$message.error('积分份数不能输入0')
          return false
        }
        if (item.numMax.length > 9) {
          this.$message.error('积分份数不能超过9位')
          return false
        }
      }
      if (item.pointEvery !== '') {
        if (!isnumber(item.pointEvery)) {
          this.$message.error('每人领取请输入纯数字')
          return false
        }
        if (item.pointEvery == 0) {
          this.$message.error('每人领取不能输入0')
          return false
        }
        if (item.pointEvery.length > 9) {
          this.$message.error('每人领取不能超过9位')
        }
      }
      if (
        (item.numMax !== '' || item.numMax !== null) &&
        (item.pointEvery !== '' || item.pointEvery !== null)
      ) {
        let obj = this.addoptions.conditions
        for (var i = 0; i < obj.length; i++) {
          let num = i
          obj[num].pointMax = obj[num].pointEvery * obj[num].numMax
        }
      }
      let objs = this.addoptions.conditions
      if (objs.length != 0) {
        this.totals = 0
        for (var i = 0; i < objs.length; i++) {
          if (objs[i].pointMax) {
            this.totals += objs[i].pointMax
          }
        }
      }
      this.$emit('totals', this.totals)
    },
    numMaxEvery: function(val) {
      if (!isnumber(val)) {
        this.$message.error('每人最多领取份数请输入纯数字')
        return false
      }
      if (val == 0) {
        this.$message.error('每人最多领取份数不能输入0')
        return false
      }
      if (val.trim().length > 9) {
        this.$message.error('每人最多领取份数不能超过9位')
      }
    }
  }
}
</script>
<style>
</style>

<style scoped>
#Receive {
  overflow: hidden;
  margin: 20px 20px;
  border: 1px solid #ccc;
  overflow: hidden;
  position: relative;
}
#Receive .close {
  position: absolute;
  right: 5px;
  width: 30px;
  font-size: 30px;
  height: 30px;
  font-weight: 400;
  color: #bbbbbb;
  text-align: center;
  line-height: 30px;
  cursor: pointer;
}
#Receive #totals {
  position: absolute;
  right: 260px;
  bottom: 20px;
  color: red;
  font-size: 16px;
}
#Receive .integral {
  margin-left: 5px;
}
</style>



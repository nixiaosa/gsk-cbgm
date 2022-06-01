<template>
  <div class="container">
    <div class="row">
      <div class="col">
        <el-select v-model="f.p" @change="selpro" :placeholder="selproP || '省份'" style="width: 120px" :disabled="disabled">
          <el-option
            v-for="(v,i) in pro"
            :key="v.id"
            :label="v.name"
            :value="i">
          </el-option>
        </el-select>
      </div>


      <div class="col">
        <el-select v-model="f.c" @change="selcity" :placeholder="selcityP || '城市'" :disabled="f.p===''" style="width: 120px;margin-left: 20px">
          <el-option
            v-for="(v,i) in city"
            :key="v.id"
            :label="v.name"
            :value="i">
          </el-option>
        </el-select>
      </div>

      <div class="col">
        <el-select v-model="f.cc" v-show="county.length>0" @change="result" :disabled="f.p===''" :placeholder="resultP || '区县'" style="width: 120px;margin-left: 20px">
          <el-option
            v-for="(v,i) in county"
            :key="v.id"
            :label="v.name"
            :value="i">
          </el-option>
        </el-select>
      </div>

    </div>

  </div>
</template>

<style scoped>
  .col {
    float: left;
  }
</style>

<script>
  import data from './data'
  export default {
    props: {
      selproP: {
        type: String,
        default: '省份'
      },
      selcityP: {
        type: String,
        default: '城市'
      },
      resultP: {
        type: String,
        default: '区县'
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      isClear: {
        handler() {
          this.clear()
        },
        immediate: true
      }
    },
    data: function () {
      return {
        data: data,
        pro: '',
        city: '',
        county: '',
        f: {
          p: '',
          c: '',
          cc: ''
        }
      }
    },
    created: function () {
      this.pro = this.data
      this.city = this.pro[0]['child']
      this.county = this.city[0]['child']
//      this.result()
    },
    methods: {
      uploadInfo(p, c, cc) {
        this.f.p = p
        this.f.c = c
        this.f.cc = cc
        for (var i in this.data) {
          if (this.data[i].name === p) {
            this.city = this.pro[i]['child']
            for (var y in this.city) {
              if (this.city[y].name === c) {
                this.county = this.city[y]['child']
              }
            }
          }
        }
      },
      clear() {
        this.pro = ''
        this.city = ''
        this.county = ''
        this.f.p = ''
        this.f.c = ''
        this.f.cc = ''
        this.pro = this.data
        this.city = this.pro[0]['child']
        this.county = this.city[0]['child']
      },
      selpro: function () {
        this.city = this.pro[this.f.p]['child']
        this.county = this.city[0]['child']
        this.f.c = 0
        this.f.cc = 0
        this.result()
      },
      selcity: function () {
        console.log(this.f.p)
        this.county = this.city[this.f.c]['child'] ? this.city[this.f.c]['child'] : []
        this.f.cc = 0
        this.result()
      },
      result: function () {
        var pIndex = this.f.p
        var cIndex = this.f.c
        if (!this.f.p >= 0) {
          for (var i in this.pro) {
            if (this.pro[i].name === this.f.p) {
              pIndex = i
            }
          }
        }
        if (!this.f.c >= 0) {
          for (var x in this.city) {
            if (this.city[x].name === this.f.c) {
              cIndex = x
            }
          }
        }
        var re = {
          pro: {id: this.pro[pIndex].id, name: this.pro[pIndex].name},
          city: {id: this.city[cIndex].id, name: this.city[cIndex].name}
        }
        if (this.county.length > 0) {
          re.county = {id: this.county[this.f.cc].id, name: this.county[this.f.cc].name}
        } else {
          re.county = {id: '', name: ''}
        }
        this.$emit('select', re)
      }
    }
  }
</script>

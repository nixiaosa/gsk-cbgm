<template>
    <div class="caseregion">
        <el-dialog title="分配审核地域" :visible.sync="isRegion" :before-close="close">
            <div class="region_center">
                <div style="clear: both" v-if="distributeType === 0">
                    <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                    </el-checkbox>
                    <div style="margin: 15px 0;"></div>
                    <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
                        <div v-for="city in options" style="margin-bottom: 10px;width: 200px;float: left">
                            <el-checkbox :label="city.id" :key="city.id" :disabled="city.select">{{city.name}}
                            </el-checkbox>
                        </div>
                    </el-checkbox-group>
                </div>
                <div style="clear: both" v-if="distributeType === 1">
                    <span>{{ provinceName }}</span>
                    <el-select
                        class="provinceName"
                        v-model="checkedCities2" 
                        multiple 
                        placeholder="请选择城市" 
                        @focus="getBelongsCity(provinceId)"
                        @change="citySelect"
                        >
                        <el-option
                            v-for="item in options2"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id"
                            :disabled="item.select"
                        ></el-option>
                    </el-select>
                </div>
                <!--          <input type="checkbox" v-model="checkAll" @click="handleCheckAll" class="checkAll"><span class="alls">全选:</span>-->
                <!--          <div class="item" v-for="item in options">-->
                <!--            <input type="checkbox" :value="item.name" v-model="checkArr" class="el_input">-->
                <!--            <span class="item-title">{{ item.name }}</span>-->
                <!--          </div>-->
                <div class="btns">
                    <el-button type="primary" style="width: 140px;margin-left: 150px" @click="save">保存</el-button>
                    <el-button type="primary" style="width: 140px;" @click="cance">取消</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import http from '@/utils/tenant'
    import api from '@/api/tenantInfoSave'

    export default {
        name: "region",
        props: {
            provinceName: {
                type: String,
                defaule: ''
            },
            provinceId: {
                type: String,
                defaule: ''
            },
            distributeType: {
                // 审核地域分配方式<0省份，1城市>
                type: Number,
                default: 0
            },
            regionId: {
                type: String,
                defaule: ''
            },
            isRegion: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                checkedCities: [],
                checkedCities2: [],
                isIndeterminate: true,
                options: [],
                options2: [],
                checkAll: false,
                checkArr: [],
            }
        },
        mounted() {
            this.auditarea();
        },
        methods: {
            getBelongsCity(provinceId){
                http
                    .get(api.distributeCity + this.regionId + '/' + provinceId)
                    .then(res => {
                    if (res.data.code === 0) {
                        this.options2 = res.data.data
                    } else {
                        this.errorMessage(res.data.message);
                    }
                    });
            },
            citySelect(event){
                // console.log(event)
                this.checkedCities2 = event;
                console.log(this.checkedCities2)
            },
            handleCheckAllChange(event) {
                console.log(event);
                let optionsList = []
                for (let list of this.options) {
                    if (!list.select) {
                        optionsList.push(list.id)
                    }
                }
                this.checkedCities = event ? optionsList : [];
                this.isIndeterminate = false
            },
            handleCheckedCitiesChange(value) {
                console.log(value)
                // let checkedCount = value.length;
                // this.checkAll = checkedCount === this.cities.length;
                // this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length;
            },
            // handleCheckAll() {
            //   if (this.checkAll) {
            //     this.checkArr = this.options.map(item => {
            //       return item.label
            //     })
            //   } else {
            //     this.checkArr = []
            //   }
            // },
            auditarea: async function () { //加载审核区域
                const res = await http.get(api.getProvince + this.regionId)
                if (res.data.code === 0) {
                    this.options = res.data.data
                    console.log(res.data.data)
                } else {
                    this.$message.error(res.data.message)
                }
            },
            close() {
                this.$emit('isRegions', false)
            },
            cance() {
                this.$emit('isRegions', false)
            },
            save() {
                let params = {
                    conditionId: this.regionId,
                    auditTaskId: this.$route.params.id,
                    rank: 1,
                    relateProvinces: this.checkedCities,
                    relateCities: this.checkedCities2,
                    distributeType: this.distributeType
                }
                http.post(api.relateSave, params).then(res => {
                    if (res.data.code === 0) {
                        this.$emit('isRegions', false)
                    } else {
                        this.errorMessage(res.data.message)
                    }
                })
                // this.$emit('checkName',this.checkArr)
            },
            /*
            * 错误消息提示
            * */
            errorMessage(val) {
                this.$message({
                    showClose: true,
                    message: val,
                    type: 'error'
                })
            },
            // auditcloum: async function(){
            //   let id = '8'
            //   const res = await http.get(api.auditcloum + id)
            //   if (res.data.code === 0) {
            //     console.log(res.data.data)
            //   } else {
            //     this.$message.error(res.data.message)
            //   }
            // }
        },
        watch: {
            // checkArr() {
            //   if (this.checkArr.length === this.options.length) {
            //     this.checkAll = true
            //   } else {
            //     this.checkAll = false
            //   }
            // }
        }
    }
</script>
<style>
    .caseregion .el-checkbox + .el-checkbox {
        margin-left: 0;
    }

    .caseregion .el-dialog__body {
        padding: 0;
    }
</style>
<style scoped>
    .provinceName{
        display: inline-block;
        vertical-align: -webkit-baseline-middle;
        margin-left: 10px;
        margin-top: -10px;
    }
    .region_title {
        height: 50px;
        background: #199ED8;
        line-height: 50px;
        overflow: hidden;
    }

    .close {
        float: right;
        font-size: 40px;
        margin-right: 20px;
        color: black;
        cursor: pointer;
    }

    .item {
        width: 500px;
        margin: 10px;
    }

    .item:after {
        content: '';
        display: block;
        clear: both;
    }

    .el_input {
        margin-right: 20px;
        width: 15px;
        height: 15px;
        float: left;
        margin-top: 8px;
    }

    .item-title {
        float: left;
        margin-top: 8px;
        margin-left: 20px;
    }

    .checkAll {
        width: 15px;
        height: 15px;
        margin: 8px 0 0 10px;
    }

    .alls {
        margin-left: 52px;
    }

    .region_center {
        overflow: hidden;
        padding: 20px;
    }

    .btns {
        float: left;
        width: 100%;
        margin: 30px auto;
    }
</style>

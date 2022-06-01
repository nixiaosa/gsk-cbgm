<template>
    <div class="caseMain main" >
        <header-content v-show="!activeId && !$route.matched[1].meta.navbarHidden" :title="headerTitle"
            :opertions="opertions" @header-btn-click="headerClick()"></header-content>
        <header-content v-show="!activeId && $route.matched[1].meta.navbarHidden" :title="headerTitle"></header-content>
        <div class="tab_case">                                                  
            <div v-if="caseType===3 && caseAll=== '1'" class="button_class"><el-button  @click="exportPng" :loading="html2canvasloading" type="primary">下载表单</el-button> </div>
            <!-- <div v-if="caseType===3 && caseAll=== '1'" class="button_class" style="" @click="getPdf(caseName)"><el-button type="primary">下载表单</el-button> </div> -->
            <ul>
                <li v-for="(item, indexVos) in caseFormPreviewVos" :key="indexVos"
                    @click="manyCase(item.caseCollectId, item.id, indexVos)">
                    <span :class="{ active_class: activeShow === indexVos }">{{ indexVos + 1 | caseFormat}}级别</span>
                </li>
            </ul>
        </div>
        <div id="pdfDom" ref="signCanvas">
        <div class="from_1" v-if="inclusionCriteria">
            <div class="from_1_title">
                <span style="margin-left: 20px">入排标准</span>
            </div>

            <div v-for="(item, indexCti) in criteriaData" :key="indexCti">
                <p class="criteria-title">{{ indexCti + 1 }}.{{ item.questionName }}</p>
                <p class="criteria-box">
                    <el-radio disabled v-model="criteriaDataRadio[indexCti]" label="A">A.是</el-radio>
                    <el-radio disabled v-model="criteriaDataRadio[indexCti]" label="B">B.否</el-radio>
                </p>
            </div>
        </div>
        <div class="from_1" v-if="dataInfo.specialInstructions">
            <div class="from_1_title">
                <span style="margin-left: 20px">特殊说明</span>
            </div>
            <div class="from_1_text_specialInstructions" v-html="dataInfo.specialInstructions">
            </div>
        </div>


        <div class="from_2" v-if="dataInfo.caseFormStageName && dataInfo.casetype !== 3 && !caseTypeShow">
            <div class="">
                <span style="margin-left:20px">表单阶段：{{ dataInfo.caseFormStageName }}</span>
            </div>
        </div>
        <!-- 多阶段关联表单 -->
        <div class="from_2">
            <!-- <div class="from_2_title">
                <span style="margin-left:20px">表单阶段：{{dataInfo.caseFormStageName}}</span>
            </div> -->
            <!-- <div class="from_2_title" v-for="(item, index) in caseManyFormPreviewVos" :key="index">
                <span style="margin-left:20px">表单阶段：{{ item.caseFormStageName }}</span>
            </div> -->
        </div>
        <!-- 多阶段关联表单 -->
            <div style="height: 40px"></div>
            <div v-show="activeId">
                <div class="from_1">
                    <div class="from_1_title">
                        <span style="margin-left: 20px">姓名：{{ userData.name }}</span>
                    </div>
                </div>
                <div class="from_1">
                    <div class="from_1_title">
                        <span style="margin-left: 20px">病历名称：{{ dataInfo.caseFillTitle }}</span>
                    </div>
                </div>
                <div class="from_1">
                    <div class="from_1_title">
                        <span style="margin-left: 20px">病历简介</span>
                    </div>
                    <div class="from_1_text" v-html="dataInfo.caseFillDescription">
                    </div>
                </div>
            </div>
            <div class="from_1" v-if=" caseAll == '1' && caseType === 3 ">
                <div class="from_1_title" >
                    <span style="margin-left: 20px">病例征集表单填写</span>
                </div>
                <div class="from_1_text" v-html="dataInfo.description">
                </div>
            </div>
            <template v-if=" caseAll == '1' && caseType === 3">
            <div  class="from_1" v-for="(item, indexCaseMany) in caseManyFormPreviewVos " :key="indexCaseMany">
                <div class="from_2_title" >
                    <span style="margin-left:20px">表单阶段{{indexCaseMany + 1 | caseFormat}}：{{ item.caseFormStageName }}</span>
                </div>
                <!-- <div class="from_1_title">
                    <span style="margin-left: 20px">请填写以下信息</span>
                </div> -->
                <div v-for="items in item.groupList" class="from_1_text">
                    <div class="from_2">
                        <span style="margin-left: 20px">{{ items.name }}</span>
                    </div>
                    <div class="from_3">
                        <ul class="from_3_ul">
                            <li v-for="(xfields, indexXf) in items.xfields" >
                                <div class="container">
                                    <!--                <div>[{{xfields.fieldType | fieldNmae}}]</div>-->
                                    <div style="margin-right: 20px;margin-left:10px; white-space: pre-wrap; line-height: 22px"
                                        v-html="xfields.fieldName">
                                        <!-- {{xfields.fieldName}}： -->
                                    </div>
                                    <div>
                                        <div v-if="xfields.fieldType === 'textdescribe'" v-html="xfields.description">
                                        </div>
                                        <span
                                            v-if="xfields.fieldType !== 'file' && xfields.fieldType !== 'matrixtable' && xfields.fieldType !== 'textdescribe' && xfields.fieldType !== 'video' && xfields.fieldType !== 'upload'">
                                            {{ xfields.value === '其他_other' ? xfields.otherField.value : xfields.value
                                            }}
                                        </span>
                                        <div v-if="xfields.fieldType === 'file' && xfields.value">
                                            <div v-for="fileList in xfields.value.attaches" 
                                                style="margin: 0 0 6px 6px">
                                                <!-- <img  crossorigin="anonymous" style="width:320px;height:180px" :src="fileList.fileUrl" /> -->
                                                <el-image 
                                                    crossorigin="anonymous" 
                                                    style="width:320px;height:180px" 
                                                    :src='`${fileList.fileUrl}?timeStamp=${new Date()}`'
                                                    :preview-src-list="[fileList.fileUrl]">
                                                </el-image>
                                            </div>
                                        </div>
                                        <div v-if="xfields.fieldType === 'video' && xfields.value">
                                            <el-button v-if="xfields.value.attaches.length > 0"
                                                @click="goVidoList(xfields.value.caseFormFillContentId)" size="mini">
                                                查看上传视频</el-button>
                                            <span v-else>暂无上传视频</span>
                                        </div>
                                        <ul v-if="xfields.fieldType === 'upload' && xfields.value">
                                            <li v-for="item in xfields.value.attaches">
                                                <span style="margin-right:15px">{{ item.fileName }}</span>
                                                <el-button v-if="xfields.value.attaches.length > 0"
                                                    @click="downLoadFiles(item.fileUrl)" size="mini">查看文件</el-button>
                                            </li>
                                        </ul>



                                        <div class="formItemBody" v-else-if="xfields.fieldType === 'matrixtable'"
                                            style="overflow-x: auto">
                                            <table class="tableCase">
                                                <thead>
                                                    <td v-for="theadItem in xfields.tableElems[0]"
                                                        style="white-space: pre-wrap; line-height: 22px;"
                                                        v-html="theadItem.fieldName">
                                                        <!-- {{theadItem.fieldName}} -->
                                                    </td>
                                                </thead>
                                                <tbody>
                                                    <template v-for="(tbodyItem, tbodyInd) in xfields.tableElems">
                                                        <tr v-if="tbodyInd > 0">
                                                            <template v-for="(trItem, trInd) in tbodyItem">
                                                                <td v-if="trInd === 0"
                                                                    style="white-space: pre-wrap; line-height: 22px;"
                                                                    v-html="trItem.fieldName">
                                                                    <!-- {{trItem.fieldName}} -->
                                                                </td>
                                                                <td v-else
                                                                    :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                    :id="'ele_' + trItem.fieldNameEn">{{ trItem.value }}
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                                <!--                关联二级-->
                                <div v-if="xfields.options" v-for="(xchildsOptions, indexOpt) in xfields.options"
                                    :key="indexOpt + 'options'" style="width: 100%">
                                    <div v-if="xchildsOptions.relateField && xchildsOptions.name === xfields.value"
                                        class="container">
                                        <div v-if="xchildsOptions.relateField"
                                            style="margin-right: 20px;margin-left:10px;">
                                            {{ xchildsOptions.relateField.fieldName }}：
                                        </div>
                                        <!--                                    关联二级 选项-->
                                        <div>
                                            <div v-if="xchildsOptions.relateField.fieldType === 'textdescribe'"
                                                v-html="xchildsOptions.relateField.description"></div>
                                            <span
                                                v-if="xchildsOptions.relateField.fieldType !== 'file' && xchildsOptions.relateField.fieldType !== 'matrixtable' && xchildsOptions.relateField.fieldType !== 'textdescribe' && xchildsOptions.relateField.fieldType !== 'video' && xchildsOptions.relateField.fieldType !== 'upload'">
                                                {{ xchildsOptions.relateField.value === '其他_other' ?
                                                        xchildsOptions.relateField.otherField.value :
                                                        xchildsOptions.relateField.value
                                                }}
                                            </span>
                                            <div
                                                v-if="xchildsOptions.relateField.fieldType === 'file' && xchildsOptions.relateField.value">
                                                <div v-for="(fileList, indexFli) in xchildsOptions.relateField.value.attaches"
                                                    :key="indexFli" style="margin: 0 0 6px 6px">
                                                    <!-- <img crossorigin="anonymous" style="width:320px;height:180px" :src="fileList.fileUrl" /> -->
                                                    <el-image 
                                                        crossorigin="anonymous" 
                                                        style="width:320px;height:180px" 
                                                        :src="fileList.fileUrl"
                                                        :preview-src-list="[fileList.fileUrl]"></el-image>
                                                </div>
                                            </div>
                                            <div
                                                v-if="xchildsOptions.relateField.fieldType === 'video' && xchildsOptions.relateField.value">

                                                <el-button v-if="xchildsOptions.relateField.value.attaches.length > 0"
                                                    @click="goVidoList(xchildsOptions.relateField.value.caseFormFillContentId)"
                                                    size="mini">查看上传视频</el-button>
                                                <span v-else>暂无上传视频</span>
                                            </div>

                                            <ul
                                                v-if="xchildsOptions.relateField.fieldType === 'upload' && xchildsOptions.relateField.value">
                                                <li v-for="item in xchildsOptions.relateField.value.attaches">
                                                    <span style="margin-right:15px">{{ item.fileName }}</span>
                                                    <el-button
                                                        v-if="xchildsOptions.relateField.value.attaches.length > 0"
                                                        @click="downLoadFiles(item.fileUrl)" size="mini">查看文件
                                                    </el-button>
                                                </li>
                                            </ul>
                                            <div class="formItemBody"
                                                v-else-if="xchildsOptions.relateField.fieldType === 'matrixtable'"
                                                style="overflow-x: auto">
                                                <table class="tableCase">
                                                    <thead>
                                                        <td v-for="theadItem in xchildsOptions.relateField.tableElems[0]"
                                                            style="white-space: pre-wrap; line-height: 22px;"
                                                            v-html="theadItem.fieldName">
                                                            <!-- {{theadItem.fieldName}} -->
                                                        </td>
                                                    </thead>
                                                    <tbody>
                                                        <template
                                                            v-for="(tbodyItem, tbodyInd) in xchildsOptions.relateField.tableElems">
                                                            <tr v-if="tbodyInd > 0">
                                                                <template v-for="(trItem, trInd) in tbodyItem">
                                                                    <td v-if="trInd === 0"
                                                                        style="white-space: pre-wrap; line-height: 22px;"
                                                                        v-html="trItem.fieldName">
                                                                        <!-- {{trItem.fieldName}} -->
                                                                    </td>
                                                                    <td v-else
                                                                        :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                        :id="'ele_' + trItem.fieldNameEn">
                                                                        {{ trItem.value }}
                                                                    </td>
                                                                </template>
                                                            </tr>
                                                        </template>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--二级选项-->
                                <div v-for="xchilds in xfields.xchilds" style="width: 100%">
                                    <div class="container">
                                        <!--                  <div>[{{xchilds.fieldType | fieldNmae}}]</div>-->
                                        <div style="margin-right: 20px;margin-left:10px;">
                                            {{ xchilds.fieldName }}：
                                        </div>
                                        <div>
                                            <div v-if="xchilds.fieldType === 'textdescribe'"
                                                v-html="xchilds.description"></div>
                                            <span
                                                v-if="xchilds.fieldType !== 'file' && xchilds.fieldType !== 'matrixtable' && xchilds.fieldType !== 'textdescribe' && xchilds.fieldType !== 'video' && xchilds.fieldType !== 'upload'">
                                                {{ xchilds.value === '其他_other' ? xchilds.otherField.value :
                                                        xchilds.value
                                                }}
                                            </span>
                                            <div v-if="xchilds.fieldType === 'file' && xchilds.value">
                                                <div v-for="fileList in xchilds.value.attaches" 
                                                    style="margin: 0 0 6px 6px">
                                                    <img crossorigin="anonymous" style="width:320px;height:180px" :src="fileList.fileUrl" />
                                                </div>
                                            </div>
                                            <div v-if="xchilds.fieldType === 'video' && xchilds.value">

                                                <el-button v-if="xchilds.value.attaches.length > 0"
                                                    @click="goVidoList(xchilds.value.caseFormFillContentId)"
                                                    size="mini">查看上传视频</el-button>
                                                <span v-else>暂无上传视频</span>
                                            </div>
                                            <ul v-if="xchilds.fieldType === 'upload' && xchilds.value">
                                                <li v-for="item in xchilds.value.attaches">
                                                    <span style="margin-right:15px">{{ item.fileName }}</span>
                                                    <el-button v-if="xchilds.value.attaches.length > 0"
                                                        @click="downLoadFiles(item.fileUrl)" size="mini">查看文件
                                                    </el-button>
                                                </li>
                                            </ul>
                                            <div class="formItemBody" v-else-if="xchilds.fieldType === 'matrixtable'"
                                                style="overflow-x: auto">
                                                <table class="tableCase">
                                                    <thead>
                                                        <td v-for="theadItem in xchilds.tableElems[0]"
                                                            style="white-space: pre-wrap; line-height: 22px;"
                                                            v-html="theadItem.fieldName">
                                                            <!-- {{theadItem.fieldName}} -->
                                                        </td>
                                                    </thead>
                                                    <tbody>
                                                        <template v-for="(tbodyItem, tbodyInd) in xchilds.tableElems">
                                                            <tr v-if="tbodyInd > 0">
                                                                <template v-for="(trItem, trInd) in tbodyItem">
                                                                    <td v-if="trInd === 0"
                                                                        style="white-space: pre-wrap; line-height: 22px;"
                                                                        v-html="trItem.fieldName">
                                                                        <!-- {{trItem.fieldName}} -->
                                                                    </td>
                                                                    <td v-else
                                                                        :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                        :id="'ele_' + trItem.fieldNameEn">
                                                                        {{ trItem.value }}
                                                                    </td>
                                                                </template>
                                                            </tr>
                                                        </template>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            </template>
            <div v-else v-for="(item, index) in dataInfo.groupList"  class="from_1_text">
                <div class="from_2">
                    <span style="margin-left: 20px">{{item.name}}</span>
                </div>
                <div class="from_3">
                    <ul class="from_3_ul">
                        <li v-for="(xfields, index) in item.xfields" >
                            <div class="container">
                                <!--                <div>[{{xfields.fieldType | fieldNmae}}]</div>-->
                                <div style="margin-right: 20px;margin-left:10px; white-space: pre-wrap; line-height: 22px"
                                    v-html="xfields.fieldName">
                                    <!-- {{xfields.fieldName}}： -->
                                </div>
                                <div>
                                    <div v-if="xfields.fieldType === 'textdescribe'" v-html="xfields.description"></div>
                                    <span
                                        v-if="xfields.fieldType !== 'file' && xfields.fieldType !== 'matrixtable' && xfields.fieldType !== 'textdescribe'&& xfields.fieldType !== 'video'&& xfields.fieldType !== 'upload'">
                                        {{xfields.value === '其他_other' ? xfields.otherField.value : xfields.value}}
                                    </span>
                                    <div v-if="xfields.fieldType === 'file' && xfields.value">
                                        <div v-for="(fileList, index) in xfields.value.attaches" 
                                            style="margin: 0 0 6px 6px">
                                            <img crossorigin="anonymous" style="width:320px;height:180px" :src="fileList.fileUrl" />
                                        </div>
                                    </div>
                                    <div v-if="xfields.fieldType === 'video' && xfields.value">
                                        <el-button v-if="xfields.value.attaches.length > 0"
                                            @click="goVidoList(xfields.value.caseFormFillContentId)" size="mini">查看上传视频
                                        </el-button>
                                        <span v-else>暂无上传视频</span>
                                    </div>
                                    <ul v-if="xfields.fieldType === 'upload' && xfields.value">
                                        <li v-for="item in xfields.value.attaches">
                                            <span style="margin-right:15px">{{item.fileName}}</span>
                                            <el-button v-if="xfields.value.attaches.length > 0"
                                                @click="downLoadFiles(item.fileUrl)" size="mini">查看文件</el-button>
                                        </li>
                                    </ul>



                                    <div class="formItemBody" v-else-if="xfields.fieldType === 'matrixtable'"
                                        style="overflow-x: auto">
                                        <table class="tableCase">
                                            <thead>
                                                <td v-for="theadItem in xfields.tableElems[0]"
                                                    style="white-space: pre-wrap; line-height: 22px;"
                                                    v-html="theadItem.fieldName">
                                                    <!-- {{theadItem.fieldName}} -->
                                                </td>
                                            </thead>
                                            <tbody>
                                                <template v-for="(tbodyItem, tbodyInd) in xfields.tableElems">
                                                    <tr v-if="tbodyInd > 0">
                                                        <template v-for="(trItem, trInd) in tbodyItem">
                                                            <td v-if="trInd === 0"
                                                                style="white-space: pre-wrap; line-height: 22px;"
                                                                v-html="trItem.fieldName">
                                                                <!-- {{trItem.fieldName}} -->
                                                            </td>
                                                            <td v-else
                                                                :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                :id="'ele_' + trItem.fieldNameEn">{{trItem.value}}
                                                            </td>
                                                        </template>
                                                    </tr>
                                                </template>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                            <!--                关联二级-->
                            <div v-if="xfields.options" v-for="(xchildsOptions, index) in xfields.options"
                                :key="index + 'options'" style="width: 100%">
                                <div v-if="xchildsOptions.relateField && xchildsOptions.name === xfields.value"
                                    class="container">
                                    <div v-if="xchildsOptions.relateField" style="margin-right: 20px;margin-left:10px;">
                                        {{xchildsOptions.relateField.fieldName}}：
                                    </div>
                                    <!--                                    关联二级 选项-->
                                    <div>
                                        <div v-if="xchildsOptions.relateField.fieldType === 'textdescribe'"
                                            v-html="xchildsOptions.relateField.description"></div>
                                        <span
                                            v-if="xchildsOptions.relateField.fieldType !== 'file' && xchildsOptions.relateField.fieldType !== 'matrixtable' && xchildsOptions.relateField.fieldType !== 'textdescribe'&& xchildsOptions.relateField.fieldType !== 'video'&& xchildsOptions.relateField.fieldType !== 'upload'">
                                            {{xchildsOptions.relateField.value === '其他_other' ?
                                            xchildsOptions.relateField.otherField.value :
                                            xchildsOptions.relateField.value}}
                                        </span>
                                        <div
                                            v-if="xchildsOptions.relateField.fieldType === 'file' && xchildsOptions.relateField.value">
                                            <div v-for="(fileList, index) in xchildsOptions.relateField.value.attaches"
                                                :key="index" style="margin: 0 0 6px 6px">
                                                <img crossorigin="anonymous" style="width:320px;height:180px" :src="fileList.fileUrl" />
                                            </div>
                                        </div>
                                        <div
                                            v-if="xchildsOptions.relateField.fieldType === 'video' && xchildsOptions.relateField.value">

                                            <el-button v-if="xchildsOptions.relateField.value.attaches.length > 0"
                                                @click="goVidoList(xchildsOptions.relateField.value.caseFormFillContentId)"
                                                size="mini">查看上传视频</el-button>
                                            <span v-else>暂无上传视频</span>
                                        </div>

                                        <ul
                                            v-if="xchildsOptions.relateField.fieldType === 'upload' && xchildsOptions.relateField.value">
                                            <li v-for="item in xchildsOptions.relateField.value.attaches">
                                                <span style="margin-right:15px">{{item.fileName}}</span>
                                                <el-button v-if="xchildsOptions.relateField.value.attaches.length > 0"
                                                    @click="downLoadFiles(item.fileUrl)" size="mini">查看文件</el-button>
                                            </li>
                                        </ul>
                                        <div class="formItemBody"
                                            v-else-if="xchildsOptions.relateField.fieldType === 'matrixtable'"
                                            style="overflow-x: auto">
                                            <table class="tableCase">
                                                <thead>
                                                    <td v-for="theadItem in xchildsOptions.relateField.tableElems[0]"
                                                        style="white-space: pre-wrap; line-height: 22px;"
                                                        v-html="theadItem.fieldName">
                                                        <!-- {{theadItem.fieldName}} -->
                                                    </td>
                                                </thead>
                                                <tbody>
                                                    <template
                                                        v-for="(tbodyItem, tbodyInd) in xchildsOptions.relateField.tableElems">
                                                        <tr v-if="tbodyInd > 0">
                                                            <template v-for="(trItem, trInd) in tbodyItem">
                                                                <td v-if="trInd === 0"
                                                                    style="white-space: pre-wrap; line-height: 22px;"
                                                                    v-html="trItem.fieldName">
                                                                    <!-- {{trItem.fieldName}} -->
                                                                </td>
                                                                <td v-else
                                                                    :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                    :id="'ele_' + trItem.fieldNameEn">{{trItem.value}}
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!--二级选项-->
                            <div v-for="(xchilds, index) in xfields.xchilds" :key="index" style="width: 100%">
                                <div class="container">
                                    <!--                  <div>[{{xchilds.fieldType | fieldNmae}}]</div>-->
                                    <div style="margin-right: 20px;margin-left:10px;">
                                        {{xchilds.fieldName}}：
                                    </div>
                                    <div>
                                        <div v-if="xchilds.fieldType === 'textdescribe'" v-html="xchilds.description">
                                        </div>
                                        <span
                                            v-if="xchilds.fieldType !== 'file' && xchilds.fieldType !== 'matrixtable' && xchilds.fieldType !== 'textdescribe'&& xchilds.fieldType !== 'video'&& xchilds.fieldType !== 'upload'">
                                            {{xchilds.value === '其他_other' ? xchilds.otherField.value : xchilds.value}}
                                        </span>
                                        <div v-if="xchilds.fieldType === 'file' && xchilds.value">
                                            <div v-for="(fileList, index) in xchilds.value.attaches" :key="index"
                                                style="margin: 0 0 6px 6px">
                                                <img crossorigin="anonymous" style="width:320px;height:180px" :src="fileList.fileUrl" />
                                            </div>
                                        </div>
                                        <div v-if="xchilds.fieldType === 'video' && xchilds.value">

                                            <el-button v-if="xchilds.value.attaches.length > 0"
                                                @click="goVidoList(xchilds.value.caseFormFillContentId)" size="mini">
                                                查看上传视频</el-button>
                                            <span v-else>暂无上传视频</span>
                                        </div>
                                        <ul v-if="xchilds.fieldType === 'upload' && xchilds.value">
                                            <li v-for="item in xchilds.value.attaches">
                                                <span style="margin-right:15px">{{item.fileName}}</span>
                                                <el-button v-if="xchilds.value.attaches.length > 0"
                                                    @click="downLoadFiles(item.fileUrl)" size="mini">查看文件</el-button>
                                            </li>
                                        </ul>
                                        <div class="formItemBody" v-else-if="xchilds.fieldType === 'matrixtable'"
                                            style="overflow-x: auto">
                                            <table class="tableCase">
                                                <thead>
                                                    <td v-for="theadItem in xchilds.tableElems[0]"
                                                        style="white-space: pre-wrap; line-height: 22px;"
                                                        v-html="theadItem.fieldName">
                                                        <!-- {{theadItem.fieldName}} -->
                                                    </td>
                                                </thead>
                                                <tbody>
                                                    <template v-for="(tbodyItem, tbodyInd) in xchilds.tableElems">
                                                        <tr v-if="tbodyInd > 0">
                                                            <template v-for="(trItem, trInd) in tbodyItem">
                                                                <td v-if="trInd === 0"
                                                                    style="white-space: pre-wrap; line-height: 22px;"
                                                                    v-html="trItem.fieldName">
                                                                    <!-- {{trItem.fieldName}} -->
                                                                </td>
                                                                <td v-else
                                                                    :class="[trItem.needMarker ? 'tdNeedMarker' : '']"
                                                                    :id="'ele_' + trItem.fieldNameEn">{{trItem.value}}
                                                                </td>
                                                            </template>
                                                        </tr>
                                                    </template>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        <div v-show="pagesShow">
            <el-button @click="paging(1)">上一页</el-button>
            <span style="margin: 0 10px">{{ this.pageNum }}/{{ this.pages }}</span>
            <el-button @click="paging(2)">下一页</el-button>
        </div>
        </div>
    </div>
</template>

<script>
// import caseHeader from './base/caseHeader'
import http from '@/utils/tenant'
import api from '@/api/tenantInfoSave'
import HeaderContent from '@/components/header-content'
import html2canvas from 'html2canvas'

export default {
    props: {},
    data() {
        return {
            criteriaDataRadio: [],
            criteriaData: [], //入排数据
            headerTitle: '病例预览',
            opertions: ['返回'],
            userData: '',
            caseFillTitle: '',
            title: '',
            dataEn: {},
            description: '',
            caseFillDescription: '',
            pageNum: 1,
            pages: 1,
            pagesShow: true,
            id: this.$route.params.id,
            activeId: this.$route.params.activeId,
            fileImg: [],
            dataInfo: {},
            formId: this.$route.params.formId,
            caseFormId: '',
            caseCollectId: '',
            inclusionCriteria: 0,
            activeName: '',
            caseFormPreviewVos: [],
            activeShow: 0,
            childFills: [],
            caseManyFormPreviewVos: [],
            caseType: '',
            caseTypeShow: false,
            caseAll: JSON.parse(window.sessionStorage.getItem('caseAll')),
            caseName: this.$route.query.title,
            html2canvasloading: false,
            getCaseId: ''
        }
    },
    filters: {
        fieldNmae(item) {
            switch (item) {
                case 'text':
                    return '单行输入'
                case 'textarea':
                    return '多行输入'
                case 'radio':
                    return '单选题'
                case 'checkbox':
                    return '多选题'
                case 'file':
                    return '上传图片'
                case 'select':
                    return '下拉选择题'
                case 'time':
                    return '时间'
                case 'matrixtable':
                    return '矩阵表格'
                case 'textdescribe':
                    return '字段描述'
            }
        },
        fileList(val) {
            let list = []
            for (let item of val) {
                list.push(item.fileUrl)
            }
            return list
        },
        caseFormat(item) {
             switch (item) {
                case 1:
                    return '一'
                case 2:
                    return '二'
                case 3:
                    return '三'
                case 4:
                    return '四'
                case 5:
                    return '五'
            }
        }
    },
    created: function () {
        if (this.$route.query.name) {
            document.title = this.$route.query.name + '-' + this.$route.query.title
        }
    },
    methods: {
        // 获取all表单阶段
        getAllCasePreviewInclus() {
            http.get(api.casePreviewInclus + this.formId + "/" + this.id).then(res => {
                if (res.data.code === 0) {
                    this.caseManyFormPreviewVos = res.data.data
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        // 获取入排标准
        getCasePreviewInclus(id) {
            let caseId = id ? id : this.$route.params.formId
            http.get(api.inclusionCriteria + caseId).then(res => {
                if (res.data.code === 0) {
                    this.criteriaData = res.data.data
                    this.criteriaData.map(item => {
                        this.criteriaDataRadio.push(item.answer)
                    })
                    if (res.data.data.length == 0) {
                        this.inclusionCriteria = 0
                    }
                    else {
                        this.inclusionCriteria = 1
                    }
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        // 导出
        // 多阶段导出pdf
        exportPng() {
        this.html2canvasloading = true
        let caseId = this.$route.params.id
        let _signCanvas = this.$refs.signCanvas
        html2canvas(_signCanvas, {useCORS: true, scale: 3}).then((canvas) => {
          let dataURL = canvas.toDataURL('image/png')
          let upObg = new FormData()
          let fileName = `case${caseId}_${Math.round(Math.random() * 10)}.png`
          upObg.append('file', this.dataURLtoBlob(dataURL), fileName)
          http.post(api.uploadImg, upObg).then(response => {
            this.exportPdf(response.data.data)
          }).catch(error => {
            console.log(error);
            this.html2canvasloading = false
          })
        })
      },
      exportPdf(data) {
        let caseId = this.$route.params.id
        http.post(api.CasePdfDownload, {url: data, caseFillId: caseId}).then(response => {
         if (response.data.code === 0) {
            window.open(response.data.data)
            this.html2canvasloading = false
            this.$message.success('下载成功')
          } else {
            this.$message.error(response.data.message)
            this.html2canvasloading = false
          }
        }).catch(error => {
          console.log(error);
          this.html2canvasloading = false
        })
      },
      dataURLtoBlob(dataurl) {
        let arr = dataurl.split(',')
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new Blob([u8arr], {'type': 'image/png'})
      },        // 多阶段导出pdf
        // 多阶段切换
        async manyCase(caseCollectId, id, index) {
            this.activeShow = index
            this.pageNum = 1
            await this.getCasePreviewInclus(caseCollectId, id)
            await http.get(api.seeCaseForm + caseCollectId + "/" + id + "/" + 1).then(res => {
                if (res.data.code === 0) {
                    this.dataInfo = res.data.data
                    this.pagesShow = res.data.data.pages
                    this.pages = res.data.data.pages ? res.data.data.pages : 1
                    // this.dataInfo.caseDescri = this.dataInfo.caseDescri.replace(/(\r\n|\n|\r)/gm, '<br/>')
                    this.dataInfo.description = this.dataInfo.description.replace(/(\r\n|\n|\r)/gm, '<br/>')
                    if (res.data.data.specialInstructions) {
                        this.dataInfo.specialInstructions = res.data.data.specialInstructions
                    }
                } else {
                    this.$message.error(res.data.message)
                }
            })
        },
        downLoadFiles(url) {
            window.open(url)
        },
        goVidoList(id) {
            // 查看视频文件
            let url = window.location.origin + '/#/casevideo/' + id
            if (window.location.origin.indexOf('localhost') > 0) {
                url = 'http://shahai.test.100doc.com.cn/#/casevideo/' + id
                window.open(url)
            }
            window.open(url)
        },
        headerClick() {
            this.$router.back()
        },
        casedetail() {
            http.get(api.casedetail + this.id).then(res => {
                if (res.data.code === 0) {
                    this.userData = res.data.data.userData
                    this.title = res.data.data.title
                    this.description = res.data.data.description

                    this.caseFormId = res.data.data.formId
                    this.caseCollectId = res.data.data.caseCollectId

                    this.caseCollectConfig()
                }
            })
        },
        // 多阶段关联表单
        casedetailMany() {
            http.get(api.casedetail + this.id).then(res => {
                if (res.data.code === 0) {
                    this.userData = res.data.data.userData
                    this.title = res.data.data.title
                    this.description = res.data.data.description

                    this.caseFormId = res.data.data.formId
                    this.caseCollectId = res.data.data.caseCollectId
                    this.caseCollectConfig()
                }
            })
        },

        //由收集病例列表的病例详情进入 start
        getInclusionCriteria() {
            // 获取入排标准
            if (this.caseAll == '0' ) {
                http.get(api.inclusionCriteria + this.caseFormId).then(res => {
                if (res.data.code === 0) {
                    this.criteriaData = res.data.data
                    this.criteriaData.map(item => {
                    this.criteriaDataRadio.push(item.answer)
                    })
                }
            })
            }
        },
        //由收集病例列表的病例详情进入 end

        //由活动详情进入 start
        getInclusionCriteria2() {
            // 获取入排标准
            //  this.formId
            http.get(api.inclusionCriteria + this.formId).then(res => {
                if (res.data.code === 0) {
                    if (res.data.data.length == 0) {
                        this.inclusionCriteria = 0
                    }
                    else {
                        this.inclusionCriteria = 1
                    }
                    this.criteriaData = res.data.data
                    this.criteriaData.map(item => {
                        this.criteriaDataRadio.push(item.answer)
                    })
                }
            })
        },
        //由活动详情进入 end

        //由收集病例列表的病例详情进入 start
        caseCollectConfig() {
            // 是否展示入排标准(0否，1是)
            http.get(api.caseCollectConfig + this.caseCollectId).then(res => {
                if (res.data.code === 0) {
                    this.inclusionCriteria = res.data.data.inclusionCriteria
                    this.caseType = res.data.data.caseType
                    this.caseTypeShow = true
                    if (this.inclusionCriteria) {
                        this.getInclusionCriteria()
                    }
                }
            })
        },
        //由收集病例列表的病例详情进入 end

        //由活动详情进入 start
        caseCollectConfig2() {
            // 是否展示入排标准(0否，1是)
            http.get(api.caseCollectConfig + this.id).then(res => {
                if (res.data.code === 0) {
                    this.inclusionCriteria = res.data.data.inclusionCriteria
                    if (this.inclusionCriteria) {
                        this.getInclusionCriteria2()
                    }
                }
            })
        },
        //由活动详情进入 end
        paging(type) {
            if (type === 2) {
                if (this.pageNum === this.pages) return
                this.pageNum++
            } else if (type === 1) {
                if (this.pageNum === 1) return
                this.pageNum--
            }
            if (this.$route.params.activeId) {
                this.casePreview()
            } else {
                this.seeCaseForm()
            }
        },
        seeCaseForm: async function () {
            // const res = await http.get(api.seeCaseForm + this.id + '/' + this.pageNum)
            const res = await http.get(api.seeCaseForm + this.id + '/' + this.formId + '/' + this.pageNum)
            if (res.data.code === 0) {
                this.dataInfo = res.data.data
                this.pagesShow = res.data.data.pages
                this.pages = res.data.data.pages ? res.data.data.pages : 1
                // this.dataInfo.caseDescri = this.dataInfo.caseDescri.replace(/(\r\n|\n|\r)/gm, '<br/>')
                this.dataInfo.description = this.dataInfo.description.replace(/(\r\n|\n|\r)/gm, '<br/>')
                if (res.data.data.specialInstructions) {
                    this.dataInfo.specialInstructions = res.data.data.specialInstructions
                }
                this.caseFormPreviewVos = res.data.data.caseFormPreviewVos
                this.caseCollectConfig2()
            } else {
                this.$message.error(res.data.message)
            }
        },
        casePreview: async function () {
            // const res = await http.get(api.casePreview + this.activeId + '/' + this.id + '/' + this.pageNum + '/' + 1)
            // const res = await http.get(api.casePreview + this.id + '/' + this.formId + '/' + this.pageNum + '/' + 1)
            const res = await http.get(api.casePreview + this.formId + '/' + this.id + '/' + this.pageNum + '/' + 1)
            if (res.data.code === 0) {
                this.dataInfo = res.data.data
                this.pagesShow = res.data.data.pages
                this.pages = res.data.data.pages ? res.data.data.pages : 1
                // this.dataInfo.caseDescri = this.dataInfo.caseDescri.replace(/(\r\n|\n|\r)/gm, '<br/>')
                this.dataInfo.description = this.dataInfo.description.replace(/(\r\n|\n|\r)/gm, '<br/>')
                if (res.data.data.specialInstructions) {
                    this.dataInfo.specialInstructions = res.data.data.specialInstructions
                }
                this.getCasePreviewInclus(res.data.data.caseFormPreviewVos[0].id)
            } else {
                this.$message.error(res.data.message)
            }
        },
        // 多阶段关联病例
        caseManyPreview() {

        }
    },
    mounted() {
        this.casedetail()
        
        if (this.$route.params.activeId || this.$route.query.name) {
            this.casePreview()
        } else {
            this.seeCaseForm()
        }
        if(JSON.parse(window.sessionStorage.getItem('caseAll')) == '1' ) {
           this.getAllCasePreviewInclus()
        }
    },
    components: {
        HeaderContent
        // caseHeader
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
$c-theme:var(--reset);
$c-theme2:var(--reset2);
$c-theme3:var(--reset3);

.caseMain {
    margin-top: 76px !important;
}

.container {
    width: 100%;
}

.from_3_ul div {
    font-size: 14px;
    overflow: hidden;
    float: left;
}

.caseMain ul,
li {
    list-style: none;
}

.from_3_ul li {
    width: 100%;
    float: left;
    margin-top: 20px;
}

.from_3 {
    overflow: hidden;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding-bottom: 40px;
}

.from_2 {
    width: 100%;
    line-height: 36px;
    background: #F7F7F7;
    font-size: 16px;
    color: #333333;
}

.from_1 {
    width: 100%;
    border-radius: 4px;
    background: #ffffff;
}

.from_1_title {
    font-size: 18px;
    color: #333333;
    line-height: 58px;
    border-bottom: 1px solid #ECECEC;
}

.from_1_text {
    line-height: 28px;
    font-size: 14px;
    color: #333333;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px;
}

.from_1_text_specialInstructions {
    line-height: 28px;
    font-size: 14px;
    color: red;
    margin-left: 20px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    padding: 20px;
}

.main {
    margin: 5px 0;
}

.formItemBody {
    max-width: 900px;
    overflow: scroll;
    margin-left: 26px;
    margin-top: 10px;
    position: relative;
}

.tableCase {
    width: 100%;
    border-collapse: collapse;
    margin: 0 auto;
    text-align: center;
    color: #333333;
    font-size: 16px
}

.tableCase span {
    display: inline-block;
    width: 10px;
    height: 10px;
    margin-right: 8px;
    background: url("http://yibaifiles-1252497236.file.myqcloud.com/mobile/caseActivity/mustFill.png") no-repeat;
    background-size: 100% 100%
}

.tableCase input {
    display: block;
    height: 100%;
    min-height: 48px;
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%
}

.tableCase td {
    border: 1px solid #D8D8D8;
    color: #666;
    min-width: 150px
}

.tableCase thead td {
    padding: 15px 15px;
    background-color: rgba(21, 159, 232, 0.04)
}

.tableCase tbody td:first-child {
    padding: 15px 15px;
    background-color: rgba(21, 159, 232, 0.04)
}

.criteria-title {
    width: 100%;
    line-height: 36px;
    background: #F7F7F7;
    font-size: 16px;
    color: #333333;
    padding: 0 20px;
    box-sizing: border-box;
}

.criteria-box {
    padding: 0 20px;
}

.tab_case {
    margin: 20px 0;
    ;
}

.tab_case ul {
    background-color: #F7F7F7;
    border-radius: 4px;
}

.tab_case ul li {
    display: inline-block;
    padding: 20px;
    font-size: 18px;
    cursor: pointer;
}

.active_class {
    color: $c-theme;
}
.from_2_title {
    text-align: center;
    border: 1px solid #ccc;
    padding: 10px 0;
    border-radius: 4px;
    width: 94.4%;
    margin-left: 3.6%;
}
.button_class {
    float: right; 
    margin-top: -70px
}
</style>

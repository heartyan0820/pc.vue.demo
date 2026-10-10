<template>
  <div class="ecmbody">
    <div v-if="routes.path == '/order'" class="ecmbody-nav">
      <a style="width: 40px" href="/#/index">首页</a>
      /
      <span>在线下单</span>
    </div>
    <div v-else>
      <br />
      <br />
    </div>
    <div class="ecmbody-nav1">
      <div class="ecmbody-nav1-title">{{ title }}</div>
      <div class="ecmbody-nav1-title1">
        <el-steps :active="active" align-center finish-status="success">
          <el-step title="基本信息" style="font-size: 12px" />
          <el-step title="项目详情" />
          <el-step title="确认订单" />
        </el-steps>
      </div>
    </div>
    <div v-if="steps == 0">
      <div class="ecmbody-infos">
        <div class="ecmbody-info-title">
          <span>*</span>
          病例信息
        </div>
        <div class="ecmbody-info-content">
          <el-form
            v-if="isEntrust"
            ref="orderModule"
            :inline="true"
            :model="diseaseSeriesForm"
            :rules="rules"
            label-position="left"
            class="ecmbody-info-content-form"
            label-width="auto"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="患者姓名" prop="name">
                  <el-input v-model="diseaseSeriesForm.name" placeholder="请输入患者姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <el-form-item label="模型种类" prop="mxType">
                  <el-select
                    v-model="diseaseSeriesForm.mxType"
                    style="width: 148px"
                    placeholder="请选择模型种类"
                  >
                    <el-option
                      v-for="(it, index) in orderMx"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="订单种类" prop="produceType">
                  <el-select
                    v-model="diseaseSeriesForm.produceType"
                    style="width: 148px"
                    placeholder="请选择订单种类"
                  >
                    <el-option
                      v-for="(it, index) in orderSc"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="&nbsp;&nbsp;患者年龄" prop="age">
                  <el-input
                    v-model="diseaseSeriesForm.age"
                    maxlength="3"
                    placeholder="请输入患者年龄"
                    @input="numValid(diseaseSeriesForm.age)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <el-form-item label="医疗机构" prop="institution">
                  <el-select
                    v-model="diseaseSeriesForm.institution"
                    style="width: 425px"
                    filterable
                    placeholder="请选择医疗机构"
                    disabled="true"
                    @change="handleInstitutionChange"
                  >
                    <el-option
                      v-for="(it, index) in orderRadio"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="是否试戴" prop="isTest">
                  <el-select
                    v-model="diseaseSeriesForm.isTest"
                    style="width: 214px"
                    placeholder="请选择是否试戴"
                  >
                    <el-option
                      v-for="(it, index) in orderSd"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <!-- <el-form-item label="产品目录">
                  <el-select
                    v-model="diseaseSeriesForm.factoryId"
                    style="width: 210px"
                    placeholder="请选择产品目录"
                    @change="handleInstMenuChange"
                  >
                    <el-option
                      v-for="(it, index) in orderMl"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item> -->
                <el-form-item label="加 工 厂 &nbsp;" prop="client">
                  <el-select
                    v-model="diseaseSeriesForm.client"
                    style="width: 425px"
                    placeholder="请选择加工厂"
                    @change="handleInstWeiTuoChange"
                  >
                    <el-option
                      v-for="(it, index) in orderWt"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="&nbsp;&nbsp;患者性别" prop="sex">
                  <el-radio-group
                    v-model="diseaseSeriesForm.sex"
                    style="width: 148px"
                    placeholder="请选择患者性别"
                  >
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right"></el-col>
            </el-row>
          </el-form>
          <el-form
            v-else
            ref="orderModule"
            :inline="true"
            :model="diseaseSeriesForm"
            :rules="rules"
            label-position="left"
            class="ecmbody-info-content-form"
            label-width="auto"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="患者姓名" prop="name">
                  <el-input v-model="diseaseSeriesForm.name" placeholder="请输入患者姓名" />
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <el-form-item label="模型种类" prop="mxType">
                  <el-select
                    v-model="diseaseSeriesForm.mxType"
                    style="width: 148px"
                    placeholder="请选择模型种类"
                  >
                    <el-option
                      v-for="(it, index) in orderMx"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item label="订单种类" prop="produceType">
                  <el-select
                    v-model="diseaseSeriesForm.produceType"
                    style="width: 148px"
                    placeholder="请选择订单种类"
                  >
                    <el-option
                      v-for="(it, index) in orderSc"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="&nbsp;&nbsp;患者年龄" prop="age">
                  <el-input
                    v-model="diseaseSeriesForm.age"
                    maxlength="3"
                    placeholder="请输入患者年龄"
                    @input="numValid(diseaseSeriesForm.age)"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <el-form-item label="医疗机构" prop="institution">
                  <el-select
                    v-model="diseaseSeriesForm.institution"
                    filterable
                    style="width: 425px"
                    placeholder="请选择医疗机构"
                    @change="handleInstitutionChange"
                  >
                    <el-option
                      v-for="(it, index) in orderRadio"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="医生姓名" prop="doctorName">
                  <el-select
                    v-model="diseaseSeriesForm.doctorName"
                    style="width: 214px"
                    placeholder="请选择医生姓名"
                    @change="handleYiShengChange"
                  >
                    <el-option
                      v-for="(it, index) in doctors"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label, doctorRequire: it.doctorRequire }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <!-- <el-form-item label="产品目录">
                  <el-select
                    v-model="diseaseSeriesForm.factoryId"
                    style="width: 210px"
                    placeholder="请选择产品目录"
                    @change="handleInstMenuChange"
                  >
                    <el-option
                      v-for="(it, index) in orderMl"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item> -->
                <el-form-item label="加 工 厂 &nbsp;" prop="client">
                  <el-select
                    v-model="diseaseSeriesForm.client"
                    style="width: 425px"
                    placeholder="请选择加工厂"
                    @change="handleInstWeiTuoChange"
                  >
                    <el-option
                      v-for="(it, index) in orderWt"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="&nbsp;&nbsp;患者性别" prop="sex">
                  <el-radio-group
                    v-model="diseaseSeriesForm.sex"
                    style="width: 148px"
                    placeholder="请选择患者性别"
                  >
                    <el-radio value="男">男</el-radio>
                    <el-radio value="女">女</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="16" style="text-align: right">
                <el-form-item label="是否试戴" prop="isTest">
                  <el-select
                    v-model="diseaseSeriesForm.isTest"
                    style="width: 191px"
                    placeholder="请选择是否试戴"
                  >
                    <el-option
                      v-for="(it, index) in orderSd"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="ecmbody-infos">
        <div class="ecmbody-info-title">
          <span>*</span>
          数据资料
        </div>
        <div class="ecmbody-info-content">
          <el-form
            ref="recordForm"
            class="ecmbody-info-content-form"
            :model="informationForm"
            label-width="100px"
            label-position="left"
          >
            <el-form-item label="CBCT" prop="cbctfileUrls">
              <el-upload
                v-model="cbctfileUrls"
                :http-request="handleUpload"
                class="upload-demo"
                :show-file-list="false"
                multiple
              >
                <!-- 上传文件按钮 -->
                <el-button type="primary">上传文件</el-button>
              </el-upload>
              <div v-for="(item, index) in cbctfileUrls" :key="index" class="upfile">
                <el-icon style="padding-top: 16px"><Document /></el-icon>
                <div class="upfile-txt">
                  <div class="upfile-name">&nbsp;{{ item.fileName }}</div>
                  <div class="upfile-jindu" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 1)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
            <el-form-item label="口扫数据" prop="mouthfileUrls">
              <el-upload
                v-model="mouthfileUrls"
                :http-request="handleUploads"
                class="upload-demo"
                :show-file-list="false"
                multiple
              >
                <!-- 上传文件按钮 -->
                <el-button type="primary">上传文件</el-button>
              </el-upload>

              <div v-for="(item, index) in mouthfileUrls" :key="index" class="upfile">
                <el-icon style="padding-top: 16px"><Document /></el-icon>
                <div class="upfile-txt">
                  <div class="upfile-name">&nbsp;{{ item.fileName }}</div>
                  <div class="upfile-jindu" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 2)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
            <el-form-item label="比色照" prop="colorpicUrls">
              <el-upload
                v-model="colorpicUrls"
                :http-request="colorpUpload"
                :show-file-list="false"
                multiple
                list-type="picture-card"
              >
                <img src="@/assets/images/upimg.png" width="50px" />
              </el-upload>

              <div v-for="(item, index) in colorpicUrls" :key="index" class="upfiles">
                <div class="upfile-txts">
                  <div class="upfile-names">
                    <img
                      v-if="item.url == ''"
                      src="/images/jiazai.png"
                      width="50px"
                      height="50px"
                    />
                    <img
                      v-else
                      v-viewer.static="{ inline: false }"
                      :src="settings.fileurl + item.url"
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 3)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
            <el-form-item label="制作照" prop="makepicUrls">
              <el-upload
                v-model="makepicUrls"
                :http-request="makeUpload"
                class="upload-demo"
                :show-file-list="false"
                multiple
                list-type="picture-card"
              >
                <img src="@/assets/images/upimg.png" width="50px" />
              </el-upload>

              <div v-for="(item, index) in makepicUrls" :key="index" class="upfiles">
                <div class="upfile-txts">
                  <div class="upfile-names">
                    <img
                      v-if="item.url == ''"
                      src="/images/jiazai.png"
                      width="50px"
                      height="50px"
                    />
                    <img
                      v-else
                      v-viewer.static="{ inline: false }"
                      :src="settings.fileurl + item.url"
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 4)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="ecmbody-next">
        <img src="@/assets/images/next.png" type="primary" @click="orderNext(1)" />
      </div>
    </div>
    <div v-if="steps == 1" @click="isActive = true" @mouseleave="isActive = false">
      <div ref="targetDiv">
        <ToothPosition
          v-if="isDisplay"
          ref="childRef"
          :key="classKey"
          :isLongMa="isLongMa"
          :classList="classList"
          :isClassValue="isClassValue"
          :factoryId="factoryId"
          :classNoList="classNoList"
          :toothValue="orderToothForm"
          :options="options"
          :colorData="colorData"
          :orderMl="orderMl"
          :isMenuDisplay="isMenuDisplay"
          @setClassValue="setClassValue"
          @setClassClose="setClassClose"
          @setNoClass="setNoClass"
          @setToothValue="setToothValue"
          @setColorValue="setColorValue"
          @setFactoryIdValue="setFactoryIdValue"
        />
      </div>
      <div class="ecmbody-nexts" style="margin-top: 15px">
        <div class="ecmbody-back">
          <img src="@/assets/images/back.png" type="primary" @click="orderBack(1)" />
        </div>
        <div class="ecmbody-nexts1">
          <img src="@/assets/images/next.png" type="primary" @click="orderNext(99)" />
        </div>
      </div>
    </div>
    <div v-if="steps == 2">
      <div class="ecmbody-info3s">
        <div class="ecmbody-info3-title">病例信息</div>
        <div class="ecmbody-info3-content">
          <el-form
            v-if="isEntrust"
            ref="orderModule"
            :inline="true"
            :model="diseaseSeriesForm"
            :rules="rules"
            label-position="left"
            class="ecmbody-info-eldialog"
          >
            <el-row style="height: 45px">
              <el-col :span="5">
                <el-form-item label="患者姓名" prop="name">
                  <el-input
                    v-model="diseaseSeriesForm.name"
                    size="small"
                    style="width: 102px"
                    placeholder="请输入患者姓名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="模型种类" prop="mxType">
                  <el-select
                    v-model="diseaseSeriesForm.mxType"
                    style="width: 165px"
                    placeholder="请选择模型种类"
                    size="small"
                  >
                    <el-option
                      v-for="(it, index) in orderMx"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="订单种类" prop="produceType">
                  <el-select
                    v-model="diseaseSeriesForm.produceType"
                    style="width: 145px"
                    placeholder="请选择订单种类"
                    disabled="true"
                    size="small"
                  >
                    <el-option
                      v-for="(it, index) in orderSc"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="医疗机构" prop="institution">
                  <el-select
                    v-model="diseaseSeriesForm.institution"
                    style="width: 360px"
                    placeholder="请选择医疗机构"
                    disabled="true"
                    size="small"
                    @change="handleInstitutionChange"
                  >
                    <el-option
                      v-for="(it, index) in orderRadio"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="height: 45px">
              <el-col :span="5">
                <el-form-item label="是否试戴" prop="isTest">
                  <el-select
                    v-model="diseaseSeriesForm.isTest"
                    style="width: 128px"
                    placeholder="请选择是否试戴"
                    size="small"
                  >
                    <el-option
                      v-for="(it, index) in orderSd"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="&nbsp;&nbsp;颜 &nbsp;&nbsp;色">
                  <div class="yanse">
                    <CustomInputSelect
                      v-model="diseaseSeriesForm.Color1.label"
                      :options="options"
                      placeholder="请选择颜色"
                      @change="(v) => onColorChanges(v, 'Color1')"
                      @clearValue="(val) => clearColor()"
                      @input="(v) => onColorInput(v, 'Color1')"
                    />
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="13">
                <el-form-item label="加 工 厂 &nbsp;" prop="client">
                  <el-select
                    v-model="diseaseSeriesForm.client"
                    style="width: 580px"
                    size="small"
                    placeholder="请选择加工厂"
                  >
                    <el-option
                      v-for="(it, index) in orderWt"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-form
            v-else
            ref="orderModule"
            :inline="true"
            :model="diseaseSeriesForm"
            :rules="rules"
            label-position="left"
            class="ecmbody-info-eldialog"
          >
            <el-row style="height: 45px">
              <el-col :span="5">
                <el-form-item label="患者姓名" prop="name">
                  <el-input
                    v-model="diseaseSeriesForm.name"
                    size="small"
                    style="width: 102px"
                    placeholder="请输入患者姓名"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="模型种类" prop="mxType">
                  <el-select
                    v-model="diseaseSeriesForm.mxType"
                    style="width: 165px"
                    placeholder="请选择模型种类"
                    size="small"
                  >
                    <el-option
                      v-for="(it, index) in orderMx"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="订单种类" prop="produceType">
                  <el-select
                    v-model="diseaseSeriesForm.produceType"
                    style="width: 145px"
                    placeholder="请选择订单种类"
                    size="small"
                  >
                    <el-option
                      v-for="(it, index) in orderSc"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="医疗机构" prop="institution">
                  <el-select
                    v-model="diseaseSeriesForm.institution"
                    style="width: 360px"
                    placeholder="请选择医疗机构"
                    size="small"
                    @change="handleInstitutionChange"
                  >
                    <el-option
                      v-for="(it, index) in orderRadio"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row style="height: 45px">
              <el-col :span="5">
                <el-form-item label="医生姓名" prop="doctorName">
                  <el-select
                    v-model="diseaseSeriesForm.doctorName"
                    style="width: 102px"
                    size="small"
                    placeholder="请选择医生姓名"
                    @change="handleYiShengChange"
                  >
                    <el-option
                      v-for="(it, index) in doctors"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label, doctorRequire: it.doctorRequire }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="&nbsp;&nbsp;颜 &nbsp;&nbsp;色">
                  <div class="yanse">
                    <CustomInputSelect
                      v-model="diseaseSeriesForm.Color1.label"
                      :options="options"
                      placeholder="请选择颜色"
                      @change="(v) => onColorChanges(v, 'Color1')"
                      @clearValue="(val) => clearColor()"
                      @input="(v) => onColorInput(v, 'Color1')"
                    />
                  </div>
                  <!--
                  <el-select
                    ref="selectColorsRef"
                    v-model="diseaseSeriesForm.Color1"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    allow-create
                    size="small"
                    placeholder="请选择颜色"
                    style="width: 155px"
                    @change="(v) => onColorChange(v, 'Color1')"
                    @blur="handleSelectBlur('selectColorsRef')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                   &nbsp;
                  <el-select
                    v-model="diseaseSeriesForm.Color2"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    placeholder="颜色"
                    size="small"
                    style="width: 61px"
                    @change="(v) => onColorChange(v, 'Color2')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select>
                  &nbsp;
                  <el-select
                    v-model="diseaseSeriesForm.Color3"
                    filterable
                    remote
                    reserve-keyword
                    clearable
                    size="small"
                    placeholder="颜色"
                    style="width: 61px"
                    @change="(v) => onColorChange(v, 'Color3')"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.id"
                      :label="item.name"
                      :value="item.code"
                    />
                  </el-select> -->
                </el-form-item>
              </el-col>
              <el-col :span="5">
                <el-form-item label="是否试戴" prop="isTest">
                  <el-select
                    v-model="diseaseSeriesForm.isTest"
                    style="width: 145px"
                    placeholder="请选择是否试戴"
                    size="small"
                  >
                    <el-option
                      v-for="(it, index) in orderSd"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="9">
                <el-form-item label="加 工 厂 &nbsp;" prop="client">
                  <el-select
                    v-model="diseaseSeriesForm.client"
                    style="width: 360px"
                    size="small"
                    placeholder="请选择加工厂"
                  >
                    <el-option
                      v-for="(it, index) in orderWt"
                      :key="index"
                      :label="it.label"
                      :value="{ value: it.value, label: it.label }"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>
      <div class="ecmbody-info4s">
        <div class="ecmbody-info4-top">
          <div class="ecmbody-info4-top-title">订单详情</div>
          <div class="ecmbody-info4-top-content">
            <el-table :data="orderForm" stripe style="width: 100%; color: #000000">
              <el-table-column prop="date" label="牙位" width="230">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>牙位</span>
                  </div>
                </template>
                <template #default="scope">
                  <div class="container">
                    <div class="container">
                      <div class="box1">
                        <el-input
                          :value="formatNumArr(scope.row.A, 0)"
                          type="text"
                          input-style="text-align: right;height:20px;"
                          size="small"
                          readonly
                        ></el-input>
                      </div>
                      <div class="box2">
                        <el-input
                          :value="formatNumArr(scope.row.B, 1)"
                          type="text"
                          input-style="text-align: left;height:20px;"
                          size="small"
                          readonly
                        ></el-input>
                      </div>
                      <div class="box3">
                        <el-input
                          :value="formatNumArr(scope.row.C, 0)"
                          type="text"
                          input-style="text-align: right;height:20px;"
                          size="small"
                          readonly
                        ></el-input>
                      </div>
                      <div class="box4">
                        <el-input
                          :value="formatNumArr(scope.row.D, 1)"
                          type="text"
                          input-style="text-align: left;height:20px;"
                          size="small"
                          readonly
                        ></el-input>
                      </div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="项目">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>项目</span>
                  </div>
                </template>
                <template #default="scope">
                  <el-select
                    v-model="scope.row.orderProductName"
                    filterable
                    remote
                    reserve-keyword
                    :remote-method="(val) => handleSearch(val, scope.row)"
                    :loading="loadings"
                    style="font-size: 12px"
                    placeholder="请输入项目关键字"
                    size="small"
                  >
                    <el-option
                      v-for="item in scope.row.xmOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.label"
                      @click="onUpProductChange(item, scope.row)"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column width="180" label="型号">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>型号</span>
                  </div>
                </template>
                <template #default="scope">
                  <el-select
                    :ref="(el) => (selectRefs[scope.$index] = el)"
                    v-model="scope.row.Model"
                    style="width: 100%; height: 0px; overflow: hidden"
                    size="small"
                  >
                    <el-option
                      v-for="item in scope.row.xhOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="{ label: item.label, value: item.value }"
                      @click="onUpModelChange(item, scope.row)"
                    />
                  </el-select>
                  <div class="xinghao">
                    <div
                      class="select-input"
                      @click.stop="handleForceShowSelect(scope.$index, scope.row.hasType)"
                    >
                      <input
                        v-model="scope.row.XhModel"
                        :placeholder="scope.row.xhOptions.length > 0 ? '请选择型号' : '无...'"
                        class="input-inner"
                        :readonly="scope.row.hasType == 0"
                        @input="handleInput(scope.row.XhModel, scope.row)"
                        @focus="handleFocus(scope.row)"
                        @blur="handleBlurInput(scope.row)"
                      />
                      <button
                        v-if="scope.row.XhModel && scope.row.XhModelIsOpen"
                        class="clear-btn"
                        @click="clearModelValue(scope.row)"
                      >
                        <el-icon size="14px"><CircleClose /></el-icon>
                      </button>
                      <span class="arrow" :class="{ rotate: scope.row.XhModelIsOpen }">
                        <el-icon><ArrowDown /></el-icon>
                      </span>
                    </div>
                  </div>
                </template>
              </el-table-column>

              <el-table-column label="数量" align="center" width="90">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>数量</span>
                  </div>
                </template>
                <template #default="scope">
                  <span :title="scope.row.Number" class="nr-txt">
                    {{ scope.row.Number }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column width="180" label="制作类型">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>制作类型</span>
                  </div>
                </template>
                <template #default="scope">
                  <el-select v-model="scope.row.make" size="small">
                    <el-option
                      v-for="item in scope.row.makeOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="{ label: item.name, value: item.id }"
                    />
                  </el-select>
                </template>
              </el-table-column>
              <!-- <el-table-column label="备注">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>备注</span>
                  </div>
                </template>
                <template #default="scope">
                  <el-input
                    v-model="scope.row.Remarks"
                    type="text"
                    size="small"
                    style="font-size: 12px"
                    @blur="onBeiZhu(scope.row)"
                  />
                </template>
              </el-table-column> -->
              <el-table-column label="操作" fixed="right" width="120">
                <template #header>
                  <div class="ecmbody-left-content3-title">
                    <div class="ecmbody-left-content3-title-1">|</div>
                    <span>操作</span>
                  </div>
                </template>
                <template #default="scope">
                  <img
                    src="@/assets/images/bjxx.png"
                    title="编辑"
                    style="cursor: pointer; height: 18px"
                    @click="upOrder(scope.row)"
                  />
                  &nbsp;
                  <img
                    src="@/assets/images/fz.png"
                    title="复制"
                    style="cursor: pointer"
                    @click="copyOrder(scope.row)"
                  />
                  &nbsp;
                  <img
                    src="@/assets/images/del1.png"
                    title="删除"
                    style="cursor: pointer"
                    @click="delOrder(scope.row)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="ecmbody-info4-top">
          <div class="ecmbody-info4-top-title">医生要求</div>
          <div class="ecmbody-info4-top-content">
            <el-row>
              <el-col :span="24" class="ecmbody-info3-content-1">
                <el-input
                  v-model="diseaseSeriesForm.doctorRemarks"
                  type="textarea"
                  :rows="2"
                  placeholder="请输入医生备注"
                >
                  <template #prepend></template>
                </el-input>
              </el-col>
            </el-row>
          </div>
        </div>
      </div>
      <div class="ecmbody-infos" style="background-color: white">
        <div class="ecmbody-info-title1">数据资料</div>
        <div class="ecmbody-info-content">
          <el-form
            ref="recordForm"
            class="ecmbody-info-content-form"
            :model="informationForm"
            label-width="100px"
            label-position="left"
          >
            <el-form-item style="height: 2px">
              <el-progress
                v-if="showProgress"
                :stroke-width="6"
                :percentage="percentage"
                :status="success"
              />
            </el-form-item>
            <el-form-item label="CBCT" prop="cbctfileUrls" style="display: flex">
              <el-upload
                v-model="cbctfileUrls"
                :http-request="handleUpload"
                class="upload-demo"
                :show-file-list="false"
                multiple
              >
                <!-- 上传文件按钮 -->
                <el-button type="primary">上传文件</el-button>
              </el-upload>
              <div v-for="(item, index) in cbctfileUrls" :key="index" class="upfile">
                <el-icon style="padding-top: 16px"><Document /></el-icon>
                <div class="upfile-txt">
                  <div class="upfile-name">&nbsp;{{ item.fileName }}</div>
                  <div class="upfile-jindu" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 1)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
            <el-form-item label="口扫数据" prop="mouthfileUrls">
              <el-upload
                v-model="mouthfileUrls"
                :http-request="handleUploads"
                class="upload-demo"
                :show-file-list="false"
                multiple
              >
                <!-- 上传文件按钮 -->
                <el-button type="primary">上传文件</el-button>
              </el-upload>
              <div v-for="(item, index) in mouthfileUrls" :key="index" class="upfile">
                <el-icon style="padding-top: 16px"><Document /></el-icon>
                <div class="upfile-txt">
                  <div class="upfile-name">&nbsp;{{ item.fileName }}</div>
                  <div class="upfile-jindu" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 2)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
            <el-form-item label="比色照" prop="colorpicUrls">
              <el-upload
                v-model="colorpicUrls"
                :http-request="colorpUpload"
                :show-file-list="false"
                multiple
                list-type="picture-card"
              >
                <img src="@/assets/images/upimg.png" width="50px" />
              </el-upload>

              <div v-for="(item, index) in colorpicUrls" :key="index" class="upfiles">
                <div class="upfile-txts">
                  <div class="upfile-names">
                    <img
                      v-if="item.url == ''"
                      src="/images/jiazai.png"
                      width="50px"
                      height="50px"
                    />
                    <img
                      v-else
                      v-viewer.static="{ inline: false }"
                      :src="settings.fileurl + item.url"
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 3)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
            <el-form-item label="制作照" prop="makepicUrls">
              <el-upload
                v-model="makepicUrls"
                :http-request="makeUpload"
                class="upload-demo"
                :show-file-list="false"
                multiple
                list-type="picture-card"
              >
                <img src="@/assets/images/upimg.png" width="50px" height="50px" />
              </el-upload>

              <div v-for="(item, index) in makepicUrls" :key="index" class="upfiles">
                <div class="upfile-txts">
                  <div class="upfile-names">
                    <img
                      v-if="item.url == ''"
                      src="/images/jiazai.png"
                      width="50px"
                      height="50px"
                    />
                    <img
                      v-else
                      v-viewer.static="{ inline: false }"
                      :src="settings.fileurl + item.url"
                      width="50px"
                      height="50px"
                    />
                  </div>
                  <div class="upfile-jindus" :style="[{ display: `${item.display}` }]">
                    <div
                      :style="[
                        {
                          'background-color': '#409eff',
                          height: '3px',
                          width: `${item.percentage}`,
                        },
                      ]"
                    ></div>
                  </div>
                </div>
                <span
                  title="删除文件"
                  :style="[{ display: `${item.percentage == '100%' ? 'block' : 'none'}` }]"
                  @click="handleRemove(item.name, 4)"
                >
                  <img src="@/assets/images/del.png" />
                </span>
              </div>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="ecmbody-nexts">
        <div class="ecmbody-back">
          <img src="@/assets/images/back.png" type="primary" @click="orderBack(2)" />
        </div>
        <div class="ecmbody-nexts1">
          <el-button
            v-loading.fullscreen.lock="fullscreenLoading"
            :disabled="isSubmit"
            element-loading-text="订单创建中..."
            type="primary"
            style="width: 130px; height: 45px"
            @click="submitOrder"
          >
            提交订单
          </el-button>
        </div>
      </div>
      <div class="ecmbody-zhanwei"></div>
    </div>
    <div v-if="steps == 3">
      <div class="ecmbody-ok">
        <img src="@/assets/images/Frameok.png" />
        <div class="ecmbody-ok-txt">
          <div class="ecmbody-ok-txt2">页面将于&nbsp;&nbsp;</div>
          <div class="ecmbody-ok-txt1">{{ countdown }}</div>
          <div class="ecmbody-ok-txt2">&nbsp;&nbsp;秒后跳转到订单管理</div>
        </div>
        <div class="ecmbody-ok-btn">
          <div class="ecmbody-ok-btn1" @click="openOrder">
            <el-icon size="20"><Back /></el-icon>
            订单列表
          </div>
          <div class="ecmbody-ok-btn1" @click="openDetails">
            <el-icon size="20"><Back /></el-icon>
            订单详情
          </div>
        </div>
      </div>
    </div>
    <div class="ecmbody-zhanwei"></div>
    <el-dialog
      v-model="dialogVisible"
      draggable
      title=""
      :show-close="false"
      :close-on-click-modal="false"
      width="500"
      :before-close="handleClose"
    >
      <template #default>
        <div class="dialog_top">
          <img src="@/assets/images/qr.png" />
          <span class="dialog_title">重要信息确认</span>
        </div>
        <div class="dialog_content">
          <div class="dialog_content1">
            <div v-for="item in okList" :key="item" class="dialog_content1-1">
              <div v-for="(values, key) in item" :key="key">{{ key }}： {{ values.join(" ") }}</div>
            </div>
          </div>
          <div class="dialog_content2">
            <el-checkbox v-model="checked">我确认以上为正确的单连冠型号和牙位信息</el-checkbox>
          </div>
        </div>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="okNext">
            确认&nbsp;
            <el-icon size="19px"><Right /></el-icon>
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="visible"
      draggable
      title=""
      :show-close="false"
      :close-on-click-modal="false"
      width="1250px"
      :before-close="handleClose"
    >
      <div ref="targetsDiv">
        <ToothPosition
          v-if="isDisplay"
          :key="classKey"
          ref="toohRef"
          :isLongMa="isLongMa"
          :classList="classList"
          :isClassValue="isClassValue"
          :factoryId="factoryId"
          :classNoList="classNoList"
          :toothValue="orderToothForm"
          :options="options"
          :colorData="colorData"
          :orderMl="orderMl"
          :isMenuDisplay="isMenuDisplay"
          @setClassValue="setClassValue"
          @setClassClose="setClassClose"
          @setNoClass="setNoClass"
          @setToothValue="setToothValue"
          @setColorValue="setColorValue"
          @setFactoryIdValue="setFactoryIdValue"
        />
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="noup">取消</el-button>
          <el-button type="primary" @click="okup">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import settings from "@/settings";
defineOptions({
  name: "order",
  inheritAttrs: false
});
import router from "@/router";
import OrderAPI from "@/api/order";
import DictAPI from "@/api/system/dict";
import ClassAPI from "@/api/dentalProductItemClassify";
import ColorAPI from "@/api/basic/color";
import ProductAPI from "@/api/basic/product";
import { useUserStore } from "@/store/modules/user";
import { setQueryParamsData, getXdColor, clearXdColor } from "@/utils/auth";
const routes = useRoute();
import FileAPI from "@/api/file";
const isActive = ref(false);
const childRef = ref(null);
const targetDiv = ref(null);
const toohRef = ref(null);
const targetsDiv = ref(null);
const fileUpCount = ref(0);
const fileOkUpCount = ref(0);
const visible = ref(false);
const isDisplay = ref(false);
const isMenuDisplay = ref(true);
const selectRefs = ref({});
const dialogVisible = ref(false);
const checked = ref(false);
const loading = ref(false);
const loadings = ref(false);
const issetImg = ref(false);
const isSubmit = ref(false);
const fullscreenLoading = ref(false);
const selectColorsRef = ref();
const classKey = ref(1);
const classList = ref([]);
const classNoList = ref([]);
const classAllList = ref([]);
const isLongMa = ref(false);
const isClassValue = ref(1);
const factoryId = ref(0);
const factoryMenuId = ref(0);
const classifyId = ref(0);
const orderId = ref(0);
isLongMa.value = false;
const options = ref([]);
const blVisible = ref(false);
const ddVisible = ref(false);
const chunk = reactive({
  file: Blob,
  filePartName: "",
  urlParameter: "",
  originalFileName: "",
  partNumber: 0,
  chunks: 0,
  size: 0,
  start: 0,
  end: 0,
  total: 0
});
const orderModule = ref();
const recordForm = ref();
const orderToothForm = ref([]);
const orderForm = ref([
  {
    A: [],
    B: [],
    C: [],
    D: [],
    Model: "",
    Remarks: "",
    orderProductName: "",
    orderProduct: 0,
    id: 0,
    Number: 1,
    WgColor1: "",
    WgColor2: "",
    WgColor3: ""
  }
]);
const orderToohForm = ref([
  {
    A: [],
    B: [],
    C: [],
    D: [],
    Model: "",
    Remarks: "",
    orderProductName: "",
    orderProduct: 0,
    id: 0,
    Number: 1,
    WgColor1: "",
    WgColor2: "",
    WgColor3: ""
  }
]);
const orderUpForm = ref([]);
const orderRadio = ref([]);
const okList = ref([]);
const isEntrust = ref(false);
const active = ref(0);
const title = ref("01 基本信息");
const ordertype = ref(0);
const countdown = ref(5);
const timer = ref();
const steps = ref(0);
steps.value = 0;
const doctorRequire = ref("");
const orderMx = reactive([]);
const orderSc = reactive([]);
let orderWt = ref([]);
let orderMl = ref([]);
const orderSd = reactive([]);
const orderXh = reactive([]);
const route = useRoute();
const colorData = reactive({
  Color1: "",
  Color2: "",
  Color3: ""
});
const Colors1 = ref();
const diseaseSeriesForm = reactive({
  sex: "男",
  oneClass: "",
  mxType: "",
  produceType: "",
  Color1: "",
  Color2: "",
  Color3: ""
});
const queryColorParams = reactive({
  pageIndex: 1,
  pageSize: 100
});
const queryParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  visible: true,
  isRelation: true,
  pitemFactoryId: 0
});
const productParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  factoryId: 0
});
const orderFormInfo = reactive({
  autoOrderNo: true,
  makes: [
    {
      orderId: 0,
      barcode: "",
      details: []
    }
  ]
});
const orderMakesForm = reactive({
  orderId: 0,
  barcode: "",
  details: []
});
const orderDetailsForm = reactive({
  omId: 0
});
const ToothParams = reactive({
  tooths: []
});
const ToothsParams = reactive({
  orderId: 0,
  creationTime: null,
  factoryId: 0,
  customerId: 0,
  patientName: "",
  details: []
});
const orderToohs = reactive({});
const oldTooths = ref([]);
const oldisClassValue = ref(0);
const oldclassList = ref([]);
const colorpicUrls = ref([]);
const makepicUrls = ref([]);
const cbctfileUrls = ref([]);
const mouthfileUrls = ref([]);
const nullOrder = ref({
  A: "",
  B: "",
  C: "",
  D: "",
  Model: "",
  Remarks: "",
  orderProductName: "",
  Number: 1,
  IsUpBool: false,
  xhOptions: [],
  xmOptions: [],
  id: 100
});
const doctors = ref([]);
const orderInfo = ref({
  orderId: "",
  guid: ""
});
const orderFileInfo = reactive({
  orderId: 0,
  omId: 0
});
const orderFilesInfo = reactive({
  type: 0,
  url: ""
});
function numValid(inputContent) {
  var reg = /^(1|([1-9]\d{0,1}\d{0,1})|150)$/;
  if (reg.test(inputContent) == false) {
    ElNotification({
      title: "Error",
      message: "年龄只能是数字!",
      type: "error",
      duration: 3e3
    });
    diseaseSeriesForm.age = "";
    return false;
  } else {
    diseaseSeriesForm.age = inputContent;
  }
}
const rules = reactive({
  mxType: [{ required: true, message: "请选择模型种类", trigger: "blur" }],
  institution: [{ required: true, message: "请选择医疗机构", trigger: "blur" }],
  produceType: [{ required: true, message: "请选择订单种类", trigger: "blur" }],
  client: [{ required: true, message: "请选择加工厂", trigger: "blur" }],
  doctorName: [{ required: true, message: "请输入医生姓名", trigger: "blur" }],
  name: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
  // age: [
  //   { required: true, message: "请输入患者年龄", trigger: "blur" },
  //   { validator: isNum, trigger: "blur" },
  // ],
  // sex: [{ required: true, message: "请选择性别", trigger: "blur" }],
  isTest: [{ required: true, message: "请选择是否试戴", trigger: "blur" }]
});
const informationForm = ref([]);
const user = useUserStore().userInfo;
const usercode = user.members.orgRoleCodes;
const queryOrderParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  keywords: "",
  day: "no",
  createTime: null,
  orgRoleCodes: usercode
});
if (usercode.includes("10040") || usercode.includes("10041")) {
  isEntrust.value = true;
}
const orderParams = reactive({
  pageIndex: 1,
  pageSize: 10,
  keywords: "",
  day: "oneDay",
  createTime: ["", ""],
  orgRoleCodes: user.members.orgRoleCodes
});
const organParams = reactive({
  OrgId: user.members.orgId
});
const doctorParams = reactive({
  orgId: user.members.orgId,
  orgRoleCodes: user.members.orgRoleCodes.join(",")
});
const processParams = reactive({
  OrgId: user.members.orgId
});
const orderMlParams = reactive({
  customerId: doctorParams.orgId,
  factoryId: factoryMenuId.value
});
const diseaseSeriesForms = reactive({
  sex1: "男",
  oneClass: "",
  mxType: "",
  institution: "",
  produceType: "",
  client: "",
  doctorName: "",
  name: "",
  age: 0,
  isTest: ""
});
function getOrganDatas() {
  OrderAPI.getOrganData(organParams).then((data) => {
    if (data.length > 0) {
      data = data.filter((a) => a.label != "");
      if (data.length == 1) {
        const jigou = {
          value: data[0].value,
          label: data[0].label
        };
        diseaseSeriesForm.institution = jigou;
        handleInstitutionChange(jigou);
      }
      orderRadio.value = data;
    }
    if (user.members.orgRoleCodes.indexOf("10031") > -1) {
      doctors.value = [{ label: user.members.name, value: user.members.id }];
      doctorRequire.value = user.members.doctorRequire;
      diseaseSeriesForm.doctorName = { name: user.members.name, id: user.members.id };
    }
    if (isEntrust.value) {
      const jg = orderRadio.value.filter((a) => {
        return a.value == user.members.orgId;
      });
      diseaseSeriesForm.institution = jg.length > 0 ? jg[0] : {};
      doctors.value = [];
      if (jg.length > 0) {
        getProcessingData(jg[0].value);
      }
    }
  });
}
function handleInstitutionChange(val) {
  doctorParams.orgId = val.value;
  diseaseSeriesForm.doctorName = "";
  diseaseSeriesForm.client = "";
  OrderAPI.getDoctorData(doctorParams).then((data) => {
    if (data.length > 0) {
      doctors.value = data;
      if (data.length == 1) {
        doctors.value = [{ label: data[0].label, value: data[0].value }];
        diseaseSeriesForm.doctorName = { label: data[0].label, value: data[0].value };
        doctorRequire.value = data[0].doctorRequire;
        diseaseSeriesForm.doctorRequire = data[0].doctorRequire;
      }
    } else {
      doctors.value = [];
      doctorRequire.value = "";
    }
  });
  getProcessingData(val.value);
}
function handleInstWeiTuoChange(val) {
  factoryMenuId.value = val.value;
  getDefaultFactoryId();
}
function getDefaultFactoryId() {
  orderMlParams.customerId = doctorParams.orgId;
  orderMlParams.factoryId = factoryMenuId.value;
  OrderAPI.getDefaultFactory(orderMlParams).then((data) => {
    classList.value = [];
    factoryId.value = data.pitemFactoryId;
    orderMl.value = data.options;
    const fc = data.options.filter((a) => {
      return a.value == data.pitemFactoryId;
    });
    diseaseSeriesForm.factoryId = { value: fc[0].value, label: fc[0].label };
  });
}
function handleInstMenuChange(val) {
  let newTooth = orderToothForm.value;
  newTooth.forEach((item) => {
    let tooth = item.value;
    tooth.XingHao = [];
    tooth.WgXingHao = [];
    tooth.orderNameProduct = "";
    tooth.orderProduct = 0;
    tooth.orderWgNameProduct = "";
    tooth.orderWgProduct = 0;
    tooth.isColor = false;
    tooth.isWgColor = false;
    tooth.hasType = 0;
    tooth.hasWgType = 0;
    tooth.Color1 = "";
    tooth.Color2 = "";
    tooth.Color3 = "";
    tooth.WgColor1 = "";
    tooth.WgColor2 = "";
    tooth.WgColor3 = "";
  });
  setFactoryIdValue(val, newTooth);
}
function handleYiShengChange(val) {
  doctorRequire.value = val.doctorRequire;
  diseaseSeriesForm.doctorRemarks = val.doctorRequire;
}
function clearColors1() {
  orderToothForm.value.forEach((a) => {
    a.value.Color1 = "";
    a.value.WgColor1 = "";
  });
}
function clearColor() {
  orderToothForm.value.forEach((a) => {
    a.value.Color1 = "";
    a.value.WgColor1 = "";
  });
  diseaseSeriesForm.Color1 = {
    isCustom: false,
    label: "",
    value: ""
  };
}
function getProcessingData(val) {
  processParams.OrgId = val;
  OrderAPI.getProcessingData(processParams).then((data) => {
    if (data.length == 1) {
      diseaseSeriesForm.client = { value: data[0].value, label: data[0].label };
      factoryMenuId.value = data[0].value;
      getDefaultFactoryId();
    }
    let arr = Array.from(data);
    orderWt.value = [...arr];
    if (isEntrust.value) {
      const wtgc = orderWt.value.filter((a) => {
        return a.label == "ECM";
      });
      diseaseSeriesForm.client = wtgc.length > 0 ? wtgc[0] : {};
      factoryId.value = wtgc.length > 0 ? wtgc[0].value : 0;
      factoryMenuId.value = wtgc.length > 0 ? wtgc[0].value : 0;
    }
  });
}
function Query() {
  const codes = "Order_MxType,Order_ProdRange,Order_WtType,IsTest";
  DictAPI.getOptionsList(codes).then((data) => {
    const mxarr = data.filter((item) => {
      return item.code == "Order_MxType";
    });
    const scarr = data.filter((item) => {
      return item.code == "Order_ProdRange";
    });
    const sdarr = data.filter((item) => {
      return item.code == "IsTest";
    });
    Object.assign(orderMx, mxarr.length > 0 ? mxarr[0].dictDataList : []);
    diseaseSeriesForm.mxType = {
      label: mxarr[0].dictDataList[0].label,
      value: mxarr[0].dictDataList[0].value
    };
    Object.assign(orderSc, scarr.length > 0 ? scarr[0].dictDataList : []);
    Object.assign(orderSd, sdarr.length > 0 ? sdarr[0].dictDataList : []);
    diseaseSeriesForm.isTest = {
      label: sdarr[0].dictDataList[0].label,
      value: sdarr[0].dictDataList[0].value
    };
    if (isEntrust.value) {
      const jsj = orderSc.filter((a) => {
        return a.label == "仅设计";
      });
      diseaseSeriesForm.produceType = jsj.length > 0 ? jsj[0] : {};
    } else {
      diseaseSeriesForm.produceType = {
        label: scarr[0].dictDataList[0].label,
        value: scarr[0].dictDataList[0].value
      };
    }
  });
}
function orderNext(v) {
  switch (v) {
    case 1:
      orderModule.value.validate((valid) => {
        if (valid) {
          steps.value += 1;
          active.value += 1;
          title.value = "02 项目详情";
          isMenuDisplay.value = true;
          getClass(1);
        }
      });
      break;
    case 2:
      steps.value += 1;
      active.value += 1;
      title.value = "03 确认订单";
      setOrder();
      break;
    case 3:
      steps.value += 1;
      active.value += 1;
      title.value = "下单成功！";
      setCountdown();
      break;
    case 99:
      okTooth();
      break;
  }
}
function orderBack(v) {
  switch (v) {
    case 1:
      steps.value -= 1;
      active.value -= 1;
      title.value = "01 基本信息";
      issetImg.value = true;
      break;
    case 2:
      steps.value -= 1;
      active.value -= 1;
      title.value = "02 项目详情";
      isMenuDisplay.value = true;
      setOrderFrom();
      break;
  }
}
function handleUpload(options2) {
  const file = options2.file;
  const fileChunks = [];
  var maxFileSizeMB = 2;
  var bufferChunkSize = maxFileSizeMB * (1024 * 1024);
  var fileStreamPos = 0;
  var endPos = bufferChunkSize;
  var size = file.size;
  while (fileStreamPos < size) {
    var fileChunkInfo = {
      file: file.slice(fileStreamPos, endPos),
      start: fileStreamPos,
      end: endPos
    };
    fileChunks.push(fileChunkInfo);
    fileStreamPos = endPos;
    endPos = fileStreamPos + bufferChunkSize;
  }
  var totalParts = fileChunks.length;
  var partCount = 0;
  var chunks = null;
  const fileName = getFileExtension(file.name);
  var chunkInfo = [];
  const hz = getFileExtensions(file.name);
  const newFileName = "cbct-" + diseaseSeriesForm.name + hz;
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = newFileName;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  const cbct = {
    fileName,
    url: "",
    name: "",
    percentage: "0%",
    display: "block",
    fileId: 0
  };
  cbctfileUrls.value.push(cbct);
  allUplod(chunkInfo, 2, "cbct");
}
async function allUplod(chunkInfo, batchSize, type) {
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  fileUpCount.value += 1;
  for (let i = 0; i < totalBatches; i++) {
    const batchChunks = chunkInfo.slice(i * batchSize, (i + 1) * batchSize);
    const number2 = (i + 1) * batchSize;
    switch (type) {
      case "cbct":
        const batchPromise = batchChunks.map((it) => UploadFileChunk(it, number2, chunkInfo.length));
        await Promise.all(batchPromise);
        break;
      case "kssj":
        const batchPromises = batchChunks.map(
          (it) => UploadFileChunks(it, number2, chunkInfo.length)
        );
        await Promise.all(batchPromises);
        break;
      case "color":
        const batchColorPromises = batchChunks.map(
          (it) => colorpUploadChunk(it, number2, chunkInfo.length)
        );
        await Promise.all(batchColorPromises);
        break;
      case "make":
        const batchMakePromises = batchChunks.map(
          (it) => makeUploadChunk(it, number2, chunkInfo.length)
        );
        await Promise.all(batchMakePromises);
        break;
    }
  }
}
async function UploadFileChunk(chunk2, i, z) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("OriginalFileName", chunk2.originalFileName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = cbctfileUrls.value.findIndex((item) => item.fileName === chunk2.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      cbctfileUrls.value[index].fileName = chunk2.originalFileName;
      cbctfileUrls.value[index].url = imgurl;
      cbctfileUrls.value[index].name = imgname;
      cbctfileUrls.value[index].percentage = "100%";
      cbctfileUrls.value[index].display = "none";
      cbctfileUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i / (z + 1) * 100);
      cbctfileUrls.value[index].percentage = c + "%";
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}`,
      type: "error",
      duration: 3e3
    });
    loading.value = false;
  });
}
function handleUploads(options2) {
  const file = options2.file;
  const fileChunks = [];
  var maxFileSizeMB = 2;
  var bufferChunkSize = maxFileSizeMB * (1024 * 1024);
  var fileStreamPos = 0;
  var endPos = bufferChunkSize;
  var size = file.size;
  while (fileStreamPos < size) {
    var fileChunkInfo = {
      file: file.slice(fileStreamPos, endPos),
      start: fileStreamPos,
      end: endPos
    };
    fileChunks.push(fileChunkInfo);
    fileStreamPos = endPos;
    endPos = fileStreamPos + bufferChunkSize;
  }
  var totalParts = fileChunks.length;
  var partCount = 0;
  var chunks = null;
  const fileName = getFileExtension(file.name);
  const hz = getFileExtensions(file.name);
  const newFileName = "口扫数据-" + diseaseSeriesForm.name + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = newFileName;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  const kssj = {
    fileName,
    url: "",
    name: "",
    percentage: "0%",
    display: "block",
    fileId: 0
  };
  mouthfileUrls.value.push(kssj);
  allUplod(chunkInfo, 2, "kssj");
}
async function UploadFileChunks(chunk2, i, z) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("OriginalFileName", chunk2.originalFileName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = mouthfileUrls.value.findIndex((item) => item.fileName === chunk2.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      mouthfileUrls.value[index].fileName = chunk2.originalFileName;
      mouthfileUrls.value[index].url = imgurl;
      mouthfileUrls.value[index].name = imgname;
      mouthfileUrls.value[index].percentage = "100%";
      mouthfileUrls.value[index].display = "none";
      mouthfileUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i / (z + 1) * 100);
      mouthfileUrls.value[index].percentage = c + "%";
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}`,
      type: "error",
      duration: 3e3
    });
    loading.value = false;
  });
}
function colorpUpload(options2) {
  const file = options2.file;
  const fileChunks = [];
  var maxFileSizeMB = 2;
  var bufferChunkSize = maxFileSizeMB * (1024 * 1024);
  var fileStreamPos = 0;
  var endPos = bufferChunkSize;
  var size = file.size;
  while (fileStreamPos < size) {
    var fileChunkInfo = {
      file: file.slice(fileStreamPos, endPos),
      start: fileStreamPos,
      end: endPos
    };
    fileChunks.push(fileChunkInfo);
    fileStreamPos = endPos;
    endPos = fileStreamPos + bufferChunkSize;
  }
  var totalParts = fileChunks.length;
  var partCount = 0;
  var chunks = null;
  const fileName = getFileExtension(file.name);
  const hz = getFileExtensions(file.name);
  const newFileName = "比色照-" + diseaseSeriesForm.name + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = newFileName;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  const colorp = {
    fileName,
    url: "",
    name: "",
    percentage: "0%",
    display: "block",
    fileId: 0
  };
  colorpicUrls.value.push(colorp);
  allUplod(chunkInfo, 2, "color");
}
async function colorpUploadChunk(chunk2, i, z) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("OriginalFileName", chunk2.originalFileName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = colorpicUrls.value.findIndex((item) => item.fileName === chunk2.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      colorpicUrls.value[index].fileName = chunk2.originalFileName;
      colorpicUrls.value[index].url = imgurl.replace("&width=400", "");
      colorpicUrls.value[index].name = imgname;
      colorpicUrls.value[index].percentage = "100%";
      colorpicUrls.value[index].display = "none";
      colorpicUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i / (z + 1) * 100);
      colorpicUrls.value[index].percentage = c + "%";
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}`,
      type: "error",
      duration: 3e3
    });
    loading.value = false;
  });
}
function makeUpload(options2) {
  const file = options2.file;
  const fileChunks = [];
  var maxFileSizeMB = 2;
  var bufferChunkSize = maxFileSizeMB * (1024 * 1024);
  var fileStreamPos = 0;
  var endPos = bufferChunkSize;
  var size = file.size;
  while (fileStreamPos < size) {
    var fileChunkInfo = {
      file: file.slice(fileStreamPos, endPos),
      start: fileStreamPos,
      end: endPos
    };
    fileChunks.push(fileChunkInfo);
    fileStreamPos = endPos;
    endPos = fileStreamPos + bufferChunkSize;
  }
  var totalParts = fileChunks.length;
  var partCount = 0;
  var chunks = null;
  const fileName = getFileExtension(file.name);
  const hz = getFileExtensions(file.name);
  const newFileName = "制作照-" + diseaseSeriesForm.name + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk2 = {};
    chunk2.file = chunks2.file;
    chunk2.filePartName = fileName;
    chunk2.originalFileName = newFileName;
    chunk2.urlParameter = "";
    chunk2.partNumber = index + 1;
    chunk2.chunks = totalParts;
    chunk2.size = bufferChunkSize;
    chunk2.start = chunks2.start;
    chunk2.end = chunks2.end;
    chunk2.total = size;
    chunkInfo.push(chunk2);
  });
  const makep = {
    fileName,
    url: "",
    name: "",
    percentage: "0%",
    display: "block",
    fileId: 0
  };
  makepicUrls.value.push(makep);
  allUplod(chunkInfo, 2, "make");
}
async function makeUploadChunk(chunk2, i, z) {
  var formData = new FormData();
  formData.append("File", chunk2.file);
  formData.append("FileName", chunk2.filePartName);
  formData.append("OriginalFileName", chunk2.originalFileName);
  formData.append("PartNumber", chunk2.partNumber);
  formData.append("Chunks", chunk2.chunks);
  formData.append("Size", chunk2.size);
  formData.append("Start", chunk2.start);
  formData.append("End", chunk2.end);
  formData.append("Total", chunk2.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = makepicUrls.value.findIndex((item) => item.fileName === chunk2.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      makepicUrls.value[index].fileName = chunk2.originalFileName;
      makepicUrls.value[index].url = imgurl.replace("&width=400", "");
      makepicUrls.value[index].name = imgname;
      makepicUrls.value[index].percentage = "100%";
      makepicUrls.value[index].display = "none";
      makepicUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i / (z + 1) * 100);
      makepicUrls.value[index].percentage = c + "%";
      return true;
    }
  }).catch((error) => {
    ElNotification({
      title: "Error",
      message: `${error}`,
      type: "error",
      duration: 3e3
    });
    loading.value = false;
  });
}
function getFileExtension(filename) {
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return filename.split(`.${match}`)[0] + (Math.floor(Math.random() * 9e4) + 1e4) + "." + match;
}
function getFileExtensions(filename) {
  const date = /* @__PURE__ */ new Date();
  let datatime = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const matchs = filename.match(/\.([^.]+)$/);
  const match = matchs ? matchs[1] : "0";
  return "(pc" + datatime + (Math.floor(Math.random() * 9e3) + 1e3) + ")." + match;
}
function handleRemove(fileUrl, v) {
  FileAPI.deletes(fileUrl).then(() => {
    if (v == 1) {
      cbctfileUrls.value = cbctfileUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 2) {
      mouthfileUrls.value = mouthfileUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 3) {
      colorpicUrls.value = colorpicUrls.value.filter((file) => file.name !== fileUrl);
    } else if (v == 4) {
      makepicUrls.value = makepicUrls.value.filter((file) => file.name !== fileUrl);
    }
  });
}
function getClass(v) {
  queryParams.pitemFactoryId = factoryId.value;
  ClassAPI.getList(queryParams).then((data) => {
    const name = route.query.name;
    const id = route.query.id;
    const classInfo = classList.value;
    classList.value = [];
    classNoList.value = [];
    if (data.length > 0) {
      data.forEach((a) => {
        const info = classInfo.filter((b) => {
          return b.value == a.value;
        });
        if (info.length > 0) {
          a.ids = info[0].ids;
        } else {
          a.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
        }
      });
      if (classInfo.length == 0) {
        let newClassData = data.filter((a) => a.label == name);
        let classNoData = data.filter((a) => a.label != name);
        diseaseSeriesForm.oneClass = name;
        isClassValue.value = parseInt(newClassData[0].ids);
        classList.value = [...newClassData];
        classNoList.value = [...data];
        classAllList.value = data;
        if (classInfo.length == 0) {
          initToothValue(newClassData);
        }
        classKey.value += 1;
      } else {
        classInfo.forEach((item) => {
          const info = data.filter((b) => {
            return b.value == item.value;
          });
          if (info.length > 0) {
            item.children = info[0].children;
            item.relationChildren = info[0].relationChildren;
          }
        });
        classList.value = [...classInfo];
        classNoList.value = data;
        classAllList.value = data;
        classKey.value += 1;
      }
    }
  });
}
function initToothValue(data) {
  let newData = orderToothForm.value.filter((a) => a.name == data[0].value);
  if (newData.length == 0) {
    data.forEach((a) => {
      let tooths = {};
      const tooth = {
        A: [],
        B: [],
        C: [],
        D: [],
        Selected: [],
        Model: "",
        Remarks: "",
        type: "",
        WA: [],
        WB: [],
        WC: [],
        WD: [],
        Color1: "",
        Color2: "",
        Color3: "",
        jtTitle: "",
        hasType: 0,
        teethMode: 20,
        isColor: false,
        WSelected: [],
        XingHao: [],
        childrenXingHao: [],
        productItemClassifyId: 0,
        productItemClassifyWgId: 0,
        orderWgNameProduct: "",
        orderProductName: "",
        orderProduct: 0,
        orderWgProduct: 0,
        WgModel: "",
        WgRemarks: "",
        WgTitle: "",
        isModel: false,
        isWgModel: false,
        id: 0,
        isAdditional: true,
        hasWgType: 0,
        selectedButton: 0,
        WgselectedButton: 0,
        WgColor1: "",
        WgColor2: "",
        WgColor3: "",
        WgXingHao: [],
        childrenWgXingHao: [],
        isWgColor: false,
        teethWgMode: 20,
        lx: "default"
      };
      tooths.name = a.ids;
      tooths.value = tooth;
      orderToothForm.value.push(tooths);
    });
  }
  isDisplay.value = true;
}
function addToothValue(data, v) {
  let tooths = {};
  const tooth = {
    A: [],
    B: [],
    C: [],
    D: [],
    Selected: [],
    Model: "",
    Remarks: "",
    WA: [],
    WB: [],
    WC: [],
    WD: [],
    type: "",
    WSelected: [],
    XingHao: [],
    childrenXingHao: [],
    productItemClassifyId: 0,
    productItemClassifyWgId: 0,
    Color1: "",
    Color2: "",
    Color3: "",
    jtTitle: "",
    hasType: 0,
    teethMode: 20,
    isColor: false,
    DanGuan: [],
    LianGuan: [],
    orderWgNameProduct: "",
    orderProductName: "",
    orderProduct: 0,
    orderWgProduct: 0,
    WgModel: "",
    WgRemarks: "",
    WgTitle: "",
    isModel: false,
    isWgModel: false,
    id: 0,
    isAdditional: true,
    hasWgType: 0,
    selectedButton: 0,
    WgselectedButton: 0,
    WgColor1: "",
    WgColor2: "",
    WgColor3: "",
    WgXingHao: [],
    childrenWgXingHao: [],
    isWgColor: false,
    teethWgMode: 20,
    lx: "default"
  };
  tooths.name = data.ids;
  if (v != "default") {
    tooth.orderProduct = v;
  }
  tooths.value = tooth;
  orderToothForm.value.push(tooths);
  isDisplay.value = true;
}
function okTooth() {
  let isBool = false;
  let isChecked = false;
  let message = "";
  var danGuan = [];
  var lianGuan = [];
  orderToothForm.value.some((a) => {
    const from = a.value;
    if (from.orderProduct == 0) {
      message = `请先选择${from.jtTitle}加工项目!`;
      isChecked = true;
      return true;
    }
    if (from.teethMode > 0 && from.A.length == 0 && from.B.length == 0 && from.C.length == 0 && from.D.length == 0) {
      message = `请先选择${from.jtTitle}牙位图!`;
      isChecked = true;
      return true;
    }
    if ((from.hasType == 10 || from.hasType == 20 || from.hasType == 30) && from.Model == "") {
      const xhLabel = from.XingHao.map((b) => b.label);
      message = `请选择${from.jtTitle}${xhLabel}!`;
      if (xhLabel.length == 0) {
        message = `请选择${from.jtTitle}型号!`;
      }
      isChecked = true;
      return true;
    }
    if (from.isColor == true && from.Color1 == "" && from.Color2 == "" && from.Color3 == "") {
      message = `请选择${from.jtTitle}颜色!`;
      isChecked = true;
      return true;
    }
    const classFrom = classList.value.filter((b) => b.ids == a.name);
    const okClass = classFrom[0].relationChildren;
    const isAdditional = from.isAdditional;
    if (classFrom.length > 0 && okClass.length > 0 && isAdditional) {
      if (from.orderWgProduct == 0) {
        message = `请先选择${from.WgTitle}加工项目!`;
        isChecked = true;
        return true;
      }
      if (from.teethWgMode > 0 && from.WA.length == 0 && from.WB.length == 0 && from.WC.length == 0 && from.WD.length == 0) {
        message = `请先选择${from.WgTitle}牙位图!`;
        isChecked = true;
        return true;
      }
      if ((from.hasWgType == 10 || from.hasWgType == 20 || from.hasWgType == 30) && from.WgModel == "") {
        const xhWgLabel = from.WgXingHao.map((b) => b.label);
        message = `请选择${from.WgTitle}${xhWgLabel}!`;
        if (xhWgLabel.length == 0) {
          message = `请选择${from.WgTitle}型号!`;
        }
        isChecked = true;
        return true;
      }
      if (from.isWgColor == true && from.WgColor1 == "" && from.WgColor2 == "" && from.WgColor3 == "") {
        message = `请选择${from.WgTitle}颜色!`;
        isChecked = true;
        return true;
      }
    }
    from.WgXingHao.forEach((x) => {
      if (x.label == "单冠") {
        if (x.A) {
          x.A.length > 0 ? danGuan.push(x.A) : "";
        }
        if (x.B) {
          x.B.length > 0 ? danGuan.push(x.B) : "";
        }
        if (x.C) {
          x.C.length > 0 ? danGuan.push(x.C) : "";
        }
        if (x.D) {
          x.D.length > 0 ? danGuan.push(x.D) : "";
        }
      }
      if (x.label == "连冠") {
        if (x.A) {
          x.A.length > 0 ? lianGuan.push(x.A) : "";
        }
        if (x.B) {
          x.B.length > 0 ? lianGuan.push(x.B) : "";
        }
        if (x.C) {
          x.C.length > 0 ? lianGuan.push(x.C) : "";
        }
        if (x.D) {
          x.D.length > 0 ? lianGuan.push(x.D) : "";
        }
      }
    });
  });
  if (isChecked) {
    ElNotification({
      title: "Error",
      message: `${message}`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  orderNext(2);
  dialogVisible.value = false;
}
async function setOrder() {
  orderForm.value = [];
  let orderTookMode = [];
  ToothsParams.orderId = 0;
  ToothsParams.factoryId = factoryId.value;
  ToothsParams.customerId = parseInt(diseaseSeriesForm.institution?.value);
  ToothsParams.patientName = diseaseSeriesForm.name;
  ToothsParams.creationTime = (/* @__PURE__ */ new Date()).toLocaleString();
  ToothsParams.details = [];
  let i = 0;
  let color1 = "";
  let color2 = "";
  let color3 = "";
  orderToothForm.value.forEach((a, index) => {
    const order = {
      id: i
    };
    let isOrder = false;
    let desc = "";
    const form = a.value;
    const dl = classList.value.filter((b) => b.ids == a.name);
    if ((form.hasType == 10 || form.hasType == 30) && form.XingHao.length > 0) {
      form.XingHao.forEach((d) => {
        const wgorders = {};
        let desc1 = "";
        let isOrders = false;
        const forms = d;
        if (forms.A.length > 0) {
          forms.A = Array.from(new Set(forms.A));
          let replacedArr = forms.A.map((item) => item.replace(new RegExp("A", "g"), ""));
          replacedArr = replacedArr.sort().reverse();
          wgorders.A = replacedArr.join("");
          desc1 += "A" + wgorders.A.toString();
          isOrders = true;
        }
        if (forms.B.length > 0) {
          forms.B = Array.from(new Set(forms.B));
          let replacedArr = forms.B.map((item) => item.replace(new RegExp("B", "g"), ""));
          replacedArr = replacedArr.sort();
          wgorders.B = replacedArr.join("");
          desc1 += "B" + wgorders.B.toString();
          isOrders = true;
        }
        if (forms.C.length > 0) {
          forms.C = Array.from(new Set(forms.C));
          let replacedArr = forms.C.map((item) => item.replace(new RegExp("C", "g"), ""));
          replacedArr = replacedArr.sort().reverse();
          wgorders.C = replacedArr.join("");
          desc1 += "C" + wgorders.C.toString();
          isOrders = true;
        }
        if (forms.D.length > 0) {
          forms.D = Array.from(new Set(forms.D));
          let replacedArr = forms.D.map((item) => item.replace(new RegExp("D", "g"), ""));
          replacedArr = replacedArr.sort();
          wgorders.D = replacedArr.join("");
          desc1 += "D" + wgorders.D.toString();
          isOrders = true;
        }
        if (isOrders) {
          if (forms.label) {
            wgorders.Model = { value: forms.value, label: forms.label };
            wgorders.xh = forms.label;
            wgorders.XhModel = forms.label;
          }
          wgorders.teethMode = form.teethMode;
          wgorders.isColor = form.isColor;
          wgorders.hasType = form.hasType;
          wgorders.amountMode = form.amountMode;
          if (form.Remarks) {
            wgorders.Remarks = form.Remarks;
          }
          if (form.orderNameProduct) {
            wgorders.orderProductName = form.orderNameProduct;
            if (!wgorders.xh) {
              wgorders.xh = forms.orderNameProduct;
            }
          }
          if (form.orderProduct) {
            wgorders.orderProduct = form.orderProduct;
          }
          if (form.Color1) {
            wgorders.Color1 = form.Color1;
            color1 = form.Color1;
          }
          if (form.Color2) {
            wgorders.Color2 = form.Color2;
            color2 = form.Color2;
          }
          if (form.Color3) {
            wgorders.Color3 = form.Color3;
            color3 = form.Color3;
          }
          if (isOrders) {
            wgorders.hasType = form.hasType;
            wgorders.Number = 1;
            wgorders.id = i;
            wgorders.name = a.name;
            wgorders.type = "jt";
            wgorders.xhOptions = form.XingHao;
            wgorders.oldOrderProduct = form.orderProduct;
            wgorders.productItemClassifyId = form.productItemClassifyId;
            wgorders.tabIndex = index;
            if (dl.length > 0) {
              wgorders.pitemClassTabId = dl[0].value;
            }
            orderForm.value.push(wgorders);
            orderTookMode.push({ id: i, mode: form.amountMode, teethValue: desc1 });
            if (form.orderProduct) {
              ToothsParams.details.push({
                id: i,
                pItemId: parseInt(form.orderProduct),
                teethDesc: desc1
              });
            }
            i++;
          }
        }
      });
    } else {
      if (form.A.length > 0) {
        order.A = form.A.join("");
        desc += "A" + form.A.toString();
        isOrder = true;
      }
      if (form.B.length > 0) {
        order.B = form.B.join("");
        desc += "B" + form.B.toString();
        isOrder = true;
      }
      if (form.C.length > 0) {
        order.C = form.C.join("");
        desc += "C" + form.C.toString();
        isOrder = true;
      }
      if (form.D.length > 0) {
        order.D = form.D.join("");
        desc += "D" + form.D.toString();
        isOrder = true;
      }
      if (form.Model) {
        order.Model = form.Model;
        order.xh = form.Model;
        if (form.Model != void 0 && typeof form.Model !== "string") {
          order.XhModel = form.Model.label;
        }
        isOrder = true;
      }
      if (form.Remarks) {
        order.Remarks = form.Remarks;
        isOrder = true;
      }
      if (form.orderNameProduct) {
        order.orderProductName = form.orderNameProduct;
        isOrder = true;
      }
      if (form.orderProduct) {
        order.orderProduct = form.orderProduct;
        isOrder = true;
      }
      if (form.Color1) {
        order.Color1 = form.Color1;
        color1 = form.Color1;
        isOrder = true;
      }
      if (form.Color2) {
        order.Color2 = form.Color2;
        color2 = form.Color2;
        isOrder = true;
      }
      if (form.Color3) {
        order.Color3 = form.Color3;
        color3 = form.Color3;
        isOrder = true;
      }
      if (isOrder) {
        order.hasType = form.hasType;
        order.isColor = form.isColor;
        order.amountMode = form.amountMode;
        order.teethMode = form.teethMode;
        order.Number = 1;
        order.name = a.name;
        order.type = "jt";
        order.oldOrderProduct = form.orderProduct;
        order.xhOptions = form.childrenXingHao;
        order.productItemClassifyId = form.productItemClassifyId;
        order.tabIndex = index;
        if (dl.length > 0) {
          order.pitemClassTabId = dl[0].value;
        }
        orderForm.value.push(order);
        orderTookMode.push({ id: order.id, mode: form.amountMode, teethValue: desc });
        if (form.orderProduct) {
          ToothsParams.details.push({
            id: i,
            pItemId: parseInt(form.orderProduct),
            teethDesc: desc
          });
        }
        i++;
      }
    }
    if (form.isAdditional) {
      if (form.hasWgType == 10 && form.WgXingHao.length > 0) {
        form.WgXingHao.forEach((d) => {
          const wgorders = {};
          let desc1 = "";
          let isWgOrders = false;
          const forms = d;
          if (forms.A.length > 0) {
            forms.A = Array.from(new Set(forms.A));
            let replacedArr = forms.A.map((item) => item.replace(new RegExp("A", "g"), ""));
            replacedArr = replacedArr.sort().reverse();
            wgorders.A = replacedArr.join("");
            desc1 += "A" + wgorders.A.toString();
            isWgOrders = true;
          }
          if (forms.B.length > 0) {
            forms.B = Array.from(new Set(forms.B));
            let replacedArr = forms.B.map((item) => item.replace(new RegExp("B", "g"), ""));
            replacedArr = replacedArr.sort();
            wgorders.B = replacedArr.join("");
            desc1 += "B" + wgorders.B.toString();
            isWgOrders = true;
          }
          if (forms.C.length > 0) {
            forms.C = Array.from(new Set(forms.C));
            let replacedArr = forms.C.map((item) => item.replace(new RegExp("C", "g"), ""));
            replacedArr = replacedArr.sort().reverse();
            wgorders.C = replacedArr.join("");
            desc1 += "C" + wgorders.C.toString();
            isWgOrders = true;
          }
          if (forms.D.length > 0) {
            forms.D = Array.from(new Set(forms.D));
            let replacedArr = forms.D.map((item) => item.replace(new RegExp("D", "g"), ""));
            replacedArr = replacedArr.sort();
            wgorders.D = replacedArr.join("");
            desc1 += "D" + wgorders.D.toString();
            isWgOrders = true;
          }
          if (isWgOrders) {
            if (forms.label) {
              wgorders.Model = { value: forms.value, label: forms.label };
              wgorders.xh = forms.label;
              wgorders.XhModel = forms.label;
              isWgOrders = true;
            }
            if (form.teethWgMode > 0) {
              wgorders.teethWgMode = form.teethWgMode;
            }
            if (form.WgRemarks && form.WgRemarks.length > 0) {
              wgorders.Remarks = form.WgRemarks;
            }
            if (form.orderWgNameProduct) {
              wgorders.orderProductName = form.orderWgNameProduct;
              isWgOrders = true;
              if (!wgorders.xh) {
                wgorders.xh = forms.orderWgNameProduct;
              }
            }
            if (form.orderWgProduct) {
              wgorders.orderProduct = form.orderWgProduct;
            }
            if (form.WgColor1) {
              wgorders.WgColor1 = form.WgColor1;
              color1 = form.WgColor1;
              isWgOrders = true;
            }
            if (form.WgColor2) {
              wgorders.WgColor2 = form.WgColor2;
              color2 = form.WgColor2;
              isWgOrders = true;
            }
            if (form.WgColor3) {
              wgorders.WgColor3 = form.WgColor3;
              color3 = form.WgColor3;
              isWgOrders = true;
            }
            if (form.hasWgType) {
              wgorders.hasWgType = form.hasWgType;
            }
            wgorders.isWgColor = form.isWgColor;
            if (form.amountWgMode) {
              wgorders.amountWgMode = form.amountWgMode;
            }
            if (isWgOrders) {
              wgorders.hasType = form.hasWgType == void 0 ? 0 : form.hasWgType;
              wgorders.Number = 1;
              wgorders.id = i;
              wgorders.name = a.name;
              wgorders.type = "wg";
              wgorders.xhOptions = form.WgXingHao;
              wgorders.oldOrderWgProduct = form.orderWgProduct;
              wgorders.productItemClassifyWgId = form.productItemClassifyWgId;
              wgorders.tabIndex = index;
              if (dl.length > 0) {
                wgorders.pitemClassTabId = dl[0].value;
              }
              orderForm.value.push(wgorders);
              orderTookMode.push({ id: i, mode: form.amountWgMode, teethValue: desc1 });
              if (form.orderWgProduct) {
                ToothsParams.details.push({
                  id: i,
                  pItemId: parseInt(form.orderWgProduct),
                  teethDesc: desc1
                });
              }
              i++;
            }
          }
        });
      } else {
        let desc2 = "";
        const wgorder = {};
        let isWgOrder = false;
        if (form.WA.length > 0) {
          wgorder.A = form.WA.join("");
          desc2 += "A" + form.WA.toString();
          isWgOrder = true;
        }
        if (form.WB.length > 0) {
          wgorder.B = form.WB.join("");
          desc2 += "B" + form.WB.toString();
          isWgOrder = true;
        }
        if (form.WC.length > 0) {
          wgorder.C = form.WC.join("");
          desc2 += "C" + form.WC.toString();
          isWgOrder = true;
        }
        if (form.WD.length > 0) {
          wgorder.D = form.WD.join("");
          desc2 += "D" + form.WD.toString();
          isWgOrder = true;
        }
        if (form.WgRemarks && form.WgRemarks.length > 0) {
          wgorder.Remarks = form.WgRemarks;
          isWgOrder = true;
        }
        if (form.orderWgNameProduct) {
          wgorder.orderProductName = form.orderWgNameProduct;
          isWgOrder = true;
          if (!wgorder.xh) {
            wgorder.xh = form.orderWgNameProduct;
          }
        }
        if (form.orderWgProduct) {
          wgorder.orderProduct = form.orderWgProduct;
          isWgOrder = true;
        }
        if (form.WgColor1) {
          wgorder.WgColor1 = form.WgColor1;
          color1 = form.WgColor1;
          isWgOrder = true;
        }
        if (form.WgColor2) {
          wgorder.WgColor2 = form.WgColor2;
          color2 = form.WgColor2;
          isWgOrder = true;
        }
        if (form.WgColor3) {
          wgorder.WgColor3 = form.WgColor3;
          color3 = form.WgColor3;
          isWgOrder = true;
        }
        if (form.WgModel) {
          wgorder.Model = form.WgModel;
          wgorder.xh = form.WgModel.label;
          if (form.WgModel != void 0 && typeof form.WgModel !== "string") {
            wgorder.XhModel = form.WgModel.label;
          }
          isWgOrder = true;
        }
        if (form.teethWgMode > 0) {
          wgorder.teethWgMode = form.teethWgMode;
        }
        if (form.hasWgType) {
          wgorder.hasWgType = form.hasWgType;
          isWgOrder = true;
        }
        if (form.amountWgMode) {
          wgorder.amountWgMode = form.amountWgMode;
          isWgOrder = true;
        }
        if (isWgOrder) {
          wgorder.Number = 1;
          wgorder.hasType = form.hasWgType == void 0 ? 0 : form.hasWgType;
          wgorder.id = i;
          wgorder.isWgColor = form.isWgColor;
          wgorder.name = a.name;
          wgorder.type = "wg";
          wgorder.oldOrderWgProduct = form.orderWgProduct;
          wgorder.xhOptions = form.childrenWgXingHao;
          wgorder.productItemClassifyWgId = form.productItemClassifyWgId;
          wgorder.tabIndex = index;
          if (dl.length > 0) {
            wgorder.pitemClassTabId = dl[0].value;
          }
          orderForm.value.push(wgorder);
          orderTookMode.push({ id: i, mode: form.amountWgMode, teethValue: desc2 });
          if (form.orderWgProduct) {
            ToothsParams.details.push({
              id: i,
              pItemId: parseInt(form.orderWgProduct),
              teethDesc: desc2
            });
          }
          i++;
        }
      }
    }
  });
  ToothParams.tooths = orderTookMode;
  diseaseSeriesForm.Color1 = color1;
  diseaseSeriesForm.Color2 = color2;
  diseaseSeriesForm.Color3 = color3;
  diseaseSeriesForm.doctorRemarks = doctorRequire.value;
  try {
    const [result, result1] = await Promise.all([
      OrderAPI.CalculateTooth(ToothParams),
      OrderAPI.checkRepeatTooth(ToothsParams)
    ]);
    orderForm.value.forEach((a) => {
      const newTooth = result.filter((b) => a.id == b.id);
      if (newTooth.length > 0) {
        a.Number = newTooth[0].mode;
      }
      const newZzTooth = result1.filter((b) => a.id == b.id);
      if (newZzTooth.length > 0) {
        a.makeOptions = newZzTooth[0].prodTypes;
        if (newZzTooth[0].prodTypes.length > 0) {
          a.make = { label: a.makeOptions[0].name, value: a.makeOptions[0].id };
        }
      }
    });
  } catch (e) {
  }
}
async function CalculateAllTooth(item) {
  let orderTookMode = [];
  ToothsParams.orderId = 0;
  ToothsParams.factoryId = factoryId.value;
  ToothsParams.customerId = parseInt(diseaseSeriesForm.institution?.value);
  ToothsParams.patientName = diseaseSeriesForm.name;
  ToothsParams.creationTime = (/* @__PURE__ */ new Date()).toLocaleString();
  ToothsParams.details = [];
  let desc1 = "";
  if (item.A) {
    desc1 += "A" + item.A;
  }
  if (item.B) {
    desc1 += "B" + item.B;
  }
  if (item.C) {
    desc1 += "C" + item.C;
  }
  if (item.D) {
    desc1 += "D" + item.D;
  }
  if (item.type == "jt") {
    orderTookMode.push({ id: item.id, mode: item.amountMode, teethValue: desc1 });
    ToothsParams.details.push({
      id: item.id,
      pItemId: item.orderProduct != "" ? item.orderProduct : 0,
      teethValue: desc1
    });
  }
  if (item.type == "wg") {
    orderTookMode.push({ id: item.id, mode: item.amountWgMode, teethValue: desc1 });
    ToothsParams.details.push({
      id: item.id,
      pItemId: item.oldOrderWgProduct != "" ? item.oldOrderWgProduct : 0,
      teethValue: desc1
    });
  }
  if (item.type == "add") {
    if (item.amountMode == void 0) {
      orderTookMode.push({ id: item.id, mode: item.amountWgMode, teethValue: desc1 });
    } else {
      orderTookMode.push({ id: item.id, mode: item.amountMode, teethValue: desc1 });
    }
    ToothsParams.details.push({
      id: item.id,
      pItemId: item.orderProduct != "" ? item.orderProduct : 0,
      teethValue: desc1
    });
  }
  ToothParams.tooths = orderTookMode;
  const [result, result1] = await Promise.all([
    OrderAPI.CalculateTooth(ToothParams),
    OrderAPI.checkRepeatTooth(ToothsParams)
  ]);
  orderForm.value.forEach((a) => {
    const newTooth = result.filter((b) => a.id == b.id);
    if (newTooth.length > 0) {
      a.Number = newTooth[0].mode;
    }
    const newZzTooth = result1.filter((b) => a.id == b.id);
    if (newZzTooth.length > 0) {
      a.makeOptions = newZzTooth[0].prodTypes;
      if (newZzTooth[0].prodTypes.length > 0) {
        a.make = { label: a.makeOptions[0].name, value: a.makeOptions[0].id };
      }
    }
  });
}
function handleClose() {
  dialogVisible.value = false;
}
function okNext() {
  if (!checked.value) {
    ElNotification({
      title: "Error",
      message: "请确认单连冠型号和牙位信息!",
      type: "error",
      duration: 3e3
    });
    return false;
  }
  dialogVisible.value = false;
  okOrder();
}
function onInput(v, item, i) {
  const regex = /^(?!.*(\d).*\1)[1-8]{1,8}$/;
  let isbool = regex.test(v);
  if (isbool == false) {
    ElNotification({
      title: "Error",
      message: "请输入1-8的整数且为8位!",
      type: "error",
      duration: 3e3
    });
  }
  switchs(i, item, v);
}
function switchs(i, item, v) {
  switch (i) {
    case 1:
      const A = item.A;
      if (v == "") {
        item.A = [];
      } else {
        setTeeth(i, A, item);
      }
      break;
    case 2:
      const B = item.B;
      if (v == "") {
        item.B = [];
      } else {
        setTeeth(i, B, item);
      }
      break;
    case 3:
      const C = item.C;
      if (v == "") {
        item.C = [];
      } else {
        setTeeth(i, C, item);
      }
      break;
    case 4:
      const D = item.D;
      if (v == "") {
        item.D = [];
      } else {
        setTeeth(i, D, item);
      }
      break;
  }
  CalculateAllTooth(item);
}
function setTeeth(i, v, item) {
  const arr = Array.from(v);
  const regex = /^[1-8]{1,8}$/;
  let newarr = [];
  arr.forEach((a) => {
    let isbool = regex.test(a);
    if (isbool) {
      newarr.push(a);
    }
  });
  newarr = Array.from(new Set(newarr));
  switch (i) {
    case 1:
      let A = newarr.sort().reverse();
      item.A = A.join("");
      break;
    case 2:
      let B = newarr.sort();
      item.B = B.join("");
      break;
    case 3:
      let C = newarr.sort().reverse();
      item.C = C.join("");
      break;
    case 4:
      let D = newarr.sort();
      item.D = D.join("");
      break;
  }
}
function openBingLie() {
  let from = diseaseSeriesForm;
  Object.assign(diseaseSeriesForms, from);
  diseaseSeriesForms.sex1 = from.sex;
  blVisible.value = true;
}
function blCloseDialog() {
  blVisible.value = false;
}
function handleSubmit() {
  let from = diseaseSeriesForms;
  Object.assign(diseaseSeriesForm, from);
  diseaseSeriesForm.sex = from.sex1;
  blVisible.value = false;
  ElNotification.success({
    title: "Success",
    message: "保存成功!",
    offset: 100
  });
}
function handleSearch(query, item) {
  if (query) {
    loadings.value = true;
    setTimeout(() => {
      productParams.keywords = query;
      productParams.factoryId = factoryId.value;
      if (item.productItemClassifyId != void 0) {
        productParams.classifyId = item.productItemClassifyId;
      }
      if (item.productItemClassifyWgId != void 0) {
        productParams.classifyId = item.productItemClassifyWgId;
      }
      ProductAPI.getItemProductPage(productParams).then((data) => {
        if (data.length > 0) {
          item.xmOptions = data;
          Object.assign(orderXh, data);
        } else {
          item.xhOptions = [];
        }
      });
      loadings.value = false;
    }, 1e3);
  }
}
function onUpProductChange(val, item) {
  item.orderProduct = val.value;
  if (item.Model != void 0) {
    const xh = val.children.filter((a) => a.label == item.Model.label);
    if (xh.length == 0) {
      item.Model = "";
      item.XhModel = "";
    } else {
      item.Model.value = xh[0].value;
      item.XhModel = xh[0].label;
    }
  }
  if (item.type == "jt" || item.type == "add") {
    item.productItemClassifyId = val.productItemClassifyId;
    item.oldOrderProducts = "";
  } else {
    item.productItemClassifyWgId = val.productItemClassifyId;
  }
  let newarr = orderXh.filter((a) => a.label == val.label);
  if (newarr.length > 0) {
    if (newarr[0].children.length > 0) {
      newarr[0].children.forEach((x) => {
        const oldxh = item.xhOptions.filter((a) => a.label == x.label);
        if (oldxh.length > 0) {
          x.A = oldxh[0].A;
          x.B = oldxh[0].B;
          x.C = oldxh[0].C;
          x.D = oldxh[0].D;
        } else {
          x.A = [];
          x.B = [];
          x.C = [];
          x.D = [];
        }
      });
      item.xhOptions = newarr[0].children;
    } else {
      item.xhOptions = [];
    }
  }
  if (item.oldOrderProduct == "") {
    item.oldOrderProduct = val.value;
  }
  if (val.value > 1) {
    ColorAPI.getProductData(val.value).then((data) => {
      item.isColor = data.isColor;
      item.amountMode = data.amountMode;
      item.teethMode = data.teethMode;
      item.hasType = data.hasType;
      CalculateAllTooth(item);
    });
  }
  if (item.type == "add" && item.addid == 0) {
    const classId = val.productItemClassifyId;
    item.oldOrderProduct = val.value;
    const newNoClass = classAllList.value.find(
      (item2) => item2.children && item2.children.find((child) => child.value === classId)
    );
    if (newNoClass != void 0) {
      let items = Object.assign({}, newNoClass);
      items.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
      classList.value.push(items);
      item.name = items.ids;
      isClassValue.value = items.ids;
      addToothValue(items, val.value);
      classKey.value += 1;
      item.addid += 1;
    }
  }
}
function onUpModelChange(val, item) {
  const xh = val.label;
  item.xh = xh;
  item.xhOptions.forEach((a) => {
    a.isChecked = true;
    if (a.label != xh) {
      a.A = [];
      a.B = [];
      a.C = [];
      a.D = [];
      a.isChecked = false;
    }
  });
  item.XhModel = xh;
}
function okOnUpdated(item) {
  let form = orderForm.value.filter((a) => a.id == item.id);
  if (form.length > 0) {
    form[0].id = item.id;
    form[0].Remarks = item.Remarks;
    form[0].orderProductName = item.orderProductName;
    form[0].orderProduct = item.orderProduct;
    form[0].Model = item.Model;
    if (item.A) {
      let arr = Array.from(item.A).sort().reverse().map(Number);
      form[0].A = arr;
    }
    if (item.B) {
      let arr = Array.from(item.B).sort().map(Number);
      form[0].B = arr;
    }
    if (item.C) {
      let arr = Array.from(item.C).sort().reverse().map(Number);
      form[0].C = arr;
    }
    if (item.D) {
      let arr = Array.from(item.D).sort().map(Number);
      form[0].D = arr;
    }
  } else {
    if (item.A) {
      let arr = Array.from(item.A).sort().reverse().map(Number);
      item.A = arr;
    } else {
      item.A = [];
    }
    if (item.B) {
      let arr = Array.from(item.B).sort().map(Number);
      item.B = arr;
    } else {
      item.B = [];
    }
    if (item.C) {
      let arr = Array.from(item.C).sort().reverse().map(Number);
      item.C = arr;
    } else {
      item.C = [];
    }
    if (item.D) {
      let arr = Array.from(item.D).sort().map(Number);
      item.D = arr;
    } else {
      item.D = [];
    }
    orderForm.value.push(item);
  }
  ElNotification.success({
    title: "Success",
    message: "保存成功!",
    offset: 100
  });
}
function onNodated(item) {
  ElMessage.success("取消保存");
  item.IsUpBool = false;
}
function setClassValue(v) {
  isClassValue.value = v;
  classKey.value += 1;
}
function setClassClose(item) {
  if (classList.value.length == 1) {
    ElNotification({
      title: "Error",
      message: "请至少保留一个分类",
      type: "error",
      duration: 3e3
    });
    isClassValue.value = classList.value[0].value;
    return;
  }
  const newClassList = classList.value.filter((a) => a.ids !== item.ids);
  classList.value = newClassList;
  isClassValue.value = newClassList[0].ids;
  const id = item.ids;
  item.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
  const newToothList = orderToothForm.value.filter((a) => a.name != id);
  orderToothForm.value = newToothList;
  classKey.value += 1;
}
function setNoClass(item) {
  let items = Object.assign({}, item);
  items.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
  classList.value.push(items);
  isClassValue.value = items.ids;
  addToothValue(items, "default");
  classKey.value += 1;
}
function setToothValue(item) {
}
function okup() {
  const b = up();
  if (b) {
    setOrder();
    setOrderToohs();
    visible.value = false;
  }
}
function setOrderToohs() {
  orderToothForm.value.forEach((b) => {
    const from = b.value;
    from.WSelected = [];
    from.Selected = [];
    if (from.A.length > 0) {
      from.A = Array.from(new Set(from.A));
      let arr = from.A.map((num) => "A" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.B.length > 0) {
      from.B = Array.from(new Set(from.B));
      let arr = from.B.map((num) => "B" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.C.length > 0) {
      from.C = Array.from(new Set(from.C));
      let arr = from.C.map((num) => "C" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.D.length > 0) {
      from.D = Array.from(new Set(from.D));
      let arr = from.D.map((num) => "D" + num);
      from.Selected = [...from.Selected, ...arr];
    }
    if (from.WA.length > 0) {
      from.WA = Array.from(new Set(from.WA));
      let arr = from.WA.map((num) => "A" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
    if (from.WB.length > 0) {
      from.WB = Array.from(new Set(from.WB));
      let arr = from.WB.map((num) => "B" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
    if (from.WC.length > 0) {
      from.WC = Array.from(new Set(from.WC));
      let arr = from.WC.map((num) => "C" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
    if (from.WD.length > 0) {
      from.WD = Array.from(new Set(from.WD));
      let arr = from.WD.map((num) => "D" + num);
      from.WSelected = [...from.WSelected, ...arr];
    }
  });
}
function up() {
  let isBool = false;
  let isChecked = false;
  let message = "";
  var danGuan = [];
  var lianGuan = [];
  orderToothForm.value.some((a) => {
    const from = a.value;
    if (from.orderProduct == 0) {
      message = `请先选择${from.jtTitle}加工项目!`;
      isChecked = true;
      return true;
    }
    if (from.teethMode > 0 && from.A.length == 0 && from.B.length == 0 && from.C.length == 0 && from.D.length == 0) {
      message = `请先选择${from.jtTitle}牙位图!`;
      isChecked = true;
      return true;
    }
    if ((from.hasType == 10 || from.hasType == 20 || from.hasType == 30) && from.Model == "") {
      const xhLabel = from.XingHao.map((b) => b.label);
      message = `请选择${from.jtTitle}${xhLabel}!`;
      if (xhLabel.length == 0) {
        message = `请选择${from.jtTitle}型号!`;
      }
      isChecked = true;
      return true;
    }
    if (from.isColor == true && from.Color1 == "" && from.Color2 == "" && from.Color3 == "") {
      message = `请选择${from.jtTitle}颜色!`;
      isChecked = true;
      return true;
    }
    const classFrom = classList.value.filter((b) => b.ids == a.name);
    const okClass = classFrom[0].relationChildren;
    const isAdditional = from.isAdditional;
    if (classFrom.length > 0 && okClass.length > 0 && isAdditional) {
      if (from.orderWgProduct == 0) {
        message = `请先选择${from.WgTitle}加工项目!`;
        isChecked = true;
        return true;
      }
      if (from.teethWgMode > 0 && from.WA.length == 0 && from.WB.length == 0 && from.WC.length == 0 && from.WD.length == 0) {
        message = `请先选择${from.WgTitle}牙位图!`;
        isChecked = true;
        return true;
      }
      if ((from.hasWgType == 10 || from.hasWgType == 20 || from.hasWgType == 30) && from.WgModel == "") {
        const xhWgLabel = from.WgXingHao.map((b) => b.label);
        message = `请选择${from.WgTitle}${xhWgLabel}!`;
        if (xhWgLabel.length == 0) {
          message = `请选择${from.jtTitle}型号!`;
        }
        isChecked = true;
        return true;
      }
      if (from.isWgColor == true && from.WgColor1 == "" && from.WgColor2 == "" && from.WgColor3 == "") {
        message = `请选择${from.WgTitle}颜色!`;
        isChecked = true;
        return true;
      }
    }
    from.WgXingHao.forEach((x) => {
      if (x.label == "单冠") {
        if (x.A) {
          x.A.length > 0 ? danGuan.push(x.A) : "";
        }
        if (x.B) {
          x.B.length > 0 ? danGuan.push(x.B) : "";
        }
        if (x.C) {
          x.C.length > 0 ? danGuan.push(x.C) : "";
        }
        if (x.D) {
          x.D.length > 0 ? danGuan.push(x.D) : "";
        }
      }
      if (x.label == "连冠") {
        if (x.A) {
          x.A.length > 0 ? lianGuan.push(x.A) : "";
        }
        if (x.B) {
          x.B.length > 0 ? lianGuan.push(x.B) : "";
        }
        if (x.C) {
          x.C.length > 0 ? lianGuan.push(x.C) : "";
        }
        if (x.D) {
          x.D.length > 0 ? lianGuan.push(x.D) : "";
        }
      }
    });
  });
  if (isChecked) {
    ElNotification({
      title: "Error",
      message: `${message}`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  return true;
}
function noup() {
  orderToothForm.value = oldTooths.value;
  isClassValue.value = oldisClassValue.value;
  classList.value = JSON.parse(JSON.stringify(oldclassList.value));
  classKey.value += 1;
  visible.value = false;
}
function submitOrder() {
  if (fileUpCount.value > fileOkUpCount.value) {
    ElNotification({
      title: "Error",
      message: `文件上传中(${fileOkUpCount.value.toString()}/${fileUpCount.value.toString()})...请待上传完成,再提交订单!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  const isColor = getXdColor();
  const diseFrom = diseaseSeriesForm;
  const color1 = diseFrom.Color1 != void 0 && typeof diseFrom.Color1 !== "string" ? diseFrom.Color1.label : "";
  if (isColor == "true" && color1 == "") {
    ElNotification({
      title: "Error",
      message: `颜色不能为空!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  checkedXingHao();
  if (okList.value.length > 0) {
    dialogVisible.value = true;
  } else {
    okOrder();
  }
}
function okOrder() {
  const diseFrom = diseaseSeriesForm;
  isSubmit.value = true;
  fullscreenLoading.value = true;
  orderFormInfo.dc = 1;
  orderFormInfo.sourceType = 1;
  orderFormInfo.prodRange = parseInt(diseFrom.produceType?.value);
  orderFormInfo.mxType = parseInt(diseFrom.mxType?.value);
  orderFormInfo.autoOrderNo = true;
  orderFormInfo.factoryId = factoryMenuId.value;
  orderFormInfo.factoryName = diseFrom.client?.label;
  orderFormInfo.pitemFactoryId = factoryId.value;
  orderFormInfo.operatingCompId = 0;
  orderFormInfo.operatinCompName = "测试运营公司";
  orderFormInfo.salesManId = 0;
  orderFormInfo.salesManName = "业务员姓名";
  orderFormInfo.customerId = parseInt(diseFrom.institution?.value);
  orderFormInfo.customerName = diseFrom.institution?.label;
  if (isEntrust.value) {
    orderFormInfo.doctorId = 0;
    orderFormInfo.doctorName = "";
    orderFormInfo.isEntrust = true;
    orderFormInfo.entrustFactoryId = user.members.orgId;
  } else {
    orderFormInfo.doctorId = diseFrom.doctorName.value;
    orderFormInfo.doctorName = diseFrom.doctorName.label;
    orderFormInfo.isEntrust = false;
    orderFormInfo.entrustFactoryId = 0;
  }
  orderFormInfo.doctorRequire = diseFrom.doctorRemarks;
  orderFormInfo.urgent = false;
  orderFormInfo.patientName = diseFrom.name;
  orderFormInfo.patientAge = diseFrom.age > 0 ? parseInt(diseFrom.age) : 0;
  orderFormInfo.patientSex = diseFrom.sex == "男" ? 1 : 0;
  if (diseFrom.sex == "保密") {
    orderFormInfo.patientSex = -1;
  }
  if (diseFrom.Color1) {
    orderFormInfo.color1 = diseFrom.Color1;
  }
  if (diseFrom.Color2) {
    orderFormInfo.color2 = diseFrom.Color2;
  }
  if (diseFrom.Color3) {
    orderFormInfo.color3 = diseFrom.Color3;
  }
  orderFormInfo.creationTime = /* @__PURE__ */ new Date();
  orderFormInfo.autoPreReleaseDate = true;
  orderMakesForm.orderId = 0;
  orderFormInfo.makes = [orderMakesForm];
  orderFormInfo.makes[0].details = [];
  orderForm.value.forEach((item) => {
    if (item.make == void 0) {
      ElNotification({
        title: "Error",
        message: `请选中制作类型!`,
        type: "error",
        duration: 3e3
      });
      return false;
    }
    if (item.orderProductName) {
      let newForm = Object.assign({}, orderDetailsForm);
      newForm.omId = 0;
      newForm.productionWayId = 0;
      newForm.productionWayName = "";
      if (item.WgColor1) {
        orderFormInfo.color1 = item.WgColor1;
      }
      if (item.WgColor2) {
        orderFormInfo.color2 = item.WgColor2;
      }
      if (item.WgColor3) {
        orderFormInfo.color3 = item.WgColor3;
      }
      if (orderFormInfo.color1 != void 0 && typeof orderFormInfo.color1 !== "string") {
        orderFormInfo.color1 = orderFormInfo.color1.value.toString();
      }
      if (orderFormInfo.color2 != void 0 && typeof orderFormInfo.color2 !== "string") {
        orderFormInfo.color2 = orderFormInfo.color2.value.toString();
      }
      if (orderFormInfo.color3 != void 0 && typeof orderFormInfo.color3 !== "string") {
        orderFormInfo.color3 = orderFormInfo.color3.value.toString();
      }
      newForm.pitemClassId = item.productItemClassifyId;
      newForm.pItemClassDesc = "";
      newForm.groupId = 1;
      newForm.tabIndex = item.tabIndex;
      newForm.pitemId = parseInt(item.orderProduct);
      newForm.pitemClassTabId = parseInt(item.pitemClassTabId);
      if (item.type == "add") {
        if (item.orderProduct != void 0) {
          newForm.pitemId = parseInt(item.orderProduct);
        }
        if (item.oldOrderWgProduct != void 0) {
          newForm.pitemId = parseInt(item.oldOrderWgProduct);
        }
        if (item.oldOrderProducts != void 0 && item.oldOrderProducts != "") {
          newForm.pitemId = parseInt(item.oldOrderProducts);
        }
      }
      newForm.pitemType = 0;
      if (item.type == "wg") {
        newForm.pitemType = 1;
        newForm.pitemClassId = item.productItemClassifyWgId;
      }
      newForm.pitemName = item.orderProductName;
      if (item.Model) {
        if (typeof orderFormInfo.Model !== "string") {
          newForm.ptypeId = item.Model ? parseInt(item.Model?.value) : 0;
        } else {
          newForm.ptypeId = 0;
        }
        newForm.ptypeName = item.Model?.label;
      }
      let AA = "";
      let BB = "";
      let CC = "";
      let DD = "";
      let Desc = "";
      if (item.A) {
        AA = formatNumArr(item.A, 0);
        Desc += "A" + AA;
      }
      if (item.B) {
        BB = formatNumArr(item.B, 1);
        Desc += "B" + BB;
      }
      if (item.C) {
        CC = formatNumArr(item.C, 0);
        Desc += "C" + CC;
      }
      if (item.D) {
        DD = formatNumArr(item.D, 1);
        Desc += "D" + DD;
      }
      newForm.teeth1A = item.A ? AA : "";
      newForm.teeth1B = item.B ? BB : "";
      newForm.teeth1C = item.C ? CC : "";
      newForm.teeth1D = item.D ? DD : "";
      newForm.teeth1Desc = Desc;
      newForm.amount = item.Number;
      newForm.uAmount = 0;
      newForm.lAmount = 0;
      newForm.uAmountAutoWrite = true;
      newForm.lAmountAutoWrite = true;
      newForm.unitId = 0;
      newForm.remakeCauseId = 0;
      newForm.remakeCauseName = "新增";
      newForm.indexNo = 0;
      newForm.memo3 = "";
      newForm.prodTypeId = parseInt(item.make?.value);
      newForm.prodTypeName = item?.label;
      newForm.testId = parseInt(diseFrom.isTest?.value);
      newForm.testDesc = diseFrom.isTest?.label;
      orderMakesForm.details.push(newForm);
    }
  });
  OrderAPI.saveOrder(orderFormInfo).then((data) => {
    if (data.orderId) {
      orderInfo.value.orderId = data.orderId;
      orderInfo.value.guid = data.guid;
      const img = Object.assign({}, orderFileInfo);
      orderId.value = data.orderId;
      img.orderId = data.orderId;
      img.omId = 0;
      img.Files = [];
      cbctfileUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 0;
        fileurl.fileId = item.fileId;
        fileurl.fileName = item.fileName;
        fileurl.url = item.url + "&width=400";
        img.Files?.push(fileurl);
      });
      mouthfileUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 1;
        fileurl.fileId = item.fileId;
        fileurl.fileName = item.fileName;
        fileurl.url = item.url + "&width=400";
        img.Files?.push(fileurl);
      });
      colorpicUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 2;
        fileurl.fileId = item.fileId;
        fileurl.fileName = item.fileName;
        fileurl.url = item.url + "&width=400";
        img.Files?.push(fileurl);
      });
      isSubmit.value = false;
      makepicUrls.value.forEach((item) => {
        const fileurl = Object.assign({}, orderFilesInfo);
        fileurl.type = 3;
        fileurl.fileId = item.fileId;
        fileurl.fileName = item.fileName;
        fileurl.url = item.url + "&width=400";
        img.Files?.push(fileurl);
      });
      if (img.Files?.length > 0) {
        OrderAPI.addFile(img).then((datas) => {
          fullscreenLoading.value = false;
          isSubmit.value = false;
          if (routes.path == "/order") {
            orderNext(3);
          } else {
            orderWpf();
          }
        }).finally(() => {
          fullscreenLoading.value = false;
          isSubmit.value = false;
          clearXdColor();
        });
      } else {
        fullscreenLoading.value = false;
        isSubmit.value = false;
        clearXdColor();
        if (routes.path == "/order") {
          orderNext(3);
        } else {
          orderWpf();
        }
      }
    }
  }).finally(() => {
    fullscreenLoading.value = false;
    isSubmit.value = false;
    clearXdColor();
  });
}
function orderWpf() {
  ElMessageBox.alert("订单创建成功!", "新增订单", {
    confirmButtonText: "OK",
    callback: (action) => {
      onOrderSubmitted();
    }
  });
}
function checkedXingHao() {
  let newArr = [];
  okList.value = [];
  orderForm.value.forEach((item) => {
    let has_type = 0;
    if (item.type == "jt") {
      has_type = item.hasType;
    }
    if (item.type == "wg") {
      has_type = item.hasWgType;
    }
    if (item.xhOptions.length > 0 && has_type == 10) {
      const xh = item.xh;
      const xhmc = item.orderProductName;
      const xhName = xhmc + "_" + xh;
      let nxh = {};
      nxh[xhName] = [];
      const xharr = orderForm.value.filter((d) => d.xh == xh && d.orderProductName == xhmc);
      let A = [];
      let B = [];
      let C = [];
      let D = [];
      xharr.forEach((d) => {
        if (d.A) {
          const arr = Array.from(d.A);
          arr.forEach((a) => {
            A.push("A" + a);
          });
        }
        if (d.B) {
          const arr = Array.from(d.B);
          arr.forEach((a) => {
            B.push("B" + a);
          });
        }
        if (d.C) {
          const arr = Array.from(d.C);
          arr.forEach((a) => {
            C.push("C" + a);
          });
        }
        if (d.D) {
          const arr = Array.from(d.D);
          arr.forEach((a) => {
            D.push("D" + a);
          });
        }
      });
      if (A.length > 0) {
        nxh[xhName].push(A);
      }
      if (B.length > 0) {
        nxh[xhName].push(B);
      }
      if (C.length > 0) {
        nxh[xhName].push(C);
      }
      if (D.length > 0) {
        nxh[xhName].push(D);
      }
      if (nxh[xhName].length > 0) {
        newArr.push(nxh);
      }
    }
  });
  if (newArr.length > 0) {
    okList.value = newArr;
  }
}
function setCountdown() {
  timer.value = setInterval(() => {
    if (countdown.value > 0) {
      countdown.value--;
    } else {
      clearInterval(timer.value);
      openOrder();
    }
  }, 1e3);
}
function setOrderFrom() {
  let arr = [];
  orderForm.value.forEach((a) => {
    let newarr = arr.filter((b) => a.name == b.name && a.xh == b.xh);
    if (newarr.length > 0) {
      if (a.A) {
        const aa = Array.from(a.A).map(Number);
        if (newarr[0].A) {
          const ba = Array.from(newarr[0].A).map(Number);
          newarr[0].A = Array.from(new Set(aa.concat(ba))).sort().reverse().join("");
        } else {
          newarr[0].A = a.A;
        }
      }
      if (a.B) {
        const ab = Array.from(a.B).map(Number);
        if (newarr[0].B) {
          const bb = Array.from(newarr[0].B).map(Number);
          newarr[0].B = Array.from(new Set(ab.concat(bb))).sort().join("");
        } else {
          newarr[0].B = a.B;
        }
      }
      if (a.C) {
        const ac = Array.from(a.C).map(Number);
        if (newarr[0].C) {
          const bc = Array.from(newarr[0].C).map(Number);
          newarr[0].C = Array.from(new Set(ac.concat(bc))).sort().reverse().join("");
        } else {
          newarr[0].C = a.C;
        }
      }
      if (a.D) {
        const ad = Array.from(a.D).map(Number);
        if (newarr[0].D) {
          const bd = Array.from(newarr[0].D).map(Number);
          newarr[0].D = Array.from(new Set(ad.concat(bd))).sort().join("");
        } else {
          newarr[0].D = a.D;
        }
      }
      if (newarr[0].xhOptions) {
        newarr[0].xhOptions.forEach((a2) => {
          a2.isChecked = false;
          if (a2.label == newarr[0].xh) {
            a2.isChecked = true;
          }
        });
      }
    } else {
      if (a.type == "add" && a.orderProduct == "") {
        let newarrs = arr.filter((b) => a.name == b.name);
        if (newarrs.length > 0) {
          a.orderProduct = newarrs[0].orderProduct;
          a.oldOrderProduct = newarrs[0].oldOrderProduct;
          arr.push(a);
        }
      } else {
        arr.push(a);
      }
    }
  });
  orderForm.value = arr.length > 0 ? arr : [];
  orderToothForm.value.forEach((b) => {
    const id = b.name;
    const from = b.value;
    from.WSelected = [];
    from.Selected = [];
    from.WA = [];
    from.WB = [];
    from.WC = [];
    from.WD = [];
    from.WgRemarks = [];
    from.A = [];
    from.B = [];
    from.C = [];
    from.D = [];
    from.XingHao = [];
    from.WgXingHao = [];
    from.Remarks = [];
    from.hasType = 0;
    from.teethMode = 20;
    from.isColor = false;
    from.hasWgType = 0;
    from.teethWgMode = 20;
    from.isWgColor = false;
    for (var i = 0; i < orderForm.value.length; i++) {
      let c = orderForm.value[i];
      if (c.name == id) {
        const neworderToot = c;
        if (neworderToot.oldOrderProduct == from.orderProduct) {
          from.Remarks = c.Remarks;
          from.orderProduct = c.orderProduct;
          from.orderNameProduct = c.orderProductName;
          from.productItemClassifyId = c.productItemClassifyId;
          from.isColor = c.isColor;
          from.amountMode = c.amountMode;
          from.teethMode = c.teethMode;
          from.hasType = c.hasType;
          if (c.Model) {
            from.Model = c.Model;
          }
          if (c.xhOptions.length > 0) {
            if (from.XingHao.length == 0) {
              from.XingHao = c.xhOptions;
            }
            from.XingHao.forEach((d) => {
              d.isChecked = d.label == c.Model?.label ? true : false;
              if (d.label == c.Model?.label || c.Model?.value == 0) {
                setValue(c, from, d);
              }
            });
          } else {
            if (c.A) {
              from.A = c.A.indexOf(",") == -1 ? Array.from(c.A).map(Number) : c.A;
              from.A = Array.from(new Set(from.A));
              let arr2 = from.A.map((num) => "A" + num);
              from.Selected = [...from.Selected, ...arr2];
            }
            if (c.B) {
              from.B = c.B.indexOf(",") == -1 ? Array.from(c.B).map(Number) : c.B;
              from.B = Array.from(new Set(from.B));
              let arr2 = from.B.map((num) => "B" + num);
              from.Selected = [...from.Selected, ...arr2];
            }
            if (c.C) {
              from.C = c.C.indexOf(",") == -1 ? Array.from(c.C).map(Number) : c.C;
              from.C = Array.from(new Set(from.C));
              let arr2 = from.C.map((num) => "C" + num);
              from.Selected = [...from.Selected, ...arr2];
            }
            if (c.D) {
              from.D = c.D.indexOf(",") == -1 ? Array.from(c.D).map(Number) : c.D;
              from.D = Array.from(new Set(from.D));
              let arr2 = from.D.map((num) => "D" + num);
              from.Selected = [...from.Selected, ...arr2];
            }
          }
        }
        if (neworderToot.oldOrderWgProduct == from.orderWgProduct) {
          from.WgRemarks = c.Remarks;
          from.orderWgProduct = c.orderProduct;
          from.orderWgNameProduct = c.orderProductName;
          from.productItemClassifyWgId = c.productItemClassifyWgId;
          from.isWgColor = c.isWgColor;
          from.amountWgMode = c.amountWgMode;
          from.teethWgMode = c.teethWgMode;
          from.hasWgType = c.hasWgType;
          if (c.Model) {
            from.WgModel = c.Model;
          }
          if (c.xhOptions.length > 0) {
            if (from.WgXingHao.length == 0) {
              from.WgXingHao = c.xhOptions;
            }
            from.WgXingHao.forEach((d) => {
              d.isChecked = d.label == c.Model?.label ? true : false;
              if (d.label == c.Model?.label || c.Model?.value == 0) {
                setWgValue(c, from, d);
              }
            });
          } else {
            if (c.A) {
              from.WA = c.A.indexOf(",") == -1 ? Array.from(c.A).map(Number) : c.A;
              from.WA = Array.from(new Set(from.WA));
              let arr2 = from.WA.map((num) => "A" + num);
              from.WSelected = [...from.WSelected, ...arr2];
            }
            if (c.B) {
              from.WB = c.B.indexOf(",") == -1 ? Array.from(c.B).map(Number) : c.B;
              from.WB = Array.from(new Set(from.WB));
              let arr2 = from.WB.map((num) => "B" + num);
              from.WSelected = [...from.WSelected, ...arr2];
            }
            if (c.C) {
              from.WC = c.C.indexOf(",") == -1 ? Array.from(c.C).map(Number) : c.C;
              from.WC = Array.from(new Set(from.WC));
              let arr2 = from.WC.map((num) => "C" + num);
              from.WSelected = [...from.WSelected, ...arr2];
            }
            if (c.D) {
              from.WD = c.D.indexOf(",") == -1 ? Array.from(c.D).map(Number) : c.D;
              from.WD = Array.from(new Set(from.WD));
              let arr2 = from.WD.map((num) => "D" + num);
              from.WSelected = [...from.WSelected, ...arr2];
            }
          }
        }
      }
    }
  });
  checked.value = false;
}
function delOrder(item) {
  if (orderForm.value.length == 1) {
    ElNotification({
      title: "Error",
      message: `订单数据必须保留一条!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  ElMessageBox.confirm("确认删除此条数据吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(
    () => {
      const id = item.name;
      const neworderToot = orderToothForm.value.filter((b) => b.name == id);
      const xhmodel = item.XhModel != void 0 ? item.XhModel : "";
      let arr = [];
      if (neworderToot.length > 0) {
        neworderToot.forEach((a) => {
          let tooh = a.value;
          let bol = false;
          if (tooh.Selected.length > 0) {
            if (tooh.XingHao.length > 0) {
              const xh = item.xhOptions.filter((b) => b.label == xhmodel);
              if (xh.length > 0) {
                xh[0].A = [];
                xh[0].B = [];
                xh[0].C = [];
                xh[0].D = [];
              }
              tooh.XingHao.forEach((x) => {
                if (x.label == xhmodel) {
                  const b = x;
                  if (b.A != void 0 && b.A.length > 0) {
                    const A = [...tooh.A];
                    const A1 = [...b.A].map((items) => items.replace("A", ""));
                    const result = A.filter((x1) => !A1.includes(String(x1)));
                    tooh.A = result;
                  }
                  if (b.B != void 0 && b.B.length > 0) {
                    const B = [...tooh.B];
                    const B1 = [...b.B].map((items) => items.replace("B", ""));
                    const result = B.filter((x1) => !B1.includes(String(x1)));
                    tooh.B = result;
                  }
                  if (b.C != void 0 && b.C.length > 0) {
                    const C = [...tooh.C];
                    const C1 = [...b.C].map((items) => items.replace("C", ""));
                    const result = C.filter((x1) => !C1.includes(String(x1)));
                    tooh.C = result;
                  }
                  if (b.D != void 0 && b.D.length > 0) {
                    const D = [...tooh.D];
                    const D1 = [...b.D].map((items) => items.replace("D", ""));
                    const result = D.filter((x1) => !D1.includes(String(x1)));
                    tooh.D = result;
                  }
                  b.A = [];
                  b.B = [];
                  b.C = [];
                  b.D = [];
                }
              });
              bol = true;
            } else {
              let model = "";
              if (tooh.Model != void 0 && typeof tooh.Model !== "string") {
                model = tooh.Model.label;
              }
              if (tooh.orderProduct == item.orderProduct && tooh.orderNameProduct == item.orderProductName && model == xhmodel) {
                tooh.A = [];
                tooh.B = [];
                tooh.C = [];
                tooh.D = [];
                tooh.Selected = [];
              }
            }
          }
          if (tooh.WSelected.length > 0) {
            if (tooh.WgXingHao.length > 0) {
              let modelId = 0;
              if (item.Model != void 0 && typeof item.Model !== "string") {
                modelId = item.Model.value;
              }
              tooh.WgXingHao.forEach((x) => {
                if (x.value == modelId && x.label == xhmodel) {
                  const xh = item.xhOptions.filter((b2) => b2.label == xhmodel);
                  if (xh.length > 0) {
                    xh[0].A = [];
                    xh[0].B = [];
                    xh[0].C = [];
                    xh[0].D = [];
                  }
                  const b = x;
                  if (b.A != void 0 && b.A.length > 0) {
                    const A = [...tooh.WA];
                    const A1 = [...b.A].map((items) => items.replace("A", ""));
                    const result = A.filter((x1) => !A1.includes(String(x1)));
                    tooh.WA = result;
                  }
                  if (b.B != void 0 && b.B.length > 0) {
                    const B = [...tooh.WB];
                    const B1 = [...b.B].map((items) => items.replace("B", ""));
                    const result = B.filter((x1) => !B1.includes(String(x1)));
                    tooh.WB = result;
                  }
                  if (b.C != void 0 && b.C.length > 0) {
                    const C = [...tooh.WC];
                    const C1 = [...b.C].map((items) => items.replace("C", ""));
                    const result = C.filter((x1) => !C1.includes(String(x1)));
                    tooh.WC = result;
                  }
                  if (b.D != void 0 && b.D.length > 0) {
                    const D = [...tooh.WD];
                    const D1 = [...b.D].map((items) => items.replace("D", ""));
                    const result = D.filter((x1) => !D1.includes(String(x1)));
                    tooh.WD = result;
                  }
                  b.A = [];
                  b.B = [];
                  b.C = [];
                  b.D = [];
                }
              });
            } else {
              let model = "";
              if (tooh.Model != void 0 && typeof tooh.Model !== "string") {
                model = tooh.Model.label;
              }
              if (tooh.orderWgProduct == item.orderProduct && tooh.orderWgNameProduct == item.orderProductName && model == xhmodel) {
                tooh.WA = [];
                tooh.WB = [];
                tooh.WC = [];
                tooh.WD = [];
                tooh.WSelected = [];
              }
            }
            bol = true;
          }
          if (bol) {
            if (tooh.A.length == 0 && tooh.B.length == 0 && tooh.C.length == 0 && tooh.D.length == 0) {
              tooh.Model = "";
              tooh.orderNameProduct = "";
              tooh.orderProduct = 0;
              tooh.XingHao = [];
              tooh.hasType = 0;
              tooh.Selected = [];
              tooh.Color1 = "";
            }
            if (tooh.WA.length == 0 && tooh.WB.length == 0 && tooh.WC.length == 0 && tooh.WD.length == 0) {
              tooh.WgModel = "";
              tooh.orderWgNameProduct = "";
              tooh.orderWgProduct = 0;
              tooh.WgXingHao = [];
              tooh.hasWgType = 0;
              tooh.WgColor1 = "";
              tooh.WSelected = [];
            }
            if (tooh.WSelected.length == 0 && tooh.Selected == 0) {
              const c = classList.value.filter((x) => {
                return x.ids == a.name;
              });
              if (c.length > 0) {
                setClassClose(c[0]);
              }
            }
          } else {
            if (tooh.orderProduct == item.orderProduct && tooh.orderNameProduct == item.orderProductName) {
              const c = classList.value.filter((x) => {
                return x.ids == a.name;
              });
              if (c.length > 0) {
                setClassClose(c[0]);
              }
            }
          }
        });
      }
      orderForm.value = orderForm.value.filter((a) => a.id != item.id);
    },
    () => {
      ElMessage.info("已取消删除");
    }
  );
}
function setValue(c, from, d) {
  if (c.A) {
    const A = c.A.indexOf(",") == -1 ? Array.from(c.A).map(Number) : c.A;
    const arr = A.map((num) => "A" + num);
    d.A = [...arr];
    from.Selected = from.Selected.concat(arr);
    const AA = from.A.concat(A);
    from.A = Array.from(new Set(AA));
  } else {
    d.A = [];
  }
  if (c.B) {
    const B = c.B.indexOf(",") == -1 ? Array.from(c.B).map(Number) : c.B;
    const arr = B.map((num) => "B" + num);
    d.B = [...arr];
    from.Selected = from.Selected.concat(arr);
    const BB = from.B.concat(B);
    from.B = Array.from(new Set(BB));
  } else {
    d.B = [];
  }
  if (c.C) {
    const C = c.C.indexOf(",") == -1 ? Array.from(c.C).map(Number) : c.C;
    const arr = C.map((num) => "C" + num);
    d.C = [...arr];
    from.Selected = from.Selected.concat(arr);
    const CC = from.C.concat(C);
    from.C = Array.from(new Set(CC));
  } else {
    d.C = [];
  }
  if (c.D) {
    const D = c.D.indexOf(",") == -1 ? Array.from(c.D).map(Number) : c.D;
    const arr = D.map((num) => "D" + num);
    d.D = [...arr];
    from.Selected = from.Selected.concat(arr);
    const DD = from.D.concat(D);
    from.D = Array.from(new Set(DD));
  } else {
    d.D = [];
  }
  from.Selected = Array.from(new Set(from.Selected));
}
function setWgValue(c, from, d) {
  if (c.A) {
    const A = c.A.indexOf(",") == -1 ? Array.from(c.A).map(Number) : c.A;
    const arr = A.map((num) => "A" + num);
    d.A = [...arr];
    from.WSelected = from.WSelected.concat(arr);
    const AA = from.WA.concat(A);
    from.WA = Array.from(new Set(AA));
  } else {
    d.A = [];
  }
  if (c.B) {
    const B = c.B.indexOf(",") == -1 ? Array.from(c.B).map(Number) : c.B;
    const arr = B.map((num) => "B" + num);
    d.B = [...arr];
    from.WSelected = from.WSelected.concat(arr);
    const BB = from.WB.concat(B);
    from.WB = Array.from(new Set(BB));
  } else {
    d.B = [];
  }
  if (c.C) {
    const C = c.C.indexOf(",") == -1 ? Array.from(c.C).map(Number) : c.C;
    const arr = C.map((num) => "C" + num);
    d.C = [...arr];
    from.WSelected = from.WSelected.concat(arr);
    const CC = from.WC.concat(C);
    from.WC = Array.from(new Set(CC));
  } else {
    d.C = [];
  }
  if (c.D) {
    const D = c.D.indexOf(",") == -1 ? Array.from(c.D).map(Number) : c.D;
    const arr = D.map((num) => "D" + num);
    d.D = [...arr];
    from.WSelected = from.WSelected.concat(arr);
    const DD = from.WD.concat(D);
    from.WD = Array.from(new Set(DD));
  } else {
    d.D = [];
  }
  from.WSelected = Array.from(new Set(from.WSelected));
}
function setClearTook(tooh, type) {
  if (type == "wg") {
    tooh.WA = [];
    tooh.WB = [];
    tooh.WC = [];
    tooh.WD = [];
    tooh.WSelected = [];
    tooh.WgModel = "";
    tooh.WgRemarks = "";
    tooh.orderWgProduct = 0;
    tooh.orderWgNameProduct = "";
    tooh.isWgModel = false;
    tooh.WgColor1 = "";
    tooh.WgColor2 = "";
    tooh.WgColor3 = "";
    tooh.WgselectedButton = 0;
    tooh.WgXingHao = [];
  }
  if (type == "jt") {
    tooh.A = [];
    tooh.B = [];
    tooh.C = [];
    tooh.D = [];
    tooh.Selected = [];
    tooh.Model = "";
    tooh.Remarks = "";
    tooh.orderProduct = 0;
    tooh.orderNameProduct = "";
    tooh.isModel = false;
    tooh.Color1 = "";
    tooh.Color2 = "";
    tooh.Color3 = "";
    tooh.selectedButton = 0;
    tooh.XingHao = [];
  }
}
function copyOrder(item) {
  ElMessageBox.confirm("确认复制此条数据吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(
    () => {
      let value = JSON.parse(JSON.stringify(item));
      value.id = orderForm.value.length;
      value.orderProduct = "";
      value.addid = 0;
      value.orderProduct = 0;
      value.oldOrderProducts = item.oldOrderProduct;
      let val = {
        children: [],
        color: "",
        disabled: false,
        label: "",
        productItemClassifyId: item.type == "wg" ? value.productItemClassifyWgId : value.productItemClassifyId,
        value: item.orderProduct
      };
      if (value.xhOptions.length > 0) {
        val.label = value.xh;
        value.xhOptions.forEach((a) => {
          if (a.label != item.xh) {
            a.A = [];
            a.B = [];
            a.C = [];
            a.D = [];
          }
        });
        value.type = "add";
        orderForm.value.push(value);
        val.children = value.xhOptions;
        Object.assign(orderXh, item.xmOptions);
      } else {
        value.type = "add";
        orderForm.value.push(value);
      }
      onUpProductChange(val, value);
    },
    () => {
      ElMessage.info("已取消复制");
    }
  );
}
function upOrder(item) {
  setOrderFrom();
  isMenuDisplay.value = false;
  oldTooths.value = JSON.parse(JSON.stringify(orderToothForm.value));
  oldisClassValue.value = isClassValue.value;
  oldclassList.value = JSON.parse(JSON.stringify(classList.value));
  classKey.value += 1;
  visible.value = true;
}
function addOrder(item) {
  ElMessageBox.confirm("确认添加一条空数据吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning"
  }).then(
    () => {
      const value = Object.assign({}, item);
      value.id = orderForm.value.length;
      value.A = "";
      value.B = "";
      value.C = "";
      value.D = "";
      value.make = {};
      value.Model = "";
      value.Number = 0;
      value.type = "add";
      value.name = "";
      value.name = "";
      value.Remarks = "";
      value.oldOrderProduct = "";
      value.orderProduct = "";
      value.orderProductName = "";
      value.xhOptions = [];
      value.xmOptions = [];
      orderForm.value.push(value);
    },
    () => {
      ElMessage.info("已取消复制");
    }
  );
}
function onBeiZhu(item) {
  const name = item.name;
  orderForm.value.forEach((a) => {
    if (a.name == name && a.id != item.id && a.WgColor1 == item.WgColor1) {
      a.Remarks = item.Remarks;
    }
  });
}
function initColorChange() {
  ColorAPI.getPage(queryColorParams).then((data) => {
    data.list.forEach((a) => {
      a.label = a.name;
      a.value = a.code;
    });
    options.value = data.list;
  });
}
function setColorValue(v, name) {
  onColorChange(v, name);
}
function onColorChanges(v, name) {
  const values2 = {
    isCustom: false,
    label: v.label,
    value: v.label
  };
  diseaseSeriesForm.Color1 = values2;
  onColorChange(values2, name);
}
function onColorInput(v, name) {
  if (typeof v === "string") {
    const values2 = {
      isCustom: true,
      label: v,
      value: v
    };
    diseaseSeriesForm.Color1 = values2;
    onColorChange(values2, name);
  }
}
function setFactoryIdValue(data, tooh) {
  factoryId.value = data.value;
  diseaseSeriesForm.factoryId = { value: data.value, label: data.label };
  orderToothForm.value = tooh;
  getClass(2);
}
function onColorChange(v, name) {
  orderToothForm.value.forEach((b) => {
    if (name == "Color1" || name == "WgColor1") {
      if (b.value.isColor && b.value.orderProduct > 0) {
        b.value.Color1 = v == void 0 ? "" : v;
      }
      if (b.value.isWgColor && b.value.orderWgProduct > 0) {
        b.value.WgColor1 = v == void 0 ? "" : v;
      }
      colorData.Color1 = v == void 0 ? "" : v;
    }
    if (name == "Color2" || name == "WgColor2") {
      if (b.value.isColor && b.value.orderProduct > 0) {
        b.value.Color2 = v == void 0 ? "" : v;
      }
      if (b.value.isWgColor && b.value.orderWgProduct > 0) {
        b.value.WgColor2 = v == void 0 ? "" : v;
      }
      colorData.Color2 = v == void 0 ? "" : v;
    }
    if (name == "Color3" || name == "WgColor3") {
      if (b.value.isColor && b.value.orderProduct > 0) {
        b.value.Color3 = v == void 0 ? "" : v;
      }
      if (b.value.isWgColor && b.value.orderWgProduct > 0) {
        b.value.WgColor3 = v == void 0 ? "" : v;
      }
      colorData.Color3 = v == void 0 ? "" : v;
    }
  });
}
function openOrder() {
  queryOrderParams.day = "no";
  queryOrderParams.keywords = "";
  queryOrderParams.createTime = null;
  queryOrderParams.state = "state < 29";
  queryOrderParams.pageIndex = 1;
  queryOrderParams.pageSize = 10;
  queryOrderParams.orgRoleCodes = user.members.orgRoleCodes;
  const data = JSON.stringify(queryOrderParams);
  setQueryParamsData(data);
  const url = {
    path: "/orders"
  };
  clearInterval(timer.value);
  router.push(url).then(() => {
    window.location.reload();
  }).catch(() => {
    window.location.reload();
  });
}
function openDetails() {
  if (orderId.value > 0) {
    const params = {
      id: orderId.value
    };
    const url = {
      path: "/details",
      query: params
    };
    clearInterval(timer.value);
    router.push(url).then(() => {
      window.location.reload();
    }).catch(() => {
      window.location.reload();
    });
  } else {
    ElNotification({
      title: "Error",
      message: `订单编号不存在!`,
      type: "error",
      duration: 3e3
    });
  }
}
function handleSelectBlur(v) {
  if (v == "selectColorsRef") {
    const selectDom = selectColorsRef.value.$el;
    const inputDom = selectDom.querySelector(".el-select__input");
    if (inputDom) {
      const label = inputDom.value.trim();
      if (label != "") {
        diseaseSeriesForm.Color1 = { label, value: "" };
        onColorChange(label, "Color1");
      }
    }
  }
}
function clearModelValue(item) {
  item.Model = "";
  item.XhModel = "";
}
function handleFocus(item) {
  item.XhModelIsOpen = true;
}
function handleInput(v, item) {
  setTimeout(() => {
    if (v != "") {
      if (item.Model != void 0 && typeof item.Model !== "string") {
        if (item.xhOptions.length > 0) {
          const isxh = item.xhOptions.filter((a) => {
            return a.label == item.XhModel;
          });
          if (isxh.length == 0) {
            item.Model = { label: v, value: 0 };
          } else {
            item.Model = { label: isxh[0].label, value: isxh[0].value };
          }
        } else {
          item.Model = { label: v, value: 0 };
        }
      } else {
        item.Model = { label: v, value: 0 };
      }
    }
    item.XhModelIsOpen = false;
  }, 200);
}
function handleBlurInput(item) {
  item.XhModelIsOpen = false;
}
const handleForceShowSelect = async (index, i) => {
  if (i == void 0 || i == 0) {
    return false;
  }
  await nextTick();
  if (!selectRefs.value[index]) {
    console.error("未获取到 el-select 实例");
    return;
  }
  try {
    selectRefs.value[index].showDropdown();
  } catch (err) {
    try {
      const inputEl = selectRefs.value[index].$el.querySelector(".el-select__input");
      if (inputEl) {
        inputEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
    } catch (err2) {
      const dropdownEl = document.querySelector(`[aria-labelledby="${selectRefs.value.id}"]`);
      if (dropdownEl) {
        dropdownEl.style.display = "block";
        dropdownEl.style.zIndex = "99999";
      }
    }
  }
};
function formatNumArr(arr, v) {
  if (!arr || arr.length === 0) return "";
  if (arr.indexOf("-") > -1 || arr.indexOf(",") > -1) {
    return arr;
  }
  const result = [];
  let tempList = [arr[0]];
  for (let i = 1; i < arr.length; i++) {
    if (Math.abs(arr[i] - arr[i - 1]) === 1) {
      tempList.push(arr[i]);
    } else {
      result.push(handleContinuousList(tempList, v));
      tempList = [arr[i]];
    }
  }
  result.push(handleContinuousList(tempList, v));
  return result.join(",");
}
const handleContinuousList = (list, v) => {
  if (list.length >= 2) {
    const max = Math.max(...list);
    const min = Math.min(...list);
    if (v == 0) {
      return `${max}-${min}`;
    } else {
      return `${min}-${max}`;
    }
  } else {
    return list.join(",");
  }
};
const handleClickBlank = (e) => {
  if (targetDiv.value && !targetDiv.value.contains(e.target)) {
    if (childRef.value) {
      childRef.value.cancelSelect();
    }
  }
};
const handleClickBlanks = (e) => {
  if (targetsDiv.value && !targetsDiv.value.contains(e.target)) {
    if (toohRef.value) {
      toohRef.value.cancelSelect();
    }
  }
};
function addEventListener() {
  document.addEventListener("click", handleClickBlank);
  document.addEventListener("click", handleClickBlanks);
}
function removeEventListener() {
  document.removeEventListener("click", handleClickBlank);
  document.removeEventListener("click", handleClickBlanks);
}
onUnmounted(() => removeEventListener());
onMounted(() => {
  getOrganDatas();
  initColorChange();
  Query();
  issetImg.value = false;
  addEventListener();
});
</script>

<style lang="scss" scoped>
.ecmbody {
  display: flex;
  width: 1220px;
  margin: 0 auto;
  flex-flow: column;
  line-height: 100%;
  .ecmbody-nav {
    display: flex;
    width: 100%;
    font-weight: 500;
    font-size: 18px;
    height: 50px;
    line-height: 50px;
    font-family: Noto Sans SC;
    color: #333f48;
    span {
      font-weight: 700;
      font-style: Bold;
      font-size: 16px;
    }
    a:hover {
      color: #3d7eff;
      cursor: pointer;
    }
  }
  .ecmbody-nav1 {
    width: 100%;
    display: flex;
    font-weight: 700;
    font-size: 25px;
    line-height: 100%;
    color: #333f48;
    height: 68px;
    width: 100%;
    .ecmbody-nav1-title {
      display: flex;
      width: 60%;
    }
    .ecmbody-nav1-title1 {
      width: 40%;
      font-size: 18px;
      :deep(.el-step__title.is-finish) {
        color: var(--el-color-primary);
        font-size: 18px;
      }
      :deep(.el-step__title.is-process) {
        color: var(--el-text-color-primary);
        font-weight: bold;
        font-size: 18px;
      }
      :deep(.el-step__title) {
        font-size: 18px;
        line-height: 38px;
      }
      :deep(.el-step__description.is-success) {
        color: #4e93f5;
      }
      :deep(.el-step__icon-inner.is-status) {
        transform: translateY(1px);
        color: #4e93f5;
      }
      :deep(.el-step__head.is-success) {
        border-color: #4e93f5;
        color: #4e93f5;
      }
      :deep(.el-step__title.is-success) {
        color: #4e93f5;
      }
    }
  }
  .ecmbody-infos {
    margin-top: 20px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border-width: 0.5px;
    padding: 10px 10px 5px 20px;
    border: 0.5px solid #c5d1dc;
    background-color: #ffffff;
    .ecmbody-info-title {
      display: flex;
      height: 30px;
      align-items: center;
      font-family: Noto Sans SC;
      font-weight: 700;
      font-size: 20px;
      color: #333f48;
      span {
        color: red;
        padding-top: 7px;
        width: 15px;
      }
    }
    .ecmbody-info-title1 {
      display: flex;
      height: 30px;
      align-items: center;
      font-family: Noto Sans SC;
      font-weight: 700;
      font-size: 18px;
      color: #333f48;
      span {
        color: red;
        padding-top: 7px;
        width: 15px;
      }
    }
    .ecmbody-info-content-form {
      width: 90%;
      margin: 0 auto;
      margin-top: 10px;
      text-align: left;
      :deep(.el-upload--picture-card) {
        --el-upload-picture-card-size: 50px;
        align-items: center;
        background-color: var(--el-fill-color-lighter);
        border: 1px dashed var(--el-border-color-darker);
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        display: inline-flex;
        height: var(--el-upload-picture-card-size);
        justify-content: center;
        vertical-align: top;
        width: var(--el-upload-picture-card-size);
      }
      :deep(.el-form-item__label) {
        align-items: flex-start;
        box-sizing: border-box;
        color: #303133;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: var(--el-form-label-font-size);
        height: 32px;
        line-height: 32px;
        padding: 0 12px 0 0;
      }

      .upfile {
        width: auto;
        padding: 0px 10px 0px 10px;
        display: flex;
        .upfile-txt {
          display: flex;
          //max-width: 200px;
          overflow: hidden;
          height: 32px;
          flex-flow: column;
          white-space: nowrap;
          .upfile-name {
            display: flex;
            height: 28px;
          }
          .upfile-jindu {
            position: relative;
            height: 3px;
            width: 100%;
            background-color: #a8abb2;
            margin-left: 5px;
          }
        }
        .upfile-txts {
          display: flex;
          //max-width: 200px;
          overflow: hidden;
          white-space: nowrap;
          height: 50px;
          cursor: pointer;
          .upfile-names {
            display: flex;
            height: 42px;
          }
          .upfile-jindus {
            position: relative;
            height: 3px;
            width: 100%;
            background-color: #a8abb2;
            margin-left: 5px;
          }
        }
        span {
          position: relative;
          top: -10px;
          padding-left: 10px;
          cursor: pointer;
        }
      }
      .upfiles {
        width: auto;
        padding: 0px 10px 0px 20px;
        display: flex;
        .upfile-txts {
          display: flex;
          max-width: 100px;
          overflow: hidden;
          height: 50px;
          cursor: pointer;
          flex-flow: column;
          .upfile-names {
            display: flex;
            height: 48px;
          }
          .upfile-jindus {
            position: relative;
            height: 3px;
            width: 100%;
            background-color: #a8abb2;
          }
        }
        span {
          position: relative;
          top: -10px;
          padding-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .ecmbody-info3s {
    margin-top: 10px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border-width: 0.5px;
    padding: 10px 20px 10px 20px;
    border: 0.5px solid #c5d1dc;
    background-color: #ffffff;
    .ecmbody-info3-title {
      display: flex;
      height: 30px;
      align-items: center;
      font-family: Noto Sans SC;
      font-weight: 700;
      font-size: 18px;
      color: #333f48;
      justify-content: space-between;
      span {
        color: #4a5a6a;
        width: 20px;
        right: 0px;
        cursor: pointer;
      }
    }
    .ecmbody-info3-content {
      width: 100%;
      line-height: 100%;
      padding: 10px 20px 0px 20px;
      .ecmbody-info3-content-1 {
        font-weight: 400;
        font-size: 16px;
        color: #333f48;
        height: 35px;
      }
      .el-form-item__content {
        display: flex;
        width: 100%;
        .yanse {
          width: 96.3%;
          .custom-select {
            width: 115px;
            font-size: 14px;
            margin-left: 18px;
            border: none;
            :deep(.select-input) {
              position: relative;
              display: flex;
              align-items: center;
              width: 100%;
              height: 30px;
              border-radius: 4px;
              background: #ffffff;
              cursor: text;
              transition: border-color 0.2s;
              padding-left: 8px;
            }
            :deep(.input-inner) {
              flex: 1;
              height: 100%;
              border: none;
              outline: none;
              background: transparent;
              color: #000;
              width: 100%;
              font-family: Noto Sans SC;
              font-size: 18px;
              font-weight: 400;
              font-family:
                "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
                "微软雅黑", Arial, sans-serif;
            }
            :deep(.arrow) {
              display: flex;
              margin-left: -40px;
              /* position: static; */
              color: #9ca3af;
              /* transition: transform 0.2s; */
              font-size: 14px;
              margin-right: -6px;
            }
            :deep(.option-item) {
              padding: 0px 6px;
              color: #606266;
              cursor: pointer;
              transition: background-color 0.2s;
              font-weight: lighter;
              font-size: 14px;
            }
            :deep(.clear-btn) {
              display: flex;
              padding: 0;
              border: none;
              background: transparent;
              color: #9ca3af;
              font-size: 16px;
              cursor: pointer;
              transition: color 0.2s;
              margin-right: 45px;
            }
          }
        }
      }
      :deep(.el-form-item__label) {
        align-items: flex-start;
        box-sizing: border-box;
        color: #303133;
        display: inline-flex;
        flex: 0 0 auto;
        font-size: var(--el-form-label-font-size);
        height: 32px;
        line-height: 32px;
        padding: 0 12px 0 0;
      }
      :deep(.el-select--small .el-select__wrapper) {
        font-size: 14px;
        gap: 4px;
        line-height: 20px;
        min-height: 30px;
        padding: 2px 8px;
      }
      :deep(.el-input--small .el-input__wrapper) {
        font-size: 14px;
        gap: 4px;
        line-height: 20px;
        min-height: 30px;
        padding: 2px 8px;
      }
    }
  }
  .ecmbody-info4s {
    margin-top: 10px;
    width: 100%;
    height: auto;
    border-radius: 10px;
    border-width: 0.5px;
    padding: 10px 20px 10px 20px;
    border: 0.5px solid #c5d1dc;
    background-color: #ffffff;
    .ecmbody-info4-top {
      .ecmbody-info4-top-title {
        display: flex;
        height: 30px;
        align-items: center;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-size: 18px;
        color: #333f48;
        justify-content: space-between;
        span {
          color: #4a5a6a;
          width: 20px;
          right: 0px;
          cursor: pointer;
        }
      }
      .ecmbody-info4-top-content {
        width: 100%;
        line-height: 100%;
        padding: 10px 20px;
        .ecmbody-left-content3-title {
          display: flex;
          background-color: #5094f5;
          .ecmbody-left-content3-title-1 {
            color: #ffffff;
            height: 22px;
            overflow: hidden;
            padding: 2px 5px;
          }
          span {
            font-size: 16px;
            padding-top: 1px;
            color: #ffffff;
          }
        }
        :deep(.el-table th.el-table__cell) {
          background-color: #5094f5;
          color: #ffffff;
        }
        :deep(.el-table tr) {
          background-color: #ffffff;
        }
        .container {
          display: flex;
          flex-wrap: wrap;
        }
        .box1 {
          flex: 1 0 50%;
          border-right: 1px solid #eb5757;
          border-bottom: 1px solid #eb5757;
          text-align: right;
          padding-right: 5px;
          font-size: 17px;
          padding-bottom: 3px;
        }
        .box2 {
          flex: 1 0 50%;
          border-bottom: 1px solid #eb5757;
          padding-left: 5px;
          padding-bottom: 3px;
        }
        .box3 {
          flex: 1 0 50%;
          text-align: right;
          border-right: 1px solid #eb5757;
          padding-right: 5px;
          padding-top: 3px;
        }
        .box4 {
          flex: 1 0 50%;
          padding-left: 5px;
          padding-top: 3px;
        }
        .ecmbody-from-caozuo {
          display: flex;
          width: 100%;
        }
        :deep(.el-table__body-wrapper),
        :deep(.el-table__row),
        :deep(.el-table__cell) {
          overflow: visible !important;
          /* 去掉 position: static !important; */
        }
        :deep(.el-input--small .el-input__wrapper) {
          padding: 1px 4px;
        }
        :deep(.el-table--default .cell) {
          padding: 0 8px;
        }
        .xinghao {
          width: 100%;
          display: flex;
          margin-top: -23px;
          :deep(.select-input) {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            height: 30px;
            border-radius: 4px;
            background: #ffffff;
            cursor: text;
            transition: border-color 0.2s;
            border: 0.5px solid #c5d1dc;
          }
          :deep(.select-input:focus-within) {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
          }
          :deep(.input-inner) {
            flex: 1;
            height: 100%;
            border: none;
            outline: none;
            background: transparent;
            color: #000000;
            width: 100%;
            font-size: 18px;
            font-weight: 400;
            padding-left: 8px;
            font-family:
              "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei",
              "微软雅黑", Arial, sans-serif;
          }
          :deep(.clear-btn) {
            display: flex;
            padding: 0;
            border: none;
            background: transparent;
            color: #9ca3af;
            font-size: 16px;
            cursor: pointer;
            transition: color 0.2s;
            margin-left: 115px;
            position: absolute;
          }
          :deep(.arrow) {
            display: flex;
            margin-left: -40px;
            color: #9ca3af;
            font-size: 14px;
            margin-right: 5px;
          }
          :deep(.rotate) {
            transform: rotate(180deg);
          }
        }

        .float-wrapper {
          height: 100%;
          display: flex;
          align-items: center;
          cursor: pointer; /* 提示可点击 */
        }

        /* 核心：浮动内容（直接脱离表格，置顶显示） */
        .float-content {
          /* 关键1：fixed定位（脱离所有父容器，直接相对于视口） */
          position: fixed;
          /* 关键2：层级拉满，覆盖所有元素 */
          z-index: 99999 !important;
          /* 样式：确保不被截断 + 悬浮感 */
          width: 220px;
          padding: 12px;
          background: #fff;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          white-space: normal; /* 允许换行 */
          pointer-events: auto; /* 支持点击交互 */
        }
        :deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
          background: #e9f0f5;
        }
        :deep(.el-table) {
          --el-table-row-hover-bg-color: #e9f0f5;
          --el-table-border: 1px solid #ffffff;
        }
        :deep(.el-textarea__inner) {
          font-size: 18px;
          color: #000;
        }
        :deep(.el-select--small .el-select__wrapper) {
          line-height: 30px;
          min-height: 30px;
          height: 30px;
        }
      }
    }
  }
  .ecmbody-next {
    display: flex;
    height: 60px;
    justify-content: end;
    margin-top: 20px;
    img {
      display: flex;
      height: 45px;
      cursor: pointer;
    }
  }
  .ecmbody-nexts {
    display: flex;
    height: 60px;
    justify-content: space-between;
    margin-top: 20px;
    .ecmbody-back {
      display: flex;
      height: 60px;
      img {
        display: flex;
        height: 45px;
        cursor: pointer;
      }
    }
    .ecmbody-nexts1 {
      display: flex;
      height: 60px;
      justify-content: end;
      img {
        display: flex;
        height: 45px;
        cursor: pointer;
      }
    }
  }
  .ecmbody-tabs {
    margin-top: 20px;
    width: 100%;
    height: 100%;
    .ecmbody-info2 {
      display: flex;
      justify-content: space-between;
      flex-flow: column;
      width: 100%;
      padding: 30px 20px 10px 20px;
      border-width: 0.5px;
      line-height: 100%;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      border: 0.5px solid #c5d1dc;
      .ecmbody-info2-top1 {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .ecmbody-info2-left {
          display: flex;
          width: 40%;
          flex-flow: column;
          .ecmbody-info2-left1 {
            width: 100%;
            display: flex;
            font-weight: 700;
            font-style: Bold;
            font-size: 20px;
            height: 40px;
            color: #333f48;
          }
          .ecmbody-info2-left2 {
            width: 100%;
            display: flex;
            .card-box {
              width: 100%;
              height: 480px;
              background: #f2fffa;
              border-radius: 5px;
              margin-top: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              position: relative;

              .text-box {
                position: absolute;
                font-size: 18px;
                color: #333333;
              }

              .a-box {
                top: 180px;
                left: 175px;
              }

              .b-box {
                top: 180px;
                right: 175px;
              }

              .c-box {
                bottom: 180px;
                left: 175px;
              }

              .d-box {
                bottom: 180px;
                right: 175px;
              }
              .a-box1 {
                top: 208px;
                left: 130px;
                color: #999;
                text-align: right;
                width: 84px;
                font-size: 13px;
              }

              .b-box1 {
                top: 208px;
                right: 130px;
                color: #999;
                text-align: left;
                width: 84px;
                font-size: 13px;
              }

              .c-box1 {
                bottom: 205px;
                left: 130px;
                text-align: right;
                width: 84px;
                color: #999;
                font-size: 13px;
              }

              .d-box1 {
                bottom: 205px;
                right: 130px;
                text-align: left;
                color: #999;
                width: 84px;
                font-size: 13px;
              }

              .img-box {
                position: absolute;
                z-index: 99;

                img {
                }
              }

              .top-box {
                width: 260px;
                height: 150px;
                background-image: url(../../assets/images/vector1.png);
                background-position: center;
                background-repeat: no-repeat;
                background-size: 100%;
                font-size: 16px;
              }

              .bottom-box {
                width: 260px;
                height: 150px;
                background-image: url(../../assets/images/vector2.png);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 100% 130px;
                font-size: 16px;
              }

              .container-img {
                width: 260px;
                height: 130px;
              }

              .col-line {
                display: flex;
                align-items: center;
                .line1 {
                  background: #29d894;
                  height: 2px;
                  width: 100px;
                  margin: 0 5px;
                }

                .line2 {
                  background: #29d894;
                  height: 2px;
                  width: 35px;
                  margin: 0 5px;
                }
              }

              .top-line {
                position: absolute;
                width: 2px;
                background: #29d894;
                height: 210px;
                top: 20px;
              }

              .bottom-line {
                position: absolute;
                width: 2px;
                background: #29d894;
                height: 210px;
                bottom: 20px;
              }
            }

            .tooth-index {
              position: absolute;
            }

            .hide {
              opacity: 0;
            }
            .d-ac {
              display: flex;
              align-items: center;
            }

            .d-jc {
              display: flex;
              justify-content: center;
            }
            .tooth-container {
              .goods-box {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: rotate(-30deg);
                translate: -50%;
                z-index: 999;
                color: red;
                font-weight: bold;
              }

              position: absolute;
              width: 345px;
              height: 100%;
            }

            .inline-button {
              width: 45%;
            }
          }
        }
        .ecmbody-info2-right {
          display: flex;
          width: 60%;
          flex-flow: column;
          padding-left: 10%;
          .ecmbody-info2-right1 {
            width: 100%;
            display: flex;
            font-weight: 700;
            font-style: Bold;
            font-size: 20px;
            height: 40px;
            color: #333f48;
          }
          .ecmbody-info2-right2 {
            width: 100%;
            display: flex;
            flex-flow: column;
            font-weight: 700;
            font-style: Bold;
            font-size: 20px;
            .ecmbody-info2-right2-btn {
              width: 100%;
              :deep(.el-button:hover) {
                background-color: #626aef;
                border-color: var(--el-button-hover-border-color);
                color: #ffffff;
                font-size: 14px;
                outline: none;
              }
              :deep().el-button--primary {
                font-size: 14px;
                background-color: #626aef;
                border-color: var(--el-button-hover-border-color);
              }
            }
            .ecmbody-info2-right2-radio {
              margin-top: 20px;
              width: 100%;
              display: flex;
            }
            .ecmbody-info2-right2-content {
              margin-top: 20px;
              width: 100%;
              flex-flow: column;
              display: flex;
              font-size: 14px;
              color: #333f48;
            }
          }
        }
      }
      .ecmbody-info2-top2 {
        margin-top: 10px;
        width: 100%;
        display: flex;
        justify-content: space-between;
        .ecmbody-info2-left {
          display: flex;
          width: 40%;
          flex-flow: column;
          .ecmbody-info2-left1 {
            width: 100%;
            display: flex;
            font-weight: 700;
            font-style: Bold;
            font-size: 20px;
            height: 40px;
            color: #333f48;
          }
          .ecmbody-info2-left2 {
            width: 100%;
            display: flex;
            .card-box {
              width: 100%;
              height: 480px;
              background: #f2fffa;
              border-radius: 5px;
              margin-top: 5px;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              position: relative;

              .text-box {
                position: absolute;
                font-size: 18px;
                color: #333333;
              }

              .a-box {
                top: 180px;
                left: 175px;
              }

              .b-box {
                top: 180px;
                right: 175px;
              }

              .c-box {
                bottom: 180px;
                left: 175px;
              }

              .d-box {
                bottom: 180px;
                right: 175px;
              }
              .a-box1 {
                top: 208px;
                left: 130px;
                color: #999;
                text-align: right;
                width: 84px;
                font-size: 13px;
              }

              .b-box1 {
                top: 208px;
                right: 130px;
                color: #999;
                text-align: left;
                width: 84px;
                font-size: 13px;
              }

              .c-box1 {
                bottom: 205px;
                left: 130px;
                text-align: right;
                width: 84px;
                color: #999;
                font-size: 13px;
              }

              .d-box1 {
                bottom: 205px;
                right: 130px;
                text-align: left;
                color: #999;
                width: 84px;
                font-size: 13px;
              }

              .img-box {
                position: absolute;
                z-index: 99;

                img {
                }
              }

              .top-box {
                width: 260px;
                height: 150px;
                background-image: url(../../assets/images/vector1.png);
                background-position: center;
                background-repeat: no-repeat;
                background-size: 100%;
                font-size: 16px;
              }

              .bottom-box {
                width: 260px;
                height: 150px;
                background-image: url(../../assets/images/vector2.png);
                background-position: top center;
                background-repeat: no-repeat;
                background-size: 100% 130px;
                font-size: 16px;
              }

              .container-img {
                width: 260px;
                height: 130px;
              }

              .col-line {
                display: flex;
                align-items: center;
                .line1 {
                  background: #29d894;
                  height: 2px;
                  width: 100px;
                  margin: 0 5px;
                }

                .line2 {
                  background: #29d894;
                  height: 2px;
                  width: 35px;
                  margin: 0 5px;
                }
              }

              .top-line {
                position: absolute;
                width: 2px;
                background: #29d894;
                height: 210px;
                top: 20px;
              }

              .bottom-line {
                position: absolute;
                width: 2px;
                background: #29d894;
                height: 210px;
                bottom: 20px;
              }
            }

            .tooth-index {
              position: absolute;
            }

            .hide {
              opacity: 0;
            }
            .d-ac {
              display: flex;
              align-items: center;
            }

            .d-jc {
              display: flex;
              justify-content: center;
            }
            .tooth-container {
              .goods-box {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: rotate(-30deg);
                translate: -50%;
                z-index: 999;
                color: red;
                font-weight: bold;
              }

              position: absolute;
              width: 345px;
              height: 100%;
            }

            .inline-button {
              width: 45%;
            }
          }
        }
        .ecmbody-info2-right {
          display: flex;
          width: 60%;
          flex-flow: column;
          padding-left: 10%;
          .ecmbody-info2-right1 {
            width: 100%;
            display: flex;
            font-weight: 700;
            font-style: Bold;
            font-size: 20px;
            height: 40px;
            padding-top: 5px;
            color: #333f48;
          }
          .ecmbody-info2-right2 {
            width: 100%;
            display: flex;
            flex-flow: column;
            font-weight: 700;
            font-style: Bold;
            font-size: 20px;
            .ecmbody-info2-right2-btn {
              width: 100%;
              :deep(.el-button:hover) {
                background-color: #626aef;
                border-color: var(--el-button-hover-border-color);
                color: #ffffff;
                font-size: 14px;
                outline: none;
              }
              :deep().el-button--primary {
                font-size: 14px;
                background-color: #626aef;
                border-color: var(--el-button-hover-border-color);
              }
            }
            .ecmbody-info2-right2-radio {
              margin-top: 20px;
              width: 100%;
              display: flex;
            }
            .ecmbody-info2-right2-content {
              margin-top: 20px;
              width: 100%;
              flex-flow: column;
              display: flex;
              font-size: 14px;
              color: #333f48;
            }
          }
        }
      }
    }
    :deep(.el-tabs__header) {
      align-items: center;
      display: flex;
      justify-content: space-between;
      margin: 0px;
      height: auto;
      position: relative;
      border-bottom: none;
    }
    :deep(.el-tabs__item.is-active) {
      border-bottom-color: #f2f3f5;
      color: #333f48;
      background-color: #fff;
      margin: 13px 13px 0px 13px;
      height: 35px;
      font-weight: bold;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
    }
    :deep(.el-tabs__nav) {
      border: 1px solid var(--el-border-color-light);
      border-bottom: none;
      border-radius: 8px 8px 0 0;
      box-sizing: border-box;
      background-color: #333f48;
      color: #ffffff;
    }
    :deep(.el-tabs__item) {
      color: #ffffff;
      border-bottom: 0px solid #f2f3f5;
      border-left: 0px solid #f2f3f5;
      margin-top: 8px;
      transition:
        color var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier),
        padding var(--el-transition-duration) var(--el-transition-function-ease-in-out-bezier);
    }
  }
  .ecmbody-ok {
    display: flex;
    height: 580px;
    justify-content: center;
    flex-flow: column;
    width: 1220px;
    border: 0.5px solid #c5d1dc;
    align-items: center;
    margin-top: 38px;
    background-color: #ffffff;
    border-width: 0.5px;
    border-radius: 10px;
    img {
      height: 50px;
    }
    .ecmbody-ok-txt {
      display: flex;
      justify-content: center;
      padding-top: 58px;
      font-size: 20px;
      font-weight: 500;
      width: 100%;

      .ecmbody-ok-txt1 {
        color: #4e93f5;
        font-family: Noto Sans SC;
        font-weight: Bold;
        font-size: 20px;
        line-height: 100%;
      }
      .ecmbody-ok-txt2 {
        font-family: Noto Sans SC;
        font-weight: 400;
        font-size: 20px;
        line-height: 100%;
        color: #333f48;
        span {
          color: #34c759;
          cursor: pointer;
        }
      }
    }
    .ecmbody-ok-btn {
      display: flex;
      width: 100%;
      margin-top: 5%;
      flex-flow: column;
      align-items: center;
      .ecmbody-ok-btn1 {
        cursor: pointer;
        display: flex;
        width: 150px;
        gap: 16px;
        opacity: 1;
        border-width: 2px;
        border-radius: 6px;
        padding: 10px;
        color: #4e93f5;
        border: 2px solid #4192d9;
        backdrop-filter: blur(20px);
        font-family: Noto Sans SC;
        font-weight: 500;
        font-size: 18px;
        margin-top: 3%;
      }
    }
  }
  .ecmbody-backs {
    display: flex;
    height: auto;
    justify-content: left;
    width: 1140;
    margin-top: 20px;
    flex-flow: column;
    .ecmbody-backs1 {
      margin-top: 10px;
      height: auto;
      img {
        cursor: pointer;
      }
    }
    .ecmbody-backs2 {
      margin-top: 10px;
      height: auto;
      cursor: pointer;
      img {
        cursor: pointer;
      }
    }
  }
  .ecmbody-zhanwei {
    width: 100%;
    display: flex;
    height: 40px;
  }
  :deep(.el-overlay-dialog) {
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  :deep(.el-dialog__title) {
    font-family: Noto Sans SC;
    font-weight: 700;
    font-style: Bold;
    font-size: 20px;
    line-height: 100%;
  }
  .eldialogs {
    width: 90%;
    .ecmbody-info-eldialog {
      width: 90%;
      margin: 0 auto;
      padding-top: 20px;
    }
    .ecmbody-info4-top-content {
      width: 100%;
      line-height: 100%;
      padding: 20px;
      :deep(.el-table th.el-table__cell) {
        background-color: #d5e1ed;
        color: #333f48;
        font-size: 12px;
      }
      :deep(.el-table tr) {
        background-color: #ffffff;
        font-size: 12px;
      }
      :deep(.table-row-selected) {
        background-color: #000 !important;
        color: var(--custom-table-selected-color) !important;
        // 选中行的单元格也同步样式（避免文字色不一致）
        td {
          color: var(--custom-table-selected-color) !important;
        }
      }
      .container {
        display: flex;
        flex-wrap: wrap;
      }
      .box11 {
        display: flex;
        flex: 1 0 50%;
        border-right: 1px solid #eb5757;
        border-bottom: 1px solid #eb5757;
        text-align: right;
        padding-right: 5px;
        align-items: center;
      }
      .box22 {
        display: flex;
        flex: 1 0 50%;
        border-bottom: 1px solid #eb5757;
        padding-left: 5px;
        align-items: center;
      }
      .box33 {
        display: flex;
        flex: 1 0 50%;
        text-align: right;
        border-right: 1px solid #eb5757;
        padding-right: 5px;
        align-items: center;
      }
      .box44 {
        display: flex;
        flex: 1 0 50%;
        padding-left: 5px;
        align-items: center;
      }
    }
  }
  .dialog_top {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    .dialog_title {
      display: flex;
      width: auto;
      font-family: Noto Sans SC;
      font-weight: 500;
      font-size: 24px;
      line-height: 100%;
      color: #000;
      padding-left: 15px;
    }
  }
  .dialog_content {
    display: flex;
    width: 100%;
    height: auto;
    flex-flow: column;
    padding-top: 20px;
    .dialog_content1 {
      display: flex;
      width: 100%;
      flex-flow: column;
      height: auto;
      .dialog_content1-1 {
        display: flex;
        width: 100%;
        height: 35px;
        align-items: center;
      }
    }
    .dialog_content2 {
      display: flex;
      width: 100%;
      padding-top: 10px;
      :deep(.el-checkbox__label) {
        display: inline-block;
        font-size: var(--el-checkbox-font-size);
        line-height: 1;
        padding-left: 8px;
        font-family: Noto Sans SC;
        font-weight: 700;
        font-style: Bold;
        font-size: 14px;
        line-height: 100%;
      }
    }
  }
  :deep(.el-message--error) {
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 600px;
  }
  :deep(.el-progress) {
    align-items: center;
    display: flex;
    line-height: 1;
    position: relative;
    width: 100%;
  }
  :deep(.el-form-item--default) {
    --el-form-label-font-size: 18px;
    margin-bottom: 18px;
  }
  :deep(.el-input__inner) {
    background: none;
    border: none;
    box-sizing: border-box;
    color: #000000;
    flex-grow: 1;
    font-size: inherit;
    height: var(--el-input-inner-height);
    line-height: var(--el-input-inner-height);
    outline: none;
    padding: 0;
    width: 100%;
    font-size: 18px;
  }

  :deep(.el-select__placeholder) {
    color: #000000;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    z-index: -1;
    font-size: 18px;
  }
  :deep(.el-select__placeholder.is-transparent) {
    color: #a8abb2;
    -webkit-user-select: none;
    -moz-user-select: none;
    user-select: none;
    font-size: 18px;
  }
  :deep(.el-radio__label) {
    font-size: 18px;
  }
  :deep(.el-form-item__error) {
    color: var(--el-color-danger);
    font-size: 15px;
    left: 0;
    line-height: 1;
    padding-top: 2px;
    position: absolute;
    top: 100%;
  }
  :deep(.el-row) {
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    position: relative;
    height: 58px;
  }
}
.el-select-dropdown__item {
  box-sizing: border-box;
  color: var(--el-text-color-regular);
  cursor: pointer;
  font-size: 18px;
  height: 34px;
  line-height: 34px;
  overflow: hidden;
  padding: 0 32px 0 20px;
  position: relative;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.el-select-dropdown__item.is-selected {
  font-weight: 500;
  color: #5094f5;
}
</style>

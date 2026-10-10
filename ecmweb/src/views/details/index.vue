<template>
  <div class="ecmbody" @click.stop="handlezzBlur">
    <div class="ecmbodys">
      <div class="ecmbody-left">
        <div class="ecmbody-left-top">
          <div class="ecmbody-left-top1">
            <a @click="to">订单管理</a>
            /
            <span>订单详情</span>
          </div>
          <div class="ecmbody-left-top3">
            <div class="ecmbody-left-top3-date">
              最近刷新：{{ dataTime }} &nbsp;
              <el-icon @click="refresh"><Refresh /></el-icon>
            </div>
            <div class="ecmbody-left-top3-btn">
              <el-button
                v-if="(isDisplay && orderState <= 29 && isUpdate) || isAdmin"
                style="background-color: #5094f5; color: white; width: 110px; height: 30px"
                @click="onUpdate"
              >
                编辑订单
              </el-button>
              <el-button
                v-if="isDisplay == false"
                style="width: 60px; height: 30px"
                @click="Cancel"
              >
                取消
              </el-button>
              <el-button
                v-if="isDisplay == false"
                style="background-color: #5094f5; color: white; width: 110px; height: 30px"
                @click="SubmitOrder"
              >
                保存订单
              </el-button>
            </div>
          </div>
        </div>
        <div v-if="isDisplay" class="ecmbody-left-info">
          <div v-if="isdgcwt" class="ecmbody-left-info3">
            <div class="ecmbody-info3-title">
              <div class="title">
                病例信息
                <span>
                  &nbsp;【{{ prodTypeName }}|{{ orderForm.prodRangeName }}|{{ orderForm.orderNo }}】
                </span>
              </div>
              <div class="img">
                <img v-if="orderForm.urgent" src="/images/jiaji.png" height="35px" title="加急" />
                &nbsp;
                <img
                  v-if="orderForm.isQuestion > 0"
                  src="/images/ddw.png"
                  height="35px"
                  :title="getQuestiong(orderForm.isQuestion)"
                />
                &nbsp;
                <img v-if="orderForm.dc == 0" src="/images/dzf.png" height="35px" title="作废" />
                &nbsp;
                <img v-if="orderForm.isPaused" src="/images/dzt.png" height="33px" title="暂停" />
              </div>
              <div v-if="orderForm.isAudit" class="ysh">已审核</div>
            </div>
            <div class="ecmbody-info3-content">
              <el-form
                v-if="isdesigner"
                ref="orderModule"
                :inline="true"
                :model="orderForm"
                label-position="left"
              >
                <el-row style="height: 40px">
                  <el-col :span="6">
                    <el-form-item label="患者姓名：">{{ orderForm.patientName }}</el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="模型种类：" prop="mxType">
                      {{ orderForm.mxTypeName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单种类：" prop="produceType">
                      {{ orderForm.prodRangeName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否试戴：" prop="isTest">
                      {{ orderForm.isTests }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 40px">
                  <el-col :span="6">
                    <el-form-item label="医生姓名：" prop="doctorName">
                      {{ orderForm.doctorName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="患者年龄：">
                      {{ orderForm.patientAge }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="患者性别：">
                      <div v-if="orderForm.patientSex == -1">保密</div>
                      <div v-else>{{ orderForm.patientSex == 1 ? "男" : "女" }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="代工状态：">
                      {{ orderForm.tipMessage }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 40px">
                  <el-col :span="6">
                    <el-form-item label="设计师：">
                      {{ orderForm.designer }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="颜色：">
                      {{ orderForm.color1 ? orderForm.color1 : "" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="6"></el-col>
                </el-row>
              </el-form>
              <el-form
                v-else
                ref="orderModule"
                :inline="true"
                :model="orderForm"
                label-position="left"
              >
                <el-row style="height: 35px">
                  <el-col :span="6">
                    <el-form-item label="患者姓名：">{{ orderForm.patientName }}</el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="模型种类：" prop="mxType">
                      {{ orderForm.mxTypeName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单种类：" prop="produceType">
                      {{ orderForm.prodRangeName }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="试戴：" prop="isTest">
                      {{ orderForm.isTests }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="6">
                    <el-form-item label="医生姓名：" prop="doctorName">
                      {{ orderForm.doctorName }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="颜色：">
                      {{ orderForm.color1 ? orderForm.color1 : "" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="设计师：">
                      {{ orderForm.designer }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="业务员：">
                      {{ orderForm.salesManName }}
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row style="height: 35px">
                  <el-col :span="5">
                    <el-form-item label="患者性别：">
                      <div v-if="orderForm.patientSex == -1">保密</div>
                      <div v-else>{{ orderForm.patientSex == 1 ? "男" : "女" }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="19">
                    <el-form-item
                      label="医疗机构："
                      :title="orderForm.customerName"
                      prop="produceType"
                    >
                      <span>{{ orderForm.customerName }}</span>
                      &nbsp;&nbsp;
                      <span class="ecmxq" @click="handleYljgFocus" @click.stop>详情</span>
                      <div v-if="isyljg" class="ecmxq-div" @click.stop>
                        <div v-html="orderJgcInfo.constomerInfo"></div>
                      </div>
                      &nbsp;&nbsp;
                      <span class="ecmyq" @click="handlecgyqFocus" @click.stop>常规要求</span>
                      <div v-if="iscgyq" class="ecmyq-div" @click.stop>
                        <div v-html="orderJgcInfo.require"></div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="5">
                    <el-form-item label="患者年龄：">
                      {{ orderForm.patientAge }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="19">
                    <el-form-item label="运营公司：">
                      {{ orderForm.operatinCompName }}&nbsp;
                      <span class="ecmygcs" @click="handleygFocus" @click.stop>牙冠参数</span>
                      <div v-if="isygcs" class="ecmygcs-div1" @click.stop>
                        <div v-html="orderJgcInfo.crownNote"></div>
                      </div>
                      &nbsp;&nbsp;
                      <span class="ecmzzcs" @click="handlezzFocus" @click.stop>种植参数</span>
                      <div v-if="iszzcs" class="ecmzzcs-div1" @click.stop>
                        <div v-html="orderJgcInfo.implantNote"></div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="6">
                    <el-form-item label="代工状态：">
                      {{ orderForm.substitutetipMessage }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-form-item
                      label="代工加工厂："
                      prop="client"
                      :title="orderForm.substituteFactoryName"
                    >
                      <span>{{ orderForm.substituteFactoryName?.substring(0, 12) }}</span>
                      &nbsp;&nbsp;
                      <span class="ecmxq" @click="handleJgcFocus" @click.stop>详情</span>
                      <div v-if="isjgc" class="ecmxq-div1" @click.stop>
                        <div v-html="orderJgcInfo.factoryInfo"></div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div v-else class="ecmbody-left-info3">
            <div class="ecmbody-info3-title">
              <div class="title">
                病例信息
                <span>
                  &nbsp;【{{ prodTypeName }}|{{ orderForm.prodRangeName }}|{{ orderForm.orderNo }}】
                </span>
              </div>
              <div class="img">
                <img v-if="orderForm.urgent" src="/images/jiaji.png" height="35px" title="加急" />
                &nbsp;
                <img
                  v-if="orderForm.isQuestion > 0"
                  src="/images/ddw.png"
                  height="35px"
                  :title="getQuestiong(orderForm.isQuestion)"
                />
                &nbsp;
                <img v-if="orderForm.dc == 0" src="/images/dzf.png" height="35px" title="作废" />
                &nbsp;
                <img v-if="orderForm.isPaused" src="/images/dzt.png" height="33px" title="暂停" />
              </div>
              <div v-if="orderForm.isAudit" class="ysh">已审核</div>
            </div>
            <div class="ecmbody-info3-content">
              <el-form
                v-if="isdesigner"
                ref="orderModule"
                :inline="true"
                :model="orderForm"
                label-position="left"
              >
                <el-row style="height: 40px">
                  <el-col :span="6">
                    <el-form-item label="患者姓名：">{{ orderForm.patientName }}</el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="模型种类：" prop="mxType">
                      {{ orderForm.mxTypeName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单种类：" prop="produceType">
                      {{ orderForm.prodRangeName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="是否试戴：" prop="isTest">
                      {{ orderForm.isTests }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 40px">
                  <el-col :span="6">
                    <el-form-item label="医生姓名：" prop="doctorName">
                      {{ orderForm.doctorName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="患者年龄：">
                      {{ orderForm.patientAge }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="患者性别：">
                      <div v-if="orderForm.patientSex == -1">保密</div>
                      <div v-else>{{ orderForm.patientSex == 1 ? "男" : "女" }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单状态：">
                      {{ orderForm.tipMessage }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 40px">
                  <el-col :span="6">
                    <el-form-item label="设计师：">
                      {{ orderForm.designer }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="颜色：">
                      {{ orderForm.color1 ? orderForm.color1 : "" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6"></el-col>
                  <el-col :span="6"></el-col>
                </el-row>
              </el-form>
              <el-form
                v-else
                ref="orderModule"
                :inline="true"
                :model="orderForm"
                label-position="left"
              >
                <el-row style="height: 35px">
                  <el-col :span="6">
                    <el-form-item label="患者姓名：">{{ orderForm.patientName }}</el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="模型种类：" prop="mxType">
                      {{ orderForm.mxTypeName }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="订单种类：" prop="produceType">
                      {{ orderForm.prodRangeName }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="试戴：" prop="isTest">
                      {{ orderForm.isTests }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="6">
                    <el-form-item label="医生姓名：" prop="doctorName">
                      {{ orderForm.doctorName }}
                    </el-form-item>
                  </el-col>

                  <el-col :span="6">
                    <el-form-item label="颜色：">
                      {{ orderForm.color1 ? orderForm.color1 : "" }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="设计师：">
                      {{ orderForm.designer }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="状态：">
                      {{ orderForm.tipMessage }}
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="6">
                    <el-form-item label="业务员：">
                      {{ orderForm.salesManName }}
                    </el-form-item>
                  </el-col>
                  <el-col v-if="orderForm.prodRangeName == '仅设计'" :span="18">
                    <el-form-item label="加 工 厂：&nbsp;" prop="client"></el-form-item>
                  </el-col>
                  <el-col v-else :span="18">
                    <el-form-item
                      label="加 工 厂：&nbsp;"
                      prop="client"
                      :title="orderForm.factoryNames"
                    >
                      <span>{{ orderForm.factoryNames?.substring(0, 12) }}</span>
                      &nbsp;&nbsp;
                      <span class="ecmxq" @click="handleJgcFocus" @click.stop>详情</span>
                      <div v-if="isjgc" class="ecmxq-div1" @click.stop>
                        <div v-html="orderJgcInfo.factoryInfo"></div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="5">
                    <el-form-item label="患者性别：">
                      <div v-if="orderForm.patientSex == -1">保密</div>
                      <div v-else>{{ orderForm.patientSex == 1 ? "男" : "女" }}</div>
                    </el-form-item>
                  </el-col>
                  <el-col :span="19">
                    <el-form-item
                      label="医疗机构："
                      :title="orderForm.customerName"
                      prop="produceType"
                    >
                      <span>{{ orderForm.customerName }}</span>
                      &nbsp;&nbsp;
                      <span class="ecmxq" @click="handleYljgFocus" @click.stop>详情</span>
                      <div v-if="isyljg" class="ecmxq-div" @click.stop>
                        <div v-html="orderJgcInfo.constomerInfo"></div>
                      </div>
                      &nbsp;&nbsp;
                      <span class="ecmyq" @click="handlecgyqFocus" @click.stop>常规要求</span>
                      <div v-if="iscgyq" class="ecmyq-div" @click.stop>
                        <div v-html="orderJgcInfo.require"></div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 35px">
                  <el-col :span="5">
                    <el-form-item label="患者年龄：">
                      {{ orderForm.patientAge }}
                    </el-form-item>
                  </el-col>
                  <el-col :span="19">
                    <el-form-item label="运营公司：">
                      {{ orderForm.operatinCompName }}&nbsp;
                      <span class="ecmygcs" @click="handleygFocus" @click.stop>牙冠参数</span>
                      <div v-if="isygcs" class="ecmygcs-div1" @click.stop>
                        <div v-html="orderJgcInfo.crownNote"></div>
                      </div>
                      &nbsp;&nbsp;
                      <span class="ecmzzcs" @click="handlezzFocus" @click.stop>种植参数</span>
                      <div v-if="iszzcs" class="ecmzzcs-div1" @click.stop>
                        <div v-html="orderJgcInfo.implantNote"></div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="ecmbody-left-info4">
            <div class="ecmbody-info4-top">
              <div class="ecmbody-info4-top-title">订单详情</div>
              <div class="ecmbody-info4-top-content">
                <el-table
                  :data="orderForm.makes[0].details"
                  stripe
                  style="width: auto; color: #757575"
                >
                  <el-table-column prop="date" label="牙位" width="220">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>牙位</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <div class="container">
                        <div class="container">
                          <div class="box1">{{ scope.row.teeth1A }}&nbsp;</div>
                          <div class="box2">{{ scope.row.teeth1B }}&nbsp;</div>
                          <div class="box3">{{ scope.row.teeth1C }}&nbsp;</div>
                          <div class="box4">{{ scope.row.teeth1D }}&nbsp;</div>
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
                      <span :title="scope.row.pitemName" class="nr-txt">
                        {{ scope.row.pitemName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="型号" width="90">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>型号</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <span :title="scope.row.ptypeName" class="nr-txt">
                        {{ scope.row.ptypeName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="数量" align="center" width="80">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>数量</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <span :title="scope.row.amount" class="nr-txt">
                        {{ scope.row.amount }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column width="110" align="center" label="制作类型">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>制作类型</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <span :title="scope.row.memo3" class="nr-txt">
                        {{ scope.row.prodTypeName }}
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
            <div v-if="orderForm.prodTypeId == 1" class="ecmbody-info4-top">
              <div class="ecmbody-info4-top-title">医生要求</div>
              <div class="ecmbody-info4-top-content">
                <el-row>
                  <el-col :span="24" class="ecmbody-info3-content-1">
                    <el-input
                      v-model="orderForm.doctorRequire"
                      type="textarea"
                      :rows="2"
                      :disabled="true"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="orderForm.prodTypeId == 3" class="ecmbody-info4-top">
              <div class="ecmbody-info4-top-title">试回说明</div>
              <div class="ecmbody-info4-top-content">
                <el-row>
                  <el-col :span="24" class="ecmbody-info3-content-1">
                    <el-input
                      v-model="orderForm.testBackDescribe"
                      type="textarea"
                      :rows="2"
                      :disabled="true"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div
              v-if="orderForm.prodTypeId == 2 || orderForm.prodTypeId == 4"
              class="ecmbody-info4-top"
            >
              <div class="ecmbody-info4-top-title">返工原因</div>
              <div class="ecmbody-info4-top-content">
                <el-row>
                  <el-col :span="24" class="ecmbody-info3-content-1">
                    <el-input
                      v-model="orderForm.reworkReason"
                      type="textarea"
                      :rows="2"
                      :disabled="true"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="orderForm.isFanGong || orderForm.isShiHui" class="ecmbody-info5-top">
              <div
                v-if="orderForm.isFanGong && isFg"
                class="ecmbody-info5-top-btn"
                @click="toFanGong"
              >
                发起返工
              </div>
              <div
                v-if="orderForm.isShiHui && isSh"
                class="ecmbody-info5-top-btn1"
                @click="toShiHui"
              >
                试回
              </div>
            </div>
          </div>
        </div>

        <div v-else class="ecmbody-left-content">
          <div class="ecmbody-left-info1">
            <div class="ecmbody-info3-title">
              <div class="title">
                病例信息
                <span>
                  &nbsp;【{{ prodTypeName }}|{{ orderForm.prodRangeName }}|{{ orderForm.orderNo }}】
                </span>
              </div>
              <div class="img">
                <img v-if="orderForm.urgent" src="/images/jiaji.png" height="35px" title="加急" />
                &nbsp;
                <img
                  v-if="orderForm.isQuestion > 0"
                  src="/images/ddw.png"
                  height="35px"
                  :title="getQuestiong(orderForm.isQuestion)"
                />
                &nbsp;
                <img v-if="orderForm.dc == 0" src="/images/dzf.png" height="35px" title="作废" />
                &nbsp;
                <img v-if="orderForm.isPaused" src="/images/dzt.png" height="33px" title="暂停" />
              </div>
              <div v-if="orderForm.isAudit" class="ysh">已审核</div>
            </div>
            <div class="ecmbody-info3-content">
              <el-form
                ref="orderModule"
                :inline="true"
                :model="orderForm"
                :rules="rules"
                label-position="left"
                class="ecmbody-info-eldialog"
              >
                <el-row style="height: 50px">
                  <el-col :span="8">
                    <el-form-item label="患者姓名" prop="patientName">
                      <el-input
                        v-model="orderForm.patientName"
                        style="width: 119px; font-size: 14px; font-family: Noto Sans SC"
                        placeholder="患者姓名"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="模型种类" prop="mxType">
                      <el-select
                        v-model="orderForm.mxType"
                        style="width: 119px"
                        placeholder="请选择模型种类"
                      >
                        <el-option
                          v-for="(it, index) in orderMx"
                          :key="index"
                          :label="it.label"
                          :value="it.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="订单种类" prop="prodRange">
                      <el-select v-model="orderForm.prodRange" placeholder="请选择订单种类">
                        <el-option
                          v-for="(it, index) in orderSc"
                          :key="index"
                          :label="it.label"
                          :value="it.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 50px">
                  <el-col :span="8">
                    <el-form-item label="医生姓名" prop="doctorName">
                      <el-select
                        v-model="orderForm.doctorName"
                        style="width: 119px"
                        size="small"
                        placeholder="请选择医生姓名"
                        @change="handleYiShengChange"
                      >
                        <el-option
                          v-for="(it, index) in doctors"
                          :key="index"
                          :label="it.label"
                          :value="{
                            value: it.value,
                            label: it.label,
                            doctorRequire: it.doctorRequire,
                          }"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item label="是否试戴" prop="isTest">
                      <el-select
                        v-model="orderForm.isTest"
                        style="width: 119px"
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
                  <el-col :span="8">
                    <el-form-item
                      label="&nbsp;&nbsp;&nbsp;颜 &nbsp;&nbsp;&nbsp;&nbsp;色&nbsp;&nbsp;&nbsp;&nbsp;"
                    >
                      <el-select
                        ref="selectColorsRef"
                        v-model="orderForm.color1"
                        filterable
                        remote
                        allow-create
                        reserve-keyword
                        clearable
                        placeholder="颜色"
                        style="width: 108px; height: 0px; overflow: hidden"
                        @blur="handleSelectBlur('selectColorsRef')"
                      >
                        <el-option
                          v-for="item in options"
                          :key="item.id"
                          :label="item.name"
                          :value="item.code"
                        />
                      </el-select>
                      <div class="yanse">
                        <div class="select-input" @click.stop="handleForceColorShowSelect">
                          <input
                            v-model="orderForm.color1"
                            placeholder="选颜色"
                            class="input-inner"
                            @blur="handleColorInput(orderForm.color1, orderForm)"
                            @focus="handleFocus(orderForm)"
                          />
                          <button
                            v-if="orderForm.color1 && orderForm.XhModelIsOpen"
                            class="clear-btn"
                            @click="clearModelColorValue(orderForm)"
                          >
                            <el-icon size="14px"><CircleClose /></el-icon>
                          </button>
                          <span class="arrow" :class="{ rotate: orderForm.XhModelIsOpen }">
                            <el-icon><ArrowDown /></el-icon>
                          </span>
                        </div>
                      </div>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 50px">
                  <el-col :span="12">
                    <el-form-item label="医疗机构" prop="institution">
                      <el-select
                        v-model="orderForm.institution"
                        style="width: 252px"
                        placeholder="医疗机构"
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
                  <el-col :span="6">
                    <el-form-item label="&nbsp;&nbsp;&nbsp;患者年龄">
                      <el-input
                        v-model="orderForm.patientAge"
                        maxlength="2"
                        style="font-size: 14px; font-family: Noto Sans SC"
                        placeholder="年龄"
                        @input="numValid(orderForm.patientAge)"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="&nbsp;&nbsp;&nbsp;患者性别">
                      <el-select
                        v-model="orderForm.patientSex"
                        style="width: 119px"
                        placeholder="患者性别"
                      >
                        <el-option :value="1" label="男" />
                        <el-option :value="0" label="女" />
                        <el-option :value="-1" label="保密" />
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row style="height: 50px">
                  <el-col :span="12">
                    <el-form-item label="&nbsp;&nbsp;&nbsp;加工厂：">
                      <span
                        v-if="orderForm.prodRangeName == '仅设计'"
                        style="font-size: 17px"
                      ></span>
                      <span v-else style="font-size: 17px">{{ orderForm.factoryNames }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="状态：">
                      <span style="font-size: 17px">{{ orderForm.tipMessage }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="&nbsp;&nbsp;&nbsp;设计师：">
                      <span style="font-size: 17px">{{ orderForm.designer }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
            </div>
          </div>
          <div class="ecmbody-left-info2">
            <div class="ecmbody-info4-top">
              <div class="ecmbody-info4-top-title">订单详情</div>
              <div class="ecmbody-info4-top-content">
                <el-table
                  ref="detailTableRef"
                  :data="orderForm.makes[0].details"
                  style="width: 100%; flex: 1"
                  stripe
                  :loading="loading"
                >
                  <el-table-column prop="date" label="牙位" width="220">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>牙位</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <div class="container">
                        <div class="container">
                          <div class="box1">{{ scope.row.teeth1A }}&nbsp;</div>
                          <div class="box2">{{ scope.row.teeth1B }}&nbsp;</div>
                          <div class="box3">{{ scope.row.teeth1C }}&nbsp;</div>
                          <div class="box4">{{ scope.row.teeth1D }}&nbsp;</div>
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
                      <span :title="scope.row.pitemName" class="nr-txt">
                        {{ scope.row.pitemName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="型号" width="90">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>型号</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <span :title="scope.row.ptypeName" class="nr-txt">
                        {{ scope.row.ptypeName }}
                      </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="amount" width="110">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>制作类型</span>
                      </div>
                    </template>
                    <template #default="scope">
                      <span :title="prodTypeName" class="nr-txt">
                        {{ prodTypeName }}
                      </span>
                      <!-- <el-select v-model="scope.row.prodTypeName" size="small">
                        <el-option
                          v-for="item in scope.row.makeOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="{ label: item.name, value: item.id }"
                        />
                      </el-select> -->
                    </template>
                  </el-table-column>
                  <el-table-column prop="memo3" width="90">
                    <template #header>
                      <div class="ecmbody-left-content3-title">
                        <div class="ecmbody-left-content3-title-1">|</div>
                        <span>操作</span>
                      </div>
                    </template>
                    <template #default="scope" style="text-align: center">
                      &nbsp;&nbsp;
                      <img
                        src="@/assets/images/bjxx.png"
                        title="编辑"
                        style="cursor: pointer; height: 18px"
                        @click="upOrder(scope.row)"
                      />
                      <!-- &nbsp;
                      <img
                        src="@/assets/images/fz.png"
                        title="复制"
                        style="cursor: pointer"
                        @click="copyOrder(scope.row)"
                      /> -->
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
            <div v-if="orderForm.prodTypeId == 1" class="ecmbody-info4-top">
              <div class="ecmbody-info4-top-title">医生要求</div>
              <div class="ecmbody-info4-top-content">
                <el-row>
                  <el-col :span="24" class="ecmbody-info3-content-1">
                    <el-input
                      v-model="orderForm.doctorRequire"
                      type="textarea"
                      size="small"
                      style="font-size: 14px"
                      :rows="2"
                    />
                  </el-col>
                </el-row>
              </div>
            </div>
            <div v-if="orderForm.prodTypeId == 3" class="ecmbody-info4-top">
              <div class="ecmbody-info4-top-title">试回说明</div>
              <div class="ecmbody-info4-top-content">
                <el-row>
                  <el-col :span="24" class="ecmbody-info3-content-1">
                    <el-input
                      v-model="orderForm.testBackDescribe"
                      type="textarea"
                      :rows="2"
                    ></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
            <div
              v-if="orderForm.prodTypeId == 2 || orderForm.prodTypeId == 4"
              class="ecmbody-info4-top"
            >
              <div class="ecmbody-info4-top-title">返工原因</div>
              <div class="ecmbody-info4-top-content">
                <el-row>
                  <el-col :span="24" class="ecmbody-info3-content-1">
                    <el-input v-model="orderForm.reworkReason" type="textarea" :rows="2"></el-input>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="ecmbody-right">
        <Mess :key="i" @setIndex="setIndex" @featchMyNotice="featchMyNotice" />
      </div>
    </div>
    <div class="ecmbody-zhanwei"></div>
    <el-dialog
      v-model="visible"
      draggable
      :align-center="true"
      title="创建返工订单"
      :close-on-click-modal="false"
      width="580"
      :before-close="handleClose"
    >
      <template #default>
        <el-form
          ref="reffangong"
          :model="fanGongForm"
          class="ecmbody-info-content-form"
          label-width="95px"
          label-position="left"
        >
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="返工原因：">
                <img src="/images/fgyy.png" height="25px" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="fanGongForm.reworkReason"
                  type="textarea"
                  size="small"
                  class="ecm-input"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="返工截图：">
                <el-upload
                  v-model="reworkUrls"
                  :http-request="reworkUpload"
                  class="upload-demo"
                  :show-file-list="false"
                  multiple
                  list-type="picture-card"
                >
                  <img src="@/assets/images/upimg.png" width="50px" />
                </el-upload>

                <div v-for="(item, index) in reworkUrls" :key="index" class="upfiles">
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
                    @click="handleRemove(item.name, 5)"
                  >
                    <img src="@/assets/images/del.png" />
                  </span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="是否试戴：">
                <el-select
                  v-model="fanGongForm.isTest"
                  style="width: 375px"
                  placeholder="请选择是否试戴"
                  size="default"
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
          <el-row :gutter="10" style="width: 100%; height: 20px">
            <el-col :span="24"><div style="border-bottom: 0.5px solid #dcdfe6"></div></el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="CBCT：" prop="cbctfileUrls">
                <el-upload
                  v-model="cbctfileUrls"
                  :http-request="handleUpload"
                  class="upload-demo"
                  :show-file-list="false"
                  multiple
                >
                  <!-- 上传文件按钮 -->
                  <el-button type="primary">
                    <img src="/images/up.png" height="13px" />
                    &nbsp;上传
                  </el-button>
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
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="口扫数据：" prop="mouthfileUrls">
                <el-upload
                  v-model="mouthfileUrls"
                  :http-request="handleUploads"
                  class="upload-demo"
                  :show-file-list="false"
                  multiple
                >
                  <!-- 上传文件按钮 -->
                  <el-button type="primary">
                    <img src="/images/up.png" height="13px" />
                    &nbsp;上传
                  </el-button>
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
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="比色照：" prop="colorpicUrls">
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
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="制作照：" prop="makepicUrls">
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
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="ok">提交返工</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="shvisible"
      draggable
      :align-center="true"
      title="创建试回订单"
      :close-on-click-modal="false"
      width="580"
      :before-close="handleClose"
    >
      <template #default>
        <el-form
          ref="refshihui"
          :model="shiHuiForm"
          class="ecmbody-info-content-form"
          label-width="95px"
          label-position="left"
        >
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="试回说明：">
                <img src="/images/fgyy.png" height="25px" />
              </el-form-item>
              <el-form-item>
                <el-input
                  v-model="shiHuiForm.testDescription"
                  type="textarea"
                  size="small"
                  class="ecm-input"
                  :rows="3"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="下一步：">
                <el-radio-group v-model="shiHuiForm.testType">
                  <el-radio value="0">制作成品</el-radio>
                  <el-radio value="1">继续试戴</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%; height: 20px">
            <el-col :span="24"><div style="border-bottom: 0.5px solid #dcdfe6"></div></el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="CBCT：" prop="cbctfileUrls">
                <el-upload
                  v-model="cbctfileUrls"
                  :http-request="handleUpload"
                  class="upload-demo"
                  :show-file-list="false"
                  multiple
                >
                  <!-- 上传文件按钮 -->
                  <el-button type="primary">
                    <img src="/images/up.png" height="13px" />
                    &nbsp;上传
                  </el-button>
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
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="口扫数据：" prop="mouthfileUrls">
                <el-upload
                  v-model="mouthfileUrls"
                  :http-request="handleUploads"
                  class="upload-demo"
                  :show-file-list="false"
                  multiple
                >
                  <!-- 上传文件按钮 -->
                  <el-button type="primary">
                    <img src="/images/up.png" height="13px" />
                    &nbsp;上传
                  </el-button>
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
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="比色照：" prop="colorpicUrls">
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
            </el-col>
          </el-row>
          <el-row :gutter="10" style="width: 100%">
            <el-col :span="24">
              <el-form-item label="制作照：" prop="makepicUrls">
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
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="okshihui">提交试回</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="upVisible"
      draggable
      title=""
      :show-close="false"
      :close-on-click-modal="false"
      width="1250px"
      :before-close="handleClose"
    >
      <div ref="targetDiv">
        <ToothPosition
          :key="classKey"
          ref="childRef"
          :isLongMa="isLongMa"
          :classList="classList"
          :isClassValue="isClassValue"
          :factoryId="pitemFactoryId"
          :classNoList="classNoList"
          :toothValue="orderToothForm"
          :options="options"
          :colorData="colorData"
          :orderMl="orderMl"
          :isMenuDisplay="isMenuDisplay"
          @setToothValue="setToothValue"
          @setClassValue="setClassValue"
          @setClassClose="setClassClose"
          @setColorValue="setColorValue"
          @setNoClass="setNoClass"
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
  name: "details",
  inheritAttrs: true
});
import OrdersAPI from "@/api/orders";
import OrderAPI from "@/api/order";
import ProductAPI from "@/api/basic/product";
import DictAPI from "@/api/system/dict";
import { setMessData, getMessData, setPcPatientName } from "@/utils/auth";
import ColorAPI from "@/api/basic/color";
import { useUserStore } from "@/store/modules/user";
import { useChatStore } from "@/store";
import ClassAPI from "@/api/dentalProductItemClassify";
import router from "@/router";
import FileAPI from "@/api/file";
const orderModule = ref();
const chatStore = useChatStore();
const route = useRoute();
const isLongMa = ref(false);
const isdgcwt = ref(false);
const classKey = ref(1);
const isClassValue = ref(1);
const pitemFactoryId = ref(0);
const orderToothForm = ref([]);
const colorData = reactive({
  Color1: "",
  Color2: "",
  Color3: ""
});
const orderMl = ref([]);
const classList = ref([]);
const classNoList = ref([]);
const orderToohs = reactive({});
const classAllList = ref([]);
const orderoldForm = ref([
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
const loading = ref(false);
const loadings = ref(false);
const isDisplay = ref(true);
const isUpdate = ref(false);
const visible = ref(false);
const upVisible = ref(false);
const shvisible = ref(false);
const isdesigner = ref(false);
const isjgc = ref(false);
const isyljg = ref(false);
const isFg = ref(false);
const isSh = ref(false);
const iscgyq = ref(false);
const iszzcs = ref(false);
const isygcs = ref(false);
const makeId = ref(0);
const orderId = ref(0);
const isBool = ref(false);
const oneClass = ref(0);
const messClass = ref();
const orderState = ref(0);
const selectRefs = ref({});
const user = useUserStore().userInfo;
const usercode = user.members.orgRoleCodes;
if (!usercode.includes("10012")) {
  isFg.value = true;
}
if (!usercode.includes("10012") && !usercode.includes("10040") && !usercode.includes("10041")) {
  isSh.value = true;
}
const i = ref(0);
const options = ref([]);
const dataTime = ref("");
const reworkUrls = ref([]);
const colorpicUrls = ref([]);
const makepicUrls = ref([]);
const cbctfileUrls = ref([]);
const mouthfileUrls = ref([]);
const isMenuDisplay = ref(false);
const childRef = ref(null);
const targetDiv = ref(null);
const isAdmin = ref(false);
const fileUpCount = ref(0);
const fileOkUpCount = ref(0);
const rules = reactive({
  mxType: [{ required: true, message: "请选择模型种类", trigger: "blur" }],
  institution: [{ required: true, message: "请选择医疗机构", trigger: "blur" }],
  prodRange: [{ required: true, message: "请选择订单种类", trigger: "blur" }],
  client: [{ required: true, message: "请选择加工厂", trigger: "blur" }],
  doctorName: [{ required: true, message: "请输入医生姓名", trigger: "blur" }],
  patientName: [{ required: true, message: "请输入患者姓名", trigger: "blur" }],
  isTest: [{ required: true, message: "请选择是否试戴", trigger: "blur" }]
});
const id = ref(route.query.id);
const colorParams = reactive({
  pageIndex: 1,
  pageSize: 100
});
const orderXh = reactive([]);
const orderForm = reactive({
  autoOrderNo: true,
  makes: [
    {
      orderId: 0,
      barcode: "",
      details: []
    }
  ],
  tipMessage: "",
  isTests: "",
  substitutetipMessage: "",
  substituteFactoryName: ""
});
const orderNewForm = ref([
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
const queryParams = reactive({
  orderId: id.value ? parseInt(id.value) : 0
});
const productParams = reactive({
  pageIndex: 1,
  pageSize: 50,
  factoryId: 0,
  classifyId: 0
});
const ToothParams = reactive({
  tooths: []
});
const organParams = reactive({
  OrgId: user.members.orgId
});
const doctors = ref([]);
const timer = ref(null);
const orderRadio = ref([]);
const prodTypeName = ref("");
const fanGongForm = ref({
  reworkReason: "",
  doctorRequire: "",
  isTest: "",
  testId: 0,
  testDesc: ""
});
const shiHuiForm = ref({
  testDescription: "",
  testType: "0"
});
const ToothsParams = reactive({
  orderId: 0,
  creationTime: null,
  factoryId: 0,
  customerId: 0,
  patientName: "",
  details: []
});
const orderMx = reactive([]);
const orderSc = reactive([]);
let orderWt = ref([]);
const selectColorsRef = ref();
const orderSd = reactive([]);
const oldTooths = ref([]);
const oldisClassValue = ref(0);
const oldclassList = ref([]);
const messData = getMessData();
const doctorParams = reactive({
  orgId: user.members.orgId,
  orgRoleCodes: user.members.orgRoleCodes.join(",")
});
const orderFanGongFormInfo = reactive({
  oldId: id.value ? parseInt(id.value) : 0,
  attachFile: [],
  reworkReason: ""
});
const orderShiHuiFormInfo = reactive({
  oldId: id.value ? parseInt(id.value) : 0,
  attachFile: [],
  testType: "",
  testDescription: ""
});
const orderJgcInfo = reactive({
  constomerInfo: "",
  factoryInfo: "",
  require: "",
  crownNote: "",
  implantNote: ""
});
const orderFileInfo = reactive({
  files: []
});
const orderTipsParams = reactive({
  orderId: id.value ? parseInt(id.value) : 0
});
const orderFilesInfo = reactive({
  type: 0,
  url: "",
  fileId: 0,
  fileName: ""
});
const processParams = reactive({
  OrgId: user.members.orgId
});
const queryParames = reactive({
  pageIndex: 1,
  pageSize: 50,
  visible: true,
  isRelation: true,
  pitemFactoryId: 0
});
if (messData) {
  const data = JSON.parse(messData);
  oneClass.value = data.oneClass;
  orderId.value = data.orderId;
  makeId.value = data.makeId;
  messClass.value = data.messClass;
}
function handleQuery() {
  loading.value = true;
  OrdersAPI.getOrder(queryParams).then((data) => {
    chatStore.orderInfo = data;
    chatStore.roomId = data.chatRoomId;
    Object.assign(orderForm, data);
    if (data.makes[0].factoryId != 0) {
      orderForm.factoryNames = data.makes[0].factoryName;
    } else {
      orderForm.factoryNames = orderForm.factoryName;
    }
    if (data.makes[0].substituteFactoryId != 0) {
      orderForm.substituteFactoryName = data.makes[0].factoryName;
      isdgcwt.value = true;
    } else {
      orderForm.substituteFactoryName = "";
      isdgcwt.value = false;
    }
    orderState.value = data.makes[0].state.state;
    orderForm.tipMessage = data.makes[0].state.tipMessage;
    orderForm.substitutetipMessage = data.makes[0].state.tipMessage;
    prodTypeName.value = [
      ...new Set(data.makes[0].details.map((item) => item.prodTypeName))
    ].join(",");
    orderForm.isTests = data.makes[0].details[0].testDesc;
    orderForm.isTest = data.makes[0].details[0].testId;
    orderForm.isPaused = data.makes[0].pauseState.isPaused;
    setPcPatientName(orderForm.patientName);
    const date = /* @__PURE__ */ new Date();
    dataTime.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const orgCode = user.members.orgRoleCodes.toString();
    if (orgCode.indexOf("1003") > -1) {
      isDisplay.value = true;
      isUpdate.value = true;
    }
    if (orgCode.indexOf("10010") > -1 || orgCode.indexOf("10011") > -1) {
      isAdmin.value = true;
    }
    if (data.isAudit == false) {
      settimer();
    }
    orderForm.makes[0].details.forEach((a) => {
      a.XhModel = a.ptypeName;
      a.XhModelIsOpen = false;
    });
  }).finally(() => {
    loading.value = false;
  });
}
function onUpdate() {
  initColorChange();
  getOrganDatas("init");
  initXhChange();
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
    orderForm.mxType = orderForm.mxType?.toString();
    Object.assign(orderSc, scarr.length > 0 ? scarr[0].dictDataList : []);
    orderForm.prodRange = orderForm.prodRange?.toString();
    Object.assign(orderSd, sdarr.length > 0 ? sdarr[0].dictDataList : []);
    orderForm.prodRange = orderForm.prodRange?.toString();
    orderForm.isTest = { label: orderForm.isTests, value: orderForm.isTest };
  });
  orderForm.client = { label: orderForm.factoryName, value: orderForm.factoryId };
  orderForm.institution = { label: orderForm.customerName, value: orderForm.customerId };
  orderForm.doctorName = { label: orderForm.doctorName, value: orderForm.doctorId };
  handleInstitutionChange(orderForm.institution, "init");
  isDisplay.value = false;
  isUpdate.value = false;
  isAdmin.value = false;
}
function getOrganDatas(type) {
  if (type == "init") {
    OrderAPI.getOrganData(organParams).then((data) => {
      orderRadio.value = data;
    });
  }
}
function initXhChange() {
  orderForm.makes[0].details.forEach((a) => {
    productParams.keywords = a.pitemName;
    a.XhModel = a.ptypeName;
    a.XhModelIsOpen = false;
    productParams.factoryId = orderForm.pitemFactoryId;
    pitemFactoryId.value = orderForm.pitemFactoryId;
  });
}
function handleInstitutionChange(val, type) {
  doctorParams.orgId = val.value;
  if (type == "init") {
    OrderAPI.getDoctorData(doctorParams).then((data) => {
      doctors.value = data;
    });
  } else {
    OrderAPI.getDoctorData(doctorParams).then((data) => {
      if (data.length > 0) {
        doctors.value = data;
        if (data.length == 1) {
          doctors.value = [{ label: data[0].label, value: data[0].value }];
          orderForm.doctorName = { label: data[0].label, value: data[0].value };
          orderForm.doctorRequire = data[0].doctorRequire;
        }
      }
    });
    orderForm.doctorName = "";
    orderForm.client = "";
  }
  getProcessingData(val.value);
}
function getProcessingData(val) {
  processParams.OrgId = val;
  OrderAPI.getProcessingData(processParams).then((data) => {
    let arr = Array.from(data);
    orderWt.value = [...arr];
  });
}
function initColorChange() {
  ColorAPI.getPage(colorParams).then((data) => {
    data.list.forEach((a) => {
      a.label = a.name;
      a.value = a.code;
    });
    options.value = data.list;
  });
}
function handleSearch(query, item) {
  if (query) {
    loadings.value = true;
    setTimeout(() => {
      productParams.keywords = query;
      productParams.factoryId = orderForm.pitemFactoryId;
      pitemFactoryId.value = orderForm.pitemFactoryId;
      ProductAPI.getItemProductPage(productParams).then((data) => {
        if (data.length > 0) {
          item.xmOptions = data;
          Object.assign(orderXh, data);
        } else {
          item.xmOptions = [];
        }
      });
      loadings.value = false;
    }, 1e3);
  }
}
function onUpProductChange(val, item) {
  item.pitemId = val.value;
  if (item.ptypeName != void 0 && item.ptypeName != "") {
    const xh = val.children.filter((a) => a.label == item.ptypeName);
    if (xh.length == 0) {
      item.ptypeName = "";
      item.ptypeId = 0;
    } else {
      item.ptypeId = xh[0].value;
    }
  }
  let newarr = orderXh.filter((a) => a.label == val.label);
  if (newarr.length > 0) {
    if (newarr[0].children.length > 0) {
      item.xhOptions = newarr[0].children;
    } else {
      item.xhOptions = [];
    }
  }
}
function onUpModelChange(val, item) {
  const xh = val.label;
  item.XhModel = xh;
}
function onInput(v, item, i2) {
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
  switch (i2) {
    case 1:
      const A = item.teeth1A;
      setTeeth(i2, A, item);
      break;
    case 2:
      const B = item.teeth1B;
      setTeeth(i2, B, item);
      break;
    case 3:
      const C = item.teeth1C;
      setTeeth(i2, C, item);
      break;
    case 4:
      const D = item.teeth1D;
      setTeeth(i2, D, item);
      break;
  }
  CalculateAllTooth(item, 1);
}
function setTeeth(i2, v, item) {
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
  switch (i2) {
    case 1:
      let A = newarr.sort().reverse();
      item.teeth1A = A.join("");
      break;
    case 2:
      let B = newarr.sort();
      item.teeth1B = B.join("");
      break;
    case 3:
      let C = newarr.sort().reverse();
      item.teeth1C = C.join("");
      break;
    case 4:
      let D = newarr.sort();
      item.teeth1D = D.join("");
      break;
  }
}
async function CalculateAllTooth(item, type) {
  let orderTookMode = [];
  ToothsParams.orderId = 0;
  ToothsParams.factoryId = orderForm.factoryId;
  if (type == 1) {
    ToothsParams.customerId = parseInt(orderForm.institution?.value);
  } else {
    ToothsParams.customerId = parseInt(orderForm.customerId);
  }
  ToothsParams.patientName = orderForm.patientName;
  ToothsParams.creationTime = (/* @__PURE__ */ new Date()).toLocaleString();
  ToothsParams.details = [];
  let desc1 = "";
  if (item.teeth1A) {
    desc1 += "A" + item.teeth1A;
  }
  if (item.teeth1B) {
    desc1 += "B" + item.teeth1B;
  }
  if (item.teeth1C) {
    desc1 += "C" + item.teeth1C;
  }
  if (item.teeth1D) {
    desc1 += "D" + item.teeth1D;
  }
  orderTookMode.push({ id: item.id, mode: item.pItemAmountMode, teethValue: desc1 });
  ToothsParams.details.push({
    id: item.id,
    pItemId: item.pitemId != "" ? item.pitemId : 0,
    teethValue: desc1
  });
  ToothParams.tooths = orderTookMode;
  const [result, result1] = await Promise.all([
    OrderAPI.CalculateTooth(ToothParams),
    OrderAPI.checkRepeatTooth(ToothsParams)
  ]);
  const newTooth = result.filter((b) => item.id == b.id);
  if (newTooth.length > 0) {
    item.amount = newTooth[0].mode;
  }
  const newZzTooth = result1.filter((b) => item.id == b.id);
  if (newZzTooth.length > 0) {
    item.makeOptions = newZzTooth[0].prodTypes;
    if (newZzTooth[0].prodTypes.length > 0) {
      let xz = newZzTooth[0].prodTypes.filter((a) => {
        return a.id == item.prodTypeId;
      });
      if (xz.length > 0) {
        item.prodTypeName = { label: xz[0].name, value: xz[0].id };
      } else {
        item.prodTypeName = { label: item.makeOptions[0].name, value: item.makeOptions[0].id };
      }
    }
  }
}
function numValid(inputContent) {
  var reg = /^(1|([1-9]\d{0,1})|99)$/;
  if (reg.test(inputContent) == false) {
    ElNotification({
      title: "Error",
      message: "年龄只能是数字!",
      type: "error",
      duration: 3e3
    });
    orderForm.patientAge = "";
    return false;
  } else {
    orderForm.patientAge = inputContent;
  }
}
function handleSelectBlur(v) {
  if (v == "selectColorsRef") {
    const selectDom = selectColorsRef.value.$el;
    const inputDom = selectDom.querySelector(".el-select__input");
    if (inputDom) {
      const label = inputDom.value.trim();
      if (label != "") {
        orderForm.color1 = label;
      }
    }
  }
}
function SubmitOrder() {
  orderModule.value.validate((valid) => {
    if (valid) {
      const loadingInstance = ElLoading.service({ fullscreen: true, text: "订单保存中..." });
      if (orderForm.client) {
        orderForm.factoryId = orderForm.client.value;
        orderForm.factoryName = orderForm.client.label;
      }
      if (orderForm.doctorName) {
        orderForm.doctorId = orderForm.doctorName.value;
        orderForm.doctorName = orderForm.doctorName.label;
      }
      if (orderForm.institution) {
        orderForm.customerId = orderForm.institution.value;
        orderForm.customerName = orderForm.institution.label;
      }
      orderForm.patientAge = orderForm.patientAge > 0 ? parseInt(orderForm.patientAge) : 0;
      orderForm.makes[0].details.forEach((item) => {
        if (item.id.toString().length < 10) {
          item.id = 0;
        }
        let Desc = "";
        if (item.teeth1A) {
          Desc += "A" + item.teeth1A;
        }
        if (item.teeth1B) {
          Desc += "B" + item.teeth1B;
        }
        if (item.teeth1C) {
          Desc += "C" + item.teeth1C;
        }
        if (item.teeth1D) {
          Desc += "D" + item.teeth1D;
        }
        if (typeof item.ptypeName !== "string") {
          item.ptypeId = parseInt(item.ptypeName?.value);
          item.ptypeName = item.ptypeName?.label;
        }
        if (typeof item.prodTypeName !== "string") {
          item.prodTypeId = parseInt(item.prodTypeName?.value);
          item.prodTypeName = item.prodTypeName?.label;
        }
        if (orderForm.isTest) {
          item.testId = orderForm.isTest.value;
          item.testDesc = orderForm.isTest.label;
        }
        item.teeth1Desc = Desc;
      });
      orderForm.isTest = orderForm.isTest.value;
      OrderAPI.saveOrder(orderForm).then((data) => {
        if (data.orderId) {
          ElNotification({
            title: "Success",
            message: "保存成功!",
            type: "success",
            duration: 3e3
          });
          loadingInstance.close();
          window.location.reload();
        }
      }).finally(() => {
        loadingInstance.close();
        onUpdate();
      });
    }
  });
}
function Cancel() {
  OrdersAPI.getOrder(queryParams).then((data) => {
    Object.assign(orderForm, data);
    orderState.value = data.makes[0].state.state;
    orderForm.tipMessage = data.makes[0].state.tipMessage;
    orderForm.isTests = data.makes[0].details[0].testDesc;
    orderForm.isTest = data.makes[0].details[0].testId;
    let toth = JSON.parse(data.toohs);
    isLongMa.value = toth.isLongMa != void 0 ? toth.isLongMa : false;
    classList.value = toth.classList;
    isClassValue.value = toth.isClassValue;
    classNoList.value = toth.classNoList;
    orderToothForm.value = toth.tooth;
    const date = /* @__PURE__ */ new Date();
    dataTime.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
  }).finally(() => {
    loading.value = false;
  });
  isDisplay.value = true;
  isUpdate.value = true;
}
function setIndex(index) {
  oneClass.value = index;
  isBool.value = true;
  setMessDatas();
}
async function refresh() {
  var rs = await handleQuery();
  ElNotification({
    title: "Success",
    message: "页面刷新成功!",
    type: "success"
  });
}
function handleYiShengChange(val) {
  orderForm.doctorRequire = val.doctorRequire;
}
function setMessDatas() {
  const data = {
    oneClass: oneClass.value,
    isBool: isBool.value,
    makeId: makeId.value,
    orderId: orderId.value,
    messClass: messClass.value
  };
  const jsondata = JSON.stringify(data);
  setMessData(jsondata);
}
function to() {
  const _url = "/orders";
  const url = {
    path: _url
  };
  router.push(url).catch(() => {
    window.location.reload();
  });
}
function copyOrder(row) {
  let newInfo = Object.assign({}, row);
  const number = Math.floor(Math.random() * 9e5) + 1e5;
  newInfo.id = row.id + number;
  orderForm.makes[0].details.push(newInfo);
}
function upOrder(row) {
  isMenuDisplay.value = false;
  getClass(row);
}
function getClass(row) {
  queryParames.pitemFactoryId = orderForm.pitemFactoryId;
  ClassAPI.getList(queryParames).then((data) => {
    classList.value = [];
    classNoList.value = [];
    if (data.length > 0) {
      data.forEach((a) => {
        a.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
      });
      classNoList.value = [...data];
      classAllList.value = data;
      getToohs(row);
    }
  });
}
async function getToohs(row) {
  let tooharr = [];
  let newclass = [];
  let index = 0;
  let neworder = groupByField(orderForm.makes[0].details, "tabIndex");
  const asyncTaskList = [];
  Object.keys(neworder).forEach(async (tabIndex) => {
    const singleAsyncTask = async () => {
      const details = neworder[tabIndex];
      const class1 = classAllList.value.filter((a) => a.value == details[0].pitemClassTabId);
      let objclass = JSON.parse(JSON.stringify(class1));
      let tooh = {
        name: "",
        value: {}
      };
      objclass[0].ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
      tooh.name = objclass[0].ids;
      let v = {
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
        teethMode: 10,
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
        teethWgMode: 0,
        lx: "default",
        orderNameProduct: "",
        amountMode: 0
      };
      if (class1.length > 0) {
        for (const item of details) {
          if (item.pitemType == 0) {
            v.orderNameProduct = item.pitemName;
            v.productItemClassifyId = item.pitemClassId;
            v.orderProductName = item.pitemName;
            v.orderProduct = item.pitemId;
            if (item.teeth1A != "") {
              let A1 = generateSequence(item.teeth1A);
              if (v.A.length > 0) {
                v.A = Array.from(new Set(v.A.concat(A1))).sort().reverse();
              } else {
                v.A = [...A1];
              }
            }
            if (item.teeth1B != "") {
              let B1 = generateSequence(item.teeth1B);
              if (v.B.length > 0) {
                v.B = Array.from(new Set(v.B.concat(B1))).sort();
              } else {
                v.B = [...B1];
              }
            }
            if (item.teeth1C != "") {
              let C1 = generateSequence(item.teeth1C);
              if (v.C.length > 0) {
                v.C = Array.from(new Set(v.C.concat(C1))).sort().reverse();
              } else {
                v.C = [...C1];
              }
            }
            if (item.teeth1D != "") {
              let D1 = generateSequence(item.teeth1D);
              if (v.D.length > 0) {
                v.D = Array.from(new Set(v.D.concat(D1))).sort();
              } else {
                v.D = [...D1];
              }
            }
            productParams.keywords = "";
            productParams.classifyId = item.pitemClassId;
            productParams.factoryId = orderForm.pitemFactoryId;
            const [result, result1] = await Promise.all([
              ProductAPI.getItemProductPage(productParams),
              ColorAPI.getProductData(item.pitemId).then()
            ]);
            v.hasType = result1.hasType;
            v.teethMode = result1.teethMode;
            v.isColor = result1.isColor;
            v.amountMode = result1.amountMode;
            let xh = result.filter((b) => item.pitemId == b.value);
            if (v.XingHao.length == 0 && xh.length > 0) {
              xh[0].children.forEach((x) => {
                x.A = [];
                x.B = [];
                x.C = [];
                x.D = [];
                if (x.value == item.ptypeId) {
                  if (v.A.length > 0) {
                    let A1 = Array.from(new Set(v.A));
                    let arr = A1.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (v.B.length > 0) {
                    let B1 = Array.from(new Set(v.B));
                    let arr = B1.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (v.C.length > 0) {
                    let C1 = Array.from(new Set(v.C));
                    let arr = C1.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (v.D.length > 0) {
                    let D1 = Array.from(new Set(v.D));
                    let arr = D1.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                  v.Model = {
                    label: x.label,
                    value: x.value
                  };
                }
              });
              v.XingHao = xh[0].children;
            } else {
              v.XingHao.forEach((x) => {
                if (x.value == item.ptypeId) {
                  if (item.teeth1A != "") {
                    let A1 = generateSequence(item.teeth1A);
                    let A11 = Array.from(new Set(A1));
                    let arr = A11.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (item.teeth1B != "") {
                    let B1 = generateSequence(item.teeth1B);
                    let B11 = Array.from(new Set(B1));
                    let arr = B11.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (item.teeth1C != "") {
                    let C1 = generateSequence(item.teeth1C);
                    let C11 = Array.from(new Set(C1));
                    let arr = C11.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (item.teeth1D != "") {
                    let D1 = generateSequence(item.teeth1D);
                    let D11 = Array.from(new Set(D1));
                    let arr = D11.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                }
              });
            }
            if (result1.isColor) {
              v.Color1 = {
                isCustom: false,
                label: orderForm.color1,
                value: orderForm.color1
              };
              colorData.Color1 = orderForm.color1;
            }
            if (item.XhModel != "" && v.Model == "") {
              v.Model = {
                label: item.XhModel,
                value: 0
              };
            }
          }
          if (item.pitemType == 1) {
            v.productItemClassifyWgId = item.pitemClassId;
            v.orderWgNameProduct = item.pitemName;
            v.orderWgProduct = item.pitemId;
            productParams.keywords = "";
            productParams.classifyId = item.pitemClassId;
            productParams.factoryId = orderForm.pitemFactoryId;
            if (item.teeth1A != "") {
              let A1 = generateSequence(item.teeth1A);
              if (v.WA.length > 0) {
                v.WA = Array.from(new Set(v.WA.concat(A1))).sort().reverse();
              } else {
                v.WA = [...A1];
              }
            }
            if (item.teeth1B != "") {
              let B1 = generateSequence(item.teeth1B);
              if (v.WB.length > 0) {
                v.WB = Array.from(new Set(v.WB.concat(B1))).sort();
              } else {
                v.WB = [...B1];
              }
            }
            if (item.teeth1C != "") {
              let C1 = generateSequence(item.teeth1C);
              if (v.WC.length > 0) {
                v.WC = Array.from(new Set(v.WC.concat(C1))).sort().reverse();
              } else {
                v.WC = [...C1];
              }
            }
            if (item.teeth1D != "") {
              let D1 = generateSequence(item.teeth1D);
              if (v.WD.length > 0) {
                v.WD = Array.from(new Set(v.WD.concat(D1))).sort();
              } else {
                v.WD = [...D1];
              }
            }
            const [result, result1] = await Promise.all([
              ProductAPI.getItemProductPage(productParams),
              ColorAPI.getProductData(item.pitemId).then()
            ]);
            v.hasWgType = result1.hasType;
            v.teethWgMode = result1.teethMode;
            v.amountWgMode = result1.amountMode;
            v.isWgColor = result1.isColor;
            let xh = result.filter((b) => item.pitemId == b.value);
            if (v.WgXingHao.length == 0 && xh.length > 0) {
              xh[0].children.forEach((x) => {
                x.A = [];
                x.B = [];
                x.C = [];
                x.D = [];
                if (x.value == item.ptypeId) {
                  if (v.WA.length > 0) {
                    let A1 = Array.from(new Set(v.WA));
                    let arr = A1.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (v.WB.length > 0) {
                    let B1 = Array.from(new Set(v.WB));
                    let arr = B1.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (v.WC.length > 0) {
                    let C1 = Array.from(new Set(v.WC));
                    let arr = C1.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (v.WD.length > 0) {
                    let D1 = Array.from(new Set(v.WD));
                    let arr = D1.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                  v.WgModel = {
                    label: x.label,
                    value: x.value
                  };
                }
              });
              v.WgXingHao = xh[0].children;
            } else {
              v.WgXingHao.forEach((x) => {
                if (x.value == item.ptypeId) {
                  if (item.teeth1A != "") {
                    let A1 = generateSequence(item.teeth1A);
                    let A11 = Array.from(new Set(A1));
                    let arr = A11.map((num) => "A" + num);
                    x.A = [...arr];
                  }
                  if (item.teeth1B != "") {
                    let B1 = generateSequence(item.teeth1B);
                    let B11 = Array.from(new Set(B1));
                    let arr = B11.map((num) => "B" + num);
                    x.B = [...arr];
                  }
                  if (item.teeth1C != "") {
                    let C1 = generateSequence(item.teeth1C);
                    let C11 = Array.from(new Set(C1));
                    let arr = C11.map((num) => "C" + num);
                    x.C = [...arr];
                  }
                  if (item.teeth1D != "") {
                    let D1 = generateSequence(item.teeth1D);
                    let D11 = Array.from(new Set(D1));
                    let arr = D11.map((num) => "D" + num);
                    x.D = [...arr];
                  }
                }
              });
            }
            if (result1.isColor) {
              v.WgColor1 = {
                label: orderForm.color1,
                value: orderForm.color1
              };
              colorData.Color1 = orderForm.color1;
            }
            if (item.XhModel != "" && v.WgModel == "") {
              v.WgModel = {
                label: item.XhModel,
                value: 0
              };
            }
          }
          if (item.tabIndex == row.tabIndex) {
            index = tooh.name;
          }
        }
      }
      tooh.value = v;
      tooharr.push(tooh);
      newclass.push(objclass[0]);
    };
    asyncTaskList.push(singleAsyncTask());
  });
  await Promise.all(asyncTaskList);
  if (tooharr.length > 0) {
    orderToothForm.value = tooharr;
    classList.value = [...newclass];
    isClassValue.value = parseInt(index);
    oldisClassValue.value = parseInt(index);
    classKey.value += 1;
    upVisible.value = true;
  }
}
const groupByField = (arr, field) => {
  if (!Array.isArray(arr) || !field) return {};
  return arr.reduce((result, current) => {
    const key = current[field];
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(current);
    return result;
  }, {});
};
const generateSequence = (inputStr) => {
  let sequence = [];
  let sparr = inputStr.split(",");
  sparr.forEach((inputStr2) => {
    if (!inputStr2.includes("-")) {
      sequence.push(Number(inputStr2));
      return;
    }
    const [startStr, endStr] = inputStr2.split("-");
    const start = Number(startStr);
    const end = Number(endStr);
    if (isNaN(start) || isNaN(end)) {
      ElNotification({
        title: "Error",
        message: `请输入有效的数字!`,
        type: "error",
        duration: 3e3
      });
      return;
    }
    if (start > end) {
      for (let i2 = start; i2 >= end; i2--) {
        sequence.push(i2);
      }
    } else {
      for (let i2 = start; i2 <= end; i2++) {
        sequence.push(i2);
      }
    }
  });
  return sequence;
};
function noup() {
  classKey.value += 1;
  upVisible.value = false;
}
function okup() {
  const b = up();
  if (b) {
    setOrder();
    okTooh();
    upVisible.value = false;
  }
}
function up() {
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
  const newClassList = classList.value.filter((a) => a.ids != item.ids);
  classList.value = newClassList;
  oldclassList.value = JSON.parse(JSON.stringify(newClassList));
  isClassValue.value = newClassList[0].ids;
  const id2 = item.ids;
  item.ids = String(Math.floor(Math.random() * 1e5)).padStart(5, "0");
  const newToothList = orderToothForm.value.filter((a) => a.name != id2);
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
}
function okTooh() {
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
async function setOrder() {
  orderNewForm.value = [];
  let orderTookMode = [];
  ToothsParams.orderId = 0;
  ToothsParams.factoryId = pitemFactoryId.value;
  ToothsParams.customerId = parseInt(orderForm.institution?.value);
  ToothsParams.patientName = orderForm.name;
  ToothsParams.creationTime = (/* @__PURE__ */ new Date()).toLocaleString();
  ToothsParams.details = [];
  let i2 = 0;
  let color1 = "";
  let colors1 = "";
  let color2 = "";
  let color3 = "";
  orderToothForm.value.forEach((a, index) => {
    const order = {
      id: i2
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
            wgorders.id = i2;
            wgorders.name = a.name;
            wgorders.type = "jt";
            wgorders.xhOptions = form.XingHao;
            wgorders.oldOrderProduct = form.orderProduct;
            wgorders.productItemClassifyId = form.productItemClassifyId;
            wgorders.tabIndex = index;
            wgorders.pitemType = 0;
            if (dl.length > 0) {
              wgorders.pitemClassTabId = dl[0].value;
            }
            orderNewForm.value.push(wgorders);
            orderTookMode.push({ id: i2, mode: form.amountMode, teethValue: desc1 });
            if (form.orderProduct) {
              ToothsParams.details.push({
                id: i2,
                pItemId: parseInt(form.orderProduct),
                teethDesc: desc1
              });
            }
            i2++;
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
        order.pitemType = 0;
        if (dl.length > 0) {
          order.pitemClassTabId = dl[0].value;
        }
        orderNewForm.value.push(order);
        orderTookMode.push({ id: order.id, mode: form.amountMode, teethValue: desc });
        if (form.orderProduct) {
          ToothsParams.details.push({
            id: i2,
            pItemId: parseInt(form.orderProduct),
            teethDesc: desc
          });
        }
        i2++;
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
              wgorders.id = i2;
              wgorders.name = a.name;
              wgorders.type = "wg";
              wgorders.xhOptions = form.WgXingHao;
              wgorders.oldOrderWgProduct = form.orderWgProduct;
              wgorders.productItemClassifyWgId = form.productItemClassifyWgId;
              wgorders.pitemType = 1;
              wgorders.tabIndex = index;
              if (dl.length > 0) {
                wgorders.pitemClassTabId = dl[0].value;
              }
              orderNewForm.value.push(wgorders);
              orderTookMode.push({ id: i2, mode: form.amountWgMode, teethValue: desc1 });
              if (form.orderWgProduct) {
                ToothsParams.details.push({
                  id: i2,
                  pItemId: parseInt(form.orderWgProduct),
                  teethDesc: desc1
                });
              }
              i2++;
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
          wgorder.id = i2;
          wgorder.isWgColor = form.isWgColor;
          wgorder.name = a.name;
          wgorder.type = "wg";
          wgorder.oldOrderWgProduct = form.orderWgProduct;
          wgorder.xhOptions = form.childrenWgXingHao;
          wgorder.productItemClassifyWgId = form.productItemClassifyWgId;
          wgorder.tabIndex = index;
          wgorder.pitemType = 1;
          if (dl.length > 0) {
            wgorder.pitemClassTabId = dl[0].value;
          }
          orderNewForm.value.push(wgorder);
          orderTookMode.push({ id: i2, mode: form.amountWgMode, teethValue: desc2 });
          if (form.orderWgProduct) {
            ToothsParams.details.push({
              id: i2,
              pItemId: parseInt(form.orderWgProduct),
              teethDesc: desc2
            });
          }
          i2++;
        }
      }
    }
  });
  ToothParams.tooths = orderTookMode;
  try {
    const [result, result1] = await Promise.all([
      OrderAPI.CalculateTooth(ToothParams),
      OrderAPI.checkRepeatTooth(ToothsParams)
    ]);
    orderNewForm.value.forEach((a) => {
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
    if (orderNewForm.value.length >= orderForm.makes[0].details.length) {
      let newarr = [];
      orderNewForm.value.forEach((b, i1) => {
        let d = orderForm.makes[0].details[i1];
        if (d) {
          d.XhModel = b.XhModel;
          d.make = b.make;
          d.makeOptions = b.makeOptions;
          d.pitemId = parseInt(b.orderProduct);
          d.pitemName = b.orderProductName;
          d.amount = b.Number;
          d.xhOptions = b.xhOptions;
          d.tabIndex = b.tabIndex;
          d.pitemType = b.pitemType;
          d.pitemClassId = b.productItemClassifyId;
          d.pitemClassTabId = b.pitemClassTabId;
          if (b.type == "wg") {
            d.pitemClassId = b.productItemClassifyWgId;
            d.pitemType = 1;
          }
          if (b.make) {
            if (typeof b.make !== "string") {
              d.prodTypeId = b.make ? parseInt(b.make?.value) : 0;
            } else {
              d.prodTypeId = 0;
            }
          }
          if (b.Model) {
            if (typeof b.Model !== "string") {
              d.ptypeId = b.Model ? parseInt(b.Model?.value) : 0;
            } else {
              d.ptypeId = 0;
            }
            d.ptypeName = b.Model?.label;
          } else {
            d.ptypeId = 0;
            d.ptypeName = "";
          }
          d.teeth1A = "";
          d.teeth1B = "";
          d.teeth1C = "";
          d.teeth1D = "";
          if (b.A != void 0 && b.A) {
            d.teeth1A = formatNumArr(b.A, 0);
          }
          if (b.B != void 0 && b.B) {
            d.teeth1B = formatNumArr(b.B, 1);
          }
          if (b.C != void 0 && b.C) {
            d.teeth1C = formatNumArr(b.C, 0);
          }
          if (b.D != void 0 && b.D) {
            d.teeth1D = formatNumArr(b.D, 1);
          }
          if (b.Color1 != void 0 && typeof b.Color1 !== "string") {
            colors1 = b.Color1.value;
          }
          if (b.WgColor1 != void 0 && typeof b.WgColor1 !== "string") {
            colors1 = b.WgColor1.value;
          }
          newarr.push(d);
        } else {
          let d1 = JSON.parse(JSON.stringify(orderForm.makes[0].details[0]));
          d1.XhModel = b.XhModel;
          d1.make = b.make;
          d1.makeOptions = b.makeOptions;
          d1.pitemId = parseInt(b.orderProduct);
          d1.pitemName = b.orderProductName;
          d1.amount = b.Number;
          d1.xhOptions = b.xhOptions;
          d1.tabIndex = b.tabIndex;
          d1.pitemClassId = b.productItemClassifyId;
          d1.pitemType = b.pitemType;
          if (b.type == "wg") {
            d1.pitemClassId = b.productItemClassifyWgId;
            d1.pitemType = 1;
          }
          d1.pitemClassTabId = b.pitemClassTabId;
          if (b.make) {
            if (typeof b.make !== "string") {
              d1.prodTypeId = b.make ? parseInt(b.make?.value) : 0;
            } else {
              d1.prodTypeId = 0;
            }
          }
          if (b.Model) {
            if (typeof b.Model !== "string") {
              d1.ptypeId = b.Model ? parseInt(b.Model?.value) : 0;
            } else {
              d1.ptypeId = 0;
            }
            d1.ptypeName = b.Model?.label;
          } else {
            d1.ptypeId = 0;
            d1.ptypeName = "";
          }
          const number = Math.floor(Math.random() * 9e5) + 1e5;
          d1.id = d1.id + number;
          d1.teeth1A = "";
          d1.teeth1B = "";
          d1.teeth1C = "";
          d1.teeth1D = "";
          if (b.A != void 0 && b.A) {
            d1.teeth1A = formatNumArr(b.A, 0);
          }
          if (b.B != void 0 && b.B) {
            d1.teeth1B = formatNumArr(b.B, 1);
          }
          if (b.C != void 0 && b.C) {
            d1.teeth1C = formatNumArr(b.C, 0);
          }
          if (b.D != void 0 && b.D) {
            d1.teeth1D = formatNumArr(b.D, 1);
          }
          if (b.Color1 != void 0 && typeof b.Color1 !== "string") {
            colors1 = b.Color1.value;
          }
          if (b.WgColor1 != void 0 && typeof b.WgColor1 !== "string") {
            colors1 = b.WgColor1.value;
          }
          newarr.push(d1);
        }
      });
      orderForm.makes[0].details = newarr.sort((a, b) => {
        if (a.tabIndex !== b.tabIndex) {
          return a.tabIndex - b.tabIndex;
        }
      });
    } else {
      let newarr1 = [];
      orderForm.makes[0].details.forEach((x, i22) => {
        let b = orderNewForm.value[i22];
        if (b) {
          x.XhModel = b.XhModel;
          x.make = b.make;
          x.makeOptions = b.makeOptions;
          x.pitemId = parseInt(b.orderProduct);
          x.pitemName = b.orderProductName;
          x.amount = b.Number;
          x.xhOptions = b.xhOptions;
          x.tabIndex = b.tabIndex;
          x.pitemClassId = b.productItemClassifyId;
          x.pitemType = b.pitemType;
          if (b.type == "wg") {
            x.pitemClassId = b.productItemClassifyWgId;
            x.pitemType = 1;
          }
          x.pitemClassTabId = b.pitemClassTabId;
          if (b.make) {
            if (typeof b.make !== "string") {
              x.prodTypeId = b.make ? parseInt(b.make?.value) : 0;
            } else {
              x.prodTypeId = 0;
            }
          }
          if (b.Model) {
            if (typeof b.Model !== "string") {
              x.ptypeId = b.Model ? parseInt(b.Model?.value) : 0;
            } else {
              x.ptypeId = 0;
            }
            x.ptypeName = b.Model?.label;
          } else {
            x.ptypeId = 0;
            x.ptypeName = "";
          }
          x.teeth1A = "";
          x.teeth1B = "";
          x.teeth1C = "";
          x.teeth1D = "";
          if (b.A != void 0 && b.A) {
            x.teeth1A = formatNumArr(b.A, 0);
          }
          if (b.B != void 0 && b.B) {
            x.teeth1B = formatNumArr(b.B, 1);
          }
          if (b.C != void 0 && b.C) {
            x.teeth1C = formatNumArr(b.C, 0);
          }
          if (b.D != void 0 && b.D) {
            x.teeth1D = formatNumArr(b.D, 1);
          }
          if (b.Color1 != void 0 && typeof b.Color1 !== "string") {
            colors1 = b.Color1.value;
          }
          if (b.WgColor1 != void 0 && typeof b.WgColor1 !== "string") {
            colors1 = b.WgColor1.value;
          }
          newarr1.push(x);
        }
      });
      orderForm.makes[0].details = newarr1.sort((a, b) => {
        if (a.tabIndex !== b.tabIndex) {
          return a.tabIndex - b.tabIndex;
        }
      });
    }
    if (colors1 != "") {
      orderForm.color1 = color1.value;
    } else {
      orderForm.color1 = "";
    }
    oldTooths.value = JSON.parse(JSON.stringify(orderToothForm.value));
    oldclassList.value = JSON.parse(JSON.stringify(classList.value));
  } catch (e) {
  }
}
function delOrder(row) {
  if (orderForm.makes[0].details.length == 1) {
    ElNotification({
      title: "Error",
      message: `操作失败,必须保留一条数据!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  const info = orderForm.makes[0].details.filter((a) => {
    return a.id != row.id;
  });
  orderForm.makes[0].details = info.sort((a, b) => {
    if (a.tabIndex !== b.tabIndex) {
      return a.tabIndex - b.tabIndex;
    }
  });
}
function settimer() {
  if (timer.value) clearInterval(timer.value);
  timer.value = setInterval(() => {
    renderOrder();
  }, 2e4);
}
function stoptimer() {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
}
function clearModelValue(item) {
  item.ptypeName = "";
  item.ptypeId = 0;
  item.XhModel = "";
}
function clearModelColorValue(item) {
  item.color1 = "";
}
function handleColorInput(v, item) {
  setTimeout(() => {
    if (v != "") {
    }
    item.XhModelIsOpen = false;
  }, 200);
}
function handleBlurInput(item) {
  item.XhModelIsOpen = false;
}
function handleInput(v, item) {
  setTimeout(() => {
    if (v != "") {
      if (item.ptypeName != void 0 && item.ptypeName != "") {
        if (item.xhOptions.length > 0) {
          const isxh = item.xhOptions.filter((a) => {
            return a.label == item.XhModel;
          });
          if (isxh.length == 0) {
            item.ptypeName = { label: v, value: 0 };
          } else {
            item.ptypeName = { label: isxh[0].label, value: isxh[0].value };
          }
        } else {
          item.ptypeName = { label: v, value: 0 };
        }
      } else {
        item.ptypeName = { label: v, value: 0 };
      }
    }
    item.XhModelIsOpen = false;
  }, 200);
}
function handleFocus(item) {
  item.XhModelIsOpen = true;
}
const handleForceColorShowSelect = async () => {
  await nextTick();
  if (!selectColorsRef.value) {
    console.error("未获取到 el-select 实例");
    return;
  }
  try {
    selectColorsRef.value.showDropdown();
  } catch (err) {
    try {
      const inputEl = selectColorsRef.value.$el.querySelector(".el-select__input");
      if (inputEl) {
        inputEl.dispatchEvent(new MouseEvent("click", { bubbles: true }));
      }
    } catch (err2) {
      const dropdownEl = document.querySelector(`[aria-labelledby="${selectColorsRef.value.id}"]`);
      if (dropdownEl) {
        dropdownEl.style.display = "block";
        dropdownEl.style.zIndex = "99999";
      }
    }
  }
};
const handleForceShowSelect = async (index) => {
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
function reworkUpload(options2) {
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
  const newFileName = "返工截图-" + diseaseSeriesForm.name + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk = {};
    chunk.file = chunks2.file;
    chunk.filePartName = fileName;
    chunk.originalFileName = newFileName;
    chunk.urlParameter = "";
    chunk.partNumber = index + 1;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks2.start;
    chunk.end = chunks2.end;
    chunk.total = size;
    chunkInfo.push(chunk);
  });
  const makep = {
    fileName,
    url: "",
    name: "",
    percentage: "0%",
    display: "block",
    fileId: 0
  };
  reworkUrls.value.push(makep);
  allUplod(chunkInfo, 2, "rework");
}
async function allUplod(chunkInfo, batchSize, type) {
  const totalBatches = Math.ceil(chunkInfo.length / batchSize);
  fileUpCount.value += 1;
  for (let i2 = 0; i2 < totalBatches; i2++) {
    const batchChunks = chunkInfo.slice(i2 * batchSize, (i2 + 1) * batchSize);
    const number = (i2 + 1) * batchSize;
    switch (type) {
      case "rework":
        const batchPromisee = batchChunks.map(
          (it) => reworkUploadChunk(it, number, chunkInfo.length)
        );
        await Promise.all(batchPromisee);
        break;
      case "cbct":
        const batchPromise = batchChunks.map((it) => UploadFileChunk(it, number, chunkInfo.length));
        await Promise.all(batchPromise);
        break;
      case "kssj":
        const batchPromises = batchChunks.map(
          (it) => UploadFileChunks(it, number, chunkInfo.length)
        );
        await Promise.all(batchPromises);
        break;
      case "color":
        const batchColorPromises = batchChunks.map(
          (it) => colorpUploadChunk(it, number, chunkInfo.length)
        );
        await Promise.all(batchColorPromises);
        break;
      case "make":
        const batchMakePromises = batchChunks.map(
          (it) => makeUploadChunk(it, number, chunkInfo.length)
        );
        await Promise.all(batchMakePromises);
        break;
    }
  }
}
async function reworkUploadChunk(chunk, i2, z) {
  var formData = new FormData();
  formData.append("File", chunk.file);
  formData.append("FileName", chunk.filePartName);
  formData.append("OriginalFileName", chunk.originalFileName);
  formData.append("PartNumber", chunk.partNumber);
  formData.append("Chunks", chunk.chunks);
  formData.append("Size", chunk.size);
  formData.append("Start", chunk.start);
  formData.append("End", chunk.end);
  formData.append("Total", chunk.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = reworkUrls.value.findIndex((item) => item.fileName === chunk.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      reworkUrls.value[index].fileName = chunk.originalFileName;
      reworkUrls.value[index].url = imgurl.replace("&width=400", "");
      reworkUrls.value[index].name = imgname;
      reworkUrls.value[index].percentage = "100%";
      reworkUrls.value[index].display = "none";
      reworkUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i2 / (z + 1) * 100);
      reworkUrls.value[index].percentage = c + "%";
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
  const hz = getFileExtensions(file.name);
  const newFileName = "cbct-" + orderForm.patientName + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk = {};
    chunk.file = chunks2.file;
    chunk.filePartName = fileName;
    chunk.originalFileName = newFileName;
    chunk.urlParameter = "";
    chunk.partNumber = index + 1;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks2.start;
    chunk.end = chunks2.end;
    chunk.total = size;
    chunkInfo.push(chunk);
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
async function UploadFileChunk(chunk, i2, z) {
  var formData = new FormData();
  formData.append("File", chunk.file);
  formData.append("FileName", chunk.filePartName);
  formData.append("OriginalFileName", chunk.originalFileName);
  formData.append("PartNumber", chunk.partNumber);
  formData.append("Chunks", chunk.chunks);
  formData.append("Size", chunk.size);
  formData.append("Start", chunk.start);
  formData.append("End", chunk.end);
  formData.append("Total", chunk.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = cbctfileUrls.value.findIndex((item) => item.fileName === chunk.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      cbctfileUrls.value[index].fileName = chunk.originalFileName;
      cbctfileUrls.value[index].url = imgurl;
      cbctfileUrls.value[index].name = imgname;
      cbctfileUrls.value[index].percentage = "100%";
      cbctfileUrls.value[index].display = "none";
      cbctfileUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i2 / (z + 1) * 100);
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
  const newFileName = "口扫数据-" + orderForm.patientName + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk = {};
    chunk.file = chunks2.file;
    chunk.filePartName = fileName;
    chunk.originalFileName = newFileName;
    chunk.urlParameter = "";
    chunk.partNumber = index + 1;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks2.start;
    chunk.end = chunks2.end;
    chunk.total = size;
    chunkInfo.push(chunk);
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
async function UploadFileChunks(chunk, i2, z) {
  var formData = new FormData();
  formData.append("File", chunk.file);
  formData.append("FileName", chunk.filePartName);
  formData.append("OriginalFileName", chunk.originalFileName);
  formData.append("PartNumber", chunk.partNumber);
  formData.append("Chunks", chunk.chunks);
  formData.append("Size", chunk.size);
  formData.append("Start", chunk.start);
  formData.append("End", chunk.end);
  formData.append("Total", chunk.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = mouthfileUrls.value.findIndex((item) => item.fileName === chunk.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      mouthfileUrls.value[index].fileName = chunk.originalFileName;
      mouthfileUrls.value[index].url = imgurl;
      mouthfileUrls.value[index].name = imgname;
      mouthfileUrls.value[index].percentage = "100%";
      mouthfileUrls.value[index].display = "none";
      mouthfileUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i2 / (z + 1) * 100);
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
  const newFileName = "比色照-" + orderForm.patientName + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk = {};
    chunk.file = chunks2.file;
    chunk.filePartName = fileName;
    chunk.originalFileName = newFileName;
    chunk.urlParameter = "";
    chunk.partNumber = index + 1;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks2.start;
    chunk.end = chunks2.end;
    chunk.total = size;
    chunkInfo.push(chunk);
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
async function colorpUploadChunk(chunk, i2, z) {
  var formData = new FormData();
  formData.append("File", chunk.file);
  formData.append("FileName", chunk.filePartName);
  formData.append("OriginalFileName", chunk.originalFileName);
  formData.append("PartNumber", chunk.partNumber);
  formData.append("Chunks", chunk.chunks);
  formData.append("Size", chunk.size);
  formData.append("Start", chunk.start);
  formData.append("End", chunk.end);
  formData.append("Total", chunk.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = colorpicUrls.value.findIndex((item) => item.fileName === chunk.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      colorpicUrls.value[index].fileName = chunk.originalFileName;
      colorpicUrls.value[index].url = imgurl.replace("&width=400", "");
      colorpicUrls.value[index].name = imgname;
      colorpicUrls.value[index].percentage = "100%";
      colorpicUrls.value[index].display = "none";
      colorpicUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i2 / (z + 1) * 100);
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
  const newFileName = "制作照-" + orderForm.patientName + hz;
  var chunkInfo = [];
  fileChunks.forEach((chunks2, index) => {
    let chunk = {};
    chunk.file = chunks2.file;
    chunk.filePartName = fileName;
    chunk.originalFileName = newFileName;
    chunk.urlParameter = "";
    chunk.partNumber = index + 1;
    chunk.chunks = totalParts;
    chunk.size = bufferChunkSize;
    chunk.start = chunks2.start;
    chunk.end = chunks2.end;
    chunk.total = size;
    chunkInfo.push(chunk);
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
async function makeUploadChunk(chunk, i2, z) {
  var formData = new FormData();
  formData.append("File", chunk.file);
  formData.append("FileName", chunk.filePartName);
  formData.append("OriginalFileName", chunk.originalFileName);
  formData.append("PartNumber", chunk.partNumber);
  formData.append("Chunks", chunk.chunks);
  formData.append("Size", chunk.size);
  formData.append("Start", chunk.start);
  formData.append("End", chunk.end);
  formData.append("Total", chunk.total);
  formData.append("SoureCode", "Chat");
  loading.value = true;
  await FileAPI.upload(formData).then((data) => {
    const index = makepicUrls.value.findIndex((item) => item.fileName === chunk.filePartName);
    let fileid = data.id;
    if (fileid > 0) {
      let datas = data;
      const imgurl = datas.fileUrl;
      const imgarr = imgurl.split("name=");
      const imgname = imgarr[1].replace("&width=400", "");
      makepicUrls.value[index].fileName = chunk.originalFileName;
      makepicUrls.value[index].url = imgurl.replace("&width=400", "");
      makepicUrls.value[index].name = imgname;
      makepicUrls.value[index].percentage = "100%";
      makepicUrls.value[index].display = "none";
      makepicUrls.value[index].fileId = fileid;
      fileOkUpCount.value += 1;
      loading.value = false;
    } else {
      let c = parseInt(i2 / (z + 1) * 100);
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
    } else if (v == 5) {
      reworkUrls.value = reworkUrls.value.filter((file) => file.name !== fileUrl);
    }
  });
}
function ok() {
  if (reworkUrls.value.length == 0 && fanGongForm.value.reworkReason == "") {
    ElNotification({
      title: "Error",
      message: `请填写返工原因或上传返工截图!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  if (fanGongForm.value.isTest == "") {
    ElNotification({
      title: "Error",
      message: `请选择试戴!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  if (fileUpCount.value > fileOkUpCount.value) {
    ElNotification({
      title: "Error",
      message: `文件上传中(${fileOkUpCount.value.toString()}/${fileUpCount.value.toString()})...请待上传完成,再提交订单!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  let data = {
    orderId: ""
  };
  saveOrderFile(1);
}
function getQuestiong(v) {
  switch (v) {
    case 1:
      return "审核待问";
    case 2:
      return "设计待问";
    case 3:
      return "生产待问";
  }
}
function okshihui() {
  if (shiHuiForm.value.testDescription == "") {
    ElNotification({
      title: "Error",
      message: `请填写试回说明!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  if (fileUpCount.value > fileOkUpCount.value) {
    ElNotification({
      title: "Error",
      message: `文件上传中(${fileOkUpCount.value.toString()}/${fileUpCount.value.toString()})...请待上传完成,再提交订单!`,
      type: "error",
      duration: 3e3
    });
    return false;
  }
  saveOrderFile(2);
}
function saveOrderFile(v) {
  let files = [];
  reworkUrls.value.forEach((item) => {
    const fileurl = Object.assign({}, orderFilesInfo);
    fileurl.type = 6;
    fileurl.fileId = item.fileId;
    fileurl.fileName = item.fileName;
    fileurl.url = item.url + "&width=400";
    files.push(fileurl);
  });
  cbctfileUrls.value.forEach((item) => {
    const fileurl = Object.assign({}, orderFilesInfo);
    fileurl.type = 0;
    fileurl.fileId = item.fileId;
    fileurl.fileName = item.fileName;
    fileurl.url = item.url + "&width=400";
    files.push(fileurl);
  });
  mouthfileUrls.value.forEach((item) => {
    const fileurl = Object.assign({}, orderFilesInfo);
    fileurl.type = 1;
    fileurl.fileId = item.fileId;
    fileurl.fileName = item.fileName;
    fileurl.url = item.url + "&width=400";
    files.push(fileurl);
  });
  colorpicUrls.value.forEach((item) => {
    const fileurl = Object.assign({}, orderFilesInfo);
    fileurl.type = 2;
    fileurl.fileId = item.fileId;
    fileurl.fileName = item.fileName;
    fileurl.url = item.url + "&width=400";
    files.push(fileurl);
  });
  makepicUrls.value.forEach((item) => {
    const fileurl = Object.assign({}, orderFilesInfo);
    fileurl.type = 3;
    fileurl.fileId = item.fileId;
    fileurl.fileName = item.fileName;
    fileurl.url = item.url + "&width=400";
    files.push(fileurl);
  });
  const loadingInstance = ElLoading.service({ fullscreen: true, text: "Loading..." });
  if (v == 1) {
    orderFanGongFormInfo.attachFile = files;
    orderFanGongFormInfo.reworkReason = fanGongForm.value.reworkReason;
    orderFanGongFormInfo.testId = parseInt(fanGongForm.value.isTest?.value);
    orderFanGongFormInfo.testDesc = fanGongForm.value.isTest?.label;
    OrderAPI.createFanGongOrder(orderFanGongFormInfo).then((data) => {
      handleClose();
      if (data != void 0 && data.orderId != void 0 && data.orderId != "") {
        const url = {
          path: "/details",
          query: {
            id: data.orderId
          }
        };
        router.replace(url).then(() => {
          window.location.reload();
        });
      }
    }).finally(() => {
      loadingInstance.close();
    });
  } else {
    orderShiHuiFormInfo.attachFile = files;
    orderShiHuiFormInfo.testDescription = shiHuiForm.value.testDescription;
    orderShiHuiFormInfo.testType = shiHuiForm.value.testType;
    OrderAPI.createShiHuiOrder(orderShiHuiFormInfo).then((data) => {
      handleClose();
      if (data != void 0 && data.orderId != void 0 && data.orderId != "") {
        const url = {
          path: "/details",
          query: {
            id: data.orderId
          }
        };
        router.replace(url).then(() => {
          window.location.reload();
        });
      }
    }).finally(() => {
      loadingInstance.close();
    });
  }
}
function toFanGong() {
  getShiDai();
  visible.value = true;
}
function toShiHui() {
  shvisible.value = true;
}
function handleClose() {
  visible.value = false;
  shvisible.value = false;
  reworkUrls.value = [];
  colorpicUrls.value = [];
  makepicUrls.value = [];
  cbctfileUrls.value = [];
  mouthfileUrls.value = [];
  fanGongForm.value.reworkReason = "";
  fanGongForm.value.doctorRequire = "";
  shiHuiForm.value.testType = "0";
  shiHuiForm.value.testDescription = "";
}
function handleJgcFocus() {
  isjgc.value = true;
  isygcs.value = false;
  iszzcs.value = false;
  isyljg.value = false;
  iscgyq.value = false;
}
function handleYljgFocus() {
  isyljg.value = true;
  iscgyq.value = false;
  isygcs.value = false;
  iszzcs.value = false;
  isjgc.value = false;
}
function handlecgyqFocus() {
  iscgyq.value = true;
  isygcs.value = false;
  iszzcs.value = false;
  isyljg.value = false;
  isjgc.value = false;
}
function handleygFocus() {
  iscgyq.value = false;
  isygcs.value = true;
  iszzcs.value = false;
  isyljg.value = false;
  isjgc.value = false;
}
function handlezzFocus() {
  iscgyq.value = false;
  isygcs.value = false;
  iszzcs.value = true;
  isyljg.value = false;
  isjgc.value = false;
}
function handlezzBlur() {
  iscgyq.value = false;
  isygcs.value = false;
  iszzcs.value = false;
  isyljg.value = false;
  isjgc.value = false;
}
function getShiDai() {
  const codes = "IsTest";
  DictAPI.getOptionsList(codes).then((data) => {
    const sdarr = data.filter((item) => {
      return item.code == "IsTest";
    });
    Object.assign(orderSd, sdarr.length > 0 ? sdarr[0].dictDataList : []);
  });
}
function setToothValue(item) {
}
async function getTips() {
  const isDisplay2 = user.members.orgRoleCodes.includes("10012") == true ? true : false;
  if (!isDisplay2) {
    await OrderAPI.getTips(orderTipsParams).then((data) => {
      Object.assign(orderJgcInfo, data);
      orderJgcInfo.constomerInfo = orderJgcInfo.constomerInfo == "" ? "暂无..." : orderJgcInfo.constomerInfo?.replaceAll("\r\n", "<br>");
      orderJgcInfo.factoryInfo = orderJgcInfo.factoryInfo == "" ? "暂无..." : orderJgcInfo.factoryInfo?.replaceAll("\r\n", "<br>");
      orderJgcInfo.require = orderJgcInfo.require == "" ? "暂无..." : orderJgcInfo.require?.replaceAll("\r\n", "<br>");
      orderJgcInfo.crownNote = orderJgcInfo.crownNote == "" ? "暂无..." : orderJgcInfo.crownNote?.replaceAll("\r\n", "<br>");
      orderJgcInfo.implantNote = orderJgcInfo.implantNote == "" ? "暂无..." : orderJgcInfo.implantNote?.replaceAll("\r\n", "<br>");
      isdesigner.value = false;
    });
  } else {
    isdesigner.value = true;
  }
}
onBeforeUnmount(() => {
  stoptimer();
});
function renderOrder() {
  OrdersAPI.getStateOrder(queryParams).then((data) => {
    if (data.id == 0) {
      const date = /* @__PURE__ */ new Date();
      let datatime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      console.log("时间:" + datatime);
      settimer();
    } else {
      chatStore.orderInfo = data;
      chatStore.roomId = data.chatRoomId;
      Object.assign(orderForm, data);
      if (data.makes[0].factoryId != 0) {
        orderForm.factoryNames = data.makes[0].factoryName;
      } else {
        orderForm.factoryNames = orderForm.factoryName;
      }
      if (data.makes[0].substituteFactoryId != 0) {
        orderForm.substituteFactoryName = data.makes[0].factoryName;
        isdgcwt.value = true;
      } else {
        orderForm.substituteFactoryName = "";
        isdgcwt.value = false;
      }
      orderState.value = data.makes[0].state.state;
      prodTypeName.value = [
        ...new Set(data.makes[0].details.map((item) => item.prodTypeName))
      ].join(",");
      orderForm.tipMessage = data.makes[0].state.tipMessage;
      orderForm.substitutetipMessage = data.makes[0].state.tipMessage;
      orderForm.isTests = data.makes[0].details[0].testDesc;
      orderForm.isTest = data.makes[0].details[0].testId;
      orderForm.isPaused = data.makes[0].pauseState.isPaused;
      const date = /* @__PURE__ */ new Date();
      dataTime.value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
      const orgCode = user.members.orgRoleCodes.toString();
      if (orgCode.indexOf("1003") > -1) {
        isDisplay.value = true;
        isUpdate.value = true;
      }
      if (orgCode.indexOf("10010") > -1 || orgCode.indexOf("10011") > -1) {
        isAdmin.value = true;
      }
      stoptimer();
    }
  }).finally(() => {
  });
}
const formatNumArr = (arr, v) => {
  if (!arr || arr.length === 0) return "";
  const result = [];
  let tempList = [arr[0]];
  for (let i2 = 1; i2 < arr.length; i2++) {
    if (Math.abs(arr[i2] - arr[i2 - 1]) === 1) {
      tempList.push(arr[i2]);
    } else {
      result.push(handleContinuousList(tempList, v));
      tempList = [arr[i2]];
    }
  }
  result.push(handleContinuousList(tempList, v));
  return result.join(",");
};
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
function addEventListener() {
  document.addEventListener("click", handleClickBlank);
}
function removeEventListener() {
  document.removeEventListener("click", handleClickBlank);
}
function setColorValue(v, name) {
  onColorChange(v, name);
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
const emit = defineEmits(["featchMyNotice"]);
function featchMyNotice() {
  emit("featchMyNotice");
}
onUnmounted(() => {
  stoptimer();
  removeEventListener();
});
onMounted(() => {
  getTips();
  handleQuery();
  addEventListener();
});
</script>
<style lang="scss" scoped>
.ecmbody {
  display: flex;
  flex-flow: column;
  width: 1220px;
  margin: 0 auto;
  padding-top: 20px;
  justify-content: space-between;
  .ecmbodys {
    display: flex;
    width: 1220px;
    margin: 0 auto;
    line-height: 100%;
    letter-spacing: 0%;
    justify-content: space-between;
    .ecmbody-left {
      display: flex;
      flex-flow: column;
      width: 750px;
      line-height: 39px;
      .ecmbody-left-top {
        width: 100%;
        display: flex;
        justify-content: space-between;
        height: 43px;
        .ecmbody-left-top1 {
          font-family: Noto Sans SC;
          font-weight: 500;
          font-style: Medium;
          font-size: 18px;
          line-height: 100%;
          letter-spacing: 0%;
          color: #333f48;
          span {
            font-weight: 700;
            font-style: Bold;
            font-size: 16px;
          }
        }
        .ecmbody-left-top3 {
          display: flex;
          width: auto;
          cursor: pointer;
          flex-flow: column;
          justify-content: space-around;
          align-items: end;
          .ecmbody-left-top3-date {
            display: flex;
            font-family: Roboto;
            font-weight: 400;
            font-size: 13px;
            line-height: 100%;
            color: #503c3c;
          }
        }
      }
      .ecmbody-left-info {
        display: flex;
        width: 100%;
        height: auto;
        flex-flow: column;
        .ecmbody-left-info3 {
          margin-top: 10px;
          width: 100%;
          //height: 325px;
          border-radius: 10px;
          border-width: 0.5px;
          padding: 10px 10px 10px 18px;
          border: 0.5px solid #1d5925;
          background-color: #ffffff;
          height: 100%;
          overflow: hidden;
          // overflow: hidden;
          :deep(.el-form-item--default .el-form-item__content) {
            line-height: 32px;
            color: #000000;
            font-family: Noto Sans SC;
            height: 32px;
            overflow: hidden;
            font-size: 17px;
          }
          :deep(.el-form--inline .el-form-item) {
            display: inline-flex;
            margin-right: 5px;
            vertical-align: middle;
            width: 100%;
          }
          :deep(.el-form-item__label) {
            align-items: flex-start;
            box-sizing: border-box;
            color: #8f43d3;
            display: inline-flex;
            flex: 0 0 auto;
            font-size: var(--el-form-label-font-size);
            height: 32px;
            line-height: 32px;
            padding: 0px;
            font-family: Noto Sans SC;
            font-size: 17px;
          }
          .ecmbody-info3-title {
            display: flex;
            height: 30px;
            line-height: 30px;
            justify-content: space-between;
            .title {
              align-items: center;
              font-family: Noto Sans SC;
              font-weight: 700;
              font-size: 20px;
              color: #333f48;
              //width: 56%;
              span {
                line-height: 32px;
                color: #ec2929;
                font-family: Noto Sans SC;
                height: 32px;
                font-weight: lighter;
                font-size: 16px;
              }
            }
            .img {
              display: flex;
              //width: 40%;
              cursor: pointer;
            }
            .ysh {
              background-color: #ddf6e4;
              text-align: center;
              transform: rotate(40deg);
              font-size: 12px;
              color: #55d379;
              width: 100px;
              height: 20px;
              line-height: 20px;
              position: relative;
              top: 1px;
              right: -36px;
            }
          }
          .ecmbody-info3-content {
            width: 100%;
            line-height: 100%;
            letter-spacing: 0%;
            padding: 5px 0px 0px 3px;
            .ecmbody-info3-content-1 {
              font-weight: 400;
              font-size: 16px;
              color: #333f48;
              height: 35px;
            }
            .ecmxq {
              border: 0.5px solid #e58600;
              padding: 0px 2px;
              border-radius: 5px;
              line-height: 23px;
              font-size: 16px;
              color: #e58600;
              cursor: pointer;
            }
            .ecmyq {
              border: 0.5px solid #e58600;
              padding: 0px 2px;
              border-radius: 5px;
              line-height: 23px;
              font-size: 16px;
              color: #e58600;
              cursor: pointer;
            }
            .ecmygcs {
              border: 0.5px solid #e58600;
              padding: 0px 2px;
              border-radius: 5px;
              line-height: 23px;
              font-size: 16px;
              color: #e58600;
              cursor: pointer;
            }
            .ecmzzcs {
              border: 0.5px solid #e58600;
              padding: 0px 2px;
              border-radius: 5px;
              line-height: 23px;
              font-size: 16px;
              color: #e58600;
              cursor: pointer;
            }
            .ecmxq-div {
              display: flex;
              width: auto;
              min-width: 290px;
              height: auto;
              min-height: 80px;
              border: 0.5px solid #55d379;
              position: fixed;
              border-radius: 5px;
              z-index: 999;
              margin-top: 115px;
              color: #55d379;
              background-color: #ffffff;
              padding: 0px 5px 0px 5px;
              font-size: 16px;
              font-family: Noto Sans SC;
            }
            .ecmyq-div {
              display: flex;
              width: auto;
              min-width: 290px;
              height: auto;
              min-height: 80px;
              border: 0.5px solid #55d379;
              position: fixed;
              border-radius: 5px;
              z-index: 999;
              margin-top: 115px;
              color: #55d379;
              background-color: #ffffff;
              padding: 0px 5px 0px 5px;
              font-size: 16px;
              font-family: Noto Sans SC;
            }
            .ecmxq-div1 {
              display: flex;
              width: auto;
              min-width: 290px;
              height: auto;
              min-height: 80px;
              border: 0.5px solid #55d379;
              position: fixed;
              border-radius: 5px;
              z-index: 999;
              margin-top: 115px;
              color: #55d379;
              background-color: #ffffff;
              padding: 0px 5px 0px 5px;
              font-size: 16px;
              font-family: Noto Sans SC;
            }
            .ecmygcs-div1 {
              display: flex;
              width: auto;
              min-width: 290px;
              height: auto;
              min-height: 60px;
              border: 0.5px solid #55d379;
              position: fixed;
              border-radius: 5px;
              padding: 0px 5px 0px 5px;
              color: #55d379;
              z-index: 999;
              margin-top: 97px;
              font-size: 16px;
              font-family: Noto Sans SC;
              background-color: #ffffff;
            }
            .ecmzzcs-div1 {
              display: flex;
              width: auto;
              min-width: 290px;
              height: auto;
              min-height: 60px;
              border: 0.5px solid #55d379;
              position: fixed;
              border-radius: 5px;
              padding: 0px 5px 0px 5px;
              color: #55d379;
              z-index: 999;
              margin-top: 97px;
              font-size: 16px;
              font-family: Noto Sans SC;
              background-color: #ffffff;
            }
          }
        }
        .ecmbody-left-info4 {
          margin-top: 20px;
          width: 100%;
          //min-height: 425px;
          height: 100%;
          border-radius: 10px;
          border-width: 0.5px;
          letter-spacing: 0%;
          padding: 10px 10px 10px 10px;
          border: 0.5px solid #1d5925;
          background-color: #ffffff;
          .ecmbody-info4-top {
            .ecmbody-info4-top-title {
              display: flex;
              height: 30px;
              align-items: center;
              font-family: Noto Sans SC;
              font-weight: 700;
              font-size: 20px;
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
              letter-spacing: 0%;
              padding: 10px 10px;
              .ecmbody-left-content3-title {
                display: flex;
                background-color: #5094f5;
                .ecmbody-left-content3-title-1 {
                  color: #fff;
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
                font-size: 12px;
              }
              :deep(el-table__row--striped) {
                background-color: #000000;
              }
              :deep(
                .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell
              ) {
                background-color: #ffffff;
              }
              :deep(.el-table) {
                --el-table-row-hover-bg-color: #ffffff;
                --el-table-border: 1px solid #ffffff;
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
                font-size: 16px;
                color: #000;
              }
              .box2 {
                flex: 1 0 50%;
                border-bottom: 1px solid #eb5757;
                padding-left: 5px;
                font-size: 16px;
                color: #000;
              }
              .box3 {
                flex: 1 0 50%;
                text-align: right;
                border-right: 1px solid #eb5757;
                padding-right: 5px;
                font-size: 16px;
                color: #000;
              }
              .box4 {
                flex: 1 0 50%;
                padding-left: 5px;
                font-size: 16px;
                color: #000;
              }
              .ecmbody-from-caozuo {
                display: flex;
                width: 100%;
              }
              :deep(.el-textarea__inner) {
                color: #000;
                font-size: 17px;
                background-color: white;
                border: 1px solid #1d5925;
              }
            }
          }
        }
        .ecmbody-info5-top {
          display: flex;
          width: 100%;
          margin-top: 10px;
          padding-top: 12px;
          border-top: 0.5px solid #c5d1dc;
          height: 60px;
          font-size: 14px;
          font-family: Noto Sans SC;
          .ecmbody-info5-top-btn {
            display: flex;
            justify-content: center;
            background-color: #e98629;
            color: rgba(255, 255, 255, 1);
            border-radius: 6px;
            height: 35px;
            line-height: 35px;
            width: 90px;
            font-family: Noto Sans SC;
            cursor: pointer;
          }
          .ecmbody-info5-top-btn1 {
            display: flex;
            justify-content: center;
            border-radius: 6px;
            background-color: rgba(125, 174, 255, 1);
            color: rgba(255, 255, 255, 1);
            height: 35px;
            line-height: 35px;
            width: 90px;
            margin-left: 15px;
            font-family: Noto Sans SC;
            cursor: pointer;
          }
        }
      }
      .ecmbody-left-content {
        display: flex;
        width: 100%;
        height: auto;
        flex-flow: column;
        .ecmbody-left-info1 {
          display: flex;
          flex-flow: column;
          margin-top: 10px;
          width: 100%;
          height: 350px;
          border-radius: 10px;
          border-width: 0.5px;
          padding: 10px 10px 10px 10px;
          border: 0.5px solid #1d5925;
          background-color: #ffffff;
          overflow: hidden;
          :deep(.el-form-item--default .el-form-item__content) {
            line-height: 32px;
            color: #606266;
            font-family: Noto Sans SC;
            font-size: 15px;
          }
          :deep(.el-select--small .el-select__wrapper) {
            gap: 4px;
            line-height: 20px;
            min-height: 28px;
            padding: 2px 4px;
            font-size: 14px;
          }
          :deep(.el-form--inline .el-form-item) {
            display: inline-flex;
            margin-right: 5px;
            vertical-align: middle;
            width: 100%;
          }
          :deep(.el-form-item__label) {
            align-items: flex-start;
            box-sizing: border-box;
            color: #333f48;
            display: inline-flex;
            flex: 0 0 auto;
            font-size: var(--el-form-label-font-size);
            height: 32px;
            line-height: 32px;
            padding: 0px 8px;
            font-family: Noto Sans SC;
            font-size: 17px;
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
            font-size: 17px;
          }

          :deep(.el-select__placeholder) {
            color: #000000;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 100%;
            z-index: -1;
            font-size: 17px;
          }
          :deep(.el-select__placeholder.is-transparent) {
            color: #a8abb2;
            -webkit-user-select: none;
            -moz-user-select: none;
            user-select: none;
            font-size: 17px;
          }
          .ecmbody-info3-title {
            display: flex;
            height: 30px;
            line-height: 30px;
            justify-content: space-between;
            .title {
              align-items: center;
              font-family: Noto Sans SC;
              font-weight: 700;
              font-size: 20px;
              color: #333f48;
              // width: 50%;
              span {
                line-height: 32px;
                color: #ec2929;
                font-family: Noto Sans SC;
                height: 32px;
                font-weight: lighter;
                font-size: 15px;
              }
            }
            .img {
              display: flex;
              // width: 50%;
            }
            .ysh {
              background-color: #ddf6e4;
              text-align: center;
              transform: rotate(40deg);
              font-size: 12px;
              color: #55d379;
              width: 80px;
              height: 20px;
              line-height: 20px;
              position: relative;
              top: -4px;
              right: -25px;
            }
            span {
              line-height: 32px;
              color: #757575;
              font-family: Noto Sans SC;
              height: 32px;
              font-weight: lighter;
              font-size: 15px;
            }
          }
          .ecmbody-info3-content {
            width: 100%;
            line-height: 100%;
            letter-spacing: 0%;
            padding: 10px 0px 0px 10px;
            .ecmbody-info3-content-1 {
              font-weight: 400;
              font-size: 16px;
              color: #333f48;
              height: 35px;
            }
            .yanse {
              width: 100%;
              display: flex;
              margin-top: -13px;
              :deep(.select-input) {
                position: relative;
                display: flex;
                align-items: center;
                width: 100%;
                height: 32px;
                border-radius: 4px;
                background: #ffffff;
                cursor: text;
                transition: border-color 0.2s;
                border: 0.5px solid #1d5925;
              }
              :deep(.input-inner) {
                flex: 1;
                height: 100%;
                border: none;
                outline: none;
                background: transparent;
                color: #000000;
                width: 100%;
                font-size: 17px;
                font-weight: lighter;
                font-weight: 400;
                padding-left: 18px;
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
                margin-left: 85px;
                position: absolute;
              }
              :deep(.arrow) {
                display: flex;
                margin-left: -40px;
                color: #9ca3af;
                font-size: 14px;
                margin-right: 6px;
              }
              :deep(.rotate) {
                transform: rotate(180deg);
              }
            }
            :deep(.el-form-item__error) {
              color: var(--el-color-danger);
              font-size: 14px;
              left: 0;
              line-height: 1;
              padding-top: 2px;
              position: absolute;
              top: 100%;
            }
          }
        }
        .ecmbody-left-info2 {
          display: flex;
          flex-flow: column;
          margin-top: 20px;
          width: 100%;
          height: 100%;
          min-height: 461px;
          border-radius: 10px;
          border-width: 0.5px;
          border: 0.5px solid #1d5925;
          background-color: #ffffff;
          .ecmbody-info4-top {
            width: 100%;
            padding: 10px 10px 10px 10px;
            .ecmbody-info4-top-title {
              display: flex;
              height: 30px;
              align-items: center;
              font-family: Noto Sans SC;
              font-weight: 700;
              font-size: 20px;
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
              letter-spacing: 0%;
              padding: 10px 10px 0px 10px;
              .ecmbody-left-content3-title {
                display: flex;
                background-color: #5094f5;
                .ecmbody-left-content3-title-1 {
                  color: #ffffff;
                  height: 18px;
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
                font-size: 12px;
              }
              :deep(el-table__row--striped) {
                background-color: #000000;
              }
              :deep(
                .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell
              ) {
                background-color: #e9f0f5;
              }
              :deep(.el-table) {
                --el-table-row-hover-bg-color: #e9f0f5;
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
                font-size: 16px;
                color: #000;
              }
              .box2 {
                flex: 1 0 50%;
                border-bottom: 1px solid #eb5757;
                padding-left: 5px;
                font-size: 16px;
                color: #000;
              }
              .box3 {
                flex: 1 0 50%;
                text-align: right;
                border-right: 1px solid #eb5757;
                padding-right: 5px;
                font-size: 16px;
                color: #000;
              }
              .box4 {
                flex: 1 0 50%;
                padding-left: 5px;
                font-size: 16px;
                color: #000;
              }

              .ecmbody-from-caozuo {
                display: flex;
                width: 100%;
              }
              :deep(.el-select__placeholder) {
                color: var(--el-input-text-color, var(--el-text-color-regular));
                position: absolute;
                top: 50% 10px;
                transform: translateY(-50%);
                width: 100%;
                font-size: 15px;
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
                  height: 24px;
                  border-radius: 4px;
                  background: #ffffff;
                  cursor: text;
                  transition: border-color 0.2s;
                  border: 0.5px solid #1d5925;
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
                  color: #606266;
                  width: 100%;
                  font-family: Noto Sans SC;
                  font-size: 15px;
                  padding-left: 8px;
                  font-weight: 400;
                  font-family:
                    "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
                    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
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
                  margin-left: 88px;
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
              :deep(.el-textarea__inner) {
                color: #000;
                font-size: 17px;
                border: 1px solid #1d5925;
              }
            }
          }
          .ecmbody-info5-top {
            width: 100%;
            margin-top: 10px;
            border-top: 0.5px solid #c5d1dc;
            height: 60px;
          }
        }
      }
    }
    .nr-txt {
      font-size: 17px;
      color: #000000;
      font-family: Noto Sans SC;
    }
    .ecmbody-right {
      display: flex;
      width: 440px;
      flex-flow: column;
      .ecmbody-right-top {
        display: flex;
        height: 39px;
        background-color: #333f48;
        width: 100%;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-width: 1px;
        justify-content: center;
        align-items: center;
        span {
          width: 77px;
          height: 19px;
          font-weight: 700;
          font-style: Bold;
          font-size: 16px;
          text-align: center;
          color: #ffffff;
        }
      }
      .ecmbody-right-content {
        display: flex;
        width: 100%;
        height: 300px;
        border-width: 0.5px;
        border: 0.5px solid #1d5925;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;
        padding: 10px;
        background-color: #ffffff;
      }
    }
  }
  .ecmbody-zhanwei {
    display: flex;
    width: 1220px;
    height: 30px;
  }
  .ecmbody-info-content-form {
    width: 95%;
    margin: 0 auto;
    margin-top: 10px;
    text-align: left;
    :deep(.el-form-item--default) {
      --font-size: 16px;
      --el-form-label-font-size: var(--font-size);
      margin-bottom: 15px;
    }
    :deep(.el-form-item__label) {
      align-items: flex-start;
      box-sizing: border-box;
      color: #101010;
      display: inline-flex;
      flex: 0 0 auto;
      height: 32px;
      line-height: 32px;
      padding: 0 12px 0 0;
      font-family: Noto Sans SC;
      font-size: 16px;
    }
    .ecm-input {
      align-items: flex-start;
      box-sizing: border-box;
      color: #333f48;
      display: inline-flex;
      flex: 0 0 auto;
      line-height: 32px;
      padding: 0 12px 0 0;
      font-family: Noto Sans SC;
      font-size: 14px;
    }

    :deep(.el-radio__label) {
      font-size: var(--el-radio-font-size);
      padding-left: 8px;
      font-size: 15px;
    }
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
      color: #101010;
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
        //max-width: 100px;
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
        max-width: 100px;
        overflow: hidden;
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
  :deep(.el-dialog__title) {
    color: var(--el-text-color-primary);
    font-size: var(--el-dialog-title-font-size);
    line-height: var(--el-dialog-font-line-height);
    color: #101010;
    font-family: Noto Sans SC;
    font-weight: 500;
  }
}
</style>

<template>
  <!-- 主容器 -->
  <div class="Home">
    <!-- 顶部区域 -->
    <el-row>
      <el-col :span="24" class="Header">
        <!-- 顶部内容区域 -->
        <div class="HeaderHome">
          <!-- 主题切换按钮 -->
          <el-switch v-model="colorTheme" class="ml-2 input-button"
                     style="--el-switch-on-color: var(--el-border-color-dark); --el-switch-off-color: var(--el-border-color-light)"
                     :active-icon="Moon" :inactive-icon="Sunny" @change="handleColorThemeChange"/>
          <!-- 顶部输入框 -->
          <div class="HeaderHomeInput">
            <!-- 输入框属性与文本 -->
            <el-input v-model="HeaderHomeInputText" placeholder="请输入要搜索的内容">
              <!-- 选择下拉框 -->
              <template #prepend>
                <el-select placeholder="名字" value-key="1" style="width: 100px">
                  <el-option label="名字" value="1"/>
                  <el-option label="ID" value="2"/>
                  <el-option label="MD5" value="3"/>
                  <el-option label="文件类型" value="4"/>
                </el-select>
              </template>
              <!-- 搜索图标与按钮 -->
              <template #append>
                <el-button :icon="Search"/>
              </template>
            </el-input>
          </div>
          <!-- 用户属性区域 -->
          <div class="HeaderHomeUserInfo">
            <img :src="userAvatar" alt="用户头像" @click="imgLoginBox"/>
            <span>{{ userName }}</span>
          </div>
          <!-- 用户登录弹窗 -->
          <van-popup v-model:show="userAvatarLoginShow" round class="userLoginBox">
            <!-- 登录/注册弹窗内容 -->
            <div class="login-content">
              <h2>登录/注册</h2>
              <p>欢迎来到文件分享站</p>
              <label for="userName">用户名</label>
              <van-field id="userName" v-model="userName" center placeholder="请输入用户名"/>
              <!-- 用户名输入框 -->
              <label for="password">密码</label>
              <van-field id="password" v-model="userPassword" center type="password" placeholder="请输入用户密码"/>
              <!-- 密码输入框 -->
              <div class="actions">
                <van-button class="userLoginButton" @click="userLogin" type="primary">登录</van-button>
                <!-- 登录按钮 -->
                <van-button class="userLoginButton" @click="userEnroll" type="primary">注册后登录</van-button>
                <!-- 注册按钮 -->
              </div>
            </div>
          </van-popup>
          <!-- 用户属性弹窗 -->
          <van-popup v-model:show="userAvatarLoginShowTools" round position="top" class="userLoginBox">
            <!-- 登录弹窗 -->
            <div class="login-content">
              <h2>个人中心</h2>
              <h3>用户属性:</h3>
              <div>
                <p class="userNameId">用户ID: {{ userAboutId }} </p>
                <p class="userNameName">用户名称: {{ userAboutName }}</p>
                <p class="userNameType">用户类型:
                  <span v-if="userAboutAuth === 'admin'">管理员</span>
                  <span v-else-if="userAboutAuth === 'user'">普通用户</span>
                  <span v-else>未登录</span>
                </p>
              </div>
              <h3>功能区:</h3>
              <el-button type="primary" @click="logout">退出登录</el-button>
            </div>
          </van-popup>
        </div>
      </el-col>
    </el-row>
    <!-- 下面区域 -->
    <el-row class="LeftAndRightBox">
      <!-- 左侧区域 -->
      <el-col :span="17" class="Left">
        <div class="LeftFileList">
          <!-- 文件表格 -->
          <el-table ref="fileListTable" :data="pageFileData" class="LeftFileListData" border stripe
                    style="width: 100%">
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="文件名称" width="650"/>
            <el-table-column prop="type" label="文件格式" width="150"/>
            <el-table-column label="文件大小" width="160">
              <template #default="scope">{{ parserByteSize(scope.row.size) }}</template>
            </el-table-column>
            <el-table-column prop="uploaderName" label="上传者" width="150"/>
            <el-table-column fixed="right" label="操作" width="155">
              <!-- 操作列模板 -->
              <template #default>
                <el-button link type="primary">下载</el-button>
                <el-button link type="primary">详情</el-button>
                <el-button link type="danger">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
              @current-change="HandleCurrentChange"
              :current-page="CurrentPage"
              :page-sizes="[20]"
              :page-size="20"
              layout="prev, pager, next"
              :total="totalFileCount"
              class="Pagination"
          />
        </div>
      </el-col>
      <!-- 右侧区域 -->
      <el-col :span="7" class="Right">
        <div class="upload">
          <span>文件上传:</span>
          <el-upload
              class="upload-demo"
              drag
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              multiple
          >
            <el-icon class="el-icon--upload">
              <upload-filled/>
            </el-icon>
            <div class="el-upload__text">
              上传文件<em>点击此处</em>或拖动此处
            </div>
            <template #tip>
              <div class="el-upload__tip" style="text-align: center">
                最大文件上传限制为20GB.
              </div>
            </template>
          </el-upload>
        </div>
        <!-- 访问量统计 -->
        <span>访问量统计:</span>
        <div class="access" ref="accessDiv">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-card class="card" shadow="never" style="margin:5px 0 5px 5px">
                <template #header>
                  <span>访问量</span>
                </template>
                <div class="trafficData">12,584</div>
                <div class="trafficDataTag">同昨日增长
                  <el-tag type="success">+5%</el-tag>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="card" shadow="never" style="margin: 5px 5px 5px 0">
                <template #header>
                  <span>访问量</span>
                </template>
                <div class="trafficData">584</div>
                <div class="trafficDataTag">
                  同昨日减少
                  <el-tag type="danger">-15%</el-tag>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <canvas ref="mainCanvas" :width="mainCanvasWidth" height="400"></canvas>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script setup lang="ts">
import {Search, Moon, Sunny, UploadFilled} from '@element-plus/icons-vue';
import {ref, onMounted, markRaw} from 'vue';
import {useDark, useToggle} from "@vueuse/core"
import {GridComponent} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {LegendComponent} from 'echarts/components';
import {EChartsType} from "echarts";
import * as echarts from 'echarts/core';
import {getAllFiles, Result} from "../api/Requester.ts";
import {login} from '../api/Requester';
import {AxiosResponse} from "axios";
import {User} from "../entities/User.ts";
import {ElMessage} from "element-plus";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, LegendComponent]);

// TODO: 用户属性
const userAboutId = ref<number>(0);
const userAboutName = ref<string>("未登录");
const userAboutAuth = ref<string>("未登录");

// TODO: 头部组件
// 搜索输入框
const HeaderHomeInputText = ref('');
// 用户头像
const userAvatar = 'src/assets/userAvatar.jpg';
// 用户名
const userName = ref<string>("");
const userPassword = ref<string>("");
// 用户登录弹窗
const userAvatarLoginShow = ref<boolean>(false);
// 用户属性弹窗
const userAvatarLoginShowTools = ref<boolean>(false);
// 主题切换
const isDark = useDark();
const colorTheme = ref<boolean>(isDark.value);
const toggleDark = useToggle(isDark);
const handleColorThemeChange = () => {
  toggleDark();
}
// TODO: 左侧文件列表
// 分页相关数据
const CurrentPage = ref(1);
const totalFileCount = ref<number>(0);
const pageFileData = ref<File[]>([]);
const showAllFiles = () => {
  getAllFiles(CurrentPage.value, 20).then((res) => {
    totalFileCount.value = res.data.data.total
    pageFileData.value = res.data.data.data
  })
}
const parserByteSize = (byte: number): string => {
  if (byte < 1024) {
    return byte + 'B';
  }
  if (byte < 1024 * 1024) {
    return (byte / 1024).toFixed(2) + "KB";
  }
  if (byte < 1024 * 1024 * 1024) {
    return (byte / 1024 / 1024).toFixed(2) + "MB";
  }
  if (byte < 1024 * 1024 * 1024 * 1024) {
    return (byte / 1024 / 1024 / 1024).toFixed(2) + "GB";
  }
  return (byte / 1024 / 1024 / 1024 / 1024).toFixed(2) + "TB";
}
// 处理当前页变化
const HandleCurrentChange = (val: number) => {
  CurrentPage.value = val;
  showAllFiles();
};

// TODO: 右侧访问量统计与上传文件
// 近5日访问数据
const option = {
  xAxis: {
    type: 'category',
    data: ['大大前天', '大前天', '前天', '昨天', '今天']
  },
  yAxis: {
    type: 'value'
  },
  legend: { // 启用 legend 配置项
    data: ['访问量', '同昨日增长'], // 指定图例的标签
    orient: "vertical",
    right: 10,
    top: 'center'
  },
  series: [
    {
      name: '访问量',
      data: [820, 932, 901, 934, 1290],
      type: 'line',
      smooth: true
    },
    {
      name: '同昨日增长',
      data: [120, 132, 201, 334, 590],
      type: 'line',
      smooth: true
    }
  ]
};
// 图标长宽数据
const mainCanvas = ref<HTMLCanvasElement>();
const accessDiv = ref<HTMLDivElement>();
const charts = ref<EChartsType>();
const changeFigureSize = () => {
  if (!mainCanvas.value) {
    return;
  }
  if (!accessDiv.value) {
    return;
  }
  mainCanvas.value.width = accessDiv.value.clientWidth;
  if (charts.value) {
    charts.value.resize({"width": mainCanvas.value.width, "height": mainCanvas.value.height})
  } else {
    charts.value = markRaw(echarts.init(mainCanvas.value))
    charts.value.setOption(option)
  }
}

// TODO: 用户点击事件
// 点击用户头像弹出登录窗口
const imgLoginBox = () => {
  if (sessionStorage.getItem("userInfo") || localStorage.getItem("userInfo")) {
    // 如果本地存储中有用户信息，即用户已登录
    // 显示用户信息窗口并隐藏登录窗口
    userAvatarLoginShowTools.value = true;
    userAvatarLoginShow.value = false;
  } else {
    // 如果用户未登录，切换登录窗口的显示状态
    userAvatarLoginShow.value = !userAvatarLoginShow.value;
    userAvatarLoginShowTools.value = false;
  }
}
// 点击登录按钮
const userLogin = () => {
  // 清理本地cookie
  localStorage.removeItem("userInfo");
  sessionStorage.removeItem("userInfo");
  // 用户登录函数
  if (userName.value == "" || userPassword.value == "") {
    ElMessage.error("用户名密码不能为空");
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    return;
  }
  // 调用登录接口
  login(userName.value, userPassword.value)
      .then((res: AxiosResponse<Result<User>>) => {
        // 发送登录请求
        if (res.data.status == 200) {
          // 登录成功
          // 存储用户信息到sessionStorage
          const userInfo = {
            userName: userName.value,
            userPassword: userPassword.value,
          };
          sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
          console.log(res.data.data.name, res.data.data.id, res.data.data.auth);
          const resdata = res.data.data
          userAboutId.value = Number(resdata.id);
          userAboutName.value = String(resdata.name);
          userAboutAuth.value = String(resdata.auth)
          // 延迟一段时间后显示用户信息窗口
          setTimeout(() => {
            imgLoginBox();
          }, 1500); // 1500毫秒（1.5秒）延迟示例
          ElMessage.success("登录成功!");
        } else {
          ElMessage.error("登录失败,用户名密码错误!");
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("userInfo");
        }
      })
      .catch(() => {
        ElMessage.error("登录失败,用户名密码错误!");
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userInfo");
      });
};
const logout = () => {
  // 清除本地存储中的用户信息
  localStorage.removeItem("userInfo");
  sessionStorage.removeItem("userInfo");
  // 刷新页面
  window.location.reload();
};

// TODO: 页面加载执行
// 在页面加载时检查sessionStorage中的用户信息
const checkSessionStorageUserInfo = () => {
  if (checkedStorage) {
    return; // 如果已经检查过，不再重复执行
  }
  const userInfoString = sessionStorage.getItem("userInfo");
  if (userInfoString) {
    // 解析用户信息
    const userInfo = JSON.parse(userInfoString);
    userName.value = userInfo.userName;
    userPassword.value = userInfo.userPassword;
    // 验证用户信息
    verifyUserInfo();
  }
};

// 验证用户信息
const verifyUserInfo = () => {
  if (userName.value === "" || userPassword.value === "") {
    return; // 用户名或密码为空，不进行验证
  }
  login(userName.value, userPassword.value)
      .then((res: AxiosResponse<Result<User>>) => {
        if (res.data.status === 200) {
          console.log(res.data.data.name, res.data.data.id, res.data.data.auth);
          userAboutId.value = Number(res.data.data.id);
          userAboutName.value = String(res.data.data.name);
          userAboutAuth.value = String(res.data.data.auth)
          ElMessage.success("登录成功!");
          userAvatarLoginShowTools.value = true; // 验证成功，显示用户信息窗口
          userAvatarLoginShow.value = false; // 隐藏登录窗口
        } else {
          ElMessage.error("验证失败，请重新登录!");
          userAvatarLoginShowTools.value = false; // 验证失败，隐藏用户信息窗口
          userAvatarLoginShow.value = true; // 显示登录窗口
          localStorage.removeItem("userInfo");
          sessionStorage.removeItem("userInfo");
        }
      })
      .catch(() => {
        ElMessage.error("验证失败，请重新登录!");
        userAvatarLoginShowTools.value = false; // 验证失败，隐藏用户信息窗口
        userAvatarLoginShow.value = true; // 显示登录窗口
        localStorage.removeItem("userInfo");
        sessionStorage.removeItem("userInfo");
      });
};

// 在页面加载时检查本地存储中的用户信息
let checkedStorage = false;
const checkLocalStorageUserInfo = () => {
  if (checkedStorage) {
    return; // 如果已经检查过，不再重复执行
  }
  const userInfoString = localStorage.getItem("userInfo");
  if (userInfoString) {
    // 解析用户信息
    const userInfo = JSON.parse(userInfoString);
    userName.value = userInfo.userName;
    userPassword.value = userInfo.userPassword;
    // 验证用户信息
    verifyUserInfo();
  }
};

// TODO: onMounted实时更新
onMounted(() => {
  window.addEventListener("resize", changeFigureSize);
  changeFigureSize();
  showAllFiles();
  checkSessionStorageUserInfo();
  checkLocalStorageUserInfo();
  checkedStorage = true
})
</script>


<style scoped>
/* 顶部样式 */
.HeaderHome {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

/* 用户属性样式 */
.HeaderHomeUserInfo {
  display: flex;
  align-items: center;
}

/* 用户头像大小 */
img {
  width: 30px;
  height: 30px;
  border-radius: 10%;
  margin: 10px 10px 10px 10px;
}

.LeftAndRightBox {
  flex-direction: row;
  flex-wrap: nowrap;
  width: calc(100% - 40px);
}

/* 左侧样式 */
.Left {
  margin: 5px 5px 0 15px;
  font-size: smaller;
}

.Right {
  margin: 5px -15px 0 5px;
}

/* 分页样式 */
.Pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 设置列表高度为100% */
.LeftFileListData {
  height: 100%;
}

.card {
  border-radius: 10px;
}

.trafficData {
  font-size: 40px;
  font-weight: bold;
  line-height: 1.5;
}

.trafficDataTag {
  display: flex;
  font-size: 15px;
  font-weight: bold;
  line-height: 1.3;
}

.login-content {
  width: 45vh;
  height: 30vh;
  margin: 20px;
  top: 50%;
  left: 50%;
}

.userLoginButton {
  margin: 10px 10px 0 10px;
}
</style>

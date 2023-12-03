<template>
  <van-config-provider :theme="vantTheme"></van-config-provider>
  <!-- 主容器 -->
  <div>
    <!-- 顶部区域 -->
    <el-row>
      <el-col :span="24">
        <!-- 顶部内容区域 -->
        <div class="header">
          <!-- 顶部输入框 -->
          <div>
            <!-- 输入框属性与文本 -->
            <el-input v-model="searchInput" placeholder="请输入要搜索的内容">
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
          <div class="header-user" @click="imgLoginBox">
            <img :src="userAvatar" alt="用户头像"/>
            <span>{{ username }}</span>
          </div>
          <!-- 用户登录弹窗 -->
          <van-popup v-model:show="userAvatarLoginShow" round>
            <!-- 登录/注册弹窗内容 -->
            <div class="login-content">
              <h2>登录/注册</h2>
              <p>欢迎来到文件分享站</p>
              <label for="userName">用户名</label>
              <van-field id="userName" v-model="usernameInput" center placeholder="请输入用户名"/>
              <!-- 用户名输入框 -->
              <label for="password">密码</label>
              <van-field id="password" v-model="userPasswordInput" center type="password" placeholder="请输入用户密码"/>
              <!-- 密码输入框 -->
              <div class="actions">
                <van-button class="user-login-register-button" @click="userLogin" type="primary">登录</van-button>
                <!-- 登录按钮 -->
                <van-button class="user-login-register-button" @click="userEnroll" type="primary">注册后登录</van-button>
                <!-- 注册按钮 -->
              </div>
            </div>
          </van-popup>
          <!-- 用户属性弹窗 -->
          <van-popup v-model:show="userAvatarLoginShowTools" round>
            <!-- 登录弹窗 -->
            <div class="login-content">
              <h2>个人中心</h2>
              <h3>用户属性:</h3>
              <div>
                <p>用户名称: {{ username }}</p>
                <p>用户类型:
                  <span v-if="userAuth === Auth.ADMIN">管理员</span>
                  <span v-else-if="userAuth === Auth.USER">普通用户</span>
                  <span v-else>未登录</span>
                </p>
              </div>
              <h3>功能区:</h3>
              <el-button type="primary" @click="logout">退出登录</el-button>
            </div>
          </van-popup>
          <!-- 文件详情 -->
          <van-popup v-model:show="showFileInformation" round>
            <div class="file-information-popover">
              <h2>文件名称:<span>XXXXXXX</span></h2>
              <div>
                <p>文件ID: <span>1</span></p>
                <p>文件名: <span>测试</span></p>
                <p>文件类型: <span>exe</span></p>
                <p>文件MD5: <span>hjs7g90shds7s09ydg9s07gs90g7s7g</span></p>
                <p>文件上传者: <span>wzp</span></p>
                <p>文件上传时间: <span>2022-07-12 16:21:39</span></p>
              </div>
            </div>
          </van-popup>
        </div>
      </el-col>
    </el-row>
    <!-- 下面区域 -->
    <el-row class="main">
      <!-- 左侧区域 -->
      <el-col :span="17" class="files-data">
        <div>
          <!-- 文件表格 -->
          <el-table ref="fileListTable" :data="pageFileData" class="files-data-table" border stripe>
            <el-table-column prop="id" label="ID" width="100"/>
            <el-table-column prop="name" label="文件名称" width="650"/>
            <el-table-column prop="type" label="文件格式" width="150"/>
            <el-table-column label="文件大小" width="160">
              <template #default="scope">{{ parserByteSize(scope.row.size) }}</template>
            </el-table-column>
            <el-table-column prop="uploaderName" label="上传者" width="150"/>
            <el-table-column fixed="right" label="操作" :width="fileOptionRowWidth">
              <!-- 操作列模板 -->
              <template #default>
                <el-button link type="primary">下载</el-button>
                <el-button link type="primary" @click="showFileInformationDialog">详情</el-button>
                <el-button link type="danger" v-if="userAuth === Auth.ADMIN">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页组件 -->
          <el-pagination
              @current-change="handlerPageChange"
              :current-page="currentPage"
              :page-sizes="[20]"
              :page-size="20"
              layout="prev, pager, next"
              :total="totalFileCount"
              class="pagination"
          />
        </div>
      </el-col>
      <!-- 右侧区域 -->
      <el-col :span="7" class="file-uploader">
        <div>
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
        <div ref="accessDiv">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-card class="card" shadow="never" style="margin:5px 0 5px 5px">
                <template #header>
                  <span>访问量</span>
                </template>
                <div class="access-data"> {{ allAccess }}</div>
                <div class="access-data-increase">同昨日增长
                  <el-tag type="success">+{{ allContrastAccess }}条</el-tag>
                </div>
              </el-card>
            </el-col>
            <el-col :span="12">
              <el-card class="card" shadow="never" style="margin: 5px 5px 5px 0">
                <template #header>
                  <span>下载量</span>
                </template>
                <div class="access-data"> {{ allDownload }}</div>
                <div class="access-data-increase">
                  同昨日增加
                  <el-tag type="success">+{{ allContrastDownload }}条</el-tag>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <canvas ref="mainCanvas" height="400"></canvas>
        </div>
      </el-col>
    </el-row>
  </div>
</template>


<script setup lang="ts">
import {Search, UploadFilled} from '@element-plus/icons-vue';
import 'element-plus/theme-chalk/dark/css-vars.css'
import {ref, onMounted, computed, onBeforeMount} from 'vue';
import {useDark, useToggle} from "@vueuse/core"
import {GridComponent} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import {LegendComponent} from 'echarts/components';
import * as echarts from 'echarts/core';
import {getAllFiles, register, Result, getAccessInformation, getTotalAccessInformation} from "../api/Requester.ts";
import {login} from '../api/Requester';
import {AxiosResponse} from "axios";
import {User} from "../entities/User.ts";
import {ElMessage} from "element-plus";
import {Auth} from "../entities/Auth.ts";
import {File} from "../entities/File.ts";
import {AccessInformation} from "../entities/AccessInformation.ts";

echarts.use([GridComponent, LineChart, CanvasRenderer, UniversalTransition, LegendComponent]);

// TODO: 用户属性
const username = computed(() => {
  const username = sessionStorage.getItem("username");
  if (username) {
    return username;
  }
  return "未登录"
})
const userAuth = computed(() => {
  const authStorage = sessionStorage.getItem("auth");
  if (authStorage) {
    console.log(authStorage)
    switch (authStorage) {
      case "admin":
        return Auth.ADMIN;
      default:
        return Auth.USER;
    }
  } else {
    return "未登录"
  }
})

// TODO: 头部组件
// 搜索输入框
const searchInput = ref<string>('');
// 用户头像
const userAvatar = 'src/assets/userAvatar.jpg';
// 用户名
const usernameInput = ref<string>("");
const userPasswordInput = ref<string>("");
// 用户登录弹窗
const userAvatarLoginShow = ref<boolean>(false);
// 用户属性弹窗
const userAvatarLoginShowTools = ref<boolean>(false);
// 主题切换
const isDark = useDark()
const toggleDark = useToggle(isDark);
const vantTheme = ref<"light" | "dark">("light");
// 自动主题
const initTheme = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 7 || hour > 16){
    toggleDark(true);
    vantTheme.value = "dark";
    return;
  }
  toggleDark(false);
}
// TODO: 左侧文件列表
const showFileInformation = ref<boolean>(false);
// admin 与 user 的UI变动
const fileOptionRowWidth = computed(() => {
  switch (userAuth.value) {
    case Auth.ADMIN:
      return 160;
    default:
      return 110;
  }
});
// 分页相关数据
const currentPage = ref<number>(1);
const totalFileCount = ref<number>(0);
const pageFileData = ref<File[]>([]);
const showAllFiles = () => {
  getAllFiles(currentPage.value, 20).then((res) => {
    totalFileCount.value = res.data.data.total;
    pageFileData.value = res.data.data.data;
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
const handlerPageChange = (val: number) => {
  currentPage.value = val;
  showAllFiles();
};

// TODO: 右侧访问量统计与上传文件
// 访问情况
const option = {
  xAxis: {
    type: 'category',
    data: ['大大前天', '大前天', '前天', '昨天', '今天']
  },
  yAxis: {
    type: 'value'
  },
  legend: { // 启用 legend 配置项
    data: ['访问量', '下载量'], // 指定图例的标签
    orient: "vertical",
    right: 10,
    top: 'center'
  },
  series: [
    {
      name: '访问量',
      type: 'line',
      smooth: true
    },
    {
      name: '下载量',
      type: 'line',
      smooth: true
    }
  ]
};
// 近5日访问数据
const contrastAccess = ref<number>();
const contrastDownload = ref<number>();
const fiveData = () => {
  getAccessInformation(5)
      .then((res: AxiosResponse<AccessInformation[]>) => {
        const accessCounts = [];
        const downloadCounts = [];
        for (let datum of res.data) {
          accessCounts.push(datum.totalAccess);
          downloadCounts.push(datum.totalDownload);
        }
        option.series[0]['data'] = accessCounts;
        option.series[1]['data'] = downloadCounts;
        contrastAccess.value = res.data[4].totalAccess
        contrastDownload.value = res.data[4].totalDownload
        changeFigureSize();
      })
}
// 图表长宽数据
const mainCanvas = ref<HTMLCanvasElement>();
const accessDiv = ref<HTMLDivElement>();
let charts: echarts.ECharts;
const changeFigureSize = () => {
  if (!mainCanvas.value) {
    return;
  }
  if (!accessDiv.value) {
    return;
  }
  mainCanvas.value.width = accessDiv.value.clientWidth;
  if (charts) {
    charts.resize({"width": mainCanvas.value.width, "height": mainCanvas.value.height})
  } else {
    charts = echarts.init(mainCanvas.value);
    charts.setOption(option)
  }
}
// 所有数据总和
const allAccess = ref<number>();
const allDownload = ref<number>();
const allData = () => {
  getTotalAccessInformation()
      .then((res: AxiosResponse<AccessInformation>) => {
        allAccess.value = res.data.totalAccess
        allDownload.value = res.data.totalDownload
      })
}
// 增长数据
const allContrastAccess = contrastAccess;
const allContrastDownload = contrastDownload;

// TODO: 用户点击事件
// 点击用户头像弹出登录窗口
const imgLoginBox = () => {
  if (sessionStorage.getItem("authorization")) {
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
  sessionStorage.clear();
  // 用户登录函数
  if (usernameInput.value == "" || userPasswordInput.value == "") {
    ElMessage.error("用户名密码不能为空");
    return;
  }
  // 调用登录接口
  login(usernameInput.value, userPasswordInput.value)
      .then((res: AxiosResponse<Result<User>>) => {
        // 发送登录请求
        if (res.data.status == 200) {
          const username = res.data.data.name;
          sessionStorage.setItem("username", username);
          sessionStorage.setItem("auth", res.data.data.auth.toString());
          // 延迟一段时间后显示用户信息窗口
          setTimeout(() => {
            imgLoginBox();
          }, 1000); // 1000毫秒（1秒）延迟示例
          ElMessage.success("登录成功!");
          window.location.reload()
        } else {
          ElMessage.error("登录失败,用户名密码错误!");
        }
      })
};
// 注销登陆
const logout = () => {
  // 提醒弹窗
  ElMessage.success("退出成功!")
  // 清除本地存储中的用户信息
  sessionStorage.clear();
  userAvatarLoginShowTools.value = false;
  window.location.reload()
};
// 用户注册并登录接口
const userEnroll = () => {
  // 用户注册函数
  if (usernameInput.value == '' || userPasswordInput.value == '') {
    ElMessage.error("用户名密码不能为空")
    return;
  }
  register(usernameInput.value, userPasswordInput.value, Auth.USER).then((res) => {
    switch (res.data.status) {
      case 251:
        ElMessage.error("邀请码错误！");
        break;
      case 501:
        ElMessage.error("存在同名用户！");
        break;
      case 200:
        ElMessage.success("注册成功");
        sessionStorage.setItem("username", res.data.data.name);
        sessionStorage.setItem("auth", res.data.data.auth.toString());
        break;
      default:
        ElMessage.error("无法注册！");
    }
  });
}
// 文件详情
const showFileInformationDialog = () => {
  showFileInformation.value = true
}
// TODO: onMounted实时更新
onBeforeMount(() => {
  initTheme();
})
onMounted(() => {
  window.addEventListener("resize", changeFigureSize);
  fiveData();
  showAllFiles();
  allData();
})
</script>


<style scoped>
/* 顶部样式 */
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
}

/* 用户属性样式 */
.header-user {
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

.main {
  flex-direction: row;
  flex-wrap: nowrap;
  width: calc(100% - 40px);
}

/* 左侧样式 */
.files-data {
  margin: 5px 5px 0 15px;
  font-size: smaller;
}

.file-uploader {
  margin: 5px -15px 0 5px;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 设置列表高度为100% */
.files-data-table {
  height: 100%;
  width: 100% !important;
}

.card {
  border-radius: 10px;
}

.access-data {
  font-size: 40px;
  font-weight: bold;
  line-height: 1.5;
}

.access-data-increase {
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

.user-login-register-button {
  margin: 10px 10px 0 10px;
}

.file-information-popover {
  margin: 20px;
}
</style>

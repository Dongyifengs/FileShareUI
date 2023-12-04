<template>
  <van-config-provider :theme="vantTheme"></van-config-provider>
  <div class="MobileHome">
    <!-- 页面主体部分 -->
    <div class="head">
      <!-- 头部区域 -->
      <van-cell-group inset class="inputFileName">
        <!-- 搜索框区域 -->
        <van-field v-model="searchInput" center clearable placeholder="请输入文件名称">
          <!-- 文件名输入框 -->
          <template #button>
            <!-- 搜索按钮 -->
            <van-button size="small" type="primary" @click="handlerSearch">搜索</van-button>
          </template>
        </van-field>
      </van-cell-group>
      <!-- 用户头像 -->
      <van-image
          class="userAvatar"
          width="50"
          height="50"
          :src="userAvatar"
          radius="5"
          @click="imgLoginBox"
      />
      <van-popup v-model:show="userAvatarLoginShow" round>
        <!-- 登录/注册弹窗内容 -->
        <div class="dialog">
          <h2 v-if="isLoginMode">登录</h2>
          <h2 v-else>注册</h2>
          <p v-if="isLoginMode">欢迎回到文件分享站！</p>
          <p v-else>欢迎加入文件分享站！</p>
          <!-- 用户名输入框 -->
          <label for="username" class="login-dialog-element">用户名：</label>
          <el-input id="username" class="login-dialog-element" v-model="usernameInput" placeholder="请输入用户名"/>
          <!-- 密码输入框 -->
          <label for="password" class="login-dialog-element">密码：</label>
          <el-input id="password" class="login-dialog-element" v-model="userPasswordInput" type="password"
                    placeholder="请输入用户密码"/>
          <div v-if="!isLoginMode" class="login-dialog-element">
            <label for="registerType">注册类型：</label>
            <el-select id="registerType" v-model="registerTypeInput" placeholder="注册类型">
              <el-option key="1" label="普通用户" :value="Auth.USER"/>
              <el-option key="2" label="管理员" :value="Auth.ADMIN"/>
            </el-select>
            <div v-if="registerTypeInput == Auth.ADMIN">
              <label for="verifyCode" class="login-dialog-element">邀请码：</label>
              <el-input id="verifyCode" class="login-dialog-element" v-model="verifyCodeInput" type="password"
                        placeholder="请输入管理员用户邀请码"/>
            </div>
          </div>
          <div class="actions">
            <van-button class="user-login-register-button" @click="userLogin" type="primary" v-if="isLoginMode">
              登录
            </van-button>
            <van-button class="user-login-register-button" @click="userEnroll" type="primary" v-else>注册
            </van-button>
            <!-- 登录按钮 -->
            <van-button class="user-login-register-button" @click="isLoginMode = false;" type="primary"
                        v-if="isLoginMode">切换到注册
            </van-button>
            <van-button class="user-login-register-button" @click="isLoginMode = true;" type="primary" v-else>
              切换到登录
            </van-button>
            <!-- 注册按钮 -->
          </div>
        </div>
      </van-popup>
      <!-- 属性弹窗 -->
      <van-popup v-model:show="userAvatarLoginShowTools" round position="top" class="userLoginBox">
        <div class="dialog">
          <h2>个人中心</h2>
          <h3>用户属性:</h3>
          <div>
            <p>用户名称 {{ username }}</p>
            <p>用户类型:
              <span v-if="userAuth === Auth.ADMIN">管理员</span>
              <span v-else-if="userAuth === Auth.USER">普通用户</span>
              <span v-else>未登录</span>
            </p>
          </div>
          <h3>功能区</h3>
          <div class="uploadFile">
            <el-upload
                class="upload-demo"
                multiple
                :http-request="handleUpload"
                :before-remove="handleUploadRemove"
                :on-success="handleUploadSuccess"
                :before-upload="handleBeforeUpload"
            >
              <el-button type="primary">点击上传文件</el-button>
              <el-button type="primary" @click="genVerifyCode" v-if="userAuth == Auth.ADMIN">获取邀请码</el-button>
              <el-button type="primary" @click="logout">退出登录</el-button>
              <template #tip>
                <div class="el-upload__tip">
                  最大文件限制大小:20GB
                </div>
              </template>
            </el-upload>

          </div>
        </div>
      </van-popup>
      <!-- 文件详情 -->
      <van-popup v-model:show="showFileInformation" round>
        <div class="file-information-popover" v-if="nowSelectedFileInformation">
          <h2>文件名称:<br><span>{{ nowSelectedFileInformation.name }}</span></h2>
          <div>
            <p>文件ID: <span>{{ nowSelectedFileInformation.id }}</span></p>
            <p>文件类型: <span>{{ nowSelectedFileInformation.type }}</span></p>
            <p>文件大小: <span>{{ parserByteSize(nowSelectedFileInformation.size) }}</span></p>
            <p title="点击复制"><a class="file-hash-a" @click="copyFullHash">文件校验值:
              <span>{{ shortHash(nowSelectedFileInformation.hash) }}</span></a></p>
            <p>文件上传者: <span>{{ nowSelectedFileInformation.uploaderName }}</span></p>
            <p>文件上传时间: <span>{{ nowSelectedFileInformation.uploadTime }}</span></p>
          </div>
        </div>
        <div class="file-information-popover" v-else>
          <h2>emm，咱就是说，这个分享站好像有点bug，这个东西好像展示不出来捏:&lt;</h2>
        </div>
      </van-popup>
      <!-- 文件详情 -->
      <van-popup v-model:show="showFileInformation" round>
        <div class="file-information-popover" v-if="nowSelectedFileInformation">
          <h2>文件名称:<span>{{ nowSelectedFileInformation.name }}</span></h2>
          <div>
            <p>文件ID: <span>{{ nowSelectedFileInformation.id }}</span></p>
            <p>文件类型: <span>{{ nowSelectedFileInformation.type }}</span></p>
            <p>文件大小: <span>{{ parserByteSize(nowSelectedFileInformation.size) }}</span></p>
            <p title="点击复制"><a class="file-hash-a" @click="copyFullHash">文件校验值:
              <span>{{ shortHash(nowSelectedFileInformation.hash) }}</span></a></p>
            <p>文件上传者: <span>{{ nowSelectedFileInformation.uploaderName }}</span></p>
            <p>文件上传时间: <span>{{ nowSelectedFileInformation.uploadTime }}</span></p>
          </div>
        </div>
        <div class="file-information-popover" v-else>
          <h2>emm，咱就是说，这个分享站好像有点bug，这个东西好像展示不出来捏:&lt;</h2>
        </div>
      </van-popup>
    </div>
    <div class="fileLiteBox">
      <el-table ref="fileListTable" :data="pageFileData" class="files-data-table" border stripe>
        <el-table-column prop="id" label="ID" width="70"/>
        <el-table-column prop="name" label="文件名称" width="650"/>
        <el-table-column prop="type" label="文件格式" width="120"/>
        <el-table-column label="文件大小" width="120">
          <template #default="scope">{{ parserByteSize(scope.row.size) }}</template>
        </el-table-column>
        <el-table-column prop="uploaderName" label="上传者" width="120"/>
        <el-table-column fixed="right" label="操作" :width="fileOptionRowWidth">
          <!-- 操作列模板 -->
          <template #default="scope">
            <el-button link type="primary" @click="downloadFile(scope.row.id)">下载</el-button>
            <el-button link type="primary" @click="handlerFileInformation(scope.row)">详情</el-button>
            <el-button link type="danger" v-if="userAuth === Auth.ADMIN" @click="removeFile(scope.row.id)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div class="pagination-container">
        <el-pagination
            @current-change="handlerPageChange"
            :current-page="currentPage"
            :page-sizes="[19]"
            :page-size="19"
            layout="prev, pager, next"
            :total="totalFileCount"
            class="pagination"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import 'element-plus/theme-chalk/dark/css-vars.css'
import {computed, onBeforeMount, onMounted, ref} from 'vue';
import {useDark, useToggle} from "@vueuse/core"
import {GridComponent, LegendComponent} from 'echarts/components';
import {LineChart} from 'echarts/charts';
import {UniversalTransition} from 'echarts/features';
import {CanvasRenderer} from 'echarts/renderers';
import * as echarts from 'echarts/core';
import {
  baseUrl,
  checkUpload,
  generatorVerifyCode,
  getAllFiles,
  getLink,
  register,
  remove,
  Result,
  search,
  upload
} from "../api/Requester.ts";
import {login} from '../api/Requester';
import {AxiosResponse} from "axios";
import {User} from "../entities/User.ts";
import {UploadFile, UploadRawFile, UploadRequestOptions, ElMessage} from "element-plus";
import {Auth} from "../entities/Auth.ts";
import {File} from "../entities/File.ts";
import {Awaitable} from "element-plus/es/utils";
import {UploadAjaxError} from "element-plus/es/components/upload/src/ajax";
import {SearchType} from "../entities/SearchType.ts";

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
  switch (authStorage) {
    case "admin":
      return Auth.ADMIN;
    case "user":
      return Auth.USER;
    default:
      return "未登录";
  }
})

// TODO: 头部组件
// 搜索类型
const searchType = ref<SearchType>(SearchType.FILE_NAME);
const searchInput = ref<string>("");
// 用户头像
const userAvatar = 'src/assets/UserAvatar.jpg'
// 用户账号密码
const usernameInput = ref<string>('');
const userPasswordInput = ref<string>('');
// 用户登录弹窗
const userAvatarLoginShow = ref<boolean>(false);
// 用户属性弹窗
const userAvatarLoginShowTools = ref<boolean>(false);
// 用户登录/注册窗口模式
const isLoginMode = ref<boolean>(true);
// 注册类型
const registerTypeInput = ref<Auth>(Auth.USER);
// 邀请码
const verifyCodeInput = ref<string>("");
// 展示文件详细信息
const nowSelectedFileInformation = ref<File>();
// 下载文件
const handlerFileInformation = (file: File) => {
  showFileInformation.value = true;
  nowSelectedFileInformation.value = file;
}
// 删除文件
const downloadFile = (id: number) => {
  getLink(id).then((res: AxiosResponse<Result<string>>) => {
    window.open(baseUrl + "/api/file/download/" + res.data.data);
  })
}
const removeFile = (id: number) => {
  if (userAuth.value != Auth.ADMIN) {
    ElMessage.error("呜~你是怎么发现这个按钮的，可惜哦~不能用哦~")
    return;
  }
  remove(id).then((res: AxiosResponse<Result<boolean>>) => {
    if (res.data.data) {
      ElMessage.success("删除成功！");
      showAllFiles()
      return;
    }
    ElMessage.error("删除失败，请查看后台日志处理！");
  });
}
// 主题切换
const isDark = useDark()
const toggleDark = useToggle(isDark);
const vantTheme = ref<"light" | "dark">("light");
// 自动主题
const initTheme = () => {
  const now = new Date();
  const hour = now.getHours();
  if (hour < 7 || hour > 17) {
    toggleDark(true);
    vantTheme.value = "dark";
    return;
  }
  toggleDark(false);
}

// TODO: 文件列表
const showFileInformation = ref<boolean>(false);
// admin 与 user 的UI变动
const fileOptionRowWidth = computed(() => {
  switch (userAuth.value) {
    case Auth.ADMIN:
      return 155;
    default:
      return 110;
  }
});
// 分页相关数据
const currentPage = ref<number>(1);
const totalFileCount = ref<number>(0);
const pageFileData = ref<File[]>([]);
const isSearchType = ref<boolean>(false);
const handlerSearch = () => {
  isSearchType.value = true;
  showAllFiles();
}
const showAllFiles = () => {
  if (isSearchType.value) {
    search(currentPage.value, 19, searchType.value, searchInput.value).then((res) => {
      totalFileCount.value = res.data.data.total;
      pageFileData.value = res.data.data.data;
    }).catch(() => {
      ElMessage.error("搜索失败！");
    })
    return;
  }
  getAllFiles(currentPage.value, 19).then((res) => {
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
const shortHash = (hash: string): string => {
  return hash.substring(0, 10) + '......' + hash.substring(118, 128)
}
const copyFullHash = () => {
  if (nowSelectedFileInformation.value) {
    navigator.clipboard.writeText(nowSelectedFileInformation.value.hash);
    ElMessage.success("复制成功！");
  } else {
    ElMessage.error("你是怎么点到这个按钮的？？？");
  }

}
// 处理当前页变化
const handlerPageChange = (val: number) => {
  currentPage.value = val;
  showAllFiles();
};

// TODO: 用户点击事件
// 点击用户头像弹出登录窗口
const imgLoginBox = () => {
  if (isLogin.value) {
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
  register(usernameInput.value, userPasswordInput.value, registerTypeInput.value, verifyCodeInput.value).then((res) => {
    switch (res.data.status) {
      case 251:
        ElMessage.error("邀请码错误！");
        break;
      case 501:
        ElMessage.error("存在同名用户！");
        break;
      case 200:
        sessionStorage.setItem("username", res.data.data.name);
        sessionStorage.setItem("auth", res.data.data.auth.toString());
        setTimeout(() => {
          imgLoginBox();
        }, 1000);
        ElMessage.success("注册成功");
        window.location.reload()
        break;
      default:
        ElMessage.error("无法注册！");
    }
  });
}
/**
 * 获取管理员验证码
 */
const genVerifyCode = () => {
  if (userAuth.value != Auth.ADMIN) {
    ElMessage.error("呜~你是怎么发现这个按钮的，可惜哦~不能用哦~")
    return;
  }
  generatorVerifyCode().then((res: AxiosResponse<Result<string>>) => {
    ElMessage.success("已成功获取到邀请码：" + res.data.data + "，已复制到剪切板，有效期：15分钟");
    navigator.clipboard.writeText(res.data.data);
  })
}
const abortControllers = ref<Map<string, AbortController>>(new Map());
// 是否登录
const isLogin = computed(() => sessionStorage.getItem("authorization") != null)
/**
 * 处理上传任务删除
 * @param uploadFile 上传的文件
 */
const handleUploadRemove = (uploadFile: UploadFile): Awaitable<boolean> => {
  if (uploadFile.status !== "uploading") {
    return true;
  }
  const name = uploadFile.raw?.name as string;
  const controller = abortControllers.value.get(name);
  if (controller) {
    controller.abort("user");
    ElMessage.success("成功取消！")
    return true;
  }
  return false;
}
/**
 * 处理上传成功
 * @param _ 无用变量
 * @param uploadFile 上传的文件
 */
const handleUploadSuccess = (_: never, uploadFile: UploadFile): void => {
  ElMessage.success("文件" + uploadFile.raw?.name + "上传成功！");
}
/**
 * 上传前的预处理
 * @param rawFile 上传的文件
 */
const handleBeforeUpload = (rawFile: UploadRawFile): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    if (!isLogin.value) {
      ElMessage.error("未登录，无法上传！");
      reject();
    }
    if (abortControllers.value.has(rawFile.name)) {
      ElMessage.error("文件：" + rawFile.name + "上传失败，已存在同名文件正在上传")
      reject();
    }
    checkUpload(rawFile.name).then((res: AxiosResponse<Result<boolean>>) => {
      if (res.data.data) {
        resolve(res.data.data);
      } else {
        ElMessage.error("文件：" + rawFile.name + "上传失败，已存在同名文件");
        reject();
      }
    })
  });
}
/**
 * 处理上传请求
 * @param options 上传设置（包括上传的文件等）
 */
const handleUpload = (options: UploadRequestOptions): XMLHttpRequest | Promise<unknown> => {
  const abortController = new AbortController();
  abortControllers.value.set(options.file.name, abortController);
  let promise = upload(options, abortController);
  promise.then((response: AxiosResponse<Result<File>>) => {
    if (response.data.status == 200) {
      return;
    }
    if (response.data.status == 401) {
      ElMessage.error("文件：" + options.file.name + "上传失败，文件已存在！");
      options.onError(new UploadAjaxError("文件已存在", 401, options.method, options.action));
      return;
    }
    ElMessage.error("文件：" + options.file.name + "上传失败，" + response.data.message);
    options.onError(new UploadAjaxError(response.data.message, response.data.status, options.method, options.action));
  }).catch((error) => {
    options.onError(error)
  }).finally(() => {
    abortControllers.value.delete(options.file.name);
  });
  return promise;
}

// TODO: 页面主题
onBeforeMount(() => {
  initTheme();
})

// TODO: onMounted
onMounted(() => {
  showAllFiles();
})

</script>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.inputFileName {
  flex: 1;
  margin-right: 10px; /* 搜索框样式 */
}

.userAvatar {
  margin: 10px;
}

.userAvatar img {
  border-radius: 50px;
}

.userLoginBox {
  border-radius: 10px;
  padding: 20px; /* 登录弹窗样式 */
}

.login-content h2 {
  margin-top: 0;
}

.login-content p {
  margin-bottom: 15px;
}

.login-content label {
  display: block;
  margin-bottom: 5px; /* 登录弹窗内部文本样式 */
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px; /* 按钮区域样式 */
}

.userLoginButton {
  width: 120px; /* 登录注册按钮样式 */
}

.fileLiteBox {
  margin-top: 10px;
}

.pagination-container {
  display: flex; /* 使用Flex布局 */
  flex-direction: column; /* 垂直方向排列子元素 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  text-align: center; /* 文本水平居中对齐 */
  margin-top: 10px;
}

.dialog {
  margin: 20px;
}

.file-information-popover {
  margin: 20px;
}
</style>
<template>
  <div class="MobileHome">
    <!-- 页面主体部分 -->
    <div class="head">
      <!-- 头部区域 -->
      <van-cell-group inset class="inputFileName">
        <!-- 搜索框区域 -->
        <van-field v-model="inputFileName" center clearable placeholder="请输入文件名称">
          <!-- 文件名输入框 -->
          <template #button>
            <!-- 搜索按钮 -->
            <van-button size="small" type="primary">搜索</van-button>
          </template>
        </van-field>
      </van-cell-group>

      <van-image class="userAvatar"
                 width="50"
                 height="50"
                 src="src/assets/UserAvatar.jpg"
                 radius="5"
                 @click="toggleUserLogin"/>
      <!-- 用户头像 -->

      <van-popup
          v-model:show="userAvatarLoginShow"
          round
          position="top"
          class="userLoginBox">
        <!-- 登录弹窗 -->
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
            <van-button class="userLoginButton" @click="userEnroll" type="primary">注册</van-button>
            <!-- 注册按钮 -->
          </div>
        </div>
      </van-popup>
    </div>
    <div class="fileLiteBox">
      <el-table :data="nowFileData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="60"/>
        <el-table-column prop="name" label="文件名" width="200"/>
        <el-table-column prop="type" label="文件格式" width="180"/>
        <el-table-column prop="size" label="文件大小" width="100"/>
        <el-table-column prop="uploaderName" label="上传者" width="100"/>
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <!-- 列表操作按钮 -->
            <el-button link type="primary" size="small" @click="handleShowDetail();">
              <!-- 显示详细信息按钮 -->
              详细
            </el-button>
            <el-button link type="primary" size="small" @click="handleDownload();">下载</el-button>
            <!-- 下载按钮 -->
            <el-button link type="primary" size="small" @click="handleDelete();" v-if="isAdmin">删除
              <!-- 删除按钮，仅管理员可见 -->
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <!-- 分页控件容器 -->
        <el-pagination
            @current-change="fetchFiles"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalFiles"
            layout="prev, pager, next">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import {ElMessage} from "element-plus";
import 'element-plus/es/components/message/style/css';
import {login, register, getAllFiles, Result} from '../api/Requester';
import {User} from "../entities/User";
import {AxiosResponse} from "axios";
import {Auth} from "../entities/Auth";
import {File} from "../entities/File";

// TODO: 头部组件定义变量
const inputFileName = ref<string>('');
const userAvatarLoginShow = ref<boolean>(false);
const userName = ref<string>("");
const userPassword = ref<string>("");
const isAdmin = ref<boolean>(false); // 是否是管理员

// TODO: 分页属性配置
const currentPage = ref<number>(1);
const pageSize = ref<number>(18);
const nowFileData = ref<File[]>([]);
const totalFiles = ref<number>(0);

// TODO: 用户登录弹窗
const toggleUserLogin = () => {
  userAvatarLoginShow.value = !userAvatarLoginShow.value;
  // 切换用户登录弹窗的显示状态
};

// TODO: 用户登录接口
const userLogin = () => {
  // 用户登录函数
  if (userName.value == "" || userPassword.value == "") {
    ElMessage.error("用户名密码不能为空");
    return;
  }
  login(userName.value, userPassword.value).then((res: AxiosResponse<Result<User>>) => {
    // 发送登录请求
    if (res.data.status == 200) {
      ElMessage.success("登录成功!")
      toggleUserLogin(); // Close the login popup
    } else {
      ElMessage.error("登录失败,用户名密码错误!")
    }
  }).catch(() => {
    ElMessage.error("登录失败,用户名密码错误!")
  })
};

// TODO: 用户注册接口
const userEnroll = () => {
  // 用户注册函数
  if (userName.value == '' || userPassword.value == '') {
    ElMessage.error("用户名密码不能为空")
    return;
  }
  register(userName.value, userPassword.value, Auth.user).then((res) => {
    switch (res.data.status) {
      case 251:
        ElMessage.error("邀请码错误！");
        break;
      case 501:
        ElMessage.error("存在同名用户！");
        break;
      default:
        ElMessage.error("无法注册！");
    }
  });
}

// TODO: 获取列表文件接口
const fetchFiles = (current?: number) => {
  if (current) {
    currentPage.value = current;
  }
  getAllFiles(currentPage.value, pageSize.value).then((res) => {
    nowFileData.value = res.data.data.data;
    totalFiles.value = res.data.data.total;
  })
}

// TODO: 查看文件属性
const handleShowDetail = () => {
  console.log("查看文件属性接口");
}

// TODO: 文件下载
const handleDownload = () => {
  console.log("download");
}

// TODO: 删除文件
const handleDelete = () => {
  console.log("delete");
}

// TODO: 实时更新
onMounted(() => {
  fetchFiles();
})
</script>

<style scoped>
.head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0; /* 头部样式，包括布局和背景颜色 */
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
  background-color: #fff;
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
</style>
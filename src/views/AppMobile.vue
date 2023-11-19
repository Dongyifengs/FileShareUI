<template>
  <div class="MobileHome">
    <!-- 页面主体部分 -->
    <div class="Head">
      <!-- 头部区域 -->
      <van-cell-group inset class="InputFileName">
        <!-- 搜索框区域 -->
        <van-field v-model="InputFileName" center clearable placeholder="请输入文件名称">
          <!-- 文件名输入框 -->
          <template #button>
            <!-- 搜索按钮 -->
            <van-button size="small" type="primary">搜索</van-button>
          </template>
        </van-field>
      </van-cell-group>

      <van-image class="UserAvatar" width="50" height="50" src="src/assets/UserAvatar.jpg" @click="toggleUserLogin"/>
      <!-- 用户头像 -->

      <van-popup v-model:show="UserAvatarLoginShow" round position="top" class="UserLoginBox">
        <!-- 登录弹窗 -->
        <div class="login-content">
          <h2>登录/注册</h2>
          <p>欢迎来到文件分享站</p>
          <label for="username">用户名</label>
          <van-field id="username" v-model="UserName" center placeholder="请输入用户名"/>
          <!-- 用户名输入框 -->
          <label for="password">密码</label>
          <van-field id="password" v-model="UserPassword" center type="password" placeholder="请输入用户密码"/>
          <!-- 密码输入框 -->
          <div class="actions">
            <van-button class="UserLoginButton" @click="UserLogin" type="primary">登录</van-button>
            <!-- 登录按钮 -->
            <van-button class="UserLoginButton" @click="UserEnroll" type="primary">注册</van-button>
            <!-- 注册按钮 -->
          </div>
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {ElMessage} from "element-plus";
import 'element-plus/es/components/message/style/css'
import {login, Result} from '../api/Requester'
import {User} from "../entities/User.ts";
import {AxiosResponse} from "axios";

const InputFileName = ref('');
const UserAvatarLoginShow = ref(false);
const UserName = ref();
const UserPassword = ref();

const toggleUserLogin = () => {
  UserAvatarLoginShow.value = !UserAvatarLoginShow.value;
  // 切换用户登录弹窗的显示状态
};

const UserLogin = () => {
  // 用户登录函数
  if (UserName.value == "" || UserPassword.value == "") {
    ElMessage({
      type: 'error',
      message: `用户名或密码为空`,
      // 弹出错误消息
    })
    return
  }
  login(UserName.value, UserPassword.value).then((res: AxiosResponse<Result<User>>) => {
    // 发送登录请求
    console.log(res.data.data.name);
    if (res.data.status == 200) {
      ElMessage.success("登录成功!")
      // 登录成功消息
      toggleUserLogin()
      // 关闭登录弹窗
    } else {
      ElMessage.error("登录失败,用户名密码错误!")
      // 登录失败消息
    }
  }).catch(() => {
    ElMessage.error("登录失败,用户名密码错误!")
    // 登录失败消息
  })
};

const UserEnroll = () => {
  // 用户注册函数
  if (UserName.value != '' && UserPassword.value != '') {
    console.log('账号:' + UserName.value + '密码:' + UserPassword.value)
    ElMessage({
      type: 'success',
      message: `注册成功`,
      // 弹出成功消息
    })
  } else if (UserName.value == '') {
    ElMessage({
      type: 'error',
      message: `用户名为空`,
      // 弹出错误消息
    })
  } else if (UserPassword.value == '') {
    ElMessage({
      type: 'error',
      message: `密码为空`,
      // 弹出错误消息
    })
  } else {
    ElMessage({
      type: 'error',
      message: `当前页面加载错误`,
      // 弹出错误消息
    })
  }
};
</script>

<style scoped>
.Head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0;
  /* 头部样式，包括布局和背景颜色 */
}

.InputFileName {
  flex: 1;
  margin-right: 10px;
  /* 搜索框样式 */
}

.UserAvatar {
  border-radius: 50%;
  margin: 10px;
  /* 用户头像样式，圆形 */
}

.UserLoginBox {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
  /* 登录弹窗样式 */
}

.login-content h2 {
  margin-top: 0;
}

.login-content p {
  margin-bottom: 15px;
}

.login-content label {
  display: block;
  margin-bottom: 5px;
  /* 登录弹窗内部文本样式 */
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
  /* 按钮区域样式 */
}

.UserLoginButton {
  width: 120px;
  /* 登录注册按钮样式 */
}
</style>
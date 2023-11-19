<template>
  <div class="MobileHome">
    <div class="Head">
      <van-cell-group inset class="InputFileName">
        <van-field v-model="InputFileName" center clearable placeholder="请输入文件名称">
          <template #button>
            <van-button size="small" type="primary">搜索</van-button>
          </template>
        </van-field>
      </van-cell-group>

      <van-image class="UserAvatar" width="50" height="50" src="src/assets/UserAvatar.jpg" @click="toggleUserLogin"/>

      <van-popup v-model:show="UserAvatarLoginShow" round position="top" class="UserLoginBox">
        <div class="login-content">
          <h2>登录/注册</h2>
          <p>欢迎来到文件分享站</p>
          <label for="username">用户名</label>
          <van-field id="username" v-model="UserName" center placeholder="请输入用户名"/>
          <label for="password">密码</label>
          <van-field id="password" v-model="UserPassword" center type="password" placeholder="请输入用户密码"/>
          <div class="actions">
            <van-button class="UserLoginButton" @click="UserLogin" type="primary">登录</van-button>
            <van-button class="UserLoginButton" @click="UserEnroll" type="primary">注册</van-button>
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
};

const UserLogin = () => {
  if (UserName.value == "" || UserPassword.value == "") {
    ElMessage({
      type: 'error',
      message: `用户名或密码为空`,
    })
    return
  }
  login(UserName.value, UserPassword.value).then((res: AxiosResponse<Result<User>>) => {
    console.log(res.data.data.name);
    if (res.data.status == 200) {
      ElMessage.success("登录成功!")
      toggleUserLogin()
    } else {
      ElMessage.error("登录失败,用户名密码错误!")
    }
  }).catch(() => {
    ElMessage.error("登录失败,用户名密码错误!")
  })
};

const UserEnroll = () => {
  if (UserName.value != '' && UserPassword.value != '') {
    console.log('账号:' + UserName.value + '密码:' + UserPassword.value)
    ElMessage({
      type: 'success',
      message: `注册成功`,
    })
  } else if (UserName.value == '') {
    console.log('账号:' + UserName.value + '密码:' + UserPassword.value)
    ElMessage({
      type: 'error',
      message: `用户名为空`,
    })
  } else if (UserPassword.value == '') {
    console.log('账号:' + UserName.value + '密码:' + UserPassword.value)
    ElMessage({
      type: 'error',
      message: `密码为空`,
    })
  } else {
    console.log('账号:' + UserName.value + '密码:' + UserPassword.value)
    ElMessage({
      type: 'error',
      message: `当前页面加载错误`,
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
}

.InputFileName {
  flex: 1;
  margin-right: 10px;
}

.UserAvatar {
  border-radius: 50%;
  margin: 10px;
}

.UserLoginBox {
  background-color: #fff;
  border-radius: 10px;
  padding: 20px;
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
}

.actions {
  display: flex;
  justify-content: space-around;
  margin-top: 20px;
}

.UserLoginButton {
  width: 120px;
}
</style>

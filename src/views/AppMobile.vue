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

      <van-image class="UserAvatar"
                 width="50"
                 height="50"
                 src="src/assets/UserAvatar.jpg"
                 radius="5"
                 @click="toggleUserLogin"/>
      <!-- 用户头像 -->

      <van-popup
          v-model:show="UserAvatarLoginShow"
          round
          position="top"
          class="UserLoginBox">
        <!-- 登录弹窗 -->
        <div class="login-content">
          <h2>登录/注册</h2>
          <el-button link type="primary" size="small" @click="fetchFiles">获取文件列表 - 测试</el-button>
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
    <div class="FileLiteBox">
      <el-table :data="currentData" border style="width: 100%">
        <el-table-column prop="id" label="ID" width="40"/>
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
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-size="pageSize"
            :total="totalItems"
            layout="prev, pager, next">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, computed} from "vue";
import {ElMessage} from "element-plus";
import 'element-plus/es/components/message/style/css';
import {login, register, Result, getAllFiles} from '../api/Requester';
import {User} from "../entities/User.ts";
import {AxiosResponse} from "axios";
import {Auth} from "../entities/Auth.ts";

const InputFileName = ref('');
const UserAvatarLoginShow = ref(false);
const UserName = ref();
const UserPassword = ref();
const isAdmin = ref(false); // 是否是管理员
// 分页
const currentPage = ref(1);
const pageSize = ref(5);
const TableDataFile = [
  {
    "downloadCount": 0,
    "hash": "80bd1104e15f52c1e3acab6ab2a0c0a9548f7d2f6310d37817be1d68c973a2ecb90a10630c8f403a5770caf1060f5a161a0ce1760900b2d9149ae484179f6c5b",
    "id": 3,
    "name": "orztqriypljbbqdhggcz",
    "size": 785,
    "type": "tj",
    "uploadTime": "2023-11-19 14:38:24",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "6ab4a3a84f37a4b41bacdf604fea06107c835a9f4d42c43f09d964fa70b0ea8766feacf70bf734447cf981d5e5b27df0ac04ef3c32233fbd5354ddaafa2808ca",
    "id": 4,
    "name": "mnmvapdgquwqocbiwtdkzl",
    "size": 880,
    "type": "gxtog",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "36b90ac358b56f4ff25b4506a76cbc656fa1cceaed47e6f5f8bbdb1b3a612df66edb85e11f4057252011565147c1ee9b5d41e50070dc36ae6eee08f5e6d34dc9",
    "id": 5,
    "name": "jlzkunryl",
    "size": 543,
    "type": "zrv",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "1a37c0298eabe1c2bc0414ba9b33ebcc487e5e6fc879f07ade56ec4c74bc5555ced1ff78dbeca637cd1941cd7cd4ce5c8089f241c5cbfd56eddd284b76ac1ef7",
    "id": 6,
    "name": "dswqhfqskdagcbfckwpndfatd",
    "size": 526,
    "type": "esjvu",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "ce5658a5607b9789183628a270cf07218f34a892eb1cba7eb6bd4a7975e00f2610109b34c1dcac997557e13e75fcf3ae13b7975fe368203f5f68490ee591b94a",
    "id": 7,
    "name": "piocnpmktwxbb",
    "size": 898,
    "type": "vcggc",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "9b7e885939e62cfc5826ed91503fb6416996ea1508453cb750355d6c70256d3a95b9122c7da8daec659d72ef3e3e98b6f770c4c54effd33f34a915260a25a72f",
    "id": 8,
    "name": "wxmnzwfbk",
    "size": 609,
    "type": "cm",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "045a8e81558d7d7f14fd06c52ac4055eeaea5aee6fb3f8dbd320fe25a389784e1349ba5d9c4ca63b7de957d86a21412716db72723ac12d1f0a276f7f3c862e8e",
    "id": 9,
    "name": "zqrnpauhvwzbavicgej",
    "size": 656,
    "type": "kt",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "7f288c84ca711e79d50bf4286f88f6e73ff49248c8285d93b52077e921bf414e0fd98f98a396422c15ade33bafedbf0e1cffa78ce63caa93d200f015609d8aea",
    "id": 10,
    "name": "zxblkv",
    "size": 593,
    "type": "q",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "73371bf6b11cb599e63047ced75d141908158ec386f403a7cfd9cf75116b2543e7248f5fe83dac61d076e5e59a82b4f352fdc19cebaa12566b0a2d467bd1f885",
    "id": 11,
    "name": "wdhdrvnphlqpxptnsn",
    "size": 883,
    "type": "vno",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  },
  {
    "downloadCount": 0,
    "hash": "a387498ffd84522c954fe1bcde7b0f98212bfbda59fb785b482345b59bf3f17da8c5595378564e3cd5e187f4ae99558b0ac624bfa5c3f147e6412c9797c45cc4",
    "id": 12,
    "name": "ccyqhcbggcgeoarmxydndshw",
    "size": 579,
    "type": "zu",
    "uploadTime": "2023-11-19 14:38:47",
    "uploaderName": "wzp"
  }
]
const totalItems = ref(TableDataFile.length);

const fetchFiles = () => {
  const currentPage = ref(1);
  const pageSize = ref(15); // 设置每页数据量为15
  // res.data.data.date.length 长度
  // res.data.data.date[x] 文件,从0开始
  // res.data.data.date[0].downloadCount 下载次数
  // res.data.data.date[0].hash 文件hash
  // res.data.data.date[0].id 文件id
  // res.data.data.date[0].name 文件名
  // res.data.data.date[0].size 文件大小
  // res.data.data.date[0].type 文件类型
  // res.data.data.date[0].uploadTime 上传时间
  // res.data.data.data[0].uploaderName 上传者
  // res.data.data.total 总文件
  // res.data.message 返回消息
  // res.data.status 状态码
  // res.data.timestamp 访问时间
  getAllFiles(currentPage.value, pageSize.value).then((res) => {
    console.log(res.data);
  })
};

const toggleUserLogin = () => {
  UserAvatarLoginShow.value = !UserAvatarLoginShow.value;
  // 切换用户登录弹窗的显示状态
};

const UserLogin = () => {
  // 用户登录函数
  if (UserName.value == "" || UserPassword.value == "") {
    ElMessage.error("用户名密码不能为空");
    return;
  }
  login(UserName.value, UserPassword.value).then((res: AxiosResponse<Result<User>>) => {
    // 发送登录请求
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
  // 用户注册函数
  if (UserName.value == '' || UserPassword.value == '') {
    ElMessage.error("用户名密码不能为空")
    return;
  }
  register(UserName.value, UserPassword.value, Auth.user).then((res) => {
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

const handleShowDetail = () => {
  console.log("detail");
}

const handleDownload = () => {
  console.log("download");
}

const handleDelete = () => {
  console.log("delete");
}

const currentData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return TableDataFile.slice(start, end);
});
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};

const handleSizeChange = (val: number) => {
  pageSize.value = val;
};

</script>

<style scoped>
.Head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #f0f0f0; /* 头部样式，包括布局和背景颜色 */
}

.InputFileName {
  flex: 1;
  margin-right: 10px; /* 搜索框样式 */
}

.UserAvatar {
  margin: 10px;
}

.UserAvatar img {
  border-radius: 50px;
}

.UserLoginBox {
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

.UserLoginButton {
  width: 120px; /* 登录注册按钮样式 */
}

.FileLiteBox {
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
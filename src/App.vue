<template>
  <div class="Home">
    <!-- 主页顶部部分 -->
    <el-row class="HomeHead">
      <el-col :span="24">
        <div>
          <!-- 搜索输入框 -->
          <el-input class="InputText" v-model="searchInput" placeholder="请输入你要搜索的文件名称">
            <!-- 搜索按钮 -->
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="HomeHeadAvatar">
          <!-- 用户头像 -->
          <el-avatar class="Avatar" shape="square" :size="35" @click="showPopup">头像</el-avatar>
          <!-- 用户登录弹出框 -->
          <van-popup v-model:show='show' round position="bottom" :style="{ height: '30%' }">
            <div class="HomeHeadUserLogin">
              <h4>账号:</h4>
              <!-- 用户名输入框 -->
              <el-input v-model="username" placeholder="请输入账号"/>
              <h4>密码:</h4>
              <!-- 密码输入框 -->
              <el-input v-model="userPassword" show-password placeholder="请输入密码"/>
              <!-- 登录按钮 -->
              <el-button @click="userLogin" type="primary" class="UserLoginButton">登录</el-button>
            </div>
          </van-popup>
        </div>
      </el-col>
    </el-row>
    <!-- 主页左右布局 -->
    <el-row>
      <el-col :span="leftColumnSpan" class="Left">
        <!-- 文件列表表格 -->
        <el-table :data="pagedTableData" style="width: 100%" :empty-text="'暂无数据'">
          <el-table-column prop="id" label="ID" width="50"/>
          <el-table-column prop="fileName" label="文件名" width="150"/>
          <el-table-column prop="format" label="文件格式" width="100"/>
          <el-table-column prop="fileSize" label="文件大小" width="100"/>
          <el-table-column prop="uploader" label="上传者" width="100"/>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <!-- 下载按钮 -->
              <el-button link type="primary" size="small" @click="handleDownload(scope.row)">下载</el-button>
              <!-- 详细信息按钮 -->
              <el-button link type="info" size="small" @click="handleAbout(scope.row)">详细</el-button>
              <!-- 删除按钮 (管理员权限 TODO) -->
              <!-- <el-button link type="danger" size="small" @click="handleDelete(scope.row)" >删除</el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="LeftAndRightContainer">
          <el-pagination
              :page-size="pageSize"
              :pager-count="pagerCount"
              layout="prev, pager, next"
              :total="totalItems"
              @current-change="handlePageChange"
          />
        </div>
      </el-col>
      <el-col :span="rightColumnSpan" class="Right">
        Right
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch, computed} from 'vue'; // 导入Vue 3的相关模块
import {useWindowSize} from '@vueuse/core'; // 导入窗口大小监测的工具函数

// 左侧栏宽度变量
const leftColumnSpan = ref(18); // 创建左侧栏宽度的响应式变量并初始化为18
// 右侧栏宽度变量
const rightColumnSpan = ref(6); // 创建右侧栏宽度的响应式变量并初始化为6
const {width} = useWindowSize(); // 使用useWindowSize()函数获取窗口宽度
const searchInput = ref(''); // 创建搜索输入框的响应式变量并初始化为空字符串
// 原始文件列表数据
const originalTableData: TableRow[] = []; // 创建原始文件列表数据数组
const randomDataRowCount = 1000; // 随机生成文件数据的数量上限
for (let i = 1; i < randomDataRowCount; i++) {
  originalTableData.push({
    id: i,
    fileName: "测试文件" + i,
    format: 'ttf',
    fileSize: (Math.random() * 1023).toFixed(0) + "kb",
    uploader: "MoYiJiangNan"
  });
}
// 文件列表数据
const tableData = ref(originalTableData); // 创建文件列表数据的响应式变量并初始化为原始数据
// 定义分页相关变量
const pageSize = ref(15); // 每页显示的数据数量
const pagerCount = ref(7); // 分页器显示的页码按钮数量
const totalItems = ref(tableData.value.length); // 总数据条数
const currentPage = ref(1); // 当前页数
// 计算分页后的文件列表数据
const pagedTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value; // 计算当前页的起始索引
  const endIndex = startIndex + pageSize.value; // 计算当前页的结束索引
  return tableData.value.slice(startIndex, endIndex); // 返回分页后的数据
});
const username = ref(); // 用户名输入框的响应式变量
const userPassword = ref(); // 密码输入框的响应式变量

// 处理分页切换事件
const handlePageChange = (page: number) => {
  currentPage.value = page; // 更新当前页数
};
// 搜索功能
const handleSearch = () => {
  const query = searchInput.value.trim().toLowerCase(); // 获取搜索关键字并转换为小写
  if (!query) {
    // 如果搜索关键字为空，显示全部文件
    tableData.value = originalTableData;
  } else {
    // 根据搜索关键字过滤文件列表
    tableData.value = originalTableData.filter((item) => {
      return item.fileName.toLowerCase().includes(query);
    });
  }
  currentPage.value = 1; // 重置当前页为第一页
  totalItems.value = tableData.value.length; // 更新总数据条数
};
// 更新左侧栏宽度函数
const updateLeftColumnSpan = () => {
  if (width.value <= 768) {
    leftColumnSpan.value = 24; // 如果窗口宽度小于等于768px，左侧栏占满整行
    rightColumnSpan.value = 0; // 右侧栏不显示
  } else {
    leftColumnSpan.value = 18; // 如果窗口宽度大于768px，左侧栏占18列
    rightColumnSpan.value = 6; // 右侧栏占6列
  }
};
onMounted(updateLeftColumnSpan); // 在组件挂载后调用updateLeftColumnSpan函数
watch(width, updateLeftColumnSpan); // 监听窗口宽度变化并调用updateLeftColumnSpan函数

// 为您的表格中的row定义一个接口类型
interface TableRow {
  id: number;
  fileName: string;
  format: string;
  fileSize: string;
  uploader: string;
}

// 点击下载按钮的处理函数
const handleDownload = (row: TableRow) => {
  console.log('点击下载按钮', row);
  alert('下载功能暂未实现' + row.id);
};

// 详细信息
const handleAbout = (row: TableRow) => {
  console.log('点击详细信息按钮', row);
  alert('详细信息功能暂未实现' + row.id);
};

const userLogin = () => {
  console.log(username.value, userPassword.value);
};

const show = ref(false); // 弹出框显示状态的响应式变量
const showPopup = () => {
  show.value = true; // 显示弹出框
};
</script>

<style scoped>
/* 样式作用范围被限制在当前组件内 */

/* 主页顶部部分样式 */
.HomeHead {
  width: calc(100% - 20px); /* 宽度为屏幕宽度减去20像素 */
  height: 5ch; /* 高度为5字符高度 */
  margin: 10px 10px 10px 10px; /* 外边距，上右下左均为10像素 */
  display: flex; /* 使用Flex布局 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  text-align: center; /* 文本水平居中对齐 */
}

/* 左右容器样式 */
.LeftAndRightContainer {
  display: flex; /* 使用Flex布局 */
  flex-direction: column; /* 垂直方向排列子元素 */
  justify-content: center; /* 水平居中对齐 */
  align-items: center; /* 垂直居中对齐 */
  text-align: center; /* 文本水平居中对齐 */
}

/* 左侧栏样式 */
.Left {
  flex: 0 0 calc(75% - 5px); /* 占用75%的宽度，不可伸缩，减去5像素的间隔 */
  margin: 0 10px 0 0; /* 外边距，上右下左分别为0 10px 0 0 */
}

/* 右侧栏样式 */
.Right {
  flex: 0 0 calc(25% - 5px); /* 占用25%的宽度，不可伸缩，减去5像素的间隔 */
  background-color: green; /* 背景颜色为绿色 */
}

/* 媒体查询，用于移动屏幕 */
@media (max-width: 768px) {
  .Right {
    display: none; /* 隐藏右侧栏 */
  }

  .Left {
    flex: 0 0 100%; /* 左侧栏占满整个宽度 */
    margin: 0; /* 调整外边距 */
  }

  /* 您可以在这里为移动屏幕添加更多样式调整 */
}

/* 用户头像样式 */
.Avatar {
  float: right; /* 右浮动 */
  margin: 0 5px 0 0; /* 外边距，上右下左分别为0 5px 0 0 */
}

/* 搜索输入框样式 */
.InputText {
  float: left; /* 左浮动 */
  margin: 0 0 0 5px; /* 外边距，上右下左分别为0 0 0 5px */
  width: 80%; /* 宽度占80% */
}

/* 用户登录框样式 */
.HomeHeadUserLogin {
  margin: 10px 30px 0 30px; /* 外边距，上右下左分别为10px 30px 0 30px */
  text-align: left; /* 文本左对齐 */
}

/* 用户登录按钮样式 */
.UserLoginButton {
  width: 80%; /* 宽度占80% */
  margin: 20px; /* 外边距，上下均为20px */
}
</style>
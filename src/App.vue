<template>
  <div class="Home">
    <!-- 主页顶部部分 -->
    <el-row class="HomeHead">
      <el-col :span="24">
        <div>
          <!-- 搜索输入框 -->
          <el-input class="InputText" v-model="searchInput" placeholder="请输入你要搜索的文件名称">
            <template #append>
              <el-button @click="handleSearch">搜索</el-button>
            </template>
          </el-input>
        </div>
        <div class="HomeHeadAvatar">
          <!-- 用户头像 -->
          <el-avatar class="Avatar" shape="square" :size="35">头像</el-avatar>
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
              <!-- 详细信息 -->
              <el-button link type="info" size="small" @click="handleAbout(scope.row)">详细</el-button>
              <!-- 删除按钮 -->
              <!-- TODO: 管理员权限 -->
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
import {ref, onMounted, watch, computed} from 'vue';
import {useWindowSize} from '@vueuse/core';
import {Table} from "element-plus";

// 左侧栏宽度变量
const leftColumnSpan = ref(18);
// 右侧栏宽度变量
const rightColumnSpan = ref(6);
const {width} = useWindowSize();
const searchInput = ref('');
// 原始文件列表数据
const originalTableData: TableRow[] = [];
const randomDataRowCount = 1000;
const userName = "MoYiJiangNan";
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
const tableData = ref(originalTableData);
// 定义分页相关变量
const pageSize = ref(15);
const pagerCount = ref(7);
const totalItems = ref(tableData.value.length);
const currentPage = ref(1);
// 计算分页后的文件列表数据
const pagedTableData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return tableData.value.slice(startIndex, endIndex);
});

// 处理分页切换事件
const handlePageChange = (page: number) => {
  currentPage.value = page;
};
// 搜索功能
const handleSearch = () => {
  const query = searchInput.value.trim().toLowerCase();
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
  totalItems.value = tableData.value.length; // 更新 totalItems
};
// 更新左侧栏宽度函数
const updateLeftColumnSpan = () => {
  if (width.value <= 768) {
    leftColumnSpan.value = 24;
    rightColumnSpan.value = 0;
  } else {
    leftColumnSpan.value = 18;
    rightColumnSpan.value = 6;
  }
};
onMounted(updateLeftColumnSpan);
watch(width, updateLeftColumnSpan);

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

// 点击删除按钮的处理函数
// const handleDelete = (row: TableRow) => {
//   console.log('点击删除按钮', row);
//   alert('删除功能暂未实现' + row.id);
// };
</script>

<style scoped>
.HomeHead {
  width: calc(100% - 20px);
  height: 5ch;
  margin: 10px 10px 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.LeftAndRightContainer {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.Left {
  flex: 0 0 calc(75% - 5px);
  background-color: yellow;
  margin: 0 10px 0 0;
}

.Right {
  flex: 0 0 calc(25% - 5px);
  background-color: green;
}

/* 媒体查询 - 针对手机端屏幕 */
@media (max-width: 768px) {
  .Right {
    display: none; /* 隐藏 Right 模块 */
  }

  .Left {
    flex: 0 0 100%; /* Left 模块占据全部可用空间 */
    margin: 0; /* 调整边距 */
  }

  /* 可以添加更多针对手机端的样式调整 */
}

.Avatar {
  float: right;
  margin: 0 5px 0 0;
}

.InputText {
  float: left;
  margin: 0 0 0 5px;
  width: 80%;
}
</style>
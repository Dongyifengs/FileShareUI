<template>
  <div class="Home">
    <!-- 主页顶部部分 -->
    <el-row class="HomeHead">
      <el-col :span="24">
        <div>
          <!-- 搜索输入框 -->
          <el-input class="InputText" v-model="searchInput" placeholder="请输入你要搜索的文件名称">
            <template #append>搜索</template>
          </el-input>
        </div>
        <div class="HomeHeadAvatar">
          <!-- 用户头像 -->
          <el-avatar class="Avatar" shape="square" :size="35">头像</el-avatar>
        </div>
      </el-col>
    </el-row>
    <!-- 主页左右布局 -->
    <el-row class="LeftAndRight">
      <el-col :span="leftColumnSpan" class="Left">
        <!-- 文件列表表格 -->
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="id" label="ID" width="50"/>
          <el-table-column prop="fileName" label="文件名" width="150"/>
          <el-table-column prop="format" label="文件格式" width="100"/>
          <el-table-column prop="fileSize" label="文件大小" width="100"/>
          <el-table-column prop="uploader" label="上传者" width="100"/>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default>
              <!-- 下载按钮 -->
              <el-button link type="primary" size="small" @click="handleDownload">下载</el-button>
              <!-- 删除按钮 -->
              <el-button link type="danger" size="small" @click="handleDelete">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="rightColumnSpan" class="Right">
        Right
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {ref, onMounted, watch} from 'vue';
import {useWindowSize} from '@vueuse/core';

// 左侧栏宽度变量
const leftColumnSpan = ref(18);
// 右侧栏宽度变量
const rightColumnSpan = ref(6);
const {width} = useWindowSize();
const searchInput = ref('');
// 文件列表数据
const tableData = [
  {'id': 1, 'fileName': '文件名称Test_1', 'format': 'ttf', 'fileSize': '10001kb', 'uploader': 'MoYiJiangNan'},
  {'id': 2, 'fileName': '文件名称Test_2', 'format': 'ttf', 'fileSize': '10002kb', 'uploader': 'MoYiJiangNan'},
  {'id': 3, 'fileName': '文件名称Test_3', 'format': 'ttf', 'fileSize': '10003kb', 'uploader': 'MoYiJiangNan'},
  {'id': 4, 'fileName': '文件名称Test_4', 'format': 'ttf', 'fileSize': '10004kb', 'uploader': 'MoYiJiangNan'},
  {'id': 5, 'fileName': '文件名称Test_5', 'format': 'ttf', 'fileSize': '10005kb', 'uploader': 'MoYiJiangNan'},
  {'id': 6, 'fileName': '文件名称Test_6', 'format': 'ttf', 'fileSize': '10006kb', 'uploader': 'MoYiJiangNan'},
  {'id': 7, 'fileName': '文件名称Test_7', 'format': 'ttf', 'fileSize': '10007kb', 'uploader': 'MoYiJiangNan'},
  {'id': 8, 'fileName': '文件名称Test_8', 'format': 'ttf', 'fileSize': '10008kb', 'uploader': 'MoYiJiangNan'},
  {'id': 9, 'fileName': '文件名称Test_9', 'format': 'ttf', 'fileSize': '10009kb', 'uploader': 'MoYiJiangNan'},
  {'id': 10, 'fileName': '文件名称Test_10', 'format': 'ttf', 'fileSize': '10010kb', 'uploader': 'MoYiJiangNan'},
  {'id': 11, 'fileName': '文件名称Test_11', 'format': 'ttf', 'fileSize': '10011kb', 'uploader': 'MoYiJiangNan'},
  {'id': 12, 'fileName': '文件名称Test_12', 'format': 'ttf', 'fileSize': '10012kb', 'uploader': 'MoYiJiangNan'},
  {'id': 13, 'fileName': '文件名称Test_13', 'format': 'ttf', 'fileSize': '10013kb', 'uploader': 'MoYiJiangNan'},
  {'id': 14, 'fileName': '文件名称Test_14', 'format': 'ttf', 'fileSize': '10014kb', 'uploader': 'MoYiJiangNan'},
  {'id': 15, 'fileName': '文件名称Test_15', 'format': 'ttf', 'fileSize': '10015kb', 'uploader': 'MoYiJiangNan'},
  {'id': 16, 'fileName': '文件名称Test_16', 'format': 'ttf', 'fileSize': '10016kb', 'uploader': 'MoYiJiangNan'},
  {'id': 17, 'fileName': '文件名称Test_17', 'format': 'ttf', 'fileSize': '10017kb', 'uploader': 'MoYiJiangNan'},
  {'id': 18, 'fileName': '文件名称Test_18', 'format': 'ttf', 'fileSize': '10018kb', 'uploader': 'MoYiJiangNan'},
  {'id': 19, 'fileName': '文件名称Test_19', 'format': 'ttf', 'fileSize': '10019kb', 'uploader': 'MoYiJiangNan'},
  {'id': 20, 'fileName': '文件名称Test_20', 'format': 'ttf', 'fileSize': '10020kb', 'uploader': 'MoYiJiangNan'},
];

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

// 点击下载按钮的处理函数
const handleDownload = () => {
  console.log('点击下载按钮');
};

// 点击删除按钮的处理函数
const handleDelete = () => {
  console.log('点击删除按钮');
};
</script>

<style scoped>
/* 样式部分 */
.HomeHead {
  width: calc(100% - 20px);
  height: 5ch;
  margin: 10px 10px 10px 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.LeftAndRight {
  height: calc(100vh - 5ch - 30px);
  margin: 0 10px 10px 10px;
  display: flex;
  justify-content: center;
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
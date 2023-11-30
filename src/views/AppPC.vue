<template>
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
            <img :src="userAvatar" alt="用户头像"/>
            <span>{{ userName }}</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- 下面区域 -->
    <el-row class="LeftAndRightBox">
      <!-- 左侧区域 -->
      <el-col :span="17" class="Left">
        <div class="LeftFileList">
          <!-- 文件表格 -->
          <el-table ref="fileListTable" :data="pagedLeftFileListData" class="LeftFileListData" border stripe
                    style="width: 100%">
            <el-table-column prop="LeftFileListDataID" label="ID" width="100"/>
            <el-table-column prop="LeftFileListDataName" label="文件名称" width="650"/>
            <el-table-column prop="LeftFileListDataFormat" label="文件格式" width="150"/>
            <el-table-column prop="LeftFileListDataSize" label="文件大小" width="160"/>
            <el-table-column prop="LeftFileListDataUpLoader" label="上传者" width="150"/>
            <el-table-column prop="LeftFileListDataOption" fixed="right" label="操作" width="155">
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
              :total="LeftFileListData.length"
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
        <div class="access">
          <el-row :gutter="24">
            <el-col :span="12">
              <el-card class="card" shadow="never" style="margin:10px 0 5px 5px">
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
              <el-card class="card" shadow="never" style="margin: 10px 5px 5px 0">
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
// 导入ElementIcon
import {Search, Moon, Sunny, UploadFilled} from '@element-plus/icons-vue';
// 导入ref
import {ref, computed} from 'vue';
import {useDark, useToggle} from "@vueuse/core"


// 主题切换
const isDark = useDark();
const colorTheme = ref<boolean>(isDark.value);
const toggleDark = useToggle(isDark);
const handleColorThemeChange = () => {
  toggleDark();
}
// 搜索输入框
const HeaderHomeInputText = ref('');
// 用户头像
const userAvatar = 'src/assets/userAvatar.jpg';
// 用户名
const userName = 'MoYiJiangNans';
// 文件列表数据
const LeftFileListData = [
  {
    LeftFileListDataID: 1,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 2,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 3,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 4,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 5,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 6,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 7,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 8,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 9,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 10,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 11,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 12,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 13,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 14,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 15,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 16,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 17,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 18,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 19,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 20,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 21,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 22,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 23,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 24,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 25,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 26,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 27,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 28,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 29,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
  {
    LeftFileListDataID: 30,
    LeftFileListDataName: 'Everything-1.4.1.1024.x86-Setup',
    LeftFileListDataFormat: 'exe',
    LeftFileListDataSize: '1748 KB',
    LeftFileListDataUpLoader: 'MoYiJiangNans',
  },
];

// 分页相关数据
// 当前页数
const CurrentPage = ref(1);
// 每页显示的条数
const pageSize = ref(20);

// 处理当前页变化
const HandleCurrentChange = (val: number) => {
  CurrentPage.value = val;
};

// 计算属性，根据当前页和每页条数来截取数据
const pagedLeftFileListData = computed(() => {
  const startIndex = (CurrentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return LeftFileListData.slice(startIndex, endIndex);
});
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
</style>

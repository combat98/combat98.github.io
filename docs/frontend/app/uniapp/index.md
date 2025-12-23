
# uni-app

## 概述

uni-app 是一个使用 Vue.js 开发所有前端应用的框架，开发者编写一套代码，可发布到 iOS、Android、Web（响应式）、以及各种小程序等多个平台。

### 特点

- **一次开发，多端发布**：支持 10+ 平台
- **Vue.js 语法**：熟悉的开发体验
- **丰富的组件**：内置大量 UI 组件
- **完善的生态**：插件市场、云服务
- **性能优秀**：接近原生应用性能

## 快速开始

```bash
# 使用 HBuilderX（推荐）
# 下载 HBuilderX：https://www.dcloud.io/hbuilderx.html
# 新建 → uni-app 项目

# 使用 Vue CLI
npm install -g @vue/cli
vue create -p dcloudio/uni-preset-vue my-project
cd my-project
npm run dev:mp-weixin  # 微信小程序
npm run dev:h5         # H5
npm run dev:app        # App
```

## 项目结构

```
my-project/
├── pages/              # 页面文件
│   ├── index/
│   │   └── index.vue
│   └── user/
│       └── user.vue
├── static/             # 静态资源
├── components/         # 组件
├── uni_modules/        # uni-app 插件
├── App.vue            # 应用配置
├── main.js            # 入口文件
├── manifest.json      # 应用配置
└── pages.json         # 页面路由配置
```

## 页面配置

```json
// pages.json
{
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "首页"
      }
    },
    {
      "path": "pages/user/user",
      "style": {
        "navigationBarTitleText": "我的"
      }
    }
  ],
  "globalStyle": {
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "uni-app",
    "navigationBarBackgroundColor": "#F8F8F8",
    "backgroundColor": "#F8F8F8"
  },
  "tabBar": {
    "color": "#7A7E83",
    "selectedColor": "#3cc51f",
    "borderStyle": "black",
    "backgroundColor": "#ffffff",
    "list": [
      {
        "pagePath": "pages/index/index",
        "iconPath": "static/home.png",
        "selectedIconPath": "static/home-active.png",
        "text": "首页"
      },
      {
        "pagePath": "pages/user/user",
        "iconPath": "static/user.png",
        "selectedIconPath": "static/user-active.png",
        "text": "我的"
      }
    ]
  }
}
```

## 基础组件

```vue
<template>
  <view class="container">
    <!-- 视图容器 -->
    <view class="box">View</view>
    
    <!-- 滚动视图 -->
    <scroll-view scroll-y="true" style="height: 200px;">
      <view v-for="item in 20" :key="item">Item {{ item }}</view>
    </scroll-view>
    
    <!-- 文本 -->
    <text>{{ message }}</text>
    
    <!-- 图片 -->
    <image src="/static/logo.png" mode="aspectFit"></image>
    
    <!-- 按钮 -->
    <button type="primary" @click="handleClick">点击</button>
    
    <!-- 输入框 -->
    <input v-model="inputValue" placeholder="请输入" />
    
    <!-- 列表 -->
    <view v-for="item in list" :key="item.id">
      {{ item.name }}
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      message: 'Hello uni-app',
      inputValue: '',
      list: []
    }
  },
  methods: {
    handleClick() {
      uni.showToast({
        title: '点击了按钮',
        icon: 'success'
      });
    }
  }
}
</script>

<style>
.container {
  padding: 20rpx;
}
</style>
```

## 生命周期

```vue
<script>
export default {
  // 应用生命周期（App.vue）
  onLaunch() {
    console.log('App Launch');
  },
  onShow() {
    console.log('App Show');
  },
  onHide() {
    console.log('App Hide');
  },
  
  // 页面生命周期
  onLoad(options) {
    console.log('Page Load', options);
  },
  onShow() {
    console.log('Page Show');
  },
  onReady() {
    console.log('Page Ready');
  },
  onHide() {
    console.log('Page Hide');
  },
  onUnload() {
    console.log('Page Unload');
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    console.log('Pull Down Refresh');
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1000);
  },
  
  // 上拉加载
  onReachBottom() {
    console.log('Reach Bottom');
  }
}
</script>
```

## API 调用

```vue
<script>
export default {
  methods: {
    // 网络请求
    async fetchData() {
      const res = await uni.request({
        url: 'https://api.example.com/data',
        method: 'GET',
        data: { page: 1 }
      });
      console.log(res.data);
    },
    
    // 页面跳转
    navigateTo() {
      uni.navigateTo({
        url: '/pages/detail/detail?id=1'
      });
    },
    
    // 显示提示
    showToast() {
      uni.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      });
    },
    
    // 显示加载
    showLoading() {
      uni.showLoading({
        title: '加载中'
      });
      
      setTimeout(() => {
        uni.hideLoading();
      }, 2000);
    },
    
    // 本地存储
    saveData() {
      uni.setStorageSync('key', 'value');
      const value = uni.getStorageSync('key');
    },
    
    // 选择图片
    async chooseImage() {
      const res = await uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera']
      });
      console.log(res.tempFilePaths);
    },
    
    // 上传文件
    uploadFile() {
      uni.uploadFile({
        url: 'https://api.example.com/upload',
        filePath: tempFilePath,
        name: 'file',
        success: (res) => {
          console.log(res.data);
        }
      });
    }
  }
}
</script>
```

## 状态管理（Vuex）

```js
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    count: 0,
    userInfo: null
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    }
  },
  actions: {
    async fetchUserInfo({ commit }) {
      const res = await uni.request({
        url: '/api/user'
      });
      commit('setUserInfo', res.data);
    }
  }
});

export default store;

// main.js
import store from './store';
const app = new Vue({
  store,
  ...App
});

// 使用
this.$store.commit('increment');
this.$store.dispatch('fetchUserInfo');
```

## 条件编译

```vue
<template>
  <view>
    <!-- #ifdef H5 -->
    <view>仅在 H5 显示</view>
    <!-- #endif -->
    
    <!-- #ifdef MP-WEIXIN -->
    <view>仅在微信小程序显示</view>
    <!-- #endif -->
    
    <!-- #ifdef APP-PLUS -->
    <view>仅在 App 显示</view>
    <!-- #endif -->
  </view>
</template>

<script>
export default {
  methods: {
    platformCheck() {
      // #ifdef H5
      console.log('H5 平台');
      // #endif
      
      // #ifdef MP-WEIXIN
      console.log('微信小程序');
      // #endif
    }
  }
}
</script>

<style>
/* #ifdef H5 */
.h5-only {
  color: red;
}
/* #endif */
</style>
```

## 最佳实践

1. **使用 rpx 单位**：自适应不同屏幕
2. **条件编译**：针对不同平台优化
3. **组件化开发**：提高代码复用
4. **性能优化**：避免频繁 setData
5. **使用 uni-ui**：官方 UI 组件库
6. **云开发**：使用 uniCloud
7. **插件市场**：利用现有插件
8. **多端测试**：确保各平台兼容

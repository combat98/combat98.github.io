# Vue

## 概述

Vue.js 是一个渐进式 JavaScript 框架，用于构建用户界面。核心库只关注视图层，易于上手，同时也能与其他库或现有项目整合。

### 特点

- **渐进式框架**：可以逐步采用，从简单到复杂
- **响应式数据绑定**：数据变化自动更新视图
- **组件化**：可复用的组件系统
- **虚拟 DOM**：高效的 DOM 更新
- **单文件组件**：HTML、CSS、JavaScript 在一个文件中
- **丰富的生态系统**：Vue Router、Vuex/Pinia、Vue CLI

## 快速开始

### 创建项目

```bash
# 使用 Vue CLI
npm install -g @vue/cli
vue create my-app
cd my-app
npm run serve

# 使用 Vite（推荐）
npm create vue@latest
cd my-app
npm install
npm run dev

# 使用 CDN（快速原型）
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

### 项目结构

```
my-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── assets/
│   ├── components/
│   ├── views/
│   ├── router/
│   ├── store/
│   ├── App.vue
│   └── main.js
├── package.json
└── vite.config.js
```

## 基础语法

### 模板语法

```vue
<template>
  <div>
    <!-- 文本插值 -->
    <p>{{ message }}</p>
    
    <!-- HTML 插值 -->
    <div v-html="htmlContent"></div>
    
    <!-- 属性绑定 -->
    <img :src="imageUrl" :alt="imageAlt">
    <div :class="{ active: isActive }"></div>
    <div :style="{ color: textColor, fontSize: fontSize + 'px' }"></div>
    
    <!-- 事件绑定 -->
    <button @click="handleClick">Click me</button>
    <input @input="handleInput" @keyup.enter="handleEnter">
    
    <!-- 双向绑定 -->
    <input v-model="message">
    
    <!-- 条件渲染 -->
    <div v-if="type === 'A'">A</div>
    <div v-else-if="type === 'B'">B</div>
    <div v-else>C</div>
    
    <div v-show="isVisible">Visible</div>
    
    <!-- 列表渲染 -->
    <ul>
      <li v-for="(item, index) in items" :key="item.id">
        {{ index }}: {{ item.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const message = ref('Hello Vue!');
const htmlContent = ref('<strong>Bold text</strong>');
const imageUrl = ref('/logo.png');
const imageAlt = ref('Logo');
const isActive = ref(true);
const textColor = ref('red');
const fontSize = ref(14);
const type = ref('A');
const isVisible = ref(true);
const items = ref([
  { id: 1, name: 'Item 1' },
  { id: 2, name: 'Item 2' }
]);

const handleClick = () => {
  console.log('Clicked');
};

const handleInput = (e) => {
  console.log(e.target.value);
};

const handleEnter = () => {
  console.log('Enter pressed');
};
</script>
```

## 组件

### 单文件组件（SFC）

```vue
<!-- HelloWorld.vue -->
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Props
const props = defineProps({
  msg: {
    type: String,
    required: true
  }
});

// State
const count = ref(0);

// Methods
const increment = () => {
  count.value++;
};

// Emits
const emit = defineEmits(['update']);

const handleUpdate = () => {
  emit('update', count.value);
};
</script>

<style scoped>
.hello {
  padding: 20px;
}

h1 {
  color: #42b983;
}
</style>
```

### 组件通信

```vue
<!-- Parent.vue -->
<template>
  <div>
    <!-- Props 传递 -->
    <Child :message="parentMessage" @update="handleUpdate" />
    
    <!-- v-model -->
    <CustomInput v-model="inputValue" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Child from './Child.vue';
import CustomInput from './CustomInput.vue';

const parentMessage = ref('Hello from parent');
const inputValue = ref('');

const handleUpdate = (value) => {
  console.log('Updated:', value);
};
</script>

<!-- Child.vue -->
<template>
  <div>
    <p>{{ message }}</p>
    <button @click="sendUpdate">Update</button>
  </div>
</template>

<script setup>
const props = defineProps(['message']);
const emit = defineEmits(['update']);

const sendUpdate = () => {
  emit('update', 'New value');
};
</script>

<!-- CustomInput.vue -->
<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script setup>
defineProps(['modelValue']);
defineEmits(['update:modelValue']);
</script>
```

### Provide / Inject

```vue
<!-- Parent.vue -->
<template>
  <Child />
</template>

<script setup>
import { provide, ref } from 'vue';
import Child from './Child.vue';

const theme = ref('dark');
const updateTheme = (newTheme) => {
  theme.value = newTheme;
};

provide('theme', theme);
provide('updateTheme', updateTheme);
</script>

<!-- Child.vue (任意深度的子组件) -->
<template>
  <div>
    <p>Theme: {{ theme }}</p>
    <button @click="updateTheme('light')">Light</button>
    <button @click="updateTheme('dark')">Dark</button>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const theme = inject('theme');
const updateTheme = inject('updateTheme');
</script>
```

## 响应式 API

### ref 和 reactive

```vue
<script setup>
import { ref, reactive, toRefs } from 'vue';

// ref - 基本类型
const count = ref(0);
const message = ref('Hello');

// 访问值需要 .value
count.value++;
console.log(message.value);

// reactive - 对象类型
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'Alice',
    age: 25
  }
});

// 直接访问属性
state.count++;
console.log(state.message);

// toRefs - 解构 reactive 对象
const { count: refCount, message: refMessage } = toRefs(state);
</script>
```

### computed

```vue
<script setup>
import { ref, computed } from 'vue';

const firstName = ref('John');
const lastName = ref('Doe');

// 只读计算属性
const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`;
});

// 可写计算属性
const fullNameWritable = computed({
  get() {
    return `${firstName.value} ${lastName.value}`;
  },
  set(value) {
    [firstName.value, lastName.value] = value.split(' ');
  }
});
</script>
```

### watch 和 watchEffect

```vue
<script setup>
import { ref, watch, watchEffect } from 'vue';

const count = ref(0);
const message = ref('Hello');

// watch - 监听单个源
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`);
});

// watch - 监听多个源
watch([count, message], ([newCount, newMessage], [oldCount, oldMessage]) => {
  console.log('Multiple values changed');
});

// watch - 深度监听
const state = ref({ count: 0 });
watch(state, (newValue) => {
  console.log('State changed:', newValue);
}, { deep: true });

// watch - 立即执行
watch(count, (newValue) => {
  console.log('Count:', newValue);
}, { immediate: true });

// watchEffect - 自动追踪依赖
watchEffect(() => {
  console.log(`Count is ${count.value}, message is ${message.value}`);
});
</script>
```

## 生命周期

```vue
<script setup>
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted
} from 'vue';

onBeforeMount(() => {
  console.log('Before mount');
});

onMounted(() => {
  console.log('Mounted');
  // DOM 已挂载，可以访问 DOM
});

onBeforeUpdate(() => {
  console.log('Before update');
});

onUpdated(() => {
  console.log('Updated');
});

onBeforeUnmount(() => {
  console.log('Before unmount');
  // 清理工作
});

onUnmounted(() => {
  console.log('Unmounted');
});
</script>
```

## 路由（Vue Router）

### 安装

```bash
npm install vue-router@4
```

### 配置路由

```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import About from '../views/About.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/user/:id',
    name: 'User',
    component: () => import('../views/User.vue'),
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;

// main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

createApp(App).use(router).mount('#app');
```

### 使用路由

```vue
<template>
  <div>
    <!-- 路由链接 -->
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link :to="{ name: 'User', params: { id: 123 } }">User</router-link>
    
    <!-- 路由视图 -->
    <router-view />
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

// 编程式导航
const goToAbout = () => {
  router.push('/about');
  // router.push({ name: 'About' });
  // router.push({ path: '/about', query: { id: 123 } });
};

// 获取路由参数
console.log(route.params.id);
console.log(route.query.page);

// 路由守卫
router.beforeEach((to, from, next) => {
  console.log('Navigating to:', to.path);
  next();
});
</script>
```

### 嵌套路由

```js
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        path: '',
        component: UserHome
      },
      {
        path: 'profile',
        component: UserProfile
      },
      {
        path: 'posts',
        component: UserPosts
      }
    ]
  }
];
```

```vue
<!-- User.vue -->
<template>
  <div>
    <h1>User {{ $route.params.id }}</h1>
    <router-link :to="`/user/${$route.params.id}/profile`">Profile</router-link>
    <router-link :to="`/user/${$route.params.id}/posts`">Posts</router-link>
    <router-view />
  </div>
</template>
```

## 状态管理

### Pinia（推荐）

```bash
npm install pinia
```

```js
// main.js
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.mount('#app');

// stores/counter.js
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useCounterStore = defineStore('counter', () => {
  // State
  const count = ref(0);
  
  // Getters
  const doubleCount = computed(() => count.value * 2);
  
  // Actions
  function increment() {
    count.value++;
  }
  
  function incrementBy(amount) {
    count.value += amount;
  }
  
  return { count, doubleCount, increment, incrementBy };
});

// 或使用 Options API 风格
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++;
    },
    incrementBy(amount) {
      this.count += amount;
    }
  }
});
```

```vue
<!-- 使用 Store -->
<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment()">+1</button>
    <button @click="counter.incrementBy(5)">+5</button>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter';
import { storeToRefs } from 'pinia';

const counter = useCounterStore();

// 解构响应式属性
const { count, doubleCount } = storeToRefs(counter);
// 解构方法（不需要 storeToRefs）
const { increment, incrementBy } = counter;
</script>
```

### Vuex

```bash
npm install vuex@next
```

```js
// store/index.js
import { createStore } from 'vuex';

export default createStore({
  state: {
    count: 0,
    user: null
  },
  getters: {
    doubleCount: (state) => state.count * 2
  },
  mutations: {
    INCREMENT(state) {
      state.count++;
    },
    SET_USER(state, user) {
      state.user = user;
    }
  },
  actions: {
    increment({ commit }) {
      commit('INCREMENT');
    },
    async fetchUser({ commit }, userId) {
      const response = await fetch(`/api/users/${userId}`);
      const user = await response.json();
      commit('SET_USER', user);
    }
  },
  modules: {
    // 模块化
  }
});

// main.js
import { createApp } from 'vue';
import store from './store';
import App from './App.vue';

createApp(App).use(store).mount('#app');
```

```vue
<!-- 使用 Vuex -->
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();

const count = computed(() => store.state.count);
const doubleCount = computed(() => store.getters.doubleCount);

const increment = () => {
  store.dispatch('increment');
};
</script>
```

## HTTP 请求

### Axios

```bash
npm install axios
```

```js
// api/index.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response?.status === 401) {
      // 处理未授权
    }
    return Promise.reject(error);
  }
);

export default api;
```

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <ul v-else>
      <li v-for="user in users" :key="user.id">
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

onMounted(async () => {
  try {
    users.value = await api.get('/users');
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});
</script>
```

### 组合式函数（Composables）

```js
// composables/useFetch.js
import { ref } from 'vue';

export function useFetch(url) {
  const data = ref(null);
  const loading = ref(true);
  const error = ref(null);

  const fetchData = async () => {
    loading.value = true;
    try {
      const response = await fetch(url);
      data.value = await response.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return { data, loading, error, refetch: fetchData };
}
```

```vue
<script setup>
import { useFetch } from '@/composables/useFetch';

const { data: users, loading, error, refetch } = useFetch('/api/users');
</script>
```

## UI 组件库

### Element Plus

```bash
npm install element-plus
```

```js
// main.js
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';

const app = createApp(App);
app.use(ElementPlus);
app.mount('#app');
```

```vue
<template>
  <div>
    <el-button type="primary">Primary</el-button>
    <el-button type="success">Success</el-button>
    
    <el-form :model="form" label-width="120px">
      <el-form-item label="Username">
        <el-input v-model="form.username" />
      </el-form-item>
      <el-form-item label="Email">
        <el-input v-model="form.email" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Submit</el-button>
      </el-form-item>
    </el-form>
    
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="age" label="Age" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  username: '',
  email: ''
});

const tableData = ref([
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
]);

const onSubmit = () => {
  console.log('Form:', form.value);
};
</script>
```

### Vuetify

```bash
npm install vuetify@next
```

```js
// main.js
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import App from './App.vue';

const vuetify = createVuetify();

createApp(App).use(vuetify).mount('#app');
```

```vue
<template>
  <v-app>
    <v-container>
      <v-btn color="primary">Primary</v-btn>
      <v-btn color="success">Success</v-btn>
      
      <v-form>
        <v-text-field label="Username" v-model="username" />
        <v-text-field label="Email" v-model="email" />
        <v-btn color="primary" @click="submit">Submit</v-btn>
      </v-form>
    </v-container>
  </v-app>
</template>
```

## 表单处理

### 基本表单

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label>Username:</label>
      <input v-model="form.username" type="text" required>
    </div>
    
    <div>
      <label>Email:</label>
      <input v-model="form.email" type="email" required>
    </div>
    
    <div>
      <label>Password:</label>
      <input v-model="form.password" type="password" required>
    </div>
    
    <div>
      <label>Gender:</label>
      <select v-model="form.gender">
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>
    
    <div>
      <label>
        <input type="checkbox" v-model="form.agree">
        I agree to terms
      </label>
    </div>
    
    <div>
      <label>Hobbies:</label>
      <label><input type="checkbox" value="reading" v-model="form.hobbies"> Reading</label>
      <label><input type="checkbox" value="sports" v-model="form.hobbies"> Sports</label>
      <label><input type="checkbox" value="music" v-model="form.hobbies"> Music</label>
    </div>
    
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  username: '',
  email: '',
  password: '',
  gender: 'male',
  agree: false,
  hobbies: []
});

const handleSubmit = () => {
  console.log('Form data:', form.value);
};
</script>
```

### 表单验证

```vue
<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <input v-model="form.email" type="email" @blur="validateEmail">
      <span v-if="errors.email" class="error">{{ errors.email }}</span>
    </div>
    
    <div>
      <input v-model="form.password" type="password" @blur="validatePassword">
      <span v-if="errors.password" class="error">{{ errors.password }}</span>
    </div>
    
    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>

<script setup>
import { ref, computed } from 'vue';

const form = ref({
  email: '',
  password: ''
});

const errors = ref({
  email: '',
  password: ''
});

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.value.email) {
    errors.value.email = 'Email is required';
  } else if (!emailRegex.test(form.value.email)) {
    errors.value.email = 'Invalid email format';
  } else {
    errors.value.email = '';
  }
};

const validatePassword = () => {
  if (!form.value.password) {
    errors.value.password = 'Password is required';
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  } else {
    errors.value.password = '';
  }
};

const isValid = computed(() => {
  return !errors.value.email && !errors.value.password &&
         form.value.email && form.value.password;
});

const handleSubmit = () => {
  validateEmail();
  validatePassword();
  
  if (isValid.value) {
    console.log('Form submitted:', form.value);
  }
};
</script>

<style scoped>
.error {
  color: red;
  font-size: 12px;
}
</style>
```

## 指令

### 内置指令

```vue
<template>
  <!-- v-text -->
  <p v-text="message"></p>
  
  <!-- v-html -->
  <div v-html="htmlContent"></div>
  
  <!-- v-show -->
  <div v-show="isVisible">Visible</div>
  
  <!-- v-if / v-else-if / v-else -->
  <div v-if="type === 'A'">A</div>
  <div v-else-if="type === 'B'">B</div>
  <div v-else>C</div>
  
  <!-- v-for -->
  <li v-for="item in items" :key="item.id">{{ item.name }}</li>
  
  <!-- v-on (@) -->
  <button @click="handleClick">Click</button>
  <button @click.prevent="handleClick">Prevent Default</button>
  <button @click.stop="handleClick">Stop Propagation</button>
  <input @keyup.enter="handleEnter">
  
  <!-- v-bind (:) -->
  <img :src="imageUrl" :alt="imageAlt">
  
  <!-- v-model -->
  <input v-model="message">
  <input v-model.trim="message">
  <input v-model.number="age">
  <input v-model.lazy="message">
  
  <!-- v-slot (#) -->
  <MyComponent>
    <template #header>Header</template>
    <template #default>Content</template>
    <template #footer>Footer</template>
  </MyComponent>
  
  <!-- v-pre -->
  <span v-pre>{{ this will not be compiled }}</span>
  
  <!-- v-once -->
  <span v-once>{{ message }}</span>
  
  <!-- v-memo -->
  <div v-memo="[count]">{{ expensiveComputation() }}</div>
</template>
```

### 自定义指令

```js
// directives/focus.js
export const vFocus = {
  mounted(el) {
    el.focus();
  }
};

// directives/clickOutside.js
export const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el.clickOutsideEvent);
  },
  unmounted(el) {
    document.removeEventListener('click', el.clickOutsideEvent);
  }
};
```

```vue
<template>
  <input v-focus>
  <div v-click-outside="handleClickOutside">Click outside me</div>
</template>

<script setup>
import { vFocus, vClickOutside } from '@/directives';

const handleClickOutside = () => {
  console.log('Clicked outside');
};
</script>
```

## 性能优化

### v-once 和 v-memo

```vue
<template>
  <!-- 只渲染一次 -->
  <div v-once>{{ staticContent }}</div>
  
  <!-- 条件缓存 -->
  <div v-memo="[count]">
    <p>Count: {{ count }}</p>
    <p>Expensive: {{ expensiveComputation() }}</p>
  </div>
</template>
```

### 异步组件

```vue
<script setup>
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() =>
  import('./components/HeavyComponent.vue')
);

// 带选项的异步组件
const AsyncComponentWithOptions = defineAsyncComponent({
  loader: () => import('./components/HeavyComponent.vue'),
  loadingComponent: LoadingComponent,
  errorComponent: ErrorComponent,
  delay: 200,
  timeout: 3000
});
</script>
```

### 虚拟滚动

```bash
npm install vue-virtual-scroller
```

```vue
<template>
  <RecycleScroller
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">{{ item.name }}</div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

const items = ref(Array.from({ length: 10000 }, (_, i) => ({
  id: i,
  name: `Item ${i}`
})));
</script>
```

## TypeScript 支持

```vue
<script setup lang="ts">
import { ref, computed } from 'vue';

interface User {
  id: number;
  name: string;
  email: string;
}

// Props 类型
interface Props {
  msg: string;
  count?: number;
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
});

// Emits 类型
interface Emits {
  (e: 'update', value: number): void;
  (e: 'delete', id: number): void;
}

const emit = defineEmits<Emits>();

// State 类型
const user = ref<User | null>(null);
const users = ref<User[]>([]);

// Computed 类型
const fullName = computed<string>(() => {
  return user.value ? `${user.value.name}` : '';
});

// Function 类型
const handleUpdate = (value: number): void => {
  emit('update', value);
};
</script>
```

## 测试

### Vitest + Vue Test Utils

```bash
npm install --save-dev vitest @vue/test-utils
```

```js
// Counter.test.js
import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import Counter from './Counter.vue';

describe('Counter', () => {
  it('renders count', () => {
    const wrapper = mount(Counter);
    expect(wrapper.text()).toContain('Count: 0');
  });

  it('increments count', async () => {
    const wrapper = mount(Counter);
    await wrapper.find('button').trigger('click');
    expect(wrapper.text()).toContain('Count: 1');
  });

  it('receives props', () => {
    const wrapper = mount(Counter, {
      props: {
        initialCount: 10
      }
    });
    expect(wrapper.text()).toContain('Count: 10');
  });
});
```

## 最佳实践

1. **使用 Composition API**：更好的代码组织和复用
2. **组件拆分**：保持组件小而专注
3. **使用 TypeScript**：提高代码质量
4. **合理使用响应式**：避免过度使用 reactive
5. **使用 Pinia**：替代 Vuex 进行状态管理
6. **代码分割**：使用异步组件
7. **性能监控**：使用 Vue DevTools
8. **遵循命名规范**：组件名使用 PascalCase

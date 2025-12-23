# React

## 概述

React 是由 Facebook 开发的用于构建用户界面的 JavaScript 库，专注于视图层（MVC 中的 V）。

### 特点

- **组件化**：将 UI 拆分为独立、可复用的组件
- **声明式**：描述 UI 应该是什么样子，React 负责更新
- **虚拟 DOM**：高效的 DOM 更新机制
- **单向数据流**：数据从父组件流向子组件
- **JSX 语法**：在 JavaScript 中编写类 HTML 代码

## 快速开始

### 创建项目

```bash
# 使用 Create React App
npx create-react-app my-app
cd my-app
npm start

# 使用 Vite（推荐）
npm create vite@latest my-app -- --template react
cd my-app
npm install
npm run dev

# 使用 TypeScript
npm create vite@latest my-app -- --template react-ts
```

### 项目结构

```
my-app/
├── node_modules/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js
```

## 组件

### 函数组件

```jsx
// 基本函数组件
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>;
}

// 箭头函数组件
const Welcome = (props) => {
  return <h1>Hello, {props.name}</h1>;
};

// 使用组件
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}
```

### 类组件

```jsx
import React, { Component } from 'react';

class Welcome extends Component {
  render() {
    return <h1>Hello, {this.props.name}</h1>;
  }
}

// 带状态的类组件
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  increment = () => {
    this.setState({ count: this.state.count + 1 });
  };

  render() {
    return (
      <div>
        <p>Count: {this.state.count}</p>
        <button onClick={this.increment}>+1</button>
      </div>
    );
  }
}
```

## JSX

### 基本语法

```jsx
// 表达式
const name = 'Alice';
const element = <h1>Hello, {name}</h1>;

// 属性
const element = <img src={user.avatarUrl} alt={user.name} />;

// 子元素
const element = (
  <div>
    <h1>Title</h1>
    <p>Content</p>
  </div>
);

// 条件渲染
const element = (
  <div>
    {isLoggedIn ? <UserGreeting /> : <GuestGreeting />}
  </div>
);

// 列表渲染
const numbers = [1, 2, 3, 4, 5];
const listItems = numbers.map((number) =>
  <li key={number}>{number}</li>
);
```

### 样式

```jsx
// 内联样式
const divStyle = {
  color: 'blue',
  backgroundColor: 'lightgray',
  padding: '10px'
};

function MyComponent() {
  return <div style={divStyle}>Styled div</div>;
}

// CSS 类名
import './App.css';

function MyComponent() {
  return <div className="my-class">Styled div</div>;
}

// CSS Modules
import styles from './App.module.css';

function MyComponent() {
  return <div className={styles.myClass}>Styled div</div>;
}
```

## Hooks

### useState

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>
    </div>
  );
}

// 对象状态
function Form() {
  const [form, setForm] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  return (
    <form>
      <input name="name" value={form.name} onChange={handleChange} />
      <input name="email" value={form.email} onChange={handleChange} />
    </form>
  );
}
```

### useEffect

```jsx
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  // 每次渲染后执行
  useEffect(() => {
    document.title = `Count: ${count}`;
  });

  // 仅在挂载时执行
  useEffect(() => {
    console.log('Component mounted');
  }, []);

  // 依赖项变化时执行
  useEffect(() => {
    console.log('Count changed:', count);
  }, [count]);

  // 清理函数
  useEffect(() => {
    const timer = setInterval(() => {
      console.log('Tick');
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

### useContext

```jsx
import { createContext, useContext, useState } from 'react';

// 创建 Context
const ThemeContext = createContext();

// Provider 组件
function App() {
  const [theme, setTheme] = useState('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

// 使用 Context
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      style={{ background: theme === 'dark' ? '#333' : '#fff' }}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      Toggle Theme
    </button>
  );
}
```

### useRef

```jsx
import { useRef, useEffect } from 'react';

function TextInput() {
  const inputRef = useRef(null);

  useEffect(() => {
    // 自动聚焦
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} type="text" />;
}

// 保存可变值
function Timer() {
  const [count, setCount] = useState(0);
  const intervalRef = useRef(null);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setCount(c => c + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
    </div>
  );
}
```

### useMemo 和 useCallback

```jsx
import { useState, useMemo, useCallback } from 'react';

function Example() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  // useMemo - 缓存计算结果
  const expensiveValue = useMemo(() => {
    console.log('Computing expensive value');
    return count * 2;
  }, [count]);

  // useCallback - 缓存函数
  const handleClick = useCallback(() => {
    console.log('Button clicked');
    setCount(c => c + 1);
  }, []);

  return (
    <div>
      <p>Count: {count}</p>
      <p>Expensive Value: {expensiveValue}</p>
      <button onClick={handleClick}>+1</button>
      <input value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
```

### 自定义 Hook

```jsx
import { useState, useEffect } from 'react';

// 自定义 Hook：获取窗口大小
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}

// 使用自定义 Hook
function App() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <p>Window size: {width} x {height}</p>
    </div>
  );
}

// 自定义 Hook：数据获取
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(url)
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
}
```

## 表单处理

### 受控组件

```jsx
function Form() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    gender: 'male',
    agree: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <select name="gender" value={formData.gender} onChange={handleChange}>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      <label>
        <input
          type="checkbox"
          name="agree"
          checked={formData.agree}
          onChange={handleChange}
        />
        I agree
      </label>
      <button type="submit">Submit</button>
    </form>
  );
}
```

## 路由（React Router）

### 安装

```bash
npm install react-router-dom
```

### 基本使用

```jsx
import { BrowserRouter, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/users">Users</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// 编程式导航
function Home() {
  const navigate = useNavigate();

  const goToAbout = () => {
    navigate('/about');
  };

  return (
    <div>
      <h1>Home</h1>
      <button onClick={goToAbout}>Go to About</button>
    </div>
  );
}

// 路由参数
function UserDetail() {
  const { id } = useParams();

  return <h1>User ID: {id}</h1>;
}
```

### 嵌套路由

```jsx
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="users" element={<Users />}>
            <Route path=":id" element={<UserDetail />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
```

## 状态管理

### Redux Toolkit

```bash
npm install @reduxjs/toolkit react-redux
```

```jsx
// store.js
import { configureStore, createSlice } from '@reduxjs/toolkit';

// 创建 Slice
const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => {
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload;
    }
  }
});

export const { increment, decrement, incrementByAmount } = counterSlice.actions;

// 创建 Store
export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
});

// main.jsx
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
);

// Counter.jsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount } from './store';

function Counter() {
  const count = useSelector((state) => state.counter.value);
  const dispatch = useDispatch();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => dispatch(increment())}>+1</button>
      <button onClick={() => dispatch(decrement())}>-1</button>
      <button onClick={() => dispatch(incrementByAmount(5))}>+5</button>
    </div>
  );
}
```

### Zustand（轻量级状态管理）

```bash
npm install zustand
```

```jsx
import create from 'zustand';

// 创建 Store
const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 })
}));

// 使用 Store
function Counter() {
  const { count, increment, decrement, reset } = useStore();

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>+1</button>
      <button onClick={decrement}>-1</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

## HTTP 请求

### Axios

```bash
npm install axios
```

```jsx
import { useState, useEffect } from 'react';
import axios from 'axios';

// 配置 axios
const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json'
  }
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

// 使用示例
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users')
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### React Query

```bash
npm install @tanstack/react-query
```

```jsx
import { QueryClient, QueryClientProvider, useQuery, useMutation } from '@tanstack/react-query';

// 创建 QueryClient
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Users />
    </QueryClientProvider>
  );
}

// 使用 useQuery
function Users() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(res => res.json())
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {data.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}

// 使用 useMutation
function CreateUser() {
  const mutation = useMutation({
    mutationFn: (newUser) => {
      return fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(newUser)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({ name: 'New User' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit">Create User</button>
      {mutation.isLoading && <p>Creating...</p>}
      {mutation.isError && <p>Error!</p>}
      {mutation.isSuccess && <p>Success!</p>}
    </form>
  );
}
```

## UI 组件库

### Ant Design

```bash
npm install antd
```

```jsx
import { Button, Form, Input, Table, Modal } from 'antd';
import 'antd/dist/reset.css';

function App() {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Form values:', values);
  };

  return (
    <div style={{ padding: 24 }}>
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: 'email' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
```

### Material-UI

```bash
npm install @mui/material @emotion/react @emotion/styled
```

```jsx
import { Button, TextField, Box, Container } from '@mui/material';

function App() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <TextField
          fullWidth
          label="Username"
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          margin="normal"
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          Submit
        </Button>
      </Box>
    </Container>
  );
}
```

## 性能优化

### React.memo

```jsx
import { memo } from 'react';

// 防止不必要的重新渲染
const ExpensiveComponent = memo(function ExpensiveComponent({ data }) {
  console.log('Rendering ExpensiveComponent');
  return <div>{data}</div>;
});

function Parent() {
  const [count, setCount] = useState(0);
  const [data, setData] = useState('Hello');

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      <ExpensiveComponent data={data} />
    </div>
  );
}
```

### 代码分割

```jsx
import { lazy, Suspense } from 'react';

// 懒加载组件
const About = lazy(() => import('./About'));
const Users = lazy(() => import('./Users'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Suspense>
  );
}
```

### 虚拟列表

```bash
npm install react-window
```

```jsx
import { FixedSizeList } from 'react-window';

function VirtualList() {
  const items = Array.from({ length: 10000 }, (_, i) => `Item ${i + 1}`);

  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={400}
      itemCount={items.length}
      itemSize={35}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}
```

## 测试

### Jest + React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```jsx
// Counter.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './Counter';

test('renders counter', () => {
  render(<Counter />);
  expect(screen.getByText(/count:/i)).toBeInTheDocument();
});

test('increments counter', () => {
  render(<Counter />);
  const button = screen.getByText('+1');
  fireEvent.click(button);
  expect(screen.getByText(/count: 1/i)).toBeInTheDocument();
});
```

## 最佳实践

1. **组件拆分**：保持组件小而专注
2. **使用 TypeScript**：提高代码质量和可维护性
3. **状态提升**：将共享状态提升到最近的共同父组件
4. **避免内联函数**：使用 useCallback 缓存函数
5. **使用 key**：列表渲染时提供唯一 key
6. **错误边界**：捕获组件错误
7. **代码分割**：按需加载组件
8. **性能监控**：使用 React DevTools Profiler

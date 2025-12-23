# Docker

## 容器概念

### 什么是 Docker

Docker 是一个开源的容器化平台，用于开发、交付和运行应用程序。它将应用程序及其依赖打包到一个轻量级、可移植的容器中。

### 核心概念

| 概念 | 说明 |
|------|------|
| 镜像（Image） | 只读模板，包含运行应用所需的一切 |
| 容器（Container） | 镜像的运行实例，可以启动、停止、删除 |
| 仓库（Registry） | 存储和分发镜像的服务，如 Docker Hub |
| Dockerfile | 构建镜像的脚本文件 |

### Docker vs 虚拟机

| 特性 | Docker 容器 | 虚拟机 |
|------|------------|--------|
| 启动速度 | 秒级 | 分钟级 |
| 资源占用 | 少（MB 级） | 多（GB 级） |
| 性能 | 接近原生 | 有损耗 |
| 隔离性 | 进程级 | 系统级 |
| 可移植性 | 强 | 较弱 |

### Docker 架构

```
┌─────────────────────────────────────┐
│         Docker Client               │
│    (docker build, run, pull...)     │
└──────────────┬──────────────────────┘
               │ REST API
┌──────────────▼──────────────────────┐
│         Docker Daemon               │
│  ┌──────────────────────────────┐   │
│  │  Images  │  Containers        │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
               │
┌──────────────▼──────────────────────┐
│         Docker Registry             │
│         (Docker Hub)                │
└─────────────────────────────────────┘
```

## 镜像

### 镜像操作

```bash
# 搜索镜像
docker search nginx

# 拉取镜像
docker pull nginx
docker pull nginx:1.21                 # 指定版本
docker pull nginx:latest               # 最新版本

# 查看本地镜像
docker images
docker image ls

# 查看镜像详情
docker inspect nginx

# 删除镜像
docker rmi nginx
docker rmi nginx:1.21
docker rmi $(docker images -q)         # 删除所有镜像

# 导出镜像
docker save nginx > nginx.tar
docker save -o nginx.tar nginx

# 导入镜像
docker load < nginx.tar
docker load -i nginx.tar

# 镜像标签
docker tag nginx:latest myregistry.com/nginx:v1.0
```

### 镜像仓库

```bash
# 登录 Docker Hub
docker login
docker login -u username -p password

# 推送镜像
docker push myusername/nginx:v1.0

# 登出
docker logout

# 私有仓库
docker pull myregistry.com:5000/nginx
docker push myregistry.com:5000/nginx

# 搭建私有仓库
docker run -d -p 5000:5000 --name registry registry:2
```

### 镜像清理

```bash
# 删除悬空镜像（dangling）
docker image prune

# 删除所有未使用的镜像
docker image prune -a

# 删除所有未使用的资源
docker system prune
docker system prune -a                 # 包括未使用的镜像

# 查看磁盘使用
docker system df
```

## 部署服务

### 容器基本操作

```bash
# 运行容器
docker run nginx
docker run -d nginx                    # 后台运行
docker run -d --name mynginx nginx     # 指定名称
docker run -d -p 8080:80 nginx         # 端口映射
docker run -d -p 8080:80 -v /data:/usr/share/nginx/html nginx  # 挂载卷

# 查看容器
docker ps                              # 运行中的容器
docker ps -a                           # 所有容器
docker ps -q                           # 只显示 ID

# 启动/停止容器
docker start container_id
docker stop container_id
docker restart container_id

# 暂停/恢复容器
docker pause container_id
docker unpause container_id

# 删除容器
docker rm container_id
docker rm -f container_id              # 强制删除运行中的容器
docker rm $(docker ps -aq)             # 删除所有容器

# 查看容器详情
docker inspect container_id

# 查看容器日志
docker logs container_id
docker logs -f container_id            # 实时查看
docker logs --tail 100 container_id    # 最后 100 行
docker logs --since 30m container_id   # 最近 30 分钟

# 进入容器
docker exec -it container_id /bin/bash
docker exec -it container_id sh

# 查看容器进程
docker top container_id

# 查看容器资源使用
docker stats
docker stats container_id
```

### 端口映射

```bash
# 单个端口映射
docker run -d -p 8080:80 nginx         # 主机 8080 -> 容器 80

# 多个端口映射
docker run -d -p 8080:80 -p 8443:443 nginx

# 随机端口映射
docker run -d -P nginx                 # 随机映射所有暴露端口

# 指定 IP 映射
docker run -d -p 127.0.0.1:8080:80 nginx

# 查看端口映射
docker port container_id
```

### 数据卷

```bash
# 挂载主机目录
docker run -d -v /host/path:/container/path nginx

# 挂载命名卷
docker run -d -v myvolume:/data nginx

# 只读挂载
docker run -d -v /host/path:/container/path:ro nginx

# 创建数据卷
docker volume create myvolume

# 查看数据卷
docker volume ls

# 查看数据卷详情
docker volume inspect myvolume

# 删除数据卷
docker volume rm myvolume

# 清理未使用的数据卷
docker volume prune
```

### 网络

```bash
# 查看网络
docker network ls

# 创建网络
docker network create mynetwork
docker network create --driver bridge mynetwork

# 连接容器到网络
docker run -d --network mynetwork --name web nginx
docker network connect mynetwork container_id

# 断开网络
docker network disconnect mynetwork container_id

# 删除网络
docker network rm mynetwork

# 查看网络详情
docker network inspect mynetwork
```

### 环境变量

```bash
# 设置环境变量
docker run -d -e MYSQL_ROOT_PASSWORD=123456 mysql

# 多个环境变量
docker run -d \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=mydb \
  mysql

# 从文件读取环境变量
docker run -d --env-file .env mysql

# .env 文件内容
MYSQL_ROOT_PASSWORD=123456
MYSQL_DATABASE=mydb
```

### 资源限制

```bash
# 限制内存
docker run -d -m 512m nginx            # 最大 512MB

# 限制 CPU
docker run -d --cpus 1.5 nginx         # 最多使用 1.5 个 CPU
docker run -d --cpu-shares 512 nginx   # CPU 权重

# 限制 IO
docker run -d --device-read-bps /dev/sda:1mb nginx
docker run -d --device-write-bps /dev/sda:1mb nginx
```

### 常用服务部署

#### Nginx

```bash
docker run -d \
  --name nginx \
  -p 80:80 \
  -v /data/nginx/html:/usr/share/nginx/html \
  -v /data/nginx/conf/nginx.conf:/etc/nginx/nginx.conf \
  nginx
```

#### MySQL

```bash
docker run -d \
  --name mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -v /data/mysql:/var/lib/mysql \
  mysql:8.0
```

#### Redis

```bash
docker run -d \
  --name redis \
  -p 6379:6379 \
  -v /data/redis:/data \
  redis redis-server --appendonly yes
```

#### PostgreSQL

```bash
docker run -d \
  --name postgres \
  -p 5432:5432 \
  -e POSTGRES_PASSWORD=123456 \
  -v /data/postgres:/var/lib/postgresql/data \
  postgres
```

#### MongoDB

```bash
docker run -d \
  --name mongo \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=123456 \
  -v /data/mongo:/data/db \
  mongo
```

#### Elasticsearch

```bash
docker run -d \
  --name elasticsearch \
  -p 9200:9200 \
  -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -v /data/elasticsearch:/usr/share/elasticsearch/data \
  elasticsearch:7.17.0
```

## Dockerfile

### 基本结构

```dockerfile
# 基础镜像
FROM ubuntu:20.04

# 维护者信息
LABEL maintainer="your@email.com"

# 设置工作目录
WORKDIR /app

# 复制文件
COPY . /app

# 安装依赖
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install -r requirements.txt

# 暴露端口
EXPOSE 8080

# 设置环境变量
ENV APP_ENV=production

# 启动命令
CMD ["python3", "app.py"]
```

### 常用指令

```dockerfile
# FROM - 基础镜像
FROM nginx:latest
FROM ubuntu:20.04
FROM node:16-alpine

# LABEL - 元数据
LABEL version="1.0"
LABEL description="My Application"

# RUN - 执行命令（构建时）
RUN apt-get update
RUN npm install
RUN mkdir -p /app/logs

# CMD - 容器启动命令（运行时）
CMD ["nginx", "-g", "daemon off;"]
CMD python app.py

# ENTRYPOINT - 入口点
ENTRYPOINT ["java", "-jar"]
CMD ["app.jar"]

# COPY - 复制文件
COPY index.html /usr/share/nginx/html/
COPY src/ /app/src/

# ADD - 复制并解压
ADD app.tar.gz /app/

# WORKDIR - 工作目录
WORKDIR /app

# ENV - 环境变量
ENV NODE_ENV=production
ENV PORT=3000

# EXPOSE - 暴露端口
EXPOSE 80
EXPOSE 443

# VOLUME - 数据卷
VOLUME /data
VOLUME ["/var/log", "/var/db"]

# USER - 运行用户
USER nginx

# ARG - 构建参数
ARG VERSION=1.0
RUN echo "Building version $VERSION"
```

### 多阶段构建

```dockerfile
# 第一阶段：编译
FROM maven:3.8-openjdk-11 AS builder
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

# 第二阶段：运行
FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=builder /app/target/app.jar .
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

### 构建镜像

```bash
# 基本构建
docker build -t myapp:v1.0 .

# 指定 Dockerfile
docker build -f Dockerfile.prod -t myapp:v1.0 .

# 使用构建参数
docker build --build-arg VERSION=1.0 -t myapp:v1.0 .

# 不使用缓存
docker build --no-cache -t myapp:v1.0 .

# 查看构建历史
docker history myapp:v1.0
```

### 最佳实践

```dockerfile
# 1. 使用官方基础镜像
FROM node:16-alpine

# 2. 合并 RUN 命令减少层数
RUN apt-get update && \
    apt-get install -y curl vim && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# 3. 利用构建缓存，先复制依赖文件
COPY package*.json ./
RUN npm install
COPY . .

# 4. 使用 .dockerignore 排除文件
# .dockerignore 内容：
node_modules
.git
.env
*.log

# 5. 使用非 root 用户
RUN useradd -m -u 1000 appuser
USER appuser

# 6. 使用多阶段构建减小镜像大小
FROM node:16 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/index.js"]

# 7. 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost/ || exit 1
```

### 实际案例

#### Java Spring Boot 应用

```dockerfile
FROM maven:3.8-openjdk-11 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

FROM openjdk:11-jre-slim
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

#### Node.js 应用

```dockerfile
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:16-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY package*.json ./
EXPOSE 3000
USER node
CMD ["node", "dist/index.js"]
```

#### Python Flask 应用

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
ENV FLASK_APP=app.py
CMD ["flask", "run", "--host=0.0.0.0"]
```

#### React 前端应用

```dockerfile
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Docker Compose

### 安装 Docker Compose

```bash
# Linux
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 验证
docker-compose --version
```

### docker-compose.yml 基本结构

```yaml
version: '3.8'

services:
  web:
    image: nginx:latest
    ports:
      - "80:80"
    volumes:
      - ./html:/usr/share/nginx/html
    networks:
      - mynetwork
    depends_on:
      - db
    environment:
      - ENV=production
    restart: always

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: mydb
    networks:
      - mynetwork

networks:
  mynetwork:
    driver: bridge

volumes:
  db_data:
```

### Compose 命令

```bash
# 启动服务
docker-compose up
docker-compose up -d                   # 后台运行
docker-compose up --build              # 重新构建镜像

# 停止服务
docker-compose stop
docker-compose down                    # 停止并删除容器
docker-compose down -v                 # 同时删除数据卷

# 查看服务
docker-compose ps
docker-compose ps -a

# 查看日志
docker-compose logs
docker-compose logs -f web             # 实时查看特定服务

# 执行命令
docker-compose exec web bash
docker-compose run web python manage.py migrate

# 重启服务
docker-compose restart
docker-compose restart web

# 构建镜像
docker-compose build
docker-compose build --no-cache

# 拉取镜像
docker-compose pull

# 查看配置
docker-compose config
```

### 完整示例：LNMP 环境

```yaml
version: '3.8'

services:
  nginx:
    image: nginx:latest
    container_name: nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/html:/usr/share/nginx/html
      - ./nginx/logs:/var/log/nginx
    depends_on:
      - php
    networks:
      - lnmp
    restart: always

  php:
    image: php:8.1-fpm
    container_name: php
    volumes:
      - ./nginx/html:/var/www/html
    networks:
      - lnmp
    restart: always

  mysql:
    image: mysql:8.0
    container_name: mysql
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql
      - ./mysql/conf:/etc/mysql/conf.d
    environment:
      MYSQL_ROOT_PASSWORD: 123456
      MYSQL_DATABASE: mydb
      MYSQL_USER: user
      MYSQL_PASSWORD: password
    networks:
      - lnmp
    restart: always

networks:
  lnmp:
    driver: bridge

volumes:
  mysql_data:
```

### 微服务示例

```yaml
version: '3.8'

services:
  # 前端
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - api
    networks:
      - app-network

  # API 服务
  api:
    build: ./api
    ports:
      - "8080:8080"
    environment:
      DB_HOST: postgres
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
    networks:
      - app-network

  # 数据库
  postgres:
    image: postgres:14
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      POSTGRES_PASSWORD: 123456
      POSTGRES_DB: mydb
    networks:
      - app-network

  # 缓存
  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data
    networks:
      - app-network

  # 消息队列
  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: 123456
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

## 常见问题

### 容器无法启动

```bash
# 查看容器日志
docker logs container_id

# 查看容器详情
docker inspect container_id

# 检查端口占用
netstat -tunlp | grep port
```

### 镜像拉取慢

```bash
# 配置镜像加速器
sudo vim /etc/docker/daemon.json

{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.ccs.tencentyun.com"
  ]
}

# 重启 Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 容器时间不同步

```bash
# 挂载主机时区
docker run -d -v /etc/localtime:/etc/localtime:ro nginx

# 或在 Dockerfile 中设置
RUN ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
RUN echo 'Asia/Shanghai' > /etc/timezone
```

### 清理磁盘空间

```bash
# 清理所有未使用的资源
docker system prune -a

# 清理构建缓存
docker builder prune

# 清理数据卷
docker volume prune
```

## 最佳实践

1. **使用官方镜像**：优先使用官方维护的镜像
2. **镜像分层优化**：合并 RUN 命令，减少镜像层数
3. **使用 .dockerignore**：排除不必要的文件
4. **多阶段构建**：减小最终镜像大小
5. **非 root 用户**：提高安全性
6. **健康检查**：添加 HEALTHCHECK 指令
7. **日志管理**：配置日志驱动和轮转
8. **资源限制**：设置内存和 CPU 限制
9. **网络隔离**：使用自定义网络
10. **数据持久化**：使用数据卷存储重要数据

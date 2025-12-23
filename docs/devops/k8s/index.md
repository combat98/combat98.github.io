# Kubernetes

## 概述

Kubernetes（K8s）是一个开源的容器编排平台，用于自动化部署、扩展和管理容器化应用程序。

### 核心概念

| 概念 | 说明 |
|------|------|
| Pod | 最小部署单元，包含一个或多个容器 |
| Deployment | 管理 Pod 的部署和更新 |
| Service | 为 Pod 提供稳定的网络访问 |
| Namespace | 资源隔离和多租户 |
| ConfigMap | 配置管理 |
| Secret | 敏感信息管理 |
| Volume | 数据持久化 |
| Ingress | HTTP/HTTPS 路由 |

## 架构

### 集群架构

```
┌─────────────────────────────────────────────┐
│              Master Node                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │API Server│  │Scheduler │  │Controller│  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────────────────────────────────┐  │
│  │            etcd                       │  │
│  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
┌───▼────┐     ┌───▼────┐     ┌───▼────┐
│ Worker │     │ Worker │     │ Worker │
│  Node  │     │  Node  │     │  Node  │
│┌──────┐│     │┌──────┐│     │┌──────┐│
││kubelet││     ││kubelet││     ││kubelet││
│└──────┘│     │└──────┘│     │└──────┘│
│┌──────┐│     │┌──────┐│     │┌──────┐│
││kube- ││     ││kube- ││     ││kube- ││
││proxy ││     ││proxy ││     ││proxy ││
│└──────┘│     │└──────┘│     │└──────┘│
│┌──────┐│     │┌──────┐│     │┌──────┐│
││ Pods ││     ││ Pods ││     ││ Pods ││
│└──────┘│     │└──────┘│     │└──────┘│
└────────┘     └────────┘     └────────┘
```

### 组件说明

**Master 组件：**
- **API Server**：集群的统一入口，提供 REST API
- **Scheduler**：负责 Pod 调度
- **Controller Manager**：管理各种控制器
- **etcd**：分布式键值存储，保存集群状态

**Node 组件：**
- **kubelet**：管理 Pod 和容器
- **kube-proxy**：网络代理，实现 Service
- **Container Runtime**：容器运行时（Docker、containerd）

## 安装部署

### Minikube（本地测试）

```bash
# 安装 Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# 启动集群
minikube start

# 查看状态
minikube status

# 停止集群
minikube stop

# 删除集群
minikube delete
```

### kubeadm（生产环境）

```bash
# 所有节点执行
# 1. 关闭 swap
sudo swapoff -a
sudo sed -i '/ swap / s/^/#/' /etc/fstab

# 2. 安装 Docker
curl -fsSL https://get.docker.com | bash

# 3. 安装 kubeadm、kubelet、kubectl
sudo apt-get update
sudo apt-get install -y apt-transport-https ca-certificates curl
sudo curl -fsSLo /usr/share/keyrings/kubernetes-archive-keyring.gpg \
    https://packages.cloud.google.com/apt/doc/apt-key.gpg
echo "deb [signed-by=/usr/share/keyrings/kubernetes-archive-keyring.gpg] \
    https://apt.kubernetes.io/ kubernetes-xenial main" | \
    sudo tee /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubelet kubeadm kubectl
sudo apt-mark hold kubelet kubeadm kubectl

# Master 节点执行
# 4. 初始化集群
sudo kubeadm init --pod-network-cidr=10.244.0.0/16

# 5. 配置 kubectl
mkdir -p $HOME/.kube
sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
sudo chown $(id -u):$(id -g) $HOME/.kube/config

# 6. 安装网络插件（Flannel）
kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/master/Documentation/kube-flannel.yml

# Worker 节点执行
# 7. 加入集群
sudo kubeadm join <master-ip>:6443 --token <token> \
    --discovery-token-ca-cert-hash sha256:<hash>
```

### kubectl 基本命令

```bash
# 查看集群信息
kubectl cluster-info
kubectl get nodes
kubectl get componentstatuses

# 查看资源
kubectl get pods
kubectl get deployments
kubectl get services
kubectl get all

# 查看详细信息
kubectl describe pod <pod-name>
kubectl describe deployment <deployment-name>

# 查看日志
kubectl logs <pod-name>
kubectl logs -f <pod-name>                # 实时查看
kubectl logs <pod-name> -c <container>    # 多容器 Pod

# 进入容器
kubectl exec -it <pod-name> -- /bin/bash

# 删除资源
kubectl delete pod <pod-name>
kubectl delete deployment <deployment-name>
kubectl delete -f file.yaml
```

## 部署应用

### Pod

#### 创建 Pod

```yaml
# pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-pod
  labels:
    app: nginx
spec:
  containers:
  - name: nginx
    image: nginx:latest
    ports:
    - containerPort: 80
```

```bash
# 创建 Pod
kubectl apply -f pod.yaml

# 查看 Pod
kubectl get pods
kubectl get pods -o wide

# 删除 Pod
kubectl delete pod nginx-pod
```

#### 多容器 Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: multi-container-pod
spec:
  containers:
  - name: nginx
    image: nginx
    ports:
    - containerPort: 80
  - name: sidecar
    image: busybox
    command: ['sh', '-c', 'while true; do echo hello; sleep 10; done']
```

### Deployment

#### 创建 Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
      - name: nginx
        image: nginx:1.21
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "64Mi"
            cpu: "250m"
          limits:
            memory: "128Mi"
            cpu: "500m"
```

```bash
# 创建 Deployment
kubectl apply -f deployment.yaml

# 查看 Deployment
kubectl get deployments
kubectl get pods

# 查看详情
kubectl describe deployment nginx-deployment

# 更新镜像
kubectl set image deployment/nginx-deployment nginx=nginx:1.22

# 查看更新状态
kubectl rollout status deployment/nginx-deployment

# 查看历史版本
kubectl rollout history deployment/nginx-deployment

# 回滚
kubectl rollout undo deployment/nginx-deployment
kubectl rollout undo deployment/nginx-deployment --to-revision=2

# 扩缩容
kubectl scale deployment nginx-deployment --replicas=5

# 删除 Deployment
kubectl delete deployment nginx-deployment
```

### Service

#### ClusterIP（集群内部访问）

```yaml
# service-clusterip.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  type: ClusterIP
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

#### NodePort（外部访问）

```yaml
# service-nodeport.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-nodeport
spec:
  type: NodePort
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
    nodePort: 30080
```

#### LoadBalancer（云环境）

```yaml
# service-loadbalancer.yaml
apiVersion: v1
kind: Service
metadata:
  name: nginx-lb
spec:
  type: LoadBalancer
  selector:
    app: nginx
  ports:
  - protocol: TCP
    port: 80
    targetPort: 80
```

```bash
# 创建 Service
kubectl apply -f service.yaml

# 查看 Service
kubectl get services
kubectl get svc

# 查看详情
kubectl describe service nginx-service

# 访问服务
curl <cluster-ip>:80
curl <node-ip>:30080
```

## 暴露服务

### Ingress

#### 安装 Ingress Controller

```bash
# Nginx Ingress Controller
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml

# 查看状态
kubectl get pods -n ingress-nginx
kubectl get svc -n ingress-nginx
```

#### 创建 Ingress

```yaml
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

#### 多域名 Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: multi-host-ingress
spec:
  ingressClassName: nginx
  rules:
  - host: app1.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app1-service
            port:
              number: 80
  - host: app2.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app2-service
            port:
              number: 80
```

#### HTTPS Ingress

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: tls-secret
type: kubernetes.io/tls
data:
  tls.crt: <base64-encoded-cert>
  tls.key: <base64-encoded-key>
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: https-ingress
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - example.com
    secretName: tls-secret
  rules:
  - host: example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx-service
            port:
              number: 80
```

```bash
# 创建 Ingress
kubectl apply -f ingress.yaml

# 查看 Ingress
kubectl get ingress
kubectl describe ingress nginx-ingress

# 测试访问
curl -H "Host: example.com" http://<ingress-ip>
```

## 动态扩缩容

### 手动扩缩容

```bash
# 扩容到 5 个副本
kubectl scale deployment nginx-deployment --replicas=5

# 缩容到 2 个副本
kubectl scale deployment nginx-deployment --replicas=2
```

### 水平自动扩缩容（HPA）

#### 安装 Metrics Server

```bash
kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

# 查看资源使用
kubectl top nodes
kubectl top pods
```

#### 创建 HPA

```yaml
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: nginx-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 50
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

```bash
# 创建 HPA
kubectl apply -f hpa.yaml

# 或使用命令
kubectl autoscale deployment nginx-deployment --cpu-percent=50 --min=2 --max=10

# 查看 HPA
kubectl get hpa
kubectl describe hpa nginx-hpa

# 测试自动扩容
# 生成负载
kubectl run -it --rm load-generator --image=busybox /bin/sh
while true; do wget -q -O- http://nginx-service; done

# 观察扩容
kubectl get hpa -w
kubectl get pods -w
```

### 垂直自动扩缩容（VPA）

```yaml
# vpa.yaml
apiVersion: autoscaling.k8s.io/v1
kind: VerticalPodAutoscaler
metadata:
  name: nginx-vpa
spec:
  targetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: nginx-deployment
  updatePolicy:
    updateMode: "Auto"
  resourcePolicy:
    containerPolicies:
    - containerName: nginx
      minAllowed:
        cpu: 100m
        memory: 50Mi
      maxAllowed:
        cpu: 1
        memory: 500Mi
```

## 配置管理

### ConfigMap

#### 创建 ConfigMap

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  database_url: "mysql://localhost:3306/mydb"
  log_level: "info"
  config.properties: |
    server.port=8080
    server.host=0.0.0.0
```

```bash
# 从文件创建
kubectl create configmap app-config --from-file=config.properties

# 从字面值创建
kubectl create configmap app-config --from-literal=key1=value1 --from-literal=key2=value2

# 查看 ConfigMap
kubectl get configmap
kubectl describe configmap app-config
```

#### 使用 ConfigMap

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    # 方式1：环境变量
    env:
    - name: DATABASE_URL
      valueFrom:
        configMapKeyRef:
          name: app-config
          key: database_url
    # 方式2：全部导入为环境变量
    envFrom:
    - configMapRef:
        name: app-config
    # 方式3：挂载为文件
    volumeMounts:
    - name: config-volume
      mountPath: /etc/config
  volumes:
  - name: config-volume
    configMap:
      name: app-config
```

### Secret

#### 创建 Secret

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secret
type: Opaque
data:
  username: YWRtaW4=        # base64 编码的 admin
  password: cGFzc3dvcmQ=    # base64 编码的 password
```

```bash
# 从文件创建
kubectl create secret generic app-secret --from-file=username.txt --from-file=password.txt

# 从字面值创建
kubectl create secret generic app-secret --from-literal=username=admin --from-literal=password=password

# TLS Secret
kubectl create secret tls tls-secret --cert=tls.crt --key=tls.key

# Docker Registry Secret
kubectl create secret docker-registry regcred \
  --docker-server=registry.example.com \
  --docker-username=user \
  --docker-password=password \
  --docker-email=user@example.com

# 查看 Secret
kubectl get secrets
kubectl describe secret app-secret
```

#### 使用 Secret

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: myapp:latest
    # 环境变量
    env:
    - name: DB_USERNAME
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: username
    - name: DB_PASSWORD
      valueFrom:
        secretKeyRef:
          name: app-secret
          key: password
    # 挂载为文件
    volumeMounts:
    - name: secret-volume
      mountPath: /etc/secrets
      readOnly: true
  volumes:
  - name: secret-volume
    secret:
      secretName: app-secret
  # 使用私有镜像仓库
  imagePullSecrets:
  - name: regcred
```

## 数据持久化

### Volume 类型

```yaml
# emptyDir - 临时存储
apiVersion: v1
kind: Pod
metadata:
  name: test-pod
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: cache
      mountPath: /cache
  volumes:
  - name: cache
    emptyDir: {}

# hostPath - 主机路径
volumes:
- name: data
  hostPath:
    path: /data
    type: Directory

# nfs - 网络文件系统
volumes:
- name: nfs-volume
  nfs:
    server: nfs-server.example.com
    path: /exported/path
```

### PersistentVolume (PV)

```yaml
# pv.yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: pv-data
spec:
  capacity:
    storage: 10Gi
  accessModes:
  - ReadWriteOnce
  persistentVolumeReclaimPolicy: Retain
  storageClassName: standard
  hostPath:
    path: /data/pv
```

### PersistentVolumeClaim (PVC)

```yaml
# pvc.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pvc-data
spec:
  accessModes:
  - ReadWriteOnce
  resources:
    requests:
      storage: 5Gi
  storageClassName: standard
```

### 使用 PVC

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
spec:
  containers:
  - name: app
    image: nginx
    volumeMounts:
    - name: data
      mountPath: /data
  volumes:
  - name: data
    persistentVolumeClaim:
      claimName: pvc-data
```

### StorageClass（动态供应）

```yaml
# storageclass.yaml
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: fast-storage
provisioner: kubernetes.io/aws-ebs
parameters:
  type: gp2
  fsType: ext4
reclaimPolicy: Delete
allowVolumeExpansion: true
```

```yaml
# 使用 StorageClass 的 PVC
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
  - ReadWriteOnce
  storageClassName: fast-storage
  resources:
    requests:
      storage: 10Gi
```

## 命名空间

### 创建命名空间

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: development
```

```bash
# 创建命名空间
kubectl create namespace development

# 查看命名空间
kubectl get namespaces
kubectl get ns

# 在特定命名空间操作
kubectl get pods -n development
kubectl apply -f deployment.yaml -n development

# 设置默认命名空间
kubectl config set-context --current --namespace=development

# 删除命名空间
kubectl delete namespace development
```

### 资源配额

```yaml
# resourcequota.yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: development
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
    pods: "50"
```

### 限制范围

```yaml
# limitrange.yaml
apiVersion: v1
kind: LimitRange
metadata:
  name: dev-limits
  namespace: development
spec:
  limits:
  - max:
      cpu: "2"
      memory: 4Gi
    min:
      cpu: "100m"
      memory: 128Mi
    default:
      cpu: "500m"
      memory: 512Mi
    defaultRequest:
      cpu: "250m"
      memory: 256Mi
    type: Container
```

## 实战案例

### 完整的 Web 应用部署

```yaml
# namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: webapp
---
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: webapp
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
---
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
  namespace: webapp
type: Opaque
stringData:
  username: admin
  password: secretpassword
---
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-deployment
  namespace: webapp
spec:
  replicas: 3
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: myapp:v1.0
        ports:
        - containerPort: 8080
        env:
        - name: APP_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: password
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
---
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
  namespace: webapp
spec:
  selector:
    app: webapp
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8080
  type: ClusterIP
---
# ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: webapp-ingress
  namespace: webapp
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
  - host: webapp.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: webapp-service
            port:
              number: 80
---
# hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: webapp-hpa
  namespace: webapp
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: webapp-deployment
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

```bash
# 部署应用
kubectl apply -f webapp.yaml

# 查看资源
kubectl get all -n webapp

# 查看日志
kubectl logs -f deployment/webapp-deployment -n webapp

# 扩容
kubectl scale deployment webapp-deployment --replicas=5 -n webapp

# 更新镜像
kubectl set image deployment/webapp-deployment webapp=myapp:v2.0 -n webapp

# 查看更新状态
kubectl rollout status deployment/webapp-deployment -n webapp

# 回滚
kubectl rollout undo deployment/webapp-deployment -n webapp
```

## 最佳实践

### 1. 资源限制

始终为容器设置资源请求和限制：

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

### 2. 健康检查

配置存活探针和就绪探针：

```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 30
  periodSeconds: 10

readinessProbe:
  httpGet:
    path: /ready
    port: 8080
  initialDelaySeconds: 5
  periodSeconds: 5
```

### 3. 使用命名空间

按环境或团队隔离资源：

```bash
kubectl create namespace dev
kubectl create namespace test
kubectl create namespace prod
```

### 4. 标签和选择器

使用标签组织和选择资源：

```yaml
metadata:
  labels:
    app: myapp
    version: v1.0
    environment: production
```

### 5. 配置外部化

使用 ConfigMap 和 Secret 管理配置：

```yaml
envFrom:
- configMapRef:
    name: app-config
- secretRef:
    name: app-secret
```

### 6. 滚动更新

配置滚动更新策略：

```yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
```

### 7. 资源配额

为命名空间设置资源配额：

```yaml
apiVersion: v1
kind: ResourceQuota
metadata:
  name: compute-quota
spec:
  hard:
    requests.cpu: "10"
    requests.memory: 20Gi
    limits.cpu: "20"
    limits.memory: 40Gi
```

### 8. 网络策略

限制 Pod 之间的网络访问：

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
```

## 常见问题

### 1. Pod 一直处于 Pending 状态

```bash
# 查看原因
kubectl describe pod <pod-name>

# 常见原因：
# - 资源不足
# - PVC 未绑定
# - 节点选择器不匹配
```

### 2. Pod 频繁重启

```bash
# 查看日志
kubectl logs <pod-name> --previous

# 检查健康检查配置
# 检查资源限制
# 检查应用程序错误
```

### 3. Service 无法访问

```bash
# 检查 Service
kubectl get svc
kubectl describe svc <service-name>

# 检查 Endpoints
kubectl get endpoints <service-name>

# 检查标签选择器
kubectl get pods --show-labels
```

### 4. Ingress 不工作

```bash
# 检查 Ingress Controller
kubectl get pods -n ingress-nginx

# 检查 Ingress 配置
kubectl describe ingress <ingress-name>

# 检查 DNS 解析
# 检查防火墙规则
```

### 5. 镜像拉取失败

```bash
# 检查镜像名称
# 检查镜像仓库凭据
kubectl create secret docker-registry regcred \
  --docker-server=<registry> \
  --docker-username=<username> \
  --docker-password=<password>

# 在 Pod 中使用
spec:
  imagePullSecrets:
  - name: regcred
```

# Jenkins

## 概述

Jenkins 是一个开源的持续集成/持续部署（CI/CD）工具，用于自动化软件开发过程中的构建、测试和部署。

### 核心概念

| 概念 | 说明 |
|------|------|
| Job/Project | 任务或项目，定义了构建流程 |
| Build | 一次构建执行 |
| Pipeline | 流水线，定义完整的 CI/CD 流程 |
| Node/Agent | 执行构建的节点 |
| Workspace | 构建工作目录 |
| Plugin | 插件，扩展 Jenkins 功能 |

### CI/CD 流程

```
代码提交 → 触发构建 → 拉取代码 → 编译 → 测试 → 打包 → 部署
```

## 安装部署

### Docker 安装（推荐）

```bash
# 拉取镜像
docker pull jenkins/jenkins:lts

# 运行容器
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  jenkins/jenkins:lts

# 查看初始密码
docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

### Linux 安装

```bash
# Ubuntu/Debian
wget -q -O - https://pkg.jenkins.io/debian-stable/jenkins.io.key | sudo apt-key add -
sudo sh -c 'echo deb https://pkg.jenkins.io/debian-stable binary/ > /etc/apt/sources.list.d/jenkins.list'
sudo apt update
sudo apt install jenkins

# CentOS/RHEL
sudo wget -O /etc/yum.repos.d/jenkins.repo https://pkg.jenkins.io/redhat-stable/jenkins.repo
sudo rpm --import https://pkg.jenkins.io/redhat-stable/jenkins.io.key
sudo yum install jenkins

# 启动服务
sudo systemctl start jenkins
sudo systemctl enable jenkins

# 查看初始密码
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

### 初始化配置

1. 访问 `http://localhost:8080`
2. 输入初始管理员密码
3. 安装推荐插件或自定义插件
4. 创建管理员用户
5. 配置 Jenkins URL

## 基础配置

### 系统配置

```
Manage Jenkins → Configure System

# 主要配置项
- Jenkins Location（Jenkins URL）
- 邮件通知（SMTP 服务器）
- 全局属性（环境变量）
- Git 配置
- Maven 配置
```

### 全局工具配置

```
Manage Jenkins → Global Tool Configuration

# 配置工具
- JDK
- Git
- Maven
- Gradle
- Node.js
- Docker
```

### 插件管理

```bash
# 常用插件
- Git Plugin                           # Git 支持
- Pipeline                             # 流水线
- Blue Ocean                           # 现代化 UI
- Docker Pipeline                      # Docker 支持
- Kubernetes                           # K8s 支持
- Email Extension                      # 邮件通知
- Publish Over SSH                     # SSH 部署
- Role-based Authorization Strategy    # 权限管理
- Credentials Binding                  # 凭据管理
```

安装插件：
```
Manage Jenkins → Manage Plugins → Available
搜索并安装所需插件
```

## 创建任务

### Freestyle Project

#### 创建步骤

1. 新建任务 → Freestyle project
2. 配置源码管理（Git）
3. 配置构建触发器
4. 添加构建步骤
5. 配置构建后操作

#### 示例：Java Maven 项目

```
源码管理：
- Git
- Repository URL: https://github.com/user/project.git
- Credentials: 添加 Git 凭据
- Branch: */main

构建触发器：
- Poll SCM: H/5 * * * *                # 每 5 分钟检查一次

构建环境：
- Delete workspace before build starts

Build：
- Execute shell:
  mvn clean package -DskipTests

构建后操作：
- Archive the artifacts: target/*.jar
- Email Notification
```

### Pipeline 项目

#### Declarative Pipeline

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8'
        jdk 'JDK 11'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/user/project.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    scp target/*.jar user@server:/app/
                    ssh user@server "systemctl restart myapp"
                '''
            }
        }
    }
    
    post {
        success {
            echo 'Build succeeded!'
            emailext (
                subject: "Build Success: ${env.JOB_NAME}",
                body: "Build ${env.BUILD_NUMBER} succeeded",
                to: "team@example.com"
            )
        }
        failure {
            echo 'Build failed!'
            emailext (
                subject: "Build Failed: ${env.JOB_NAME}",
                body: "Build ${env.BUILD_NUMBER} failed",
                to: "team@example.com"
            )
        }
    }
}
```

#### Scripted Pipeline

```groovy
node {
    def mvnHome = tool 'Maven 3.8'
    
    stage('Checkout') {
        git branch: 'main',
            url: 'https://github.com/user/project.git'
    }
    
    stage('Build') {
        sh "${mvnHome}/bin/mvn clean package -DskipTests"
    }
    
    stage('Test') {
        sh "${mvnHome}/bin/mvn test"
    }
    
    stage('Deploy') {
        sh '''
            scp target/*.jar user@server:/app/
            ssh user@server "systemctl restart myapp"
        '''
    }
}
```

### Jenkinsfile

在项目根目录创建 `Jenkinsfile`：

```groovy
pipeline {
    agent any
    
    environment {
        DOCKER_REGISTRY = 'registry.example.com'
        IMAGE_NAME = 'myapp'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                script {
                    docker.build("${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }
        
        stage('Test') {
            steps {
                sh 'docker run --rm ${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG} npm test'
            }
        }
        
        stage('Push') {
            steps {
                script {
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}").push()
                        docker.image("${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sh '''
                    kubectl set image deployment/myapp \
                        myapp=${DOCKER_REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}
                '''
            }
        }
    }
}
```

## 构建触发器

### 定时构建

```groovy
// 每天凌晨 2 点构建
triggers {
    cron('0 2 * * *')
}

// 每 15 分钟构建一次
triggers {
    cron('H/15 * * * *')
}

// 工作日每天 8 点构建
triggers {
    cron('0 8 * * 1-5')
}
```

### 轮询 SCM

```groovy
// 每 5 分钟检查代码变化
triggers {
    pollSCM('H/5 * * * *')
}
```

### Webhook 触发

#### GitHub Webhook

1. Jenkins 安装 GitHub Plugin
2. 项目配置 → 构建触发器 → GitHub hook trigger
3. GitHub 仓库 → Settings → Webhooks
4. 添加 Webhook：`http://jenkins-url/github-webhook/`

#### GitLab Webhook

1. Jenkins 安装 GitLab Plugin
2. 项目配置 → 构建触发器 → Build when a change is pushed to GitLab
3. GitLab 项目 → Settings → Webhooks
4. 添加 Webhook：`http://jenkins-url/project/project-name`

### 参数化构建

```groovy
pipeline {
    agent any
    
    parameters {
        string(name: 'BRANCH', defaultValue: 'main', description: 'Git branch')
        choice(name: 'ENVIRONMENT', choices: ['dev', 'test', 'prod'], description: 'Deploy environment')
        booleanParam(name: 'RUN_TESTS', defaultValue: true, description: 'Run tests')
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: "${params.BRANCH}",
                    url: 'https://github.com/user/project.git'
            }
        }
        
        stage('Test') {
            when {
                expression { params.RUN_TESTS }
            }
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Deploy') {
            steps {
                echo "Deploying to ${params.ENVIRONMENT}"
                sh "deploy.sh ${params.ENVIRONMENT}"
            }
        }
    }
}
```

## 凭据管理

### 添加凭据

```
Manage Jenkins → Manage Credentials → Global → Add Credentials

类型：
- Username with password        # 用户名密码
- SSH Username with private key # SSH 密钥
- Secret text                   # 密钥文本
- Secret file                   # 密钥文件
- Certificate                   # 证书
```

### 在 Pipeline 中使用

```groovy
pipeline {
    agent any
    
    environment {
        // 使用凭据
        DOCKER_CREDS = credentials('docker-hub-credentials')
        GIT_CREDS = credentials('git-credentials')
    }
    
    stages {
        stage('Login') {
            steps {
                // 使用用户名密码
                sh 'echo $DOCKER_CREDS_PSW | docker login -u $DOCKER_CREDS_USR --password-stdin'
            }
        }
        
        stage('Clone') {
            steps {
                // 使用 SSH 密钥
                git credentialsId: 'git-ssh-key',
                    url: 'git@github.com:user/project.git'
            }
        }
        
        stage('Deploy') {
            steps {
                // 使用 Secret text
                withCredentials([string(credentialsId: 'api-token', variable: 'API_TOKEN')]) {
                    sh 'curl -H "Authorization: Bearer $API_TOKEN" https://api.example.com'
                }
            }
        }
    }
}
```

## 实战案例

### Java Spring Boot 项目

```groovy
pipeline {
    agent any
    
    tools {
        maven 'Maven 3.8'
        jdk 'JDK 11'
    }
    
    environment {
        APP_NAME = 'myapp'
        DEPLOY_SERVER = '192.168.1.100'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    credentialsId: 'git-credentials',
                    url: 'https://github.com/user/springboot-app.git'
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package -DskipTests'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
            post {
                always {
                    junit 'target/surefire-reports/*.xml'
                }
            }
        }
        
        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${APP_NAME}:${BUILD_NUMBER}")
                }
            }
        }
        
        stage('Push to Registry') {
            steps {
                script {
                    docker.withRegistry('https://registry.example.com', 'docker-credentials') {
                        docker.image("${APP_NAME}:${BUILD_NUMBER}").push()
                        docker.image("${APP_NAME}:${BUILD_NUMBER}").push('latest')
                    }
                }
            }
        }
        
        stage('Deploy') {
            steps {
                sshagent(['ssh-credentials']) {
                    sh """
                        ssh user@${DEPLOY_SERVER} '
                            docker pull registry.example.com/${APP_NAME}:${BUILD_NUMBER}
                            docker stop ${APP_NAME} || true
                            docker rm ${APP_NAME} || true
                            docker run -d --name ${APP_NAME} -p 8080:8080 \
                                registry.example.com/${APP_NAME}:${BUILD_NUMBER}
                        '
                    """
                }
            }
        }
    }
    
    post {
        success {
            emailext (
                subject: "✅ Build Success: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <p>Build succeeded!</p>
                    <p>Job: ${env.JOB_NAME}</p>
                    <p>Build Number: ${env.BUILD_NUMBER}</p>
                    <p>Build URL: ${env.BUILD_URL}</p>
                """,
                to: "team@example.com",
                mimeType: 'text/html'
            )
        }
        failure {
            emailext (
                subject: "❌ Build Failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}",
                body: """
                    <p>Build failed!</p>
                    <p>Job: ${env.JOB_NAME}</p>
                    <p>Build Number: ${env.BUILD_NUMBER}</p>
                    <p>Build URL: ${env.BUILD_URL}</p>
                """,
                to: "team@example.com",
                mimeType: 'text/html'
            )
        }
    }
}
```

### Node.js 项目

```groovy
pipeline {
    agent any
    
    tools {
        nodejs 'Node 16'
    }
    
    environment {
        APP_NAME = 'frontend'
        DOCKER_REGISTRY = 'registry.example.com'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/user/react-app.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        
        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }
        
        stage('Test') {
            steps {
                sh 'npm test -- --coverage'
            }
            post {
                always {
                    publishHTML([
                        reportDir: 'coverage',
                        reportFiles: 'index.html',
                        reportName: 'Coverage Report'
                    ])
                }
            }
        }
        
        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }
        
        stage('Docker Build & Push') {
            steps {
                script {
                    def image = docker.build("${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}")
                    docker.withRegistry("https://${DOCKER_REGISTRY}", 'docker-credentials') {
                        image.push()
                        image.push('latest')
                    }
                }
            }
        }
        
        stage('Deploy to K8s') {
            steps {
                sh """
                    kubectl set image deployment/${APP_NAME} \
                        ${APP_NAME}=${DOCKER_REGISTRY}/${APP_NAME}:${BUILD_NUMBER}
                    kubectl rollout status deployment/${APP_NAME}
                """
            }
        }
    }
}
```

### 多分支流水线

```groovy
pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Build') {
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Test') {
            steps {
                sh 'mvn test'
            }
        }
        
        stage('Deploy to Dev') {
            when {
                branch 'develop'
            }
            steps {
                echo 'Deploying to dev environment'
                sh 'deploy.sh dev'
            }
        }
        
        stage('Deploy to Test') {
            when {
                branch 'release/*'
            }
            steps {
                echo 'Deploying to test environment'
                sh 'deploy.sh test'
            }
        }
        
        stage('Deploy to Prod') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?', ok: 'Deploy'
                echo 'Deploying to production'
                sh 'deploy.sh prod'
            }
        }
    }
}
```

## 分布式构建

### 配置 Agent 节点

```
Manage Jenkins → Manage Nodes → New Node

配置：
- Name: agent-1
- Remote root directory: /home/jenkins
- Labels: linux docker
- Launch method: Launch agent via SSH
- Host: 192.168.1.101
- Credentials: SSH 凭据
```

### 在 Pipeline 中使用

```groovy
pipeline {
    agent none
    
    stages {
        stage('Build on Linux') {
            agent {
                label 'linux'
            }
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Build on Docker') {
            agent {
                docker {
                    image 'maven:3.8-openjdk-11'
                    label 'docker'
                }
            }
            steps {
                sh 'mvn clean package'
            }
        }
        
        stage('Parallel Tests') {
            parallel {
                stage('Unit Tests') {
                    agent { label 'linux' }
                    steps {
                        sh 'mvn test'
                    }
                }
                stage('Integration Tests') {
                    agent { label 'linux' }
                    steps {
                        sh 'mvn verify'
                    }
                }
            }
        }
    }
}
```

## 最佳实践

### 1. 使用 Jenkinsfile

将 Pipeline 定义存储在代码仓库中，实现 Pipeline as Code。

### 2. 使用共享库

创建可重用的 Pipeline 代码：

```groovy
// vars/buildJava.groovy
def call(Map config) {
    pipeline {
        agent any
        stages {
            stage('Build') {
                steps {
                    sh "mvn clean package -DskipTests"
                }
            }
        }
    }
}

// Jenkinsfile
@Library('my-shared-library') _
buildJava(
    gitUrl: 'https://github.com/user/project.git',
    branch: 'main'
)
```

### 3. 使用环境变量

```groovy
environment {
    JAVA_HOME = '/usr/lib/jvm/java-11'
    MAVEN_OPTS = '-Xmx1024m'
}
```

### 4. 错误处理

```groovy
try {
    stage('Build') {
        sh 'mvn clean package'
    }
} catch (Exception e) {
    currentBuild.result = 'FAILURE'
    throw e
} finally {
    // 清理工作
    cleanWs()
}
```

### 5. 并行执行

```groovy
stage('Parallel Stage') {
    parallel {
        stage('Task 1') {
            steps {
                sh 'task1.sh'
            }
        }
        stage('Task 2') {
            steps {
                sh 'task2.sh'
            }
        }
    }
}
```

### 6. 构建缓存

```groovy
// 使用 Docker 缓存
agent {
    docker {
        image 'maven:3.8-openjdk-11'
        args '-v $HOME/.m2:/root/.m2'
    }
}
```

### 7. 通知机制

```groovy
post {
    always {
        // 总是执行
    }
    success {
        // 成功时执行
        slackSend color: 'good', message: "Build succeeded: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
    failure {
        // 失败时执行
        slackSend color: 'danger', message: "Build failed: ${env.JOB_NAME} #${env.BUILD_NUMBER}"
    }
}
```

## 常见问题

### 1. 权限问题

```bash
# Jenkins 用户添加到 docker 组
sudo usermod -aG docker jenkins
sudo systemctl restart jenkins
```

### 2. 内存不足

```bash
# 修改 Jenkins 内存配置
sudo vim /etc/default/jenkins
JAVA_ARGS="-Xmx2048m -Xms512m"

sudo systemctl restart jenkins
```

### 3. 插件冲突

```
Manage Jenkins → Manage Plugins → Installed
检查并更新冲突的插件
```

### 4. 构建超时

```groovy
options {
    timeout(time: 1, unit: 'HOURS')
}
```

### 5. 清理工作空间

```groovy
post {
    always {
        cleanWs()
    }
}
```

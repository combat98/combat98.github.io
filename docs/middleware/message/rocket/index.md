---
next:
  text: 'RabbitMQ'
  link: '/middleware/message/rabbit'
---
# Rocket

## 简介


## 安装
Apache官方[下载地址](http://rocketmq.apache.org/release_notes/release-notes-4.8.0/)
### windows安装
需要先配置好JDK环境
#### 配置ROCKETMQ_HOME
变量名：`ROCKETMQ_HOME`

变量值：RocketMQ安装目录
#### 启动nameserver
打开CMD界面，进入自己的RocketMQ安装目录下的bin目录，输入下面命令启动 nameserver：
> start mqnamesrv.cmd 

如果启动mqbroker.cmd报错，找不到主类。
> set "JAVA_OPT=%JAVA_OPT% -cp %CLASSPATH%"
> 
> 改为：
> 
>set "JAVA_OPT=%JAVA_OPT% -cp "%CLASSPATH%""
#### 启动broker
打开CMD界面，进入自己的RocketMQ安装目录下的bin目录，输入下面命令启动 broker：
> start mqbroker.cmd -n 127.0.0.1:9876 autoCreateTopicEnable=true

如果启动发生错误，弹出无法找到主类的xxx的错误，此时用文本编辑器打开 runbroker.cmd 进行编辑。
>  set CLASSPATH=.;%BASE_DIR%conf;%CLASSPATH%
> 
> 改成:
> 
> set CLASSPATH=.;%BASE_DIR%conf;"%CLASSPATH%"
#### rocketmq-console安装
>  git clone https://github.com/apache/rocketmq-externals.git

**修改application.properties**
```
server.port=8081
rocketmq.config.namesrvAddr=127.0.0.1:9876
```
**打包**
> mvn clean package '-Dmaven.test.skip=true'

**启动**
> java -Xms300m -Xmx300m -jar rocketmq-console-ng-1.0.0.jar
#### 建议
```text
mqbroker.cmd
将其中的xmx，xms等进行修改256m，弄小一点，让服务器用
mqnamesrv.cmd
同理修改其中的xmx，xms等进行修改256m，弄小一点，让服务器用
```

### linux安装
官网地址：https://rocketmq.apache.org/
```text
yum install unzip  可以解压zip包的依赖
unzip rocketmq-all-4.8.0-bin-release.zip
cd rocketmq-all-4.8.0-bin-release
cd bin
vim runserver.sh
将其中的xmx，xms等进行修改256m，弄小一点，让服务器用
vim runbroker.sh
同理修改其中的xmx，xms等进行修改256m，弄小一点，让服务器用
nohup sh mqnamesrv &
tail -f ~/logs/rocketmqlogs/namesrv.log
```
## 快速入门

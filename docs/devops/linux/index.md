# Linux

## Linux 系统安装

### 常见发行版

| 发行版 | 特点 | 适用场景 |
|--------|------|----------|
| Ubuntu | 易用、社区活跃 | 桌面、开发环境 |
| CentOS/Rocky | 稳定、企业级 | 服务器生产环境 |
| Debian | 稳定、轻量 | 服务器 |
| Fedora | 新特性、前沿 | 开发测试 |
| Alpine | 极简、安全 | 容器环境 |

### 安装方式

```bash
# 1. 物理机安装
# 下载 ISO 镜像，制作启动盘，按提示安装

# 2. 虚拟机安装（VMware/VirtualBox）
# 创建虚拟机，挂载 ISO，按提示安装

# 3. 云服务器
# 直接购买云主机（阿里云、腾讯云、AWS 等）
```

### 系统初始化

```bash
# 更新系统
sudo apt update && sudo apt upgrade -y  # Ubuntu/Debian
sudo yum update -y                       # CentOS

# 设置主机名
sudo hostnamectl set-hostname myserver

# 配置时区
sudo timedatectl set-timezone Asia/Shanghai

# 关闭 SELinux（CentOS）
sudo setenforce 0
sudo sed -i 's/SELINUX=enforcing/SELINUX=disabled/g' /etc/selinux/config
```

## 环境变量

### 查看环境变量

```bash
# 查看所有环境变量
env
printenv

# 查看特定变量
echo $PATH
echo $HOME
echo $USER
```

### 设置环境变量

```bash
# 临时设置（当前会话有效）
export JAVA_HOME=/usr/local/java
export PATH=$PATH:$JAVA_HOME/bin

# 永久设置 - 当前用户
vim ~/.bashrc
# 或
vim ~/.bash_profile

# 添加以下内容
export JAVA_HOME=/usr/local/java
export PATH=$PATH:$JAVA_HOME/bin

# 使配置生效
source ~/.bashrc

# 永久设置 - 所有用户
sudo vim /etc/profile
# 添加环境变量后
source /etc/profile
```

### 常用环境变量

```bash
PATH        # 可执行文件搜索路径
HOME        # 用户主目录
USER        # 当前用户名
SHELL       # 当前 Shell
PWD         # 当前工作目录
LANG        # 系统语言
JAVA_HOME   # Java 安装目录
```

## 文件管理

### 目录结构

```bash
/           # 根目录
├── bin     # 基本命令
├── boot    # 启动文件
├── dev     # 设备文件
├── etc     # 配置文件
├── home    # 用户主目录
├── lib     # 系统库文件
├── opt     # 第三方软件
├── root    # root 用户主目录
├── tmp     # 临时文件
├── usr     # 用户程序
└── var     # 可变数据（日志等）
```

### 文件操作

```bash
# 查看文件
ls -la              # 详细列表
ls -lh              # 人性化显示大小
tree                # 树形显示目录结构

# 创建
touch file.txt      # 创建文件
mkdir dir           # 创建目录
mkdir -p a/b/c      # 递归创建

# 复制
cp file1 file2      # 复制文件
cp -r dir1 dir2     # 复制目录

# 移动/重命名
mv file1 file2      # 重命名
mv file1 /path/     # 移动文件

# 删除
rm file             # 删除文件
rm -rf dir          # 强制删除目录

# 查找
find /path -name "*.txt"              # 按名称查找
find /path -type f -size +100M        # 查找大于 100M 的文件
find /path -mtime -7                  # 查找 7 天内修改的文件

# 查看文件内容
cat file            # 查看全部内容
head -n 20 file     # 查看前 20 行
tail -n 20 file     # 查看后 20 行
tail -f file        # 实时查看文件追加内容
less file           # 分页查看
more file           # 分页查看
```

### 文件权限

```bash
# 权限说明
# rwx rwx rwx
# 所有者 组 其他人
# r=4 w=2 x=1

# 修改权限
chmod 755 file      # rwxr-xr-x
chmod +x file       # 添加执行权限
chmod -w file       # 移除写权限
chmod u+x file      # 所有者添加执行权限

# 修改所有者
chown user:group file
chown -R user:group dir

# 查看权限
ls -l file
```

### 文件压缩

```bash
# tar
tar -czf archive.tar.gz dir/        # 压缩
tar -xzf archive.tar.gz             # 解压
tar -tzf archive.tar.gz             # 查看内容

# zip
zip -r archive.zip dir/             # 压缩
unzip archive.zip                   # 解压
unzip -l archive.zip                # 查看内容

# gzip
gzip file                           # 压缩（删除原文件）
gunzip file.gz                      # 解压
```

## 用户管理

### 用户操作

```bash
# 创建用户
sudo useradd username
sudo useradd -m -s /bin/bash username  # 创建主目录并指定 shell

# 设置密码
sudo passwd username

# 删除用户
sudo userdel username
sudo userdel -r username               # 同时删除主目录

# 修改用户
sudo usermod -aG sudo username         # 添加到 sudo 组
sudo usermod -s /bin/zsh username      # 修改 shell

# 查看用户
id username                            # 查看用户信息
whoami                                 # 当前用户
who                                    # 登录用户
w                                      # 详细登录信息
```

### 组管理

```bash
# 创建组
sudo groupadd groupname

# 删除组
sudo groupdel groupname

# 添加用户到组
sudo usermod -aG groupname username
sudo gpasswd -a username groupname

# 从组中移除用户
sudo gpasswd -d username groupname

# 查看组
groups username                        # 查看用户所属组
cat /etc/group                         # 查看所有组
```

### sudo 权限

```bash
# 编辑 sudoers 文件
sudo visudo

# 添加用户 sudo 权限
username ALL=(ALL:ALL) ALL

# 免密码执行 sudo
username ALL=(ALL) NOPASSWD: ALL
```

## 内存管理

### 查看内存

```bash
# 查看内存使用
free -h                                # 人性化显示
free -m                                # 以 MB 显示

# 详细内存信息
cat /proc/meminfo

# 实时监控
top                                    # 按 M 按内存排序
htop                                   # 更友好的界面
```

### 清理缓存

```bash
# 清理页面缓存
sudo sync && sudo echo 1 > /proc/sys/vm/drop_caches

# 清理目录项和 inode
sudo sync && sudo echo 2 > /proc/sys/vm/drop_caches

# 清理所有缓存
sudo sync && sudo echo 3 > /proc/sys/vm/drop_caches
```

### Swap 管理

```bash
# 查看 swap
swapon --show
free -h

# 创建 swap 文件
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# 永久启用
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# 关闭 swap
sudo swapoff /swapfile
```

## 磁盘管理

### 查看磁盘

```bash
# 磁盘使用情况
df -h                                  # 人性化显示
df -i                                  # inode 使用情况

# 目录大小
du -sh /path                           # 目录总大小
du -h --max-depth=1 /path              # 子目录大小

# 磁盘信息
lsblk                                  # 块设备信息
fdisk -l                               # 磁盘分区信息
```

### 磁盘分区

```bash
# 使用 fdisk
sudo fdisk /dev/sdb
# n - 新建分区
# p - 主分区
# w - 保存退出

# 格式化分区
sudo mkfs.ext4 /dev/sdb1

# 挂载
sudo mkdir /mnt/data
sudo mount /dev/sdb1 /mnt/data

# 永久挂载
echo '/dev/sdb1 /mnt/data ext4 defaults 0 0' | sudo tee -a /etc/fstab
```

### 磁盘清理

```bash
# 查找大文件
find / -type f -size +100M -exec ls -lh {} \;

# 清理日志
sudo journalctl --vacuum-time=7d       # 保留 7 天日志
sudo journalctl --vacuum-size=500M     # 保留 500M 日志

# 清理包缓存
sudo apt clean                         # Ubuntu
sudo yum clean all                     # CentOS

# 清理旧内核
sudo apt autoremove                    # Ubuntu
```

## 进程管理

### 查看进程

```bash
# 查看所有进程
ps aux                                 # 详细信息
ps -ef                                 # 完整格式

# 查看进程树
pstree

# 实时监控
top                                    # 传统工具
htop                                   # 更友好
glances                                # 更全面

# 查找进程
ps aux | grep nginx
pgrep nginx
pidof nginx
```

### 进程控制

```bash
# 启动后台进程
command &
nohup command &                        # 忽略挂断信号

# 终止进程
kill PID                               # 正常终止
kill -9 PID                            # 强制终止
killall process_name                   # 按名称终止
pkill process_name                     # 按名称终止

# 进程优先级
nice -n 10 command                     # 启动时设置优先级
renice -n 5 -p PID                     # 修改运行中进程优先级
```

### 后台任务

```bash
# 查看后台任务
jobs

# 将任务放到后台
Ctrl + Z                               # 暂停当前任务
bg                                     # 后台继续运行

# 将任务调到前台
fg %1                                  # 将任务 1 调到前台

# screen 会话管理
screen -S session_name                 # 创建会话
screen -ls                             # 列出会话
screen -r session_name                 # 恢复会话
Ctrl + A + D                           # 分离会话

# tmux 会话管理
tmux new -s session_name               # 创建会话
tmux ls                                # 列出会话
tmux attach -t session_name            # 恢复会话
Ctrl + B, D                            # 分离会话
```

## 网络管理

### 网络配置

```bash
# 查看网络接口
ip addr show
ifconfig

# 查看路由
ip route show
route -n

# 配置 IP（临时）
sudo ip addr add 192.168.1.100/24 dev eth0
sudo ip link set eth0 up

# 配置 IP（永久 - Ubuntu）
sudo vim /etc/netplan/01-netcfg.yaml
network:
  version: 2
  ethernets:
    eth0:
      addresses: [192.168.1.100/24]
      gateway4: 192.168.1.1
      nameservers:
        addresses: [8.8.8.8, 114.114.114.114]

sudo netplan apply
```

### 网络测试

```bash
# 测试连通性
ping -c 4 baidu.com

# 测试端口
telnet host port
nc -zv host port

# 路由追踪
traceroute baidu.com
mtr baidu.com                          # 更强大的工具

# DNS 查询
nslookup baidu.com
dig baidu.com
host baidu.com

# 下载测试
curl -O url
wget url
```

### 防火墙

```bash
# firewalld（CentOS）
sudo systemctl start firewalld
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --reload
sudo firewall-cmd --list-all

# ufw（Ubuntu）
sudo ufw enable
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw status

# iptables
sudo iptables -L                       # 查看规则
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables-save > /etc/iptables/rules.v4
```

### 网络监控

```bash
# 查看连接
netstat -tunlp                         # 监听端口
ss -tunlp                              # 更快的替代品

# 查看网络流量
iftop                                  # 实时流量
nethogs                                # 按进程显示
vnstat                                 # 流量统计

# 抓包
sudo tcpdump -i eth0 port 80
sudo tcpdump -i eth0 -w capture.pcap
```

## 软件包管理

### APT（Ubuntu/Debian）

```bash
# 更新软件源
sudo apt update

# 升级软件
sudo apt upgrade
sudo apt full-upgrade

# 安装软件
sudo apt install package_name
sudo apt install -y package_name       # 自动确认

# 卸载软件
sudo apt remove package_name
sudo apt purge package_name            # 同时删除配置文件
sudo apt autoremove                    # 清理依赖

# 搜索软件
apt search keyword
apt show package_name

# 清理缓存
sudo apt clean
sudo apt autoclean
```

### YUM/DNF（CentOS/RHEL）

```bash
# 更新软件
sudo yum update
sudo yum upgrade

# 安装软件
sudo yum install package_name
sudo yum install -y package_name

# 卸载软件
sudo yum remove package_name

# 搜索软件
yum search keyword
yum info package_name

# 清理缓存
sudo yum clean all

# DNF（新版本）
sudo dnf install package_name
```

### 源码编译安装

```bash
# 下载源码
wget https://example.com/software.tar.gz
tar -xzf software.tar.gz
cd software

# 编译安装
./configure --prefix=/usr/local/software
make
sudo make install

# 卸载
sudo make uninstall
```

## 服务管理

### Systemd

```bash
# 启动服务
sudo systemctl start nginx

# 停止服务
sudo systemctl stop nginx

# 重启服务
sudo systemctl restart nginx

# 重新加载配置
sudo systemctl reload nginx

# 查看状态
sudo systemctl status nginx

# 开机自启
sudo systemctl enable nginx
sudo systemctl disable nginx

# 查看所有服务
systemctl list-units --type=service
systemctl list-unit-files --type=service
```

### 创建 Systemd 服务

```bash
# 创建服务文件
sudo vim /etc/systemd/system/myapp.service

[Unit]
Description=My Application
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/myapp
ExecStart=/usr/bin/java -jar /opt/myapp/app.jar
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target

# 重新加载配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start myapp
sudo systemctl enable myapp
```

## 日志管理

### 系统日志

```bash
# 查看系统日志
sudo journalctl

# 查看特定服务日志
sudo journalctl -u nginx

# 实时查看日志
sudo journalctl -f
sudo journalctl -u nginx -f

# 查看最近日志
sudo journalctl -n 100                 # 最近 100 条
sudo journalctl --since "1 hour ago"
sudo journalctl --since "2023-01-01"

# 按优先级过滤
sudo journalctl -p err                 # 只看错误
```

### 应用日志

```bash
# 常见日志位置
/var/log/syslog                        # 系统日志
/var/log/auth.log                      # 认证日志
/var/log/nginx/                        # Nginx 日志
/var/log/mysql/                        # MySQL 日志

# 实时查看
tail -f /var/log/nginx/access.log

# 日志分析
grep "ERROR" /var/log/app.log
grep "ERROR" /var/log/app.log | wc -l  # 统计错误数
```

### 日志轮转

```bash
# 配置 logrotate
sudo vim /etc/logrotate.d/myapp

/var/log/myapp/*.log {
    daily                              # 每天轮转
    rotate 7                           # 保留 7 天
    compress                           # 压缩旧日志
    delaycompress                      # 延迟压缩
    missingok                          # 文件不存在不报错
    notifempty                         # 空文件不轮转
    create 0640 www-data www-data      # 创建新文件权限
    sharedscripts
    postrotate
        systemctl reload myapp
    endscript
}

# 手动执行
sudo logrotate -f /etc/logrotate.d/myapp
```

## Linux 内核

### 查看内核信息

```bash
# 内核版本
uname -r
uname -a

# 系统信息
cat /etc/os-release
lsb_release -a

# 硬件信息
lscpu                                  # CPU 信息
lsmem                                  # 内存信息
lsblk                                  # 块设备
lspci                                  # PCI 设备
lsusb                                  # USB 设备
```

### 内核参数

```bash
# 查看内核参数
sysctl -a

# 临时修改
sudo sysctl -w net.ipv4.ip_forward=1

# 永久修改
sudo vim /etc/sysctl.conf
net.ipv4.ip_forward = 1

# 使配置生效
sudo sysctl -p
```

### 常用内核参数

```bash
# 网络优化
net.ipv4.tcp_tw_reuse = 1              # TIME_WAIT 重用
net.ipv4.tcp_fin_timeout = 30          # FIN_WAIT 超时
net.core.somaxconn = 1024              # 连接队列大小
net.ipv4.tcp_max_syn_backlog = 2048    # SYN 队列大小

# 文件描述符
fs.file-max = 65535                    # 系统最大文件描述符

# 共享内存
kernel.shmmax = 68719476736            # 最大共享内存段
kernel.shmall = 4294967296             # 总共享内存页数
```

## 常用命令

### 文本处理

```bash
# grep - 搜索文本
grep "pattern" file
grep -r "pattern" /path                # 递归搜索
grep -i "pattern" file                 # 忽略大小写
grep -v "pattern" file                 # 反向匹配
grep -n "pattern" file                 # 显示行号

# sed - 流编辑器
sed 's/old/new/' file                  # 替换第一个匹配
sed 's/old/new/g' file                 # 替换所有匹配
sed -i 's/old/new/g' file              # 直接修改文件
sed -n '10,20p' file                   # 打印 10-20 行

# awk - 文本分析
awk '{print $1}' file                  # 打印第一列
awk -F: '{print $1}' /etc/passwd       # 指定分隔符
awk '$3 > 100' file                    # 条件过滤

# cut - 列提取
cut -d: -f1 /etc/passwd                # 提取第一列
cut -c1-10 file                        # 提取 1-10 字符

# sort - 排序
sort file                              # 排序
sort -r file                           # 逆序
sort -n file                           # 数字排序
sort -u file                           # 去重排序

# uniq - 去重
sort file | uniq                       # 去重
sort file | uniq -c                    # 统计重复次数

# wc - 统计
wc -l file                             # 行数
wc -w file                             # 单词数
wc -c file                             # 字节数
```

### 系统信息

```bash
# 系统运行时间
uptime

# 系统负载
w
top

# CPU 信息
lscpu
cat /proc/cpuinfo

# 内存信息
free -h
cat /proc/meminfo

# 磁盘 I/O
iostat
iotop

# 系统调用跟踪
strace command
strace -p PID
```

### 网络命令

```bash
# 下载
curl -O url
wget url
wget -c url                            # 断点续传

# HTTP 请求
curl -X GET url
curl -X POST -d "data" url
curl -H "Content-Type: application/json" url

# 文件传输
scp file user@host:/path               # 上传
scp user@host:/path/file .             # 下载
scp -r dir user@host:/path             # 传输目录

# rsync 同步
rsync -avz source/ dest/
rsync -avz --delete source/ dest/      # 删除目标多余文件
rsync -avz -e ssh source/ user@host:/dest/
```

## 常用环境搭建

### Java 环境

```bash
# 安装 OpenJDK
sudo apt install openjdk-11-jdk        # Ubuntu
sudo yum install java-11-openjdk       # CentOS

# 或下载 Oracle JDK
wget https://download.oracle.com/java/17/latest/jdk-17_linux-x64_bin.tar.gz
sudo tar -xzf jdk-17_linux-x64_bin.tar.gz -C /usr/local/

# 配置环境变量
sudo vim /etc/profile
export JAVA_HOME=/usr/local/jdk-17
export PATH=$PATH:$JAVA_HOME/bin

source /etc/profile

# 验证
java -version
```

### Node.js 环境

```bash
# 使用 NodeSource 仓库
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# 验证
node -v
npm -v
```

### Python 环境

```bash
# 安装 Python
sudo apt install python3 python3-pip   # Ubuntu
sudo yum install python3 python3-pip   # CentOS

# 虚拟环境
python3 -m venv myenv
source myenv/bin/activate
deactivate

# pip 换源
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

### Docker 环境

```bash
# Ubuntu 安装 Docker
sudo apt update
sudo apt install apt-transport-https ca-certificates curl software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce

# 启动 Docker
sudo systemctl start docker
sudo systemctl enable docker

# 添加用户到 docker 组
sudo usermod -aG docker $USER

# 验证
docker --version
docker run hello-world
```

### Nginx 环境

```bash
# 安装 Nginx
sudo apt install nginx                 # Ubuntu
sudo yum install nginx                 # CentOS

# 启动 Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# 配置文件
sudo vim /etc/nginx/nginx.conf
sudo vim /etc/nginx/sites-available/default

# 测试配置
sudo nginx -t

# 重新加载
sudo systemctl reload nginx
```

### MySQL 环境

```bash
# 安装 MySQL
sudo apt install mysql-server          # Ubuntu
sudo yum install mysql-server          # CentOS

# 启动 MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation

# 登录
sudo mysql -u root -p

# 创建用户和数据库
CREATE DATABASE mydb;
CREATE USER 'myuser'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON mydb.* TO 'myuser'@'localhost';
FLUSH PRIVILEGES;
```

## Shell 脚本编程

### 基础语法

```bash
#!/bin/bash
# 这是注释

# 变量
name="John"
age=30
echo "Name: $name, Age: $age"

# 只读变量
readonly PI=3.14

# 删除变量
unset name

# 字符串
str1='single quote'
str2="double quote"
str3="Hello, $name"                    # 变量替换

# 字符串操作
echo ${#str3}                          # 长度
echo ${str3:0:5}                       # 截取
```

### 数组

```bash
# 定义数组
arr=(1 2 3 4 5)
arr[0]=10

# 访问数组
echo ${arr[0]}                         # 第一个元素
echo ${arr[@]}                         # 所有元素
echo ${#arr[@]}                        # 数组长度

# 遍历数组
for item in ${arr[@]}; do
    echo $item
done
```

### 条件判断

```bash
# if 语句
if [ $age -gt 18 ]; then
    echo "Adult"
elif [ $age -eq 18 ]; then
    echo "Just 18"
else
    echo "Minor"
fi

# 文件判断
if [ -f "/path/file" ]; then
    echo "File exists"
fi

if [ -d "/path/dir" ]; then
    echo "Directory exists"
fi

# 字符串判断
if [ "$str1" = "$str2" ]; then
    echo "Equal"
fi

if [ -z "$str" ]; then
    echo "String is empty"
fi

# 逻辑运算
if [ $a -gt 0 ] && [ $b -gt 0 ]; then
    echo "Both positive"
fi

if [ $a -gt 0 ] || [ $b -gt 0 ]; then
    echo "At least one positive"
fi
```

### 循环

```bash
# for 循环
for i in 1 2 3 4 5; do
    echo $i
done

for i in {1..10}; do
    echo $i
done

for ((i=1; i<=10; i++)); do
    echo $i
done

# while 循环
count=1
while [ $count -le 5 ]; do
    echo $count
    ((count++))
done

# until 循环
count=1
until [ $count -gt 5 ]; do
    echo $count
    ((count++))
done

# break 和 continue
for i in {1..10}; do
    if [ $i -eq 5 ]; then
        break
    fi
    echo $i
done
```

### 函数

```bash
# 定义函数
function greet() {
    echo "Hello, $1!"
}

# 或
greet() {
    echo "Hello, $1!"
}

# 调用函数
greet "World"

# 返回值
add() {
    return $(($1 + $2))
}

add 3 5
result=$?
echo "Result: $result"

# 函数返回字符串
get_name() {
    echo "John Doe"
}

name=$(get_name)
echo $name
```

### 输入输出

```bash
# 读取用户输入
read -p "Enter your name: " name
echo "Hello, $name"

# 读取密码（不显示）
read -sp "Enter password: " password
echo

# 重定向
command > file                         # 覆盖写入
command >> file                        # 追加写入
command 2> error.log                   # 错误输出
command &> all.log                     # 所有输出
command < input.txt                    # 输入重定向

# 管道
cat file | grep "pattern" | sort | uniq
```

### 实用脚本示例

```bash
# 备份脚本
#!/bin/bash
backup_dir="/backup"
source_dir="/data"
date=$(date +%Y%m%d)
backup_file="backup_${date}.tar.gz"

tar -czf ${backup_dir}/${backup_file} ${source_dir}
echo "Backup completed: ${backup_file}"

# 清理旧备份（保留 7 天）
find ${backup_dir} -name "backup_*.tar.gz" -mtime +7 -delete

# 日志监控脚本
#!/bin/bash
log_file="/var/log/app.log"
error_count=$(grep -c "ERROR" $log_file)

if [ $error_count -gt 10 ]; then
    echo "Too many errors: $error_count" | mail -s "Alert" admin@example.com
fi

# 服务检查脚本
#!/bin/bash
service_name="nginx"

if ! systemctl is-active --quiet $service_name; then
    echo "$service_name is down, restarting..."
    systemctl start $service_name
    echo "$service_name restarted at $(date)" >> /var/log/service_restart.log
fi
```

## vim 的使用

### 模式切换

```bash
# 命令模式（默认）
ESC                                    # 切换到命令模式

# 插入模式
i                                      # 当前位置插入
I                                      # 行首插入
a                                      # 当前位置后插入
A                                      # 行尾插入
o                                      # 下一行插入
O                                      # 上一行插入

# 可视模式
v                                      # 字符选择
V                                      # 行选择
Ctrl + v                               # 块选择

# 命令行模式
:                                      # 进入命令行模式
```

### 移动光标

```bash
h, j, k, l                             # 左、下、上、右
w                                      # 下一个单词
b                                      # 上一个单词
0                                      # 行首
^                                      # 行首（非空白）
$                                      # 行尾
gg                                     # 文件开头
G                                      # 文件结尾
:n                                     # 跳转到第 n 行
Ctrl + f                               # 下一页
Ctrl + b                               # 上一页
```

### 编辑操作

```bash
# 删除
x                                      # 删除字符
dd                                     # 删除行
dw                                     # 删除单词
d$                                     # 删除到行尾
5dd                                    # 删除 5 行

# 复制粘贴
yy                                     # 复制行
yw                                     # 复制单词
p                                      # 粘贴到后面
P                                      # 粘贴到前面

# 撤销重做
u                                      # 撤销
Ctrl + r                               # 重做

# 查找替换
/pattern                               # 向下查找
?pattern                               # 向上查找
n                                      # 下一个
N                                      # 上一个
:s/old/new/                            # 替换当前行第一个
:s/old/new/g                           # 替换当前行所有
:%s/old/new/g                          # 替换全文所有
:%s/old/new/gc                         # 替换全文（确认）
```

### 文件操作

```bash
:w                                     # 保存
:w filename                            # 另存为
:q                                     # 退出
:q!                                    # 强制退出
:wq                                    # 保存并退出
:x                                     # 保存并退出
:e filename                            # 打开文件
:bn                                    # 下一个缓冲区
:bp                                    # 上一个缓冲区
```

### 高级功能

```bash
# 分屏
:split                                 # 水平分屏
:vsplit                                # 垂直分屏
Ctrl + w + w                           # 切换窗口
Ctrl + w + h/j/k/l                     # 切换到指定窗口

# 标签页
:tabnew                                # 新建标签
:tabn                                  # 下一个标签
:tabp                                  # 上一个标签
gt                                     # 下一个标签
gT                                     # 上一个标签

# 宏录制
qa                                     # 开始录制到寄存器 a
q                                      # 停止录制
@a                                     # 执行宏 a
@@                                     # 重复执行

# 配置文件
vim ~/.vimrc

set number                             # 显示行号
set tabstop=4                          # Tab 宽度
set expandtab                          # Tab 转空格
set autoindent                         # 自动缩进
syntax on                              # 语法高亮
```

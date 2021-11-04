---
title: Docker安装教程
date: 2021-08-18 18:27:00
sidebar: 'auto'
tags:
 - docker
categories:
 - Docker
---
本教程安装docker版本为`20.10.8`

## 在线安装
### 1. 配置docker镜像源
``` shell
wget -O /etc/yum.repos.d/docker-ce.repo https://download.docker.com/linux/centos/docker-ce.repo

yum makecache
```

### 2. 安装docker依赖包
``` shell
yum remove docker docker-common docker-selinux docker-engine

yum install -y yum-utils device-mapper-persistent-data lvm2
```

### 3. 安装docker-ce
``` shell
yum install docker-ce
```

## 离线安装

在很多环境下，服务器是不允许连接外网的，这种情况下，我们无法直接使用上述的在线安装方式，此时就用到了下面的离线安装方式。

### 1. 下载离线安装包

[下载地址1](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
[下载地址2](https://mirrors.aliyun.com/centos/7/extras/x86_64/Packages/) 
[下载地址3](https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/) 

**下载页面仅保留最新版本rpm包，故搜索时请根据名称搜索，不要加版本号**

先在本地通过该地址下载对应版本的rpm包，本教程需下载以下14个包：
::: tip
1. docker-ce-20.10.8-3.el7.x86_64.rpm [下载地址1](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
2. docker-ce-cli-20.10.8-3.el7.x86_64.rpm [下载地址1](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
3. containerd.io-1.4.9-3.1.el7.x86_64.rpm [下载地址1](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/)
4. container-selinux-2.119.2-1.911c772.el7_8.noarch.rpm [下载地址2](https://mirrors.aliyun.com/centos/7/extras/x86_64/Packages/)  
**以下均为**[下载地址3](https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/) 
5. libselinux-2.5-15.el7.x86_64.rpm
6. libselinux-python-2.5-15.el7.x86_64.rpm
7. libselinux-utils-2.5-15.el7.x86_64.rpm
8. libsemanage-2.5-14.el7.x86_64.rpm
9.  libsemanage-python-2.5-14.el7.x86_64.rpm
10. libsepol-2.5-10.el7.x86_64.rpm
11. policycoreutils-2.5-34.el7.x86_64.rpm
12. policycoreutils-python-2.5-34.el7.x86_64.rpm
13. selinux-policy-3.13.1-268.el7.noarch.rpm
14. selinux-policy-targeted-3.13.1-268.el7.noarch.rpm
15. setools-libs-3.3.8-4.el7.x86_64.rpm
:::

**下载页截图**  
![下载截图](/img/blogs/2021/08/centos-source-url.png)

找到对应文件，点击下载

### 2. 安装rpm包
下载完成并将安装包上传至服务器后，进入rpm包所在目录，使用`rpm`命令进行安装
``` shell
rpm -ivh *.rpm --nodeps --force
```

**操作截图**  
![下载截图](/img/blogs/2021/08/rpm-install.png)

此时，docker就安装完成了，但想实际使用还需进一步设置。

## 安装完成后设置
### 1. 启动docker并设置开机自启
``` shell
# 设置开机启动docker ce
systemctl enable docker

# 启动docker ce
systemctl start docker

# 查看docker状态
systemctl status docker

# 查看docker
docker version
```

**操作截图**  
![下载截图](/img/blogs/2021/08/docker-set.png)  
![下载截图](/img/blogs/2021/08/docker-version.png)  

### 2. 建立docker用户组 
``` shell
# 建立docker组
groupadd docker

# 将当前用户加入docker组
usermod -aG docker $USER
```

**操作截图**  
![下载截图](/img/blogs/2021/08/docker-user.png)

## 设置国内镜像源
使用 Docker 需要经常从官方获取镜像，国内拉取镜像的过程非常耗时，所以要更换到国内镜像源
``` shell
# 创建或修改 /etc/docker/daemon.json
# 设置网易镜像源，也可选择其它
{
    "registry-mirrors": ["http://hub-mirror.c.163.com"]
}

# 重启Docker服务
systemctl restart docker
```

若不想设置全局的镜像源，也可在拉取镜像时指定镜像源。
``` shell
#临时指定镜像源
$docker pull registry.docker-cn.com/library/ubuntu:16.04
```

## docker-compose安装及说明
详情见： [docker-compose安装及说明](../../../docker/2021/08/docker-compose-install.md)

## 参考
<https://segmentfault.com/a/1190000018157675>
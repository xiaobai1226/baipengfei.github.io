---
title: Docker安装教程
date: 2021-08-18 18:27:00
sidebar: 'auto'
tags:
 - docker
categories:
 - Docker
---

## 在线安装
。。。待补充 

## 离线安装

在很多环境下，服务器是不允许连接外网的，这种情况下，我们无法直接使用上述的在线安装方式，此时就用到了下面的离线安装方式。

### 1. 下载离线安装包

[下载地址1](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
[下载地址2](https://mirrors.aliyun.com/centos/7/extras/x86_64/Packages/) 
[下载地址3](https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/) 

**下载页面仅保留最新版本rpm包，故搜索时请根据名称搜索，不要加版本号**

先在本地通过该地址下载对应版本的rpm包，本教程需下载以下13个包：
1. docker-ce-20.10.8-3.el7.x86_64.rpm [下载地址1](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
2. container-selinux-2.119.2-1.911c772.el7_8.noarch.rpm [下载地址2](https://mirrors.aliyun.com/centos/7/extras/x86_64/Packages/)  
**以下均为**[下载地址3](https://mirrors.aliyun.com/centos/7/os/x86_64/Packages/) 
3. libselinux-2.5-15.el7.x86_64.rpm
4. libselinux-python-2.5-15.el7.x86_64.rpm
5. libselinux-utils-2.5-15.el7.x86_64.rpm
6. libsemanage-2.5-14.el7.x86_64.rpm
7. libsemanage-python-2.5-14.el7.x86_64.rpm
8. libsepol-2.5-10.el7.x86_64.rpm
9.  policycoreutils-2.5-34.el7.x86_64.rpm
10. policycoreutils-python-2.5-34.el7.x86_64.rpm
11. selinux-policy-3.13.1-268.el7.noarch.rpm
12. selinux-policy-targeted-3.13.1-268.el7.noarch.rpm
13. setools-libs-3.3.8-4.el7.x86_64.rpm

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
```

**操作截图**  
![下载截图](/img/blogs/2021/08/docker-set.png)

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
。。。 待补充


至此，docker就安装完成了

## 参考
<https://segmentfault.com/a/1190000018157675>
---
title: 使用Helm安装Jenkins
date: 2021-11-15 11:27:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
 - helm
 - jenkins
categories:
 - Kubernetes
---

## Jenkins介绍
Jenkins是开源软件项目，基于Java开发的持续集成工具，用于监控持续重复的工作，旨在提供一个开放易用的软件平台，使软件的持续集成变成可能。

## 前期准备
1. 安装Helm
2. 安装k8s
3. 安装cpeh

## 安装Jenkins
### 1. 添加Jenkins仓库：
``` shell
# 增加Jenkins源
helm repo add jenkins https://charts.jenkins.io

# 更新Helm
helm repo update
```

### 2. 搜索可用的Jenkins版本
``` shell
helm search repo jenkins
```

### 3. 将Jenkins的chart包下载到本地
``` shell
helm fetch jenkins/jenkins
```

### 4. 解压文件
``` shell
# 解压文件
tar xvf jenkins-3.8.8.tgz

# 解压完成后进入目录
cd jenkins
```

### 5. 按需修改配置文件  
修改配置文件values.yaml，我改了以下几处
``` shell
# 1. 使用storageClass
storageClass: rook-cephfs

# 2. 注释掉插件下载，否则可能会很慢，待安装完成后，手动安装插件
# List of plugins to be install during Jenkins controller start
  #installPlugins:
  #  - kubernetes:1.30.1
  #  - workflow-aggregator:2.6
  #  - git:4.9.0
  #  - configuration-as-code:1.53

# 3. 改为NodePort模式
serviceType: NodePort
```

其中`rook-cephfs`是预先创建好的storageClass

### 6. 部署Jenkins
``` shell
helm install jenkins ./ -f values.yaml --namespace jenkins
```
此时就已安装完成了

## 登录
### 1. 获取初始密码
``` shell
printf $(kubectl get secret --namespace jenkins jenkins -o jsonpath="{.data.jenkins-admin-password}" | base64 --decode);echo
```

### 2. 页面登录
由于选择了NodePort模式，并且未指定nodeport端口，查看后k8s自动分配了32148端口。此时，使用`http://10.169.136.38:32148`即可登录web管理页面进行使用。

### 3. 禁用允许用户匿名登录
使用这种方式安装后，首次进入页面可以发现，直接可以使用，为了安全起见将用户匿名登录禁用。  
按下图所示修改即可
![文件截图](/img/blogs/2021/11/k8s-jenkins-close-anonymous.png)
修改后，创建新用户使用即可。

## 安装插件
将文中开头注释的插件及自己需要的插件一一安装即可，此处不再详细赘述。

## 参考
<https://cloud.tencent.com/developer/article/1807943>
---
title: 使用Helm安装Nexus
date: 2021-11-15 14:46:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
 - helm
 - nexus
categories:
 - Kubernetes
---

## Nexus介绍
&emsp;&emsp;nexus的全称是Nexus Repository Manager，是Sonatype公司的一个产品。它是一个强大的仓库管理器，极大地简化了内部仓库的维护和外部仓库的访问。  
&emsp;&emsp;我们主要用它来搭建公司内部的maven私服。但是它的功能不仅仅是创建maven私有仓库这么简单，还可以作为nuget、docker、npm、bower、pypi、rubygems、git lfs、yum、go、apt等的私有仓库，功能非常强大。

## 前期准备
1. 安装Helm
2. 安装k8s
3. 安装cpeh

## 安装Nexus
### 1. 添加 Nexus 仓库：
``` shell
# 增加Nexus源
helm repo add sonatype https://sonatype.github.io/helm3-charts/

# 更新Helm
helm repo update
```

### 2. 搜索可用的Nexus版本
``` shell
helm search repo sonatype/nexus-repository-manager
```

### 3. 将Nexus的chart包下载到本地
``` shell
helm fetch sonatype/nexus-repository-manager
```

### 4. 解压文件
``` shell
# 解压文件
tar xvf nexus-repository-manager-36.0.0.tgz

# 解压完成后进入目录
cd nexus-repository-manager
```

### 5. 按需修改配置文件  
修改配置文件 values.yaml，具体查看配置列表[Configuration](https://artifacthub.io/packages/helm/sonatype/nexus-repository-manager)  
我将暴露方式改为了NodePort，并且指定了storageClass，其他保持不变。

### 6. 部署Nexus
``` shell
helm install nexus ./ -f values.yaml --namespace nexus
```
此时就已安装完成了

## 登录
### 1. 获取初始密码
缺省管理员账号是admin，默认情况下，会创建PersistentVolumeClaim并将其挂载到/nexus-data目录中，初始密码就在该目录的admin.password文件中。  
如果想在安装时指定初始密码，可以通过将环境变量NEXUS_SECURITY_RANDOMPASSWORD设置为“true”达到目的。

### 2. 页面登录
由于选择了NodePort模式，并且未指定nodeport端口，查看后k8s自动分配了32148端口。此时，使用`http://10.169.136.38:31040`即可登录web管理页面进行使用，初次登陆需修改初始密码。
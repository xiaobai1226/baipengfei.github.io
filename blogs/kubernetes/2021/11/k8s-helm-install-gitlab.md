---
title: 使用Helm安装GitLab
date: 2021-11-13 16:22:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
 - helm
 - gitlab
categories:
 - Kubernetes
publish: false
---

::: tip
其他方式安装GitLab：
[使用docker-compose安装Harbor](../../../docker/2021/08/docker-compose-install-harbor.md)
:::

## GitLab介绍
&emsp;&emsp;Gitlab（gitlab.com）是一个开源的Git代码仓库系统，可以实现自托管的Github项目，即用于构建私有的代码托管平台和项目管理系统。系统基于Ruby on Rails开发，速度快、安全稳定。  
&emsp;&emsp;它拥有与Github类似的功能，能够浏览源代码，管理缺陷和注释。可以管理团队对仓库的访问，它非常易于浏览提交过的版本并提供一个文件历史库。团队成员可以利用内置的简单聊天程序(Wall)进行交流。它还提供一个代码片段收集功能可以轻松实现代码复用，便于日后有需要的时候进行查找。

## 前期准备
1. 安装Helm
2. 安装k8s
3. 安装cpeh

## 安装GitLab
1. 添加 Git 仓库：
``` shell
# 增加Harbor源
hhelm repo add gitlab https://charts.gitlab.io

# 更新Helm
helm repo update
```

2. 搜索可用的Harbor版本
``` shell
helm search repo gitlab
```
可以看到如下结果：  
![文件截图](/img/blogs/2021/11/helm-search-gitlab.png)

3. 将Harbor的chart包下载到本地
``` shell
helm fetch gitlab/gitlab
```

4. 解压文件
``` shell
# 解压文件
tar xvf gitlab-5.4.2.tgz

# 解压完成后进入目录
cd harbor
```

5. 按需修改配置文件  
&emsp;&emsp;修改配置文件 values.yaml，具体查看GitHub上面的配置列表[Configuration](https://github.com/goharbor/harbor-helm/blob/master/README.md#configuration)。  
&emsp;&emsp;value.yml文件是最全的配置文件，如果这个那么细致定制化需求，可以按需创建自己的配置，这里创建了my_value.conf，内容如下：
``` shell
expose:
  # 类型修改为nodePort模式，默认为ingress模式，按需修改即可
  type: nodePort
  tls:
    # 关闭tls验证
    enabled: false
  nodePort:
    ports:
      http:
        nodePort: 30002
      https:
        nodePort: 30003
      notary:
        nodePort: 30004
# 访问路径
externalURL: http://10.169.136.38:30002
# 存储挂载设置
persistence:
  persistentVolumeClaim:
    registry:
      storageClass: "rook-cephfs"
    chartmuseum:
      storageClass: "rook-cephfs"
    jobservice:
      storageClass: "rook-cephfs"
    database:
      storageClass: "rook-cephfs"
    redis:
      storageClass: "rook-cephfs"
    trivy:
      storageClass: "rook-cephfs"
```

其中`nis-rook-cephfs`是预先创建好的storageClass

6. 部署Harbor
``` shell
helm install gitlab ./ --namespace gitlab \
  --set global.edition=ce \
  --set global.hosts.domain=example.com \
  --set global.hosts.externalIP=10.169.136.38 \
  --set certmanager-issuer.email=me@example.com
```
此时就已安装完成了

## 登录
默认用户名是admin，密码是Harbor12345。
### 页面登录
根据配置中的地址，`http://10.100.159.128:30002`即可登录web管理页面进行使用。

### 命令登录
``` shell
docker login -u admin -p '密码' 10.169.136.38:30002
```

## 修改docker配置
&emsp;&emsp;由于Docker自从 1.3.x之后，docker registry 交互默认使用的是HTTPS，而我们搭建的 Harbor 使用的是HTTP，所以为了避免 pull/push 镜像时得到错误：`http: server gave HTTP response to HTTPS client`，需要修改 docker 的配置文件 /etc/docker/daemon.json，加入以下配置：
``` shell
vim /etc/docker/daemon.json

# 在json中增加如下配置
"insecure-registries": ["10.169.136.38:30002"]

# 重启Docker服务
systemctl daemon-reload
systemctl restart docker 
```

## 参考
<http://kpali.me/2020/05/13/deploy-harbor-in-kubernetes.html>
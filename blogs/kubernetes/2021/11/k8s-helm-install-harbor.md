---
title: 使用Helm安装Harbor
date: 2021-11-12 16:22:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
 - helm
 - harbor
categories:
 - Kubernetes
---

::: tip
其他方式安装Harbar：
[使用docker-compose安装Harbor](../../../docker/2021/08/docker-compose-install-harbor.md)
:::

## Harbor介绍
&emsp;&emsp;Harbor，是一个英文单词，意思是港湾，港湾是干什么的呢，就是停放货物的，而货物呢，是装在集装箱中的，说到集装箱，就不得不提到Docker容器，因为docker容器的技术正是借鉴了集装箱的原理。所以，Harbor正是一个用于存储Docker镜像的企业级Registry服务。  
&emsp;&emsp;Docker容器应用的开发和运行离不开可靠的镜像管理，虽然Docker官方也提供了公共的镜像仓库，但是从安全和效率等方面考虑，部署我们私有环境内的Registry也是非常必要的。Harbor是由VMware公司开源的企业级的Docker Registry管理项目，它包括权限管理(RBAC)、LDAP、日志审核、管理界面、自我注册、镜像复制和中文支持等功能。

## 前期准备
1. 安装Helm
2. 安装k8s
3. 安装cpeh

## 安装Harbor
1. 添加 Harbor 仓库：
``` shell
# 增加Harbor源
helm repo add harbor https://helm.goharbor.io

# 更新Helm
helm repo update
```

2. 搜索可用的Harbor版本
``` shell
helm search repo harbor/harbor
```
可以看到如下结果：  
![文件截图](/img/blogs/2021/11/helm-search-harbor.png)

3. 将Harbor的chart包下载到本地
``` shell
helm fetch harbor/harbor
```

4. 解压文件
``` shell
# 解压文件
tar xvf harbor-1.8.0.tgz

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
helm install harbor ./ -f my_value.yaml --namespace harbor
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
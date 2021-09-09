---
title: docker-compose安装及说明
date: 2021-08-25 11:15:00
sidebar: 'auto'
tags:
 - docker
categories:
 - Docker
---

## 介绍
&emsp;&emsp;Docker-Compose项目是Docker官方的开源项目，负责实现对Docker容器集群的快速编排。  
&emsp;&emsp;Docker-Compose将所管理的容器分为三层，分别是工程（project），服务（service）以及容器（container）。一个工程当中可包含多个服务，每个服务中定义了容器运行的镜像，参数，依赖。一个服务当中可包括多个容器实例。  
&emsp;&emsp;在工作中，经常会碰到需要多个容器相互配合来完成某项任务的情况。例如要实现一个Web项目，除了Web服务容器本身，往往还需要再加上后端的数据库服务容器，甚至还包括负载均衡容器等。  
&emsp;&emsp;Compose允许用户通过一个单独的docker-compose.yml模板文件（YAML 格式）来定义一组相关联的应用容器为一个项目（project）。  

## 安装
### 安装docker
具体安装步骤见： 
[Docker安装教程](../../../docker/2021/08/docker-install.md)

### 安装docker-compose
``` shell
# 运行此命令以下载 Docker Compose 的当前稳定版本
# 如果服务器不通外网的话，可手动从上述网址下载下来后，上传到上述命令对应文件夹下，并重命名
curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# 对二进制文件应用可执行权限：
chmod +x /usr/local/bin/docker-compose

# 验证是否安装完成
docker-compose --version
```

::: warning 注意
要安装不同版本的 Compose，请替换1.29.2 为您要使用的 Compose 版本。
:::

## docker-compose.yml语法
。。。待补充
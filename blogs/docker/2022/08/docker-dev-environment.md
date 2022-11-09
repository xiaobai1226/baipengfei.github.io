---
title: 使用docker搭建本地开发环境
date: 2022-08-21 21:37:00
sidebar: 'auto'
tags:
 - docker-compose
 - tool
 - docker
categories:
 - Docker
---

dev-environment
Dockerfile文件（仅前端）
``` docker
FROM node:16.17
RUN mkdir /workspace_node
RUN apt-get update
RUN npm config set registry https://registry.npm.taobao.org
RUN npm install -g @vue/cli
CMD ["/bin/sh"]
```

``` docker
docker build -f Dockerfile -t dev-environment:v0.1 .
```

docker-compose.yml文件
``` docker
version: "3.7"
services:
  dev-environment:
    restart: always
    image: xiaobai1226/dev-environment:v0.1
    tty: true
    network_mode: host
    volumes:
      - /etc/localtime:/etc/localtime
      - /Users/felix/programme/workspace:/workspace_node
    environment:
      - TZ=Asia/Shanghai
```
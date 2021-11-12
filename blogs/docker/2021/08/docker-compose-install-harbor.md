---
title: 使用docker-compose安装Harbor
date: 2021-08-26 10:18:00
sidebar: 'auto'
tags:
 - docker-compose
 - harbor
 - docker
categories:
 - Docker
---

::: tip
其他方式安装Harbar：
[使用Helm安装Harbor](../../../kubernetes/2021/11/k8s-helm-install-harbor.md)
:::

## Harbor介绍
&emsp;&emsp;Harbor，是一个英文单词，意思是港湾，港湾是干什么的呢，就是停放货物的，而货物呢，是装在集装箱中的，说到集装箱，就不得不提到Docker容器，因为docker容器的技术正是借鉴了集装箱的原理。所以，Harbor正是一个用于存储Docker镜像的企业级Registry服务。  
&emsp;&emsp;Docker容器应用的开发和运行离不开可靠的镜像管理，虽然Docker官方也提供了公共的镜像仓库，但是从安全和效率等方面考虑，部署我们私有环境内的Registry也是非常必要的。Harbor是由VMware公司开源的企业级的Docker Registry管理项目，它包括权限管理(RBAC)、LDAP、日志审核、管理界面、自我注册、镜像复制和中文支持等功能。

## 安装
``` shell
# 获取安装包
wget https://github.com/goharbor/harbor/releases/download/v2.3.2/harbor-offline-installer-v2.3.2.tgz

# 解压安装包
tar xvf harbor-offline-installer-v2.3.2.tgz
```

解压完成后，可以看到如下文件：  
![文件截图](/img/blogs/2021/08/harbor-tar-file.png)

其中有harbor.yml.tmpl文件，将其复制出来重命名为harbor.yml，并修改其中的内容
``` shell
## Configuration file of Harbor

# hostname设置访问地址，可以使用ip、域名，不可以设置为127.0.0.1或localhost
hostname = 10.100.159.128

# 访问协议，默认是http，也可以设置https，如果设置https，则nginx ssl需要设置on
ui_url_protocol = http

# mysql数据库root用户默认密码root123，实际使用时修改下
db_password = root123

max_job_workers = 3 
customize_crt = on
# https相关不用可以不设置
# ssl_cert = /data/cert/server.crt
# ssl_cert_key = /data/cert/server.key
# secretkey_path = /data
admiral_url = NA

# 邮件设置，发送重置密码邮件时使用
email_identity = 
email_server = smtp.mydomain.com
email_server_port = 25
email_username = sample_admin@mydomain.com
email_password = abc
email_from = admin <sample_admin@mydomain.com>
email_ssl = false

# 启动Harbor后，管理员UI登录的密码，默认是Harbor12345
harbor_admin_password = Harbor12345

# 认证方式，这里支持多种认证方式，如LADP、本次存储、数据库认证。默认是db_auth，mysql数据库认证
auth_mode = db_auth

# LDAP认证时配置项
#ldap_url = ldaps://ldap.mydomain.com
#ldap_searchdn = uid=searchuser,ou=people,dc=mydomain,dc=com
#ldap_search_pwd = password
#ldap_basedn = ou=people,dc=mydomain,dc=com
#ldap_filter = (objectClass=person)
#ldap_uid = uid 
#ldap_scope = 3 
#ldap_timeout = 5

# 是否开启自注册
self_registration = on

# Token有效时间，默认30分钟
token_expiration = 30

# 用户创建项目权限控制，默认是everyone（所有人），也可以设置为adminonly（只能管理员）
project_creation_restriction = everyone

verify_remote_cert = on
```

修改完配置文件后，分别执行prepare文件与install.sh。

## 修改docker配置
&emsp;&emsp;由于Docker自从 1.3.x之后，docker registry 交互默认使用的是HTTPS，而我们搭建的 Harbor 使用的是HTTP，所以为了避免 pull/push 镜像时得到错误：`http: server gave HTTP response to HTTPS client`，需要修改 docker 的配置文件 /etc/docker/daemon.json，加入以下配置：
修改/etc/docker/daemon.json
``` shell
vim /etc/docker/daemon.json

# 在json中增加如下配置
"insecure-registries": ["10.169.136.38:10082"]

# 重启Docker服务
systemctl daemon-reload
systemctl restart docker 
```

此时就已安装完成了
## 登录
### 页面登录
根据配置中的地址，http://10.100.159.128:10082即可登录web管理页面进行使用。

### 命令登录
``` shell
docker login -u admin -p '密码' 10.169.136.38:10082
```
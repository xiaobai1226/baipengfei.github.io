---
title: Harbor安装
date: 2021-08-26 10:18:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
 - docker
categories:
 - Kubernetes
 - Docker
---

## Harbor介绍

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
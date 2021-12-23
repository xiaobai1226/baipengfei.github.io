---
title: k8s安装GitLab
date: 2021-11-13 16:22:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
 - gitlab
categories:
 - Kubernetes
---

&emsp;&emsp;Gitlab官方提供了Helm的方式在Kubernetes集群中来快速安装，但是在使用的过程中发现Helm提供的Chart包中有很多其他额外的配置，所以我们这里使用自定义的方式来安装，也就是自己来定义一些资源清单文件。  

## GitLab介绍
&emsp;&emsp;Gitlab（gitlab.com）是一个开源的Git代码仓库系统，可以实现自托管的Github项目，即用于构建私有的代码托管平台和项目管理系统。系统基于Ruby on Rails开发，速度快、安全稳定。  
&emsp;&emsp;它拥有与Github类似的功能，能够浏览源代码，管理缺陷和注释。可以管理团队对仓库的访问，它非常易于浏览提交过的版本并提供一个文件历史库。团队成员可以利用内置的简单聊天程序(Wall)进行交流。它还提供一个代码片段收集功能可以轻松实现代码复用，便于日后有需要的时候进行查找。

## 前期准备
1. 安装k8s
2. 安装cpeh

## 安装GitLab
### 1. 创建PVC
gitlab-config-pvc.yaml
``` shell
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gitlab-config
  namespace: gitlab
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 50Mi
  storageClassName: rook-cephfs
```

gitlab-logs-pvc.yaml
``` shell
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gitlab-logs
  namespace: gitlab
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 2Gi
  storageClassName: rook-cephfs
```

gitlab-data-pvc.yaml
``` shell
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: gitlab-data
  namespace: gitlab
spec:
  accessModes:
    - ReadWriteMany
  resources:
    requests:
      storage: 2Gi
  storageClassName: rook-cephfs
```

### 2. 创建GitLab资源文件
创建gitlab.yaml，内容如下：
``` shell
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gitlab
  namespace: gitlab
  labels:
    name: gitlab
spec:
  replicas: 1
  selector:
    matchLabels:
      name: gitlab
  template:
    metadata:
      name: gitlab
      labels:
        name: gitlab
    spec:
      containers:
      - name: gitlab
        image: 10.169.136.38:30002/public/gitlab/gitlab-ce:14.3.3-ce.0
        imagePullPolicy: IfNotPresent
        env:
        - name: GITLAB_OMNIBUS_CONFIG
          value: |
                 external_url 'http://10.169.136.38:30080' #若有域名可以写域名
                 gitlab_rails['gitlab_shell_ssh_port'] = 30022
        ports:
        - name: http
          containerPort: 30080
        - name: ssh
          containerPort: 30022
        volumeMounts:
        - mountPath: /etc/gitlab
          name: gitlab-config
        - mountPath: /var/log/gitlab
          name: gitlab-logs
        - mountPath: /var/opt/gitlab
          name: gitlab-data
        livenessProbe:
          httpGet:
            path: /
            port: 30080
          initialDelaySeconds: 180
          timeoutSeconds: 5
        readinessProbe:
          httpGet:
            path: /
            port: 30080
          initialDelaySeconds: 5
          timeoutSeconds: 1
      volumes:
      - name: gitlab-data
        persistentVolumeClaim:
          claimName: gitlab-data
      - name: gitlab-logs
        persistentVolumeClaim:
          claimName: gitlab-logs
      - name: gitlab-config
        persistentVolumeClaim:
          claimName: gitlab-config

---
apiVersion: v1
kind: Service
metadata:
  name: gitlab
  namespace: gitlab
  labels:
    name: gitlab
spec:
  ports:
    - name: http
      nodePort: 30080
      port: 30080
      targetPort: 30080
    - name: ssh
      nodePort: 30022
      port: 22
      targetPort: 22
  selector:
    name: gitlab
  type: NodePort
```

### 3. 安装
``` shell
kubectl create -f gitlab-config-pvc.yaml

kubectl create -f gitlab-logs-pvc.yaml

kubectl create -f gitlab-data-pvc.yaml

kubectl create -f gitlab.yaml
```

### 4. 获取初始密码
gitlab-ce-14初装以后，把密码放在了一个临时文件中了，`/etc/gitlab/initial_root_password`，这个文件将在首次执行reconfigure后24小时自动删除。
``` shell
# 注意将pod名称换为实际名称
kubectl -n gitlab exec gitlab-bf8fcc7-qq94z cat /etc/gitlab/initial_root_password
```

结果如下：
![文件截图](/img/blogs/2021/11/k8s-gitlab-initial-root-password.png)

### 5. 登录
拿到这个密码后需要尽快登录web界面进行密码修改

![文件截图](/img/blogs/2021/11/gitlab-login.png)
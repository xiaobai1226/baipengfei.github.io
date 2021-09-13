---
title: Linux安装NFS
date: 2021-09-13 10:44:00
sidebar: 'auto'
tags:
 - linux
 - nfs
categories:
 - Linux
---

## 环境说明

## 介绍
&emsp;&emsp;NFS 是Network File System的缩写，即网络文件系统。一种使用于分散式文件系统的协定，由Sun公司开发，于1984年向外公布。功能是通过网络让不同的机器、不同的操作系统能够彼此分享个别的数据，让应用程序在客户端通过网络访问位于服务器磁盘中的数据，是在类Unix系统间实现磁盘文件共享的一种方法。  
&emsp;&emsp;NFS 的基本原则是“容许不同的客户端及服务端通过一组RPC分享相同的文件系统”，它是独立于操作系统，容许不同硬件及操作系统的系统共同进行文件的分享。  
&emsp;&emsp;NFS在文件传送或信息传送过程中依赖于RPC协议。RPC，远程过程调用 (Remote Procedure Call) 是能使客户端执行其他系统中程序的一种机制。NFS本身是没有提供信息传输的协议和功能的，但NFS却能让我们通过网络进行资料的分享，这是因为NFS使用了一些其它的传输协议。而这些传输协议用到这个RPC功能的。可以说NFS本身就是使用RPC的一个程序。或者说NFS也是一个RPC SERVER。所以只要用到NFS的地方都要启动RPC服务，不论是NFS SERVER或者NFS CLIENT。这样SERVER和CLIENT才能通过RPC来实现PROGRAM PORT的对应。可以这么理解RPC和NFS的关系：NFS是一个文件系统，而RPC是负责负责信息的传输。

## 服务端安装
1. **执行以下命令安装 nfs 服务器所需的软件包**  
``` shell
yum install -y rpcbind nfs-utils
```

2. **执行命令`vim /etc/exports`，创建 exports 文件，文件内容如下：**  
``` shell
/app/nfs/nfs_server/ *(insecure,rw,sync,no_root_squash)
```

3. **执行以下命令，启动 nfs 服务**  
``` shell
# 创建共享目录，如果要使用自己的目录，请替换本文档中所有的 /app/nfs/nfs_server/
mkdir /app/nfs/nfs_server

systemctl enable rpcbind
systemctl enable nfs-server

# 必须先启动rpcbind服务
systemctl start rpcbind
systemctl start nfs-server

# 确认NFS服务器启动成功
rpcinfo -p
```

4. **检查配置是否生效**  
``` shell
# 检查 NFS 服务器是否挂载我们想共享的目录 /app/nfs/nfs_server/
exportfs -r

# 使配置生效 
exportfs

# 输出结果如下所示
/root/nfs_root /root/nfs_root
```

## 客户端安装
1. **执行以下命令安装 nfs 客户端所需的软件包**  
``` shell
yum install -y rpcbind nfs-utils
```

3. **执行以下命令，启动 nfs 服务**  
``` shell
systemctl enable rpcbind

# 必须先启动rpcbind服务
systemctl start rpcbind
```

::: warning
客户端不需要启动nfs服务
:::

2. **执行以下命令检查 nfs 服务器端是否有设置共享目录**  
``` shell
# showmount -e $(nfs服务器的IP)
showmount -e 10.169.136.38

# 输出结果如下所示
Export list for 10.169.136.38:
/app/nfs/nfs_server *
```

3. **执行以下命令挂载 nfs 服务器上的共享目录到本机路径`/app/nfs/nfs_server`**  
``` shell
mkdir /app/nfs/nfs_client
# mount -t nfs $(nfs服务器的IP):/app/nfs/nfs_server /app/nfs/nfs_client
mount -t nfs 10.169.136.38:/app/nfs/nfs_server /app/nfs/nfs_client

# 写入一个测试文件
echo "hello nfs server" > /app/nfs/nfs_client/test.txt
```

4. **在 nfs 服务器上执行以下命令，验证文件写入成功**  
``` shell
cat /app/nfs/nfs_server/test.txt
```
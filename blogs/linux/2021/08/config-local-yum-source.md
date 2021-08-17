---
title: Linux配置本地yum源
date: 2021-08-17 14:30:00
sidebar: 'auto'
tags:
 - Linux
categories:
 - Linux
---

&emsp;&emsp;工作中会使用到内网机器，无法连接互联网，这样就不能方便的配置线上的yum源安装软件，故整理出这篇教程。  

&emsp;&emsp;其实原理是把yum源设置成iso文件，然后通过yum来进行安装，**所以此方法仅能安装iso镜像中包含的软件**，若想安装其他iso不包含的软件，比如docker等还需自行下载相关文件进行安装。  

## 前期准备
1. 一台yum系的linux服务器
2. 与linux主机系统对应的iso系统镜像文件（版本最好比系统版本高或一致）

## 操作步骤
1. **将iso镜像文件上传至linux服务器**  
   上传后，iso镜像文件所在位置为`~/rhel-server-7.8-x86_64-dvd.iso`

2.  **执行命令将iso镜像挂载到`/mnt/cdrom`目录下**  
    若/mnt目录下没有cdrom文件夹，则需先手动创建一个目录。
    ``` shell
    mount -o loop 镜像文件 /mnt/cdrom
    本文为 mount -o loop ~/rhel-server-7.8-x86_64-dvd.iso /mnt/cdrom
    ```

    挂载成功之后 可以`df -h`看到 iso 文件成功挂载到指定的目录下。
    ![添加硬盘](/img/blogs/2021/08/local-yum-source1.png) 

    若想要解除挂载，可使用如下命令（本篇教程无需执行）
    ``` shell
    umount /mnt/cdrom
    ```

3. **设置yum源为本地iso文件**  
   修改`/etc/yum.repos.d/rhel-source.repo`文件进行yum源设置  
   **注：/etc/yum.repos.d/路径下，后缀为repo的文件均可**
    ``` shell
    [rhel-source]
    name=Local Source
    baseurl=file:///mnt/cdrom
    enabled=1
    gpgcheck=0
    gpgkey=file:///etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-beta,file:///etc/pki/rpm-gpg/RPM-GPG-KEY-redhat-release
    ```

4. **更新yum**  
    ``` shell
    yum update
    ```

至此，就可以用yum install xxx来安装之前提示未安装的那些依赖程序了。
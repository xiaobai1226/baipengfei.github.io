---
title: Linux磁盘分区挂载方法(已废弃)
date: 2020-10-10 12:00:00
sidebar: 'auto'
tags:
 - linux
categories:
 - Linux
---

> 此方法挂载硬盘，无法后期动态扩容，建议使用新方法进行硬盘挂载。  
[新方法地址](/blogs/linux/2021/08/linux-mount-new.md)

最近工作碰到一个需求，需要在Linux系统挂载另外的硬盘，实际操作后，整理出这篇教程。  
本次实验在VM上新增硬盘，并将分区进行挂载  
## 工具
1. VMware
2. Linux系统  

## 前期准备
1. 给Vmware上的一台linux机器新增加一块硬盘，在需要增加的linux虚机上点击设置  
![点击虚机设置](/img/blogs/2020/10/linux-mount1.png)  

2. 在设备列表中，点击添加，选择硬盘，点击下一步
![添加硬盘](/img/blogs/2020/10/linux-mount2.png)  

3. 选择scsi类型的，继续进行下一步  
![添加硬盘](/img/blogs/2020/10/linux-mount3.png)  

4. 选择创建新虚拟磁盘  
![添加硬盘](/img/blogs/2020/10/linux-mount4.png) 

5. 添加一块10G的硬盘  
![添加硬盘](/img/blogs/2020/10/linux-mount5.png)  

6. 给硬盘起个名字，可以的随便起，不重要  
![添加硬盘](/img/blogs/2020/10/linux-mount6.png)  

7. 确认后硬盘添加完成，看到设备中已经多了一块10G的硬盘  
![添加硬盘](/img/blogs/2020/10/linux-mount7.png)  

8. 登录上服务器后，查看硬盘情况
``` shell
df -h
```
可以看到，可用磁盘中没有新增的那一块  
![df -h](/img/blogs/2020/10/linux-mount8.png)  

``` shell
fdisk -l
```
这时可以看到，现在Linux系统中，存在一块10G大小的磁盘，但未挂载上，还不能使用。  
![fdisk -l](/img/blogs/2020/10/linux-mount9.png)  

至此，前期准备就完成了，接下来开始将这块磁盘挂载到指定目录下，并开始使用它

## 挂载步骤
1. 开始对sdb进行分区
``` shell
fdisk 要分区的磁盘路径
本文为 fdisk /dev/sdb
```
![fdisk /dev/sdb](/img/blogs/2020/10/linux-mount10.png)  

2. 输入m查看帮助  
![m](/img/blogs/2020/10/linux-mount11.png)  

3. 输入n增加一块新分区  
![n](/img/blogs/2020/10/linux-mount12.png)  
可以看到有2个选项：e 增加一块拓展分区、p 增加一块主分区，我们选择e 拓展分区  
然后选择分区号，这里我们选择1  
最后选择磁盘大小，可以看到，系统给了可选择的范围区间，这里我们选择最大值

1. 输入p查看分区表，可以看到这块分区的信息  
![fdisk /dev/sdb](/img/blogs/2020/10/linux-mount13.png)  

5. 输入w保存分区，并退出，否则刚刚的操作会丢失  
![fdisk /dev/sdb](/img/blogs/2020/10/linux-mount14.png)  
 
6. 将分区格式化成ext1格式，
``` shell
mkfs -t ext4 /dev/sdb
```
![fdisk /dev/sdb](/img/blogs/2020/10/linux-mount15.png)  

7. 然后使用mount命令挂载到/app目录，df -h可以看到已经成功挂载  
``` shell
mount /dev/sdb /app
```
![fdisk /dev/sdb](/img/blogs/2020/10/linux-mount16.png)  
进入/app目录，新建文件进行测试，磁盘可以正常读写就没问题了

8. 为了防止机器重启，导致分区无法自动挂载，新增sdb的开机自动挂载文件，编辑文件/etc/fstab增加如下信息  
![fdisk /dev/sdb](/img/blogs/2020/10/linux-mount17.png)  

至此，磁盘就已挂载完成了

## 参考
<https://jingyan.baidu.com/article/046a7b3e61a3e7f9c27fa9a8.html>
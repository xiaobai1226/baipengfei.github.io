---
title: Linux磁盘分区挂载方法(可后期动态扩容)
date: 2021-08-12 10:13:00
sidebar: 'auto'
tags:
 - linux
categories:
 - Linux
---

最近工作碰到一个需求，需要在Linux系统挂载另外的硬盘，实际操作后，整理出这篇教程。  

## 工具
1. VMware
2. Linux系统  

## 前期准备
如果是自己练习的话，可以通过Vmware新建一块空闲分区，用于练习，操作步骤如下：
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

至此，前期准备就完成了，接下来开始将磁盘挂载到指定目录下，并开始使用它

## 挂载步骤
注：本篇文章只讲解操作步骤，若对其中使用的命令不了解请自行了解。 

<span id="parted"/>

### 使用parted创建分区
1. 使用parted命令对sdb进行分区
    ``` shell
    parted 要分区的磁盘路径
    本文为 parted /dev/sdb
    ```

2. 将MBR磁盘格式化为GPT（磁盘大于2T必须使用gpt类型）
    ``` shell
    mklabel gpt
    ```

3. 创建一个分区，为主分区并且分区大小为整个磁盘 
    ``` shell
    mkpart primary xfs 0% 100%
    ```

4. 给分区打上lvm标签
    ``` shell
    toggle 1 lvm
    ```

5. 打印分区信息，对刚才的操作进行核实  
    ``` shell
    print
    ```
 
    **操作截图**  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new1.png)


6. 使用fdisk -l查看完成情况
    ``` shell
    fdisk -l
    ```
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new2.png)
    
    可以看到/dev/sdb已经分区完成  
    
    **注：此处操作硬盘与前期准备新建的不是同一块，故大小不一致。**

<span id="pv"/>

### 将分区加入pv卷
1. 查看当前pv卷
    ``` shell
    pvs
    ```
    
    可以看到目前只有一个sda1  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new3.png)

2. 创建新的pv卷
    ``` shell
    pvcreate /dev/sdb1
    ```
    并再次查看pv卷可以看到，已经创建成功了。  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new4.png)

### 创建并将pv卷加入vg卷
1. 查看当前vg卷
    ``` shell
    vgs
    ```
    可以看到目前只有一个rootvg

2. 创建新的vg卷，并将卷名命名为datavg
    ``` shell
    vgcreate datavg /dev/sdb1
    ```
    并再次查看vg卷可以看到，已经创建成功了。  
    
    **操作截图**  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new5.png)

### 创建并将vg卷加入lv卷
1. 查看当前lv卷
    ``` shell
    lvs
    ```

2. 创建逻辑卷  
    -L 指定分区大小 -n 指定lvm名称，本次命名为lv_desc_1
    ``` shell
    lvcreate -l +100%FREE  -n lv_desc_1  datavg
    ```
    并再次查看lv卷可以看到，已经创建成功了。

3. 格式化lv卷  
    使用mkfs.xfs命令在逻辑卷lvmServer上创建xfs文件系统，格式化为xfs类型文件系统，运行性能好
    ``` shell
    mkfs.xfs /dev/datavg/lv_desc_1
    ```
    
    **操作截图**  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new6.png)
    
    此时，我们的硬盘已经完全配置完成了，接下来将硬盘挂载到指定的目录下。

### 挂载到磁盘文件夹下
1. 首先查看当前已挂载的硬盘，可以看到还是没有刚才配置的那块。
    ``` shell
    df -h
    ```

2. 创建想挂载硬盘的目录 
    ``` shell
    mkdir /app
    ```

3. 将硬盘挂载到指定目录下
    ``` shell
    mount /dev/datavg/lv_desc_1 /app
    ```
    
    再次查看挂载情况，可以看到已经挂载完成了。
    
    **操作截图**  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new7.png)
    
    进入挂载目录，新建文件进行测试，磁盘可以正常读写就没问题了。

4. 为了防止机器重启，导致硬盘无法自动挂载，新挂载硬盘必须增加开机自动挂载文件配置，编辑文件/etc/fstab增加如下信息：  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new8.png)

    文件中开头内容可对照df -h命令，挂载路径对应行的文件系统列，复制使用即可。  
    ![part /dev/sdb](/img/blogs/2021/08/linux-mount-new9.png)

至此，磁盘就挂载完成了

## 磁盘扩容
实际工作中，会碰到硬盘用完了，增加新硬盘后，追加至同一块硬盘的需求。  
**此处的扩容实际操作为对lvm扩展分区大小**

1. 创建pv卷
    依次重复挂载步骤中使用partedd创建分区与将分区加入pv卷操作  
   (1) [使用parted创建分区](#parted "使用parted创建分区")  
   (2) [将分区加入pv卷](#pv "将分区加入pv卷")  

2. 将pv卷扩展到vg卷  
    假定物理卷组为/dev/sdb2，执行命令
    ``` shell
    vgextend datavg /dev/sdb2
    ```

3. 对lv卷进行扩容  
    对lv进行在线(动态)扩容
    ``` shell
    lvextend -l +100%FREE /dev/mapper/datavg-lv_desc_1
    ```

4. 刷新文件系统使扩容生效
   ``` shell
   xfs_growfs /dev/mapper/datavg-lv_desc_1
    ```

至此，磁盘就扩容完成了
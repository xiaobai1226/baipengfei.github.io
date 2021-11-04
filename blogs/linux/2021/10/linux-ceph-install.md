---
title: Docker安装Ceph集群
date: 2021-10-08 17:19:00
sidebar: 'auto'
tags:
 - linux
 - docker
 - ceph
categories:
 - Linux
---

## 环境
1. 系统版本：Redhat7.8
2. Ceph的docker镜像版本：octopus
3. Docker版本：20.10.8

## 介绍
&emsp;&emsp;Ceph是一个统一的分布式存储系统，设计初衷是提供较好的性能、可靠性和可扩展性。  
&emsp;&emsp;Ceph项目最早起源于Sage就读博士期间的工作（最早的成果于2004年发表），并随后贡献给开源社区。在经过了数年的发展之后，目前已得到众多云计算厂商的支持并被广泛应用。RedHat及OpenStack都可与Ceph整合以支持虚拟机镜像的后端存储。

### Ceph特点
1. 高性能
    * 摒弃了传统的集中式存储元数据寻址的方案，采用CRUSH算法，数据分布均衡，并行度高。
    * 考虑了容灾域的隔离，能够实现各类负载的副本放置规则，例如跨机房、机架感知等。
    * 能够支持上千个存储节点的规模，支持TB到PB级的数据。
2. 高可用性
    * 副本数可以灵活控制。
    * 支持故障域分隔，数据强一致性。
    * 多种故障场景自动进行修复自愈。
    * 没有单点故障，自动管理。
3. 高可扩展性
    * 去中心化。
    * 扩展灵活。
    * 随着节点增加而线性增长。
4. 特性丰富
    * 支持三种存储接口：块存储、文件存储、对象存储。
    * 支持自定义接口，支持多种语言驱动。

## 架构规划

## 前期准备
部署Ceph之前我们需要对自身机器的环境做一个前期操作。主要涉及到防火墙，主机名等设置。 
1. 关闭防火墙
``` shell
systemctl stop firewalld
systemctl disable firewalld
```

2. 关闭selinux(linux的安全子系统) 
``` shell
sed -i 's/enforcing/disabled/' /etc/selinux/config
setenforce 0
```

::: warning
正式环境实际部署时，最好通过加入IP白名单的方式来操作，而不是直接关闭防火墙。 
:::

3. 设置主机名，分别把三台虚拟机的主机名设置成想设置的名称，本文为obptest2，obptest3，obptest4。
``` shell
hostnamectl set-hostname obptest2
hostnamectl set-hostname obptest3
hostnamectl set-hostname obptest4
```

4. SSH免密登陆配置
   * 在三个节点上分别执行下列命令配置host，需将ip与主机名替换为自己服务器的
        ``` shell
        cat >> /etc/hosts <<EOF
        10.169.136.38 obptest2
        10.169.136.39 obptest3
        10.169.136.40 obptest4
        EOF
        ```

    * 在主节点obptest2配置免密登录到obptest3和obptest4
        下面命令在主节点obptest2上执行。
        ``` shell
        ssh-keygen
        #把密钥发给obptest3、obptest4
        ssh-copy-id obptest3 
        ssh-copy-id obptest4
        ```
    
5. 内核参数优化
``` shell
#调整内核参数
cat >> /etc/sysctl.conf << EOF
kernel.pid_max=4194303
vm.swappiness = 0
EOF
sysctl -p
# read_ahead, 通过数据预读并且记载到随机访问内存方式提高磁盘读操作，根据一些Ceph的公开分享，8192是比较理想的值
echo "8192" > /sys/block/sda/queue/read_ahead_kb
# I/O Scheduler，关于I/O Scheculder的调整，简单说SSD要用noop，SATA/SAS使用deadline。
echo "deadline" > /sys/block/sda/queue/scheduler
echo "noop" > /sys/block/sda/queue/scheduler
```

6. 打开ntp服务  
ntp服务的作用是用于同步不同机器的时间。如果不打开ntp服务的话，则有可能会出现 clock skew detected on mon.obptest2, mon.obptest3这种问题。
``` shell
#查看ntp，如果状态是inactive，则表示没启动
systemctl status ntpd
#启动ntp服务
systemctl start ntpd
#设置开启自启动ntp服务
systemctl enable ntpd
```

7. 安装docker  
所有节点均需安装，具体安装步骤见：[Docker安装教程](../../../docker/2021/08/docker-install.md)  

8. 其他配置  
将容器内的ceph命令alias到本地，方便使用，其他命令也以参考添加
``` shell
echo 'alias ceph="docker exec mon ceph"' >> /etc/profile
source /etc/profile
```

## 部署
### 创建Ceph目录
1. 创建目录  
在宿主机上创建Ceph目录与容器建立映射，便于直接操纵管理Ceph配置文件，以root身份在主节点obptest2上创建文件夹，命令如下：
``` shell
mkdir -p /app/ceph/{admin,etc,lib,logs,data}
```
::: tip
该命令会一次创建5个指定的目录，注意逗号分隔，不能有空格。其中：
1. admin文件夹下用于存储启动脚本
2. etc文件夹下存放了ceph.conf等配置文件 
3. lib文件夹下存放了各组件的密钥文件 
4. logs文件夹下存放了ceph的日志文件
5. data文件夹用于挂载文件 
:::

2. 对docker内用户进行授权
``` shell
# docker内用户id是167，这里进行授权
chown -R 167:167 /app/ceph/
```

### 拉取Ceph镜像
::: warning
拉取时注意版本，不要贸然采用最新版，有些会存在缺陷，安装的时候会出现问题，这里采用的nautilus版本。
:::

``` shell
docker pull ceph/daemon:master-dba849b-octopus-centos-8-x86_64
```

### 启动MON服务
三台节点上都需安装Mon服务。先在主节点操作。
1. 在主节点的/app/ceph/admin目录下创建start_mon.sh脚本：
``` shell
#!/bin/bash
docker run -d --net=host \
    --name=ceph-mon \
    -v /etc/localtime:/etc/localtime \
    -v /app/ceph/etc:/etc/ceph \
    -v /app/ceph/lib:/var/lib/ceph \
    -v /app/ceph/logs:/var/log/ceph \
    -e MON_IP=10.169.136.38,10.169.136.39,10.169.136.40 \
    -e CEPH_PUBLIC_NETWORK=10.169.136.0/24 \
    ceph/daemon:master-dba849b-octopus-centos-8-x86_64 mon
```
::: tip
1. name参数，指定节点名称， 这里设为ceph-mon
2. 建立宿主机与容器的目录映射关系，包含etc、lib、logs目录
3. MON_IP 参数指定mon服务的节点IP信息
4. CEPH_PUBLIC_NETWORK参数，指定mon的ip网段信息，如果跨网段需写上所有的网段（注意这里是24位，将最后一位改为0就可以）。
5. 最后指定镜像版本， mon为参数， 代表启动的是mon服务，不能乱填。
:::

2. 给脚本增加权限：
``` shell
chmod 755 -R  /app/ceph/admin/start_mon.sh
```

3. 启动mon服务：
``` shell
/app/ceph/admin/start_mon.sh
```

4. 创建Ceph配置文件
``` shell
vim /app/ceph/etc/ceph.conf
```
配置内容及说明：
``` shell
[global]
fsid = 646aa796-0240-4dd8-83b3-8781779a8feb
# mon节点名称
mon initial members = obptest2
# mon 主机地址信息，填写所属机器的IP
mon host = 10.169.136.38,10.169.136.39,10.169.136.40
# 对外访问的IP网段
public network = 10.169.136.0/24
# 集群IP网段
cluster network = 10.169.136.0/24
# journal 大小 ， 一般设为（磁盘带宽 * 文件同步刷新时间）的2倍
osd journal size = 100

# 需手动追加如下内容
# 设置pool池默认分配数量
osd pool default size = 2
# 容忍更多的时钟误差
mon clock drift allowed = 10
mon clock drift warn backoff = 30
# 允许删除pool
mon_allow_pool_delete = true
[mgr]
# 开启WEB仪表盘
mgr modules = dashboard
[client.rgw.obptest2]
# 设置rgw网关的web访问端口
rgw_frontends = "civetweb port=10083"
```

5. 检查mon服务状态
``` shell
docker exec -it ceph-mon ceph -s
```
出现HEALTH_OK代表服务启动成功：
![文件截图](/img/blogs/2021/10/ceph_mon_health_ok.png)
::: warning 常见问题
1. 若容器启动失败，可使用命令
``` shell
docker logs ceph-mon
```
若出现
![文件截图](/img/blogs/2021/10/ceph_mon_docker_fail.png)
可将启动脚本与配置文件mon ip参数暂时改为一个本机IP，如
``` shell
# 启动脚本
-e MON_IP=10.169.136.38

# 配置文件
mon host = 10.169.136.38
```
然后删除现有问题容器，重新执行脚本，即可正常创建容器，容器启动后，再修改启动脚本与配置文件改回多IP形式，重启容器，即可正常启动

2. 若容器启动失败，查看容器日志，提示如下信息  
Existing mon, trying to rejoin cluster abort  
这时需修改容器内的启动脚本
``` shell
# 将启动脚本复制出来
docker cp ceph-mon:/opt/ceph-container/bin/start_mon.sh .

# 注释此行，直接将v2v1复制为2，代表是走V2协议， 以指定IP方式加入集群
#v2v1=$(ceph-conf -c /etc/ceph/${CLUSTER}.conf 'mon host' | tr ',' '\n' | grep -c ${MON_IP})
v2v1=2

# 将脚本复制回去
docker cp start_mon.sh ceph-mon:/opt/ceph-container/bin/start_mon.sh 
```
重启容器即可恢复正常

3. 容器启动成功，查看状态发现如下信息：
![文件截图](/img/blogs/2021/10/ceph_mon_health_warn.png)
可以执行
``` shell
# 禁用不安全模式
docker exec -it ceph-mon ceph config set mon auth_allow_insecure_global_id_reclaim false
```
然后重启容器即可恢复正常
:::

6. 将主节点配置复制到其他两个节点， 覆盖/app/ceph/目录
``` shell
scp -r /app/ceph/ root@10.169.136.39:/app/
scp -r /app/ceph/ root@10.169.136.40:/app/
```
复制完成，修改相关配置信息后，分别在其他两个节点启动mon服务

7. 检查集群状态
这里我们只搭建了三个mon节点， 正常的话可以看到已成功组建集群：
![文件截图](/img/blogs/2021/10/ceph_mon_health_ok_all.png)

### 启动OSD服务
OSD服务是对象存储守护进程，负责把对象存储到本地文件系统，必须要有一块独立的磁盘作为存储，如果没有独立磁盘则需要在Linux下面创建一个虚拟磁盘进行挂载。   
以下步骤在三台节点依次进行
1. 创建OSD磁盘  
下面分别介绍两种挂载方式：  
(1) 无独立磁盘  
如果没有独立磁盘，我们可以创建一个虚拟磁盘进行挂载，步骤如下： 
   * 初始化10T的镜像文件：
   ``` shell
   mkdir -p /app/ceph/ceph-disk 
   
   dd if=/dev/mapper/datavg-lv_desc_1 of=/app/ceph/ceph-disk/ceph-disk-01 bs=1G count=10240
   ```
   * 将镜像文件虚拟成块设备：
   ``` shell
   losetup -f /app/ceph/ceph-disk/ceph-disk-01 
   ```
   * 格式化：
   ``` shell
   # 查询设备名称，结果为/dev/loop0 
   fdisk -l

   # 格式化
   mkfs.xfs -f /dev/loop0 
   ```
   * 挂载文件系统，就是将loop0磁盘挂载到/dev/osd目录下,
   ``` shell
   mkdir -p /dev/osd 

   mount /dev/loop0 /dev/osd 
   ```

(2) 有独立磁盘
   * 直接格式化
   ```shell
   # 名称根据fdisk -l进行查询
   mkfs.xfs -f /dev/sdb
   ```  
   * 挂载文件系统：
   ``` shell
   mkdir -p /dev/osd 
   
   mount /dev/datavg/lv_desc_2 /dev/osd 
   ```

（3）查看挂载结果
``` shell
df -h
```

2. 在主节点的/app/ceph/admin目录下创建start_osd.sh脚本：
``` shell
#!/bin/bash
docker run -d \
    --name=ceph-osd \
    --net=host \
    --privileged=true \
    --pid=host \
    -v /etc/localtime:/etc/localtime \
    -v /app/ceph/etc:/etc/ceph \
    -v /app/ceph/lib:/var/lib/ceph \
    -v /app/ceph/logs:/var/log/ceph \
    -v /dev/osd:/var/lib/ceph/osd \
    ceph/daemon:master-dba849b-octopus-centos-8-x86_64 osd_directory
```
::: tip
这里我们采用的是osd_directory镜像模式，如果有独立磁盘的话，也可以采用osd_ceph_disk模式，无需格式化，直接指定设备名称即可，如`OSD_DEVICE=/dev/sdb`
:::

3. 给脚本增加权限：
``` shell
chmod 755 -R  /app/ceph/admin/start_osd.sh
```

4. 创建OSD密钥文件
::: warning
三台mon节点都需执行，且该命令是在容器mon节点服务上执行
:::

``` shell
docker exec -it ceph-mon ceph auth get client.bootstrap-osd -o /var/lib/ceph/bootstrap-osd/ceph.keyring
```

5. 启动服务：
``` shell
/app/ceph/admin/start_osd.sh
```

6. 检查启动状态
``` shell
docker ps

# 可以看到多了3个osd信息
docker exec -it ceph-mon ceph -s
```

::: warning
osd的个数最好维持在奇数个
:::

### 启动mgr服务
需依次在3台节点上执行
1. 在/app/ceph/admin目录下创建start_mgr.sh脚本：
``` shell
#!/bin/bash
docker run -d --net=host  \
  --name=ceph-mgr \
  -v /etc/localtime:/etc/localtime \
  -v /app/ceph/etc:/etc/ceph \
  -v /app/ceph/lib:/var/lib/ceph \
  -v /app/ceph/logs:/var/log/ceph \
  ceph/daemon:master-dba849b-octopus-centos-8-x86_64 mgr
```
这个脚本是用于启动mgr组件，它的主要作用是分担和扩展monitor的部分功能，提供图形化的管理界面以便我们更好的管理ceph存储系统。其启动脚本比较简单，在此不再赘述。

2. 启动mgr服务：
``` shell
/app/ceph/admin/start_mgr.sh
```

3. 检查启动状态
``` shell
docker ps

# 可以看到多了3个mgr信息
docker exec -it ceph-mon ceph -s
```  

### 启动rgw服务
需依次在3台节点上执行
1. 在/app/ceph/admin目录下创建start_rgw.sh脚本：
``` shell
#!/bin/bash
docker run -d --net=host  \
  --name=ceph-rgw \
  -v /etc/localtime:/etc/localtime \
  -v /app/ceph/etc:/etc/ceph \
  -v /app/ceph/lib:/var/lib/ceph \
  -v /app/ceph/logs:/var/log/ceph \
  ceph/daemon:master-dba849b-octopus-centos-8-x86_64 rgw
```
该脚本主要是用于启动rgw组件，rgw（Rados GateWay）作为对象存储网关系统，一方面扮演RADOS集群客户端角色，为对象存储应用提供数据存储，另一方面扮演HTTP服务端角色，接受并解析互联网传送的数据。

2. 创建rgw密钥文件
::: warning
三台mon节点都需执行，且该命令是在容器mon节点服务上执行
:::

``` shell
docker exec ceph-mon ceph auth get client.bootstrap-rgw -o /var/lib/ceph/bootstrap-rgw/ceph.keyring
```

3. 启动服务：
``` shell
/app/ceph/admin/start_rgw.sh
```

4. 检查启动状态
``` shell
docker ps

# 可以看到多了3个rgw信息
docker exec -it ceph-mon ceph -s
```

### 启动mds服务
需依次在3台节点上执行
1. 在/app/ceph/admin目录下创建start_mds.sh脚本：
``` shell
#!/bin/bash
docker run -d \
   --net=host \
   --name=ceph-mds \
   --privileged=true \
   -v /etc/localtime:/etc/localtime \
   -v /app/ceph/etc:/etc/ceph \
   -v /app/ceph/lib:/var/lib/ceph \
   -v /app/ceph/logs:/var/log/ceph \
   -e CEPHFS_CREATE=0 \
   -e CEPHFS_METADATA_POOL_PG=512 \
   -e CEPHFS_DATA_POOL_PG=512 \
   ceph/daemon:master-dba849b-octopus-centos-8-x86_64 mds
```
::: tip 说明
1. CEPHFS_CREATE：是为METADATA服务生成文件系统，0表示不自动创建文件系统（默认值），1表示自动创建。
2. CEPHFS_DATA_POOL_PG：是数据池的数量，默认为8。
3. CEPHFS_METADATA_POOL_PG：是元数据池的数量，默认为8。
:::

2. 启动服务：
``` shell
/app/ceph/admin/start_mds.sh
```

3. 检查启动状态
``` shell
docker ps

# 可以看到多了mds信息
docker exec -it ceph-mon ceph -s
```

### 安装Dashboard管理后台
仅在主节点执行
1. 首先确定主节点，找到mgr为active的那个节点，如下：
``` shell
# 查看集群状态
docker exec -it ceph-mon ceph -s
```
![文件截图](/img/blogs/2021/10/ceph_mgr_master.png)
这里的主节点就是obptest2节点

2. 开启dashboard功能
``` shell
docker exec ceph-mgr ceph mgr module enable dashboard
```

3. 创建证书
``` shell
docker exec ceph-mgr ceph dashboard create-self-signed-cert
```

4. 创建登陆用户与密码
``` shell
# 创建文件并将密码写入
echo 'test' > dashboard-passwd

# 将密码文件传入容器内
docker cp dashboard-passwd ceph-mgr:/

# 创建登陆用户与密码
docker exec ceph-mgr ceph dashboard set-login-credentials admin -i dashboard-passwd
```

5. 配置外部访问端口
``` shell
docker exec ceph-mgr ceph config set mgr mgr/dashboard/server_port 10083
```

6. 配置外部访问IP
``` shell
docker exec ceph-mgr ceph config set mgr mgr/dashboard/server_addr 10.169.136.38
```

7. 关闭https(如果没有证书或内网访问， 可以关闭)
``` shell
docker exec ceph-mgr ceph config set mgr mgr/dashboard/ssl false
```

8. 重启Mgr DashBoard服务
``` shell
docker restart ceph-mgr
```

9. 查看Mgr DashBoard服务信息
``` shell
docker exec ceph-mgr ceph mgr services
```
管理控制台界面：
![文件截图](/img/blogs/2021/10/ceph_dashboard.png)

### 创建FS文件系统
在主节点执行即可
1. 创建Data Pool
``` shell
docker exec ceph-osd ceph osd pool create cephfs_data 128 128
```

2. 创建Metadata Pool
``` shell
docker exec ceph-osd ceph osd pool create cephfs_metadata 64 64
```

::: warning
如果受mon_max_pg_per_osd限制， 不能设为128，可以调小点， 改为64
:::

3. 创建CephFS  
将上面的数据池与元数据池关联， 创建cephfs的文件系统
``` shell
docker exec ceph-osd ceph fs new cephfs cephfs_metadata cephfs_data
```

4. 查看FS信息
``` shell
docker exec ceph-osd ceph fs ls
```

### 查看整个集群信息
至此， 整个集群就已经搭建完毕，可以查看整个集群信息，我们规划的所有节点都已创建成功并加入集群
``` shell
docker exec ceph-mon ceph -s
```

## 参考
* <https://blog.csdn.net/hxx688/article/details/103440967?spm=1001.2014.3001.5501>
* <https://zhuanlan.zhihu.com/p/379440526>
* <https://hub.docker.com/r/ceph/daemon>
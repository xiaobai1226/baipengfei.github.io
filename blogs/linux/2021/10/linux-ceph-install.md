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
publish: false
---

## 环境
1. 系统版本：Redhat7.8
2. Ceph的docker镜像版本：nautilus
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
docker pull ceph/daemon:master-4d96298-nautilus-centos-7-x86_64
```

### 启动MON服务
三台节点上都需安装Mon服务。先在主节点操作。
1. 在主节点的/app/ceph/admin目录下创建start_mon.sh脚本：
``` shell
!/bin/bash
docker run -d --net=host \
    --name=ceph-mon \
    -v /etc/localtime:/etc/localtime \
    -v /app/ceph/etc:/etc/ceph \
    -v /app/ceph/lib:/var/lib/ceph \
    -v /app/ceph/logs:/var/log/ceph \
    -e MON_IP=10.169.136.38,10.169.136.39,10.169.136.40 \
    -e CEPH_PUBLIC_NETWORK=10.169.136.0/24 \
    ceph/daemon:master-4d96298-nautilus-centos-7-x86_64 mon
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
mon initial members = CENTOS7-1
# mon 主机地址信息
mon host = 10.169.136.38,10.169.136.39,10.169.136.40
# 对外访问的IP网段
public network = 10.169.136.0/24
# 集群IP网段
cluster network = 10.169.136.0/24
# journal 大小 ， 一般设为（磁盘带宽 * 文件同步刷新时间）的2倍
osd journal size = 100
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
[client.rgw.CENTOS7-1]
# 设置rgw网关的web访问端口
rgw_frontends = "civetweb port=20003"
```

5. 检查mon服务状态
出现HEALTH_OK代表服务启动成功：

6. 将主节点配置复制到其他两个节点， 覆盖/app/ceph/目录
``` shell
scp -r /app/ceph/ root@10.169.136.39:/app/
scp -r /app/ceph/ root@10.169.136.40:/app/
```
复制完成之后， 分别在其他两个节点启动mon服务

7. 检查集群状态
这里我们只搭建了三个mon节点， 正常的话可以看到已成功组件集群：


### 启动OSD服务
OSD服务是对象存储守护进程，负责把对象存储到本地文件系统，必须要有一块独立的磁盘作为存储，如果没有独立磁盘则需要在Linux下面创建一个虚拟磁盘进行挂载。  
下面分别介绍两种挂载方式：
#### 无独立磁盘  
如果没有独立磁盘，我们可以创建一个虚拟磁盘进行挂载，步骤如下： 
1. 初始化10T的镜像文件：
``` shell
mkdir -p /app/ceph/ceph-disk dd if=/dev/mapper/datavg-lv_desc_1 of=/app/ceph/ceph-disk/ceph-disk-01 bs=1T count=10
```
2. 将镜像文件虚拟成块设备：
``` shell
losetup -f /app/ceph/ceph-disk/ceph-disk-01 
```
3. 格式化（名称根据fdisk -l进行查询）：
``` shell
mkfs.xfs -f /dev/loop0 
```
4. 挂载文件系统，就是将loop0磁盘挂载到/dev/osd目录下,
``` shell
mkdir -p /dev/osd 

mount /dev/loop0 /dev/osd 
```

#### 有独立磁盘
1. 直接格式化
```shell
# 名称根据fdisk -l进行查询
mkfs.xfs -f /dev/sdb
```  
2. 挂载文件系统：
``` shell
mkdir -p /dev/osd mount /dev/sdb /dev/osd 
```

#### 查看挂载结果
``` shell
df -h
```

### 启动OSD服务
以下步骤在三台节点依次进行
1. 创建OSD磁盘
OSD服务是对象存储守护进程， 负责把对象存储到本地文件系统， 必须要有一块独立的磁盘作为存储。

### 启动mgr服务

### 启动rgw服务

### 启动mds服务

### 安装Dashboard管理后台

### 创建FS文件系统

### 



1. 拉取ceph
这里用到了 dockerhub 上最流行的 ceph/daemon 镜像（这里需要拉取nautilus版本的ceph，latest-nautilus）

docker pull ceph/daemon:latest-nautilus
5. 编写脚本（脚本都放在admin文件夹下）
1. start_mon.sh

!/bin/bash
docker run -d --net=host \
    --name=mon \
    -v /etc/localtime:/etc/localtime \
    -v /usr/local/ceph/etc:/etc/ceph \
    -v /usr/local/ceph/lib:/var/lib/ceph \
    -v /usr/local/ceph/logs:/var/log/ceph \
    -e MON_IP=192.168.161.137,192.168.161.135,192.168.161.136 \
    -e CEPH_PUBLIC_NETWORK=192.168.161.0/24 \
    ceph/daemon:latest-nautilus  mon
这个脚本是为了启动监视器，监视器的作用是维护整个Ceph集群的全局状态。一个集群至少要有一个监视器，最好要有奇数个监视器。方便当一个监视器挂了之后可以选举出其他可用的监视器。启动脚本说明： 1. name参数，指定节点名称，这里设为mon 2. -v xxx:xxx 是建立宿主机与容器的目录映射关系，包含 etc、lib、logs目录。 3. MON_IP是Docker运行的IP地址（通过ifconfig来查询，取ens33里的inet那个IP）,这里我们有3台服务器，那么MAN_IP需要写上3个IP，如果IP是跨网段的CEPH_PUBLIC_NETWORK必须写上所有网段。 4. CEPH_PUBLIC_NETWORK配置了运行Docker主机所有网段 这里必须指定nautilus版本，不然会默认操作最新版本ceph，mon必须与前面定义的name保持一致。

2. start_osd.sh

#!/bin/bash
docker run -d \
    --name=osd \
    --net=host \
    --restart=always \
    --privileged=true \
    --pid=host \
    -v /etc/localtime:/etc/localtime \
    -v /usr/local/ceph/etc:/etc/ceph \
    -v /usr/local/ceph/lib:/var/lib/ceph \
    -v /usr/local/ceph/logs:/var/log/ceph \
    -v /dev/osd:/var/lib/ceph/osd \
    ceph/daemon:latest-nautilus  osd_directory
这个脚本是用于启动OSD组件的，OSD（Object Storage Device）是RADOS组件，其作用是用于存储资源。 脚本说明： 1. name 是用于指定OSD容器的名称
2. net 是用于指定host，就是前面我们配置host 3. restart指定为always，使osd组件可以在down时重启。 4.privileged是用于指定该osd是专用的。 这里我们采用的是osd_directory 镜像模式

3. start_mgr.sh

#!/bin/bash
docker run -d --net=host  \
  --name=mgr \
  -v /etc/localtime:/etc/localtime \
  -v /usr/local/ceph/etc:/etc/ceph \
  -v /usr/local/ceph/lib:/var/lib/ceph \
  -v /usr/local/ceph/logs:/var/log/ceph \
  ceph/daemon:latest-nautilus mgr
这个脚本是用于启动mgr组件，它的主要作用是分担和扩展monitor的部分功能，提供图形化的管理界面以便我们更好的管理ceph存储系统。其启动脚本比较简单，在此不再赘述。

4. start_rgw.sh

#!/bin/bash
docker run \
    -d --net=host \
    --name=rgw \
    -v /etc/localtime:/etc/localtime \
    -v /usr/local/ceph/etc:/etc/ceph \
    -v /usr/local/ceph/lib:/var/lib/ceph \
    -v /usr/local/ceph/logs:/var/log/ceph \
    ceph/daemon:latest-nautilus rgw
该脚本主要是用于启动rgw组件，rgw（Rados GateWay）作为对象存储网关系统，一方面扮演RADOS集群客户端角色，为对象存储应用提供数据存储，另一方面扮演HTTP服务端角色，接受并解析互联网传送的数据。

6. 执行脚本
启动mon
首先在主节点ceph1上执行start_mon.sh脚本，启动后通过docker ps -a|grep mon查看启动结果，启动成功之后生成配置数据，在ceph主配置文件中，追加如下内容：
cat >>/usr/local/ceph/etc/ceph.conf <<EOF
# 容忍更多的时钟误差
mon clock drift allowed = 2
mon clock drift warn backoff = 30
# 允许删除pool
mon_allow_pool_delete = true

[mgr]
# 开启WEB仪表盘
mgr modules = dashboard
[client.rgw.ceph1]
# 设置rgw网关的web访问端口
rgw_frontends = "civetweb port=20003"
EOF
拷贝所有数据（已包含脚本）到另外2台服务器
scp -r /usr/local/ceph ceph2:/usr/local/
scp -r /usr/local/ceph ceph3:/usr/local/
通过远程ssh，在ceph2和ceph3上依次启动mon(启动前不要修改ceph.conf文件)
ssh ceph2 bash /usr/local/ceph/admin/start_mon.sh
ssh ceph3 bash /usr/local/ceph/admin/start_mon.sh
启动后通过 ceph -s查看集群状态，如果能够看到ceph2和ceph3,则表示集群创建成功，此时的状态应该是HEALTH_OK状态。

启动OSD
在执行start_osd.sh脚本之前，首先需要在mon节点生成osd的密钥信息，不然直接启动会报错。命令如下：

docker exec -it mon ceph auth get client.bootstrap-osd -o /var/lib/ceph/bootstrap-osd/ceph.keyring
接着在主节点下执行如下命令：

bash /usr/local/ceph/admin/start_osd.sh
ssh ceph2 bash /usr/local/ceph/admin/start_osd.sh
ssh ceph3 bash /usr/local/ceph/admin/start_osd.sh
全部osd都启动之后，稍等片刻后，执行ceph -s查看状态，应该可以看到多了如下信息（总共3个osd）

osd: 3 osds: 3 up, 3 in
PS: osd的个数最好维持在奇数个。

启动mgr
直接在主节点ceph1上执行如下三个命令：

bash /usr/local/ceph/admin/start_mgr.sh
ssh ceph2 bash /usr/local/ceph/admin/start_mgr.sh
ssh ceph3 bash /usr/local/ceph/admin/start_mgr.sh
启动rgw
同样的我们首先还是需要先在mon节点生成rgw的密钥信息，命令如下：

docker exec mon ceph auth get client.bootstrap-rgw -o /var/lib/ceph/bootstrap-rgw/ceph.keyring
接着在主节点ceph1上执行如下三个命令：

bash /usr/local/ceph/admin/start_rgw.sh
ssh ceph2 bash /usr/local/ceph/admin/start_rgw.sh
ssh ceph3 bash /usr/local/ceph/admin/start_rgw.sh
启动完成之后再通过ceph-s查看集群的状态


安装Dashboard管理后台
首先确定主节点，通过ceph -s命令查看集群状态，找到mgr为active的那个节点，如下：

mgr: ceph1(active), standbys: ceph2, ceph3
这里的主节点就是ceph1节点。 1. 开启dashboard功能

docker exec mgr ceph mgr module enable dashboard
创建登录用户与密码
docker exec mgr ceph dashboard set-login-credentials admin test
这里设置用户名为admin,密码为test。 3. 配置外部访问端口个，这里指定端口号是18080，可以自定义修改

docker exec mgr ceph config set mgr mgr/dashboard/server_port 18080
配置外部访问地址，这里我的主节点IP是192.168.161.137，你需要换成自己的IP地址。
docker exec mgr ceph config set mgr mgr/dashboard/server_addr 192.168.161.137
关闭https(如果没有证书或内网访问， 可以关闭)
docker exec mgr ceph config set mgr mgr/dashboard/ssl false
重启Mgr DashBoard服务
docker restart mgr
查看Mgr DashBoard服务
docker exec mgr ceph mgr services
最后通过 http://192.168.161.137:18080/#/dashboard 访问。


查看整个集群信息
至此，整个集群就已经搭建完毕，通过ceph -s命令，可以查看整个集群信息，我们规划的所有节点都已创建成功并加入集群


关于重启mon服务失败问题

如果修改了配置或者宿主机出现问题， 需要重启mon服务， 会出现不能正常启动的问题，查看容器日志， 最后一行提示：

Existing mon, trying to rejoin cluster abort

没有具体的原因， 解决的办法是删除/usr/local/ceph/lib/mon目录， 再重新启动， 但这会破坏原有配置与数据， 影响集群的正常运转，这是我们不能接受的， 无耐，只有研究它的启动脚本。（ 这不是Docker容器问题， 是Ceph的镜像脚本编写有点问题。） 将脚本拷贝出来：

docker cp mon:/opt/ceph-container/bin/start_mon.sh .

找到并修改以下内容：

# 注释此行，直接将v2v1复制为2，代表是走V2协议， 以指定IP方式加入集群

#v2v1=$(ceph-conf -c /etc/ceph/${CLUSTER}.conf 'mon host' | tr ',' '\n' | grep -c ${MON_IP})

v2v1=2

再将脚本复制至容器内：

docker cp start_mon.sh mon:/opt/ceph-container/bin/start_mon.sh

## 参考
* <https://blog.csdn.net/hxx688/article/details/103440967?spm=1001.2014.3001.5501>
* <https://zhuanlan.zhihu.com/p/379440526>
* <https://hub.docker.com/r/ceph/daemon>
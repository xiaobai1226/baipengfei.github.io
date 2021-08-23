---
title: Kubernetes安装教程（单Master节点）
date: 2021-08-20 14:10:00
sidebar: 'auto'
tags:
 - kubernetes
 - k8s
categories:
 - Kubernetes
---

本教程安装软件版本为：
1. Kubernetes`1.22.0`
   * calico 3.20
2. Containerd.io`1.4.9-3.1`

::: tip
关于二进制安装
* kubeadm 是 Kubernetes 官方支持的安装方式，“二进制” 不是。本文档采用 kubernetes.io 官方推荐的 kubeadm 工具安装 kubernetes 集群。
:::

## 安装前准备
### 检查服务器（所有机器均需检查）
``` shell
# 在 master 节点和 worker 节点都要执行
cat /etc/redhat-release

# 此处 hostname 的输出将会是该机器在 Kubernetes 集群中的节点名字
# 不能使用 localhost 作为节点的名字
hostname

# 请使用 lscpu 命令，核对 CPU 信息
# Architecture: x86_64    本安装文档不支持 arm 架构
# CPU(s):       2         CPU 内核数量不能低于 2
lscpu

#如果您需要修改 hostname，可执行如下指令：

# 修改 hostname
hostnamectl set-hostname your-new-host-name
# 查看修改结果
hostnamectl status
# 设置 hostname 解析
echo "127.0.0.1   $(hostname)" >> /etc/hosts
```

### 检查网络（所有机器均需检查）
在所有节点执行命令
``` shell
# 显示服务器默认网卡
ip route show

# 显示默认网卡的 IP 地址
ip address
```

::: warning
kubelet使用的IP地址
* ip route show 命令中，可以知道机器的默认网卡，通常是 eth0，如 default via 172.21.0.23 dev eth0
* ip address 命令中，可显示默认网卡的 IP 地址，Kubernetes 将使用此 IP 地址与集群内的其他节点通信，如 172.17.216.80
* 所有节点上 Kubernetes 所使用的 IP 地址必须可以互通（无需 NAT 映射、无安全组或防火墙隔离）
:::

### 关闭相关设置（所有机器均需检查）
``` shell
# 关闭 防火墙
systemctl stop firewalld
systemctl disable firewalld

# 关闭 SeLinux
setenforce 0
sed -i "s/SELINUX=enforcing/SELINUX=disabled/g" /etc/selinux/config

# 关闭 swap
swapoff -a
yes | cp /etc/fstab /etc/fstab_bak
cat /etc/fstab_bak |grep -v swap > /etc/fstab
```

## 安装docker
**所有机器均需安装**

### 安装docker
具体安装步骤见： 
[Docker安装教程](../../../docker/2021/08/docker-install.md)

### 补充组件安装
安装k8s还需安装docker的组件 [下载地址](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
1. docker-ce-rootless-extras-20.10.8-3.el7.x86_64.rpm
2. docker-scan-plugin-0.8.0-3.el7.x86_64.rpm
3. fuse-overlayfs-0.7.2-6.el7_8.x86_64.rpm
4. slirp4netns-0.4.3-4.el7_8.x86_64.rpm

``` shell
# 在线安装，直接yum安装即可，离线安装需先下载到本地，再rpm安装
rpm -ivh docker-ce-rootless-extras-20.10.8-3.el7.x86_64.rpm docker-scan-plugin-0.8.0-3.el7.x86_64.rpm fuse-overlayfs-0.7.2-6.el7_8.x86_64.rpm slirp4netns-0.4.3-4.el7_8.x86_64.rpm --nodeps --force
```

### 将cgroup driver修改为`systemd`
::: tip
* Kubernetes 推荐使用 systemd 来代替 cgroupfs，因为systemd是Kubernetes自带的cgroup管理器, 负责为每个进程分配cgroups，但docker的cgroup driver默认是cgroupfs,这样就同时运行有两个cgroup控制管理器，当资源有压力的情况时,有可能出现不稳定的情况。

* 故k8s与docker的cgroup driver方式需一致，不然kubeadm init时会报如下错误：
```
[WARNING IsDockerSystemdCheck]: detected "cgroupfs" as the Docker cgroup driver. 
The recommended driver is "systemd". 
```
:::
1. 查看docker当前cgroup driver
``` shell
docker info
```
查询结果：  
![下载截图](/img/blogs/2021/08/docker-info-cgroup-driver.png)
可以看到默认的Cgroup Driver是cgroupfs

2. 修改docker的cgroup driver为systemd
   * **方式一**  
    编辑docker的配置文件，如果不存在就创建
    ``` shell
    vim /etc/docker/daemon.json

    # 内容如下
    {
        "exec-opts": ["native.cgroupdriver=systemd"]
    }
    ```

   * **方式二**  
    如果方式一修改后不生效的话，请使用该方式  
    修改docker.service文件
    ``` shell
    vim /usr/lib/systemd/system/docker.service

    # 在这一行后面追加配置
    #ExecStart=/usr/bin/dockerd
    ExecStart=/usr/bin/dockerd --exec-opt native.cgroupdriver=systemd
    ```

3. 重启docker
``` shell
systemctl daemon-reload
systemctl restart docker
```

再执行`docker info`就可以看到配置已经生效了。

## 安装containerd
**所有机器均需安装**
::: tip 
Container Runtime
* Kubernetes v1.21 开始，默认移除 docker 的依赖，如果宿主机上安装了 docker 和 containerd，将优先使用 docker 作为容器运行引擎，如果宿主机上未安装 docker 只安装了 containerd，将使用 containerd 作为容器运行引擎；
:::

::: warning
若为内网环境需先下载好安装包，上传至服务器，本教程使用安装包为`containerd.io-1.4.9-3.1.el7.x86_64.rpm`  
[下载地址](https://download.docker.com/linux/centos/7/x86_64/stable/Packages/) 
:::
``` shell
cat <<EOF | sudo tee /etc/modules-load.d/containerd.conf
overlay
br_netfilter
EOF

modprobe overlay
modprobe br_netfilter

# Setup required sysctl params, these persist across reboots.
cat <<EOF | sudo tee /etc/sysctl.d/99-kubernetes-cri.conf
net.bridge.bridge-nf-call-iptables  = 1
net.ipv4.ip_forward                 = 1
net.bridge.bridge-nf-call-ip6tables = 1
EOF

# Apply sysctl params without reboot
sysctl --system

# 卸载旧版本
yum remove -y containerd.io

# 设置 yum repository
yum install -y yum-utils device-mapper-persistent-data lvm2

# 外网环境下
# 配置yum源
yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
# 安装 containerd
yum install -y containerd.io-1.4.9

# 内网环境下，提前下载好安装包，在安装包所在目录
yum install -y containerd.io-1.4.9-3.1.el7.x86_64.rpm

mkdir -p /etc/containerd
containerd config default > /etc/containerd/config.toml

sed -i "s#k8s.gcr.io#registry.aliyuncs.com/k8sxio#g"  /etc/containerd/config.toml
sed -i '/containerd.runtimes.runc.options/a\ \ \ \ \ \ \ \ \ \ \ \ SystemdCgroup = true' /etc/containerd/config.toml
sed -i "s#https://registry-1.docker.io#${REGISTRY_MIRROR}#g"  /etc/containerd/config.toml

systemctl daemon-reload
systemctl enable containerd
systemctl restart containerd

# 安装 nfs-utils
# 必须先安装 nfs-utils 才能挂载 nfs 网络存储
yum install -y nfs-utils
yum install -y wget
```

## 安装kubelet/kubeadm/kubectl
**所有机器均需安装**

### 公网安装
``` shell
# 配置K8S的yum源
cat <<EOF > /etc/yum.repos.d/kubernetes.repo
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgcheck=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
       http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg
EOF

# 卸载旧版本
yum remove -y kubelet kubeadm kubectl

# 安装kubelet、kubeadm、kubectl
# 将 ${1} 替换为 kubernetes 版本号，例如 1.20.1
yum install -y kubelet-${1} kubeadm-${1} kubectl-${1}
```

### 离线安装
如果是内网环境，则需现将安装包下载至本地，再上传至服务器安装。
``` shell
# 在一台通公网的服务器执行如下命令，将kubelet kubeadm kubectl的rpm包及相关依赖下载下来并上传至服务器
yum install --downloadonly --downloaddir=./ kubelet kubeadm kubectl

# 卸载旧版本
yum remove -y kubelet kubeadm kubectl

# 进入rpm包所在目录，执行安装命令
yum install *.rpm
```

下载的rpm包共10个，如图所示：
![下载截图](/img/blogs/2021/08/k8s-rpm.png)

### 其余操作
``` shell
crictl config runtime-endpoint /run/containerd/containerd.sock

# 重启 docker，并启动 kubelet
systemctl daemon-reload
systemctl enable kubelet && systemctl start kubelet

containerd --version
kubelet --version
```

::: warning WARNING
如果此时执行 systemctl status kubelet 命令，将得到 kubelet 启动失败的错误提示，请忽略此错误，因为必须完成后续步骤中 kubeadm init 的操作，kubelet 才能正常启动
:::

## 初始化master节点
::: danger 关于初始化时用到的环境变量
* APISERVER_NAME 不能是 master 的 hostname
* APISERVER_NAME 必须全为小写字母、数字、小数点，不能包含减号
* POD_SUBNET 所使用的网段不能与 master节点/worker节点 所在的网段重叠。该字段的取值为一个 CIDR 值，如果您对 CIDR 这个概念还不熟悉，请仍然执行 export POD_SUBNET=10.100.0.0/16 命令，不做修改
:::

``` shell
# 只在 master 节点执行
# 替换 x.x.x.x 为 master 节点的内网IP
# export 命令只在当前 shell 会话中有效，开启新的 shell 窗口后，如果要继续安装过程，请重新执行此处的 export 命令
export MASTER_IP=x.x.x.x
# 替换 apiserver.demo 为 您想要的 dnsName
export APISERVER_NAME=apiserver.demo
# Kubernetes 容器组所在的网段，该网段安装完成后，由 kubernetes 创建，事先并不存在于您的物理网络中
export POD_SUBNET=10.100.0.0/16
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts
```

<font color="#dd0000">
请将脚本第21行的 ${1} 替换成您需要的版本号，例如 1.22.0  
若为离线安装，31行的版本号修改为需要的coredns镜像版本号
</font>

创建一个脚本文件，内容如下：
``` shell
#!/bin/bash

# 只在 master 节点执行

# 脚本出错时终止执行
set -e

if [ ${#POD_SUBNET} -eq 0 ] || [ ${#APISERVER_NAME} -eq 0 ]; then
  echo -e "\033[31;1m请确保您已经设置了环境变量 POD_SUBNET 和 APISERVER_NAME \033[0m"
  echo 当前POD_SUBNET=$POD_SUBNET
  echo 当前APISERVER_NAME=$APISERVER_NAME
  exit 1
fi

# 查看完整配置选项 https://godoc.org/k8s.io/kubernetes/cmd/kubeadm/app/apis/kubeadm/v1beta2
rm -f ./kubeadm-config.yaml
cat <<EOF > ./kubeadm-config.yaml
---
apiVersion: kubeadm.k8s.io/v1beta2
kind: ClusterConfiguration
kubernetesVersion: v${1}
imageRepository: registry.aliyuncs.com/k8sxio
controlPlaneEndpoint: "${APISERVER_NAME}:6443"
networking:
  serviceSubnet: "10.96.0.0/16"
  podSubnet: "${POD_SUBNET}"
  dnsDomain: "cluster.local"
dns:
  type: CoreDNS
  imageRepository: registry.aliyuncs.com/k8sxio
  imageTag: 1.8.4

---
apiVersion: kubelet.config.k8s.io/v1beta1
kind: KubeletConfiguration
cgroupDriver: systemd
EOF

# kubeadm init
# 根据您服务器网速的情况，您需要等候 3 - 10 分钟
echo ""

# 抓取镜像步骤可忽略，离线安装方式必须忽略
echo "抓取镜像，请稍候..."
# kubeadm config images pull --config=kubeadm-config.yaml

echo ""
echo "初始化 Master 节点"
kubeadm init --config=kubeadm-config.yaml --upload-certs

# 配置 kubectl
rm -rf /root/.kube/
mkdir /root/.kube/
cp -i /etc/kubernetes/admin.conf /root/.kube/config
```

### 在线安装
执行上述脚本文件即可

### 离线安装
由于离线，无法从镜像仓库获取所需要的镜像，故需要先从本地将镜像下载下来并导入到服务器的docker中，再执行脚本。
1. 获取所需要镜像及版本名称
``` shell
kubeadm config images list
```
所需镜像列表如下：  
![镜像列表](/img/blogs/2021/08/k8s-master-init-images.png)

2. 在本地将镜像pull下来
* 版本需要续上一步操作查询出来的版本对应
* 上一步查询的镜像源`k8s.grc.io`由于在国外，无法直接下载，故我们替换为国内镜像源`registry.cn-hangzhou.aliyuncs.com/google_containers`
``` shell
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-apiserver:v1.22.0
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-controller-manager:v1.22.0
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-scheduler:v1.22.0
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/kube-proxy:v1.22.0
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/pause:3.5
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/etcd:3.5.0-0
docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/coredns:1.8.4
```

3. 将镜像导出为tar包，上传至服务器，并导入
``` shell
# 根据镜像名或镜像id将镜像导出到本地，格式为tar
docker save 镜像ID > 名称.tar

# 在服务器上将镜像导入docker
docker load < 名称.tar
```

4. 修改镜像名称与标签  
导入的镜像仓库名与tag需要与之前步骤中查询所需镜像名称与tag一致，同时所属库需修改为脚本中配置的，本教程为`registry.aliyuncs.com/k8sxio`
``` shell
# 修改镜像名称与tag
# 如 docker tag 838d692cbe28 registry.aliyuncs.com/k8sxio/kube-apiserver:v1.22.0
docker tag 镜像id 镜像名称:tag

# 删除多余或无用镜像
# 如 docker rmi 838d692cbe28 或 docker rmi registry.aliyuncs.com/k8sxio/kube-apiserver:v1.22.0
docker rmi 镜像id/镜像仓库名

# 导入并修改完成后查看当前本地镜像列表
docker images
```
导入完成后，查询结果如图：  
![镜像列表](/img/blogs/2021/08/docker-images-list.png)

5. 执行上述脚本文件对master进行初始化
此时执行，发现本地有所需要的镜像，就不会从网上pull了。

初始化成功后会看到如下信息，请保存好，后续步骤中会用到  
![镜像列表](/img/blogs/2021/08/k8s-master-init-result.png)

### 检查master初始化结果
::: warning
`coredns` 将处于启动失败的状态，请继续下一步，完成 [安装网络插件](#install-network-plugin "安装网络插件") 这个步骤后，coredns 将正常启动。
:::

``` shell
# 只在 master 节点执行

# 执行如下命令，等待 3-10 分钟，直到所有的容器组处于 Running 状态
watch kubectl get pod -n kube-system -o wide

# 查看 master 节点初始化结果
kubectl get nodes -o wide
```

<span id="install-network-plugin"/>

## 安装网络插件
Calico是一个纯三层网络，通过linux 内核的L3 forwarding来实现vRouter功能，区别于fannel等需要封包解包的网络协议。
### 下载Calico镜像
若可联网，可直接从线上pull镜像，离线环境下，需先下载到本地，再上传至服务器。
``` shell
docker pull calico/node:v3.20.0 
docker pull calico/cni:v3.20.0
```

### 安装Calico
``` shell
# 新版的calico已将rbac配置信息整合在calico.yaml中
# 在线环境直接执行curl获取calico.yaml，离线环境需要在本地访问此地址下载并上传至服务器，再执行后续操作
curl https://docs.projectcalico.org/v3.20/manifests/calico.yaml -O

export POD_SUBNET="10.100.0.0/16" 
sed -i -e "s?192.168.0.0/16?$POD_SUBNET?g" calico.yaml
sed -i -e "s?typha_service_name: \"none\"?typha_service_name: \"calico-typha\"?g" calico.yaml
sed -i -e "s?replicas: 1?replicas: 2?g" calico.yaml

kubectl apply -f calico.yaml
```

###  确认Calico安装情况
``` shell
kubectl get pods --all-namespaces
kubectl get nodes
```

## 初始化worker节点
### 获得 join命令参数
**在 master 节点上执行**
``` shell
# 只在 master 节点执行
kubeadm token create --print-join-command
```

可获取kubeadm join 命令及参数，如下所示
``` shell
# kubeadm token create 命令的输出
kubeadm join apiserver.demo:6443 --token mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303
```

::: tip 有效时间
该 token 的有效时间为 2 个小时，2小时内，您可以使用此 token 初始化任意数量的 worker 节点。
:::

### 初始化worker
**针对所有的 worker 节点执行**
``` shell
# 只在 worker 节点执行
# 替换 x.x.x.x 为 master 节点的内网 IP
export MASTER_IP=x.x.x.x
# 替换 apiserver.demo 为初始化 master 节点时所使用的 APISERVER_NAME
export APISERVER_NAME=apiserver.demo
echo "${MASTER_IP}    ${APISERVER_NAME}" >> /etc/hosts

# 替换为 master 节点上 kubeadm token create 命令的输出
kubeadm join apiserver.demo:6443 --token mpfjma.4vjjg8flqihor4vt     --discovery-token-ca-cert-hash sha256:6f7a8e40a810323672de5eee6f4d19aa2dbdb38411845a1bf5dd63485c43d303
```

### 检查初始化结果
**在master节点上执行**
``` shell
# 只在 master 节点执行
kubectl get nodes -o wide
```

输出结果如下所示：  
![镜像列表](/img/blogs/2021/08/k8s-work-init-result.png)


至此，Kubernetes（单Master节点）就安装完成了

## 参考
<https://kuboard.cn/install/install-k8s.html>
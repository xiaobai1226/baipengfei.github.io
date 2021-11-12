(window.webpackJsonp=window.webpackJsonp||[]).push([[49],{541:function(s,a,e){"use strict";e.r(a);var r=e(6),t=Object(r.a)({},(function(){var s=this,a=s.$createElement,e=s._self._c||a;return e("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[e("div",{staticClass:"custom-block tip"},[e("p",{staticClass:"title"}),e("p",[s._v("其他方式安装Harbar：\n"),e("RouterLink",{attrs:{to:"/blogs/docker/2021/08/docker-compose-install-harbor.html"}},[s._v("使用docker-compose安装Harbor")])],1)]),e("h2",{attrs:{id:"harbor介绍"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#harbor介绍"}},[s._v("#")]),s._v(" Harbor介绍")]),s._v(" "),e("p",[s._v("  Harbor，是一个英文单词，意思是港湾，港湾是干什么的呢，就是停放货物的，而货物呢，是装在集装箱中的，说到集装箱，就不得不提到Docker容器，因为docker容器的技术正是借鉴了集装箱的原理。所以，Harbor正是一个用于存储Docker镜像的企业级Registry服务。"),e("br"),s._v("\n  Docker容器应用的开发和运行离不开可靠的镜像管理，虽然Docker官方也提供了公共的镜像仓库，但是从安全和效率等方面考虑，部署我们私有环境内的Registry也是非常必要的。Harbor是由VMware公司开源的企业级的Docker Registry管理项目，它包括权限管理(RBAC)、LDAP、日志审核、管理界面、自我注册、镜像复制和中文支持等功能。")]),s._v(" "),e("h2",{attrs:{id:"前期准备"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#前期准备"}},[s._v("#")]),s._v(" 前期准备")]),s._v(" "),e("ol",[e("li",[s._v("安装Helm")]),s._v(" "),e("li",[s._v("安装k8s")]),s._v(" "),e("li",[s._v("安装cpeh")])]),s._v(" "),e("h2",{attrs:{id:"安装harbor"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#安装harbor"}},[s._v("#")]),s._v(" 安装Harbor")]),s._v(" "),e("ol",[e("li",[s._v("添加 Harbor 仓库：")])]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 增加Harbor源")]),s._v("\nhelm repo "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("add")]),s._v(" harbor https://helm.goharbor.io\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 更新Helm")]),s._v("\nhelm repo update\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br")])]),e("ol",{attrs:{start:"2"}},[e("li",[s._v("搜索可用的Harbor版本")])]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("helm search repo harbor/harbor\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("可以看到如下结果："),e("br"),s._v(" "),e("img",{attrs:{src:"/img/blogs/2021/11/helm-search-harbor.png",alt:"文件截图"}})]),s._v(" "),e("ol",{attrs:{start:"3"}},[e("li",[s._v("将Harbor的chart包下载到本地")])]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("helm fetch harbor/harbor\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("ol",{attrs:{start:"4"}},[e("li",[s._v("解压文件")])]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 解压文件")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("tar")]),s._v(" xvf harbor-1.8.0.tgz\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 解压完成后进入目录")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v("cd")]),s._v(" harbor\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br")])]),e("ol",{attrs:{start:"5"}},[e("li",[s._v("按需修改配置文件"),e("br"),s._v("\n  修改配置文件 values.yaml，具体查看GitHub上面的配置列表"),e("a",{attrs:{href:"https://github.com/goharbor/harbor-helm/blob/master/README.md#configuration",target:"_blank",rel:"noopener noreferrer"}},[s._v("Configuration"),e("OutboundLink")],1),s._v("。"),e("br"),s._v("\n  value.yml文件是最全的配置文件，如果这个那么细致定制化需求，可以按需创建自己的配置，这里创建了my_value.conf，内容如下：")])]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("expose:\n  "),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 类型修改为nodePort模式，默认为ingress模式，按需修改即可")]),s._v("\n  type: nodePort\n  tls:\n    "),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 关闭tls验证")]),s._v("\n    enabled: "),e("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v("\n  nodePort:\n    ports:\n      http:\n        nodePort: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("30002")]),s._v("\n      https:\n        nodePort: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("30003")]),s._v("\n      notary:\n        nodePort: "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("30004")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 访问路径")]),s._v("\nexternalURL: http://10.169.136.38:30002\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 存储挂载设置")]),s._v("\npersistence:\n  persistentVolumeClaim:\n    registry:\n      storageClass: "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rook-cephfs"')]),s._v("\n    chartmuseum:\n      storageClass: "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rook-cephfs"')]),s._v("\n    jobservice:\n      storageClass: "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rook-cephfs"')]),s._v("\n    database:\n      storageClass: "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rook-cephfs"')]),s._v("\n    redis:\n      storageClass: "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rook-cephfs"')]),s._v("\n    trivy:\n      storageClass: "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"rook-cephfs"')]),s._v("\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br"),e("span",{staticClass:"line-number"},[s._v("9")]),e("br"),e("span",{staticClass:"line-number"},[s._v("10")]),e("br"),e("span",{staticClass:"line-number"},[s._v("11")]),e("br"),e("span",{staticClass:"line-number"},[s._v("12")]),e("br"),e("span",{staticClass:"line-number"},[s._v("13")]),e("br"),e("span",{staticClass:"line-number"},[s._v("14")]),e("br"),e("span",{staticClass:"line-number"},[s._v("15")]),e("br"),e("span",{staticClass:"line-number"},[s._v("16")]),e("br"),e("span",{staticClass:"line-number"},[s._v("17")]),e("br"),e("span",{staticClass:"line-number"},[s._v("18")]),e("br"),e("span",{staticClass:"line-number"},[s._v("19")]),e("br"),e("span",{staticClass:"line-number"},[s._v("20")]),e("br"),e("span",{staticClass:"line-number"},[s._v("21")]),e("br"),e("span",{staticClass:"line-number"},[s._v("22")]),e("br"),e("span",{staticClass:"line-number"},[s._v("23")]),e("br"),e("span",{staticClass:"line-number"},[s._v("24")]),e("br"),e("span",{staticClass:"line-number"},[s._v("25")]),e("br"),e("span",{staticClass:"line-number"},[s._v("26")]),e("br"),e("span",{staticClass:"line-number"},[s._v("27")]),e("br"),e("span",{staticClass:"line-number"},[s._v("28")]),e("br"),e("span",{staticClass:"line-number"},[s._v("29")]),e("br"),e("span",{staticClass:"line-number"},[s._v("30")]),e("br"),e("span",{staticClass:"line-number"},[s._v("31")]),e("br")])]),e("p",[s._v("其中"),e("code",[s._v("nis-rook-cephfs")]),s._v("是预先创建好的storageClass")]),s._v(" "),e("ol",{attrs:{start:"6"}},[e("li",[s._v("部署Harbor")])]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("helm "),e("span",{pre:!0,attrs:{class:"token function"}},[s._v("install")]),s._v(" harbor ./ -f my_value.yaml --namespace harbor\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("p",[s._v("此时就已安装完成了")]),s._v(" "),e("h2",{attrs:{id:"登录"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#登录"}},[s._v("#")]),s._v(" 登录")]),s._v(" "),e("p",[s._v("默认用户名是admin，密码是Harbor12345。")]),s._v(" "),e("h3",{attrs:{id:"页面登录"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#页面登录"}},[s._v("#")]),s._v(" 页面登录")]),s._v(" "),e("p",[s._v("根据配置中的地址，"),e("code",[s._v("http://10.100.159.128:30002")]),s._v("即可登录web管理页面进行使用。")]),s._v(" "),e("h3",{attrs:{id:"命令登录"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#命令登录"}},[s._v("#")]),s._v(" 命令登录")]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[s._v("docker login -u admin -p "),e("span",{pre:!0,attrs:{class:"token string"}},[s._v("'密码'")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token number"}},[s._v("10.169")]),s._v(".136.38:30002\n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br")])]),e("h2",{attrs:{id:"修改docker配置"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#修改docker配置"}},[s._v("#")]),s._v(" 修改docker配置")]),s._v(" "),e("p",[s._v("  由于Docker自从 1.3.x之后，docker registry 交互默认使用的是HTTPS，而我们搭建的 Harbor 使用的是HTTP，所以为了避免 pull/push 镜像时得到错误："),e("code",[s._v("http: server gave HTTP response to HTTPS client")]),s._v("，需要修改 docker 的配置文件 /etc/docker/daemon.json，加入以下配置：")]),s._v(" "),e("div",{staticClass:"language-shell line-numbers-mode"},[e("pre",{pre:!0,attrs:{class:"language-shell"}},[e("code",[e("span",{pre:!0,attrs:{class:"token function"}},[s._v("vim")]),s._v(" /etc/docker/daemon.json\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 在json中增加如下配置")]),s._v("\n"),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"insecure-registries"')]),e("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),e("span",{pre:!0,attrs:{class:"token string"}},[s._v('"10.169.136.38:30002"')]),e("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),e("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 重启Docker服务")]),s._v("\nsystemctl daemon-reload\nsystemctl restart docker \n")])]),s._v(" "),e("div",{staticClass:"line-numbers-wrapper"},[e("span",{staticClass:"line-number"},[s._v("1")]),e("br"),e("span",{staticClass:"line-number"},[s._v("2")]),e("br"),e("span",{staticClass:"line-number"},[s._v("3")]),e("br"),e("span",{staticClass:"line-number"},[s._v("4")]),e("br"),e("span",{staticClass:"line-number"},[s._v("5")]),e("br"),e("span",{staticClass:"line-number"},[s._v("6")]),e("br"),e("span",{staticClass:"line-number"},[s._v("7")]),e("br"),e("span",{staticClass:"line-number"},[s._v("8")]),e("br")])]),e("h2",{attrs:{id:"参考"}},[e("a",{staticClass:"header-anchor",attrs:{href:"#参考"}},[s._v("#")]),s._v(" 参考")]),s._v(" "),e("p",[e("a",{attrs:{href:"http://kpali.me/2020/05/13/deploy-harbor-in-kubernetes.html",target:"_blank",rel:"noopener noreferrer"}},[s._v("http://kpali.me/2020/05/13/deploy-harbor-in-kubernetes.html"),e("OutboundLink")],1)])])}),[],!1,null,null,null);a.default=t.exports}}]);
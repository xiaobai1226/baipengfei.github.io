(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{534:function(s,a,t){"use strict";t.r(a);var n=t(6),e=Object(n.a)({},(function(){var s=this,a=s.$createElement,t=s._self._c||a;return t("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[t("div",{staticClass:"custom-block tip"},[t("p",{staticClass:"title"}),t("p",[s._v("其他方式安装Harbar：\n"),t("RouterLink",{attrs:{to:"/blogs/kubernetes/2021/11/k8s-helm-install-harbor.html"}},[s._v("使用Helm安装Harbor")])],1)]),t("h2",{attrs:{id:"harbor介绍"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#harbor介绍"}},[s._v("#")]),s._v(" Harbor介绍")]),s._v(" "),t("p",[s._v("  Harbor，是一个英文单词，意思是港湾，港湾是干什么的呢，就是停放货物的，而货物呢，是装在集装箱中的，说到集装箱，就不得不提到Docker容器，因为docker容器的技术正是借鉴了集装箱的原理。所以，Harbor正是一个用于存储Docker镜像的企业级Registry服务。"),t("br"),s._v("\n  Docker容器应用的开发和运行离不开可靠的镜像管理，虽然Docker官方也提供了公共的镜像仓库，但是从安全和效率等方面考虑，部署我们私有环境内的Registry也是非常必要的。Harbor是由VMware公司开源的企业级的Docker Registry管理项目，它包括权限管理(RBAC)、LDAP、日志审核、管理界面、自我注册、镜像复制和中文支持等功能。")]),s._v(" "),t("h2",{attrs:{id:"安装"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#安装"}},[s._v("#")]),s._v(" 安装")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 获取安装包")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("wget")]),s._v(" https://github.com/goharbor/harbor/releases/download/v2.3.2/harbor-offline-installer-v2.3.2.tgz\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 解压安装包")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("tar")]),s._v(" xvf harbor-offline-installer-v2.3.2.tgz\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br")])]),t("p",[s._v("解压完成后，可以看到如下文件："),t("br"),s._v(" "),t("img",{attrs:{src:"/img/blogs/2021/08/harbor-tar-file.png",alt:"文件截图"}})]),s._v(" "),t("p",[s._v("其中有harbor.yml.tmpl文件，将其复制出来重命名为harbor.yml，并修改其中的内容")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("## Configuration file of Harbor")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# hostname设置访问地址，可以使用ip、域名，不可以设置为127.0.0.1或localhost")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token function"}},[s._v("hostname")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("10.100")]),s._v(".159.128\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 访问协议，默认是http，也可以设置https，如果设置https，则nginx ssl需要设置on")]),s._v("\nui_url_protocol "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" http\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# mysql数据库root用户默认密码root123，实际使用时修改下")]),s._v("\ndb_password "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" root123\n\nmax_job_workers "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("3")]),s._v(" \ncustomize_crt "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" on\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# https相关不用可以不设置")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ssl_cert = /data/cert/server.crt")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# ssl_cert_key = /data/cert/server.key")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# secretkey_path = /data")]),s._v("\nadmiral_url "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" NA\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 邮件设置，发送重置密码邮件时使用")]),s._v("\nemail_identity "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" \nemail_server "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" smtp.mydomain.com\nemail_server_port "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("25")]),s._v("\nemail_username "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" sample_admin@mydomain.com\nemail_password "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" abc\nemail_from "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" admin "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("<")]),s._v("sample_admin@mydomain.com"),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v(">")]),s._v("\nemail_ssl "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token boolean"}},[s._v("false")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 启动Harbor后，管理员UI登录的密码，默认是Harbor12345")]),s._v("\nharbor_admin_password "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" Harbor12345\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 认证方式，这里支持多种认证方式，如LADP、本次存储、数据库认证。默认是db_auth，mysql数据库认证")]),s._v("\nauth_mode "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" db_auth\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# LDAP认证时配置项")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_url = ldaps://ldap.mydomain.com")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_searchdn = uid=searchuser,ou=people,dc=mydomain,dc=com")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_search_pwd = password")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_basedn = ou=people,dc=mydomain,dc=com")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_filter = (objectClass=person)")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_uid = uid ")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_scope = 3 ")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("#ldap_timeout = 5")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 是否开启自注册")]),s._v("\nself_registration "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" on\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# Token有效时间，默认30分钟")]),s._v("\ntoken_expiration "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("30")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 用户创建项目权限控制，默认是everyone（所有人），也可以设置为adminonly（只能管理员）")]),s._v("\nproject_creation_restriction "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" everyone\n\nverify_remote_cert "),t("span",{pre:!0,attrs:{class:"token operator"}},[s._v("=")]),s._v(" on\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br"),t("span",{staticClass:"line-number"},[s._v("9")]),t("br"),t("span",{staticClass:"line-number"},[s._v("10")]),t("br"),t("span",{staticClass:"line-number"},[s._v("11")]),t("br"),t("span",{staticClass:"line-number"},[s._v("12")]),t("br"),t("span",{staticClass:"line-number"},[s._v("13")]),t("br"),t("span",{staticClass:"line-number"},[s._v("14")]),t("br"),t("span",{staticClass:"line-number"},[s._v("15")]),t("br"),t("span",{staticClass:"line-number"},[s._v("16")]),t("br"),t("span",{staticClass:"line-number"},[s._v("17")]),t("br"),t("span",{staticClass:"line-number"},[s._v("18")]),t("br"),t("span",{staticClass:"line-number"},[s._v("19")]),t("br"),t("span",{staticClass:"line-number"},[s._v("20")]),t("br"),t("span",{staticClass:"line-number"},[s._v("21")]),t("br"),t("span",{staticClass:"line-number"},[s._v("22")]),t("br"),t("span",{staticClass:"line-number"},[s._v("23")]),t("br"),t("span",{staticClass:"line-number"},[s._v("24")]),t("br"),t("span",{staticClass:"line-number"},[s._v("25")]),t("br"),t("span",{staticClass:"line-number"},[s._v("26")]),t("br"),t("span",{staticClass:"line-number"},[s._v("27")]),t("br"),t("span",{staticClass:"line-number"},[s._v("28")]),t("br"),t("span",{staticClass:"line-number"},[s._v("29")]),t("br"),t("span",{staticClass:"line-number"},[s._v("30")]),t("br"),t("span",{staticClass:"line-number"},[s._v("31")]),t("br"),t("span",{staticClass:"line-number"},[s._v("32")]),t("br"),t("span",{staticClass:"line-number"},[s._v("33")]),t("br"),t("span",{staticClass:"line-number"},[s._v("34")]),t("br"),t("span",{staticClass:"line-number"},[s._v("35")]),t("br"),t("span",{staticClass:"line-number"},[s._v("36")]),t("br"),t("span",{staticClass:"line-number"},[s._v("37")]),t("br"),t("span",{staticClass:"line-number"},[s._v("38")]),t("br"),t("span",{staticClass:"line-number"},[s._v("39")]),t("br"),t("span",{staticClass:"line-number"},[s._v("40")]),t("br"),t("span",{staticClass:"line-number"},[s._v("41")]),t("br"),t("span",{staticClass:"line-number"},[s._v("42")]),t("br"),t("span",{staticClass:"line-number"},[s._v("43")]),t("br"),t("span",{staticClass:"line-number"},[s._v("44")]),t("br"),t("span",{staticClass:"line-number"},[s._v("45")]),t("br"),t("span",{staticClass:"line-number"},[s._v("46")]),t("br"),t("span",{staticClass:"line-number"},[s._v("47")]),t("br"),t("span",{staticClass:"line-number"},[s._v("48")]),t("br"),t("span",{staticClass:"line-number"},[s._v("49")]),t("br"),t("span",{staticClass:"line-number"},[s._v("50")]),t("br"),t("span",{staticClass:"line-number"},[s._v("51")]),t("br"),t("span",{staticClass:"line-number"},[s._v("52")]),t("br"),t("span",{staticClass:"line-number"},[s._v("53")]),t("br"),t("span",{staticClass:"line-number"},[s._v("54")]),t("br")])]),t("p",[s._v("修改完配置文件后，分别执行prepare文件与install.sh。")]),s._v(" "),t("h2",{attrs:{id:"修改docker配置"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#修改docker配置"}},[s._v("#")]),s._v(" 修改docker配置")]),s._v(" "),t("p",[s._v("  由于Docker自从 1.3.x之后，docker registry 交互默认使用的是HTTPS，而我们搭建的 Harbor 使用的是HTTP，所以为了避免 pull/push 镜像时得到错误："),t("code",[s._v("http: server gave HTTP response to HTTPS client")]),s._v("，需要修改 docker 的配置文件 /etc/docker/daemon.json，加入以下配置：\n修改/etc/docker/daemon.json")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[t("span",{pre:!0,attrs:{class:"token function"}},[s._v("vim")]),s._v(" /etc/docker/daemon.json\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 在json中增加如下配置")]),s._v("\n"),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"insecure-registries"')]),t("span",{pre:!0,attrs:{class:"token builtin class-name"}},[s._v(":")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("[")]),t("span",{pre:!0,attrs:{class:"token string"}},[s._v('"10.169.136.38:10082"')]),t("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("]")]),s._v("\n\n"),t("span",{pre:!0,attrs:{class:"token comment"}},[s._v("# 重启Docker服务")]),s._v("\nsystemctl daemon-reload\nsystemctl restart docker \n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br"),t("span",{staticClass:"line-number"},[s._v("2")]),t("br"),t("span",{staticClass:"line-number"},[s._v("3")]),t("br"),t("span",{staticClass:"line-number"},[s._v("4")]),t("br"),t("span",{staticClass:"line-number"},[s._v("5")]),t("br"),t("span",{staticClass:"line-number"},[s._v("6")]),t("br"),t("span",{staticClass:"line-number"},[s._v("7")]),t("br"),t("span",{staticClass:"line-number"},[s._v("8")]),t("br")])]),t("p",[s._v("此时就已安装完成了")]),s._v(" "),t("h2",{attrs:{id:"登录"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#登录"}},[s._v("#")]),s._v(" 登录")]),s._v(" "),t("h3",{attrs:{id:"页面登录"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#页面登录"}},[s._v("#")]),s._v(" 页面登录")]),s._v(" "),t("p",[s._v("根据配置中的地址，http://10.100.159.128:10082即可登录web管理页面进行使用。")]),s._v(" "),t("h3",{attrs:{id:"命令登录"}},[t("a",{staticClass:"header-anchor",attrs:{href:"#命令登录"}},[s._v("#")]),s._v(" 命令登录")]),s._v(" "),t("div",{staticClass:"language-shell line-numbers-mode"},[t("pre",{pre:!0,attrs:{class:"language-shell"}},[t("code",[s._v("docker login -u admin -p "),t("span",{pre:!0,attrs:{class:"token string"}},[s._v("'密码'")]),s._v(" "),t("span",{pre:!0,attrs:{class:"token number"}},[s._v("10.169")]),s._v(".136.38:10082\n")])]),s._v(" "),t("div",{staticClass:"line-numbers-wrapper"},[t("span",{staticClass:"line-number"},[s._v("1")]),t("br")])])])}),[],!1,null,null,null);a.default=e.exports}}]);
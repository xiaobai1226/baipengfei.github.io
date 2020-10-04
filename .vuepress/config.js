module.exports = {
    // 博客title
    "title": "小白の生活馆",
    // 博客介绍
    "description": "小白の生活馆",
    // vuepress 打包后的位置
    "dest": "dist",
    "head": [
        [
            "link",
            {
                "rel": "icon",
                "href": "/img/avatar.jpeg"
            }
        ],
        [
            "meta",
            {
                "name": "viewport",
                "content": "width=device-width,initial-scale=1,user-scalable=no"
            }
        ]
    ],
    "theme": "reco",
    locales: {
        '/': {
            lang: 'zh-CN'
        }
    },
    "themeConfig": {
        // 导航栏
        "nav": [
            {
                "text": "首页",
                "link": "/",
                "icon": "reco-home"
            },
            {
                "text": "时间轴",
                "link": "/timeline/",
                "icon": "reco-date"
            },
            // {
            //     "text": "Docs",
            //     "icon": "reco-message",
            //     "items": [
            //         {
            //             "text": "vuepress-reco",
            //             "link": "/docs/theme-reco/"
            //         }
            //     ]
            // },
            {
                "text": "关于",
                "icon": "reco-message",
                "items": [
                    {
                        "text": "GitHub",
                        "link": "https://github.com/xiaobai1226",
                        "icon": "reco-github"
                    },
                    {
                        "text": "码云",
                        "link": "https://gitee.com/xiaobai1226",
                        "icon": "reco-mayun"
                    },
                    {
                        "text": "WeChat",
                        "link": "https://github.com/xiaobai1226",
                        "icon": "reco-wechat"
                    }
                ]
            }
        ],
        //在所有页面中启用自动生成子侧边栏，原 sidebar 仍然兼容
        subSidebar: 'auto',
        "type": "blog",
        // 博客配置
        "blogConfig": {
            "category": {
                // 在导航栏菜单中所占的位置，默认2
                "location": 2,
                // 默认文案 “分类”
                "text": "分类"
            },
            "tag": {
                // 在导航栏菜单中所占的位置，默认3
                "location": 3,
                // 默认文案 “标签”
                "text": "标签"
            }
        },
        // 友情链接
        "friendLink": [
            // {
            //     "title": "午后南杂",
            //     "desc": "Enjoy when you can, and endure when you must.",
            //     "email": "1156743527@qq.com",
            //     "link": "https://www.recoluan.com"
            // },
            // {
            //     "title": "vuepress-theme-reco",
            //     "desc": "A simple and beautiful vuepress Blog & Doc theme.",
            //     "avatar": "https://vuepress-theme-reco.recoluan.com/icon_vuepress_reco.png",
            //     "link": "https://vuepress-theme-reco.recoluan.com"
            // }
        ],
        // valine评论配置
        // valineConfig: {
            // appId: 'yqgiGcAriEWDtWkmELUbIiPB-gzGzoHsz',
            // appKey: 'CL0o5NJnuVckUK0sTMmSzmsb',
        // },
        // vssue评论配置
        vssueConfig: {
            platform: 'github',
            owner: 'xiaobai1226',
            repo: 'Blog',
            clientId: '86e3d6a6ce9c09f700d6',
            clientSecret: '680fdfe880cbc7ab25524290f530e79fecafa885',
        },
        // 导航栏logo
        "logo": "/img/avatar.jpeg",
        "search": true,
        "searchMaxSuggestions": 10,
        // 最后一次更新时间提示文字
        "lastUpdated": "Last Updated",
        // 全局作者名称
        "author": "高压锅里的小白",
        // 图像图片
        "authorAvatar": "/img/avatar.jpeg",
        // 备案号
        // "record": "xxxx",
        // 开始年份
        "startYear": "2020"
    },
    "markdown": {
        "lineNumbers": true
    }
}
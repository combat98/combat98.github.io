import mdItCustomAttrs from 'markdown-it-custom-attrs'
export default {
    title: '热爱',
    description: '只要学不死，就往死里学！',
    head: [
        ['link', {rel: 'icon', href: '/favicon.ico'}],
    ],
    markdown:{
        config: (md) => {
            md.use(mdItCustomAttrs, 'image', {
                'data-fancybox': 'gallery',
            })
        },
        codeCopyButtonTitle: '复制代码',
    },
    lastUpdated: true,
    ignoreDeadLinks: true,
    cleanUrls: false,
    themeConfig: {
        lastUpdatedText: "最近更新时间",
        siteTitle: '编程之路',
        logo: '/images/logo-mini.svg',
        outlineTitle: '导航目录',
        search: {
            provider: 'local',
            options: {
                translations: {
                    button: {
                        buttonText: '搜索文档',
                        buttonAriaLabel: '搜索文档',
                    },
                    modal: {
                        noResultsText: '无法找到相关结果',
                        resetButtonTitle: '清除查询条件',
                        displayDetails: '显示详细列表',
                        footer: {
                            navigateText: '切换',
                            selectText: '选择',
                            closeText: '关闭',
                        },
                    },
                },
            },
        },
        docFooter: {
            prev: '上一页',
            next: '下一页',
        },
        darkModeSwitchLabel: '外观',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        footer: {
            message: 'Released under the <a href="https://github.com/vuejs/vitepress/blob/main/LICENSE">MIT License</a>.',
            copyright: 'Copyright © 2019-present <a href="https://github.com/yyx990803">Evan You</a>'
        },

        /*侧边栏*/
        sidebar: {
        
        },
        /*导航栏*/
        nav: [
            {text: '首页', link: '/'},
            {
                text: 'Java',
                items: [
                    {
                        text: '🥦 JavaSE',
                        items: [
                            {
                                text: 'Java基础',
                                link: '/java/javase/index',
                            },
                            {
                                text: '面向对象',
                                link: '/java/javase/oop/index',
                            }
                        ],
                    },
                    {
                        text: '♥️ Java进阶',
                        items:[
                            {text: 'JUC', link: '/java/juc/index'},
                            {text: 'JVM', link: '/java/jvm/index'},
                        ]
                    },
                    {text: '🎁 Spring全家桶',
                        items: [
                            {
                                text: 'Spring',
                                link: '/java/spring/index',
                            },
                            {
                                text: 'SpringMVC',
                                link: '/java/springmvc/index',
                            },
                            {
                                text: 'SpringBoot',
                                link: '/java/springboot/index',
                            },
                            {
                                text: 'SpringSecurity',
                                link: '/java/springsecurity/index',
                            },
                             {
                                text: 'SpringData',
                                link: '/java/springdata/index',
                            },
                            {
                                text: 'SpringCloud',
                                link: '/java/springcloud/index',
                            },
                        ],},
                    {text: '🏠 框架',
                        items: [
                            {
                                text: 'Mybatis',
                                link: '/java/mybatis/index',
                            },
                        ],},
                ]
            },
            {
                text: '.NET',
                items: [
                    {
                        text: '🥦 C#基础',
                        items: [
                            {text: 'C#语言基础', link: '/dotnet/csharp/index'},
                            {text: '面向对象', link: '/dotnet/csharp/oop/index'},
                            {text: '异步编程', link: '/dotnet/csharp/async/index'},
                        ],
                    },
                    {
                        text: '♥️ ASP.NET Core',
                        items: [
                            {text: 'ASP.NET Core基础', link: '/dotnet/aspnetcore/index'},
                            {text: 'Web API', link: '/dotnet/aspnetcore/webapi/index'},
                            {text: 'MVC', link: '/dotnet/aspnetcore/mvc/index'},
                            {text: 'Blazor', link: '/dotnet/aspnetcore/blazor/index'},
                        ],
                    },
                    {
                        text: '🎁 ORM框架',
                        items: [
                            {text: 'Entity Framework Core', link: '/dotnet/ef/index'},
                            {text: 'Dapper', link: '/dotnet/dapper/index'},
                        ],
                    },
                    {
                        text: '🏠 桌面开发',
                        items: [
                            {text: 'WPF', link: '/dotnet/wpf/index'},
                            {text: 'WinForms', link: '/dotnet/winforms/index'},
                        ],
                    },
                ]
            },
            {
                text: 'BigFrontEnd',
                items: [
                    {
                        text: '🎁 基础以及提升篇',
                        items: [
                            {text: 'HTML', link: '/frontend/base/html/index'},
                            {text: 'CSS', link: '/frontend/base/css/index'},
                            {text: 'JavaScript', link: '/frontend/base/javascript/index'},
                            {text: 'TypeScript', link: '/frontend/base/typescript/index'},
                            {text: 'Node', link: '/frontend/server/node/index'}
                        ],
                    },
                    {
                        text: '🏠 主流框架',
                        items: [
                            {text: 'React', link: '/frontend/js/react/index'},
                            {text: 'Vue', link: '/frontend/js/vue/index'},
                            {text: 'NestJS', link: '/frontend/server/nest/index'},
                        ],
                    },
                    {
                        text: '♥️ 跨平台开发',
                        items: [
                            {text: 'uni-app', link: '/frontend/app/uniapp/index'},
                            {text: 'Flutter', link: '/frontend/app/flutter/index'},
                        ],
                    },
                ]
            },
            {
                text: 'DevOps',
                items: [
                    {text: 'Linux', link: '/devops/linux/index'},
                    {text: 'Docker', link: '/devops/docker/index'},
                    {text: 'Jenkins', link: '/devops/jenkins/index'},
                    {text: 'Kubernetes', link: '/devops/k8s/index'},
                ]
            },
            {
                text: 'Python',
                items: [
                    {
                        text: '🥦 Python基础',
                        items: [
                            {text: 'Python基础', link: '/python/base/index'},
                            {text: '面向对象', link: '/python/base/oop'},
                            {text: '多线程多进程', link: '/python/base/concurrent'},
                        ],
                    },
                    {
                        text: '♥️ 机器学习',
                        items: [
                            {text: 'NumPy', link: '/python/ml/numpy'},
                            {text: 'Pandas', link: '/python/ml/pandas'},
                            {text: 'Matplotlib', link: '/python/ml/matplotlib'},
                            {text: 'Scikit-learn', link: '/python/ml/sklearn'},
                        ],
                    },
                    {
                        text: '🎁 Web框架',
                        items: [
                            {text: 'Flask', link: '/python/web/flask'},
                            {text: 'Django', link: '/python/web/django'},
                            {text: 'FastAPI', link: '/python/web/fastapi'},
                        ],
                    },
                ]
            },
            {
                text: '编程语言',
                items: [
                    {
                        text: '🚀 新兴语言',
                        items: [
                            {text: 'Golang', link: '/golang/base/index'},
                            {text: 'Rust', link: '/rust/base/index'},
                            {text: 'Kotlin', link: '/kotlin/base/index'},
                        ],
                    },
                    {
                        text: '📚 传统语言',
                        items: [
                            {text: 'C++', link: '/cpp/base/index'},
                            {text: 'PHP', link: '/php/base/index'},
                        ],
                    },
                ]
            },
            {
                text: '计算机科学基础',
                items: [
                    {text: '数据结构与算法', link: '/program/dataStructure'},
                    {text: '设计模式', link: '/program/design'},
                    {text: '计算机网络', link: '/program/network'},
                    {text: '操作系统', link: '/program/os'},
                ]
            },
            {
                text: '后端技术栈',
                items: [
                    {
                        text: '🗄️ 关系型数据库',
                        items: [
                            {text: 'MySQL', link: '/database/SQL/mysql'},
                            {text: 'PostgreSQL', link: '/database/SQL/PostgresSQL'},
                            {text: 'SQL Server', link: '/database/SQL/SQLServer'},
                            {text: 'Oracle', link: '/database/SQL/Oracle'},
                        ],
                    },
                    {
                        text: '📦 非关系型数据库',
                        items: [
                            {text: 'Redis', link: '/database/NoSQL/Redis'},
                            {text: 'Elasticsearch', link: '/database/NoSQL/Elasticsearch'},
                            {text: 'MongoDB', link: '/database/NoSQL/MongoDB'},
                        ],
                    },
                    {
                        text: '📨 消息中间件',
                        items: [
                            {text: 'RabbitMQ', link: '/middleware/message/rabbit'},
                            {text: 'Kafka', link: '/middleware/message/kafka'},
                            {text: 'RocketMQ', link: '/middleware/message/rocket'},
                        ],
                    },
                    {
                        text: '🔧 数据库中间件',
                        items: [
                            {text: 'Mycat', link: '/middleware/database/Mycat'},
                            {text: 'ShardingSphere', link: '/middleware/database/ShardingSphere'},
                        ],
                    },
                ]
            },
            {
                text: '工具',
                items: [
                    {
                        text: '🥦 开发工具',
                        items: [
                            {text: 'VS Code', link: '/tool/vscode/index'},
                            {text: 'JetBrains IDE', link: '/tool/jetbrains/index'},
                            {text: 'Visual Studio', link: '/tool/visualstudio/index'},
                            {text: 'Git', link: '/tool/git/index'},
                        ],
                    },
                ]
            }


        ]
    }

}

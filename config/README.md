Taro 项目的编译配置目录
https://taro-docs.jd.com/taro/docs/config-detail

prod.js
生产环境配置
uat.js
客户验收环境配置
test.js
开发环境配置

通常小程序的开发阶段和交付阶段使用的是不同的 appid
为保留本地开发工具中的配置，且切换环境时不触发 git 文件修改
project.config.json 将被 gitignore 忽略
appid 将根据命令动态写入 project.config.json
旨在帮助开发者快速切换环境，减少需要需配置的文件

具体命令参考根目录 readme

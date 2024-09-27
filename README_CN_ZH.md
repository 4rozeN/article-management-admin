# article-management-admin

[English](https://github.com/4rozeN/article-management-admin)|[简体中文](https://github.com/4rozeN/article-management-admin/blob/main/README_CN_ZH.md)

`article-management-admin`是一个以Vue3+Strapi5搭建而成的文章后台管理系统。主要包括了：注册登录、文章分类添加、文章管理和预览、用户头像更新等功能。

> 前端涉及：Vue3、vite、Pinia、Element-Plus、sass、wangEditor、vue-cropperjs、dayjs等
>
> 后端接口数据构建：Strapi5、MySQL8、STMP、nodemailer
>
> 自动发信STMP：163邮箱
>
> 接口测试工具：Apifox2.6.17
>
> 系统：Windows11

# 这是一个什么项目？

`article-management-admin`是一个以Vue3+Strapi5搭建而成的文章后台管理系统。我以学习Vue3的初衷构建了这个项目，过程中出于对自行构建数据接口的兴趣，所以加入了Strapi5这个无头CMS内容管理平台来帮助我。如您所见，这个项目现在已经基本完成。

如果您网络状态良好，我推荐您查看下面的这个gif演示：

https://github.com/4rozeN/article-management-admin/blob/main/demo.gif

# 部署本项目

## clone项目

您首先要将本项目clone至本地并进行依赖安装

```bash
yarn install
```

再使用Strapi5创建项目，按照数据库设计将content创建。

> 在Strapi5后端数据过程中，由于要实现Strapi的STMP自动发信功能，所以我使用了我的个人信息进行测试，这些信息都包含在git管理的文件内，所以出于隐私原因，我不会将Strapi5项目公开。
>
> 不过，我会将数据库字段设计放在文末，您仍然可以尝试按照字段自行构建对应的数据表。

## 运行项目

如果您使用yarn作为包管理器，可以使用以下命令

```bash
yarn dev
```

## 打包项目

本地打包预览可以使用npm包serve做到，请使用npm全局安装

```bash
npm install --global serve
```

紧接着，您需要运行build命令来让vite进行打包

```bash
yarn build
```

待到编译完毕，您可以转到编译通过的dist目录下运行serve命令来进行预览

```bash
serve
```

您应当会看到

![image-20240928002930325](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280037536.png)

这就成功了，无需改动任何代码。

按下键盘的ctrl并鼠标左键点击该界面的地址，您将看到一个登录界面。如果您成功看到了该登录页面，说明所有的操作都是正确的。

> 请注意，使用该服务请勿刷新页面，刷新页面会使得项目找不到路径，触发404
>
> 所以更推荐执行yarn dev命令查看项目

如果登录页面无法发起网络请求，请检查您的后端数据是否配置正确。如果一切无误，项目应当运行的十分完美。

# 数据表设计

如上文所说，我将在此处写明该项目所涉及的三个数据表：

- Article

![image-20240928041644351](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280416409.png)

- ArticleCategory

![image-20240928041711138](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280417196.png)

- User

![image-20240928041741053](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280417163.png)



妥善运用Strapi的身份管理将帮助您更好的构建数据。


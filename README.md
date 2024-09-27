# article-management-admin

[English](https://github.com/4rozeN/article-management-admin) | [简体中文](https://github.com/4rozeN/article-management-admin/blob/main/README_CN_ZH.md)

`article-management-admin` is an article management system built with Vue 3 and Strapi 5. It includes key features like user registration and login, article categorization, article management and preview, user avatar updates, and more. 🚀📝

> **Frontend Tech Stack**: Vue 3, Vite, Pinia, Element-Plus, Sass, WangEditor, Vue CropperJS, Day.js, etc.
> **Backend**: Strapi 5, MySQL 8 
> **API Testing Tool**: Apifox 2.6.17 
> **System**: Windows 11 

# What is this article-management anyway?

`article-management-admin` is an article management system built using Vue 3 and Strapi 5. I initially created this project as a way to learn Vue 3, and along the way, out of interest in building my own data APIs, I integrated Strapi 5, a headless CMS platform, to help with content management. As you can see, the project is now mostly complete.

If your network connection is good, I recommend checking out the GIF demo of this project.

https://github.com/4rozeN/article-management-admin/blob/main/demo.gif

# How to Set Up This Project

## Clone the Project 🔗

First, you need to clone this project to your local machine and install the dependencies:

```bash
yarn install
```

Next, head over to my Strapi 5 project, clone it, and follow the setup instructions to deploy it. 📦

> During the development of the Strapi 5 backend, I needed to implement the SMTP automatic email sending feature. For testing purposes, I used my personal information, which is included in files managed by Git. Therefore, for privacy reasons, I will not be making the Strapi 5 project public.
>
> However, I will include the database schema design at the end of this document. You can still try to build the corresponding data tables based on the provided schema.

Alternatively, if you're passionate about exploring, feel free to take my project and database design to build it yourself.

## Run the Project 

If you're using Yarn as your package manager, you can run the project with this command:

```bash
yarn dev
```

## Build the Project 

To build and preview the project locally, you'll need the `serve` npm package. Install it globally:

```bash
npm install --global serve
```

Next, run the build command to package everything with Vite:

```bash
yarn build
```

Once the build is complete, head over to the compiled `dist` directory and run the `serve` command to preview the project:

```bash
serve
```

![image-20240928002930325](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280038002.png)

Press `Ctrl` on your keyboard and left-click 🖱️the URL in the address bar. You should see a login screen. 

If the login screen appears, that means everything is set up correctly! 🎉 

> Please note that when using this service, do not refresh the page, as refreshing will cause the project to lose its path and trigger a 404 error.
>
> Therefore, it is highly recommended to use the `yarn dev` command to view the project.

However, if the login page fails to make network requests, please double-check that your backend is properly configured. 🔧

If everything checks out, your project should be running perfectly! 🎉😊

# Database Schema Design

As mentioned earlier, I will outline the three database tables involved in this project below:

- Article

![image-20240928041644351](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280428119.png)

- ArticleCategory

![image-20240928041711138](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280429947.png)

- User

![image-20240928041741053](https://gitee.com/CSJ021005/f0ur_lin_-picgo/raw/master/202409280429257.png)

Effectively utilizing Strapi's identity management will help you build your data more efficiently.
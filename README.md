# 岛屿个人博客（React + Vite + Markdown）

一个动物森友会 / Animal Crossing 风格的个人静态博客模板，包含首页、文章页、下载页和关于页。首页还包含实时岛屿时间、按月份判断春夏秋冬、按小时判断早中晚、文章搜索、今日公告、小型钱包、岛民灵感、弹出式岛屿电台和海岸底部装饰等互动。

## 项目结构

```text
.
├── public/
│   ├── downloads/        # 下载资源文件
│   └── music/            # 背景音乐文件，后续把歌曲放这里
├── src/
│   ├── assets/          # 向上手势光标、footer sea 等装饰资源
│   ├── components/
│   │   └── Typewriter.jsx # animal-island-ui 风格打字机组件
│   ├── content/
│   │   ├── posts/        # 文章 Markdown
│   │   └── downloads/    # 下载页 Markdown
│   ├── App.jsx           # 页面路由、粘性导航、弹出电台、动态倾斜绑定
│   ├── pages/            # 首页、文章页、下载页、关于页
│   ├── lib/island.js     # 季节、早中晚和岛民提示数据
│   ├── content.js        # Markdown 读取与解析
│   ├── main.jsx          # React 入口
│   └── styles.css        # 岛屿风格样式、动态倾斜、光照、光标
├── index.html
├── package.json
└── vite.config.js        # GitHub Pages base 配置
```

## 本地运行

```bash
npm install
npm run dev
```

## 写文章

在 `src/content/posts` 新建 Markdown 文件：

```md
---
title: 标题
date: 2026-06-29
description: 简介
author: 你的名字
readingTime: 3 分钟
tags: [生活, 技术]
cover: 🐾
---

# 正文标题

这里写文章内容。
```

## 管理下载页

在 `public/downloads` 放真实文件，然后在 `src/content/downloads` 新建 Markdown：

```md
---
title: 资源名称
date: 2026-06-29
author: 你的名字
category: 模板资源
fileType: zip
description: 资源简介
file: /downloads/your-file.zip
buttonText: 下载资源
icon: 🎁
---

资源说明。
```

## 添加背景音乐

把歌曲放到 `public/music`，例如 `public/music/island-theme.mp3`。然后打开 `src/App.jsx`，修改：

```js
const MUSIC_PLAYLIST = ['/music/island-theme.mp3'];
```

浏览器可能会拦截自动播放，因此页面右下角也有音乐播放按钮。

## 部署到 GitHub Pages

1. 修改 `vite.config.js` 里的 `base` 为你的仓库名，例如：

```js
base: '/你的仓库名/'
```

2. 安装依赖并部署：

```bash
npm install
npm run deploy
```

也可以只构建静态文件：

```bash
npm run build
```

构建产物会输出到 `dist/`。

## 常见报错处理

如果你之前下载过旧版本，又直接把新文件覆盖进去，可能会出现 `downloads has already been declared` 或 `Unexpected const`。这通常是旧版 `src/App.jsx` 没有被完整替换，残留了重复 import 或旧的首页代码。

处理方式：

1. 确认 `src/App.jsx` 顶部不要再从 `./content.js` 导入 `downloads / getPostBySlug / posts`；这些内容导入已经拆到 `src/pages/` 里的页面文件。
2. 确认首页逻辑在 `src/pages/HomePage.jsx`，文章页 / 下载页 / 关于页也在 `src/pages/`，不要再把这些页面代码粘回 `src/App.jsx`。
3. 最稳妥的做法是删除旧项目目录，重新解压 / clone 最新代码后再运行 `npm install && npm run dev`。

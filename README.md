# 岛屿个人博客（React + Vite + Markdown）

一个动物森友会 / Animal Crossing 风格的个人静态博客模板，包含首页、文章页、下载页和关于页。首页还包含实时岛屿时间、季节提示、捡贝壳和岛民灵感等互动。

## 项目结构

```text
.
├── public/
│   ├── downloads/        # 下载资源文件
│   └── music/            # 背景音乐文件，后续把歌曲放这里
├── src/
│   ├── assets/cursor/   # animal-island-ui 光标 SVG
│   ├── components/
│   │   └── Typewriter.jsx # animal-island-ui 风格打字机组件
│   ├── content/
│   │   ├── posts/        # 文章 Markdown
│   │   └── downloads/    # 下载页 Markdown
│   ├── App.jsx           # 页面路由、音乐、动态倾斜绑定
│   ├── pages/HomePage.jsx # 首页时间、季节和互动卡片
│   ├── lib/island.js     # 季节和岛民提示数据
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

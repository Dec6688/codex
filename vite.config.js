import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages 项目页通常是 https://用户名.github.io/仓库名/
// 部署前把仓库名改成你的 GitHub 仓库名；自定义域名可改为 '/'。
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/animal-crossing-markdown-blog/',
});

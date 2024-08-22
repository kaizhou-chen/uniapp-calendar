import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import path, { resolve } from "path";
import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    uni(),

    // 自定义插件
    githubPlugin()
  ],

  // 打包
  build: {
    // 开发阶段启用源码映射：https://uniapp.dcloud.net.cn/tutorial/migration-to-vue3.html#需主动开启-sourcemap
    sourcemap: process.env.NODE_ENV === 'development',
    rollupOptions: {
      output: {
        // 处理文件名里的特殊符号
        sanitizeFileName,
      }
    }
  },
});

/**
 * 部署到 github 时，覆盖 .gitignore，删除掉里面的 dist 目录。
 * 因为 dist 目录要提交到 gh-pages 分支，以便部署到 Github Pages
 */
function githubPlugin() {
  const gitignore = '# Logs\nlogs\n*.log\nnpm-debug.log*\nyarn-debug.log*\nyarn-error.log*\npnpm-debug.log*\nlerna-debug.log*\n\nnode_modules\n.DS_Store\n*.local'

  return {
    name: 'github-plugin',
    writeBundle() {
      if (process.argv.includes('--deploy')) {
        const file = path.resolve(__dirname, '.gitignore');
        fs.writeFileSync(file, gitignore, 'utf8');
      }
    }
  }
}

const INVALID_CHAR_REGEX = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g;
const DRIVE_LETTER_REGEX = /^[a-z]:/i;

// 解决问题：部署到github后，_plugin-vue_export-helper.js 访问不到
// https://github.com/rollup/rollup/blob/master/src/utils/sanitizeFileName.ts
function sanitizeFileName(name: any) {
  const match = DRIVE_LETTER_REGEX.exec(name);
  const driveLetter = match ? match[0] : "";
  // A `:` is only allowed as part of a windows drive letter (ex: C:\foo)
  // Otherwise, avoid them because they can refer to NTFS alternate data streams.
  return (
    driveLetter +
    name.slice(driveLetter.length).replace(INVALID_CHAR_REGEX, "")
  );
}

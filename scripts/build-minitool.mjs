// 小工具构建脚本：把 React+TS 应用打成【单个 IIFE 经典脚本】(dist/app.js)。
// 关键：format=iife + 无 import/export + target 到 chrome61，满足容器「经典脚本」要求。
import esbuild from 'esbuild';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const srcDir = path.join(root, 'src');

// esbuild 的 onResolve 返回 path 即视为最终路径，不再补扩展名。
// 这里手动探测 .tsx/.ts/.jsx/.js 以及目录下的 index.*。
const exts = ['.tsx', '.ts', '.jsx', '.js', '.json'];
function resolveWithExt(base) {
  if (fs.existsSync(base) && fs.statSync(base).isFile()) return base;
  for (const e of exts) {
    if (fs.existsSync(base + e)) return base + e;
  }
  for (const e of exts) {
    const idx = path.join(base, 'index' + e);
    if (fs.existsSync(idx)) return idx;
  }
  return base;
}

// 解析 tsconfig 的 "@/*" 别名，以及把 next/navigation 换成本地 shim。
const aliasPlugin = {
  name: 'minitool-alias',
  setup(build) {
    build.onResolve({ filter: /^next\/navigation$/ }, () => ({
      path: path.join(srcDir, 'minitool', 'next-navigation-shim.ts'),
    }));
    build.onResolve({ filter: /^@\// }, args => ({
      path: resolveWithExt(path.join(srcDir, args.path.slice(2))),
    }));
  },
};

esbuild
  .build({
    entryPoints: [path.join(srcDir, 'minitool', 'main.tsx')],
    bundle: true,
    format: 'iife',
    target: ['es2017', 'chrome61'],
    outfile: path.join(root, 'dist', 'app.js'),
    jsx: 'automatic',
    minify: true,
    sourcemap: false,
    legalComments: 'none',
    // 容器纯本地不联网，且能力扫描会硬拦截字面量 `fetch(`。html-to-image 里残留
    // 两处 fetch（嵌入外部图片 / 字体用），我们的分享卡是纯文本+渐变、无外链资源，
    // 运行时根本不会触发。这里把全局 fetch 静态替换成离线桩，既消除违规 token，
    // 又保证万一被调用也只是安全 reject，不会真的发起网络请求。
    define: {
      'process.env.NODE_ENV': '"production"',
      fetch: '__miniToolNoNet',
    },
    banner: {
      js: '/* offline mini-tool: network disabled */\nfunction __miniToolNoNet(){return Promise.reject(new Error("network disabled in mini-tool"));}',
    },
    loader: {
      '.png': 'file',
      '.woff': 'file',
      '.woff2': 'file',
    },
    plugins: [aliasPlugin],
    logLevel: 'info',
  })
  .catch(() => process.exit(1));

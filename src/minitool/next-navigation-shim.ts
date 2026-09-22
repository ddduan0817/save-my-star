'use client';

// 小工具容器不支持多 HTML 页面 / 真实路由，也禁止 history 跳转离开当前页。
// 这个 shim 用来替换 next/navigation：把 router.push/replace 映射成「切换单页视图」，
// 由 esbuild 的 alias 指向本文件（见构建脚本）。原页面组件无需改动路由调用。

import { useSyncExternalStore } from 'react';

// 单页支持的 4 个视图，对应原来的 4 条 Next 路由。
export type View = 'landing' | 'game' | 'ending' | 'collection';

// path -> view 映射。保留原代码里出现过的所有路径写法。
function pathToView(path: string): View {
  const p = (path || '/').split('?')[0].replace(/\/+$/, '') || '/';
  if (p === '/game') return 'game';
  if (p === '/ending') return 'ending';
  if (p === '/collection') return 'collection';
  return 'landing';
}

let currentView: View = 'landing';
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function setView(next: View) {
  if (next === currentView) return;
  currentView = next;
  // 切换视图时回到顶部，行为对齐原来的整页导航。
  if (typeof window !== 'undefined') {
    window.scrollTo(0, 0);
  }
  emit();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): View {
  return currentView;
}

/** 供 App 视图状态机读取当前视图。 */
export function useCurrentView(): View {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

// next/navigation 的 useRouter 替身：只实现被用到的 push / replace，
// 其余方法保留为无副作用的占位，避免调用报错。
interface RouterShim {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  prefetch: () => void;
}

const router: RouterShim = {
  push: (path: string) => setView(pathToView(path)),
  replace: (path: string) => setView(pathToView(path)),
  back: () => {},
  forward: () => {},
  refresh: () => {},
  prefetch: () => {},
};

export function useRouter(): RouterShim {
  return router;
}

// 保持与 next/navigation 相近的具名导出，防止其他潜在引用解析失败。
export function usePathname(): string {
  const view = useCurrentView();
  return view === 'landing' ? '/' : '/' + view;
}

export function useSearchParams(): URLSearchParams {
  return new URLSearchParams();
}

export function redirect(path: string): void {
  setView(pathToView(path));
}

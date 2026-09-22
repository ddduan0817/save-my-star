'use client';

// 单页视图状态机：用 next-navigation-shim 里的当前视图，渲染原来的 4 个「页面」组件。
// 这些组件内部通过被 alias 过的 useRouter 调用 push/replace，即会切换到对应视图。
// 原来 Next 的 layout 外壳（居中容器 + 背景色）在这里一并复刻。

import HomePage from '@/app/page';
import GamePage from '@/app/game/page';
import EndingPage from '@/app/ending/page';
import CollectionPage from '@/app/collection/page';
import { useCurrentView } from './next-navigation-shim';

export default function App() {
  const view = useCurrentView();

  return (
    <div className="mx-auto max-w-lg min-h-screen">
      {view === 'landing' && <HomePage />}
      {view === 'game' && <GamePage />}
      {view === 'ending' && <EndingPage />}
      {view === 'collection' && <CollectionPage />}
    </div>
  );
}

'use client';

// 小工具单页入口：把 <App/> 挂到 #root。经典脚本、无 top-level await。
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function mount() {
  const el = document.getElementById('root');
  if (!el) return;
  createRoot(el).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}

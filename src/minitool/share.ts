'use client';

// 分享图保存：小工具容器禁止 a[download] / blob 下载 / 剪贴板。
// 优先走 JSBridge（writeTempFile -> saveImageToPhotosAlbum）保存到相册；
// 不在容器内（如 PC 预览）时，返回 'fallback'，由调用方展示图片引导用户长按保存。
// 契约见 skills/minitool-zip-builder/references/jsbridge-api.md。

interface MiniToolBridge {
  writeTempFile?: (opts: { data: string }) => Promise<{ filePath: string }>;
  saveImageToPhotosAlbum?: (opts: { filePath: string }) => Promise<unknown>;
}

function getBridge(): MiniToolBridge | null {
  if (typeof window === 'undefined') return null;
  const xhs = (window as unknown as { xhs?: { miniTool?: MiniToolBridge } }).xhs;
  const mt = xhs && xhs.miniTool;
  if (mt && typeof mt.writeTempFile === 'function' && typeof mt.saveImageToPhotosAlbum === 'function') {
    return mt;
  }
  return null;
}

export type SaveResult = 'saved' | 'fallback' | 'error';

/**
 * 把 data:uri 图片保存到系统相册。
 * - 容器可用：writeTempFile 拿到本地 filePath，再 saveImageToPhotosAlbum。
 * - 容器不可用：返回 'fallback'，调用方负责把 dataUrl 显示出来让用户长按保存。
 * 注意：dataUrl 必须是完整 data:uri（toPng / canvas.toDataURL 的原始返回值），不要截取。
 */
export async function saveImageToAlbum(dataUrl: string): Promise<SaveResult> {
  const bridge = getBridge();
  if (!bridge || !bridge.writeTempFile || !bridge.saveImageToPhotosAlbum) {
    return 'fallback';
  }
  try {
    const { filePath } = await bridge.writeTempFile({ data: dataUrl });
    await bridge.saveImageToPhotosAlbum({ filePath });
    return 'saved';
  } catch (err) {
    console.error('saveImageToAlbum via JSBridge failed:', err);
    return 'error';
  }
}
